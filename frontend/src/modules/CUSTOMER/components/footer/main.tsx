const footer = () => {
  return (
    <footer className="w-full border-t border-default bg-surface mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-4 gap-10 text-sm">
        {/* Marca */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-3">QART</h3>

          <p className="text-[var(--text-secondary)]">
            Experiencia gastronómica moderna. Calidad premium y sabores únicos.
          </p>
        </div>

        {/* Locales */}
        <div>
          <h4 className="font-semibold mb-3">Locales</h4>

          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li>Tucumán Centro</li>
            <li>Yerba Buena</li>
            <li>Buenos Aires</li>
          </ul>
        </div>

        {/* Navegación */}
        <div>
          <h4 className="font-semibold mb-3">Navegación</h4>

          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li>Catálogo</li>
            <li>Promociones</li>
            <li>Sobre nosotros</li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="font-semibold mb-3">Contacto</h4>

          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li>soporte@qart.com</li>
            <li>+54 381 555 9999</li>
            <li>Soporte 24/7</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-[var(--text-muted)] pb-6">
        © {new Date().getFullYear()} QART — Todos los derechos reservados
      </div>
    </footer>
  );
};

export default footer;
