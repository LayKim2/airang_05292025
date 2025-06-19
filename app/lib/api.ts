// API 호출을 위한 유틸리티 함수들

// 기본 API 설정
const API_BASE = '/api';

// 공통 에러 처리
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  if (error.status === 401) {
    throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
  }
  if (error.status === 403) {
    throw new Error('권한이 없습니다.');
  }
  if (error.status === 404) {
    throw new Error('요청한 리소스를 찾을 수 없습니다.');
  }
  throw new Error(error.message || '알 수 없는 오류가 발생했습니다.');
};

// API 호출 헬퍼 함수
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw { status: response.status, message: data.error || 'API 호출 실패' };
    }

    return data;
  } catch (error) {
    handleApiError(error);
  }
};

// 게시글 관련 API
export const postsApi = {
  // 게시글 목록 조회
  getPosts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);

    return apiCall(`/posts?${searchParams.toString()}`);
  },

  // 개별 게시글 조회
  getPost: async (id: string) => {
    return apiCall(`/posts/${id}`);
  },

  // 게시글 작성
  createPost: async (data: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
  }) => {
    return apiCall('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 게시글 수정
  updatePost: async (id: string, data: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
  }) => {
    return apiCall(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // 게시글 삭제
  deletePost: async (id: string) => {
    return apiCall(`/posts/${id}`, {
      method: 'DELETE',
    });
  },
};

// 댓글 관련 API
export const commentsApi = {
  // 댓글 목록 조회
  getComments: async (postId: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams({ postId });
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    return apiCall(`/comments?${searchParams.toString()}`);
  },

  // 댓글 작성
  createComment: async (data: {
    postId: string;
    content: string;
    parentId?: string;
  }) => {
    return apiCall('/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// 파일 업로드 관련 API
export const uploadApi = {
  // 파일 업로드
  uploadFile: async (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw { status: response.status, message: data.error || '파일 업로드 실패' };
      }

      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // 파일 삭제
  deleteFile: async (filePath: string) => {
    return apiCall(`/upload?path=${encodeURIComponent(filePath)}`, {
      method: 'DELETE',
    });
  },
};

// 타입 정의
export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author_id: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  view_count?: number;
  like_count?: number;
  users: {
    first_name: string;
    last_name: string;
    avatar_url: string;
    role?: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  post_id: string;
  parent_id: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  users: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 