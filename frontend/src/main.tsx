import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'lenis/dist/lenis.css';
import './index.css';
import App from './App.tsx';
import { SmoothScroll } from './components/SmoothScroll.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SmoothScroll>
        <App />
      </SmoothScroll>
    </BrowserRouter>
  </StrictMode>,
);

