export function Process() {
    return (
        <section id="process" className="py-24 md:py-32 bg-[#131f24]">
            <div className="max-w-4xl mx-auto px-6 md:px-12 mb-20 text-center">
                <h2 className="text-[#c6b198] text-sm tracking-[0.3em] uppercase mb-4">The Experience</h2>
                <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white">How It Works</h3>
            </div>

            {/* CSS sticky stacking - each card sticks at the top as you scroll past it,
                and the next card slides up over it. Pure CSS, zero GSAP, zero crash risk. */}
            <div className="max-w-3xl mx-auto px-6">
                {[
                    {
                        number: '01',
                        title: 'Book Your Session',
                        description: "Choose your session type, date, and let's discuss the vision for your photos.",
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
                ].map((step, i) => (
                    <div
                        key={step.number}
                        className="sticky mb-4 bg-[#1c2e36] text-white p-12 md:p-16 shadow-2xl border border-white/5"
                        style={{
                            top: `${80 + i * 20}px`,
                            zIndex: i + 1,
                        }}
                    >
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
                            <span className="font-serif text-6xl md:text-8xl text-[#c6b198]/30 shrink-0">
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
                {/* Spacer so last card can fully scroll through */}
                <div className="h-[60vh]" />
            </div>
        </section>
    );
}
