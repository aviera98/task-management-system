import type { StatusCard } from '@/types/status-card'

export const projectStatus: StatusCard[] = [
  {
    title: 'Frontend',
    description:
      'React, Vite, TypeScript, React Router and Tailwind are configured.',
  },
  {
    title: 'Backend',
    description:
      'ASP.NET Core 8 Web API, EF Core, SQL Server configuration and Swagger are ready.',
  },
  {
    title: 'Quality',
    description: 'ESLint and Prettier are configured for the frontend.',
  },
  {
    title: 'Outcome',
    description:
      'The project compiles and both applications are ready to start locally.',
  },
]
