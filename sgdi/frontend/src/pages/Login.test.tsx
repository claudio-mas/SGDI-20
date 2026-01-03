import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

// Mock useAuth hook
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    login: mockLogin,
    isLoading: false,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering (Requirement 1.1)', () => {
    it('renders the login form with email and password fields', () => {
      renderLogin();
      
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('nome@empresa.com.br')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('renders the submit button', () => {
      renderLogin();
      
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /acessar painel/i })).toBeInTheDocument();
    });

    it('renders SSO buttons for Google and Microsoft', () => {
      renderLogin();
      
      expect(screen.getByTestId('google-sso-button')).toBeInTheDocument();
      expect(screen.getByTestId('microsoft-sso-button')).toBeInTheDocument();
    });

    it('renders login and register tabs', () => {
      renderLogin();
      
      expect(screen.getByTestId('login-tab')).toBeInTheDocument();
      expect(screen.getByTestId('register-tab')).toBeInTheDocument();
    });

    it('displays welcome message for login tab', () => {
      renderLogin();
      
      expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument();
    });
  });

  describe('Form Validation (Requirements 1.2, 1.3)', () => {
    it('shows error when email is empty on submit', async () => {
      renderLogin();
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('E-mail é obrigatório')).toBeInTheDocument();
      });
    });

    it('shows error when password is empty on submit', async () => {
      renderLogin();
      
      const emailInput = screen.getByPlaceholderText('nome@empresa.com.br');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
      });
    });

    it('shows error when password is less than 8 characters', async () => {
      renderLogin();
      
      const emailInput = screen.getByPlaceholderText('nome@empresa.com.br');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '1234567' } });
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Senha deve ter no mínimo 8 caracteres')).toBeInTheDocument();
      });
    });

    it('calls login when form is valid', async () => {
      renderLogin();
      
      const emailInput = screen.getByPlaceholderText('nome@empresa.com.br');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '12345678' } });
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });
    });
  });

  describe('Tab Switching', () => {
    it('switches to register tab when clicked', () => {
      renderLogin();
      
      const registerTab = screen.getByTestId('register-tab');
      fireEvent.click(registerTab);
      
      expect(screen.getByText('Crie sua conta')).toBeInTheDocument();
      // Use testid to avoid multiple elements with same name
      expect(screen.getByTestId('submit-button')).toHaveTextContent('Criar Conta');
    });

    it('switches back to login tab when clicked', () => {
      renderLogin();
      
      const registerTab = screen.getByTestId('register-tab');
      fireEvent.click(registerTab);
      
      const loginTab = screen.getByTestId('login-tab');
      fireEvent.click(loginTab);
      
      expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument();
    });
  });

  describe('SSO Buttons', () => {
    it('calls login when Google SSO button is clicked', () => {
      renderLogin();
      
      const googleButton = screen.getByTestId('google-sso-button');
      fireEvent.click(googleButton);
      
      expect(mockLogin).toHaveBeenCalled();
    });

    it('calls login when Microsoft SSO button is clicked', () => {
      renderLogin();
      
      const microsoftButton = screen.getByTestId('microsoft-sso-button');
      fireEvent.click(microsoftButton);
      
      expect(mockLogin).toHaveBeenCalled();
    });
  });
});
