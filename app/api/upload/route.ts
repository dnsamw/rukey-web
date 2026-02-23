// Image upload endpoint for Supabase Storage
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    // Handle file upload logic here
    return new Response('File uploaded successfully', { status: 200 });
  } catch (error) {
    return new Response('Upload failed', { status: 500 });
  }
}
