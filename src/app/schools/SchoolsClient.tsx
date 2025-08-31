'use client'

import { useState, useMemo } from 'react'
import SchoolGrid from '@/components/SchoolGrid'
import SearchFilter from '@/components/SearchFilter'
import type { School } from '@/types/school'

interface SchoolsClientProps {
  schools: School[]
  cities: string[]
}


const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') 
    .replace(/[^\w\s]/g, '') 
}


const matchesQuery = (text: string | null | undefined, query: string): boolean => {
  if (!text || !query) return !query 
  
  const normalizedText = normalizeText(text)
  const normalizedQuery = normalizeText(query)
  
  
  const queryWords = normalizedQuery.split(' ').filter(word => word.length > 0)
  
  
  if (queryWords.length === 0) return true
  
  
  return queryWords.every(word => normalizedText.includes(word))
}

export default function SchoolsClient({ schools, cities }: SchoolsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      
      const matchesSearch = searchQuery === '' || 
        matchesQuery(school.name, searchQuery) ||
        matchesQuery(school.address, searchQuery) ||
        matchesQuery(school.city, searchQuery) ||
        matchesQuery(school.state, searchQuery) ||
        matchesQuery(school.contact, searchQuery) ||
        matchesQuery(school.email_id, searchQuery)
      
      
      const matchesCity = selectedCity === '' || school.city === selectedCity

      return matchesSearch && matchesCity
    })
  }, [schools, searchQuery, selectedCity])

 
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return []
    
    const suggestions = new Set<string>()
    const query = searchQuery.toLowerCase()
    
    schools.forEach(school => {
    
      if (school.city && school.city.toLowerCase().includes(query)) {
        suggestions.add(school.city)
      }
      
      
      if (school.state && school.state.toLowerCase().includes(query)) {
        suggestions.add(school.state)
      }
      
      
      if (school.address) {
        const addressParts = school.address.split(',').map(part => part.trim())
        addressParts.forEach(part => {
          if (part.toLowerCase().includes(query) && part.length > 2) {
            suggestions.add(part)
          }
        })
      }
      
      
      if (school.name && school.name.toLowerCase().includes(query)) {
        suggestions.add(school.name)
      }
    })
    
    return Array.from(suggestions).slice(0, 5) 
  }, [schools, searchQuery])

  return (
    <>
      <SearchFilter
        onSearch={setSearchQuery}
        onCityFilter={setSelectedCity}
        cities={cities}
        searchSuggestions={searchSuggestions}
        currentQuery={searchQuery}
      />
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredSchools.length} of {schools.length} schools
        </p>
        {searchQuery && (
          <p className="text-sm text-blue-600">
            Search results for: "{searchQuery}"
          </p>
        )}
      </div>
      <SchoolGrid schools={filteredSchools} />
    </>
  )
}