import { createFileRoute } from "@tanstack/react-router"
import { Dashboard } from "@/components/Dashboard/Dashboard"

export const Route = createFileRoute("/_layout/")({
  component: DashboardPage,
  head: () => ({
    meta: [
      {
        title: "Worklog Payment Dashboard",
      },
    ],
  }),
})

function DashboardPage() {
  return <Dashboard />
}
