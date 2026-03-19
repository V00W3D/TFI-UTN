type Props = {
  open: boolean;
  toggle: () => void;
};

const CatalogMenu = ({ open, toggle }: Props) => {
  return (
    <div className="relative">
      <button onClick={toggle} className="hover:text-primary transition">
        Catálogo
      </button>

      {open && (
        <div className="absolute left-0 mt-3 w-56 bg-elevated border border-default rounded-xl shadow-lg p-3">
          <div className="flex flex-col gap-2 text-sm">
            <button className="text-left px-3 py-2 rounded-lg hover:bg-[var(--surface-soft)]">
              Entradas
            </button>

            <button className="text-left px-3 py-2 rounded-lg hover:bg-[var(--surface-soft)]">
              Minutas
            </button>

            <button className="text-left px-3 py-2 rounded-lg hover:bg-[var(--surface-soft)]">
              Bebidas
            </button>

            <button className="text-left px-3 py-2 rounded-lg hover:bg-[var(--surface-soft)]">
              Postres
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogMenu;
