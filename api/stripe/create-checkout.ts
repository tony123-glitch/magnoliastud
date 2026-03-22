import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia' as any, // latest or compatible type
});

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'Missing projectId' });
    }

    // Fetch the project details to get amount
    // In a real app, you might have different packages/amounts.
    // For this example, let's assume a fixed amount or fetch from project if it were populated.
    // However, the prompt mentions `total_amount` is on projects table. If it's null, we default to a standard session fee, e.g., $250.
    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('*, clients(*)')
      .eq('id', projectId)
      .single();

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const amount = project.total_amount || 25000; // Default $250.00 if not set

    // Create Checkout Session
    // We pass the projectId in the client_reference_id and metadata so the webhook can identify it
    // The success/cancel origin comes from headers
    const origin = req.headers.origin || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Photography Session - ${project.session_type}`,
              description: `Client: ${project.clients.full_name}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/portal/dashboard?success=true`,
      cancel_url: `${origin}/portal/dashboard?canceled=true`,
      client_reference_id: projectId,
      metadata: {
        projectId: projectId,
      },
      customer_email: project.clients.email,
    });

    res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
