import SchoolCard from './SchoolCard'
import type { School } from '@/types/school'

interface SchoolGridProps {
  schools: School[]
}

export default function SchoolGrid({ schools }: SchoolGridProps) {
  if (schools.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
        <p className="text-gray-600">Be the first to add a school to the database!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {schools.map((school) => (
        <SchoolCard key={school.id} school={school} />
      ))}
    </div>
  )
}