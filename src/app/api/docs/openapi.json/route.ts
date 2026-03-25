import { swaggerSpec } from '@/libs/swagger';

export async function GET() {
  return new Response(
    JSON.stringify(swaggerSpec, null, 2),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

