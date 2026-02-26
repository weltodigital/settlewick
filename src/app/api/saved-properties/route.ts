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

    const savedProperties = await prisma.savedProperty.findMany({
      where: { userId: session.user.id },
      include: {
        property: {
          include: {
            images: true,
            agent: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(savedProperties)
  } catch (error) {
    console.error('Error fetching saved properties:', error)
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

    const { propertyId } = await request.json()

    if (!propertyId) {
      return NextResponse.json(
        { message: 'Property ID is required' },
        { status: 400 }
      )
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    })

    if (!property) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      )
    }

    // Check if already saved
    const existingSave = await prisma.savedProperty.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId: propertyId
        }
      }
    })

    if (existingSave) {
      return NextResponse.json(
        { message: 'Property already saved' },
        { status: 409 }
      )
    }

    // Save the property
    const savedProperty = await prisma.savedProperty.create({
      data: {
        userId: session.user.id,
        propertyId: propertyId
      },
      include: {
        property: {
          include: {
            images: true,
            agent: true
          }
        }
      }
    })

    return NextResponse.json(savedProperty, { status: 201 })
  } catch (error) {
    console.error('Error saving property:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const propertyId = url.searchParams.get('propertyId')

    if (!propertyId) {
      return NextResponse.json(
        { message: 'Property ID is required' },
        { status: 400 }
      )
    }

    const deletedSave = await prisma.savedProperty.deleteMany({
      where: {
        userId: session.user.id,
        propertyId: propertyId
      }
    })

    if (deletedSave.count === 0) {
      return NextResponse.json(
        { message: 'Saved property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Property removed from saved list' })
  } catch (error) {
    console.error('Error removing saved property:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}