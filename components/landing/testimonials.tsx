const testimonials = [
  {
    name: 'Amelia Stone',
    role: 'Head of Growth, Northwind',
    quote:
      'SideShift has unlocked a constant pipeline of creator talent for us. We ship new campaigns in half the time.'
  },
  {
    name: 'Levi Chen',
    role: 'Marketing Lead, Orbit',
    quote:
      'Our first SideShift activation delivered 8.4x ROAS. More importantly, the team handled contracts and payments end-to-end.'
  },
  {
    name: 'Priya Das',
    role: 'Director of Brand, Helix Labs',
    quote:
      'The dashboards are unreal—clear insight into content performance and spend without spreadsheets.'
  },
  {
    name: 'Noah Campbell',
    role: 'Founder, Glyph Collective',
    quote:
      'With SideShift we collaborate with creators globally and stay fully compliant. It feels like our in-house studio.'
  },
  {
    name: 'Zoey Rivers',
    role: 'CMO, Lumina',
    quote:
      'Payments that used to take days now happen automatically. Creators love it and so do we.'
  }
];

const duplicatedTestimonials = [...testimonials, ...testimonials];

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#F0FAFF_0%,#FFFFFF_60%)] py-24"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(224,245,255,0.7),rgba(240,250,255,0.1))]" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-text-muted)]">
            Testimonials
          </span>
          <h2 className="text-3xl font-bold text-[var(--color-text-dark)] sm:text-4xl">
            Loved by modern growth teams
          </h2>
          <p className="max-w-2xl text-base text-[var(--color-text-muted)] sm:text-lg">
            Hear how SideShift powers scaled creator collaborations for growing
            brands and agencies.
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="animate-[testimonial-marquee_45s_linear_infinite] whitespace-nowrap">
            <div className="flex items-stretch gap-8">
              {duplicatedTestimonials.map((testimonial, index) => (
                <article
                  key={`${testimonial.name}-${index}`}
                  className="flex h-full min-w-[320px] max-w-[340px] flex-col gap-6 rounded-3xl border border-white/50 bg-white/30 p-8 text-left text-base text-[var(--color-text-muted)] shadow-[0_30px_70px_-48px_rgba(16,24,40,0.6)] backdrop-blur-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="inline-flex size-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(81,81,81,0.25),rgba(32,32,32,0.65))] text-lg font-semibold text-white shadow-[0_12px_28px_-18px_rgba(16,24,40,0.8)]">
                      {initials(testimonial.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--color-text-dark)]">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-base leading-relaxed text-[var(--color-text-muted)]">
                    “{testimonial.quote}”
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
