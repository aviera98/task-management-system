import { useQuery } from '@tanstack/react-query'
import { getTasks } from '@/features/tasks/api/tasks-api'
import { useAuth } from '@/features/auth'

export function useTasksQuery() {
  const { accessToken, isAuthenticated } = useAuth()

  return useQuery({
    enabled: isAuthenticated && typeof accessToken === 'string',
    queryKey: ['tasks'],
    queryFn: ({ signal }) => getTasks(accessToken!, signal),
  })
}
