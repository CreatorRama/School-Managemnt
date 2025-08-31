import { NextResponse } from 'next/server'
import sharp from 'sharp'

export async function GET() {
  try {
    
    const placeholderBuffer = await sharp({
      create: {
        width: 800,
        height: 600,
        channels: 3,
        background: { r: 229, g: 231, b: 235 }
      }
    })
      .png()
      .composite([
        {
          input: Buffer.from(`
            <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
              <rect width="800" height="600" fill="#e5e7eb"/>
              <circle cx="400" cy="280" r="60" fill="#9ca3af"/>
              <rect x="340" y="350" width="120" height="80" rx="8" fill="#9ca3af"/>
              <text x="400" y="480" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="24">No Image</text>
            </svg>
          `),
          top: 0,
          left: 0,
        },
      ])
      .toBuffer()

    
    const arrayBuffer = placeholderBuffer.buffer.slice(
      placeholderBuffer.byteOffset,
      placeholderBuffer.byteOffset + placeholderBuffer.byteLength
    ) as ArrayBuffer

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error generating placeholder:', error)
    return NextResponse.json(
      { error: 'Failed to generate placeholder' },
      { status: 500 }
    )
  }
}
