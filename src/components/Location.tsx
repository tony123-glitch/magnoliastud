import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Location() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                contentRef.current,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="location" className="py-24 bg-[#1c2e36] text-white border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div ref={contentRef} className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24">

                    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="w-16 h-16 rounded-full bg-[#131f24] border border-[#c6b198]/20 flex items-center justify-center mb-8">
                            <MapPin className="text-[#c6b198] w-6 h-6" />
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl text-[#c6b198] mb-4">
                            Magnolia Studios
                        </h2>
                        <p className="text-xl font-light text-white mb-2">106 W Seward St</p>
                        <p className="text-xl font-light text-white mb-8">Hillsboro, Illinois</p>
                        <div className="inline-block border border-[#c6b198]/30 px-6 py-2">
                            <p className="text-[#c6b198] text-sm tracking-widest uppercase">
                                Serving Hillsboro & Surrounding Communities
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 aspect-video bg-[#131f24] relative overflow-hidden group border border-white/5">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#131f24] to-transparent z-10 mix-blend-multiply opacity-80" />
                        <img
                            src="https://images.unsplash.com/photo-1524813686514-a57563d77965?q=80&w=1200&auto=format&fit=crop"
                            alt="Hillsboro Illinois Architecture"
                            className="w-full h-full object-cover grayscale opacity-60 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                        />
                        <div className="absolute bottom-6 left-6 z-20">
                            <span className="font-serif italic text-2xl text-white">Our Studio Home</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
