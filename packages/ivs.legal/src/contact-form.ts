///<reference types="@hcaptcha/types"/>

export function contactForm() {
  const form = document.getElementById('contact-form') as HTMLFormElement
  const successMessage = document.getElementById('form-success')

  if (!form) {
    return
  }

  hcaptcha.render('hcaptcha', {
    sitekey: '50b2fe65-b00b-4b9e-ad62-3ba471098be2',
  })
  form?.addEventListener('submit', async (e) => {
    e.preventDefault()
    // @ts-ignore
    const hCaptcha = form.querySelector(
      'textarea[name=h-captcha-response]'
    )?.value

    if (!hCaptcha) {
      e.preventDefault()
      alert('Please fill out captcha field')
      return
    }
    const submitButton = form.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement
    const originalText = submitButton.textContent

    submitButton.textContent = 'A enviar...'
    submitButton.disabled = true

    const formData = new FormData(form)
    const object = Object.fromEntries(formData)
    const json = JSON.stringify(object)

    try {
      const rsp = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: json,
      })
      if (rsp.ok) {
        let json = await rsp.json()

        // Show success message
        form.style.display = 'none'
        successMessage?.classList.remove('hidden')

        // Reset form after delay
        setTimeout(() => {
          form.reset()
          form.style.display = 'block'
          successMessage?.classList.add('hidden')
          submitButton.textContent = originalText
          submitButton.disabled = false
        }, 8000)
      } else {
        console.log(await rsp.text())
      }
    } catch (error) {
      console.log(error)
    }
  })
}

document.addEventListener('astro:page-load', () => {
  contactForm()
})
