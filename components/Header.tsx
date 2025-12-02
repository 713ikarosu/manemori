'use client'

import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface HeaderProps {
  user: User
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const [menuOpen, setMenuOpen] = useState(false)

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const menuItems = [
    { label: '履歴を見る', path: '/history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'カテゴリ管理', path: '/settings/categories', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' }
  ]

  return (
    <>
      <header className="backdrop-blur-md bg-surface/80 border-b border-border sticky top-0 z-40 transition-smooth">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center group transition-smooth hover:opacity-70"
          >
            <Image
              src="/manemori-logo_inline_trans.png"
              alt="まねもり"
              width={150}
              height={50}
              priority
              className="h-9 w-auto"
            />
          </button>

          <button
            onClick={() => setMenuOpen(true)}
            className="p-2.5 hover:bg-primary-subtle rounded-xl transition-smooth group"
            aria-label="メニューを開く"
          >
            <svg
              className="w-5 h-5 text-foreground group-hover:text-primary transition-smooth"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Menu Overlay */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setMenuOpen(false)}
          />

          <div
            className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-surface shadow-xl z-50 animate-slide-in-right border-l border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              {/* Menu Header */}
              <div className="p-6 border-b border-border-subtle">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-medium text-foreground tracking-tight">
                    メニュー
                  </h2>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 hover:bg-primary-subtle rounded-xl transition-smooth group"
                    aria-label="メニューを閉じる"
                  >
                    <svg
                      className="w-5 h-5 text-foreground-muted group-hover:text-foreground transition-smooth"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item, index) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      router.push(item.path)
                      setMenuOpen(false)
                    }}
                    className="w-full group flex items-center gap-3 px-4 py-3.5 hover:bg-primary-subtle rounded-xl transition-smooth text-foreground hover:text-primary"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <svg
                      className="w-5 h-5 text-foreground-muted group-hover:text-primary transition-smooth"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icon}
                      />
                    </svg>
                    <span className="font-medium">{item.label}</span>
                    <svg
                      className="w-4 h-4 ml-auto text-foreground-muted group-hover:text-primary group-hover:translate-x-1 transition-smooth"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ))}

                <div className="pt-2 mt-2 border-t border-border-subtle">
                  <button
                    onClick={handleLogout}
                    className="w-full group flex items-center gap-3 px-4 py-3.5 text-status-error hover:bg-status-error/10 rounded-xl transition-smooth"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="font-medium">ログアウト</span>
                  </button>
                </div>
              </nav>

              {/* User Info */}
              <div className="p-6 border-t border-border-subtle bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-foreground-muted">
                      アカウント
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
