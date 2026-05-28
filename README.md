# AgentSwarm

multi-agent orchestration for Base MCP workflows.

**Status:** Planned tenth build after the suite has reusable modules to orchestrate.

AgentSwarm coordinates specialized agents for monitoring, risk, research, and execution, using existing suite modules as tools and Base MCP for approvals.

## Why It Exists
Base MCP gives AI assistants access to Base Account actions such as balances, sends, swaps, contract calls, and x402 payments, with user approval for writes. This project turns that capability into a focused product for advanced builders, AI-agent operators, and DeFi users who want transparent multi-agent collaboration.

## Core Capabilities
- Agent orchestration runtime with monitor, risk, research, and execution roles.
- Activity dashboard showing agent messages, decisions, tool calls, and approval gates.
- Policy engine for budget caps, max risk, allowed protocols, and human checkpoints.
- Integrations with OnchainOracle, AgentID, DeFi Copilot, VaultAI, and PayGate research.
- MCP tools for launching strategies, pausing swarms, and approving prepared actions.

## Roadmap Snapshot
1. Build read-only orchestration dashboard with simulated agents.
2. Connect agents to suite APIs for data, reputation, and research.
3. Add policy checks and approval gates.
4. Enable one real user-approved strategy flow through Base MCP.
5. Launch advanced demo after safety review and extensive logging.

## Repository Status
This repository is public from day one. It starts with product, architecture, roadmap, and demo documentation. Implementation commits should stay small and use conventional commit prefixes.

## License
MIT
