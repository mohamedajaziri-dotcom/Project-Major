export async function POST(request: Request) {
  // Handle callback logic, such as verifying auth tokens
  return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
}
