import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { schoolSchema } from '@/lib/validations'
import {  mkdir } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(schools)
  } catch (error) {
    console.error('Error fetching schools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    
    const data = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      contact: formData.get('contact') as string,
      email_id: formData.get('email_id') as string,
    }

    
    const validatedData = schoolSchema.parse(data)

    
    let imagePath: string | null = null
    const imageFile = formData.get('image') as File | null
    
    if (imageFile && imageFile.size > 0) {
      
      const uploadDir = join(process.cwd(), 'public', 'schoolImages')
      await mkdir(uploadDir, { recursive: true })

      // Generate unique filename
      const timestamp = Date.now()
      const fileName = `school_${timestamp}.webp`
      const filePath = join(uploadDir, fileName)

     
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      await sharp(buffer)
        .resize(800, 600, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(filePath)

      imagePath = fileName
    }

    
    const school = await prisma.school.create({
      data: {
        ...validatedData,
        image: imagePath,
      },
    })

    return NextResponse.json(school, { status: 201 })
  } catch (error) {
    console.error('Error creating school:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create school' },
      { status: 500 }
    )
  }
}