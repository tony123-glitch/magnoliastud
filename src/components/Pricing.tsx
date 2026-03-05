import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const packages = [
    {
        name: "Senior Session",
        price: "$150",
        description: "Customize your senior session to YOU! Outfit changes, locations, and creativity to match your personality! Each session is custom and curated to reflect your interests! No idea is too big, let's shoot for the stars!"
    },
    {
        name: "Newborn Session",
        price: "$75",
        description: "The newborn stage goes by in a blink and they tiniest of fingers and toes become only a memory. Let me help you capture those precious newborn features you waited so patiently to see. Whether you prefer posed, studio, or in your home...I would be honored to be a part of helping you remember those first few weeks of the journey into parenthood."
    },
    {
        name: "Sports Event",
        price: "$75",
        description: "Sports photography is MY FAVORITE genres as it is truly the art of storytelling. The opportunity to capture an athlete's grit and determination through moments of hardship and triumph is truly an honor. Not to mention, any athlete knows that social media is the key in building your brand, depicting yourself, and crafting your narrative. Let me tell your athlete and/or team's story!",
        featured: true,
    },
    {
        name: "Family Session",
        price: "$150",
        description: "My goal is to capture the feelings that tell the love story of you and your family. I use less \"line up here\" and focus more on the art of observation; capturing the feelings of a natural giggle, hug, and loving look. I skillfully use play, prompts and creativity to photography what makes you, YOU!"
    },
    {
        name: "Special Events",
        price: "$150",
        description: "Christmas Party, Theatre Production, Concert, Girls Night Out.......PICS or IT DIDN'T HAPPEN! Enjoy your event while I make sure you walk away with instagram-worthy pics to share!"
    }
];

export interface PricingProps {
    onBookClick: (service?: string) => void;
}

export function Pricing({ onBookClick }: PricingProps) {
    const [showAll, setShowAll] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                cardsRef.current.slice(0, 3), // Only animate the first 3 initially
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
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

    // Recalculate ScrollTrigger markers if the DOM expands downward
    useEffect(() => {
        if (showAll) {
            ScrollTrigger.refresh();
        }
    }, [showAll]);

    const renderCard = (pkg: typeof packages[0], index: number) => (
        <div
            key={pkg.name}
            ref={(el) => { cardsRef.current[index] = el; }}
            className={`p-10 flex flex-col items-center text-center border transition-all duration-500 hover:-translate-y-2 h-full
                ${pkg.featured
                    ? 'border-[#c6b198]/50 bg-[#c6b198]/5 shadow-2xl shadow-[#c6b198]/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
        >
            <h4 className="font-serif text-3xl text-white mb-2">{pkg.name}</h4>
            <span className="text-4xl text-[#c6b198] font-light font-serif mb-8 block pb-8 border-b border-white/10 w-full relative">
                {pkg.price}
                <span className="text-sm text-white/50 tracking-widest uppercase ml-2 block mt-2">Starting At</span>
            </span>

            <p className="text-white/70 font-light leading-relaxed mb-12 flex-grow">
                {pkg.description}
            </p>

            <button
                onClick={() => onBookClick(pkg.name)}
                className={`w-full py-4 uppercase tracking-widest text-sm transition-colors text-center cursor-pointer mt-auto
                  ${pkg.featured
                        ? 'bg-[#c6b198] text-[#131f24] hover:bg-white'
                        : 'border border-[#c6b198]/50 text-[#c6b198] hover:bg-[#c6b198]/10'
                    }`}
            >
                Book Package
            </button>
        </div>
    );

    return (
        <section ref={sectionRef} id="pricing" className="py-24 md:py-32 bg-[#131f24] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="text-center mb-20 md:mb-24">
                    <h2 className="text-[#c6b198] text-sm tracking-[0.3em] uppercase mb-4">Investment</h2>
                    <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white">Session Packages</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
                    {packages.slice(0, 3).map((pkg, i) => renderCard(pkg, i))}
                </div>

                {showAll && (
                    <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-top-8 duration-700">
                        {packages.slice(3, 5).map((pkg, i) => (
                            <div key={pkg.name} className="w-full md:w-1/2">
                                {renderCard(pkg, i + 3)}
                            </div>
                        ))}
                    </div>
                )}

                {!showAll && (
                    <div className="mt-20 text-center">
                        <button
                            onClick={() => setShowAll(true)}
                            className="text-[#c6b198] bg-transparent text-sm tracking-[0.2em] uppercase border-b border-[#c6b198]/50 pb-1 hover:text-white hover:border-white transition-all cursor-pointer"
                        >
                            View Full Pricing Guide
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
