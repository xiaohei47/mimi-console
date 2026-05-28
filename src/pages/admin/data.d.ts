export interface BaseEntity {
  createTime?: string;
  updateTime?: string;
}

export interface ContentEntity extends BaseEntity {
  id: number;
  title: string;
  content: string;
  status: number;
  summary?: string;
  img?: string;
  tags?: TagEntity[];
}

export interface TagEntity extends BaseEntity {
  id: number;
  name: string;
}

export interface CommentEntity extends BaseEntity {
  id: number;
  contentId: number;
  parentId?: number;
  author: string;
  email?: string;
  website?: string;
  ipAddress?: string;
  userAgent?: string;
  text: string;
  status: number;
  isAdmin?: boolean;
}

export interface MenuEntity extends BaseEntity {
  id: number;
  name: string;
  path: string;
  status: number;
}

export interface ResourceEntity extends BaseEntity {
  id: number;
  name: string;
  type: number;
  storageType: number;
  fileType?: string;
  size?: number;
  path?: string;
  objectKey?: string;
  url?: string;
  status: number;
  remark?: string;
  isPublic: number;
}

export interface UserEntity extends BaseEntity {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  status: number;
  role?: string;
  avatarUrl?: string;
  lastLoginTime?: string;
}

export interface PluginDataDTO {
  id: string;
  name: string;
  description?: string;
  version?: string;
  author?: string;
  enabled: boolean;
}

export interface DashboardData {
  contentCount: number;
  commentCount: number;
  tagCount: number;
  resourceCount: number;
  recentContents: ContentEntity[];
  recentComments: CommentEntity[];
}

export interface PageParams {
  page?: number;
  size?: number;
  keyword?: string;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

export interface ContentParam {
  id?: number;
  title: string;
  content: string;
  summary?: string;
  img?: string;
  status?: number;
  tagIds?: number[];
}
