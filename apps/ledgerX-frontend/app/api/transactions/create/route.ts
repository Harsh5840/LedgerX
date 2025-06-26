import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await request.json();

  const response = await fetch(`${BACKEND_URL}/api/transactions/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${(session as any).accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...body,
      userId: (session as any).user.id,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return new NextResponse(error, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}