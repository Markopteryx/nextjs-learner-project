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

    if (!subscriptionExists) {
      return new Response("You are not subscribed to this slice", {
        status: 400,
      });
    }

    const slice = await db.slice.findFirst({
      where: {
        id: sliceId,
        creatorId: session.user.id,
      },
    });

    if (slice) {
      return new Response("You cannot unsubscribe from your own slice", {
        status: 400,
      });
    }

    await db.subscription.delete({
      where: {
        userId_sliceId: {
          sliceId,
          userId: session.user.id,
        },
      },
    });

    return new Response(sliceId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not unsubscribe", { status: 500 });
  }
}
