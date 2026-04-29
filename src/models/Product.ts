export interface ProductData {
  id: string
  title: string
  subtitle?: string
  icon?: string
  color: string
  type_expense_id: string
  categoryIds?: string[]
  price: number
  description?: string
  imgUrls?: string[]
  storeOrder?: number
  tag?: string[]
  imgDescriptionUrls?: string[]
  tipiDiPelle?: string
  consigliUso?: string
  ingredienti?: string
  metaAI?: string
  storeVisible: boolean
  storeDisabled: string
  trattamentiConsigliatiIds?: string[]
  updateBy: string
}
