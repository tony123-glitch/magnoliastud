import { Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PricingProps } from './Pricing';

export function Footer({ onBookClick }: PricingProps) {
    return (
        <footer className="bg-[#131f24] text-[#c6b198]/60 py-16 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-center text-center md:text-left">
                    {/* Brand & Location */}
                    <div className="flex flex-col space-y-2">
                        <span className="font-serif text-3xl tracking-widest text-[#c6b198]">
                            MAGNOLIA
                        </span>
                        <span className="text-sm tracking-[0.3em] uppercase">Studios</span>
                        <span className="text-sm mt-4 italic font-serif">Hillsboro, IL</span>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col space-y-4 md:items-center">
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs tracking-widest uppercase">
                            <Link to="/portfolio" className="hover:text-[#c6b198] transition-colors">Portfolio</Link>
                            <a href="/#pricing" className="hover:text-[#c6b198] transition-colors">Pricing</a>
                            <a href="/#reviews" className="hover:text-[#c6b198] transition-colors">Reviews</a>
                            <button onClick={() => onBookClick()} className="hover:text-white text-[#c6b198] transition-colors">Book Session</button>
                        </div>
                    </div>

                    {/* Socials & Copyright */}
                    <div className="flex flex-col items-center md:items-end space-y-6">
                        <div className="flex items-center space-x-6">
                            <a href="#" className="hover:text-[#c6b198] transition-colors" aria-label="Facebook">
                                <Facebook size={20} strokeWidth={1.5} />
                            </a>
                        </div>
                        <p className="text-xs tracking-wider opacity-50">
                            © {new Date().getFullYear()} Magnolia Studios. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
