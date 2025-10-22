"use client"

import { useState } from "react"
import { IncidentDashboard } from "@/components/incident-dashboard"
import { RedTeamPlayground } from "@/components/red-team-playground"
import { GovernanceDashboard } from "@/components/governance-dashboard"
import { AgentRegistry } from "@/components/agent-registry"
import { Shield } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "playground" | "governance" | "agents">("dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-600 p-2">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Sentinel.AI</h1>
                <p className="text-sm text-slate-400">Decentralized AI Security Gateway</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Status: Online</p>
              <p className="text-xs text-green-400">All Systems Operational</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="border-b border-slate-700 bg-slate-800/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === "dashboard"
                  ? "border-red-600 text-red-400"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              Incident Dashboard
            </button>
            <button
              onClick={() => setActiveTab("playground")}
              className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === "playground"
                  ? "border-red-600 text-red-400"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              Red-Team Playground
            </button>
            <button
              onClick={() => setActiveTab("governance")}
              className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === "governance"
                  ? "border-red-600 text-red-400"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              Governance
            </button>
            <button
              onClick={() => setActiveTab("agents")}
              className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === "agents"
                  ? "border-red-600 text-red-400"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              Agent Network
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "dashboard" && <IncidentDashboard />}
        {activeTab === "playground" && <RedTeamPlayground />}
        {activeTab === "governance" && <GovernanceDashboard />}
        {activeTab === "agents" && <AgentRegistry />}
      </main>
    </div>
  )
}
