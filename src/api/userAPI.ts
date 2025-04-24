/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from './axiosInstance';

export const registerUser = (data:any) => axios.post('api/users/register/', data);
export const loginUser = (data:any) => axios.post('api/users/login/', data);
export const getUsers = async () => {
    try {
      const response = await axios.get('api/users/');
      return response.data; 
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };
  export const changeUserStatus = async (
    id: number,
    status: 'pending' | 'cancel' | 'active' 
  ): Promise<any> => {
    try {
      const response = await axios.patch(`api/users/${id}/update_user_status/`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating user status for user ${id}:`, error);
      throw error;
    }
  };
  export const deleteUser = async (id: number) => {
    try {
      const response = await axios.delete(`api/users/${id}/delete_user/`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  };

    export const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
      return usersData.users;
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

