import { FormControl } from '@angular/forms'

export class PasswordValidation {

	static hasNumber (input: FormControl) {
		return input.value != null ? (input.value.length > 0 ? (/\d/.test(input.value) ? null : { MissNumber: true }) : null) : null
	}

	static hasSpecialCaracter (input: FormControl) {
		return input.value != null ? (input.value.length > 0 ? (/^[a-zA-Z0-9]+$/.test(input.value) ? { MissSpecialCaracter: true } : null) : null) : null
	}

	static hasUpperCaseLetter (input: FormControl) {
		if (input.value != null) {
			const password: string = input.value
			if (password.length > 0) {
				let shouldBeErrored: boolean = true
				for (let i = 0; i < password.length; i++) {
					let caracter: string = password.charAt(i)
					if (/^[A-Z]*$/.test(caracter) && caracter === caracter.toUpperCase())
						shouldBeErrored = false
				}
				return shouldBeErrored ? { MissUpperCaseLetter: true } : null
			} else 
				return null
		} else 
			return null
	}

	static hasLowerCaseLetter (input: FormControl) {
		if (input.value != null) {
			const password: string = input.value
			if (password.length > 0) {
				let shouldBeErrored: boolean = true
				for (let i = 0; i < password.length; i++) {
					let caracter: string = password.charAt(i)
					if (/^[a-z]*$/.test(caracter) && caracter === caracter.toLowerCase())
						shouldBeErrored = false
				}
				return shouldBeErrored ? { MissLowerCaseLetter: true } : null
			} else 
				return null
		} else 
			return null
	}
}