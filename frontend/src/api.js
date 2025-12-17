import axios from 'axios';

const API_URL = '/api';

export const simulateRoundRobin = async (processes, quantum) => {
  try {
    const response = await axios.post(`${API_URL}/simulate`, {
      processes,
      quantum
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
