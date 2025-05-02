import { toast } from 'react-hot-toast';
import VALIDATION_RULES from './validationRules';

export const validateForm = (credentials, showToasts = false) => {
    const errors = {};

    // Check each field against validation rules
    Object.entries(credentials).forEach(([field, value]) => {
        // Check for empty fields
        if (!value.trim()) {
            errors[field] = `${field} is required`;
        }
        // Apply validation rules if field is not empty
        else if (VALIDATION_RULES[field] && !VALIDATION_RULES[field].pattern.test(value)) {
            errors[field] = VALIDATION_RULES[field].message;
        }
    });

    // Special check for password confirmation
    if (credentials.confirmPassword &&
        credentials.password &&
        credentials.password !== credentials.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    // Show toast errors if requested
    if (showToasts) {
        const emptyFields = Object.entries(errors)
            .filter(([_, message]) => message.includes('required'))
            .map(([field]) => field);

        if (emptyFields.length > 0) {
            toast.error(`Please fill in: ${emptyFields.join(', ')}`);
        } else if (Object.keys(errors).length > 0) {
            // Show the first validation error
            toast.error(Object.values(errors)[0]);
        }
    }

    return errors;
};

export const handleFieldBlur = (
    e,
    credentials,
    setTouched,
    setFormErrors
) => {
    const { name } = e.target;

    // Mark the field as touched
    setTouched(prev => ({
        ...prev,
        [name]: true,
    }));

    // Validate just this individual field
    const fieldErrors = {};

    // Check if empty
    if (!credentials[name].trim()) {
        fieldErrors[name] = `${name} is required`;
    }
    // Apply pattern validation if not empty and rule exists
    else if (VALIDATION_RULES[name] && !VALIDATION_RULES[name].pattern.test(credentials[name])) {
        fieldErrors[name] = VALIDATION_RULES[name].message;
    }

    // Special handling for confirmPassword
    if (name === 'confirmPassword' && credentials.confirmPassword && credentials.password) {
        const passwordsMatch = credentials.password === credentials.confirmPassword;
        if (!passwordsMatch) {
            fieldErrors.confirmPassword = 'Passwords do not match';
        }
    }

    // Update form errors for just this field
    setFormErrors(prev => ({
        ...prev,
        [name]: fieldErrors[name] || ''
    }));
};
