/**
 * @file Contact.tsx
 * @description Sovereign V4 Footer.
 */
const Contact = () => {
  return (
    <footer id="contact" className="bg-surface py-[var(--p-16)] border-t border-border">
      <div className="container-sharp grid md:grid-cols-4 gap-[var(--p-12)]">
        <div className="space-y-[var(--p-6)] col-span-2">
          <div className="flex items-center gap-3">
            <img src="/QART_LOGO.png" alt="QART" className="h-[var(--p-6)] w-auto object-contain" />
            <span className="font-serif text-[var(--f-xl)] tracking-[0.2em] font-medium">QART</span>
          </div>
          <p className="text-dim max-w-sm text-[var(--f-sm)] font-light leading-relaxed">
            Redefiniendo el estándar de la gastronomía de autor a través de la 
            precisión tecnológica y la pasión artesana innegociable.
          </p>
          <div className="flex gap-6 pt-2">
             {['Instagram', 'Twitter', 'LinkedIn'].map(s => (
               <a key={s} href="#" className="text-[var(--f-xs)] uppercase font-black tracking-widest text-dim hover:text-primary transition-colors">{s}</a>
             ))}
          </div>
        </div>

        <div className="space-y-[var(--p-4)]">
          <h4>Ubicación</h4>
          <p className="text-dim text-[var(--f-sm)] font-light leading-loose">
            Avenida de la Ribera 4500,<br />
            Puerto Madero, Buenos Aires
          </p>
        </div>

        <div className="space-y-[var(--p-4)]">
          <h4>Reservas</h4>
          <p className="text-dim text-[var(--f-sm)] font-light leading-loose">
            +(54) 11 4455 6677<br />
            reservas@qart.com
          </p>
        </div>
      </div>
      <div className="container-sharp pt-[var(--p-16)] text-center opacity-30">
        <p className="text-[var(--f-xs)] uppercase tracking-[0.4em] font-bold">© 2026 QART GASTRONOMY · AUTHOR PRECISION</p>
      </div>
    </footer>
  );
};

export default Contact;
