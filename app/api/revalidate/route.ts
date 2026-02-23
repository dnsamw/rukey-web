// ISR revalidation trigger
export async function POST(request: Request) {
  try {
    const { path } = await request.json();
    // Revalidate the specified path
    return new Response('Revalidation successful', { status: 200 });
  } catch (error) {
    return new Response('Revalidation failed', { status: 500 });
  }
}
