import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Hero({ onBookClick }: { onBookClick: (s?: string) => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const flashRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const scope = containerRef.current;
        if (!scope) return;

        const ctx = gsap.context(() => {
            // Initial reveal animation
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.fromTo(
                overlayRef.current,
                { opacity: 1 },
                { opacity: 0.4, duration: 2, ease: 'power2.inOut' }
            )
                .fromTo(
                    '.hero-text-line',
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.2, stagger: 0.2 },
                    '-=1.5'
                )
                .fromTo(
                    '.hero-btn',
                    { opacity: 0, scale: 0.95 },
                    { opacity: 1, scale: 1, duration: 1 },
                    '-=0.8'
                );

            // Camera Spin and Flash Effect on Scroll
            const scrollTl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                    pin: true,
                }
            });

            scrollTl
                .to('.hero-bg', {
                    scale: 2.2,
                    rotationZ: 15,
                    transformOrigin: '50% 50%',
                    filter: 'blur(4px)',
                    ease: 'power2.inOut',
                    duration: 1
                }, 0)
                .to(flashRef.current, {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.in'
                }, 0.7)
                .to(flashRef.current, {
                    opacity: 0,
                    duration: 1.5,
                    ease: 'power2.out'
                }, 1.2);

        }, scope);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <section ref={containerRef} className="relative h-[100dvh] w-full overflow-hidden bg-[#131f24] flex items-end">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src="/portfolio_img/scenic/bandscene.jpg"
                    alt="Live Band Event Photography"
                    className="hero-bg w-full h-full object-cover object-center"
                />
                
                {/* Secret Admin Link over the Blue Light */}
                {/* The blue light is roughly top-left. Positioning this absolutely over the image. */}
                <a 
                    href="/admin/login" 
                    className="absolute z-50 top-[2%] left-[2%] w-[20%] h-[30%] md:top-[5%] md:left-[5%] md:w-[10%] md:h-[20%] cursor-pointer opacity-0"
                    title="Secret Entrance"
                    aria-label="Admin Login"
                ></a>

                {/* Cinematic Gradient Overlay */}
                <div
                    ref={overlayRef}
                    className="absolute inset-0 bg-gradient-to-t from-[#131f24] via-[#131f24]/50 to-[#131f24]/20 z-10 pointer-events-none"
                />
            </div>

            {/* Content Container positioned bottom-left third */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 pb-24 md:pb-32 flex flex-col items-start justify-end h-full">
                <div ref={textRef} className="max-w-2xl">
                    <p className="hero-text-line text-[#c6b198]/80 uppercase tracking-[0.4em] text-xs md:text-sm font-medium mb-4 md:mb-6 pl-1">
                        Magnolia Studios
                    </p>

                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-8 md:mb-12">
                        <span className="hero-text-line block">Capturing</span>
                        <span className="hero-text-line block italic text-[#c6b198] font-light">Moments That</span>
                        <span className="hero-text-line block">Matter.</span>
                    </h1>

                    <div className="hero-btn">
                        <button
                            onClick={() => onBookClick()}
                            className="group relative px-8 py-4 bg-[#c6b198] text-[#131f24] text-sm tracking-widest uppercase font-medium overflow-hidden inline-flex items-center justify-center transition-all hover:bg-white"
                        >
                            <span className="relative z-10">Book a Session</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Flash Overlay */}
            <div ref={flashRef} className="fixed inset-0 bg-white z-[100] pointer-events-none opacity-0" />
        </section>
    );
}
