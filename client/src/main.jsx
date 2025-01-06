// index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import {store} from '../src/redux/store'; // Import the store
import './index.css';
import App from './App.jsx';
import { Analytics } from '@vercel/analytics/react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <>
        <App />
        <Analytics />
      </>
    </Provider>
  </StrictMode>,
);
