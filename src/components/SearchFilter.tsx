import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface SearchFilterProps {
  onSearch: (query: string) => void
  onCityFilter: (city: string) => void
  cities: string[]
  searchSuggestions?: string[]
  currentQuery?: string
}

export default function SearchFilter({ 
  onSearch, 
  onCityFilter, 
  cities, 
  searchSuggestions = [],
  currentQuery = ''
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || searchSuggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedSuggestionIndex(prev => 
          prev < searchSuggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : searchSuggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (focusedSuggestionIndex >= 0) {
          handleSuggestionClick(searchSuggestions[focusedSuggestionIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setFocusedSuggestionIndex(-1)
        break
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    onSearch(suggestion)
    setShowSuggestions(false)
    setFocusedSuggestionIndex(-1)
  }

 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setFocusedSuggestionIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Schools
          </label>
          <div className="relative">
            <Input
              ref={searchInputRef}
              id="search"
              placeholder="Search by name, address, city, state, contact, or email..."
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value
                setSearchQuery(value)
                onSearch(value)
                setShowSuggestions(value.length > 1)
                setFocusedSuggestionIndex(-1)
              }}
              onFocus={() => {
                if (searchQuery.length > 1) {
                  setShowSuggestions(true)
                }
              }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            
            {/* Search Icon */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                    index === focusedSuggestionIndex ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setFocusedSuggestionIndex(index)}
                >
                  <span className="flex items-center">
                    <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {suggestion}
                  </span>
                </button>
              ))}
            </div>
          )}
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
              setShowSuggestions(false)
              setFocusedSuggestionIndex(-1)
            }}
            variant="outline"
            className="w-full"
          >
            Clear Filters
          </Button>
        </div>
      </div>
      
      {/* Search Tips */}
      {searchQuery.length === 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Search Tips:</strong> You can search by school name, address, city, state, contact number, or email. 
            Try typing partial words or addresses for better results.
          </p>
        </div>
      )}
    </div>
  )
}