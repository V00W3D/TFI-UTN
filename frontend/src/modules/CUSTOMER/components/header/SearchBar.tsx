const SearchBar = () => {
  return (
    <div className="flex-1 max-w-xl">
      <input
        placeholder="Buscar comida, bebidas..."
        className="w-full px-4 py-2 rounded-xl border border-default bg-surface
        focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-glow)]"
      />
    </div>
  );
};

export default SearchBar;
