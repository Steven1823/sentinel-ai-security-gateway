import { sentinelClient } from "@/lib/uagents-client"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const agents = sentinelClient.getActiveAgents()
    return NextResponse.json({ agents })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
  }
}
