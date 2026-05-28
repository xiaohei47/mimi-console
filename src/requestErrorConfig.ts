import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { message } from 'antd';
import { clearToken } from '@/pages/admin/service';

interface BackendResponse {
  code: number;
  message: string;
  data: unknown;
}

export const errorConfig: RequestConfig = {
  errorConfig: {
    errorThrower: (res) => {
      const { code, message: msg } = res as unknown as BackendResponse;
      if (code !== 200) {
        const error: any = new Error(msg || '请求失败');
        error.name = 'BizError';
        error.info = { code, message: msg };
        throw error;
      }
    },
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      if (error.name === 'BizError') {
        message.error(error.message);
      } else if (error.response) {
        if (error.response.status === 401) {
          clearToken();
          const { pathname, search, hash } = history.location;
          history.replace(`/user/login?redirect=${encodeURIComponent(pathname + search + hash)}`);
          return;
        }
        message.error(`Response status:${error.response.status}`);
      } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
        message.error('网络不可用，请检查网络连接后重试。');
      } else if (error.request) {
        message.error('None response! Please retry.');
      } else {
        message.error('Request error, please retry.');
      }
    },
  },

  requestInterceptors: [],

  responseInterceptors: [],
};
