import { request } from '@umijs/max';
import type { CommentEntity, PageResult, ApiResponse } from '../data';

export async function getCommentList(params: {
  page?: number;
  size?: number;
  keyword?: string;
  status?: number;
}) {
  return request<ApiResponse<PageResult<CommentEntity>>>('/admin/comments/api/list', {
    method: 'GET',
    params,
  });
}

export async function updateCommentStatus(id: number, status: number) {
  return request<ApiResponse<string>>(`/admin/comments/${id}/status`, {
    method: 'POST',
    params: { status },
  });
}

export async function deleteComment(id: number) {
  return request<ApiResponse<string>>(`/admin/comments/${id}/delete`, {
    method: 'POST',
  });
}

export async function replyComment(parentId: number, text: string) {
  return request<ApiResponse<string>>('/admin/comments/reply', {
    method: 'POST',
    params: { parentId, text },
  });
}
