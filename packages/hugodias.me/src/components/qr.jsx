import { Cuer } from 'cuer'
import VCard from 'vcard-creator'

const vCardString = new VCard()
  .addName({ givenName: 'Hugo', familyName: 'Dias' })
  .addEmail({ address: 'hugomrdias@gmail.com' })
  .addPhoneNumber({ number: '+351 932 219 810', type: ['cell'] })
  .addUrl({ url: 'https://hugodias.me', type: ['work'] })
  .addAddress({
    street: 'Praça António Nogueira da Silva 104',
    locality: 'Leça da Palmeira',
    region: 'Porto',
    postalCode: '4450-236',
    country: 'Portugal',
    type: ['home'],
  })
  .toString()

export default function QR({ value = vCardString }) {
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
