import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import CidadesPage from './pages/CidadesPages';
import EstradasPage from './pages/EstradasPages';
import RotaPage from './pages/RotaPages';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/cidades" replace />} />
          <Route path="/cidades" element={<CidadesPage />} />
          <Route path="/estradas" element={<EstradasPage />} />
          <Route path="/rota" element={<RotaPage />} />
          <Route path="*" element={<Navigate to="/cidades" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}