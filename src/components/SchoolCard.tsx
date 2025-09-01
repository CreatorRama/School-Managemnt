import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { getImageUrl, formatContact } from '@/lib/utils'
import type { School } from '@/types/school'

interface SchoolCardProps {
  school: School
}

export default function SchoolCard({ school }: SchoolCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={school.image as string}
          alt={school.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{school.name}</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p className="line-clamp-2">{school.address}</p>
          <p>{school.city}, {school.state}</p>
          <p className="font-medium text-blue-600">{formatContact(school.contact)}</p>
        </div>
      </CardContent>
    </Card>
  )
}