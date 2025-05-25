import { IAuthService } from '../../infrastructure/ports/IAuthService';

export class SignInUseCase {
  constructor(private readonly authService: IAuthService) {}

  async execute(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const response = await this.authService.signIn(email, password);

    if (response.error) {
      throw response.error;
    }

    return response.data;
  }
}
