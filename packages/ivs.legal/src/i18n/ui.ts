import { articleCategoryLabel } from '../lib/article-categories.ts'

export const languages = {
  pt: 'Português',
  en: 'English',
}

export const defaultLang = 'pt'

export const ui = {
  pt: {
    'nav.home': 'Início',
    'nav.about': 'Sobre Nós',
    'nav.practice-areas': 'Áreas de Prática',
    'nav.articles': 'Artigos',
    'nav.contact': 'Contacto',
    'hero.title': '"A justiça é a ',
    'hero.title.highlight': 'balança',
    'hero.title.location': ' que equilibra a sociedade."',
    'hero.subtitle': 'F. Scott Fitzgerald',
    'hero.quote': 'A justiça é a balança que equilibra a sociedade.',
    'hero.quote.author': 'F. Scott Fitzgerald',
    'hero.cta.consultation': 'Consulta',
    'hero.cta.about': 'Conheça-nos',
    'hero.stats.experience': 'Anos de Experiência',
    'hero.stats.cases': 'Casos Resolvidos',
    'hero.stats.success': 'Taxa de Sucesso',
    'practice.title': 'Áreas de',
    'practice.title.highlight': 'Atuação',
    'practice.subtitle':
      'Oferecemos serviços jurídicos em diversas áreas do Direito.',
    'practice.civil.title': articleCategoryLabel('civil-law', 'pt'),
    'practice.civil.description':
      'Contratos, responsabilidade civil, cobrança de dívidas, direito de família e sucessões. Registos e Notariado.',
    'practice.commercial.title': articleCategoryLabel('corporate-law', 'pt'),
    'practice.commercial.description':
      'Constituição de empresas, contratos e fusões. Apoiamos o crescimento do seu negócio com segurança jurídica.',
    'practice.labor.title': articleCategoryLabel('employment-law', 'pt'),
    'practice.labor.description':
      'Contratos de trabalho, despedimentos, acidentes de trabalho. Defendemos os direitos de trabalhadores e empregadores.',
    'practice.real-estate.title': articleCategoryLabel('real-estate-law', 'pt'),
    'practice.real-estate.description':
      'Compra e venda de imóveis, arrendamento, licenciamento urbanístico. Garantimos segurança em todos os seus investimentos imobiliários.',
    'practice.criminal.title': articleCategoryLabel('criminal-law', 'pt'),
    'practice.criminal.description':
      'Aconselhamento, patrocínio e defesa nas  diversas fases dos processos criminais e contra ordenações.',
    'practice.tax.title': articleCategoryLabel('immigration-law', 'pt'),
    'practice.tax.description':
      'Assessoria jurídica para obtenção de vistos, autorizações de residência, reagrupamento familiar e processos de nacionalidade.',
    'practice.cta': 'Ver Todas as Áreas',
    'testimonials.title': 'O que dizem os nossos',
    'testimonials.title.highlight': 'Clientes',
    'testimonials.subtitle':
      'A confiança dos nossos clientes é o nosso maior património. Veja o que dizem sobre os nossos serviços.',
    'contact.title': 'Contacte-nos',
    'contact.title.highlight': '',
    'contact.subtitle':
      'Estamos aqui para ajudar. Agende uma consulta e descubra como podemos resolver a sua situação jurídica.',
    'contact.location': 'Localização',
    'contact.phone': 'Telefone',
    'contact.email': 'Email',
    'contact.hours': 'Horário',
    'contact.hours.data': 'Segunda a Sexta: 9:00 - 18:00',
    'contact.address':
      'Travessa Henrique Schreck 96, 4450-578 Matosinhos, Portugal',
    'contact.address1': 'Travessa Henrique Schreck 96',
    'contact.address2': '4450-578 Matosinhos, Portugal',
    'contact.phone.data': '+351 925 395 905',
    'contact.email.data': 'geral@ivs.legal',
    'contact.form.title': 'Solicite uma Consulta',
    'contact.form.firstName.placeholder': 'João',
    'contact.form.lastName.placeholder': 'Silva',
    'contact.form.email.placeholder': 'joao.silva@email.com',
    'contact.form.phone.placeholder': '+351 912 345 678',
    'contact.form.subject.placeholder': 'Selecione uma área',
    'contact.form.urgency': 'Urgência',
    'contact.form.urgency.normal': 'Normal',
    'contact.form.urgency.urgent': 'Urgente',
    'contact.form.urgency.veryUrgent': 'Muito Urgente',
    'contact.form.message.placeholder':
      'Descreva brevemente a sua situação jurídica...',
    'contact.form.message.placeholderDetailed':
      'Descreva detalhadamente a sua situação jurídica, incluindo datas relevantes e documentos disponíveis...',
    'contact.form.privacy.prefix': 'Aceito a',
    'contact.form.privacy.link': 'política de privacidade',
    'contact.form.privacy.suffix':
      'e autorizo o tratamento dos meus dados pessoais para fins de contacto e prestação de serviços jurídicos.',
    'contact.form.noscript': 'Ative JavaScript ou contacte-nos por email:',
    'contact.form.tool.description':
      'Solicitar uma consulta à IVS Legal. Preenche os dados de contacto, área jurídica e mensagem para revisão e envio pelo utilizador. Requer consentimento de privacidade e verificação de segurança. Envia um pedido; não confirma uma marcação.',
    'contact.form.success':
      'Obrigado! O seu pedido foi enviado com sucesso. Entraremos em contacto brevemente.',
    'contact.form.success.title': 'Pedido enviado com sucesso!',
    'contact.form.success.description':
      'Entraremos em contacto consigo no prazo de 24 horas. Obrigado pela sua confiança.',
    'contact.form.sending': 'A enviar…',
    'contact.form.error':
      'Não foi possível enviar. Tente novamente ou contacte-nos por email:',
    'contact.form.error.token':
      'Conclua a verificação de segurança antes de enviar.',
    'contact.form.error.rate':
      'Demasiadas tentativas. Aguarde um minuto e tente novamente.',
    'contact.form.firstName': 'Primeiro Nome',
    'contact.form.lastName': 'Último Nome',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Telefone',
    'contact.form.subject': 'Área Jurídica',
    'contact.form.subject.options': {
      'direito-civil': articleCategoryLabel('civil-law', 'pt'),
      'direito-comercial': articleCategoryLabel('corporate-law', 'pt'),
      'direito-laboral': articleCategoryLabel('employment-law', 'pt'),
      'direito-imobiliario': articleCategoryLabel('real-estate-law', 'pt'),
      'direito-penal': articleCategoryLabel('criminal-law', 'pt'),
      'direito-migração': articleCategoryLabel('immigration-law', 'pt'),
      outro: 'Outro',
    },
    'contact.form.message': 'Mensagem',
    'contact.form.privacy':
      'Aceito a política de privacidade e autorizo o tratamento dos meus dados pessoais.',
    'contact.form.submit': 'Enviar Pedido de Consulta',
    'footer.company': 'IVS Legal',
    'footer.tagline': 'Ética, proximidade e transparência',
    'footer.description':
      'Oferecemos serviços jurídicos em diversas áreas do Direito.',
    'footer.quickLinks': 'Links Rápidos',
    'footer.contact': 'Contacto',
    'footer.copyright': 'IVS Legal. Todos os direitos reservados.',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos e Condições',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.practice-areas': 'Practice Areas',
    'nav.articles': 'Articles',
    'nav.contact': 'Contact',
    'hero.title': '"Law is the ',
    'hero.title.highlight': 'scale',
    'hero.title.location': ' that balances society."',
    'hero.subtitle': 'F. Scott Fitzgerald',
    'hero.quote': 'The law is the balance that balances society.',
    'hero.quote.author': 'F. Scott Fitzgerald',
    'hero.cta.consultation': 'Consultation',
    'hero.cta.about': 'About Us',
    'hero.stats.experience': 'Years of Experience',
    'hero.stats.cases': 'Cases Resolved',
    'hero.stats.success': 'Success Rate',
    'practice.title': 'Areas of',
    'practice.title.highlight': 'Practice',
    'practice.subtitle': 'We offer legal services in various areas of law.',
    'practice.civil.title': articleCategoryLabel('civil-law', 'en'),
    'practice.civil.description':
      'Contracts, civil liability, debt collection, family law and succession. Registers and Notary.',
    'practice.commercial.title': articleCategoryLabel('corporate-law', 'en'),
    'practice.commercial.description':
      'Company formation, commercial contracts and mergers. We support your business growth with legal security.',
    'practice.labor.title': articleCategoryLabel('employment-law', 'en'),
    'practice.labor.description':
      'Employment contracts, dismissals, workplace accidents. We defend the rights of both employees and employers.',
    'practice.real-estate.title': articleCategoryLabel('real-estate-law', 'en'),
    'practice.real-estate.description':
      'Property buying and selling, leasing, urban licensing. We ensure security in all your real estate investments.',
    'practice.criminal.title': articleCategoryLabel('criminal-law', 'en'),
    'practice.criminal.description':
      'Advice, representation and defense in all phases of criminal and disciplinary proceedings.',
    'practice.tax.title': articleCategoryLabel('immigration-law', 'en'),
    'practice.tax.description':
      'Legal advice for obtaining visas, residence permits, family reunification and nationality processes.',
    'practice.cta': 'View All Areas',
    'testimonials.title': 'What our',
    'testimonials.title.highlight': 'Clients',
    'testimonials.subtitle':
      "Our clients' trust is our greatest asset. See what they say about our services.",
    'contact.title': 'Contact',
    'contact.title.highlight': '',
    'contact.subtitle':
      'We are here to help. Schedule a consultation and discover how we can resolve your legal situation.',
    'contact.location': 'Location',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.hours': 'Hours',
    'contact.hours.data': 'Monday to Friday: 9:00 - 18:00',
    'contact.address':
      'Travessa Henrique Schreck 96, 4450-578 Matosinhos, Portugal',
    'contact.address1': 'Travessa Henrique Schreck 96',
    'contact.address2': '4450-578 Matosinhos, Portugal',
    'contact.phone.data': '+351 925 395 905',
    'contact.email.data': 'geral@ivs.legal',
    'contact.form.title': 'Request a Consultation',
    'contact.form.firstName.placeholder': 'John',
    'contact.form.lastName.placeholder': 'Smith',
    'contact.form.email.placeholder': 'john.smith@email.com',
    'contact.form.phone.placeholder': '+351 912 345 678',
    'contact.form.subject.placeholder': 'Select an area',
    'contact.form.urgency': 'Urgency',
    'contact.form.urgency.normal': 'Normal',
    'contact.form.urgency.urgent': 'Urgent',
    'contact.form.urgency.veryUrgent': 'Very Urgent',
    'contact.form.message.placeholder':
      'Briefly describe your legal situation...',
    'contact.form.message.placeholderDetailed':
      'Describe your legal situation in detail, including relevant dates and available documents...',
    'contact.form.privacy.prefix': 'I accept the',
    'contact.form.privacy.link': 'privacy policy',
    'contact.form.privacy.suffix':
      'and authorize the processing of my personal data for contact and legal service purposes.',
    'contact.form.noscript': 'Enable JavaScript or email us:',
    'contact.form.tool.description':
      'Request a consultation with IVS Legal. Fill contact details, legal area and message for the user to review and submit. Requires privacy consent and the security check. Sends a request; does not confirm an appointment.',
    'contact.form.success':
      'Thank you! Your request has been sent successfully. We will contact you shortly.',
    'contact.form.success.title': 'Request sent successfully!',
    'contact.form.success.description':
      'We will contact you within 24 hours. Thank you for your trust.',
    'contact.form.sending': 'Sending…',
    'contact.form.error': 'Unable to send. Please retry or email us:',
    'contact.form.error.token': 'Complete the security check before sending.',
    'contact.form.error.rate':
      'Too many attempts. Wait a minute and try again.',
    'contact.form.firstName': 'First Name',
    'contact.form.lastName': 'Last Name',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Phone',
    'contact.form.subject': 'Legal Area',
    'contact.form.subject.options': {
      'direito-civil': articleCategoryLabel('civil-law', 'en'),
      'direito-comercial': articleCategoryLabel('corporate-law', 'en'),
      'direito-laboral': articleCategoryLabel('employment-law', 'en'),
      'direito-imobiliario': articleCategoryLabel('real-estate-law', 'en'),
      'direito-penal': articleCategoryLabel('criminal-law', 'en'),
      'direito-migração': articleCategoryLabel('immigration-law', 'en'),
      outro: 'Other',
    },
    'contact.form.message': 'Message',
    'contact.form.privacy':
      'I accept the privacy policy and authorize the processing of my personal data.',
    'contact.form.submit': 'Send Consultation Request',
    'footer.company': 'IVS Legal',
    'footer.tagline': 'Ethics, proximity and transparency',
    'footer.description': 'We offer legal services in various areas of law.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.copyright': 'IVS Legal. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms and Conditions',
  },
} as const
