import { governanceEngine } from "@/lib/smart-contracts"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { proposalId } = body

    if (!proposalId) {
      return NextResponse.json({ error: "Missing proposal ID" }, { status: 400 })
    }

    const success = governanceEngine.executeProposal(proposalId)

    if (!success) {
      return NextResponse.json({ error: "Failed to execute proposal" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Proposal executed successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to execute proposal" }, { status: 500 })
  }
}
