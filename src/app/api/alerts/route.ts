import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const alerts = await prisma.propertyAlert.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const {
      name,
      alertCriteria,
      frequency = 'DAILY',
      isActive = true
    } = await request.json()

    if (!name || !alertCriteria) {
      return NextResponse.json(
        { message: 'Name and alert criteria are required' },
        { status: 400 }
      )
    }

    const alert = await prisma.propertyAlert.create({
      data: {
        userId: session.user.id,
        name,
        alertCriteria,
        frequency,
        isActive
      }
    })

    return NextResponse.json(alert, { status: 201 })
  } catch (error) {
    console.error('Error creating alert:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { alertId, isActive } = await request.json()

    if (!alertId || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { message: 'Alert ID and isActive are required' },
        { status: 400 }
      )
    }

    const updatedAlert = await prisma.propertyAlert.updateMany({
      where: {
        id: alertId,
        userId: session.user.id
      },
      data: { isActive }
    })

    if (updatedAlert.count === 0) {
      return NextResponse.json(
        { message: 'Alert not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Alert updated successfully' })
  } catch (error) {
    console.error('Error updating alert:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}