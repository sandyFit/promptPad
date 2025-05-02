export const CREATE_PROMPT = 'CREATE_PROMPT';
export const SET_ALL_PROMPTS = 'SET_ALL_PROMPTS';
export const SET_PROMPT = 'SET_PROMPT';
export const UPDATE_PROMPT = 'UPDATE_PROMPT';
export const DELETE_PROMPT = 'DELETE_PROMPT';
export const APPROVE_PROMPT = 'APPROVE_PROMPT';
export const CREATE_USER = 'CREATE_USER';
export const SET_ALL_USERS = 'SET_ALL_USERS';
export const SET_USER = 'SET_USER'; 
export const UPDATE_USER = 'UPDATE_USER';
export const DELETE_USER = 'DELETE_USER';
export const SET_PROFILE_USER = 'SET_PROFILE_USER';
export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';
export const APPROVE_CONTRIBUTOR = 'APPROVE_CONTRIBUTOR';
export const APPROVE_MODERATOR = 'APPROVE_MODERATOR';
export const CREATE_TAG = 'CREATE_TAG';
export const SET_ALL_TAGS = 'SET_ALL_TAGS';
export const SET_TAG = 'SET_TAG';
export const UPDATE_TAG = 'UPDATE_TAG';
export const DELETE_TAG = 'DELETE_TAG';
export const APPROVE_TAG = 'APPROVE_TAG';
export const SET_ERROR = 'SET_ERROR';
export const SET_LOADING = 'SET_LOADING';

export const reducer = (state, action) => {
    switch (action.type) {
        case CREATE_PROMPT:
            return { ...state, allPrompts: [...state.allPrompts, action.payload] };
        case SET_ALL_PROMPTS:
            return {
                ...state,
                allPrompts: JSON.stringify(state.allPrompts) === JSON.stringify(action.payload)
                    ? state.allPrompts
                    : action.payload,
                loading: false,
            };
        case SET_PROMPT:
            return { ...state, prompt: action.payload };
        case UPDATE_PROMPT:
            return { ...state, allPrompts: state.allPrompts.map(prompt => prompt._id === action.payload._id ? action.payload : prompt) };
        case DELETE_PROMPT:
            return { ...state, allPrompts: state.allPrompts.filter(prompt => prompt._id !== action.payload) };
        case APPROVE_PROMPT:
            return { ...state, allPrompts: state.allPrompts.map(prompt => prompt._id === action.payload._id ? action.payload : prompt) };
        case CREATE_USER:
            return {
                ...state,
                allUsers: state.allUsers ? [...state.allUsers, action.payload] : [action.payload]
            };
        case SET_ALL_USERS:
            return { ...state, allUsers: action.payload };
        case SET_USER:
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null
            };
        case SET_PROFILE_USER:
            return { ...state, profileUser: action.payload };
        case UPDATE_USER_PROFILE:
            return {
                ...state,
                allUsers: state.allUsers.map(user => user._id === action.payload._id ? action.payload : user)
            };
        case UPDATE_USER:
            return {
                ...state,
                allUsers: state.allUsers.map(user => user._id === action.payload._id ? action.payload : user)
            }
        case DELETE_USER:
            return {
                ...state,
                allUsers: state.allUsers.filter(user => user._id !== action.payload)
            }
        case APPROVE_CONTRIBUTOR:
            return {
                ...state,
                allUsers: state.allUsers.map(user => user._id === action.payload._id ? action.payload : user)
            }
        case APPROVE_MODERATOR:
            return {
                ...state,
                allUsers: state.allUsers.map(user => user._id === action.payload._id ? action.payload : user)
            }
        
        
        case CREATE_TAG:
            return { ...state, allTags: [...state.allTags, action.payload] };
        case SET_ALL_TAGS:
            return {
                ...state,
                allTags: JSON.stringify(state.allTags) === JSON.stringify(action.payload)
                    ? state.allTags
                    : action.payload,
                loading: false,
            };
        case SET_TAG:
            return { ...state, tag: action.payload };
        case UPDATE_TAG:
            return { ...state, 
                allTags: state.allTags.map(tag => tag._id === action.payload._id ? action.payload : tag) };
        case DELETE_TAG:
            return { ...state, allTags: state.allTags.filter(tag => tag._id !== action.payload) };
        case APPROVE_TAG:
            return { ...state, 
                allTags: state.allTags.map(tag => tag._id === action.payload._id ? action.payload : tag) };

        case SET_ERROR:
            return { ...state, error: action.payload };
        case SET_LOADING:
            return { ...state, loading: action.payload };
        default:
            console.warn(`Unhandled action type: ${action.type}`);
            return state;
    }
}
