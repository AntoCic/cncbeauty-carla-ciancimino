export interface TreatmentData {
  id: string
  slug?: string
  old_id?: string
  title: string
  subtitle?: string
  icon?: string
  color: string
  type_expense_id: string
  categoryIds?: string[]
  duration: number
  price: number
  description?: string
  imgUrls?: string[]
  storeOrder?: number
  tag?: string[]
  imgDescriptionUrls?: string[]
  tipiDiPelle?: string
  prodottiConsigliatiIds?: string[]
  ingredienti?: string
  metaAI?: string
  storeVisible: boolean
  storeDisabled: string
  updateBy: string
}
