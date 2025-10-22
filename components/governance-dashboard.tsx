"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { governanceEngine } from "@/lib/smart-contracts"
import { CheckCircle2, XCircle, Clock, Vote } from "lucide-react"

export function GovernanceDashboard() {
  const [proposals, setProposals] = useState(governanceEngine.getActiveProposals())
  const [executedPolicies, setExecutedPolicies] = useState(governanceEngine.getExecutedPolicies())
  const [userAddress] = useState(`0x${Math.random().toString(16).substr(2, 40)}`)

  const handleVote = (proposalId: string, vote: "for" | "against" | "abstain") => {
    const success = governanceEngine.vote(proposalId, userAddress, vote)
    if (success) {
      setProposals([...governanceEngine.getActiveProposals()])
    }
  }

  const handleExecute = (proposalId: string) => {
    const success = governanceEngine.executeProposal(proposalId)
    if (success) {
      setProposals(governanceEngine.getActiveProposals())
      setExecutedPolicies(governanceEngine.getExecutedPolicies())
    }
  }

  return (
    <div className="space-y-6">
      {/* Active Proposals */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-white">Active Governance Proposals</h2>
        <div className="grid gap-4">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="border-slate-700 bg-slate-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white">{proposal.title}</CardTitle>
                    <CardDescription>{proposal.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-blue-500 text-blue-400">
                    {proposal.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Voting Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-slate-700 p-3">
                    <p className="text-xs text-slate-400">For</p>
                    <p className="text-2xl font-bold text-green-400">{proposal.votes.for}</p>
                  </div>
                  <div className="rounded-lg bg-slate-700 p-3">
                    <p className="text-xs text-slate-400">Against</p>
                    <p className="text-2xl font-bold text-red-400">{proposal.votes.against}</p>
                  </div>
                  <div className="rounded-lg bg-slate-700 p-3">
                    <p className="text-xs text-slate-400">Abstain</p>
                    <p className="text-2xl font-bold text-slate-400">{proposal.votes.abstain}</p>
                  </div>
                </div>

                {/* Proposed Rules */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-300">Proposed Rules:</p>
                  {proposal.proposedPolicy.rules.map((rule, idx) => (
                    <div key={idx} className="rounded bg-slate-700 p-2 text-xs text-slate-300">
                      <span className="font-mono">{rule.pattern}</span>
                      <span className="ml-2 text-slate-500">→ {rule.action}</span>
                    </div>
                  ))}
                </div>

                {/* Voting Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleVote(proposal.id, "for")}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Vote For
                  </Button>
                  <Button
                    onClick={() => handleVote(proposal.id, "against")}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Vote Against
                  </Button>
                  <Button
                    onClick={() => handleVote(proposal.id, "abstain")}
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Abstain
                  </Button>
                  <Button onClick={() => handleExecute(proposal.id)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Vote className="mr-2 h-4 w-4" />
                    Execute
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Executed Policies */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-white">Executed On-Chain Policies</h2>
        <div className="space-y-2">
          {executedPolicies.map((policy) => (
            <Card key={policy.id} className="border-slate-700 bg-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm text-slate-300">{policy.id}</p>
                    <p className="text-xs text-slate-500">Executed: {new Date(policy.executedAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-600">Executed</Badge>
                    <p className="mt-1 font-mono text-xs text-slate-400">{policy.transactionHash}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
