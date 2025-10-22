"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react"

interface Incident {
  id: string
  timestamp: string
  type: string
  risk_level: string
  triggered_rules: string
  action: string
}

export function IncidentDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "blocked" | "masked" | "allowed">("all")

  useEffect(() => {
    fetchIncidents()
    const interval = setInterval(fetchIncidents, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchIncidents = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/incidents?limit=100")
      const data = await response.json()
      setIncidents(data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch incidents:", error)
      setLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-900 text-red-200"
      case "high":
        return "bg-orange-900 text-orange-200"
      case "medium":
        return "bg-yellow-900 text-yellow-200"
      default:
        return "bg-green-900 text-green-200"
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "block":
        return <XCircle className="h-5 w-5 text-red-400" />
      case "mask":
        return <AlertCircle className="h-5 w-5 text-yellow-400" />
      case "allow":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      default:
        return <Clock className="h-5 w-5 text-slate-400" />
    }
  }

  const filteredIncidents = incidents.filter((incident) => {
    if (filter === "all") return true
    return incident.action === filter
  })

  const stats = {
    total: incidents.length,
    blocked: incidents.filter((i) => i.action === "block").length,
    masked: incidents.filter((i) => i.action === "mask").length,
    allowed: incidents.filter((i) => i.action === "allow").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <p className="text-sm text-slate-400">Total Incidents</p>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-red-700/30 bg-red-900/10 p-4">
          <p className="text-sm text-red-300">Blocked</p>
          <p className="text-3xl font-bold text-red-400">{stats.blocked}</p>
        </div>
        <div className="rounded-lg border border-yellow-700/30 bg-yellow-900/10 p-4">
          <p className="text-sm text-yellow-300">Masked</p>
          <p className="text-3xl font-bold text-yellow-400">{stats.masked}</p>
        </div>
        <div className="rounded-lg border border-green-700/30 bg-green-900/10 p-4">
          <p className="text-sm text-green-300">Allowed</p>
          <p className="text-3xl font-bold text-green-400">{stats.allowed}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "blocked", "masked", "allowed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === f ? "bg-red-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Incidents Table */}
      <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading incidents...</div>
        ) : filteredIncidents.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No incidents found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700 bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-400">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-400">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-400">Risk Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-400">Triggered Rules</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-400">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredIncidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getActionIcon(incident.action)}
                        <span className="text-sm font-medium text-slate-300 capitalize">{incident.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{incident.type}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded px-2 py-1 text-xs font-medium ${getRiskColor(
                          incident.risk_level,
                        )}`}
                      >
                        {incident.risk_level.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {incident.triggered_rules ? JSON.parse(incident.triggered_rules).join(", ") : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(incident.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
