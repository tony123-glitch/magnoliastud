import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Parallax image
            gsap.to('.about-img', {
                yPercent: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: imageRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            // Text reveal
            gsap.fromTo(
                '.about-text',
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: textRef.current,
                        start: 'top 80%',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="about" className="py-24 md:py-32 bg-[#131f24] text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16 md:gap-24">

                {/* Photographer Image */}
                <div ref={imageRef} className="w-full md:w-5/12 aspect-[3/4] overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[#c6b198]/20 z-10 mix-blend-overlay group-hover:bg-transparent transition-colors duration-1000" />
                    <img
                        src="/alysia/alysi.jpg"
                        alt="Alysia Seeley - Photographer"
                        className="about-img w-full h-[115%] object-cover object-[left_top] -top-[7.5%] relative"
                    />
                </div>

                {/* Story Text */}
                <div ref={textRef} className="w-full md:w-7/12 flex flex-col">
                    <span className="about-text text-[#c6b198] text-sm tracking-[0.3em] uppercase mb-8 block">
                        The Artist Behind the Lens
                    </span>
                    <h2 className="about-text font-serif text-5xl md:text-6xl lg:text-7xl mb-12">
                        Meet Alysia Seeley
                    </h2>
                    <div className="about-text relative pl-8 md:pl-12 border-l border-[#c6b198]/30 mb-8">
                        <span className="absolute -left-3 -top-4 font-serif text-[80px] text-[#c6b198]/20 leading-none">"</span>
                        <p className="font-serif italic text-2xl md:text-3xl text-white/90 leading-relaxed relative z-10">
                            My hope is to pause that feeling you get when your loved one smiles or when you see the twinkle in a child's eye, so you can experience it again and again.
                        </p>
                    </div>
                    <p className="about-text text-white/60 font-light leading-relaxed max-w-lg mb-12">
                        Photography is more than just taking pictures; it's about holding onto the fleeting moments that define our lives. At Magnolia Studios, we create an environment where you can truly be yourself, allowing those genuine memories to be captured forever.
                    </p>
                    <div className="about-text">
                        <img
                            src="/alysia/alysia_chatgpt_signature.png"
                            alt="Alysia Signature"
                            className="h-48 md:h-64 object-contain opacity-90 mix-blend-screen filter invert"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
