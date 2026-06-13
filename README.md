# AgentSwarm

> Coordinated agent workflows with Base MCP approval gates, gated behind x402 pay-per-run payments.

![License](https://img.shields.io/badge/license-MIT-blue) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## Overview

AgentSwarm is a Next.js application and MCP-style HTTP server for coordinating multi-agent workflows (monitor, research, risk, and execution agents) while keeping policy limits and user approval gates visible. Each agent run is metered and unlocked through an [x402](https://www.x402.org/) payment requirement: callers receive a `402 Payment Required` until they present a valid payment, after which the run executes and a receipt is recorded. It is intended as a console/MVP foundation for builders experimenting with paid agent orchestration on Base.

## Features

- Swarm dashboard with brand theming, swarm metrics, agent workflow, MCP tool list, and a live records surface.
- File-backed swarm registry supporting creation, listing, x402 quote lookup, paid run execution, and receipt recording.
- x402 payment gate: runs return `402 Payment Required` until payment is supplied.
- Two payment modes: `demo` accepts an `x-demo-payment` header for local testing; `strict` requires a real `x-payment` header verified and settled through an x402 facilitator.
- Product status API at `/api/agentswarm/status` returning dashboard data and aggregate stats.
- MCP-compatible JSON endpoint at `/api/mcp/agentswarm` exposing tools for discovery, quote preparation, and stats.
- Smoke test covering creation, listing, quote, unpaid lock, paid unlock, receipt, and the MCP quote tool.

## Tech stack

- **Framework:** Next.js 16 (App Router, Route Handlers)
- **Language:** TypeScript
- **UI:** React 19, lucide-react icons, hand-authored CSS
- **Payments:** x402 (USDC, `exact` scheme) with optional facilitator verify/settle
- **Storage:** local JSON file (no external database driver)

## Architecture

- `app/` — App Router pages and API route handlers.
  - `app/page.tsx` — server-rendered swarm console dashboard.
  - `app/api/agentswarm/swarms/` — swarm registry: list/create, per-swarm `quote`, and `run` (payment-gated).
  - `app/api/agentswarm/status/` — dashboard data and stats.
  - `app/api/mcp/agentswarm/` — MCP-style tool listing (`GET`) and tool execution (`POST`).
- `lib/` — core logic.
  - `lib/mvp-store.ts` — file-backed registry, seed data, stats, and receipt recording.
  - `lib/mvp-payment.ts` — x402 payment requirement construction and payment verification.
  - `lib/project-data.json` / `lib/types.ts` — seed project metadata and shared types.
- `scripts/smoke-test.mjs` — end-to-end smoke checks against a running server.
- `docs/` — architecture, roadmap, UI, and demo notes.

## Getting started

### Prerequisites

- Node.js (a recent LTS; the project targets Next.js 16 and React 19)
- npm

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env.local` and adjust as needed. All variables are optional for the default demo flow; the table below lists the names the code reads.

| Variable | Purpose |
| --- | --- |
| `AGENTSWARM_PAYMENT_MODE` | `demo` (default) accepts the `x-demo-payment` header; `strict` requires a real `x-payment` header and a facilitator. |
| `X402_FACILITATOR_URL` | Base URL of an x402 facilitator used to `/verify` and `/settle` payments in strict mode. |
| `X402_RECEIVING_ADDRESS` | Payout address used in payment requirements. |
| `AGENTSWARM_X402_NETWORK` | x402 network identifier (defaults to `eip155:8453`). |
| `AGENTSWARM_DATA_FILE` | Overrides the local data file path for isolated runs. |
| `NEXT_PUBLIC_APP_URL` | Public app URL for the frontend. |

The `.env.example` also lists `NEXT_PUBLIC_BASE_CHAIN_ID`, `BASE_RPC_URL`, `BASE_ACCOUNT_CLIENT_ID`, `BASE_MCP_URL`, `X402_DEFAULT_NETWORK`, `DATABASE_URL`, and `REDIS_URL` as scaffolding placeholders; these are not yet consumed by the current code.

Local data is written to `.data/agentswarm-db.json` by default (or `/tmp` on Vercel). Set `AGENTSWARM_DATA_FILE` to relocate it.

### Running

```bash
npm run dev -- -p 3009
```

Then open `http://127.0.0.1:3009`.

## Usage

Endpoints (relative to the running server):

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/agentswarm/swarms` | List active swarms. |
| `POST` | `/api/agentswarm/swarms` | Create a swarm. |
| `GET` | `/api/agentswarm/swarms/:slug/quote` | Return the x402 payment requirement for a swarm. |
| `POST` | `/api/agentswarm/swarms/:slug/run` | Execute a paid run after payment verification; records a receipt. |
| `GET` | `/api/agentswarm/status` | Return dashboard data and aggregate stats. |
| `GET` | `/api/mcp/agentswarm` | List MCP tools. |
| `POST` | `/api/mcp/agentswarm` | Run an MCP tool (discovery, `get_swarm_quote`, `prepare_swarm_run`, `get_agentswarm_stats`). |

Example: an unpaid run is blocked, and a demo payment unlocks it.

```bash
# Returns 402 Payment Required
curl -s -X POST http://127.0.0.1:3009/api/agentswarm/swarms/yield-monitor/run

# Demo payment unlocks the run and returns a receipt
curl -s -X POST http://127.0.0.1:3009/api/agentswarm/swarms/yield-monitor/run \
  -H "x-demo-payment: accepted"
```

## Testing

With the dev server running on port 3009:

```bash
npm run test:smoke
```

The smoke test exercises status, swarm creation and listing, quote lookup, the unpaid (402) lock, the demo-paid unlock with receipt, and the MCP quote tool. You can point it at another origin with `AGENTSWARM_BASE_URL`.

Static checks:

```bash
npm run typecheck
npm run build
```

## Status

MVP foundation. The dashboard, file-backed registry, x402 quote/run flow, receipts, and the MCP endpoint are implemented and exercised by the smoke test. The demo payment mode is intended for local development; strict mode performs real facilitator `verify`/`settle` calls and fails closed on rejection, but has not been wired against a production facilitator here. Storage is a local JSON file rather than a database, and several `.env.example` keys (chain/account/database/redis) are placeholders not yet consumed by the code. Wallet and approval-gate execution against Base MCP are still on the roadmap.

## License

MIT — see [LICENSE](LICENSE).
