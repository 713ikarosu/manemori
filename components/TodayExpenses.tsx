'use client'

import { useState } from 'react'
import { deleteExpense, updateExpense, Expense } from '@/lib/actions/expenses'
import { Category } from '@/lib/actions/categories'
import { getTodayLocal } from '@/lib/utils/date'
import { useRouter } from 'next/navigation'

interface TodayExpensesProps {
  expenses: Expense[]
  categories: Category[]
}

export default function TodayExpenses({
  expenses,
  categories,
}: TodayExpensesProps) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState('')
  const [editCategoryId, setEditCategoryId] = useState('')
  const [editMemo, setEditMemo] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id)
    setEditAmount(expense.amount.toString())
    setEditCategoryId(expense.category_id)
    setEditMemo(expense.memo || '')
  }

  const handleSaveEdit = async (expenseId: string) => {
    setIsLoading(true)
    try {
      await updateExpense(expenseId, {
        amount: parseInt(editAmount),
        category_id: editCategoryId,
        memo: editMemo,
        expense_date: getTodayLocal(),
      })
      setEditingId(null)
      router.refresh()
    } catch (error) {
      console.error('Error updating expense:', error)
      alert('出費の更新に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (expenseId: string) => {
    if (!confirm('この出費を削除しますか？')) return

    setIsLoading(true)
    try {
      await deleteExpense(expenseId)
      router.refresh()
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert('出費の削除に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  if (expenses.length === 0) {
    return (
      <section className="bg-surface rounded-2xl border border-border p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-status-info/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-status-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-xl font-display font-medium text-foreground">今日の記録</h2>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
            <svg className="w-8 h-8 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-foreground-muted">まだ記録がありません</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-surface rounded-2xl border border-border p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-status-info/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-status-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 className="text-xl font-display font-medium text-foreground">今日の記録</h2>
      </div>

      <div className="space-y-3">
        {expenses.map((expense, index) => (
          <div
            key={expense.id}
            className="group relative bg-background hover:bg-secondary/30 rounded-xl border border-border-subtle transition-smooth p-4 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {editingId === expense.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-muted font-mono">¥</span>
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 border-2 border-border rounded-lg focus:border-primary focus:outline-none text-foreground font-mono transition-smooth bg-surface"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={editCategoryId}
                      onChange={(e) => setEditCategoryId(e.target.value)}
                      className="w-full appearance-none px-3 py-2.5 border-2 border-border rounded-lg focus:border-primary focus:outline-none text-foreground transition-smooth bg-surface"
                      disabled={isLoading}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <input
                  type="text"
                  value={editMemo}
                  onChange={(e) => setEditMemo(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:border-primary focus:outline-none text-foreground transition-smooth bg-surface"
                  placeholder="メモ"
                  disabled={isLoading}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 px-4 py-2.5 bg-background hover:bg-secondary border border-border rounded-lg font-medium text-foreground transition-smooth"
                    disabled={isLoading}
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={() => handleSaveEdit(expense.id)}
                    className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-smooth disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? '保存中...' : '保存'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex px-2.5 py-0.5 rounded-lg bg-primary-subtle text-primary text-sm font-medium">
                        {expense.categories?.name || 'カテゴリなし'}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-1.5">
                      <span className="text-xs font-mono opacity-70">¥</span>
                      <span className="text-xl font-display font-semibold text-foreground financial-number">
                        {expense.amount.toLocaleString()}
                      </span>
                    </div>
                    {expense.memo && (
                      <p className="text-sm text-foreground-muted mt-1 line-clamp-2">{expense.memo}</p>
                    )}
                  </div>

                  <div className="flex gap-1 ml-3 transition-smooth">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="p-2 bg-primary-subtle/50 hover:bg-primary-subtle focus:bg-primary-subtle focus:outline-none focus:ring-2 focus:ring-primary rounded-lg transition-smooth"
                      aria-label="編集"
                      disabled={isLoading}
                    >
                      <svg
                        className="w-4 h-4 text-primary transition-smooth"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="p-2 bg-status-error/10 hover:bg-status-error/20 focus:bg-status-error/10 focus:outline-none focus:ring-2 focus:ring-status-error rounded-lg transition-smooth"
                      aria-label="削除"
                      disabled={isLoading}
                    >
                      <svg
                        className="w-4 h-4 text-status-error transition-smooth"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
