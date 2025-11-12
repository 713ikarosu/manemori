/**
 * 現在の日付を日本時間（JST）でYYYY-MM-DD形式で取得
 * サーバー環境でも確実に日本時間を取得するため、UTCから+9時間で計算
 */
export function getTodayLocal(): string {
  const now = new Date()
  return formatDateJST(now)
}

/**
 * DateオブジェクトをローカルタイムゾーンでYYYY-MM-DD形式にフォーマット
 */
export function formatDateLocal(date: Date): string {
  return formatDateJST(date)
}

/**
 * Dateオブジェクトを日本時間（JST = UTC+9）でYYYY-MM-DD形式にフォーマット
 */
export function formatDateJST(date: Date): string {
  // UTCミリ秒 + 9時間（32400000ミリ秒）で日本時間を計算
  const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000)

  const year = jstDate.getUTCFullYear()
  const month = String(jstDate.getUTCMonth() + 1).padStart(2, '0')
  const day = String(jstDate.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
