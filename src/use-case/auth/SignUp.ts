import { IAuthService } from '../../infrastructure/ports/IAuthService';

export class SignUpUseCase {
  constructor(private readonly authService: IAuthService) {}

  async execute(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const response = await this.authService.signUp(email, password);

    if (response.error) {
      throw response.error;
    }

    return response.data;
  }
}
