# AgentSwarm Architecture

## Product Role
AgentSwarm coordinates specialized agents for monitoring, risk, research, and execution, using existing suite modules as tools and Base MCP for approvals.

## System Shape
- Frontend app: Next.js, TypeScript, Tailwind, shadcn-style components, responsive dashboards.
- API layer: Node/TypeScript endpoints for product reads, prepare flows, analytics, and x402-gated access.
- Base layer: Base Account for user approval and Base MCP for assistant-driven actions.
- Payment layer: x402 for paid API/content/service access using USDC on Base or Base Sepolia.
- Data layer: PostgreSQL for durable product state and Redis for cache/session/rate-limit workloads.
- Contracts: Solidity/Foundry only where the module needs onchain state or settlement logic.

## Main Modules
- Agent orchestration runtime with monitor, risk, research, and execution roles.
- Activity dashboard showing agent messages, decisions, tool calls, and approval gates.
- Policy engine for budget caps, max risk, allowed protocols, and human checkpoints.
- Integrations with OnchainOracle, AgentID, DeFi Copilot, VaultAI, and PayGate research.
- MCP tools for launching strategies, pausing swarms, and approving prepared actions.

## Data Model
- Swarm definitions, agent roles, policies, runs, tool calls, and decisions.
- Approval checkpoints, prepared transactions, and final execution receipts.
- Metrics for strategy performance, safety interventions, and agent reliability.
- User-visible audit logs.

## MCP And x402 Pattern
Every write action should be exposed as a prepare endpoint that returns unsigned calldata or a payment request. MCP/plugin documentation must explain onboarding, read endpoints, prepare endpoints, and the mapping into Base MCP actions.

For paid resources, endpoints should return an x402 payment requirement before serving premium data. The app must enforce a user-defined max payment cap and record receipts for analytics and support.

## Safety Defaults
- Base Sepolia first, then Base mainnet.
- No private keys in app config.
- No hidden approvals or auto-execution.
- Clear user review before paid access or onchain writes.
- Placeholder env vars only in committed files.
