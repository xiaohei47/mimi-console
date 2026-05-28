import { request } from '@umijs/max';
import type { MenuEntity, ApiResponse } from '../data';

export async function getMenuList() {
  return request<ApiResponse<MenuEntity[]>>('/admin/menu/api/list', {
    method: 'GET',
  });
}

export async function getAllMenus() {
  return request<ApiResponse<MenuEntity[]>>('/admin/menu/api/all', {
    method: 'GET',
  });
}

export async function saveMenu(data: {
  id?: number;
  name: string;
  path: string;
  status?: number;
}) {
  return request<ApiResponse<number>>('/admin/menu/api/save', {
    method: 'POST',
    params: data,
  });
}

export async function deleteMenu(id: number) {
  return request<ApiResponse<string>>('/admin/menu/api/delete', {
    method: 'POST',
    params: { id },
  });
}

export async function updateMenuStatus(id: number, status: number) {
  return request<ApiResponse<string>>('/admin/menu/api/update-status', {
    method: 'POST',
    params: { id, status },
  });
}
