import {
  Home, Car, Trees, Zap, Wrench, Building,
  Utensils, Bath, Bed, Sofa, Sun, Shield,
  Wifi, Thermometer, Droplets, Wind
} from 'lucide-react'
import type { PropertyWithDetails } from '@/types/property'

interface PropertyFeaturesProps {
  property: PropertyWithDetails
}

export default function PropertyFeatures({ property }: PropertyFeaturesProps) {
  // Define feature categories with icons
  const featureCategories = [
    {
      title: 'Property Features',
      icon: <Home className="w-5 h-5" />,
      features: [
        { key: 'periodProperty', label: 'Period Property', value: property.periodProperty },
        { key: 'modern', label: 'Modern Property', value: property.modern },
        { key: 'cottage', label: 'Cottage Style', value: property.cottage },
        { key: 'newBuild', label: 'New Build', value: property.newBuild },
        { key: 'chainFree', label: 'Chain Free', value: property.chainFree }
      ]
    },
    {
      title: 'Indoor Features',
      icon: <Sofa className="w-5 h-5" />,
      features: [
        { key: 'utilityRoom', label: 'Utility Room', value: property.utilityRoom },
        { key: 'basement', label: 'Basement', value: property.basement },
        { key: 'conservatory', label: 'Conservatory', value: property.conservatory },
        { key: 'homeOffice', label: 'Home Office', value: property.homeOffice },
        { key: 'openPlanKitchen', label: 'Open Plan Kitchen', value: property.openPlanKitchen },
        { key: 'separateDiningRoom', label: 'Separate Dining Room', value: property.separateDiningRoom },
        { key: 'downstairsWc', label: 'Downstairs WC', value: property.downstairsWc },
        { key: 'loftConversion', label: 'Loft Conversion', value: property.loftConversion }
      ]
    },
    {
      title: 'Kitchen & Bathroom',
      icon: <Utensils className="w-5 h-5" />,
      features: [
        { key: 'kitchenIsland', label: 'Kitchen Island', value: property.kitchenIsland },
        { key: 'enSuite', label: 'En-suite', value: property.enSuite },
        { key: 'bathtub', label: 'Bathtub', value: property.bathtub },
        { key: 'wetRoom', label: 'Wet Room', value: property.wetRoom }
      ]
    },
    {
      title: 'Outdoor Space',
      icon: <Trees className="w-5 h-5" />,
      features: [
        { key: 'patio', label: 'Patio', value: property.patio },
        { key: 'balcony', label: 'Balcony', value: property.balcony },
        { key: 'roofTerrace', label: 'Roof Terrace', value: property.roofTerrace },
        { key: 'outbuildings', label: 'Outbuildings', value: property.outbuildings },
        { key: 'swimmingPool', label: 'Swimming Pool', value: property.swimmingPool }
      ]
    },
    {
      title: 'Parking & Storage',
      icon: <Car className="w-5 h-5" />,
      features: [
        { key: 'garage', label: 'Garage', value: property.garage },
        { key: 'evCharging', label: 'EV Charging', value: property.evCharging },
        { key: 'cellar', label: 'Cellar', value: property.cellar },
        { key: 'annexe', label: 'Annexe', value: property.annexe }
      ]
    },
    {
      title: 'Character & Period',
      icon: <Building className="w-5 h-5" />,
      features: [
        { key: 'originalFeatures', label: 'Original Features', value: property.originalFeatures },
        { key: 'bayWindows', label: 'Bay Windows', value: property.bayWindows },
        { key: 'bifoldDoors', label: 'Bi-fold Doors', value: property.bifoldDoors },
        { key: 'walkInWardrobe', label: 'Walk-in Wardrobe', value: property.walkInWardrobe }
      ]
    },
    {
      title: 'Modern Amenities',
      icon: <Zap className="w-5 h-5" />,
      features: [
        { key: 'doubleGlazing', label: 'Double Glazing', value: property.doubleGlazing },
        { key: 'underfloorHeating', label: 'Underfloor Heating', value: property.underfloorHeating },
        { key: 'solarPanels', label: 'Solar Panels', value: property.solarPanels },
        { key: 'logBurner', label: 'Log Burner', value: property.logBurner }
      ]
    }
  ]

  // Additional property details
  const propertyDetails = [
    {
      title: 'Property Details',
      items: [
        { label: 'Property Type', value: property.propertyType?.replace('_', ' ').toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()) },
        { label: 'Bedrooms', value: property.bedrooms },
        { label: 'Bathrooms', value: property.bathrooms },
        { label: 'Reception Rooms', value: property.receptionRooms },
        { label: 'Floor Area', value: property.floorAreaSqft ? `${property.floorAreaSqft.toLocaleString()} sq ft` : null },
        { label: 'Plot Size', value: property.plotSizeSqft ? `${property.plotSizeSqft.toLocaleString()} sq ft` : null },
        { label: 'Floor Level', value: property.floorLevel?.toLowerCase().replace(/^\w/, c => c.toUpperCase()) }
      ].filter(item => item.value)
    },
    {
      title: 'Tenure & Costs',
      items: [
        { label: 'Tenure', value: property.tenure?.replace('_', ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase()) },
        { label: 'Lease Length', value: property.leaseLengthRemaining ? `${property.leaseLengthRemaining} years remaining` : null },
        { label: 'Service Charge', value: property.serviceChargeAnnual ? `£${(property.serviceChargeAnnual / 100).toLocaleString()}/year` : null },
        { label: 'Ground Rent', value: property.groundRentAnnual ? `£${(property.groundRentAnnual / 100).toLocaleString()}/year` : null }
      ].filter(item => item.value)
    },
    {
      title: 'Energy & Utilities',
      items: [
        { label: 'EPC Rating', value: property.epcRating },
        { label: 'EPC Potential', value: property.epcPotentialRating },
        { label: 'Heating', value: property.heatingType?.replace('_', ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase()) },
        { label: 'Mains Gas', value: property.mainsGas ? 'Yes' : property.mainsGas === false ? 'No' : null },
        { label: 'Mains Sewer', value: property.mainsSewer ? 'Yes' : property.mainsSewer === false ? 'No' : null },
        { label: 'Annual Energy Cost', value: property.estimatedAnnualEnergyCost ? `£${(property.estimatedAnnualEnergyCost / 100).toLocaleString()}` : null }
      ].filter(item => item.value)
    },
    {
      title: 'Outdoor & Parking',
      items: [
        { label: 'Garden', value: property.gardenType?.toLowerCase().replace(/^\w/, c => c.toUpperCase()) },
        { label: 'Garden Orientation', value: property.gardenOrientation },
        { label: 'Parking', value: property.parkingType?.replace('_', ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase()) }
      ].filter(item => item.value)
    }
  ]

  // Rental specific details
  if (property.listingType === 'RENT') {
    propertyDetails.push({
      title: 'Rental Information',
      items: [
        { label: 'Furnished', value: property.furnished?.replace('_', ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase()) },
        { label: 'Pets Allowed', value: property.petsAllowed ? 'Yes' : property.petsAllowed === false ? 'No' : null },
        { label: 'Bills Included', value: property.billsIncluded ? 'Yes' : property.billsIncluded === false ? 'No' : null },
        { label: 'Deposit', value: property.depositAmount ? `£${(property.depositAmount / 100).toLocaleString()}` : null },
        { label: 'Available From', value: property.availableFrom ? property.availableFrom.toLocaleDateString() : null },
        { label: 'Minimum Tenancy', value: property.minTenancyMonths ? `${property.minTenancyMonths} months` : null }
      ].filter(item => item.value)
    })
  }

  return (
    <div className="space-y-8">
      {/* Property Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-6">Property Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCategories.map((category) => {
            const availableFeatures = category.features.filter(feature => feature.value === true)

            if (availableFeatures.length === 0) return null

            return (
              <div key={category.title} className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-text-primary">{category.title}</h3>
                </div>
                <div className="space-y-2">
                  {availableFeatures.map((feature) => (
                    <div key={feature.key} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      <span className="text-text-secondary">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Property Details */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-6">Property Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {propertyDetails.map((section) => {
            if (section.items.length === 0) return null

            return (
              <div key={section.title} className="card p-6">
                <h3 className="font-semibold text-text-primary mb-4">{section.title}</h3>
                <div className="space-y-3">
                  {section.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span className="text-text-secondary text-sm">{item.label}:</span>
                      <span className="text-text-primary font-medium text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}