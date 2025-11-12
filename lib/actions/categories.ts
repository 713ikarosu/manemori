'use server'

import { createClient } from '@/lib/supabase/server'

export interface Category {
  id: string
  name: string
  sort_order: number
}

export async function getCategories() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, sort_order')
    .eq('user_id', user.id)
    .order('sort_order', { ascending: true })

  if (error) throw error

  return data as Category[]
}
