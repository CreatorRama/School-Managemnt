import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { schoolSchema } from '@/lib/validations'
import sharp from 'sharp'
import { put } from '@vercel/blob' 

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

    let imageUrl: string | null = null
    const imageFile = formData.get('image') as File | null
    
    if (imageFile && imageFile.size > 0) {
      try {
        console.log('📤 Processing image for Vercel Blob upload...')
        
        
        const buffer = Buffer.from(await imageFile.arrayBuffer())
        const processedImageBuffer = await sharp(buffer)
          .resize(800, 600, { fit: 'cover' })
          .webp({ quality: 80 })
          .toBuffer()

       
        const timestamp = Date.now()
        const originalName = imageFile.name.split('.')[0]
        const fileName = `school_${timestamp}_${originalName}.webp`

        
        const blob = await put(fileName, processedImageBuffer, {
          access: 'public',
          contentType: 'image/webp',
        });

       
        imageUrl = blob.url 
        
      } catch (imageError) {
        throw imageError
        
      }
    } else {
      console.log('ℹ️ No valid image file to process')
    }

    
    const school = await prisma.school.create({
      data: {
        ...validatedData,
        image: imageUrl, 
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