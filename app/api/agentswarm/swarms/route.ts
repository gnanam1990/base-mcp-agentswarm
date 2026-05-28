import { NextResponse } from "next/server";
import { createItem, listItems } from "@/lib/mvp-store";

function numeric(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function GET() {
  return NextResponse.json({ data: listItems() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    descriptor?: string;
    detail?: string;
    priceUsdc?: number | string;
    payload?: Record<string, unknown>;
  };

  const item = createItem({
    name: body.name?.trim() || "Untitled Swarm",
    descriptor: body.descriptor?.trim() || "Running",
    detail: body.detail?.trim() || "3 approvals",
    priceUsdc: numeric(body.priceUsdc, 0.2),
    payload: body.payload || {"monitor":"active","risk":"within policy","approvals":3},
  });

  return NextResponse.json({ data: item }, { status: 201 });
}
