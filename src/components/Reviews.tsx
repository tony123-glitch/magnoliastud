import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Reviews() {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                textRef.current,
                { opacity: 0, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 60%',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="reviews" className="py-32 md:py-48 bg-[#131f24] relative overflow-hidden">
            {/* Background Graphic Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full border border-[#c6b198]/5 opacity-50 z-0" />

            <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 text-center">
                <div ref={textRef} className="flex flex-col items-center">
                    <div className="flex space-x-2 text-[#c6b198] mb-12">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="text-xl md:text-2xl">★</span>
                        ))}
                    </div>

                    <h3 className="font-serif text-3xl md:text-5xl lg:text-5xl text-white leading-tight mb-8 italic">
                        "{/* Artistry and professionalism combined! */}
                        I've worked with Alysia for both professional headshots and family photos, and she nailed it every time! She's incredibly talented, easy to work with, and knows how to make everyone feel comfortable in front of the camera. Highly recommend!"
                    </h3>

                    <div className="flex flex-col items-center">
                        <span className="text-[#c6b198] text-sm tracking-[0.2em] uppercase font-medium">Jen</span>
                        <span className="text-white/40 text-xs tracking-widest uppercase mt-2">Thu 16 Oct 2025</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
