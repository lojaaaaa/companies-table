import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { MainProviders } from './providers';

import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainProviders>
      <App />
    </MainProviders>
  </StrictMode>,
);
