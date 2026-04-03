// app/api/create-order/route.js
import { z } from "zod";

const schema = z.object({
  amount: z.number().positive().max(1000000),
  productId: z.string().min(1),
});

export async function POST(req) {
  const body = await req.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }
  // proceed safely...
}