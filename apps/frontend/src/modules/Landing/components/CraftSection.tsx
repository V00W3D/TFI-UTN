import { motion } from 'framer-motion';

/**
 * @file CraftSection.tsx
 * @description Symmetric Craft Section.
 */
const CraftSection = () => {
  return (
    <div className="l-section bg-surface-alt border-y border-border" id="reserve">
      <div className="l-container l-grid-balanced">
        <div className="l-image-wrap">
          <img src="/chef.png" className="w-full grayscale" alt="Chef" />
        </div>
        <div className="space-y-8">
          <h4>Personalización</h4>
          <h2 className="leading-tight">Tu Visión, <br /><span className="italic">Nuestra Técnica</span></h2>
          <div className="w-12 h-0.5 bg-accent" />
          <p className="text-dim text-lg font-light leading-relaxed">
            Personaliza cada detalle de tu experiencia. En QART, tú eres el co-autor de tu plato.
          </p>
          <ul className="space-y-3 opacity-60">
            {['Origen', 'Precisión', 'Autor'].map(it => (
              <li key={it} className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-3">
                <span className="w-4 h-px bg-accent" /> {it}
              </li>
            ))}
          </ul>
          <button className="btn btn-primary">Diseñar mi plato</button>
        </div>
      </div>
    </div>
  );
};

export default CraftSection;
