/**
 * 現在の日付をローカルタイムゾーンでYYYY-MM-DD形式で取得
 */
export function getTodayLocal(): string {
  const now = new Date()
  return formatDateLocal(now)
}

/**
 * DateオブジェクトをローカルタイムゾーンでYYYY-MM-DD形式にフォーマット
 */
export function formatDateLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
