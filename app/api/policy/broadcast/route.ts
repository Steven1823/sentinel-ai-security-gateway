import { sentinelClient } from "@/lib/uagents-client"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, version, rules, votingRequired } = body

    if (!id || !version || !rules) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    sentinelClient.broadcastPolicyUpdate({
      id,
      version,
      rules,
      timestamp: Date.now(),
      votingRequired: votingRequired || false,
    })

    return NextResponse.json({
      success: true,
      message: "Policy broadcasted to all agents",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to broadcast policy" }, { status: 500 })
  }
}
