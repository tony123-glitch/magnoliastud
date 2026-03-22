import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia' as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

// We must parse the raw body for the Stripe webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: NodeJS.ReadableStream) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const projectId = session.client_reference_id || session.metadata?.projectId;

      if (projectId) {
        // Update the project's payment status to 'paid'
        const { error: projectError } = await supabaseAdmin
          .from('projects')
          .update({ payment_status: 'paid' })
          .eq('id', projectId);

        if (projectError) throw projectError;

        // Ensure there is a payments record (optional, useful for history)
        await supabaseAdmin
          .from('payments')
          .insert([{
            project_id: projectId,
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent,
            amount: session.amount_total,
            currency: session.currency || 'usd',
            status: 'succeeded',
            paid_at: new Date().toISOString()
          }]);
      }
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}
