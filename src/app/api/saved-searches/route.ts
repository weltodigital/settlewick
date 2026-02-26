import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { data: savedSearches, error } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching saved searches:', error)
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      )
    }

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
    const supabase = createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const {
      name,
      searchCriteria,
      searchUrl,
      alertEnabled = false
    } = await request.json()

    if (!name || !searchCriteria) {
      return NextResponse.json(
        { message: 'Name and search criteria are required' },
        { status: 400 }
      )
    }

    const { data: savedSearch, error } = await supabase
      .from('saved_searches')
      .insert({
        user_id: user.id,
        name,
        search_params: searchCriteria,
        alert_enabled: alertEnabled
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving search:', error)
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      )
    }

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
    const supabase = createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
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

    const { error } = await supabase
      .from('saved_searches')
      .delete()
      .eq('id', searchId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting saved search:', error)
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
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