import { apiCall } from "../../../utils"

// GET users
export const fetchUsersAPI = () => {
    return apiCall({ endpoint: 'form', method: 'GET' });
}

// POST user
export const createUserAPI = (userData) => {
    return apiCall({ endpoint: 'form', method: "POST", body: userData });
}

// PUT user
export const updateUserAPI = (id, userData) => {
    return apiCall({ endpoint: `form/${id}`, method: "PUT", body: userData });
}

// DELETE user
export const deleteUserAPI = (id) => {
    return apiCall({ endpoint: `form/${id}`, method: "DELETE" });
};