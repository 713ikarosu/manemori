'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getMonthlyBudget(year: number, month: number) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('monthly_budgets')
    .select('budget_amount')
    .eq('user_id', user.id)
    .eq('year', year)
    .eq('month', month)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 は "not found" エラー
    throw error
  }

  return data?.budget_amount || 0
}

export async function setMonthlyBudget(
  year: number,
  month: number,
  budgetAmount: number
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase.from('monthly_budgets').upsert(
    {
      user_id: user.id,
      year,
      month,
      budget_amount: budgetAmount,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,year,month',
    }
  )

  if (error) throw error

  revalidatePath('/')
}
