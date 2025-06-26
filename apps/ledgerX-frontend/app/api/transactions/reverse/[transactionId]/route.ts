import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function POST(request: NextRequest, { params }: { params: { transactionId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Check if user is admin
  if ((session as any).user.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const response = await fetch(`${BACKEND_URL}/api/transactions/reverse/${params.transactionId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${(session as any).accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    return new NextResponse(JSON.stringify(error), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await response.json();
  return new NextResponse(JSON.stringify(data), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}