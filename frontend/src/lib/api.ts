const API_BASE_URL = 'http://localhost:3000/api/v1';

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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
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

  // Auth API
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    return this.request<{ token: string; user: any }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ user: userData }),
    });
  }

  // Posts API
  async getPosts(params?: { page?: number; per_page?: number; country_id?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.country_id) queryParams.append('country_id', params.country_id.toString());

    const endpoint = `/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ posts: any[] }>(endpoint);
  }

  async searchPosts(query: string) {
    const endpoint = `/posts/search?q=${encodeURIComponent(query)}`;
    return this.request<{ posts: any[] }>(endpoint);
  }

  async getPostsByCountry(countryId: number, params?: { page?: number; per_page?: number }) {
    return this.getPosts({ ...params, country_id: countryId });
  }

  async getUserPosts(userId: string, params?: { page?: number; per_page?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

    const endpoint = `/users/${userId}/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ posts: any[] }>(endpoint);
  }

  async getPost(id: string) {
    return this.request<{ post: any }>(`/posts/${id}`);
  }

  async createPost(postData: { title: string; content: string; country_id: number }) {
    return this.request<{ post: any }>('/posts', {
      method: 'POST',
      body: JSON.stringify({ post: postData }),
    });
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
    location?: string;
    website?: string;
    avatar_url?: string;
  }) {
    return this.request<{ user: any }>('/users', {
      method: 'PUT',
      body: JSON.stringify({ user: userData }),
    });
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
      tip_count: number;
      last_post_date: string;
      recent_tips: Array<{ title: string; category: string }> 
    }> }>('/countries/stats');
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
}

export const apiClient = new ApiClient(API_BASE_URL);