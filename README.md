# AgentSwarm

Coordinated agent workflows with Base MCP approval gates.

**Status:** Swarm console MVP foundation

Coordinate monitor, research, risk, and execution agents while keeping policy limits and user approval gates visible.

## Current MVP
- Base industrial-neon UI theme from the shared suite prompt.
- Responsive dashboard with wallet/action controls, live swarm metrics, workflow, MCP tools, and record surface.
- File-backed swarm registry with creation, x402 quote lookup, paid agent run execution, and receipt recording.
- Demo x402 flow that returns `402 Payment Required` until a payment header or demo payment approval is provided.
- Product status API at `/api/agentswarm/status`.
- MCP-compatible JSON endpoint at `/api/mcp/agentswarm`.
- Smoke checks for creation, listing, quote, unpaid lock, paid unlock, receipt, and MCP quote.

## API Surface
- `GET /api/agentswarm/swarms` lists active swarms.
- `POST /api/agentswarm/swarms` creates a swarm.
- `GET /api/agentswarm/swarms/:slug/quote` returns the x402 payment requirement.
- `POST /api/agentswarm/swarms/:slug/run` executes the paid agent run after payment verification and records a receipt.
- `GET /api/agentswarm/status` returns dashboard data and stats.
- `GET /api/mcp/agentswarm` lists MCP tools.
- `POST /api/mcp/agentswarm` runs MVP tools for discovery, quote preparation, and stats.

## Local Development
```bash
npm install
npm run dev -- -p 3009
```

Open `http://127.0.0.1:3009`.

Local data is written to `.data/agentswarm-db.json`. Override it with `AGENTSWARM_DATA_FILE` for isolated runs.

## Environment
Copy `.env.example` to `.env.local` when you need custom payment behavior.

- `AGENTSWARM_PAYMENT_MODE=demo` accepts the `x-demo-payment: accepted` header for local demos.
- `AGENTSWARM_PAYMENT_MODE=strict` requires a real `x-payment` header and facilitator configuration.
- `X402_FACILITATOR_URL` points to a facilitator that can verify and settle x402 payments.
- `X402_RECEIVING_ADDRESS` sets the payout address for paid runs.

## Checks
```bash
npm run typecheck
npm run build
npm run test:smoke
```

## Next Build Slice
Add persistent run logs, budget enforcement, and Base MCP approval execution gates.

## License
MIT
