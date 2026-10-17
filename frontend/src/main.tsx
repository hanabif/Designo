import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import 'lenis/dist/lenis.css';
import './index.css';
import App from './App.tsx';
import { SmoothScroll } from './components/SmoothScroll.tsx';
import { AppClerkProvider } from './lib/clerk.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppClerkProvider>
      <BrowserRouter>
        <MotionConfig reducedMotion="user">
          <SmoothScroll>
            <App />
          </SmoothScroll>
        </MotionConfig>
      </BrowserRouter>
    </AppClerkProvider>
  </StrictMode>,
);

