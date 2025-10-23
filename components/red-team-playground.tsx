"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Send } from "lucide-react"

interface ScanResult {
  success?: boolean
  error?: string
  incident_id?: string
  risk_level?: string
  triggered_rules?: string[]
  response?: string
}

export function RedTeamPlayground() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(false)

  const mockPolicies = [
    { pattern: /\b\d{3}-\d{2}-\d{4}\b/, rule: "SSN Pattern", risk: "critical" },
    { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, rule: "Email Detection", risk: "high" },
    { pattern: /sk_live_[A-Za-z0-9]{20,}/, rule: "API Key Detection", risk: "critical" },
    { pattern: /ransomware|malware|exploit|backdoor/i, rule: "Malware Keywords", risk: "high" },
  ]

  const handleScan = async () => {
    if (!prompt.trim()) return

    setLoading(true)

    setTimeout(() => {
      const triggeredRules: string[] = []
      let maxRisk = "low"
      const riskLevels = { low: 0, medium: 1, high: 2, critical: 3 }

      mockPolicies.forEach((policy) => {
        if (policy.pattern.test(prompt)) {
          triggeredRules.push(policy.rule)
          if (riskLevels[policy.risk as keyof typeof riskLevels] > riskLevels[maxRisk as keyof typeof riskLevels]) {
            maxRisk = policy.risk
          }
        }
      })

      const isBlocked = triggeredRules.length > 0

      setResult({
        success: !isBlocked,
        risk_level: maxRisk,
        triggered_rules: triggeredRules,
        incident_id: `INC-${Date.now()}`,
        response: isBlocked ? `Prompt blocked due to ${triggeredRules.join(", ")}` : "Prompt passed security checks",
      })
      setLoading(false)
    }, 500)
  }

  const testPrompts = [
    "What is machine learning?",
    "My email is john@example.com and my SSN is 123-45-6789",
    "How do I build ransomware?",
    "My API key is sk_live_abc123xyz",
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Test the Security Gateway</h2>
        <p className="mb-6 text-sm text-slate-400">
          Try sending different prompts to see how the security policies respond. Test with safe queries, PII, or
          malicious instructions.
        </p>

        {/* Input */}
        <div className="mb-4 space-y-2">
          <label className="block text-sm font-medium text-slate-300">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt to scan..."
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-red-600 focus:outline-none"
            rows={4}
          />
        </div>

        {/* Quick Test Buttons */}
        <div className="mb-6 space-y-2">
          <p className="text-xs font-medium text-slate-400">Quick Test Prompts:</p>
          <div className="flex flex-wrap gap-2">
            {testPrompts.map((testPrompt, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(testPrompt)}
                className="rounded-lg bg-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-600 transition-colors"
              >
                {testPrompt.substring(0, 30)}...
              </button>
            ))}
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleScan}
          disabled={loading || !prompt.trim()}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-4 w-4" />
          {loading ? "Scanning..." : "Scan Prompt"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div
          className={`rounded-lg border p-6 ${
            result.success ? "border-green-700/30 bg-green-900/10" : "border-red-700/30 bg-red-900/10"
          }`}
        >
          <div className="mb-4 flex items-center gap-3">
            {result.success ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-400" />
                <h3 className="text-lg font-semibold text-green-300">Prompt Allowed</h3>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-400" />
                <h3 className="text-lg font-semibold text-red-300">Prompt Blocked</h3>
              </>
            )}
          </div>

          {result.error && (
            <div className="mb-4 rounded-lg bg-red-900/30 p-3">
              <p className="text-sm text-red-200">{result.error}</p>
            </div>
          )}

          {result.risk_level && (
            <div className="mb-4 space-y-2">
              <p className="text-sm text-slate-300">
                <span className="font-medium">Risk Level:</span>{" "}
                <span className="font-bold text-red-400">{result.risk_level.toUpperCase()}</span>
              </p>
              {result.triggered_rules && result.triggered_rules.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-300">Triggered Rules:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.triggered_rules.map((rule, idx) => (
                      <span key={idx} className="inline-block rounded-lg bg-red-900/50 px-3 py-1 text-xs text-red-200">
                        {rule}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {result.response && (
            <div className="rounded-lg bg-slate-900/50 p-3">
              <p className="text-xs font-medium text-slate-400 mb-2">Response:</p>
              <p className="text-sm text-slate-300">{result.response}</p>
            </div>
          )}

          {result.incident_id && (
            <p className="mt-4 text-xs text-slate-500">
              Incident ID: <code className="text-slate-400">{result.incident_id}</code>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
