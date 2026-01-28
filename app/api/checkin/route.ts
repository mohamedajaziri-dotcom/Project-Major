export function GET() {
  return new Response('Checkin API');
}
export async function POST(request: Request) {
  // Handle check-in logic here
  return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
}