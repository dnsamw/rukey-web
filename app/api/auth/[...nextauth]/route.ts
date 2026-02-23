// NextAuth authentication route
// Configure your authentication provider here
export async function GET(request: Request) {
  return new Response('Authentication endpoint', { status: 200 });
}

export async function POST(request: Request) {
  return new Response('Authentication endpoint', { status: 200 });
}
