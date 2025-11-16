import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ログイン',
  description: 'Googleアカウントでログインして出費管理を始めましょう。',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
