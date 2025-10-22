# Sentinel.AI Security Gateway

A production-ready AI security gateway with real-time threat detection, decentralized governance, and cross-agent integration for the SingularityNET/Fetch.ai ecosystem.

## Overview

Sentinel.AI is an intelligent security layer for AI applications that:
- **Scans prompts and responses** in real-time using regex-based policy rules
- **Detects threats** including PII, malware keywords, code injection, API keys, and SSN patterns
- **Logs incidents** with risk scoring (low, medium, high, critical) to SQLite
- **Integrates with uAgents** for decentralized policy management
- **Enables on-chain governance** with stakeholder voting on security policies
- **Provides MeTTa logic engine** for declarative policy reasoning
- **Supports cross-agent communication** via REST APIs

## Features

### Core Security
- **Real-time Scanning** - Prompt and response analysis with configurable policies
- **Risk Scoring** - Automatic threat classification with action recommendations (allow, mask, block)
- **Audit Logging** - Complete incident history with SHA256 hashing for sensitive data
- **Offline Capability** - Local SQLite storage for operation without external dependencies

### Decentralized Integration
- **uAgents Network** - Register and communicate with agents in Agentverse
- **Smart Contract Governance** - On-chain voting with 66% majority threshold
- **MeTTa Logic Engine** - Declarative policy rules with priority-based inference
- **Agent Registry** - Discover and monitor active agents in the network
- **Policy Broadcasting** - Distribute security policies across all connected agents

### Dashboard & Monitoring
- **Incident Dashboard** - Real-time visualization of security events with filtering
- **Governance Dashboard** - Active proposals, voting interface, and execution tracking
- **Red-Team Playground** - Test security policies with sample payloads
- **Agent Registry UI** - Monitor agent status, roles, and network health

## Tech Stack

### Backend
- **Node.js + Express** - REST API server
- **SQLite** - Audit logging and incident storage
- **Fetch.ai uAgents SDK** - Agent communication and network integration
- **Web3.py** - Smart contract interaction

### Frontend
- **React** - UI framework
- **Next.js** - Full-stack framework with App Router
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Pre-built UI components
- **Recharts** - Data visualization

## Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ (for smart contract integration)

### Setup

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/sentinel-ai.git
   cd sentinel-ai
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure environment variables**
   Create a `.env.local` file:
   \`\`\`env
   # uAgents Configuration
   NEXT_PUBLIC_AGENT_NETWORK=testnet
   AGENT_SEED_PHRASE=your_seed_phrase_here
   
   # Smart Contract Configuration
   CONTRACT_ADDRESS=0x...
   PROVIDER_URL=https://your-rpc-endpoint
   PRIVATE_KEY=your_private_key
   
   # Database
   DATABASE_URL=sqlite:./audit.db
   \`\`\`

4. **Start the backend server**
   \`\`\`bash
   node server.ts
   \`\`\`
   The server runs on `http://localhost:3000`

5. **Start the frontend (in another terminal)**
   \`\`\`bash
   npm run dev
   \`\`\`
   The dashboard runs on `http://localhost:3001`

## Usage

### Testing Security Policies

1. Open the **Red-Team Playground** tab
2. Enter a test prompt or select a sample payload
3. Click "Test Prompt" to scan against active policies
4. View results showing detected threats and risk level

### Viewing Incidents

1. Navigate to the **Incident Dashboard** tab
2. Filter by risk level, action type, or date range
3. Click on incidents to view full details including triggered rules

### Managing Governance

1. Go to the **Governance Dashboard** tab
2. View active proposals and vote (For/Against/Abstain)
3. Approved proposals are automatically executed on-chain
4. View execution history with transaction hashes

### Registering Agents

1. Open the **Agent Registry** tab
2. Click "Register New Agent" and provide:
   - Agent name and address
   - Role (gateway, policy-manager, auditor, governance)
   - Network endpoint
3. Agent appears in the network registry and receives policy broadcasts

## API Endpoints

### Security Scanning
- `POST /api/gateway` - Scan prompt/response against policies
- `GET /api/incidents` - Retrieve audit logs with filtering

### Agent Management
- `POST /api/agents/register` - Register new agent
- `GET /api/agents/list` - List active agents
- `POST /api/policy/broadcast` - Broadcast policy to network

### Governance
- `POST /api/governance/propose` - Create governance proposal
- `POST /api/governance/vote` - Vote on proposal
- `POST /api/governance/execute` - Execute approved proposal
- `POST /api/incidents/report` - Report incident from agent

## Policy Configuration

Policies are defined in `policy.json` with regex patterns and risk levels:

\`\`\`json
{
  "rules": [
    {
      "id": "pii-detection",
      "name": "PII Detection",
      "pattern": "\\b\\d{3}-\\d{2}-\\d{4}\\b",
      "riskLevel": "high",
      "action": "mask",
      "description": "Detects Social Security Numbers"
    }
  ]
}
\`\`\`

## Architecture

\`\`\`
┌─────────────────────────────────────────┐
│         React Dashboard                 │
│  (Incidents, Governance, Red-Team)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Next.js API Routes                 │
│  (Gateway, Agents, Governance, Policy)  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│    Express Backend Server               │
│  (Policy Engine, Audit Logging)         │
└──────────────┬──────────────────────────┘
               │
      ┌────────┼────────┐
      │        │        │
   ┌──▼──┐ ┌──▼──┐ ┌───▼────┐
   │SQLite│ │uAgents│ │Smart   │
   │      │ │Network│ │Contracts│
   └──────┘ └──────┘ └────────┘
\`\`\`

## Integration with SingularityNET/Fetch.ai

Sentinel.AI is fully integrated with the decentralized AI agent ecosystem:

- **uAgents** - Agents register and communicate via the Fetch.ai network
- **Agentverse** - Discover and interact with other security agents
- **MeTTa** - Logic-based policy reasoning and inference
- **Smart Contracts** - On-chain governance and policy execution
- **Cross-Agent APIs** - Standardized REST endpoints for interoperability

## Development

### Project Structure
\`\`\`
sentinel-ai/
├── app/
│   ├── api/              # API routes
│   ├── page.tsx          # Main dashboard
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── incident-dashboard.tsx
│   ├── governance-dashboard.tsx
│   ├── agent-registry.tsx
│   └── red-team-playground.tsx
├── lib/
│   ├── uagents-client.ts
│   ├── smart-contracts.ts
│   ├── metta-engine.ts
│   └── utils.ts
├── server.ts             # Express backend
├── policy.json           # Security policies
└── audit.db              # SQLite database
\`\`\`

### Running Tests

\`\`\`bash
# Test security policies
npm run test:policies

# Test API endpoints
npm run test:api

# Test agent communication
npm run test:agents
\`\`\`

## Deployment

### Deploy to Vercel

\`\`\`bash
vercel deploy
\`\`\`

### Deploy Backend

\`\`\`bash
# Using PM2 for production
pm2 start server.ts --name "sentinel-ai"
pm2 save
\`\`\`

## Security Considerations

- **Row-Level Security** - Implement RLS for multi-tenant deployments
- **API Authentication** - Secure endpoints with JWT tokens
- **Policy Validation** - Validate all policies before execution
- **Audit Trails** - Maintain complete incident history for compliance
- **Rate Limiting** - Implement rate limits on scanning endpoints

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review the API reference

## Acknowledgments

- Built with React, Next.js, and Tailwind CSS
- Integrated with Fetch.ai uAgents and SingularityNET ecosystem
- Security patterns inspired by industry best practices
