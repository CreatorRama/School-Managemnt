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
    
    // Extract form fields
    const data = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      contact: formData.get('contact') as string,
      email_id: formData.get('email_id') as string,
    }

    // Validate data
    const validatedData = schoolSchema.parse(data)

    
    let imagePath: string | null = null
    const imageFile = formData.get('image') as File | null
    
   
    
    if (imageFile && imageFile.size > 0) {
     
      const uploadDir = join(process.cwd(), 'public', 'schoolImages')
      
      
      try {
        await mkdir(uploadDir, { recursive: true })
        console.log('✅ Directory created/exists')
      } catch (dirError) {
        console.error('❌ Error creating directory:', dirError)
      }

      
      const timestamp = Date.now()
      const originalName = imageFile.name.split('.')[0]
      const fileName = `school_${timestamp}_${originalName}.webp`
      const filePath = join(uploadDir, fileName)
      
      console.log('💾 Saving image to:', filePath)

      try {
        
        const buffer = Buffer.from(await imageFile.arrayBuffer())
        
        
        await sharp(buffer)
          .resize(800, 600, { fit: 'cover' })
          .webp({ quality: 80 })
          .toFile(filePath)
        
        console.log('✅ Image saved successfully:', fileName)
        imagePath = fileName
      } catch (imageError) {
        throw imageError
      }
    } else {
      console.log(' No valid image file to process')
    }

    // Save to database
    const school = await prisma.school.create({
      data: {
        ...validatedData,
        image: imagePath,
      },
    })

    

    return NextResponse.json(school, { status: 201 })
  } catch (error) {
    
    
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