import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/shared/layout/app-shell'
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page'
import { LoginPage } from '@/features/auth/pages/login-page'
import { RegisterPage } from '@/features/auth/pages/register-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
])
