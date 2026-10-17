import VCard from 'vcard-creator'
import { CONTACTS } from '../consts'

// The CommonJS bundle nests the class under `default` when imported as ESM.
const VCardClass =
  (VCard as unknown as { default?: typeof VCard }).default ?? VCard

const card = new VCardClass()
card.addName('Legal', 'IVS')
card.addCompany(CONTACTS.NAME)
card.addEmail(CONTACTS.EMAIL)
card.addPhoneNumber(CONTACTS.PHONE, 'CELL')
card.addURL(CONTACTS.WEBSITE, 'WORK')
card.addAddress(
  undefined,
  undefined,
  CONTACTS.STREET,
  CONTACTS.LOCALITY,
  CONTACTS.REGION,
  CONTACTS.POSTAL_CODE,
  'Portugal',
  'WORK'
)

export const vCard = card.toString()
