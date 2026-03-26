/**
 * @file Contact.tsx
 * @description Friendly, clean 4-column footer grid.
 */
const Contact = () => {
  return (
    <footer id="contact" className="bg-qart-surface pt-20 pb-10 border-t border-qart-border">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16">
        {/* BRAND COLUMN */}
        <div className="sm:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl tracking-tighter text-qart-primary">
              QART<span className="text-qart-accent">Burger</span>
            </span>
          </div>
          <p className="text-qart-text-muted text-sm font-medium leading-relaxed max-w-sm">
            Diseñando la hamburguesa perfecta, capa por capa. Frescura absoluta, poder total para
            vos.
          </p>
          <div className="flex gap-4 pt-4">
            {['Instagram', 'TikTok', 'Twitter'].map((s) => (
              <a
                key={s}
                href="#"
                className="w-10 h-10 rounded-full bg-qart-bg flex items-center justify-center text-sm font-bold text-qart-text-muted hover:bg-qart-accent hover:text-white hover:-translate-y-1 transition-all"
              >
                {s[0]}
              </a>
            ))}
          </div>
        </div>

        {/* LOCATION */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-qart-primary">Dónde Estamos</h4>
          <p className="text-qart-text-muted text-sm font-medium leading-loose">
            Avenida de la Ribera 4500,
            <br />
            Puerto Madero, CABA
            <br />
            Argentina
          </p>
        </div>

        {/* CONTACT */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-qart-primary">Hablemos</h4>
          <p className="text-qart-text-muted text-sm font-medium leading-loose flex flex-col">
            <a href="tel:+541144556677" className="hover:text-qart-accent transition-colors">
              +(54) 11 4455 6677
            </a>
            <a
              href="mailto:hola@qartburger.com"
              className="hover:text-qart-accent transition-colors"
            >
              hola@qartburger.com
            </a>
          </p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-qart-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs font-medium text-qart-text-muted">
          © 2026 QART Burger. Todos los derechos reservados.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-xs font-bold text-qart-text-muted hover:text-qart-primary">
            Términos
          </a>
          <a href="#" className="text-xs font-bold text-qart-text-muted hover:text-qart-primary">
            Privacidad
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
