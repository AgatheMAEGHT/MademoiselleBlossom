package utils

func IsPasswordStrong(password string) bool {
	if len(password) < 8 {
		return false
	}

	hasDigit := false
	hasNonDigit := false
	for _, c := range password {
		if c >= '0' && c <= '9' {
			hasDigit = true
		} else {
			hasNonDigit = true
		}

		if hasDigit && hasNonDigit {
			return true
		}
	}

	return false
}
