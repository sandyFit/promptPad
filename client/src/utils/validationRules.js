// Validation rules for each field using regex patterns
const VALIDATION_RULES = {
    username: {
        pattern: /^[a-zA-Z0-9_]{3,20}$/,
        message: 'Username must be 3-20 characters and contain only letters, numbers, and underscores'
    },
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Email address should be in format: john@doe.com'
    },
    password: {
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
        message: 'Password must contain at least 6 characters, one uppercase letter, one lowercase letter, and one number'
    }
};

export default VALIDATION_RULES;
