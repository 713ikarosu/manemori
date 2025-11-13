'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface PlannedExpense {
  id: string
  user_id: string
  amount: number
  category_id: string
  planned_date: string
  memo: string | null
  created_at: string
  updated_at: string
  categories?: {
    name: string
  } | null
}

export async function getMonthlyPlannedExpenses(year: number, month: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  // 月の最終日を正しく計算（月によって28〜31日まで異なる）
  const lastDay = new Date(year, month, 0).getDate()
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  const { data, error } = await supabase
    .from('planned_expenses')
    .select(
      `
      *,
      categories (
        name
      )
    `
    )
    .eq('user_id', user.id)
    .gte('planned_date', startDate)
    .lte('planned_date', endDate)
    .order('planned_date', { ascending: true })

  if (error) {
    console.error('Error fetching planned expenses:', JSON.stringify(error, null, 2))
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    // テーブルが存在しない場合は空配列を返す（テーブル作成前でもアプリが動作するように）
    return []
  }

  // Normalize the categories structure
  const normalizedData = data?.map((item: any) => ({
    ...item,
    categories: Array.isArray(item.categories)
      ? item.categories[0]
      : item.categories,
  }))

  return normalizedData || []
}

export async function createPlannedExpense(data: {
  amount: number
  category_id: string
  planned_date: string
  memo: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase.from('planned_expenses').insert({
    user_id: user.id,
    amount: data.amount,
    category_id: data.category_id,
    planned_date: data.planned_date,
    memo: data.memo || null,
  })

  if (error) {
    console.error('Error creating planned expense:', error)
    throw error
  }

  revalidatePath('/')
}

export async function updatePlannedExpense(
  id: string,
  data: {
    amount: number
    category_id: string
    planned_date: string
    memo: string
  }
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('planned_expenses')
    .update({
      amount: data.amount,
      category_id: data.category_id,
      planned_date: data.planned_date,
      memo: data.memo || null,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating planned expense:', error)
    throw error
  }

  revalidatePath('/')
}

export async function deletePlannedExpense(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('planned_expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting planned expense:', error)
    throw error
  }

  revalidatePath('/')
}
