import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        number: '01',
        title: 'Book Your Session',
        description: 'Choose your session type, date, and let’s discuss the vision for your photos.',
    },
    {
        number: '02',
        title: 'Capture Your Moments',
        description: 'A relaxed, guided, and fun photography experience where you can just be yourself.',
    },
    {
        number: '03',
        title: 'Receive Your Memories',
        description: 'Beautifully edited, high-resolution photos delivered digitally to cherish forever.',
    },
];

export function Process() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Scroll Stacking effect
            cardsRef.current.forEach((card) => {
                if (!card) return;

                gsap.to(card, {
                    // Current cards scale down and fade slightly as the new card (which is on top) slides over
                    scale: 1 - 0.05,
                    opacity: 0.5,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 20%',       // Pin the card when it reaches near the top of the viewport
                        end: 'top -100%',       // Keep it pinned for a long distance
                        pin: true,
                        pinSpacing: false,      // Allow the next card to scroll up and cover this one
                        scrub: true,
                    },
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="process" className="py-24 md:py-32 bg-[#131f24] min-h-[250vh]">
            <div className="max-w-4xl mx-auto px-6 md:px-12 header-container mb-12 text-center">
                <h2 className="text-[#c6b198] text-sm tracking-[0.3em] uppercase mb-4">The Experience</h2>
                <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white">How It Works</h3>
            </div>

            <div className="max-w-3xl mx-auto px-6 relative mt-24">
                {steps.map((step, i) => (
                    <div
                        key={step.number}
                        ref={(el) => { cardsRef.current[i] = el; }}
                        className="w-full bg-[#1c2e36] text-white p-12 md:p-16 mb-4 shadow-2xl border border-white/5 relative z-10"
                        style={{
                            zIndex: i,
                        }}
                    >
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
                            <span className="font-serif text-6xl md:text-8xl text-[#c6b198]/30">
                                {step.number}
                            </span>
                            <div>
                                <h4 className="font-serif text-3xl md:text-4xl mb-4 text-[#c6b198]">
                                    {step.title}
                                </h4>
                                <p className="text-white/70 text-lg leading-relaxed max-w-md font-light">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
