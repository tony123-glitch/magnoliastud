import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const portfolioImages = [
    {
        id: 1,
        url: '/portfolio_img/sports/tuff.jpg',
        category: 'Sports',
        span: 'row-span-2 col-span-1 md:col-span-2',
        position: 'object-center'
    },
    {
        id: 2,
        url: '/portfolio_img/scenic/bandscene.jpg',
        category: 'Events',
        span: 'col-span-1 md:col-span-2',
        position: 'object-center'
    },
    {
        id: 3,
        url: '/portfolio_img/professional/pro.jpg',
        category: 'Professional',
        span: 'col-span-1 md:col-span-1',
        position: 'object-top'
    },
    {
        id: 4,
        url: '/portfolio_img/scenic/charcuterie.jpg',
        category: 'Events',
        span: 'row-span-2 col-span-1 md:col-span-1',
        position: 'object-center'
    },
    {
        id: 5,
        url: '/portfolio_img/newborn/newborn2.jpg',
        category: 'Newborn',
        span: 'col-span-1 md:col-span-2',
        position: 'object-center'
    },
    {
        id: 6,
        url: '/portfolio_img/sports/reedaction.jpg',
        category: 'Sports',
        span: 'col-span-1 md:col-span-1',
        position: 'object-top'
    },
];

export function Portfolio() {
    const containerRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<(HTMLAnchorElement | null)[]>([]);

    useEffect(() => {
        const scope = containerRef.current;
        if (!scope) return;

        const ctx = gsap.context(() => {
            imagesRef.current.forEach((img, i) => {
                if (!img) return;

                gsap.fromTo(
                    img,
                    {
                        y: 50,
                        opacity: 0,
                        scale: 0.95
                    },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 1.2,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: img,
                            start: 'top 85%',
                        },
                        delay: i * 0.1
                    }
                );
            });
        }, scope);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="portfolio" className="py-24 md:py-32 bg-[#131f24] border-t border-white/5">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">

                <div className="mb-20 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-8 px-4 md:px-8">
                    <div>
                        <h2 className="text-[#c6b198] text-sm tracking-[0.3em] uppercase mb-4">The Gallery</h2>
                        <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white">Moments in Time</h3>
                    </div>
                    <Link
                        to="/portfolio"
                        className="text-xs tracking-[0.2em] uppercase text-[#c6b198] hover:text-white transition-colors border-b border-[#c6b198]/50 hover:border-white pb-1"
                    >
                        View Full Portfolio
                    </Link>
                </div>

                {/* CSS Grid based Masonry */}
                <div className="grid grid-cols-2 md:grid-cols-4 grid-flow-row-dense gap-2 md:gap-4 auto-rows-[250px] md:auto-rows-[300px]">
                    {portfolioImages.map((img, i) => (
                        <Link
                            to="/portfolio"
                            key={img.id}
                            ref={(el) => { imagesRef.current[i] = el; }}
                            className={`relative overflow-hidden group cursor-pointer ${img.span}`}
                        >
                            <div className="absolute inset-0 bg-[#131f24]/30 group-hover:bg-[#131f24]/0 transition-colors duration-700 z-10" />

                            {/* Image */}
                            <img
                                src={img.url}
                                alt={`Portfolio piece ${img.category}`}
                                className={`w-full h-full object-cover transform duration-[2s] ease-out group-hover:scale-105 ${img.position}`}
                            />

                            {/* Category Label */}
                            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 bg-gradient-to-t from-[#131f24]/90 via-[#131f24]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <span className="font-serif italic text-white text-3xl drop-shadow-lg mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    {img.category}
                                </span>
                                <div className="w-12 h-[1px] bg-[#c6b198] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
