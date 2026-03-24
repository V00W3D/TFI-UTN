import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const LandingPage = () => {
  const mockPlates = [
    {
      name: 'Burger Infernal',
      user: 'alexis',
      rating: 4.8,
      desc: 'Doble carne · cheddar · jalapeños',
    },
    {
      name: 'Pizza Criolla',
      user: 'tomas',
      rating: 4.6,
      desc: 'Mozzarella · huevo · cebolla caramelizada',
    },
    {
      name: 'Wrap Tucumano',
      user: 'juan',
      rating: 4.9,
      desc: 'Pollo · palta · salsa especial',
    },
  ];

  return (
    <main className="min-h-screen px-8 py-10 space-y-24 relative overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative max-w-6xl mx-auto text-center space-y-6 py-20">
        {/* fondo puntitos */}
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        {/* glow */}
        <div
          className="absolute inset-0 -z-10 blur-3xl opacity-40"
          style={{
            background: 'var(--color-primary-glow)',
          }}
        />

        {/* logo decorativo */}
        <img
          src="/QART_LOGO.png"
          alt="QART"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 w-[400px] pointer-events-none select-none"
        />

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-5xl md:text-6xl relative"
        >
          No solo pedís comida. <span className="text-primary">La creás.</span>
        </motion.h1>

        <motion.p
          custom={1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto"
        >
          Explorá platos creados por la comunidad o inventá el tuyo combinando ingredientes únicos.
        </motion.p>

        <motion.div
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="flex justify-center gap-4 pt-4"
        >
          <button
            className="px-6 py-3 rounded-xl shadow-elevated transition hover:scale-105"
            style={{
              background: 'var(--color-primary)',
              color: 'var(--text-inverse)',
            }}
          >
            Crear plato
          </button>

          <button
            className="px-6 py-3 rounded-xl border border-default transition hover:scale-105"
            style={{
              background: 'var(--surface-elevated)',
            }}
          >
            Explorar menú
          </button>
        </motion.div>
      </section>

      {/* ================= COMMUNITY ================= */}
      <section className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex justify-between items-center"
        >
          <h2 className="text-3xl">Menú de la comunidad</h2>
          <span className="text-sm text-[var(--text-muted)]">Platos creados por usuarios</span>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {mockPlates.map((plate, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              whileHover={{ scale: 1.04 }}
              className="p-5 rounded-2xl border border-default bg-elevated shadow-elevated transition"
            >
              <h3 className="text-xl mb-1">{plate.name}</h3>

              <p className="text-sm text-[var(--text-muted)] mb-2">por @{plate.user}</p>

              <p className="text-sm mb-4">{plate.desc}</p>

              <div className="flex justify-between items-center">
                <span className="text-accent font-medium">⭐ {plate.rating}</span>

                <button className="text-sm text-primary hover:underline">Ver</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CREATE ================= */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="space-y-5"
        >
          <h2 className="text-3xl">
            Creá tu propio <span className="text-primary">plato</span>
          </h2>

          <p className="text-[var(--text-secondary)]">
            Elegí ingredientes, combiná sabores y publicá tu creación para que otros la prueben y la
            hagan tendencia.
          </p>

          <button
            className="px-6 py-3 rounded-xl shadow-elevated transition hover:scale-105"
            style={{
              background: 'var(--color-accent)',
              color: 'var(--text-inverse)',
            }}
          >
            Empezar ahora
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl border border-default bg-elevated shadow-elevated space-y-4"
        >
          <p className="text-sm text-[var(--text-muted)]">Ingredientes</p>

          <div className="flex flex-wrap gap-2">
            {['Carne', 'Cheddar', 'Pan brioche', 'Bacon'].map((i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm rounded-full transition hover:scale-105"
                style={{
                  background: 'var(--surface-muted)',
                }}
              >
                {i}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-default">
            <h4 className="text-lg">Preview</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Burger personalizada lista para publicar 🚀
            </p>
          </div>
        </motion.div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section className="max-w-4xl mx-auto text-center space-y-6 pb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl"
        >
          ¿Listo para crear algo único?
        </motion.h2>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 rounded-xl shadow-elevated text-lg transition"
          style={{
            background: 'var(--color-primary)',
            color: 'var(--text-inverse)',
          }}
        >
          Empezar ahora
        </motion.button>
      </section>
    </main>
  );
};

export default LandingPage;
