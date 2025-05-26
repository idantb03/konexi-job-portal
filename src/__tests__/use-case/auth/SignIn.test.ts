import { SignInUseCase } from '../../../use-case/auth/SignIn';
import { IAuthService, AuthResponse } from '../../../infrastructure/ports/IAuthService';

describe('SignInUseCase', () => {
  let mockAuthService: jest.Mocked<IAuthService>;
  let signInUseCase: SignInUseCase;

  beforeEach(() => {
    mockAuthService = {
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getCurrentUser: jest.fn(),
      getUserFromToken: jest.fn(),
      resetPassword: jest.fn(),
      updatePassword: jest.fn(),
      onAuthStateChange: jest.fn(),
    } as jest.Mocked<IAuthService>;

    signInUseCase = new SignInUseCase(mockAuthService);
  });

  it('should throw an error if email is not provided', async () => {
    await expect(signInUseCase.execute('', 'password123')).rejects.toThrow('Email and password are required');
  });

  it('should throw an error if password is not provided', async () => {
    await expect(signInUseCase.execute('user@example.com', '')).rejects.toThrow('Email and password are required');
  });

  it('should sign in user successfully', async () => {
    const mockResponse: AuthResponse = {
      data: { id: 'user-123', email: 'user@example.com' },
      error: null,
    };

    mockAuthService.signIn.mockResolvedValue(mockResponse);

    const result = await signInUseCase.execute('user@example.com', 'password123');

    expect(mockAuthService.signIn).toHaveBeenCalledWith('user@example.com', 'password123');
    expect(result).toEqual({ id: 'user-123', email: 'user@example.com' });
  });

  it('should throw an error if sign in fails', async () => {
    const mockError = new Error('Invalid credentials');
    const mockResponse: AuthResponse = {
      data: null,
      error: mockError,
    };

    mockAuthService.signIn.mockResolvedValue(mockResponse);

    await expect(signInUseCase.execute('user@example.com', 'password123')).rejects.toThrow(mockError);
    expect(mockAuthService.signIn).toHaveBeenCalledWith('user@example.com', 'password123');
  });
}); 