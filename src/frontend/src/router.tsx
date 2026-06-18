import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/layouts/main-layout'
import { HomePage } from '@/pages/home-page'
import { SetupPage } from '@/pages/setup-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'setup', element: <SetupPage /> },
    ],
  },
])
