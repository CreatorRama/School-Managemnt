import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface SearchFilterProps {
  onSearch: (query: string) => void
  onCityFilter: (city: string) => void
  cities: string[]
}

export default function SearchFilter({ onSearch, onCityFilter, cities }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Schools
          </label>
          <Input
            id="search"
            placeholder="Search by name or address..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              onSearch(e.target.value)
            }}
          />
        </div>
        
        <div>
          <label htmlFor="city-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by City
          </label>
          <select
            id="city-filter"
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value)
              onCityFilter(e.target.value)
            }}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <Button
            onClick={() => {
              setSearchQuery('')
              setSelectedCity('')
              onSearch('')
              onCityFilter('')
            }}
            variant="outline"
            className="w-full"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  )
}