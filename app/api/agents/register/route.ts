import { sentinelClient } from "@/lib/uagents-client"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, name, role } = body

    if (!address || !name || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    sentinelClient.registerAgent({
      address,
      name,
      role,
      status: "active",
      lastHeartbeat: Date.now(),
    })

    return NextResponse.json({
      success: true,
      message: `Agent ${name} registered successfully`,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to register agent" }, { status: 500 })
  }
}
