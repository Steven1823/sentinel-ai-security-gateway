export interface SentinelAgent {
  address: string
  name: string
  role: "gateway" | "policy-manager" | "auditor" | "governance"
  status: "active" | "inactive"
  lastHeartbeat: number
}

export interface PolicyUpdate {
  id: string
  version: number
  rules: Array<{
    pattern: string
    severity: "low" | "medium" | "high" | "critical"
    action: "allow" | "mask" | "block"
  }>
  timestamp: number
  votingRequired: boolean
}

export interface IncidentReport {
  id: string
  agentAddress: string
  prompt: string
  response: string
  riskLevel: "low" | "medium" | "high" | "critical"
  triggeredRules: string[]
  timestamp: number
  onChainHash?: string
}

export class SentinelAgentClient {
  private agents: Map<string, SentinelAgent> = new Map()
  private policyUpdates: Map<string, PolicyUpdate> = new Map()
  private incidents: IncidentReport[] = []

  // Register a new agent in the Sentinel network
  registerAgent(agent: SentinelAgent): void {
    this.agents.set(agent.address, agent)
    console.log(`[Sentinel] Agent registered: ${agent.name} (${agent.address})`)
  }

  // Broadcast policy update to all agents
  broadcastPolicyUpdate(update: PolicyUpdate): void {
    this.policyUpdates.set(update.id, update)
    console.log(`[Sentinel] Policy update broadcasted: v${update.version}`)
  }

  // Report incident to network
  reportIncident(incident: IncidentReport): void {
    this.incidents.push(incident)
    console.log(`[Sentinel] Incident reported: ${incident.id}`)
  }

  // Get all active agents
  getActiveAgents(): SentinelAgent[] {
    return Array.from(this.agents.values()).filter((a) => a.status === "active")
  }

  // Get latest policy
  getLatestPolicy(): PolicyUpdate | null {
    const policies = Array.from(this.policyUpdates.values())
    return policies.length > 0 ? policies[policies.length - 1] : null
  }

  // Get incidents for a specific agent
  getAgentIncidents(agentAddress: string): IncidentReport[] {
    return this.incidents.filter((i) => i.agentAddress === agentAddress)
  }
}

export const sentinelClient = new SentinelAgentClient()
