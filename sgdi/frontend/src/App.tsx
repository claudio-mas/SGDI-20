import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Documentos from './pages/Documentos';
import Compartilhados from './pages/Compartilhados';
import Workflows from './pages/Workflows';
import Tarefas from './pages/Tarefas';
import Configuracoes from './pages/Configuracoes';
import Lixeira from './pages/Lixeira';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/documentos" element={<Documentos />} />
                <Route path="/compartilhados" element={<Compartilhados />} />
                <Route path="/workflows" element={<Workflows />} />
                <Route path="/tarefas" element={<Tarefas />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
                <Route path="/lixeira" element={<Lixeira />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
