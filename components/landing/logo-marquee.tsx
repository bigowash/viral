type LogoMarqueeProps = {
  title?: string;
  logos?: string[];
  id?: string;
};

const defaultLogos = [
  'Acme Studios',
  'Northwind',
  'Arcade',
  'Glyph',
  'Helix Labs',
  'Orbit',
  'Lumina',
  'Pulse',
  'Vertex',
  'Waveform'
];

export function LogoMarquee({
  title = 'Trusted by brands',
  logos = defaultLogos,
  id
}: LogoMarqueeProps = {}) {
  const repeatedLogos = [...logos, ...logos];

  return (
    <section className="bg-white py-16" id={id}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-text-muted)]">
          {title}
        </h2>
        <div className="relative overflow-hidden">
          <div className="animate-[marquee_28s_linear_infinite] whitespace-nowrap">
            <div className="flex items-center gap-12">
              {repeatedLogos.map((logo, index) => (
                <div
                  key={`${logo}-${index}`}
                  className="flex h-16 min-w-[140px] items-center justify-center rounded-2xl border border-white/70 bg-white/60 px-6 text-base font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)] shadow-[0_18px_42px_-28px_rgba(16,24,40,0.45)] backdrop-blur"
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
