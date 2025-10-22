"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sentinelClient } from "@/lib/uagents-client"
import { Activity, Network, Shield } from "lucide-react"

export function AgentRegistry() {
  const [agents, setAgents] = useState(sentinelClient.getActiveAgents())

  useEffect(() => {
    // Simulate agent heartbeats
    const interval = setInterval(() => {
      setAgents(sentinelClient.getActiveAgents())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "gateway":
        return <Shield className="h-4 w-4" />
      case "policy-manager":
        return <Network className="h-4 w-4" />
      case "auditor":
        return <Activity className="h-4 w-4" />
      default:
        return <Network className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="mb-4 text-xl font-bold text-white">Sentinel Agent Network</h2>
        <div className="grid gap-4">
          {agents.map((agent) => (
            <Card key={agent.address} className="border-slate-700 bg-slate-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-600 p-2">{getRoleIcon(agent.role)}</div>
                    <div>
                      <CardTitle className="text-white">{agent.name}</CardTitle>
                      <CardDescription className="font-mono text-xs">{agent.address}</CardDescription>
                    </div>
                  </div>
                  <Badge className={agent.status === "active" ? "bg-green-600" : "bg-red-600"}>{agent.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Role: {agent.role}</span>
                  <span className="text-slate-500">
                    Last heartbeat: {new Date(agent.lastHeartbeat).toLocaleTimeString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
