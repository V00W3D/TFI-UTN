import { useAppStore } from '../appStore';

const ToggleModeButton = () => {
  const { mode, setMode } = useAppStore();

  const toggle = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggle}
      className="w-10 h-10 flex items-center justify-center rounded-full
                 bg-black/70 dark:bg-white/80
                 backdrop-blur-md
                 hover:scale-110 transition-all duration-300"
    >
      {mode === 'dark' ? (
        <span>☀️</span> // después cambiás por tu icono
      ) : (
        <span>🌙</span>
      )}
    </button>
  );
};

export default ToggleModeButton;
