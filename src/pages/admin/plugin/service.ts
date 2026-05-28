import { request } from '@umijs/max';
import type { PluginDataDTO, ApiResponse } from '../data';

export async function getPluginList() {
  return request<ApiResponse<PluginDataDTO[]>>('/admin/plugin/api/list', {
    method: 'GET',
  });
}

export async function enablePlugin(pluginId: string) {
  return request<ApiResponse<string>>(`/admin/plugin/api/enable/${pluginId}`, {
    method: 'POST',
  });
}

export async function disablePlugin(pluginId: string) {
  return request<ApiResponse<string>>(`/admin/plugin/api/disable/${pluginId}`, {
    method: 'POST',
  });
}

export async function uploadPlugin(file: File) {
  const formData = new FormData();
  formData.append('pluginFile', file);
  return request<ApiResponse<boolean>>('/admin/plugin/api/upload', {
    method: 'POST',
    data: formData,
  });
}
