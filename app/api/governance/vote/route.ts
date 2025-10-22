import { governanceEngine } from "@/lib/smart-contracts"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { proposalId, voter, vote } = body

    if (!proposalId || !voter || !vote) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const success = governanceEngine.vote(proposalId, voter, vote)

    if (!success) {
      return NextResponse.json({ error: "Failed to record vote" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Vote recorded successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 })
  }
}
