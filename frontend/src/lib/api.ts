const API_BASE_URL = 'http://localhost:3000/api/v1';
const BACKEND_URL = 'http://localhost:3000';

// 相対パスの画像URLをフルURLに変換するヘルパー
export const getFullImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  // すでにフルURL（httpで始まる）の場合はそのまま返す
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // 相対パスの場合はバックエンドURLを付加
  return `${BACKEND_URL}${url}`;
};

interface ApiResponse<T> {
  data?: T;
  error?: string;
  errors?: string[];
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
  localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // requestメソッドは、endpointとoptionsを受け取り、Promise<ApiResponse<T>>を返す
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // ここにendpointとoptionsを使用して、APIリクエストを送信するコードを書く
    const url = `${this.baseURL}${endpoint}`;
    // headersは、Content-Type: application/jsonとoptions.headersをマージしたオブジェクトを作成する
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || data.errors?.join(', ') || 'エラーが発生しました',
          errors: data.errors,
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'ネットワークエラーが発生しました',
      };
    }
  }

  // FormDataを使うリクエスト（画像アップロード用）
  private async requestWithFormData<T>(
    endpoint: string,
    formData: FormData,
    method: string = 'POST'
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {};

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || data.errors?.join(', ') || 'エラーが発生しました',
          errors: data.errors,
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'ネットワークエラーが発生しました',
      };
    }
  }

  // Auth API
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // userDataは
  // { name: string;
  //  email: string;
  //  password: string;
  //  password_confirmation: string }
  // の形の引数を受け取る
  async signup(userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    // requestメソッドを使用する
    // request成功時のresponseは{ token: string; user: any }の形のオブジェクトを返す
    return this.request<{ token: string; user: any }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ user: userData }),
    });
  }

  // Posts API
  async getPosts(params?: { 
    page?: number; 
    per_page?: number; 
    country_id?: number;
    category?: string | string[];
    sort?: 'recent' | 'popular';
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.country_id) queryParams.append('country_id', params.country_id.toString());
    if (params?.category) {
      if (Array.isArray(params.category)) {
        params.category.forEach(cat => queryParams.append('category[]', cat));
      } else {
        queryParams.append('category', params.category);
      }
    }
    if (params?.sort) queryParams.append('sort', params.sort);

    const endpoint = `/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ 
      posts: any[];
      pagination?: {
        page: number;
        per_page: number;
        total_count: number;
        total_pages: number;
      };
    }>(endpoint);
  }

  async searchPosts(query: string) {
    const endpoint = `/posts/search?q=${encodeURIComponent(query)}`;
    return this.request<{ posts: any[] }>(endpoint);
  }

  async getPostsByCountry(
    countryId: number, 
    params?: { 
      page?: number; 
      per_page?: number;
      category?: string;
      sort?: 'recent' | 'popular';
    }
  ) {
    return this.getPosts({ ...params, country_id: countryId });
  }

  async getPostCategories() {
    return this.request<{ categories: string[] }>('/posts/categories');
  }

  async getUserPosts(userId: string, params?: { page?: number; per_page?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

    const endpoint = `/users/${userId}/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ posts: any[] }>(endpoint);
  }

  async getPost(id: string, countView: boolean = true) {
    const endpoint = countView ? `/posts/${id}` : `/posts/${id}?count_view=false`;
    return this.request<{ post: any }>(endpoint);
  }

  async createPost(postData: { title: string; content: string; country_id: number; category?: string }) {
    return this.request<{ post: any }>('/posts', {
      method: 'POST',
      body: JSON.stringify({ post: postData }),
    });
  }

  async createPostWithImages(formData: FormData) {
    return this.requestWithFormData<{ post: any }>('/posts', formData);
  }

  async updatePost(id: string, postData: { title?: string; content?: string; country_id?: number }) {
    return this.request<{ post: any }>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ post: postData }),
    });
  }

  async deletePost(id: string) {
    return this.request<{ message: string }>(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  // Users API
  async getUsers(params?: { page?: number; per_page?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

    const endpoint = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ users: any[] }>(endpoint);
  }

  async getUser(id: string) {
    return this.request<{ user: any }>(`/users/${id}`);
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/users/profile');
  }

  async updateUser(userData: {
    name?: string;
    email?: string;
    bio?: string;
    avatar_url?: string;
  }) {
    return this.request<{ user: any }>('/users', {
      method: 'PUT',
      body: JSON.stringify({ user: userData }),
    });
  }

  // Comments API
  async getComments(postId: string) {
    return this.request<{
      comments: Array<{
        id: number;
        content: string;
        user: {
          id: number;
          name: string;
          avatar_url?: string;
          email?: string;
        };
        created_at: string;
        updated_at: string;
      }>;
    }>(`/posts/${postId}/comments`);
  }

  async createComment(postId: string, content: string) {
    return this.request<{
      comment: {
        id: number;
        content: string;
        user: {
          id: number;
          name: string;
          avatar_url?: string;
          email?: string;
        };
        created_at: string;
        updated_at: string;
      };
    }>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment: { content } }),
    });
  }

  async updateComment(postId: string, commentId: number, content: string) {
    return this.request<{
      comment: {
        id: number;
        content: string;
        user: {
          id: number;
          name: string;
          avatar_url?: string;
          email?: string;
        };
        created_at: string;
        updated_at: string;
      };
    }>(`/posts/${postId}/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ comment: { content } }),
    });
  }

  async deleteComment(postId: string, commentId: number) {
    return this.request<{ message: string }>(`/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  // Likes API
  async toggleLike(postId: string) {
    return this.request<{
      liked: boolean;
      likes_count: number;
    }>(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async getLikeStatus(postId: string) {
    return this.request<{
      liked: boolean;
      likes_count: number;
    }>(`/posts/${postId}/like/status`);
  }

  // Bookmarks API
  async getBookmarks() {
    return this.request<{ posts: any[] }>('/bookmarks');
  }

  async addBookmark(postId: string) {
    return this.request<{ bookmarked: boolean; bookmarks_count: number; message: string }>(`/posts/${postId}/bookmark`, {
      method: 'POST',
    });
  }

  async removeBookmark(postId: string) {
    return this.request<{ bookmarked: boolean; bookmarks_count: number; message: string }>(`/posts/${postId}/bookmark`, {
      method: 'DELETE',
    });
  }

  async getBookmarkStatus(postId: string) {
    return this.request<{ bookmarked: boolean; bookmarks_count: number }>(`/posts/${postId}/bookmark/status`);
  }

  // Countries API
  async getCountries() {
    return this.request<{ countries: Array<{ id: number; code: string; name: string; flag_emoji: string }> }>('/countries');
  }

  async getCountryStats() {
    return this.request<{ countries: Array<{ 
      id: number;
      code: string; 
      name: string;
      flag_emoji: string;
      image_url?: string;
      tip_count: number;
      last_post_date: string;
      recent_tips: Array<{ title: string; category: string }> 
    }> }>('/countries/stats');
  }

  async getCountriesByAreas() {
    return this.request<{ 
      areas: Array<{
        id: number;
        name: string;
        countries: Array<{
          id: number;
          code: string;
          name: string;
          flag_emoji: string;
          tip_count: number;
          view_count: number;
        }>;
      }>;
    }>('/countries/by_areas');
  }

  // Password Reset API
  async requestPasswordReset(email: string) {
    return this.request<{ message: string }>('/auth/password_reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string, passwordConfirmation: string) {
    return this.request<{ message: string }>('/auth/password_reset/confirm', {
      method: 'POST',
      body: JSON.stringify({ 
        token, 
        password, 
        password_confirmation: passwordConfirmation 
      }),
    });
  }

  // Admin API
  async getAdminPosts(params?: {
    page?: number;
    per_page?: number;
    q?: string;
    sort?: 'recent' | 'popular';
    country_id?: number;
    category?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.q) queryParams.append('q', params.q);
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.country_id) queryParams.append('country_id', params.country_id.toString());
    if (params?.category) queryParams.append('category', params.category);

    const endpoint = `/admin/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{
      posts: any[];
      pagination?: {
        page: number;
        per_page: number;
        total_count: number;
        total_pages: number;
      };
    }>(endpoint);
  }

  async getAdminPost(id: string) {
    return this.request<{ post: any }>(`/admin/posts/${id}`);
  }

  async updateAdminPost(id: string, postData: {
    title?: string;
    content?: string;
    category?: string;
    featured?: boolean;
    country_id?: number;
  }) {
    return this.request<{ post: any }>(`/admin/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ post: postData }),
    });
  }

  async deleteAdminPost(id: string) {
    return this.request<{ message: string }>(`/admin/posts/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminUsers(params?: {
    page?: number;
    per_page?: number;
    q?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.q) queryParams.append('q', params.q);

    const endpoint = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{
      users: any[];
      pagination?: {
        page: number;
        per_page: number;
        total_count: number;
        total_pages: number;
      };
    }>(endpoint);
  }

  async getAdminUser(id: string) {
    return this.request<{ user: any }>(`/admin/users/${id}`);
  }

  async updateAdminUser(id: string, userData: {
    name?: string;
    email?: string;
    bio?: string;
    admin?: boolean;
  }) {
    return this.request<{ user: any }>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ user: userData }),
    });
  }

  async deleteAdminUser(id: string) {
    return this.request<{ message: string }>(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Contact API
  async submitContact(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    return this.request<{ message: string; contact: any }>('/contacts', {
      method: 'POST',
      body: JSON.stringify({ contact: data }),
    });
  }

  // Admin Contact API
  async getAdminContacts(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    unread?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.unread) queryParams.append('unread', 'true');

    const endpoint = `/admin/contacts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{
      contacts: any[];
      pagination?: {
        page: number;
        per_page: number;
        total_count: number;
        total_pages: number;
      };
      unread_count: number;
    }>(endpoint);
  }

  async updateAdminContact(id: number, data: { status?: string; read?: boolean }) {
    return this.request<{ contact: any }>(`/admin/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ contact: data }),
    });
  }

  async deleteAdminContact(id: number) {
    return this.request<{ message: string }>(`/admin/contacts/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);