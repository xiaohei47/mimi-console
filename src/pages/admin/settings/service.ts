import { request } from '@umijs/max';
import type { UserEntity, ApiResponse } from '../data';

export async function getProfile() {
  return request<ApiResponse<UserEntity>>('/admin/settings/api/profile', {
    method: 'GET',
  });
}

export async function updateProfile(data: {
  username: string;
  email?: string;
  phone?: string;
  avatar?: File;
}) {
  const formData = new FormData();
  formData.append('username', data.username);
  if (data.email) formData.append('email', data.email);
  if (data.phone) formData.append('phone', data.phone);
  if (data.avatar) formData.append('avatar', data.avatar);
  return request<ApiResponse<string>>('/admin/settings/api/profile', {
    method: 'POST',
    data: formData,
  });
}

export async function updatePassword(newPassword: string, confirmPassword: string) {
  return request<ApiResponse<string>>('/admin/settings/api/password', {
    method: 'POST',
    params: { newPassword, confirmPassword },
  });
}

export async function getSiteSettings() {
  return request<ApiResponse<{
    footerContent: string;
    logoUrl: string;
    siteEnabled: boolean;
  }>>('/admin/settings/api/site', {
    method: 'GET',
  });
}

export async function saveSiteSettings(data: {
  file?: File;
  footerContent?: string;
  siteEnabled?: boolean;
}) {
  const formData = new FormData();
  if (data.file) formData.append('file', data.file);
  if (data.footerContent) formData.append('footerContent', data.footerContent);
  if (data.siteEnabled !== undefined) formData.append('siteEnabled', String(data.siteEnabled));
  return request<ApiResponse<string>>('/admin/settings/api/site', {
    method: 'POST',
    data: formData,
  });
}

export async function getBackupStats() {
  return request<ApiResponse<{
    contentCount: number;
    commentCount: number;
    tagCount: number;
    resourceCount: number;
  }>>('/admin/settings/api/backup/stats', {
    method: 'GET',
  });
}

export async function exportBackup() {
  return request('/admin/settings/api/backup/export', {
    method: 'GET',
    responseType: 'blob',
  });
}

export async function importBackup(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request<ApiResponse<string>>('/admin/settings/api/backup/import', {
    method: 'POST',
    data: formData,
  });
}
