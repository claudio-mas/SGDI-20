import { useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

type TabType = 'login' | 'register';

export default function Login() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<TabType>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 8) {
      newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // For now, use the SSO login since the backend uses Keycloak
      login();
    } catch {
      setLoginError('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // Initiate Google OAuth flow via Keycloak
    login();
  };

  const handleMicrosoftLogin = () => {
    // Initiate Microsoft OAuth flow via Keycloak
    login();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f6f6f8] dark:bg-[#101622]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] font-display text-[#111318] dark:text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e5e7eb] dark:border-b-gray-800 bg-white dark:bg-[#1a202c] px-10 py-4 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="text-primary size-8">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor" />
              <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fillRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">SGDI</h2>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#616f89] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined text-[20px]">help</span>
          <span className="hidden sm:inline">Precisa de Ajuda?</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
          <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-100 dark:bg-purple-900/20 rounded-full blur-[80px]" />
        </div>

        <div className="w-full max-w-[480px] bg-white dark:bg-[#1a202c] rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-gray-800 relative z-10 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#e5e7eb] dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 text-center relative group ${
                activeTab === 'login' ? 'text-primary' : 'text-[#616f89] dark:text-gray-400 hover:text-[#111318] dark:hover:text-white'
              } transition-colors`}
              data-testid="login-tab"
            >
              <span className="font-bold text-sm tracking-wide">LOGIN</span>
              <div className={`absolute bottom-0 left-0 w-full h-[3px] rounded-t-sm ${
                activeTab === 'login' ? 'bg-primary' : 'bg-transparent group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
              } transition-colors`} />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-4 text-center relative group ${
                activeTab === 'register' ? 'text-primary' : 'text-[#616f89] dark:text-gray-400 hover:text-[#111318] dark:hover:text-white'
              } transition-colors`}
              data-testid="register-tab"
            >
              <span className="font-bold text-sm tracking-wide">CRIAR CONTA</span>
              <div className={`absolute bottom-0 left-0 w-full h-[3px] rounded-t-sm ${
                activeTab === 'register' ? 'bg-primary' : 'bg-transparent group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
              } transition-colors`} />
            </button>
          </div>

          <div className="p-8 sm:p-10">
            {/* Heading */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <span className="material-symbols-outlined text-[28px]">lock</span>
              </div>
              <h1 className="text-[#111318] dark:text-white text-2xl font-black leading-tight tracking-tight mb-2">
                {activeTab === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
              </h1>
              <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-relaxed">
                Gerencie seus documentos com a máxima segurança e eficiência.
              </p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm" role="alert" data-testid="login-error">
                {loginError}
              </div>
            )}

            {/* Form */}
            <form className="flex flex-col gap-5" onSubmit={handleSubmit} data-testid="login-form">
              {/* Email Field */}
              <Input
                type="email"
                label="E-mail corporativo"
                placeholder="nome@empresa.com.br"
                value={email}
                onChange={setEmail}
                error={errors.email}
                icon={<span className="material-symbols-outlined">mail</span>}
                iconPosition="right"
                data-testid="email-input"
              />

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[#111318] dark:text-gray-200 text-sm font-semibold">Senha</span>
                  <a
                    href="#"
                    className="text-primary hover:text-blue-700 text-xs font-semibold"
                    onClick={(e) => e.preventDefault()}
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={setPassword}
                  error={errors.password}
                  showPasswordToggle
                  data-testid="password-input"
                />
              </div>

              {/* Action Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                className="mt-2 w-full h-12 shadow-md hover:shadow-lg"
                icon={<span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
                iconPosition="right"
                data-testid="submit-button"
              >
                {activeTab === 'login' ? 'Acessar Painel' : 'Criar Conta'}
              </Button>

              {/* Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
                <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-xs font-medium uppercase tracking-wider">
                  Ou continue com
                </span>
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
              </div>

              {/* SSO Options */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 h-11 text-sm font-medium text-[#111318] dark:text-white transition-colors"
                  data-testid="google-sso-button"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={handleMicrosoftLogin}
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 h-11 text-sm font-medium text-[#111318] dark:text-white transition-colors"
                  data-testid="microsoft-sso-button"
                >
                  <svg className="w-5 h-5" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h11v11H0z" fill="#F25022"/>
                    <path d="M12 0h11v11H12z" fill="#7FBA00"/>
                    <path d="M0 12h11v11H0z" fill="#00A4EF"/>
                    <path d="M12 12h11v11H12z" fill="#FFB900"/>
                  </svg>
                  <span>Microsoft</span>
                </button>
              </div>
            </form>
          </div>

          {/* Footer of Card */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-[#e5e7eb] dark:border-gray-700 text-center">
            <p className="text-xs text-[#616f89] dark:text-gray-400">
              Protegido por reCAPTCHA e sujeito à{' '}
              <a href="#" className="text-primary hover:underline">Política de Privacidade</a>
              {' '}e{' '}
              <a href="#" className="text-primary hover:underline">Termos de Serviço</a>.
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex gap-6 opacity-60 grayscale transition-all hover:grayscale-0 hover:opacity-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#616f89] dark:text-gray-400">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Dados Criptografados</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#616f89] dark:text-gray-400">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span>ISO 27001</span>
          </div>
        </div>
      </main>
    </div>
  );
}
