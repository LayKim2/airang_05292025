# Project Guidelines

## UI/UX & Styling
- Use `shadcn/ui` and `Tailwind CSS` as primary UI design and styling solutions
- For components not available in shadcn/ui or Tailwind CSS, recommend alternative packages with justification

## Animation Design
- Use exclusively from:
  - Magic UI
  - 21st Dev
  - Aceternity UI
- Specify recommended animation library and reasoning for each animation task

## Iconography
- Use `Lucide Icons` and `Iconify` as primary icon sources
- For missing icons, suggest alternatives from well-known packages (e.g., React Icons, Font Awesome) with justification

## Component Structure
- All new components must be created inside `app/components` directory
- Components should be organized by feature/domain in subdirectories (e.g., `app/components/home`, `app/components/auth`)
- Common UI components should be placed in `app/components/ui`

## Authentication & User Management
- **Clerk must be used for all authentication and user management features**
- Implementation requirements:
  - Wrap the entire application with `ClerkProvider` in the root layout
  - Use Clerk's pre-built components for authentication UI:
    - `SignInButton` for login triggers
    - `SignUpButton` for registration triggers
    - `UserButton` for user profile/account management
    - `SignedIn` and `SignedOut` for conditional rendering
  - Implement protected routes using Clerk's middleware
  - Use Clerk's hooks for user state management:
    - `useUser` for current user data
    - `useAuth` for authentication state
    - `useClerk` for Clerk instance
  - Store Clerk environment variables in `.env.local`:
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
    - `CLERK_SECRET_KEY`
  - Configure Clerk's appearance to match the application's theme
  - Implement proper error handling for authentication failures
  - Use Clerk's webhooks for user event handling when needed

### Backend Infrastructure & Logic:
- **All backend logic and API implementations must be designed for and assume the use of `Cloudflare Workers`.** Focus on solutions that leverage the Workers runtime and its ecosystem.
- **For all user authentication and management UI/features, `Clerk` must be used.** Provide guidance on integrating Clerk with Next.js and Cloudflare Workers.
- **Data storage for local development should exclusively use `SQLite`.**
- **For production environments, `Cloudflare D1` must be used for structured data, and `Cloudflare R2` must be used for object storage (e.g., images, large files).**
- All backend discussions and code examples should prioritize seamless integration between Cloudflare Workers, Cloudflare D1, Cloudflare R2, and Clerk.
- **Do not recommend traditional full-stack backend frameworks** (like Node.js Express, Python Django/Flask, .NET Core, etc.) as primary backend solutions. If a scenario arises where the limitations of Cloudflare Workers are truly insurmountable, clearly explain these limitations and propose a specialized alternative only as a last resort for that specific bottleneck, maintaining Workers for other parts.