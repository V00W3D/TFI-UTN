import { useAppStore } from '../appStore';
import './toggle-mode-button.css';

const ToggleModeButton = () => {
  const { mode, setMode } = useAppStore();

  const toggle = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  return (
    <button onClick={toggle} className="toggle-mode-button">
      <img src="/moon-icon.png" alt="Toggle theme" />
    </button>
  );
};

export default ToggleModeButton;
