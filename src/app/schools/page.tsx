import { prisma } from '@/lib/prisma'
import SchoolGrid from '@/components/SchoolGrid'

export default async function SchoolsPage() {
  const schools = await prisma.school.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Schools</h1>
        <p className="text-gray-600">
          Browse through our collection of {schools.length} schools
        </p>
      </div>
      <SchoolGrid schools={schools} />
    </div>
  )
}