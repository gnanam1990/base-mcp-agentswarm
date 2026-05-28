const baseUrl = process.env.AGENTSWARM_BASE_URL || "http://127.0.0.1:3009";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function request(path, options = {}, expectedStatus = 200) {
  const response = await fetch(new URL(path, baseUrl), options);
  const json = await response.json();
  assert(
    response.status === expectedStatus,
    `${path} expected ${expectedStatus}, received ${response.status}: ${JSON.stringify(json)}`,
  );
  return { response, json };
}

const status = await request("/api/agentswarm/status");
assert(status.json.data.name, "dashboard should expose project name");
assert(status.json.data.metrics.length === 3, "dashboard should expose three metrics");
assert(status.json.data.workflow.length === 4, "agent flow should expose four steps");
assert(status.json.data.tools.length >= 4, "MCP tool list should be present");

const created = await request(
  "/api/agentswarm/swarms",
  {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: `Smoke research swarm ${Date.now()}`,
      descriptor: "Running",
      detail: "3 approvals",
      priceUsdc: 0.2,
      payload: {"monitor":"active","risk":"within policy","approvals":3},
    }),
  },
  201,
);

const item = created.json.data;
assert(item.slug, "created swarm should include a slug");

const listed = await request("/api/agentswarm/swarms");
assert(
  listed.json.data.some((entry) => entry.slug === item.slug),
  "swarm list should include created item",
);

const quote = await request(`/api/agentswarm/swarms/${item.slug}/quote`);
assert(quote.json.data.payment.scheme === "exact", "quote should expose exact payment scheme");
assert(quote.json.data.payment.asset === "USDC", "quote should request USDC");

const unpaid = await request(
  `/api/agentswarm/swarms/${item.slug}/run`,
  {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ intent: "unpaid call should be blocked" }),
  },
  402,
);
assert(unpaid.json.error === "payment_required", "unpaid run should require payment");

const paid = await request(`/api/agentswarm/swarms/${item.slug}/run`, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-demo-payment": "accepted",
  },
  body: JSON.stringify({ intent: "paid call should unlock" }),
});
assert(paid.json.receipt.itemSlug === item.slug, "paid run should return a receipt");
assert(paid.response.headers.get("payment-response"), "paid run should emit payment-response");

const mcp = await request("/api/mcp/agentswarm", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    tool: "get_swarm_quote",
    arguments: { slug: item.slug },
  }),
});
assert(mcp.json.data.slug === item.slug, "MCP quote tool should resolve created item");

console.log(`${status.json.data.name} smoke checks passed against ${baseUrl}`);
