/**
 * @file Contact.tsx
 * @description Footer and contact section for the landing page.
 */
const Contact = () => {
  return (
    <footer className="bg-surface py-20 border-t border-border">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="col-span-2 space-y-6">
          <h3 className="text-3xl font-serif">QART</h3>
          <p className="text-secondary max-w-sm">
            Elevando la gastronomía cotidiana a una forma de expresión artística. Visítenos y
            redescubra el sabor.
          </p>
          <div className="flex gap-6 mt-8">
            <a href="#" className="hover:text-accent transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Facebook
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Twitter
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-accent">
            Ubicación
          </h4>
          <address className="not-italic text-secondary space-y-2">
            Av. Gourmet 1234
            <br />
            San Miguel de Tucumán
            <br />
            Argentina
          </address>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-accent">Horarios</h4>
          <ul className="text-secondary space-y-2">
            <li>Mar - Jue: 19:00 - 00:00</li>
            <li>Vie - Dom: 12:00 - 01:00</li>
            <li>Lunes: Cerrado</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-20 pt-8 border-t border-border/50 text-center text-xs text-muted">
        © 2026 QART Restaurant System. Desarrollado por Victor.
      </div>
    </footer>
  );
};

export default Contact;
