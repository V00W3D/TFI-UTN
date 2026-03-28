/**
 * @file Contact.tsx
 * @description Footer con alta densidad de color. Sin colores hardcodeados —
 * todo extrae de las variables CSS del tema activo.
 */
const Contact = () => {
  return (
    <footer id="contact" className="bg-qart-bg pt-32 pb-16 border-t-8 border-qart-border">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 lg:gap-24">
        {/* BRAND */}
        <div className="md:col-span-2 space-y-8">
          <div className="flex items-center gap-4 group cursor-pointer border-l-8 border-qart-accent pl-6">
            <span className="text-5xl font-display text-qart-primary tracking-tighter uppercase font-black">
              QART.
            </span>
          </div>
          <p className="text-qart-text-muted text-lg font-bold uppercase tracking-tighter leading-tight max-w-md">
            Arquitectura gastronómica. Diseñamos platos brutales para paladares exigentes. Sin
            relleno, solo sabor.
          </p>
          <div className="flex gap-4 pt-4">
            {['Instagram', 'TikTok', 'Twitter'].map((s) => (
              <a
                key={s}
                href="#"
                className="w-14 h-14 border-4 border-qart-border flex items-center justify-center text-sm font-black transition-all duration-200"
                style={{
                  background: 'var(--qart-surface)',
                  color: 'var(--qart-text)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'var(--qart-accent)';
                  el.style.color = 'var(--qart-text-on-accent)';
                  el.style.borderColor = 'var(--qart-accent)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'var(--qart-surface)';
                  el.style.color = 'var(--qart-text)';
                  el.style.borderColor = 'var(--qart-border)';
                }}
              >
                {s[0]}
              </a>
            ))}
          </div>
        </div>

        {/* UBICACIÓN */}
        <div className="space-y-8">
          <h4 className="text-xs font-black text-qart-primary uppercase tracking-[0.3em]">
            Ubicación
          </h4>
          <p className="text-qart-text-muted text-base font-bold uppercase tracking-tight leading-loose">
            Av. de la Ribera 4500
            <br />
            Puerto Madero, CABA
            <br />
            ARG_Z8300
          </p>
        </div>

        {/* HORARIOS */}
        <div className="space-y-8">
          <h4 className="text-xs font-black text-qart-primary uppercase tracking-[0.3em]">
            Operación
          </h4>
          <div className="text-qart-text-muted text-base font-bold uppercase tracking-tight leading-loose">
            <p>L - J: 12:00 — 23:00</p>
            <p>V - D: 12:00 — 00:00</p>
            {/* Badge de estado — accent con texto-on-accent */}
            <div
              className="mt-4 px-3 py-1 font-black inline-block"
              style={{ background: 'var(--qart-accent)', color: 'var(--qart-text-on-accent)' }}
            >
              ABIERTOS
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="max-w-7xl mx-auto px-6 mt-24 pt-12 border-t-2 border-qart-border flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-black text-qart-text-muted uppercase tracking-widest">
          © MMXXVI QART_SYS. All rights reserved.
        </p>
        <div className="flex gap-10">
          {['Términos', 'Privacidad'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[10px] font-black text-qart-text-muted hover:text-qart-accent uppercase tracking-widest transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Contact;
