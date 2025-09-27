// export const COUNTRIES = [
//   'タイ', 'ベトナム', 'カンボジア', 'ラオス', 
//   'インド', 'ネパール', 'ミャンマー', 
//   'マレーシア', 'インドネシア', 'フィリピン',
//   'シンガポール', '台湾', '韓国', '中国',
//   'モンゴル', 'トルコ', 'イラン', 'ウズベキスタン',
//   'カザフスタン', 'キルギス', 'タジキスタン'
// ] as const

export const CATEGORIES = [
  '交通', '宿', '食事', 'SIM', 'ビザ', 
  '両替', '注意点', 'その他'
] as const

export const SORT_OPTIONS = [
  { value: 'newest', label: '新着順' },
  { value: 'popular', label: '人気順' },
  { value: 'trust', label: '信頼度順' }
] as const

export const REPORT_REASONS = [
  'スパム・宣伝',
  'デマ・誤情報', 
  '不適切な内容',
  '著作権侵害',
  'その他'
] as const

// export type Country = typeof COUNTRIES[number]
export type Category = typeof CATEGORIES[number]
export type SortOption = typeof SORT_OPTIONS[number]['value']
export type ReportReason = typeof REPORT_REASONS[number]