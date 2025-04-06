import axios from 'axios';

class Services {
  baseUrl: string;

  constructor() {
    this.baseUrl = 'https://api-colombia.com/api/v1';
  }

  async getDepartments() {
    try {
      const response = await axios.get(`${this.baseUrl}/Department`);
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
  }

  async getCitiesByDepartment(departmentId: number) {
    try {
      const response = await axios.get(`${this.baseUrl}/Department/${departmentId}/cities`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  }
}

export default new Services();