
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create a root element without extra margins
const rootElement = document.getElementById("root");
if (rootElement) {
  // Remove any default styles that might add margins
  rootElement.style.margin = "0";
  rootElement.style.padding = "0";
  
  createRoot(rootElement).render(<App />);
}
