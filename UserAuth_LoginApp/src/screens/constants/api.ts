import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://10.0.2.2:5017/api/auth';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const sendEmailVerification = async (email: string): Promise<AxiosResponse<ApiResponse>> => {
  return api.post('/requesttoken', { email });
};

export const verifyEmail = async (userId: string, token: string): Promise<AxiosResponse<ApiResponse>> => {
  return api.post('/verifyemail', { userId, token });
};

export const sendOTP = async (mobile: string): Promise<AxiosResponse<ApiResponse>> => {
  return api.post('/requestotp', { mobile });
};

export const verifyOTP = async (userId: string, otp: string): Promise<AxiosResponse<ApiResponse>> => {
  return api.post('/verifyotp', { userId, otp });
};