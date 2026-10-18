import VCard from 'vcard-creator'
import { CONTACTS } from '../consts'

export const vCard = new VCard()
  .addName({ givenName: 'IVS', familyName: 'Legal' })
  .addCompany({ name: CONTACTS.NAME })
  .addEmail({ address: CONTACTS.EMAIL })
  .addPhoneNumber({ number: CONTACTS.PHONE, type: ['cell'] })
  .addUrl({ url: CONTACTS.WEBSITE, type: ['work'] })
  .addAddress({
    street: CONTACTS.STREET,
    locality: CONTACTS.LOCALITY,
    region: CONTACTS.REGION,
    postalCode: CONTACTS.POSTAL_CODE,
    country: 'Portugal',
    type: ['work'],
  })
  .toString()
