import { Outlet } from 'react-router-dom';
import Header from '../components/header/main';
import Footer from '../components/footer/main';

const CoreLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default CoreLayout;
