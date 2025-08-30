import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'School Management System',
  description: 'Add and manage school information',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">School Management</h1>
              </div>
              <div className="flex items-center space-x-4">
                <a 
                  href="/add-school" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Add School
                </a>
                <a 
                  href="/schools" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Schools
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
}