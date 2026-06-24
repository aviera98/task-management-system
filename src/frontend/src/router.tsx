import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage, ProtectedRoute, RegisterPage } from '@/features/auth'
import { TasksPage } from '@/features/tasks'
import { MainLayout } from '@/layouts/main-layout'
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
          { path: '/', element: <Navigate to="/tasks" replace /> },
          { path: '/tasks', element: <TasksPage /> },
          { path: '/setup', element: <SetupPage /> },
        ],
      },
    ],
  },
])
