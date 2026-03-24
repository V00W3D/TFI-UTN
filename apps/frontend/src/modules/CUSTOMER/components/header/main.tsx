import Logo from './Logo';
import Navbar from './Navbar';
import SearchBar from './SearchBar';

const Header = () => {
  return (
    <header className="w-full bg-elevated border-b border-default shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Logo />
          <Navbar />
        </div>

        <SearchBar />
      </div>
    </header>
  );
};

export default Header;
