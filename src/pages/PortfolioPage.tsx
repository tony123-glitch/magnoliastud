import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const portfolioCollection = [
    { id: 1, url: '/portfolio_img/senior_pics/seniorflowers.jpg', category: 'Seniors', span: 'col-span-1 md:col-span-1 row-span-2', position: 'object-top' },
    { id: 2, url: '/portfolio_img/scenic/bandscene.jpg', category: 'Events', span: 'col-span-1 md:col-span-2 row-span-1', position: 'object-center' },
    { id: 3, url: '/portfolio_img/professional/proshot.jpg', category: 'Professional', span: 'col-span-1 md:col-span-1 row-span-2', position: 'object-top' },
    { id: 4, url: '/portfolio_img/newborn/newborn2.jpg', category: 'Newborn', span: 'col-span-1 md:col-span-1 row-span-1', position: 'object-center' },
    { id: 5, url: '/portfolio_img/sports/carsonsenior.jpg', category: 'Sports', span: 'col-span-1 md:col-span-1 row-span-2', position: 'object-top' },
    { id: 6, url: '/portfolio_img/scenic/charcuterie.jpg', category: 'Events', span: 'col-span-1 md:col-span-1 row-span-1', position: 'object-center' },
    { id: 7, url: '/portfolio_img/family_pics/familysnow.jpg', category: 'Family', span: 'col-span-1 md:col-span-2 row-span-2', position: 'object-[75%_center]' },
    { id: 8, url: '/portfolio_img/senior_pics/seniorphoto.jpg', category: 'Seniors', span: 'col-span-1 md:col-span-1 row-span-1', position: 'object-top' },
    { id: 9, url: '/portfolio_img/sports/nightsky.jpg', category: 'Sports', span: 'col-span-1 md:col-span-1 row-span-2', position: 'object-center' },
    { id: 10, url: '/portfolio_img/professional/professional.jpg', category: 'Professional', span: 'col-span-1 md:col-span-1 row-span-1', position: 'object-top' },
    { id: 11, url: '/portfolio_img/sports/reedaction.jpg', category: 'Sports', span: 'col-span-1 md:col-span-2 row-span-2', position: 'object-top' },
    { id: 12, url: '/portfolio_img/family_pics/kidrunning.jpg', category: 'Lifestyle', span: 'col-span-1 md:col-span-1 row-span-1', position: 'object-[center_10%]' },
    { id: 13, url: '/portfolio_img/scenic/drinkscene.jpg', category: 'Events', span: 'col-span-1 md:col-span-1 row-span-1', position: 'object-center' },
    { id: 14, url: '/portfolio_img/sports/tuff.jpg', category: 'Sports', span: 'col-span-1 md:col-span-2 row-span-1', position: 'object-[center_10%]' },
    { id: 15, url: '/portfolio_img/senior_pics/seniorphotoflower.jpg', category: 'Seniors', span: 'col-span-1 md:col-span-1 row-span-2', position: 'object-top' },
    { id: 16, url: '/portfolio_img/professional/pro.jpg', category: 'Professional', span: 'col-span-1 md:col-span-1 row-span-1', position: 'object-top' },
    { id: 17, url: '/portfolio_img/scenic/christmastreescene.jpg', category: 'Lifestyle', span: 'col-span-1 md:col-span-2 row-span-2', position: 'object-center' },
    { id: 18, url: '/portfolio_img/sports/football.jpg', category: 'Sports', span: 'col-span-1 md:col-span-1 row-span-1', position: 'object-[center_10%]' },
    { id: 19, url: '/portfolio_img/scenic/speaker.jpg', category: 'Events', span: 'col-span-1 md:col-span-1 row-span-1', position: 'object-center' },
    { id: 20, url: '/portfolio_img/sports/actionsport.jpg', category: 'Sports', span: 'col-span-1 md:col-span-1 row-span-1', position: 'object-top' },
];
interface PortfolioProps {
    onBookClick: (service?: string) => void;
}

export function PortfolioPage({ onBookClick }: PortfolioProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<(HTMLDivElement | null)[]>([]);

    useLayoutEffect(() => {
        // Immediately snap to top of page before GSAP renders the DOM
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        // Force GSAP to recalculate positions shortly after mount
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header animation
            gsap.fromTo(
                '.portfolio-header-text',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'power3.out' }
            );

            // Images animation
            imagesRef.current.forEach((img, i) => {
                if (!img) return;
                gsap.fromTo(
                    img,
                    { y: 60, opacity: 0, scale: 0.95 },
                    {
                        y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
                        scrollTrigger: {
                            trigger: img,
                            start: 'top 85%',
                        },
                        delay: (i % 4) * 0.1
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-[#131f24] min-h-screen pt-32 pb-24 md:pb-32">

            {/* Header Section */}
            <div ref={headerRef} className="max-w-7xl mx-auto px-6 md:px-12 mb-20 md:mb-32 text-center md:text-left">
                <p className="portfolio-header-text text-[#c6b198] text-sm tracking-[0.3em] uppercase mb-4">
                    The Archive
                </p>
                <h1 className="portfolio-header-text font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-8">
                    The Magnolia <br />
                    <span className="italic font-light text-[#c6b198]">Collection.</span>
                </h1>
                <p className="portfolio-header-text text-white/60 font-light leading-relaxed max-w-2xl text-lg md:text-xl">
                    Explore our curated gallery of moments, capturing the essence of life's most beautiful stories across standard sessions, special events, and professional highlights.
                </p>
            </div>

            {/* Masonry Grid */}
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row-dense gap-2 md:gap-4 auto-rows-[200px] md:auto-rows-[300px]">
                    {portfolioCollection.map((img, i) => (
                        <div
                            key={img.id}
                            ref={(el) => { imagesRef.current[i] = el; }}
                            className={`relative overflow-hidden group cursor-pointer ${img.span}`}
                        >
                            <div className="absolute inset-0 bg-[#131f24]/30 group-hover:bg-[#131f24]/0 transition-colors duration-700 z-10" />
                            <img
                                src={img.url}
                                alt={`Portfolio piece ${img.category}`}
                                className={`w-full h-full object-cover transform duration-[2s] ease-out group-hover:scale-105 ${img.position}`}
                            />
                            {/* Hover Details */}
                            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 bg-gradient-to-t from-[#131f24]/90 via-[#131f24]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <span className="font-serif italic text-white text-3xl drop-shadow-lg mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    {img.category}
                                </span>
                                <div className="w-12 h-[1px] bg-[#c6b198] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-4xl mx-auto px-6 mt-32 text-center">
                <h2 className="font-serif text-4xl md:text-5xl text-white mb-8">Ready to tell your story?</h2>
                <button
                    onClick={() => onBookClick()}
                    className="inline-block px-10 py-4 bg-[#c6b198] text-[#131f24] text-sm tracking-widest uppercase font-medium hover:bg-white transition-colors cursor-pointer"
                >
                    Savor the moment
                </button>
            </div>

        </div>
    );
}
