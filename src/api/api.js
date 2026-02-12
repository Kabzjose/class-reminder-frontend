const API_URL = import.meta.env.VITE_API_URL || 'https://class-reminder-backend.onrender.com';
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Final API_URL:', API_URL);

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Authentication APIs
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Class APIs
export const classAPI = {
  // Get all classes for logged-in user
  getAll: async () => {
    const response = await fetch(`${API_URL}/api/classes`, {  
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Create a new class
  create: async (classData) => {
    const response = await fetch(`${API_URL}/api/classes`, {  
            method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(classData),
    });
    return handleResponse(response);
  },

  // Update an existing class
  update: async (id, classData) => {
    const response = await fetch(`${API_URL}/api/classes/${id}`, {  
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(classData),
    });
    return handleResponse(response);
  },

  // Delete a class
  delete: async (id) => {
    const response = await fetch(`${API_URL}/api/classes/${id}`, {  
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Response handler
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Handle unauthorized
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};