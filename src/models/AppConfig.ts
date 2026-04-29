export const APP_CONFIG_ID = 'main'

export interface AppConfigData {
  id: string
  brandName: string
  legalLastUpdated: string
  cookieConsentKeyDate: string
  ownerName: string
  legalEntity: string
  vatOrTaxCode: string
  officeAddress: string
  publicPhone: string
  privacyEmail: string
  sepaBeneficiaryName: string
  sepaBeneficiaryIban: string
  sepaBeneficiaryBic: string
  pec: string
  aiModel: string
  aiProvider: string
  cookieBannerTextHtml: string
  cookieBannerRejectBtnText: string
  cookieBannerAcceptBtnText: string
  privacyPolicyBodyHtml: string
  cookiePolicyBodyHtml: string
  termsConditionsBodyHtml: string
  aiTransparencyBodyHtml: string
  businessTimezone: string
  dayStart: string
  breakStart: string
  breakEnd: string
  dayEnd: string
  workingDays?: number[]
  appointmentSlotMinutes: number
  defaultAppointmentDurationMinutes: number
  personalAppointmentDurationMinutes: number
  calendarPrefetchMonths: number
  availabilitySearchDays: number
  availabilityMinNoticeMinutes: number
  googleCalendarSyncEnabled: boolean
  googleCalendarId: string
  googleCalendarAccessRole: string
  googleCalendarAllowedEmailsCsv: string
}

export const APP_CONFIG_DEFAULTS: Omit<AppConfigData, 'id'> = {
  brandName: 'Cnc Beauty',
  legalLastUpdated: '14 marzo 2026',
  cookieConsentKeyDate: '2026-02-27',
  ownerName: 'Carla Ciancimino',
  legalEntity: 'Carla Ciancimino',
  vatOrTaxCode: '03055730844',
  officeAddress: 'Via Enrico de Nicola, 16, 92019 Sciacca AG',
  publicPhone: '+39 329 709 4859',
  privacyEmail: 'carla.ciancimino99@gmail.com',
  sepaBeneficiaryName: '',
  sepaBeneficiaryIban: '',
  sepaBeneficiaryBic: '',
  pec: '',
  aiModel: 'gemini-2.5-flash-lite',
  aiProvider: 'Google Gemini API',
  cookieBannerTextHtml: '<p>Usiamo cookie e storage tecnici per sicurezza e funzionamento. Gli analytics Firebase sono opzionali e vengono attivati solo con consenso.</p>',
  cookieBannerRejectBtnText: 'Rifiuta analytics',
  cookieBannerAcceptBtnText: 'Accetta analytics',
  privacyPolicyBodyHtml: '',
  cookiePolicyBodyHtml: '',
  termsConditionsBodyHtml: '',
  aiTransparencyBodyHtml: '',
  businessTimezone: 'Europe/Rome',
  dayStart: '09:00',
  breakStart: '13:00',
  breakEnd: '14:00',
  dayEnd: '19:00',
  workingDays: [1, 2, 3, 4, 5],
  appointmentSlotMinutes: 15,
  defaultAppointmentDurationMinutes: 60,
  personalAppointmentDurationMinutes: 30,
  calendarPrefetchMonths: 1,
  availabilitySearchDays: 45,
  availabilityMinNoticeMinutes: 30,
  googleCalendarSyncEnabled: false,
  googleCalendarId: '',
  googleCalendarAccessRole: 'writer',
  googleCalendarAllowedEmailsCsv: '',
}
