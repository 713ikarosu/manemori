'use client'

import { useState, useEffect } from 'react'
import { setMonthlyBudget } from '@/lib/actions/budgets'
import { useRouter } from 'next/navigation'

interface BudgetSectionProps {
  year: number
  month: number
  budgetAmount: number
}

export default function BudgetSection({
  year,
  month,
  budgetAmount,
}: BudgetSectionProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [newBudget, setNewBudget] = useState(budgetAmount.toString())
  const [isLoading, setIsLoading] = useState(false)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isEditing])

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isEditing) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        setIsEditing(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isEditing, isLoading])

  const handleSave = async () => {
    const budgetValue = parseInt(newBudget)

    if (!newBudget.trim() || isNaN(budgetValue)) {
      alert('有効な金額を入力してください')
      return
    }

    if (budgetValue < 0) {
      alert('予算は0以上の値を入力してください')
      return
    }

    setIsLoading(true)
    try {
      await setMonthlyBudget(year, month, budgetValue)
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error('Error saving budget:', error)
      alert('予算の保存に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <section className="bg-surface rounded-2xl border border-border p-6 hover:border-primary/30 transition-smooth group animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-subtle flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-smooth">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-base font-medium text-foreground-muted">
              {month}月の予算
            </h2>
          </div>

          <button
            onClick={() => {
              setNewBudget(budgetAmount.toString())
              setIsEditing(true)
            }}
            className="p-2 hover:bg-primary-subtle rounded-xl transition-smooth group/btn"
            aria-label="予算を編集"
          >
            <svg
              className="w-5 h-5 text-foreground-muted group-hover/btn:text-primary transition-smooth"
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
        </div>

        <div className="flex items-baseline gap-2 text-foreground">
          <span className="text-base font-mono opacity-70">¥</span>
          <span className="text-4xl font-display font-semibold tracking-tight financial-number">
            {budgetAmount.toLocaleString()}
          </span>
        </div>
      </section>

      {/* Modal */}
      {isEditing && (
        <>
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => !isLoading && setIsEditing(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="budget-modal-title"
              aria-describedby="budget-modal-description"
              className="bg-surface rounded-2xl border border-border shadow-xl max-w-md w-full pointer-events-auto animate-fade-in-scale"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border-subtle">
                <h3 id="budget-modal-title" className="text-2xl font-display font-medium text-foreground tracking-tight">
                  {month}月の予算を設定
                </h3>
                <p id="budget-modal-description" className="text-sm text-foreground-muted mt-1">
                  月の予算金額を入力してください
                </p>
              </div>

              <div className="p-6">
                <label className="block text-sm font-medium text-foreground-muted mb-3">
                  予算金額
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-foreground-muted font-mono">
                    ¥
                  </span>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full pl-12 pr-16 py-4 border-2 border-border rounded-xl focus:border-primary focus:outline-none text-2xl font-display font-medium text-foreground financial-number transition-smooth bg-background"
                    placeholder="50000"
                    autoFocus
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted font-medium">
                    円
                  </span>
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-5 py-3.5 bg-background hover:bg-secondary border border-border rounded-xl font-medium text-foreground transition-smooth"
                  disabled={isLoading}
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-5 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-smooth disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      保存中...
                    </span>
                  ) : '保存'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
