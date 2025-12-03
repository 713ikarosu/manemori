'use client'

import { useState, useRef, useEffect } from 'react'
import { addExpense } from '@/lib/actions/expenses'
import { Category } from '@/lib/actions/categories'
import { getTodayLocal } from '@/lib/utils/date'
import { useRouter } from 'next/navigation'

interface ExpenseFormProps {
  categories: Category[]
  initialDate?: string // オプショナルな初期日付（履歴画面から使う場合）
}

export default function ExpenseForm({ categories, initialDate }: ExpenseFormProps) {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [expenseDate, setExpenseDate] = useState(initialDate || getTodayLocal())
  const [memo, setMemo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !categoryId) {
      alert('金額とカテゴリを入力してください')
      return
    }

    setIsLoading(true)
    try {
      await addExpense({
        amount: parseInt(amount),
        category_id: categoryId,
        memo,
        expense_date: expenseDate,
      })

      // Success feedback
      setJustAdded(true)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => setJustAdded(false), 2000)

      // フォームをリセット
      setAmount('')
      setMemo('')
      setExpenseDate(getTodayLocal()) // 日付もリセット（今日に戻す）
      router.refresh()
    } catch (error) {
      console.error('Error adding expense:', error)
      alert('出費の追加に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-surface rounded-2xl border border-border p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent-muted flex items-center justify-center">
          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h2 className="text-xl font-display font-medium text-foreground">出費を記録</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Amount Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground-muted">
            金額
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-foreground-muted font-mono">
              ¥
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-12 py-3.5 border-2 border-border rounded-xl focus:border-primary focus:outline-none text-lg font-mono text-foreground transition-smooth bg-background hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="1000"
              disabled={isLoading}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted font-medium text-sm">
              円
            </span>
          </div>
        </div>

        {/* Category Select */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground-muted">
            カテゴリ
          </label>
          <div className="relative">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full appearance-none px-4 py-3.5 border-2 border-border rounded-xl focus:border-primary focus:outline-none text-foreground transition-smooth bg-background hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Date Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground-muted">
            日付
          </label>
          <div className="relative">
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full px-4 py-3.5 border-2 border-border rounded-xl focus:border-primary focus:outline-none text-foreground transition-smooth bg-background hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Memo Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground-muted">
            メモ <span className="text-xs opacity-70">(任意)</span>
          </label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full px-4 py-3.5 border-2 border-border rounded-xl focus:border-primary focus:outline-none text-foreground transition-smooth bg-background hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="例: 昼食、コンビニ"
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-4 rounded-xl font-medium transition-smooth shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
            justAdded
              ? 'bg-status-success text-white'
              : 'bg-primary hover:bg-primary-dark text-white'
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              追加中...
            </span>
          ) : justAdded ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              追加しました
            </span>
          ) : '記録する'}
        </button>
      </form>
    </section>
  )
}
