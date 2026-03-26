/**
 * @file Contact.tsx
 * @description Symmetric Footer.
 */
const Contact = () => {
  return (
    <footer id="contact" className="bg-surface py-24 border-t border-border">
      <div className="l-container grid md:grid-cols-4 gap-12">
        <div className="space-y-6 col-span-2">
          <div className="flex items-center gap-3">
            <img src="/QART_LOGO.png" alt="QART" className="size-6 object-contain" />
            <span className="font-serif text-xl tracking-widest uppercase">QART</span>
          </div>
          <p className="text-dim max-w-sm text-sm font-light leading-relaxed">
            Redefiniendo el estándar de la gastronomía de autor a través de la 
            precisión tecnológica y la pasión artesana.
          </p>
          <div className="flex gap-4 pt-2">
             {['Instagram', 'Twitter', 'LinkedIn'].map(s => (
               <a key={s} href="#" className="text-[9px] uppercase font-bold tracking-widest text-dim hover:text-primary">{s}</a>
             ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4>Ubicación</h4>
          <p className="text-dim text-xs font-light leading-loose">
            Avenida de la Ribera 4500,<br />
            Puerto Madero, Buenos Aires
          </p>
        </div>

        <div className="space-y-4">
          <h4>Reservas</h4>
          <p className="text-dim text-xs font-light leading-loose">
            +(54) 11 4455 6677<br />
            reservas@qart.com
          </p>
        </div>
      </div>
      <div className="l-container pt-16 text-center opacity-20">
        <p className="text-[9px] uppercase tracking-[0.4em]">© 2026 QART GASTRONOMY · ALL RIGHTS RESERVED</p>
      </div>
    </footer>
  );
};

export default Contact;
