import { useState } from 'react';
import CatalogMenu from './CatalogMenu';

const Navbar = () => {
  const [openCatalog, setOpenCatalog] = useState(false);

  return (
    <nav className="flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
      <button className="hover:text-primary transition">Sobre nosotros</button>

      <CatalogMenu open={openCatalog} toggle={() => setOpenCatalog(!openCatalog)} />

      <button className="hover:text-primary transition">Soporte</button>
    </nav>
  );
};

export default Navbar;
