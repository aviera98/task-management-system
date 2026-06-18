import { getJson } from '@/shared/api/http-client'
import type { DashboardSummary } from '@/features/dashboard/types/dashboard-summary'

const fallbackSummary: DashboardSummary = {
  totalTasks: 0,
  completedTasks: 0,
  inProgressTasks: 0,
  overdueTasks: 0,
  completionRate: 0,
}

export async function getDashboardSummary() {
  try {
    return await getJson<DashboardSummary>('/api/dashboard/summary')
  } catch {
    return fallbackSummary
  }
}
