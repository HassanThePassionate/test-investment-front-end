export type PhotoFile = {
  id?: number
  file?: File
  image?: string // This is the field name from your backend
  file_url?: string
  url?: string
  order: number
  uploaded_at?: string
}


export type DocumentFile = {
  id?: number
  file?: File
  document?: string // This is likely the field name from your backend
  file_url?: string
  url?: string
  document_type: string
  uploaded_at?: string
}
export type PropertyFormData = {
  id?: number
  createAt?: Date
  updateAt?: Date
  // Location
  country: string
  district: string
  county: string
  parish: string
  city: string
  street: string
  number_or_lot: string
  floor_or_apartment: string
  postal_code: string

  // Features
  property_type: "apartment" | "house"
  number_of_rooms: number
  gross_area: number
  construction_year: number

  // Details
  condition: "new" | "used" | "needs_renovation"
  has_garage: boolean
  has_elevator: boolean
  has_air_conditioning: boolean
  has_private_garden: boolean
  has_private_pool: boolean
  has_storage: boolean
  has_basement: boolean
  has_terrace: boolean

  // Business
  urgent_sale: "yes" | "no"
  estimated_value: number

  // Personal Data
  contact_name: string
  contact_surname: string
  contact_email: string
  contact_phone: string
  observations: string
  how_found: string
  marketing_consent: boolean
  terms_accepted: boolean
  status?: 'active' | 'pending' | 'rejected'

  // Files
  documents: DocumentFile[]
  photos: PhotoFile[]
}


