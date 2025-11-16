'use client'

import { useState } from 'react'
import {
  addCategory,
  updateCategory,
  deleteCategory,
  Category,
} from '@/lib/actions/categories'
import { useRouter } from 'next/navigation'

interface CategoryManagementProps {
  categories: Category[]
}

export default function CategoryManagement({
  categories,
}: CategoryManagementProps) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAdd = async () => {
    if (!newCategoryName.trim()) {
      alert('カテゴリ名を入力してください')
      return
    }

    setIsProcessing(true)
    try {
      await addCategory(newCategoryName.trim())
      setNewCategoryName('')
      setIsAdding(false)
      router.refresh()
    } catch (error) {
      console.error('Error adding category:', error)
      alert('カテゴリの追加に失敗しました')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setEditName(category.name)
  }

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) {
      alert('カテゴリ名を入力してください')
      return
    }

    setIsProcessing(true)
    try {
      await updateCategory(id, editName.trim())
      setEditingId(null)
      router.refresh()
    } catch (error) {
      console.error('Error updating category:', error)
      alert('カテゴリの更新に失敗しました')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除しますか？`)) return

    setIsProcessing(true)
    try {
      await deleteCategory(id)
      router.refresh()
    } catch (error: any) {
      console.error('Error deleting category:', error)
      alert(error.message || 'カテゴリの削除に失敗しました')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        カテゴリ一覧
      </h2>

      <div className="space-y-3 mb-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
          >
            {editingId === category.id ? (
              <div className="flex-1 flex items-center gap-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
                  disabled={isProcessing}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    disabled={isProcessing}
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={() => handleSaveEdit(category.id)}
                    className="px-3 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                    disabled={isProcessing}
                  >
                    {isProcessing ? '保存中...' : '保存'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="text-gray-800 font-medium">
                  {category.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    aria-label="編集"
                    disabled={isProcessing}
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
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
                    onClick={() => handleDelete(category.id, category.name)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    aria-label="削除"
                    disabled={isProcessing}
                  >
                    <svg
                      className="w-5 h-5 text-red-600"
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
              </>
            )}
          </div>
        ))}
      </div>

      {/* 追加フォーム */}
      <div>
        {isAdding ? (
          <div className="p-4 bg-primary-light bg-opacity-10 rounded-lg border border-primary">
            <h3 className="text-md font-semibold text-gray-700 mb-3">
              カテゴリを追加
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
                placeholder="カテゴリ名"
                disabled={isProcessing}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsAdding(false)
                    setNewCategoryName('')
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  disabled={isProcessing}
                >
                  キャンセル
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                  disabled={isProcessing}
                >
                  {isProcessing ? '追加中...' : '追加'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-3 border-2 border-dashed border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
            disabled={isProcessing}
          >
            + カテゴリを追加
          </button>
        )}
      </div>
    </div>
  )
}
