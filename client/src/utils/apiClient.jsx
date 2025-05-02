import axios from 'axios';
import { toast } from 'react-hot-toast';

const BASE_URL = 'http://localhost:4500/api';
const PUBLIC_ROUTES = ['login', 'register'];
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

// Helper to safely parse JSON
const safeJSONParse = (data) => {
    try {
        return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
        return {};
    }
};

class ApiClient {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: BASE_URL,
            timeout: 10000,
            withCredentials: true, // Keep this for cookies
        });

        this.setupInterceptors();
    }

    setupInterceptors() {
        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            config => {
                this.logRequest(config);
                return config;
            },
            error => {
                console.error('Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            (response) => {
                this.logResponse(response);
                return response;
            },
            async (error) => {
                return this.handleError(error);
            }
        );
    }

    logRequest(config) {
        console.log('📝 Request:', {
            method: config.method.toUpperCase(),
            url: config.url,
            headers: { ...config.headers, Authorization: config.headers?.Authorization ? '**REDACTED**' : undefined },
            data: config.data ? (
                typeof config.data === 'string'
                    ? '**REDACTED - CONTAINS SENSITIVE DATA**'
                    : { ...config.data, password: config.data.password ? '**REDACTED**' : undefined }
            ) : 'No body',
        });
    }

    logResponse(response) {
        console.log('📝 Response:', {
            status: response.status,
            data: response.data,
        });
    }

    async handleError(error) {
        // Enhanced error logging
        console.group('🔥 API Error Details');
        console.error('Error Type:', error.name);
        console.error('Message:', error.message);
        console.error('Endpoint:', error.config?.url);
        console.error('Request Data:', error.config?.data ? JSON.parse(error.config.data) : null);
        console.error('Status:', error.response?.status);
        console.error('Response Data:', error.response?.data);
        console.groupEnd();

        if (!error.response) {
            const message = 'Network error. Please check your connection.';
            toast.error(message);
            throw new Error(message);
        }

        const { status, data } = error.response;

        // Enhanced 500 error handling
        if (status === 500) {
            // Log detailed server error
            console.error('Server Error Details:', {
                endpoint: error.config.url,
                method: error.config.method,
                requestData: JSON.parse(error.config.data || '{}'),
                serverError: data
            });

            // Only retry once for registration
            if (
                this.shouldRetry(error) &&
                !error.config.__isRetry &&
                error.config.url.includes('register')
            ) {
                try {
                    console.log('🔄 Attempting to retry registration...');
                    return await this.retryRequest(error.config);
                } catch (retryError) {
                    console.error('❌ Registration retry failed:', retryError);
                }
            }

            const errorMessage = data?.message ||
                'Registration failed. Please try again later.';
            toast.error(errorMessage);
            throw new Error(`Server Error: ${errorMessage}`);
        }

        // Handle unauthorized errors (401)
        if (status === 401) {
            const errorMessage = 'Your session has expired. Please log in again.';
            toast.error(errorMessage);

            // Clear any stored authentication
            localStorage.removeItem('token');

            // Redirect to login page if needed
            // window.location.href = '/login'; // Uncomment for auto-redirect

            throw new Error(errorMessage);
        }

        // Handle validation errors (400)
        if (status === 400) {
            const errorMessage = data?.details
                ? `Validation failed: ${data.details.map(d => d.message).join(', ')}`
                : data?.error || 'Invalid request data';

            toast.error(errorMessage);
            throw new Error(errorMessage);
        }

        // Handle specific error messages from the server
        if (data?.error) {
            toast.error(data.error);
            throw new Error(data.error);
        }

        // Default error handling
        const message = data?.message || 'An error occurred. Please try again.';
        toast.error(message);
        throw new Error(message);
    }

    async retryRequest(failedConfig, attempt = 1) {
        if (attempt > MAX_RETRIES) {
            throw new Error('Maximum retry attempts reached');
        }

        try {
            console.group('🔄 Retry Attempt');
            console.log(`Attempt ${attempt}/${MAX_RETRIES}`);
            console.log('Request:', {
                url: failedConfig.url,
                method: failedConfig.method,
                data: JSON.parse(failedConfig.data || '{}')
            });

            // Add delay before retry
            const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
            await new Promise(resolve => setTimeout(resolve, delay));

            const response = await this.axiosInstance(failedConfig);
            console.log('✅ Retry successful');
            console.groupEnd();
            return response;
        } catch (error) {
            console.error(`❌ Retry attempt ${attempt} failed:`, error.message);
            console.groupEnd();

            if (attempt < MAX_RETRIES) {
                return this.retryRequest(failedConfig, attempt + 1);
            }
            throw error;
        }
    }

    shouldRetry(error) {
        // Only retry on server errors for POST requests
        return error.response?.status >= 500 &&
            error.response?.status < 600 &&
            error.config?.method?.toLowerCase() === 'post' &&
            !error.config?.__isRetry; // Prevent retrying already retried requests
    }

    async request(url, method = 'GET', data = null, retries = MAX_RETRIES) {
        try {
            console.log('Making API request:', {
                url: `${BASE_URL}/${url}`,
                method,
                data: data ? { ...data, password: data.password ? '[REDACTED]' : undefined } : null
            });

            const response = await this.axiosInstance({
                method,
                url,
                data,
                headers: this.getHeaders(url, method),
            });

            console.log('API response:', {
                status: response.status,
                data: response.data
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    getHeaders(url, method = 'GET') {
        const isPublicRoute = PUBLIC_ROUTES.some(route => url.includes(route));
        const headers = { 'Accept': 'application/json' };

        // Only set Content-Type for requests that may have a body
        if (method !== 'GET' && method !== 'DELETE') {
            headers['Content-Type'] = 'application/json';
        }

        // Add auth token for protected routes
        if (!isPublicRoute) {
            const token = localStorage.getItem('token');
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
        }

        return headers;
    }

    // Convenience methods
    get(url) {
        return this.request(url);
    }

    post(url, data) {
        return this.request(url, 'POST', data);
    }

    put(url, data) {
        return this.request(url, 'PUT', data);
    }

    delete(url) {
        return this.request(url, 'DELETE');
    }
}

export const apiClient = new ApiClient();
