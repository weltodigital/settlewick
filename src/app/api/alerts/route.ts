// Property alerts functionality will be implemented later
// Currently placeholder returning empty data
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json([])
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Alerts not yet implemented' }, { status: 501 })
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json({ message: 'Alerts not yet implemented' }, { status: 501 })
}