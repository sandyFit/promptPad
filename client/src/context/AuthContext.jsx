import { createContext, useContext, useReducer, useState } from 'react';
import { apiClient } from '../utils/apiClient';
import { toast } from 'react-hot-toast';
import {
    reducer,
    SET_LOADING,
    SET_ERROR,
    SET_PROFILE_USER,
    UPDATE_USER_PROFILE,
    SET_USER,
    CREATE_USER,
    SET_ALL_USERS,
    UPDATE_USER,
    DELETE_USER,
    APPROVE_MODERATOR,
} from '../utils/reducer';

const initialState = {
    user: null,
    allUsers: [],
    loading: false,
    error: null,
    profileUser: null,
};

export const AuthContext = createContext(undefined);

// hook to provide authentication context to the app
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { user, allUsers, loading, error, profileUser } = state;

    const registerUser = async (userData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.post('/auth/register', userData);
            dispatch({ type: CREATE_USER, payload: response.data });
            toast.success('User registered successfully!');
        } catch (err) {
            dispatch({ type: SET_ERROR, payload: err.message });
            toast.error(err.message);
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const loginUser = async (userData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.post('/auth/login', userData);
            dispatch({ type: SET_USER, payload: response.data });
            toast.success('Logged in successfully!');
        } catch (err) {
            dispatch({ type: SET_ERROR, payload: err.message });
            toast.error(err.message);
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const logoutUser = async () => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            await apiClient.post('/auth/logout');
            dispatch({ type: SET_USER, payload: null });
            toast.success('Logged out successfully!');
        } catch (err) {
            dispatch({ type: SET_ERROR, payload: err.message });
            toast.error(err.message);
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const getUserProfile = async () => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.get('/auth/profile');
            dispatch({ type: SET_PROFILE_USER, payload: response.data });
        } catch (err) {
            dispatch({ type: SET_ERROR, payload: err.message });
            toast.error(err.message);
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const updateUserProfile = async (userData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.put('/auth/profile', userData);
            dispatch({ type: UPDATE_USER_PROFILE, payload: response.data });
            toast.success('Profile updated successfully!');
        } catch (err) {
            dispatch({ type: SET_ERROR, payload: err.message });
            toast.error(err.message);
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const getAllUsers = async () => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.get('/auth/users');
            dispatch({ type: SET_ALL_USERS, payload: response.data });
        } catch (err) {
            dispatch({ type: SET_ERROR, payload: err.message });
            toast.error(err.message);
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const updateUser = async (userId, userData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.put(`/auth/users/${userId}`, userData);
            dispatch({ type: UPDATE_USER, payload: response.data });
            toast.success('User updated successfully!');
        } catch (err) {
            dispatch({ type: SET_ERROR, payload: err.message });
            toast.error(err.message);
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const deleteUser = async (userId) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.delete(`/auth/users/${userId}`);
            dispatch({ type: DELETE_USER, payload: response.data });
            toast.success('User deleted successfully!');
        } catch (err) {
            dispatch({ type: SET_ERROR, payload: err.message });
            toast.error(err.message);
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const approveUser = async (userId) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.put(`/auth/users/${userId}/approve`);
            dispatch({ type: APPROVE_USER, payload: response.data });
            toast.success('User approved successfully!');
        } catch (err) {
            dispatch({ type: SET_ERROR, payload: err.message });
            toast.error(err.message);
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const approveModerator = async (userId) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.put(`/auth/users/${userId}/approve-moderator`);
            dispatch({ type: APPROVE_MODERATOR, payload: response.data });
            toast.success('Moderator approved successfully!');
        } catch (err) {
            dispatch({ type: SET_ERROR, payload: err.message });
            toast.error(err.message);
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }


    const contextValue = {
        user,
        allUsers,
        loading,
        error,
        profileUser,
        registerUser,
        loginUser,
        logoutUser,
        getUserProfile,
        updateUserProfile,
        getAllUsers,
        updateUser,
        deleteUser,
        approveUser,
        approveModerator
    };

    
  
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
