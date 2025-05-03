import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
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

    // Memoize getAllPrompts function
    const getAllPrompts = useCallback(async () => {
        if (state.loading) return;

        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.request('prompts');
            console.log('Full response received:', response);

            // Updated check to match actual response structure
            if (response && Array.isArray(response.prompts)) {
                console.log('Prompts data:', response.prompts);
                dispatch({
                    type: SET_ALL_PROMPTS,
                    payload: response.prompts
                });
                return response.prompts;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching prompts:', error);
            dispatch({
                type: SET_ERROR,
                payload: error.message || 'Failed to fetch prompts'
            });
            throw error;
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, [state.loading]);




    const value = useMemo(() => ({
        ...state,
        getAllPrompts
    }), [state, getAllPrompts]);

    return (
        <PromptContext.Provider value={value}>
            {children}
        </PromptContext.Provider>
    );
};

