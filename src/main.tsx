import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { WidgetApp } from './components/widgets/WidgetApp';
import './styles/globals.css';

const root = createRoot(document.getElementById('root')!);

if (window.location.pathname === '/widget') {
  root.render(
    <StrictMode>
      <WidgetApp />
    </StrictMode>
  );
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
