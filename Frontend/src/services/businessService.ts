import api from '../utils/axios';

export interface Service {
    name: string;
    description?: string;
    price?: string;
    _id?: string;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
}

export interface OperatingHours {
    [key: string]: {
        open: string;
        close: string;
    };
}

export interface SocialMedia {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
}

export interface Business {
    _id?: string;
    owner?: string;
    businessName: string;
    description: string;
    category: string;
    logo?: string;
    contactEmail: string;
    contactPhone: string;
    address: Address;
    services?: Service[];
    website?: string;
    socialMedia?: SocialMedia;
    operatingHours?: OperatingHours;
    isActive?: boolean;
    views?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface BusinessResponse {
    success: boolean;
    message?: string;
    business?: Business;
    businesses?: Business[];
    count?: number;
    totalPages?: number;
    currentPage?: number;
    total?: number;
}

// Create business profile
export const createBusiness = async (data: Partial<Business>): Promise<BusinessResponse> => {
    const response = await api.post('/business', data);
    return response.data;
};

// Get my businesses (returns all businesses owned by current user)
export const getMyBusiness = async (): Promise<BusinessResponse> => {
    const response = await api.get('/business/my-business');
    return response.data;
};

// Update business
export const updateBusiness = async (id: string, data: Partial<Business>): Promise<BusinessResponse> => {
    const response = await api.put(`/business/${id}`, data);
    return response.data;
};

// Delete business
export const deleteBusiness = async (id: string): Promise<BusinessResponse> => {
    const response = await api.delete(`/business/${id}`);
    return response.data;
};

// Get all businesses (public)
export const getAllBusinesses = async (params?: {
    search?: string;
    category?: string;
    city?: string;
    page?: number;
    limit?: number;
}): Promise<BusinessResponse> => {
    const response = await api.get('/business', { params });
    return response.data;
};

// Get business by ID (public)
export const getBusinessById = async (id: string): Promise<BusinessResponse> => {
    const response = await api.get(`/business/${id}`);
    return response.data;
};
