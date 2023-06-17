import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SliceValidator } from "@/lib/validators/slice";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = SliceValidator.parse(body);

    const sliceExists = await db.slice.findUnique({
      where: {
        name: name,
      },
    });

    if (sliceExists) {
      return new Response("Slice already exists", { status: 409 });
    }

    const slice = await db.slice.create({
      data: {
        name: name,
        creatorId: session.user.id,
      },
    });

    await db.subscription.create({
      data: {
        userId: session.user.id,
        sliceId: slice.id,
      },
    });

    return new Response(slice.name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create slice", { status: 500 });
  }
}
