import { request } from '@umijs/max';
import type { ResourceEntity, ContentEntity, PageResult, ApiResponse } from '../data';

export async function getResourceList(params: {
  page?: number;
  size?: number;
  name?: string;
  type?: number;
}) {
  return request<ApiResponse<PageResult<ResourceEntity>>>('/admin/resources/api/list', {
    method: 'GET',
    params,
  });
}

export async function getResourceDetail(id: number) {
  return request<ApiResponse<{ resource: ResourceEntity; usedContents: ContentEntity[] }>>(
    `/admin/resources/api/${id}`,
    { method: 'GET' }
  );
}

export async function uploadResource(file: File, remark?: string) {
  const formData = new FormData();
  formData.append('file', file);
  if (remark) {
    formData.append('remark', remark);
  }
  return request<ApiResponse<string>>('/admin/resources/api/upload', {
    method: 'POST',
    data: formData,
  });
}

export async function deleteResource(id: number) {
  return request<ApiResponse<string>>(`/admin/resources/api/delete/${id}`, {
    method: 'POST',
  });
}
