// app/api/chat/route.js  (App Router)
export async function POST(req) {
  const { message } = await req.json();
  // Call Claude, OpenAI, or any LLM here
  return Response.json({ reply: `You said: ${message}` });
}
