export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          slug: string
          listing_type: 'sale' | 'rent'
          status: 'available' | 'under_offer' | 'sstc' | 'sold' | 'let_agreed' | 'let'
          price: number
          price_qualifier: 'guide_price' | 'offers_over' | 'offers_in_region' | 'fixed_price' | 'from' | 'poa'
          property_type: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'bungalow' | 'maisonette' | 'cottage' | 'town_house' | 'park_home' | 'land' | 'other'
          new_build: boolean

          // Address
          address_line_1: string
          address_line_2: string | null
          address_town: string
          address_county: string
          address_postcode: string
          latitude: number
          longitude: number
          location: unknown // PostGIS POINT

          // Core specs
          bedrooms: number
          bathrooms: number
          reception_rooms: number | null
          floor_area_sqft: number | null
          floor_area_sqm: number | null
          plot_size_sqft: number | null
          floor_level: 'ground' | 'first' | 'second' | 'upper' | 'top' | null

          // Tenure & leasehold details
          tenure: 'freehold' | 'leasehold' | 'share_of_freehold' | 'commonhold'
          lease_length_remaining: number | null
          service_charge_annual: number | null
          ground_rent_annual: number | null

          // Energy
          epc_rating: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | null
          epc_potential_rating: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | null
          heating_type: 'gas_central' | 'electric' | 'oil' | 'heat_pump' | 'biomass' | 'district' | 'other' | null
          mains_gas: boolean | null
          mains_sewer: boolean | null
          estimated_annual_energy_cost: number | null

          // Outdoor & parking
          garden_type: 'private' | 'communal' | 'none' | null
          garden_orientation: 'north' | 'south' | 'east' | 'west' | null
          parking_type: 'driveway' | 'garage' | 'allocated' | 'on_street' | 'none' | null
          ev_charging: boolean

          // Property features
          period_property: boolean
          modern: boolean
          cottage: boolean
          fixer_upper: boolean
          utility_room: boolean
          basement: boolean
          conservatory: boolean
          home_office: boolean
          en_suite: boolean
          bathtub: boolean
          patio: boolean
          kitchen_island: boolean
          loft_conversion: boolean
          annexe: boolean
          open_plan_kitchen: boolean
          separate_dining_room: boolean
          downstairs_wc: boolean
          double_glazing: boolean
          log_burner: boolean
          solar_panels: boolean
          underfloor_heating: boolean
          wet_room: boolean
          walk_in_wardrobe: boolean
          bifold_doors: boolean
          bay_windows: boolean
          original_features: boolean
          cellar: boolean
          garage: boolean
          outbuildings: boolean
          swimming_pool: boolean
          balcony: boolean
          roof_terrace: boolean

          // Rental-specific
          furnished: 'furnished' | 'unfurnished' | 'part_furnished' | null
          pets_allowed: boolean | null
          bills_included: boolean | null
          deposit_amount: number | null
          available_from: string | null
          min_tenancy_months: number | null

          // Status & transparency
          chain_free: boolean | null
          listed_date: string
          price_changed_date: string | null
          original_price: number | null

          // Content
          description: string
          summary: string

          // Relationships
          agent_id: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          listing_type: 'sale' | 'rent'
          status?: 'available' | 'under_offer' | 'sstc' | 'sold' | 'let_agreed' | 'let'
          price: number
          price_qualifier?: 'guide_price' | 'offers_over' | 'offers_in_region' | 'fixed_price' | 'from' | 'poa'
          property_type: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'bungalow' | 'maisonette' | 'cottage' | 'town_house' | 'park_home' | 'land' | 'other'
          new_build?: boolean

          // Address
          address_line_1: string
          address_line_2?: string | null
          address_town: string
          address_county: string
          address_postcode: string
          latitude: number
          longitude: number
          location?: unknown

          // Core specs
          bedrooms: number
          bathrooms: number
          reception_rooms?: number | null
          floor_area_sqft?: number | null
          floor_area_sqm?: number | null
          plot_size_sqft?: number | null
          floor_level?: 'ground' | 'first' | 'second' | 'upper' | 'top' | null

          // Tenure & leasehold details
          tenure: 'freehold' | 'leasehold' | 'share_of_freehold' | 'commonhold'
          lease_length_remaining?: number | null
          service_charge_annual?: number | null
          ground_rent_annual?: number | null

          // Energy
          epc_rating?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | null
          epc_potential_rating?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | null
          heating_type?: 'gas_central' | 'electric' | 'oil' | 'heat_pump' | 'biomass' | 'district' | 'other' | null
          mains_gas?: boolean | null
          mains_sewer?: boolean | null
          estimated_annual_energy_cost?: number | null

          // Outdoor & parking
          garden_type?: 'private' | 'communal' | 'none' | null
          garden_orientation?: 'north' | 'south' | 'east' | 'west' | null
          parking_type?: 'driveway' | 'garage' | 'allocated' | 'on_street' | 'none' | null
          ev_charging?: boolean

          // Property features
          period_property?: boolean
          modern?: boolean
          cottage?: boolean
          fixer_upper?: boolean
          utility_room?: boolean
          basement?: boolean
          conservatory?: boolean
          home_office?: boolean
          en_suite?: boolean
          bathtub?: boolean
          patio?: boolean
          kitchen_island?: boolean
          loft_conversion?: boolean
          annexe?: boolean
          open_plan_kitchen?: boolean
          separate_dining_room?: boolean
          downstairs_wc?: boolean
          double_glazing?: boolean
          log_burner?: boolean
          solar_panels?: boolean
          underfloor_heating?: boolean
          wet_room?: boolean
          walk_in_wardrobe?: boolean
          bifold_doors?: boolean
          bay_windows?: boolean
          original_features?: boolean
          cellar?: boolean
          garage?: boolean
          outbuildings?: boolean
          swimming_pool?: boolean
          balcony?: boolean
          roof_terrace?: boolean

          // Rental-specific
          furnished?: 'furnished' | 'unfurnished' | 'part_furnished' | null
          pets_allowed?: boolean | null
          bills_included?: boolean | null
          deposit_amount?: number | null
          available_from?: string | null
          min_tenancy_months?: number | null

          // Status & transparency
          chain_free?: boolean | null
          listed_date?: string
          price_changed_date?: string | null
          original_price?: number | null

          // Content
          description: string
          summary: string

          // Relationships
          agent_id: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          listing_type?: 'sale' | 'rent'
          status?: 'available' | 'under_offer' | 'sstc' | 'sold' | 'let_agreed' | 'let'
          price?: number
          price_qualifier?: 'guide_price' | 'offers_over' | 'offers_in_region' | 'fixed_price' | 'from' | 'poa'
          property_type?: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'bungalow' | 'maisonette' | 'cottage' | 'town_house' | 'park_home' | 'land' | 'other'
          new_build?: boolean

          // Address
          address_line_1?: string
          address_line_2?: string | null
          address_town?: string
          address_county?: string
          address_postcode?: string
          latitude?: number
          longitude?: number
          location?: unknown

          // Core specs
          bedrooms?: number
          bathrooms?: number
          reception_rooms?: number | null
          floor_area_sqft?: number | null
          floor_area_sqm?: number | null
          plot_size_sqft?: number | null
          floor_level?: 'ground' | 'first' | 'second' | 'upper' | 'top' | null

          // Tenure & leasehold details
          tenure?: 'freehold' | 'leasehold' | 'share_of_freehold' | 'commonhold'
          lease_length_remaining?: number | null
          service_charge_annual?: number | null
          ground_rent_annual?: number | null

          // Energy
          epc_rating?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | null
          epc_potential_rating?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | null
          heating_type?: 'gas_central' | 'electric' | 'oil' | 'heat_pump' | 'biomass' | 'district' | 'other' | null
          mains_gas?: boolean | null
          mains_sewer?: boolean | null
          estimated_annual_energy_cost?: number | null

          // Outdoor & parking
          garden_type?: 'private' | 'communal' | 'none' | null
          garden_orientation?: 'north' | 'south' | 'east' | 'west' | null
          parking_type?: 'driveway' | 'garage' | 'allocated' | 'on_street' | 'none' | null
          ev_charging?: boolean

          // Property features
          period_property?: boolean
          modern?: boolean
          cottage?: boolean
          fixer_upper?: boolean
          utility_room?: boolean
          basement?: boolean
          conservatory?: boolean
          home_office?: boolean
          en_suite?: boolean
          bathtub?: boolean
          patio?: boolean
          kitchen_island?: boolean
          loft_conversion?: boolean
          annexe?: boolean
          open_plan_kitchen?: boolean
          separate_dining_room?: boolean
          downstairs_wc?: boolean
          double_glazing?: boolean
          log_burner?: boolean
          solar_panels?: boolean
          underfloor_heating?: boolean
          wet_room?: boolean
          walk_in_wardrobe?: boolean
          bifold_doors?: boolean
          bay_windows?: boolean
          original_features?: boolean
          cellar?: boolean
          garage?: boolean
          outbuildings?: boolean
          swimming_pool?: boolean
          balcony?: boolean
          roof_terrace?: boolean

          // Rental-specific
          furnished?: 'furnished' | 'unfurnished' | 'part_furnished' | null
          pets_allowed?: boolean | null
          bills_included?: boolean | null
          deposit_amount?: number | null
          available_from?: string | null
          min_tenancy_months?: number | null

          // Status & transparency
          chain_free?: boolean | null
          listed_date?: string
          price_changed_date?: string | null
          original_price?: number | null

          // Content
          description?: string
          summary?: string

          // Relationships
          agent_id?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          image_url: string
          caption: string | null
          display_order: number
          is_floorplan: boolean
          is_primary: boolean
          room_tag: 'kitchen' | 'living_room' | 'bedroom_1' | 'bedroom_2' | 'bathroom' | 'garden' | 'exterior' | 'other' | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          image_url: string
          caption?: string | null
          display_order?: number
          is_floorplan?: boolean
          is_primary?: boolean
          room_tag?: 'kitchen' | 'living_room' | 'bedroom_1' | 'bedroom_2' | 'bathroom' | 'garden' | 'exterior' | 'other' | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          image_url?: string
          caption?: string | null
          display_order?: number
          is_floorplan?: boolean
          is_primary?: boolean
          room_tag?: 'kitchen' | 'living_room' | 'bedroom_1' | 'bedroom_2' | 'bathroom' | 'garden' | 'exterior' | 'other' | null
          created_at?: string
        }
        Relationships: []
      }
      property_price_history: {
        Row: {
          id: string
          property_id: string
          event_type: 'listed' | 'price_reduced' | 'price_increased' | 'sstc' | 'under_offer' | 'back_on_market' | 'sold' | 'withdrawn' | 'let_agreed' | 'let'
          price: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          event_type: 'listed' | 'price_reduced' | 'price_increased' | 'sstc' | 'under_offer' | 'back_on_market' | 'sold' | 'withdrawn' | 'let_agreed' | 'let'
          price: number
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          event_type?: 'listed' | 'price_reduced' | 'price_increased' | 'sstc' | 'under_offer' | 'back_on_market' | 'sold' | 'withdrawn' | 'let_agreed' | 'let'
          price?: number
          date?: string
          created_at?: string
        }
        Relationships: []
      }
      agents: {
        Row: {
          id: string
          name: string
          slug: string
          branch_name: string | null
          email: string
          phone: string | null
          website_url: string | null
          logo_url: string | null
          address_line_1: string | null
          address_town: string | null
          address_postcode: string | null
          latitude: number | null
          longitude: number | null
          description: string | null
          subscription_tier: 'free' | 'basic' | 'premium'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          branch_name?: string | null
          email: string
          phone?: string | null
          website_url?: string | null
          logo_url?: string | null
          address_line_1?: string | null
          address_town?: string | null
          address_postcode?: string | null
          latitude?: number | null
          longitude?: number | null
          description?: string | null
          subscription_tier?: 'free' | 'basic' | 'premium'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          branch_name?: string | null
          email?: string
          phone?: string | null
          website_url?: string | null
          logo_url?: string | null
          address_line_1?: string | null
          address_town?: string | null
          address_postcode?: string | null
          latitude?: number | null
          longitude?: number | null
          description?: string | null
          subscription_tier?: 'free' | 'basic' | 'premium'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'user' | 'agent' | 'admin'
          agent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: 'user' | 'agent' | 'admin'
          agent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'user' | 'agent' | 'admin'
          agent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_properties: {
        Row: {
          id: string
          user_id: string
          property_id: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      hidden_properties: {
        Row: {
          id: string
          user_id: string
          property_id: string
          reason: 'too_small' | 'too_expensive' | 'wrong_area' | 'not_interested' | 'other' | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          reason?: 'too_small' | 'too_expensive' | 'wrong_area' | 'not_interested' | 'other' | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          reason?: 'too_small' | 'too_expensive' | 'wrong_area' | 'not_interested' | 'other' | null
          created_at?: string
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          id: string
          user_id: string
          name: string
          search_params: Json
          alert_enabled: boolean
          alert_frequency: 'instant' | 'daily' | 'weekly'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          search_params: Json
          alert_enabled?: boolean
          alert_frequency?: 'instant' | 'daily' | 'weekly'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          search_params?: Json
          alert_enabled?: boolean
          alert_frequency?: 'instant' | 'daily' | 'weekly'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      property_enquiries: {
        Row: {
          id: string
          property_id: string
          user_id: string | null
          agent_id: string
          name: string
          email: string
          phone: string | null
          message: string
          enquiry_type: 'viewing_request' | 'more_info' | 'general'
          status: 'new' | 'read' | 'responded'
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id?: string | null
          agent_id: string
          name: string
          email: string
          phone?: string | null
          message: string
          enquiry_type: 'viewing_request' | 'more_info' | 'general'
          status?: 'new' | 'read' | 'responded'
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string | null
          agent_id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          enquiry_type?: 'viewing_request' | 'more_info' | 'general'
          status?: 'new' | 'read' | 'responded'
          created_at?: string
        }
        Relationships: []
      }
      property_views: {
        Row: {
          id: string
          property_id: string
          user_id: string | null
          session_id: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id?: string | null
          session_id?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string | null
          session_id?: string | null
          viewed_at?: string
        }
        Relationships: []
      }
      sold_prices: {
        Row: {
          id: string
          address: string
          postcode: string
          price: number
          date_sold: string
          property_type: string
          new_build: boolean
          tenure: string
          latitude: number | null
          longitude: number | null
          location: unknown | null
          created_at: string
        }
        Insert: {
          id?: string
          address: string
          postcode: string
          price: number
          date_sold: string
          property_type: string
          new_build?: boolean
          tenure: string
          latitude?: number | null
          longitude?: number | null
          location?: unknown | null
          created_at?: string
        }
        Update: {
          id?: string
          address?: string
          postcode?: string
          price?: number
          date_sold?: string
          property_type?: string
          new_build?: boolean
          tenure?: string
          latitude?: number | null
          longitude?: number | null
          location?: unknown | null
          created_at?: string
        }
        Relationships: []
      }
      area_guides: {
        Row: {
          id: string
          slug: string
          name: string
          parent_area: string | null
          postcode_prefix: string | null
          description: string
          latitude: number | null
          longitude: number | null
          average_price: number | null
          average_rent: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          parent_area?: string | null
          postcode_prefix?: string | null
          description: string
          latitude?: number | null
          longitude?: number | null
          average_price?: number | null
          average_rent?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          parent_area?: string | null
          postcode_prefix?: string | null
          description?: string
          latitude?: number | null
          longitude?: number | null
          average_price?: number | null
          average_rent?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_properties_by_radius: {
        Args: {
          lat: number
          lng: number
          radius_miles: number
          filters: Json
        }
        Returns: {
          id: string
          slug: string
          listing_type: string
          status: string
          price: number
          property_type: string
          bedrooms: number
          bathrooms: number
          address_line_1: string
          address_town: string
          address_postcode: string
          latitude: number
          longitude: number
          distance: number
        }[]
      }
      search_properties_by_bounds: {
        Args: {
          min_lat: number
          min_lng: number
          max_lat: number
          max_lng: number
          filters: Json
        }
        Returns: {
          id: string
          slug: string
          listing_type: string
          status: string
          price: number
          property_type: string
          bedrooms: number
          bathrooms: number
          address_line_1: string
          address_town: string
          address_postcode: string
          latitude: number
          longitude: number
        }[]
      }
      search_properties_by_polygon: {
        Args: {
          polygon_geojson: string
          filters: Json
        }
        Returns: {
          id: string
          slug: string
          listing_type: string
          status: string
          price: number
          property_type: string
          bedrooms: number
          bathrooms: number
          address_line_1: string
          address_town: string
          address_postcode: string
          latitude: number
          longitude: number
        }[]
      }
      autocomplete_locations: {
        Args: {
          query: string
        }
        Returns: {
          type: string
          name: string
          postcode: string | null
          latitude: number | null
          longitude: number | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}