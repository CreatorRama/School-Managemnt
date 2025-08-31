import AddSchoolForm from '@/components/AddSchoolForm'

export default function AddSchoolPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New School</h1>
        <p className="text-gray-600">Fill in the details below to add a new school to the database</p>
      </div>
      <AddSchoolForm />
    </div>
  )
}