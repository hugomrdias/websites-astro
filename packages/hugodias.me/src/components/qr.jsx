import { Cuer } from "cuer"
import VCard from 'vcard-creator'

// @ts-ignore
const _vCard = VCard.default

// Define a new vCard
/** @type {VCard} */
const myVCard = new _vCard()
myVCard.addName('Dias', 'Hugo')
myVCard.addEmail('hugomrdias@gmail.com')
myVCard.addPhoneNumber('+351 932 219 810', 'CELL')
myVCard.addURL('https://hugodias.me', 'WORK')
myVCard.addAddress(undefined, undefined, 'Praça António Nogueira da Silva 104', 'Leça da Palmeira', 'Porto', '4450-236', 'Portugal', 'HOME')

const vCardString = myVCard.toString()

export default function QR({ value= vCardString }) {
  // @ts-ignore
  return <Cuer style={{ color: 'white' }} value={value} arena={
    <img
      src="/favicon.png"
      width={24}
      height={24}
      style={{ borderRadius: '9999px' }}
    />
  }/>
}