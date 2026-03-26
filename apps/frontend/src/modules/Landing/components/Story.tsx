import { motion } from 'framer-motion';

/**
 * @file Story.tsx
 * @description Narrative section explaining the brand's philosophy.
 */
const Story = () => {
  return (
    <div className="grid md:grid-cols-2 gap-16 items-center">
      <div>
        <h2 className="text-5xl mb-8 leading-tight">
          Nuestra Filosofía: <br />
          <span className="text-accent italic">El Arte en cada Capa</span>
        </h2>
        <p className="text-secondary leading-relaxed text-lg mb-6">
          En QART, no solo preparamos comida. Esculpimos sabores. Nuestra cocina se basa en la
          precisión de la técnica clásica fusionada con la libertad de la gastronomía de autor.
        </p>
        <p className="text-secondary leading-relaxed text-lg">
          Cada ingrediente es seleccionado por su origen y carácter, permitiendo que cada plato
          cuente una historia única de frescura y sofisticación.
        </p>
      </div>
      <div className="relative">
        <div className="card-gastro p-4 bg-white">
          <img src="/ambiance.png" alt="Restaurante Ambiance" className="rounded-xl w-full" />
        </div>
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10" />
      </div>
    </div>
  );
};

export default Story;
