import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { sdk } from '@tools/sdk';
import { isSuccessResponse } from '@app/sdk';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const LandingPage = () => {
  const { data, isFetching, error } = sdk.customer.plates.$use();

  useEffect(() => {
    sdk.customer.plates.$reset();
    sdk.customer.plates({ page: 1, limit: 20 });
  }, []);

  // 🔥 FIX: chequeo null ANTES del type guard
  const plates = data && isSuccessResponse(data) ? data.data.items : [];

  return (
    <main className="min-h-screen px-8 py-10 space-y-24 relative overflow-hidden">
      {/* HERO */}
      <section className="relative max-w-6xl mx-auto text-center space-y-6 py-20">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        <div
          className="absolute inset-0 -z-10 blur-3xl opacity-40"
          style={{ background: 'var(--color-primary-glow)' }}
        />

        <img
          src="/QART_LOGO.png"
          alt="QART"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 w-100"
        />

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-5xl md:text-6xl"
        >
          No solo pedís comida. <span className="text-primary">La creás.</span>
        </motion.h1>

        <motion.p
          custom={1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-lg md:text-xl text-(--text-secondary) max-w-2xl mx-auto"
        >
          Explorá platos creados por la comunidad o inventá el tuyo.
        </motion.p>
      </section>

      {/* COMMUNITY */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl">Menú de la comunidad</h2>
          <span className="text-sm text-(--text-muted)">
            {isFetching ? 'Cargando...' : `${plates.length} platos`}
          </span>
        </div>

        {/* ERROR */}
        {error && <div className="text-red-400 text-sm">Error: {error.code}</div>}

        {/* LOADING */}
        {isFetching && (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-2xl border bg-elevated animate-pulse" />
            ))}
          </div>
        )}

        {/* DATA */}
        {!isFetching && (
          <div className="grid md:grid-cols-3 gap-6">
            {plates.map((plate, i) => (
              <motion.div
                key={plate.id}
                custom={i}
                initial="hidden"
                whileInView="show"
                variants={fadeUp}
                whileHover={{ scale: 1.04 }}
                className="p-5 rounded-2xl border bg-elevated shadow-elevated"
              >
                <h3 className="text-xl">{plate.name}</h3>

                <p className="text-sm text-(--text-muted)">
                  {plate.type} · {plate.flavor}
                </p>

                <p className="text-sm">{plate.description}</p>

                <div className="flex justify-between">
                  <span>⭐ {plate.avgRating.toFixed(1)}</span>
                  <button className="text-primary hover:underline">Ver</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default LandingPage;
