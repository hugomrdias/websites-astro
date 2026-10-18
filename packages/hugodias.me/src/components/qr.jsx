import { Cuer } from 'cuer'
import { vCard } from '../lib/vcard'

export default function QR({ value = vCard }) {
  return (
    <Cuer
      color="white"
      value={value}
      arena={
        <img
          src="/favicon.png"
          alt="Hugo Dias"
          width={24}
          height={24}
          style={{ borderRadius: '9999px' }}
        />
      }
    />
  )
}
