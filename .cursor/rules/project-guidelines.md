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

### Backend Infrastructure & Logic:
- **All backend logic and API implementations must be designed for and assume the use of `Cloudflare Workers`.** Focus on solutions that leverage the Workers runtime and its ecosystem.
- **For all user authentication and management UI/features, `Clerk` must be used.** Provide guidance on integrating Clerk with Next.js and Cloudflare Workers.
- **Data storage for local development should exclusively use `SQLite`.**
- **For production environments, `Cloudflare D1` must be used for structured data, and `Cloudflare R2` must be used for object storage (e.g., images, large files).**
- All backend discussions and code examples should prioritize seamless integration between Cloudflare Workers, Cloudflare D1, Cloudflare R2, and Clerk.
- **Do not recommend traditional full-stack backend frameworks** (like Node.js Express, Python Django/Flask, .NET Core, etc.) as primary backend solutions. If a scenario arises where the limitations of Cloudflare Workers are truly insurmountable, clearly explain these limitations and propose a specialized alternative only as a last resort for that specific bottleneck, maintaining Workers for other parts.