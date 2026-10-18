import VCard from 'vcard-creator'
import { CONTACTS, SITE } from '../consts'

export const vCard = new VCard()
  .addName({ givenName: 'Hugo', familyName: 'Dias' })
  .addEmail({ address: SITE.EMAIL })
  .addPhoneNumber({ number: CONTACTS.PHONE, type: ['cell'] })
  .addUrl({ url: SITE.URL, type: ['work'] })
  .addAddress({
    street: CONTACTS.STREET,
    locality: CONTACTS.LOCALITY,
    region: CONTACTS.REGION,
    postalCode: CONTACTS.POSTAL_CODE,
    country: CONTACTS.COUNTRY,
    type: ['home'],
  })
  .toString()
