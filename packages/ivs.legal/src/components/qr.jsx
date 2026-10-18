import { Cuer } from 'cuer'
import { vCard } from '../lib/vcard'

export default function QR({ value = vCard }) {
  // @ts-ignore
  return (
    <Cuer
      color="black"
      value={value}
      arena={<img src="/favicon.png" alt="IVS Legal" width={24} height={24} />}
    />
  )
}
