/**
 * @file FeaturedDish.tsx
 * @description Showcases principal dishes in an elegant display.
 */
const FeaturedDish = () => {
  const dishes = [
    { title: 'The Architect Burger', tag: 'Custom', price: '$12.50' },
    { title: 'Salmon Sillage', tag: 'Fresh', price: '$18.00' },
    { title: 'Burrata Opera', tag: 'Starter', price: '$14.20' },
  ];

  return (
    <div className="space-y-12">
      <div className="text-center max-width-[600px] mx-auto">
        <h2 className="text-4xl mb-4">Selección de Temporada</h2>
        <div className="w-20 h-1 bg-accent mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {dishes.map((dish, idx) => (
          <div key={idx} className="card-gastro p-6 flex flex-col justify-between h-[300px]">
            <div>
              <span className="text-xs uppercase tracking-widest text-accent font-bold">
                {dish.tag}
              </span>
              <h3 className="text-2xl mt-2">{dish.title}</h3>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xl font-light">{dish.price}</span>
              <button className="text-sm font-medium border-b border-accent pb-1">
                Ver Detalle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedDish;
