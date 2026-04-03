// app/api/admin/route.js
import { getServerSession } from "next-auth";

export async function GET(req) {
  const session = await getServerSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  // proceed...
}