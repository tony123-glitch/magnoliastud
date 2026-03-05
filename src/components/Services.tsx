import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        title: 'Senior Session',
        price: 'From $150',
        description: "Customize your senior session to YOU! Outfit changes, locations, and creativity to match your personality! Each session is custom and curated to reflect your interests! No idea is too big, let's shoot for the stars!",
        image: '/portfolio_img/senior_pics/seniorflowers.jpg',
    },
    {
        title: 'Newborn Session',
        price: 'From $75',
        description: 'The newborn stage goes by in a blink and the tiniest of fingers and toes become only a memory. Let me help you capture those precious features you waited so patiently to see. Posed, studio, or in your home.',
        image: '/portfolio_img/family_pics/kidssnow.jpg',
    },
    {
        title: 'Sports Event',
        price: 'From $75',
        description: "Sports photography is MY FAVORITE genre as it is truly the art of storytelling. The opportunity to capture an athlete's grit and determination through moments of hardship and triumph is truly an honor.",
        image: '/portfolio_img/sports/tuff.jpg',
    },
    {
        title: 'Family Session',
        price: 'From $150',
        description: 'My goal is to capture the feelings that tell the love story of you and your family. I focus on the art of observation; capturing the feelings of a natural giggle, hug, and loving look.',
        image: '/portfolio_img/family_pics/familysnow.jpg',
    },
    {
        title: 'Special Events',
        price: 'From $150',
        description: "Christmas Party, Theatre Production, Concert, Girls Night Out.......PICS or IT DIDN'T HAPPEN! Enjoy your event while I make sure you walk away with instagram-worthy pics to share!",
        image: '/portfolio_img/scenic/drinkscene.jpg',
    },
];
interface ServicesProps {
    onBookClick: (service?: string) => void;
}

export function Services({ onBookClick }: ServicesProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Animation
            gsap.fromTo(
                '.service-header',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.service-header',
                        start: 'top 80%',
                    },
                }
            );

            // Cards Stagger Animation
            cardsRef.current.forEach((card) => {
                if (!card) return;
                gsap.fromTo(
                    card,
                    { y: 100, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                        },
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="services" className="py-24 md:py-32 bg-[#131f24] text-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="service-header mb-20 md:mb-32 text-center max-w-3xl mx-auto">
                    <h2 className="text-[#c6b198] text-sm tracking-[0.3em] uppercase mb-6">Session Types</h2>
                    <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight">
                        Curated Experiences for Every Season of Life.
                    </h3>
                </div>

                <div className="flex flex-col gap-24">
                    {services.map((service, index) => (
                        <div
                            key={service.title}
                            ref={(el) => { cardsRef.current[index] = el; }}
                            className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center`}
                        >
                            {/* Image Container */}
                            <div className="w-full lg:w-1/2 overflow-hidden aspect-[4/5] relative group">
                                <div className="absolute inset-0 bg-[#c6b198]/10 group-hover:bg-transparent transition-colors duration-700 z-10 mix-blend-overlay" />
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                            </div>

                            {/* Text Content */}
                            <div className="w-full lg:w-1/2 flex flex-col items-start max-w-lg">
                                <span className="text-[#c6b198] font-serif italic text-2xl mb-4">
                                    0{index + 1}
                                </span>
                                <h4 className="font-serif text-4xl md:text-5xl mb-6">
                                    {service.title}
                                </h4>
                                <p className="text-white/70 font-light leading-relaxed mb-8 text-lg">
                                    {service.description}
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12 w-full">
                                    <span className="text-sm tracking-widest uppercase text-[#c6b198] border-b border-[#c6b198]/30 pb-1">
                                        {service.price}
                                    </span>
                                    <button
                                        onClick={() => onBookClick(service.title)}
                                        className="inline-flex items-center text-sm tracking-widest uppercase hover:text-[#c6b198] transition-colors group cursor-pointer"
                                    >
                                        Inquire Now
                                        <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
