import { createContext, useContext, useReducer } from 'react';
import { apiClient } from '../utils/apiClient';
import {
    reducer,
    SET_LOADING,
    SET_ERROR,
    SET_ALL_PROMPTS,
    SET_PROMPT,
    CREATE_PROMPT,
    UPDATE_PROMPT,
    DELETE_PROMPT,
    APPROVE_PROMPT,
} from '../utils/reducer';
import { get } from '../../../server/routes/authRoutes';

const initialState = {
    allPrompts: [],
    prompt: null,
    loading: false,
    error: null,
};

export const PromptContext = createContext(undefined);

// hook to provide authentication context to the app
export const usePrompt = () => {
    const context = useContext(PromptContext);
    if (!context) {
        throw new Error('usePromptContext must be used within a PromptProvider');
    }
    return context;
};


export const PromptProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { allPrompts, prompt, loading, error } = state;

    const createPrompt = async (promptData) => {
        dispatch({ type: SET_LOADING, payload: true });

        try {
            const response = await apiClient.request(
                'prompts',
                'POST',
                promptData
            );
            if (response.success) {
                dispatch({ type: CREATE_PROMPT, payload: response.prompt });
            }
            return response;

        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            throw error;

        } finally {
            dispatch({ type: SET_LOADING, payload: false });

        }
    };

    const getAllPrompts = async (prompts) => {
        dispatch({ type: SET_ALL_PROMPTS, payload: prompts });

        try {
            const response = await apiClient.request('prompts');
            if (response.success) {
                const prompts = Array.isArray(response) ? response : response.prompts || [];
                dispatch({ typ: SET_ALL_PROMPTS, payload: response.prompts });
            };
            
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            throw error;
            
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const getPromptById = async (id) => {
        dispatch({ type: SET_LOADING, payload: true });

        try {
            const response = await apiClient.request(`prompts/${id}`);
            if (response.success) {
                dispatch({ type: SET_PROMPT, payload: response.prompt });
                return prompt;
            }

            
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            throw error;
            
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
            
        }
    };

    const updatePrompt = async (id, promptData) => {
        dispatch({ type: SET_LOADING, payload: true });

        try {
            if (!id) {
                throw new Error('Prompt ID is required');
            }

            const response = await apiClient.request(`prompts/${id}`, 'PUT', promptData);
            if (response.success) {
                dispatch({ type: UPDATE_PROMPT, payload: response.prompt });
            }
            return response;
            
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            throw error;
            
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
            
        }
    };

    const deletePrompt = async (id) => { 
        dispatch({ type: SET_LOADING, payload: true });

        try {
            if (!id) {
                throw new Error('Prompt ID is required');
            };

            const response = await apiClient.request(`prompts/${id}`, 'DELETE');
            if (response.success) {
                dispatch({ type: DELETE_PROMPT, payload: response.prompt });
            }
            return response;
            
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            throw error;
            
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
            
        }
    }

    const value = {
        allPrompts,
        prompt,
        loading,
        error,
        createPrompt,
        getAllPrompts,
        getPromptById,
        updatePrompt,
        deletePrompt
    };

    return (
        <PromptContext.Provider value={value}>
            {children}
        </PromptContext.Provider>
    );
}
P
