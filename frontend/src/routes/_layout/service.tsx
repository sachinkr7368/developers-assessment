import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { fetchWorklogs } from "@/lib/mockData"
import { Server, Database, Activity, Code2 } from "lucide-react"

export const Route = createFileRoute("/_layout/service")({
  component: ServiceDashboard,
})

function ServiceDashboard() {
  const [data, setData] = useState<any>(null)
  
  useEffect(() => {
    fetchWorklogs().then(setData)
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <Server className="h-10 w-10 text-primary" />
          Mock Data Service
        </h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
          This architectural layer simulates realistic frontend-backend communications, allowing full testing of the Dashboard without starting a local FastAPI server.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <Database className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-bold text-lg">In-Memory JSON</h3>
          <p className="text-sm text-muted-foreground mt-1">Data is stored as typed arrays locally. Writes are preserved across local states.</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <Activity className="h-8 w-8 text-green-500 mb-4" />
          <h3 className="font-bold text-lg">Latency Simulated</h3>
          <p className="text-sm text-muted-foreground mt-1">Mock functions wrap setTimeouts (800ms) to ensure frontend Loading States behave realistically.</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <Code2 className="h-8 w-8 text-blue-500 mb-4" />
          <h3 className="font-bold text-lg">Zero Dependency</h3>
          <p className="text-sm text-muted-foreground mt-1">Frontend routing and API testing requires no active Postgres or Python instances.</p>
        </div>
      </div>

      <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-xl border border-[#333]">
        <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-[#333]">
          <span className="text-xs font-mono text-gray-400">Response Payload Preview (GET /mock/worklogs)</span>
          <span className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
          </span>
        </div>
        <div className="p-4 overflow-auto max-h-[500px]">
          <pre className="text-sm font-mono text-green-400">
            {data ? JSON.stringify(data, null, 2) : "Fetching via simulated delay..."}
          </pre>
        </div>
      </div>
    </div>
  )
}
