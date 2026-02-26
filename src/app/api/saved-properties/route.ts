import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { data: savedProperties, error } = await supabase
      .from('saved_properties')
      .select(`
        *,
        properties:property_id (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching saved properties:', error)
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      )
    }

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
    const supabase = createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
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
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id')
      .eq('id', propertyId)
      .single()

    if (propertyError || !property) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      )
    }

    // Check if already saved
    const { data: existingSave } = await supabase
      .from('saved_properties')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
      .single()

    if (existingSave) {
      return NextResponse.json(
        { message: 'Property already saved' },
        { status: 409 }
      )
    }

    // Save the property
    const { data: savedProperty, error } = await supabase
      .from('saved_properties')
      .insert({
        user_id: user.id,
        property_id: propertyId
      })
      .select(`
        *,
        properties:property_id (*)
      `)
      .single()

    if (error) {
      console.error('Error saving property:', error)
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      )
    }

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
    const supabase = createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
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

    const { error } = await supabase
      .from('saved_properties')
      .delete()
      .eq('user_id', user.id)
      .eq('property_id', propertyId)

    if (error) {
      console.error('Error removing saved property:', error)
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
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