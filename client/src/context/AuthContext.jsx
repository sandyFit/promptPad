import { createContext, useContext, useReducer } from 'react';
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
    APPROVE_CONTRIBUTOR,
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
export const useAuth = () => {
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
            // Remove confirmPass before sending
            const { confirmPass, ...registrationData } = userData;

            console.log('Sending registration data:', registrationData);

            const response = await apiClient.request(
                'auth/register',
                'POST',
                registrationData
            );

            console.log('Registration response:', response);

            if (response.success) {
                dispatch({ type: CREATE_USER, payload: response.user });
                return response;
            }

            throw new Error(response.message || 'Error al registrar el usuario');
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const loginUser = async (userData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.request('auth/login', 'POST', userData);
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
            await apiClient.request('auth/logout', 'POST');
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
            const response = await apiClient.request('auth/profile');
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
            const response = await apiClient.request('auth/profile', 'PUT',  userData);
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
            const response = await apiClient.request('auth');
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
            const response = await apiClient.request(`auth/users/${userId}`, 'PUT',  userData);
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
            const response = await apiClient.request(`auth/users/${userId}, 'DELETE'`);
            dispatch({ type: DELETE_USER, payload: response.data });
            toast.success('User deleted successfully!');
        } catch (err) {
            dispatch({ type: SET_ERROR, payload: err.message });
            toast.error(err.message);
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const approveContributor = async (userId) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.request(`auth/users/${userId}/approve-contributor, 'PUT'`);
            dispatch({ type: APPROVE_CONTRIBUTOR, payload: response.data });
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
            const response = await apiClient.request(`auth/users/${userId}/approve-moderator`, 'PUT');
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
        approveContributor,
        approveModerator
    };

    
  
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};


