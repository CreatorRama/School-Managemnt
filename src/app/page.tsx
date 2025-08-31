import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          School Management System
        </h1>
        <p className="text-xl text-gray-600">
          Easily add and manage school information with our simple, responsive platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/add-school">
            <Button size="lg" className="w-full sm:w-auto">
              Add New School
            </Button>
          </Link>
          <Link href="/schools">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View All Schools
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}