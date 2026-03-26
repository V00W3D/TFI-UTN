/**
 * @file Contact.tsx
 * @description Minimalist luxury footer with contact information and brand identity.
 */
const Contact = () => {
  return (
    <footer id="contact" className="bg-bg py-32 border-t border-border">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-16">
        <div className="space-y-8 col-span-2">
          <div className="flex items-center gap-4">
            <img src="/QART_LOGO.png" alt="QART" className="size-12 object-contain" />
            <span className="font-serif text-3xl tracking-widest text-accent">QART</span>
          </div>
          <p className="text-secondary max-w-sm text-lg font-light leading-relaxed">
            Redefiniendo el estándar de la gastronomía de autor a través de la tecnología y la
            pasión artesana.
          </p>
          <div className="flex gap-6 pt-4">
            {['Instagram', 'Twitter', 'LinkedIn'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent hover:text-primary transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-primary">Ubicación</h4>
          <p className="text-secondary font-light">
            Avenida de la Ribera 4500,
            <br />
            Puerto Madero, Buenos Aires
          </p>
        </div>

        <div className="space-y-8">
          <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-primary">Reservas</h4>
          <p className="text-secondary font-light">
            +(54) 11 4455 6677
            <br />
            reservas@qart.com
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-32 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] opacity-30">
          © 2026 QART GASTRONOMY · ALL RIGHTS RESERVED
        </p>
      </div>
    </footer>
  );
};

export default Contact;
