
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create a root element without extra margins
const rootElement = document.getElementById("root");
if (rootElement) {
  // Remove any default styles that might add margins
  rootElement.style.margin = "0";
  rootElement.style.padding = "0";
  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.body.style.overflow = "hidden";
  document.documentElement.style.margin = "0";
  document.documentElement.style.padding = "0";
  
  // Set height to fit content only - optimal for iframe embedding
  document.body.style.height = "auto";
  document.documentElement.style.height = "auto";
  
  createRoot(rootElement).render(<App />);
}
