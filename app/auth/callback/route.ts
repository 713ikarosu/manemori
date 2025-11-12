import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { initializeUserCategories } from '@/lib/actions/auth'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  console.log('Auth callback - Code:', code ? 'present' : 'missing')

  if (!code) {
    console.error('Auth callback - No code provided')
    return NextResponse.redirect(`${origin}/login`)
  }

  const response = NextResponse.redirect(`${origin}/`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Auth callback - Exchange code error:', error.message, error)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  if (!data.user) {
    console.error('Auth callback - No user data returned')
    return NextResponse.redirect(`${origin}/login?error=no_user`)
  }

  console.log('Auth callback - Success! User ID:', data.user.id)

  // 初回ログイン時に初期カテゴリを作成
  try {
    await initializeUserCategories(data.user.id)
    console.log('Auth callback - Categories initialized')
  } catch (error) {
    console.error('Error initializing user categories:', error)
  }

  return response
}
