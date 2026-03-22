import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

export function Navbar({ onBookClick }: { onBookClick: () => void }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Portfolio', href: '/portfolio', isLink: true },
        { name: 'Pricing', href: '/#pricing', isLink: false },
        { name: 'Reviews', href: '/#reviews', isLink: false },
        { name: 'Client Portal', href: '/portal', isLink: true },
    ];

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-12 py-4',
                isScrolled ? 'bg-background/90 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex flex-col items-center group">
                    <span className="font-serif text-2xl tracking-widest text-[#c6b198] group-hover:text-white transition-colors">
                        MAGNOLIA
                    </span>
                    <span className="text-[10px] tracking-[0.3em] text-[#c6b198]/70 uppercase">
                        Studios
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-12">
                    {navLinks.map((link) => (
                        link.isLink ? (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="text-sm tracking-widest uppercase text-[#c6b198]/80 hover:text-white transition-colors"
                            >
                                {link.name}
                            </Link>
                        ) : (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm tracking-widest uppercase text-[#c6b198]/80 hover:text-white transition-colors"
                            >
                                {link.name}
                            </a>
                        )
                    ))}
                    <button
                        onClick={onBookClick}
                        className="px-6 py-2.5 border border-[#c6b198]/30 text-[#c6b198] text-sm tracking-widest uppercase hover:bg-[#c6b198] hover:text-[#131f24] transition-all duration-300"
                    >
                        Book Session
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-[#c6b198] p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={cn(
                    'md:hidden absolute top-full left-0 right-0 bg-[#131f24] border-b border-white/10 transition-all duration-300 overflow-hidden',
                    mobileMenuOpen ? 'max-h-[400px] opacity-100 py-6' : 'max-h-0 opacity-0 py-0'
                )}
            >
                <div className="flex flex-col items-center space-y-6">
                    {navLinks.map((link) => (
                        link.isLink ? (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm tracking-widest uppercase text-[#c6b198]/80 hover:text-[#c6b198]"
                            >
                                {link.name}
                            </Link>
                        ) : (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm tracking-widest uppercase text-[#c6b198]/80 hover:text-[#c6b198]"
                            >
                                {link.name}
                            </a>
                        )
                    ))}
                    <button
                        onClick={() => {
                            setMobileMenuOpen(false);
                            onBookClick();
                        }}
                        className="px-8 py-3 border border-[#c6b198]/30 text-[#c6b198] text-sm tracking-widest uppercase w-[200px] text-center"
                    >
                        Book Session
                    </button>
                </div>
            </div>
        </nav>
    );
}
