import { request } from '@umijs/max';
import type { TagEntity, PageResult, ApiResponse } from '../data';

export async function getTagList(params: {
  page?: number;
  size?: number;
  keyword?: string;
}) {
  return request<ApiResponse<PageResult<TagEntity>>>('/admin/tag/api/list', {
    method: 'GET',
    params,
  });
}

export async function getAllTags() {
  return request<ApiResponse<TagEntity[]>>('/admin/tag/api/all', {
    method: 'GET',
  });
}

export async function saveTag(id?: number, name?: string) {
  return request<ApiResponse<string>>('/admin/tag/api/save', {
    method: 'POST',
    params: { id, name },
  });
}

export async function deleteTag(id: number) {
  return request<ApiResponse<string>>('/admin/tag/api/delete', {
    method: 'POST',
    params: { id },
  });
}
