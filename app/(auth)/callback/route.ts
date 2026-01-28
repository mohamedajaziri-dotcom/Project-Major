import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      try {
        // Create user in our database if not exists
        await prisma.user.upsert({
          where: { email: data.user.email! },
          update: {},
          create: {
            id: data.user.id,
            email: data.user.email!,
            userStats: {
              create: {
                weeklyHLTarget: 10,
              }
            }
          },
        })
        
        return NextResponse.redirect(`${origin}${next}`)
      } catch (dbError) {
        console.error('Failed to create user in database:', dbError)
        return NextResponse.redirect(`${origin}/login?error=database_error`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
