import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getMonthlyBudget } from '@/lib/actions/budgets'
import {
  getExpenses,
  getMonthlyExpenses,
  getWeeklyExpenses,
} from '@/lib/actions/expenses'
import { getMonthlyPlannedExpenses } from '@/lib/actions/plannedExpenses'
import { getCategories } from '@/lib/actions/categories'
import { getTodayLocal } from '@/lib/utils/date'
import BudgetSection from '@/components/BudgetSection'
import RemainingSection from '@/components/RemainingSection'
import ExpenseForm from '@/components/ExpenseForm'
import TodayExpenses from '@/components/TodayExpenses'
import PlannedExpenses from '@/components/PlannedExpenses'
import Header from '@/components/Header'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const todayStr = getTodayLocal()

  // 並列でデータ取得
  const [monthlyBudget, monthlyExpenses, weeklyExpenses, todayExpenses, plannedExpenses, categories] =
    await Promise.all([
      getMonthlyBudget(year, month),
      getMonthlyExpenses(year, month),
      getWeeklyExpenses(),
      getExpenses(todayStr),
      getMonthlyPlannedExpenses(year, month),
      getCategories(),
    ])

  const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const monthRemaining = monthlyBudget - monthlyExpenses

  // 出費予定の合計
  const plannedTotal = plannedExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const monthRemainingWithPlanned = monthRemaining - plannedTotal

  // 週の残り計算
  const daysInMonth = new Date(year, month, 0).getDate()
  const weeklyAverageBudget = (monthlyBudget / daysInMonth) * 7
  const weekRemaining = weeklyAverageBudget - weeklyExpenses

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <BudgetSection
          year={year}
          month={month}
          budgetAmount={monthlyBudget}
        />

        <RemainingSection
          monthRemaining={monthRemaining}
          monthRemainingWithPlanned={monthRemainingWithPlanned}
          weekRemaining={weekRemaining}
          todayTotal={todayTotal}
        />

        <ExpenseForm categories={categories} />

        <PlannedExpenses
          plannedExpenses={plannedExpenses}
          categories={categories}
          year={year}
          month={month}
        />

        <TodayExpenses expenses={todayExpenses} categories={categories} />

        <div className="text-center pb-6">
          <Link
            href="/history"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            履歴を見る
          </Link>
        </div>
      </main>
    </div>
  )
}
