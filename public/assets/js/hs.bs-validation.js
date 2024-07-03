'use strict'

const validators = {
  'data-hs-validation-equal-field': field => {
    const equalTarget = document.querySelector(field.getAttribute('data-hs-validation-equal-field'))
  }
}

const HSBsValidation = {
  init(selector, options) {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll(selector)

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach((form) => {
        for (const validator in validators) {
          Array.prototype.slice.call(form.querySelectorAll(`[${validator}]`))
            .forEach(validators[validator])
        }

        form.addEventListener('submit', event => {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          } else {
            this.onSubmit({event, form, options})
          }

          form.classList.add('was-validated')
        }, false)
      })

    return this
  },

  onSubmit(data) {
    if (!data.options || typeof data.options.onSubmit !== 'function') return false
    return data.options.onSubmit(data)
  }
}
