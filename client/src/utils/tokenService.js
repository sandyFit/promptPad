const TOKEN_KEY = 'auth_token';

export const tokenService = {
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    setToken: (token) => {
        localStorage.setItem(TOKEN_KEY, token);
    },

    removeToken: () => {
        localStorage.removeItem(TOKEN_KEY);
    },

    isValid: (token) => {
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } catch {
            return false;
        }
    }
};
