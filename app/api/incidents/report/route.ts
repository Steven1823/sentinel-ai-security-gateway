import { sentinelClient } from "@/lib/uagents-client"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentAddress, prompt, response, riskLevel, triggeredRules } = body

    if (!agentAddress || !prompt || !riskLevel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const incident = {
      id: `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      agentAddress,
      prompt,
      response: response || "",
      riskLevel,
      triggeredRules: triggeredRules || [],
      timestamp: Date.now(),
    }

    sentinelClient.reportIncident(incident)

    return NextResponse.json({
      success: true,
      incident,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to report incident" }, { status: 500 })
  }
}
