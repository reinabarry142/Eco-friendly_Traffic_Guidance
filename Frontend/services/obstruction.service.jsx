import api from './api';

export const signalerObstruction = async (formData) => {
  try {
    const response = await api.post('/obstruction/report', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du signalement' };
  }
};


export const getValidatedObstructions = async () => {
  try {
    const response = await api.get('/obstructions?validated=true');
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des obstructions :", error);
    return [];
  }
};