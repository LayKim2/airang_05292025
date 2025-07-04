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

## Backend Infrastructure & Data Management
- **This project follows a Backend-as-a-Service (BaaS) architecture using Supabase**
- **No traditional backend server is required** - all backend functionality is handled through Supabase services
- **Supabase serves as the complete backend solution** providing database, authentication, real-time features, and file storage

### Supabase Integration Requirements:
- **Database Operations**: Use Supabase client for all CRUD operations
  - Import Supabase client: `import { supabase } from '@/lib/supabase'`
  - Use Supabase's built-in Row Level Security (RLS) for data protection
  - Implement proper error handling for all database operations
  - Use TypeScript interfaces for type safety with database operations

- **Real-time Features**: Leverage Supabase Realtime for live updates
  - Implement real-time subscriptions for chat, notifications, and live data
  - Use `supabase.channel()` for WebSocket connections
  - Handle connection states and reconnection logic
  - Example: Real-time chat, live notifications, collaborative features

- **File Storage**: Use Supabase Storage for all file uploads
  - Store images, documents, and media files in Supabase Storage
  - Implement proper file validation and size limits
  - Use public URLs for accessible files and signed URLs for private files
  - Handle file upload progress and error states

- **Environment Configuration**: Set up Supabase environment variables
  - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anonymous key for client-side operations
  - Store these in `.env.local` for local development

### Data Architecture Patterns:
- **Client-Side Data Management**: Handle all data operations directly from the frontend
  - Use React hooks for state management (useState, useEffect, useReducer)
  - Implement optimistic updates for better UX
  - Use React Query or SWR for caching and data synchronization (optional)

- **Database Schema Design**: Design tables with proper relationships
  - Use UUIDs for primary keys when possible
  - Implement proper foreign key relationships
  - Set up RLS policies for data security
  - Use JSONB columns for flexible data structures

- **API Patterns**: Create reusable data access functions
  - Organize database operations in service files (e.g., `services/userService.ts`)
  - Implement consistent error handling patterns
  - Use TypeScript for type safety across all data operations

### Security & Performance:
- **Row Level Security (RLS)**: Implement proper RLS policies for all tables
  - Users can only access their own data
  - Public data should have appropriate read policies
  - Admin operations should be properly secured

- **Performance Optimization**: Optimize database queries and real-time subscriptions
  - Use proper indexing on frequently queried columns
  - Implement pagination for large datasets
  - Optimize real-time subscriptions to only listen to necessary channels
  - Use Supabase's built-in caching where appropriate

### Error Handling & Monitoring:
- **Consistent Error Handling**: Implement uniform error handling across all Supabase operations
  - Create error utility functions for common error patterns
  - Provide user-friendly error messages
  - Log errors appropriately for debugging

- **Data Validation**: Validate data before sending to Supabase
  - Use Zod or similar libraries for schema validation
  - Implement client-side validation for better UX
  - Use Supabase's built-in constraints for data integrity

### Migration & Development Workflow:
- **Local Development**: Use Supabase CLI for local development
  - Set up local Supabase instance for development
  - Use database migrations for schema changes
  - Implement seed data for development environment

- **Production Deployment**: Ensure proper environment setup
  - Configure production Supabase project
  - Set up proper RLS policies for production
  - Implement monitoring and logging for production environment

### Integration with Clerk:
- **User Management**: Use Clerk for authentication, Supabase for user data
  - Store Clerk user ID in Supabase user profiles
  - Use Clerk's user ID as foreign key in related tables
  - Implement proper user creation/deletion synchronization
  - Handle user profile updates between Clerk and Supabase

### Alternative Considerations:
- **When to Consider Traditional Backend**: Only consider traditional backend if:
  - Complex business logic that cannot be handled in Supabase functions
  - Integration with external services that require server-side processing
  - Heavy computational tasks that exceed Supabase function limits
  - Custom authentication requirements beyond Clerk's capabilities

- **Scaling Considerations**: Plan for future scaling needs
  - Monitor Supabase usage and limits
  - Consider database optimization as data grows
  - Plan for potential migration to more robust solutions if needed

# Localization & Static Text
- When adding fixed/static text to the project, always implement it so that it supports language switching (i18n) according to the current language setting.
- All user-facing static text must be managed through the project's i18n system (e.g., translation files), not hardcoded in components.
- The project must support all four languages: Korean, English, Japanese, and Chinese (as translation JSON files for all four exist in the project). All static text must be translated and available in these four languages.

# --- Deprecated/Commented Backend Rules ---
# - All backend logic and API implementations must be designed for and assume the use of `Cloudflare Workers`. Focus on solutions that leverage the Workers runtime and its ecosystem.
# - For all user authentication and management UI/features, `Clerk` must be used. Provide guidance on integrating Clerk with Next.js and Cloudflare Workers.
# - Data storage for local development should exclusively use `SQLite`.
# - For production environments, `Cloudflare D1` must be used for structured data, and `Cloudflare R2` must be used for object storage (e.g., images, large files).
# - All backend discussions and code examples should prioritize seamless integration between Cloudflare Workers, Cloudflare D1, Cloudflare R2, and Clerk.
# - Do not recommend traditional full-stack backend frameworks (like Node.js Express, Python Django/Flask, .NET Core, etc.) as primary backend solutions. If a scenario arises where the limitations of Cloudflare Workers are truly insurmountable, clearly explain these limitations and propose a specialized alternative only as a last resort for that specific bottleneck, maintaining Workers for other parts.