import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { initializeUserCategories } from '@/lib/actions/auth'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // 初回ログイン時に初期カテゴリを作成
      try {
        await initializeUserCategories(data.user.id)
      } catch (error) {
        console.error('Error initializing user categories:', error)
      }

      // トップページにリダイレクト
      return NextResponse.redirect(`${origin}/`)
    }
  }

  // エラー時はログインページにリダイレクト
  return NextResponse.redirect(`${origin}/login`)
}
