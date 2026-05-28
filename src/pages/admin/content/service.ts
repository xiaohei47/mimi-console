import { request } from '@umijs/max';
import type { ContentEntity, PageResult, ApiResponse, ContentParam } from '../data';

export async function getContentList(params: {
  page?: number;
  size?: number;
  keyword?: string;
  status?: number;
}) {
  return request<ApiResponse<PageResult<ContentEntity>>>('/admin/content/api/list', {
    method: 'GET',
    params,
  });
}

export async function getContentDetail(id: number) {
  return request<ApiResponse<ContentEntity>>(`/admin/content/api/${id}`, {
    method: 'GET',
  });
}

export async function saveContent(data: ContentParam) {
  return request<ApiResponse<{ id: number }>>('/admin/content/api/save', {
    method: 'POST',
    data,
  });
}

export async function updateContentStatus(id: number, status: number) {
  return request<ApiResponse<string>>('/admin/content/api/update-status', {
    method: 'POST',
    params: { id, status },
  });
}
