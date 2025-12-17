import api from '../utils/axios';

export interface Bookmark {
    _id: string;
    businessName: string;
    description: string;
    category: string;
    logo?: string;
    address: {
        city: string;
        state: string;
    };
    views?: number;
}

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    userType: 'user' | 'business';
    bookmarks: string[];
    createdAt: string;
}

// Add bookmark
export const addBookmark = async (businessId: string) => {
    const response = await api.post(`/user/bookmarks/${businessId}`);
    return response.data;
};

// Remove bookmark
export const removeBookmark = async (businessId: string) => {
    const response = await api.delete(`/user/bookmarks/${businessId}`);
    return response.data;
};

// Get all bookmarks
export const getBookmarks = async () => {
    const response = await api.get('/user/bookmarks');
    return response.data;
};

// Check if business is bookmarked
export const checkBookmark = async (businessId: string) => {
    const response = await api.get(`/user/bookmarks/check/${businessId}`);
    return response.data;
};

// Get user profile
export const getUserProfile = async () => {
    const response = await api.get('/user/profile');
    return response.data;
};
