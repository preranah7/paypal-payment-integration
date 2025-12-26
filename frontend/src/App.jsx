import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PayPalButton from './components/PayPalButton';
import Success from './components/Success';
import Cancel from './components/Cancel';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PayPalButton />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
