# Konexi

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Architecture

This project follows Clean Architecture principles with the following structure:

```
src/
├── domain/           # Core business logic
│   ├── entities/     # Business objects
│   └── enums/        # Type definitions
├── use-case/         # Application business rules
│   ├── auth/         # Authentication use cases
│   └── jobs/         # Job-related use cases
├── infrastructure/   # External interfaces
│   ├── axios/        # HTTP client
│   ├── supabase/     # Database & auth
│   └── ports/        # External service interfaces
├── features/         # Feature-based UI components
│   ├── auth/         # Auth FE Services
│   ├── jobs/         # Jobs FE Services
│   └── dashboard/    # Dashboard FE Services
├── components/       # Reusable UI components
├── providers/        # Context providers
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
└── app/              # Next.js app router pages
```

We use both TypeScript interfaces and types throughout the project. Interfaces are primarily used for defining object shapes and contracts (like repository interfaces), while types are used for unions, intersections, and more complex type definitions. This gives us flexibility while maintaining strong type safety.

## Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (Package manager)

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
```

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode

## Testing

This project uses Jest and React Testing Library for testing. Run tests with:

```bash
pnpm test
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Points for Improvement

Here are some areas where the project can be further improved:

1. **Test Coverage & CI Integration**
   - Increase the number and coverage of test cases, especially for critical business logic and UI components.
   - Integrate tests into the deployment pipeline (e.g., using GitHub Actions, GitLab CI, or similar) to ensure code quality before merging/deployment.
   - Consider using tools like [Husky](https://typicode.github.io/husky/) to enforce pre-commit/pre-push hooks for running tests and linting.

2. **Frontend Component Structure**
   - Refine the organization of UI components for better scalability and maintainability (e.g., atomic design, clear separation between presentational and container components).
   - Add clear documentation or guidelines for contributing new components.

3. **Environment Variable Management**
   - Use a secure environment variable management tool such as [Doppler](https://www.doppler.com/), [Vault](https://www.vaultproject.io/), or [EnvVault](https://envvault.dev/) to manage secrets and environment variables across environments.
   - Avoid committing sensitive information to the repository.

4. **Linting & Code Quality**
   - Improve linting rules for stricter code quality (e.g., enable more ESLint rules, use [Prettier](https://prettier.io/) for code formatting).
   - Integrate linting into the CI pipeline and pre-commit hooks.

5. **Additional Recommendations**
   - **Documentation:** Expand documentation for onboarding, architecture decisions, and contribution guidelines.
   - **Type Safety:** Ensure comprehensive TypeScript usage across the codebase for better reliability and maintainability.
   - **Accessibility:** Audit and improve accessibility (a11y) of UI components.
   - **Performance:** Monitor and optimize performance, especially for large data sets or complex UI flows.
   - **Error Monitoring:** Integrate error monitoring tools (e.g., Sentry) for better production observability.
   - **End-to-End Testing:** Add E2E tests (e.g., with Cypress or Playwright) to cover user flows.
