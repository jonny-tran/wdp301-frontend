
export default function TestimonialsSection() {
  const testimonials = [
    { name: "Julian Wong", role: "Food Blogger", text: "Truly the best chicken in town. The crispiness is unmatched and the new app makes ordering so easy!" },
    { name: "Maria Garcia", role: "Loyal Customer", text: "I've been coming here for years, but the new sage theme and updated menu are just fantastic." },
    { name: "Kevin Smith", role: "Chef", text: "As a professional, I appreciate the consistency in flavor. VFC is my go-to for late-night cravings." },
    { name: "Linh Tran", role: "Student", text: "Loving the student discounts available through the mobile app. Highly recommended for everyone!" }
  ];

  return (
    <section className="w-full py-24 bg-primary/5 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <span className="text-primary font-bold uppercase text-[10px] tracking-[0.3em] mb-4 block">Happy Customers</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-text-main uppercase">Voices of VFC</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, idx) => (
                <div key={idx} className="bg-white p-8 rounded-3xl border border-black/[0.03] shadow-sm relative group hover:shadow-md transition-shadow">
                    <div className="text-primary text-5xl mb-4 font-serif opacity-30 group-hover:opacity-100 transition-opacity">&ldquo;</div>
                    <p className="text-text-muted text-sm mb-8 leading-relaxed font-sans italic">
                        {t.text}
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-bg-light flex items-center justify-center font-bold text-primary text-xs border border-primary/10">
                            {t.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="text-text-main font-bold text-xs uppercase tracking-wider">{t.name}</h4>
                            <span className="text-primary/60 text-[10px] font-medium uppercase tracking-widest">{t.role}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
