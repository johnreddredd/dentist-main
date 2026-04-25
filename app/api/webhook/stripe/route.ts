import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Stripe webhook stub.
 *
 * Real implementation (Part 9 in docs/build-10-parts-cursor-models.md):
 *   - Verify signature with stripe.webhooks.constructEvent
 *   - Handle customer.subscription.{created,updated,deleted} + checkout.session.completed
 *   - Idempotency by event.id
 *   - Sync subscription state to Supabase
 */
export async function POST(_req: NextRequest) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 501 },
    );
  }
  return NextResponse.json({ received: true });
}
