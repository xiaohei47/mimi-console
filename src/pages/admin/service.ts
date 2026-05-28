import { request } from '@umijs/max';
import type { DashboardData, ApiResponse } from './data';

const TOKEN_KEY = 'mimi_admin_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function getDashboardData() {
  return request<ApiResponse<DashboardData>>('/admin', {
    method: 'GET',
  });
}

export async function checkLogin() {
  return request<ApiResponse<string>>('/admin/api/check', {
    method: 'GET',
  });
}

export async function login(username: string, password: string, rememberMe?: boolean) {
  const res = await request<ApiResponse<string>>('/admin/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: new URLSearchParams({
      username,
      password,
      rememberMe: String(!!rememberMe),
    }),
  });
  if (res.code === 200 && res.data) {
    setToken(res.data);
  }
  return res;
}

export async function logout() {
  try {
    await request<ApiResponse<string>>('/admin/api/logout', {
      method: 'POST',
    });
  } finally {
    clearToken();
  }
}
