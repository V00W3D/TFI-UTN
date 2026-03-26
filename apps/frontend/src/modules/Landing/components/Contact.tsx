/**
 * @file Contact.tsx
 * @description The clean, formal 4-column footer grid.
 */
const Contact = () => {
  return (
    <footer id="contact" className="bg-qart-surface pt-20 pb-10 border-t border-qart-border">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16">
        
        {/* BRAND COLUMN */}
        <div className="sm:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <img src="/QART_LOGO.png" alt="QART" className="h-8 w-auto opacity-90" />
            <span className="font-serif text-2xl tracking-[0.2em] text-qart-primary">QART</span>
          </div>
          <p className="text-qart-text-muted text-sm font-light leading-relaxed max-w-sm">
            Estableciendo un nuevo estándar en la gastronomía de autor mediante la 
            precisión innegociable, el respeto al ingrediente y la pasión humana artesana.
          </p>
          <div className="flex gap-6 pt-2">
             {['Instagram', 'Twitter', 'LinkedIn'].map(s => (
               <a 
                 key={s} 
                 href="#" 
                 className="text-[10px] uppercase font-bold tracking-[0.2em] text-qart-text-muted hover:text-qart-accent transition-colors"
               >
                 {s}
               </a>
             ))}
          </div>
        </div>

        {/* LOCATION */}
        <div className="space-y-6">
          <h4 className="text-xs uppercase font-bold tracking-[0.3em] text-qart-primary">La Casa</h4>
          <p className="text-qart-text-muted text-sm font-light leading-loose">
            Avenida de la Ribera 4500,<br />
            Puerto Madero, CABA<br />
            Argentina
          </p>
        </div>

        {/* CONTACT */}
        <div className="space-y-6">
          <h4 className="text-xs uppercase font-bold tracking-[0.3em] text-qart-primary">Contacto</h4>
          <p className="text-qart-text-muted text-sm font-light leading-loose flex flex-col">
            <a href="tel:+541144556677" className="hover:text-qart-accent transition-colors">+(54) 11 4455 6677</a>
            <a href="mailto:reservas@qart.com" className="hover:text-qart-accent transition-colors">reservas@qart.com</a>
          </p>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-qart-border text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-qart-text-muted opacity-60">
          © 2026 QART GASTRONOMY
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-[10px] uppercase tracking-widest text-qart-text-muted hover:text-qart-primary opacity-60">Legal</a>
          <a href="#" className="text-[10px] uppercase tracking-widest text-qart-text-muted hover:text-qart-primary opacity-60">Privacidad</a>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
