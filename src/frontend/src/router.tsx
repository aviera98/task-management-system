import { createBrowserRouter } from 'react-router-dom'
import { LoginPage, ProtectedRoute, RegisterPage } from '@/features/auth'
import { MainLayout } from '@/layouts/main-layout'
import { HomePage } from '@/pages/home-page'
import { SetupPage } from '@/pages/setup-page'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/setup', element: <SetupPage /> },
        ],
      },
    ],
  },
])
