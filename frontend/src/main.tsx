import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import FloatingMenu from '@GENERAL/FloatingMenu';
import { useAppStore } from './appStore';

const Root = () => {
  const { mode } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;

    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mode]);

  return (
    <>
      <BrowserRouter>
        <App />
      </BrowserRouter>

      <FloatingMenu />
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
