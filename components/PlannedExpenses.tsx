'use client'

import { useState } from 'react'
import {
  createPlannedExpense,
  updatePlannedExpense,
  deletePlannedExpense,
  PlannedExpense,
} from '@/lib/actions/plannedExpenses'
import { Category } from '@/lib/actions/categories'
import { useRouter } from 'next/navigation'

interface PlannedExpensesProps {
  plannedExpenses: PlannedExpense[]
  categories: Category[]
  year: number
  month: number
}

export default function PlannedExpenses({
  plannedExpenses,
  categories,
  year,
  month,
}: PlannedExpensesProps) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form states for adding
  const [addAmount, setAddAmount] = useState('')
  const [addCategoryId, setAddCategoryId] = useState('')
  const [addPlannedDate, setAddPlannedDate] = useState('')
  const [addMemo, setAddMemo] = useState('')

  // Form states for editing
  const [editAmount, setEditAmount] = useState('')
  const [editCategoryId, setEditCategoryId] = useState('')
  const [editPlannedDate, setEditPlannedDate] = useState('')
  const [editMemo, setEditMemo] = useState('')

  const handleAdd = async () => {
    if (!addAmount || !addCategoryId || !addPlannedDate) {
      alert('金額、カテゴリ、予定日を入力してください')
      return
    }

    setIsLoading(true)
    try {
      await createPlannedExpense({
        amount: parseInt(addAmount),
        category_id: addCategoryId,
        planned_date: addPlannedDate,
        memo: addMemo,
      })
      setAddAmount('')
      setAddCategoryId('')
      setAddPlannedDate('')
      setAddMemo('')
      setIsAdding(false)
      router.refresh()
    } catch (error) {
      console.error('Error adding planned expense:', error)
      alert('出費予定の追加に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (expense: PlannedExpense) => {
    setEditingId(expense.id)
    setEditAmount(expense.amount.toString())
    setEditCategoryId(expense.category_id)
    setEditPlannedDate(expense.planned_date)
    setEditMemo(expense.memo || '')
  }

  const handleSaveEdit = async (expenseId: string) => {
    const amountValue = parseInt(editAmount)

    if (!editAmount.trim() || isNaN(amountValue)) {
      alert('有効な金額を入力してください')
      return
    }

    if (amountValue < 0) {
      alert('金額は0以上の値を入力してください')
      return
    }

    if (!editCategoryId) {
      alert('カテゴリを選択してください')
      return
    }

    if (!editPlannedDate) {
      alert('予定日を選択してください')
      return
    }

    setIsLoading(true)
    try {
      await updatePlannedExpense(expenseId, {
        amount: amountValue,
        category_id: editCategoryId,
        planned_date: editPlannedDate,
        memo: editMemo,
      })
      setEditingId(null)
      router.refresh()
    } catch (error) {
      console.error('Error updating planned expense:', error)
      alert('出費予定の更新に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (expenseId: string) => {
    if (!confirm('この出費予定を削除しますか？')) return

    setIsLoading(true)
    try {
      await deletePlannedExpense(expenseId)
      router.refresh()
    } catch (error) {
      console.error('Error deleting planned expense:', error)
      alert('出費予定の削除に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  const total = plannedExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <section className="bg-surface rounded-2xl border border-border py-6 px-4 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-muted flex items-center justify-center">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-display font-medium text-foreground">
            {month}月の出費予定
          </h2>
        </div>
        <button
          onClick={() => {
            setAddCategoryId(categories[0]?.id || '')
            setIsAdding(true)
          }}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-smooth text-sm shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          予定を追加
        </button>
      </div>

      {plannedExpenses.length > 0 && (
        <div className="mb-6 p-5 bg-gradient-to-br from-accent-muted/50 to-accent-muted/30 rounded-xl border border-accent/20">
          <div className="text-sm font-medium text-foreground-muted mb-1">予定合計</div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-mono opacity-70">¥</span>
            <span className="text-3xl font-display font-semibold text-foreground financial-number">
              {total.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Add form */}
      {isAdding && (
        <div className="mb-6 p-5 bg-primary-subtle/50 rounded-xl border-2 border-primary/30 animate-fade-in-scale">
          <h3 className="text-base font-medium text-foreground mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新しい出費予定
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-muted font-mono">¥</span>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 border-2 border-border rounded-lg focus:border-primary focus:outline-none text-foreground font-mono transition-smooth bg-surface"
                  placeholder="1000"
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <select
                  value={addCategoryId}
                  onChange={(e) => setAddCategoryId(e.target.value)}
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
              type="date"
              value={addPlannedDate}
              onChange={(e) => setAddPlannedDate(e.target.value)}
              className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:border-primary focus:outline-none text-foreground transition-smooth bg-surface"
              disabled={isLoading}
            />
            <input
              type="text"
              value={addMemo}
              onChange={(e) => setAddMemo(e.target.value)}
              className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:border-primary focus:outline-none text-foreground transition-smooth bg-surface"
              placeholder="メモ"
              disabled={isLoading}
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setIsAdding(false)
                  setAddAmount('')
                  setAddCategoryId('')
                  setAddPlannedDate('')
                  setAddMemo('')
                }}
                className="flex-1 px-4 py-2.5 bg-background hover:bg-secondary border border-border rounded-lg font-medium text-foreground transition-smooth"
                disabled={isLoading}
              >
                キャンセル
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-smooth disabled:opacity-50 shadow-sm hover:shadow-md"
                disabled={isLoading}
              >
                {isLoading ? '追加中...' : '追加'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List of planned expenses */}
      {plannedExpenses.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
            <svg className="w-8 h-8 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-foreground-muted">まだ出費予定がありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {plannedExpenses.map((expense, index) => (
            <div
              key={expense.id}
              className="group relative bg-background hover:bg-secondary/30 rounded-xl border border-border-subtle transition-smooth p-4"
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
                    type="date"
                    value={editPlannedDate}
                    onChange={(e) => setEditPlannedDate(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:border-primary focus:outline-none text-foreground transition-smooth bg-surface"
                    disabled={isLoading}
                  />
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
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-accent-muted/50 text-accent text-sm font-medium">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(expense.planned_date)}
                        </span>
                        <span className="inline-flex px-2.5 py-0.5 rounded-lg bg-primary-subtle text-primary text-sm font-medium">
                          {expense.categories?.name || 'カテゴリなし'}
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-mono opacity-70">¥</span>
                          <span className="text-xl font-display font-semibold text-foreground financial-number">
                            {expense.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {expense.memo && (
                        <p className="text-sm text-foreground-muted mt-1 line-clamp-2">{expense.memo}</p>
                      )}
                    </div>

                    <div className="flex gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-smooth">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-2 hover:bg-primary-subtle rounded-lg transition-smooth"
                        aria-label="編集"
                        disabled={isLoading}
                      >
                        <svg
                          className="w-4 h-4 text-foreground-muted hover:text-primary transition-smooth"
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
                        className="p-2 hover:bg-status-error/10 rounded-lg transition-smooth"
                        aria-label="削除"
                        disabled={isLoading}
                      >
                        <svg
                          className="w-4 h-4 text-foreground-muted hover:text-status-error transition-smooth"
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
      )}
    </section>
  )
}
