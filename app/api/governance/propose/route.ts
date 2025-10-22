import { governanceEngine } from "@/lib/smart-contracts"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, proposedPolicy, proposer } = body

    if (!title || !proposedPolicy || !proposer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const proposalId = governanceEngine.createProposal({
      title,
      description,
      proposedPolicy,
      proposer,
      createdAt: Date.now(),
      votingDeadline: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    return NextResponse.json({
      success: true,
      proposalId,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 })
  }
}
