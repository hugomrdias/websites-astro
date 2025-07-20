import { Cuer } from "cuer"
import VCard from 'vcard-creator'
import { CONTACTS } from '@consts'

// @ts-ignore
const _vCard = VCard.default

// Define a new vCard
/** @type {VCard} */
const myVCard = new _vCard()
myVCard.addName('Legal', 'IVS')
myVCard.addEmail(CONTACTS.EMAIL)
myVCard.addPhoneNumber(CONTACTS.PHONE, 'CELL')
myVCard.addURL(CONTACTS.WEBSITE, 'WORK')
myVCard.addAddress(undefined, undefined, 'Travessa Henrique Schreck 96', 'Matosinhos', 'Porto', '4450-578', 'Portugal', 'HOME')

const vCardString = myVCard.toString()

export default function QR({ value= vCardString }) {
  // @ts-ignore
  return <Cuer style={{ color: 'black' }} value={value} arena={
    <img
      src="/favicon.png"
      width={24}
      height={24}
    />
  }/>
}