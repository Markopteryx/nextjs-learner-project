import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SliceSubscriptionValidator } from "@/lib/validators/slice";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorised", { status: 401 });
    }

    const body = await req.json();

    const { sliceId } = SliceSubscriptionValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        sliceId,
        userId: session.user.id,
      },
    });

    if (subscriptionExists) {
      return new Response("You are already subscribed", { status: 400 });
    }

    await db.subscription.create({
      data: {
        sliceId,
        userId: session.user.id,
      },
    });

    return new Response(sliceId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not subscribe", { status: 500 });
  }
}
