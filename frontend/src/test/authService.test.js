import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../services/authService';
import axiosInstance from '../api/axiosInstance';

vi.mock('../api/axiosInstance');

describe('authService API Methods', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls POST /auth/login with correct payload and returns data', async () => {
    const mockResponse = { data: { success: true, data: { token: 'jwt', user: {} } } };
    axiosInstance.post.mockResolvedValue(mockResponse);

    const result = await authService.login('test@test.com', 'password');

    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@test.com',
      password: 'password',
    });
    expect(result).toEqual(mockResponse.data);
  });

  it('calls POST /auth/register with correct payload and returns data', async () => {
    const mockResponse = { data: { success: true, message: 'Registered' } };
    axiosInstance.post.mockResolvedValue(mockResponse);

    const result = await authService.register('John', 'test@test.com', 'password');

    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/register', {
      name: 'John',
      email: 'test@test.com',
      password: 'password',
    });
    expect(result).toEqual(mockResponse.data);
  });

  it('calls POST /auth/register-admin with correct payload and returns data', async () => {
    const mockResponse = { data: { success: true, message: 'Admin Registered' } };
    axiosInstance.post.mockResolvedValue(mockResponse);

    const result = await authService.registerAdmin('Admin', 'admin@test.com', 'password');

    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/register-admin', {
      name: 'Admin',
      email: 'admin@test.com',
      password: 'password',
    });
    expect(result).toEqual(mockResponse.data);
  });
});
