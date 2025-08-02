import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('token')?.value

  console.log('Middleware aktif untuk:', pathname)

  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      console.log('⛔ Token tidak ada')
      return NextResponse.redirect(new URL('/', req.url))
    }

    try {
      // Verifikasi token secara manual pakai jose (bisa di Edge)
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      )

      console.log('✅ Token valid:', payload)
      return NextResponse.next()
    } catch (err) {
      console.error('❌ Token invalid:', err)
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
