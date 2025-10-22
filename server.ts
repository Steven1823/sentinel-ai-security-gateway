import express, { type Request, type Response } from "express"
import cors from "cors"
import Database from "better-sqlite3"
import crypto from "crypto"
import path from "path"
import fs from "fs"

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Initialize SQLite Database
const dbPath = path.join(process.cwd(), "db.sqlite")
const db = new Database(dbPath)

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS incidents (
    id TEXT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    type TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    prompt TEXT,
    response TEXT,
    triggered_rules TEXT,
    action TEXT NOT NULL,
    status TEXT DEFAULT 'logged'
  );

  CREATE TABLE IF NOT EXISTS policies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    pattern TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    action TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`)

// Load or create default policies
interface Policy {
  id: string
  name: string
  pattern: string
  risk_level: string
  action: string
}

const loadPolicies = (): Policy[] => {
  const policyPath = path.join(process.cwd(), "policy.json")
  if (fs.existsSync(policyPath)) {
    return JSON.parse(fs.readFileSync(policyPath, "utf-8"))
  }
  return []
}

const defaultPolicies: Policy[] = [
  {
    id: "pii-email",
    name: "Email Detection",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    risk_level: "medium",
    action: "mask",
  },
  {
    id: "pii-ssn",
    name: "SSN Detection",
    pattern: "\\b\\d{3}-\\d{2}-\\d{4}\\b",
    risk_level: "high",
    action: "block",
  },
  {
    id: "malware-keywords",
    name: "Malware Keywords",
    pattern: "(ransomware|exfiltrate|backdoor|exploit|shellcode)",
    risk_level: "critical",
    action: "block",
  },
  {
    id: "secret-keys",
    name: "API Keys & Secrets",
    pattern: "(api[_-]?key|secret[_-]?key|password|token)\\s*[:=]",
    risk_level: "high",
    action: "block",
  },
  {
    id: "code-injection",
    name: "Code Injection Patterns",
    pattern: "(eval\\(|exec\\(|system\\(|__import__|subprocess)",
    risk_level: "critical",
    action: "block",
  },
]

// Initialize policies
let policies = loadPolicies()
if (policies.length === 0) {
  policies = defaultPolicies
  fs.writeFileSync(path.join(process.cwd(), "policy.json"), JSON.stringify(policies, null, 2))
}

// Utility: Hash prompt for logging
const hashPrompt = (text: string): string => {
  return crypto.createHash("sha256").update(text).digest("hex")
}

// Utility: Scan text against policies
interface ScanResult {
  safe: boolean
  risk_level: string
  triggered_rules: string[]
  action: string
  masked_content?: string
}

const scanText = (text: string, type: "prompt" | "response"): ScanResult => {
  const triggered_rules: string[] = []
  let maxRiskLevel = "low"
  let action = "allow"
  let masked_content = text

  const riskLevels = { low: 0, medium: 1, high: 2, critical: 3 }

  for (const policy of policies) {
    try {
      const regex = new RegExp(policy.pattern, "gi")
      if (regex.test(text)) {
        triggered_rules.push(policy.name)

        if (
          riskLevels[policy.risk_level as keyof typeof riskLevels] > riskLevels[maxRiskLevel as keyof typeof riskLevels]
        ) {
          maxRiskLevel = policy.risk_level
        }

        if (riskLevels[policy.action as any] === undefined) {
          if (policy.action === "block") {
            action = "block"
          } else if (policy.action === "mask" && action !== "block") {
            action = "mask"
            masked_content = text.replace(regex, "[REDACTED]")
          }
        }
      }
    } catch (e) {
      console.error(`Error processing policy ${policy.id}:`, e)
    }
  }

  return {
    safe: action === "allow",
    risk_level: maxRiskLevel,
    triggered_rules,
    action,
    masked_content: action === "mask" ? masked_content : undefined,
  }
}

// API: Gateway endpoint
app.post("/api/gateway", (req: Request, res: Response) => {
  const { prompt, model = "gpt-4" } = req.body

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" })
  }

  // Scan prompt
  const promptScan = scanText(prompt, "prompt")
  const incidentId = crypto.randomUUID()

  if (!promptScan.safe) {
    // Log incident
    const stmt = db.prepare(`
      INSERT INTO incidents (id, type, risk_level, prompt, triggered_rules, action)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    stmt.run(
      incidentId,
      "prompt_blocked",
      promptScan.risk_level,
      hashPrompt(prompt),
      JSON.stringify(promptScan.triggered_rules),
      promptScan.action,
    )

    return res.status(403).json({
      error: "Prompt blocked due to security policy",
      incident_id: incidentId,
      risk_level: promptScan.risk_level,
      triggered_rules: promptScan.triggered_rules,
    })
  }

  // Simulate LLM response (in production, call actual LLM)
  const mockResponse = `This is a safe response to: "${prompt.substring(0, 50)}..."`

  // Scan response
  const responseScan = scanText(mockResponse, "response")

  if (!responseScan.safe) {
    const stmt = db.prepare(`
      INSERT INTO incidents (id, type, risk_level, response, triggered_rules, action)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    stmt.run(
      incidentId,
      "response_blocked",
      responseScan.risk_level,
      hashPrompt(mockResponse),
      JSON.stringify(responseScan.triggered_rules),
      responseScan.action,
    )

    return res.status(403).json({
      error: "Response blocked due to security policy",
      incident_id: incidentId,
      risk_level: responseScan.risk_level,
      triggered_rules: responseScan.triggered_rules,
    })
  }

  // Log successful request
  const stmt = db.prepare(`
    INSERT INTO incidents (id, type, risk_level, prompt, response, action)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  stmt.run(incidentId, "request_allowed", "low", hashPrompt(prompt), hashPrompt(mockResponse), "allow")

  res.json({
    success: true,
    incident_id: incidentId,
    response: responseScan.masked_content || mockResponse,
    model,
  })
})

// API: Get incidents
app.get("/api/incidents", (req: Request, res: Response) => {
  const limit = Number.parseInt(req.query.limit as string) || 50
  const stmt = db.prepare(`
    SELECT * FROM incidents ORDER BY timestamp DESC LIMIT ?
  `)
  const incidents = stmt.all(limit)
  res.json(incidents)
})

// API: Get incident details
app.get("/api/incidents/:id", (req: Request, res: Response) => {
  const { id } = req.params
  const stmt = db.prepare("SELECT * FROM incidents WHERE id = ?")
  const incident = stmt.get(id)

  if (!incident) {
    return res.status(404).json({ error: "Incident not found" })
  }

  res.json(incident)
})

// API: Get policies
app.get("/api/policies", (req: Request, res: Response) => {
  res.json(policies)
})

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Sentinel.AI Gateway running on http://localhost:${PORT}`)
  console.log(`Database: ${dbPath}`)
})
