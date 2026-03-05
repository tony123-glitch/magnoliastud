import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    preselectedService?: string;
}

const services = [
    "Senior Session",
    "Newborn Session",
    "Sports Event",
    "Family Session",
    "Special Events",
];

export function BookingModal({ isOpen, onClose, preselectedService }: BookingModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        service: '',
        date: '',
        description: ''
    });

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (preselectedService) {
                setFormData(prev => ({ ...prev, service: preselectedService }));
            }
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, preselectedService]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Construct email subject and body
        const subject = encodeURIComponent(`New Booking Inquiry: ${formData.service} - ${formData.name}`);
        const body = encodeURIComponent(
            `Name: ${formData.name}\n` +
            `Email: ${formData.email}\n` +
            `Requested Service: ${formData.service}\n` +
            `Preferred Date: ${formData.date}\n\n` +
            `Description/Vision:\n${formData.description}\n`
        );

        // Redirect to default email client
        window.location.href = `mailto:toneloc012508@gmail.com?subject=${subject}&body=${body}`;

        // Optional: Close modal after clicking
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#131f24]/80 backdrop-blur-sm">
            {/* Overlay to close */}
            <div
                className="absolute inset-0"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div
                className="relative w-full max-w-2xl bg-[#1c2e36] text-white border border-[#c6b198]/20 shadow-2xl shadow-black/50 overflow-y-auto max-h-[90vh]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-[#c6b198] hover:text-white transition-colors"
                    aria-label="Close booking modal"
                >
                    <X size={24} />
                </button>

                <div className="p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h2 id="modal-title" className="font-serif text-3xl md:text-5xl text-white mb-4">
                            Book a Session
                        </h2>
                        <p className="text-[#c6b198] font-light text-sm md:text-base tracking-wide">
                            Tell us about your vision. We'll be in touch shortly.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name Line */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-xs uppercase tracking-widest text-[#c6b198]/80">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#131f24] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#c6b198]/50 transition-colors"
                                    placeholder="Jane Doe"
                                />
                            </div>

                            {/* Email Line */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-xs uppercase tracking-widest text-[#c6b198]/80">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-[#131f24] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#c6b198]/50 transition-colors"
                                    placeholder="jane@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Service Selection */}
                            <div className="space-y-2">
                                <label htmlFor="service" className="text-xs uppercase tracking-widest text-[#c6b198]/80">Session Type</label>
                                <select
                                    id="service"
                                    required
                                    value={formData.service}
                                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                    className="w-full bg-[#131f24] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#c6b198]/50 transition-colors appearance-none"
                                >
                                    <option value="" disabled className="text-white/40">Select a service</option>
                                    {services.map((service) => (
                                        <option key={service} value={service}>{service}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Selection */}
                            <div className="space-y-2">
                                <label htmlFor="date" className="text-xs uppercase tracking-widest text-[#c6b198]/80">Preferred Date</label>
                                <input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full bg-[#131f24] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#c6b198]/50 transition-colors"
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                        </div>

                        {/* Description Textarea */}
                        <div className="space-y-2">
                            <label htmlFor="description" className="text-xs uppercase tracking-widest text-[#c6b198]/80">Vision & Details</label>
                            <textarea
                                id="description"
                                rows={4}
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-[#131f24] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#c6b198]/50 transition-colors resize-none"
                                placeholder="Tell us a bit about who we're photographing and any specific ideas you have..."
                            />
                        </div>

                        {/* Submit */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full py-4 bg-[#c6b198] text-[#131f24] text-sm tracking-widest uppercase font-medium hover:bg-white transition-colors flex justify-center items-center"
                            >
                                Send Inquiry via Email
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}
