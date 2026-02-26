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

    const savedSearches = await prisma.savedSearch.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(savedSearches)
  } catch (error) {
    console.error('Error fetching saved searches:', error)
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
      searchParams,
      alertEnabled = false,
      alertFrequency = 'DAILY'
    } = await request.json()

    if (!name || !searchParams) {
      return NextResponse.json(
        { message: 'Name and search parameters are required' },
        { status: 400 }
      )
    }

    const savedSearch = await prisma.savedSearch.create({
      data: {
        userId: session.user.id,
        name,
        searchParams,
        alertEnabled,
        alertFrequency
      }
    })

    return NextResponse.json(savedSearch, { status: 201 })
  } catch (error) {
    console.error('Error saving search:', error)
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
    const searchId = url.searchParams.get('searchId')

    if (!searchId) {
      return NextResponse.json(
        { message: 'Search ID is required' },
        { status: 400 }
      )
    }

    const deletedSearch = await prisma.savedSearch.deleteMany({
      where: {
        id: searchId,
        userId: session.user.id
      }
    })

    if (deletedSearch.count === 0) {
      return NextResponse.json(
        { message: 'Saved search not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Saved search deleted' })
  } catch (error) {
    console.error('Error deleting saved search:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}