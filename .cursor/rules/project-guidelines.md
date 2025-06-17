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

## Backend Infrastructure
- Primary data storage:
  - Cloudflare D1 for structured data
  - Cloudflare R2 for object storage (images, etc.)
- Local development: Use SQLite database
- Backend code should integrate with Cloudflare Workers
- Avoid traditional full-stack frameworks unless specifically required for:
  - Heavy computation
  - Complex business logic
  - Real-time WebSockets at scale
  - Deep enterprise system integration 