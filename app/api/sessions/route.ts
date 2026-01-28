export async function POST(request: Request) {
  // Handle session logic
  return new Response(JSON.stringify({ status: 'session handled' }), { status: 200 });
}