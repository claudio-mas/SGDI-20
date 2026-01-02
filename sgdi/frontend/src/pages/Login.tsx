import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">SGDI</h1>
          <p className="text-gray-500">Sistema de Gestão de Documentos Inteligente</p>
        </div>

        <button
          onClick={login}
          className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">login</span>
          Entrar com SSO
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Protegido por autenticação corporativa</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-green-500 text-sm">verified</span>
              ISO 27001
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-green-500 text-sm">lock</span>
              Criptografado
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
