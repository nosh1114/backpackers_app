import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Edit, Trash2, Users, FileText, Eye, Mail, Check, Clock, ChevronDown, X, MapPin, Luggage, Smartphone, Plane, UtensilsCrossed, Bed, Zap } from 'lucide-react';
import { apiClient } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { getAvatarUrl } from '../lib/gravatar';

// カテゴリのアイコンマッピング
const categoryIconMap: Record<string, React.ReactNode> = {
  '準備': <Luggage className="w-4 h-4" />,
  '通信': <Smartphone className="w-4 h-4" />,
  '移動': <Plane className="w-4 h-4" />,
  '食': <UtensilsCrossed className="w-4 h-4" />,
  '宿泊': <Bed className="w-4 h-4" />,
  '裏ワザ': <Zap className="w-4 h-4" />,
};

interface Post {
  id: number;
  title: string;
  category?: string;
  featured?: boolean;
  country: {
    id: number;
    name: string;
    flag_emoji: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  view_count?: number;
  created_at: string;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  admin?: boolean;
  posts_count?: number;
  created_at: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  read: boolean;
  created_at: string;
}

type TabType = 'posts' | 'users' | 'contacts';

export function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  
  // Posts state
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<'recent' | 'popular'>('recent');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<{
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [countries, setCountries] = useState<Array<{ id: number; name: string; flag_emoji: string }>>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  // 新しい検索機能用の状態
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const countrySearchInputRef = useRef<HTMLInputElement>(null);

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [usersPage, setUsersPage] = useState(1);
  const [usersPagination, setUsersPagination] = useState<{
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  } | null>(null);

  // Contacts state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [contactsPage, setContactsPage] = useState(1);
  const [contactsPagination, setContactsPagination] = useState<{
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || !user.admin) {
      navigate('/');
      return;
    }
    
    if (activeTab === 'posts') {
      fetchPosts();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'contacts') {
      fetchContacts();
    }
  }, [user, activeTab, page, searchQuery, sort, usersPage, userSearchQuery, contactsPage, selectedCountry, selectedCategory]);

  // 国とカテゴリーの取得（初回のみ）
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [countriesRes, categoriesRes] = await Promise.all([
          apiClient.getCountries(),
          apiClient.getPostCategories()
        ]);
        if (countriesRes.data?.countries) {
          setCountries(countriesRes.data.countries);
        }
        if (categoriesRes.data?.categories) {
          setCategories(categoriesRes.data.categories);
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, []);

  // ドロップダウンの外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 国のフィルタリング
  const filteredCountries = useMemo(() => {
    if (!countrySearchQuery.trim()) return countries;
    const searchLower = countrySearchQuery.toLowerCase();
    return countries.filter(country =>
      country.name.toLowerCase().includes(searchLower)
    );
  }, [countries, countrySearchQuery]);

  // 選択された国を取得
  const selectedCountryData = useMemo(() => {
    return countries.find(c => c.id === selectedCountry);
  }, [countries, selectedCountry]);

  // 国選択
  const handleCountrySelect = (country: { id: number; name: string; flag_emoji: string }) => {
    setSelectedCountry(country.id);
    setIsCountryDropdownOpen(false);
    setCountrySearchQuery('');
    setPage(1);
  };

  // カテゴリ選択
  const handleCategorySelectFilter = (cat: string) => {
    setSelectedCategory(cat);
    setIsCategoryDropdownOpen(false);
    setPage(1);
  };

  // 検索入力にフォーカス
  useEffect(() => {
    if (isCountryDropdownOpen && countrySearchInputRef.current) {
      setTimeout(() => countrySearchInputRef.current?.focus(), 100);
    }
  }, [isCountryDropdownOpen]);

  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      const response = await apiClient.getAdminPosts({
        page,
        per_page: 30,
        q: searchQuery || undefined,
        sort,
        country_id: selectedCountry || undefined,
        category: selectedCategory || undefined
      });

      if (response.data) {
        setPosts(response.data.posts || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } else {
        console.error('Failed to fetch posts:', response.error);
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching admin posts:', error);
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await apiClient.getAdminUsers({
        page: usersPage,
        per_page: 30,
        q: userSearchQuery || undefined
      });

      if (response.data) {
        setUsers(response.data.users || []);
        if (response.data.pagination) {
          setUsersPagination(response.data.pagination);
        }
      } else {
        console.error('Failed to fetch users:', response.error);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      setContactsLoading(true);
      const response = await apiClient.getAdminContacts({
        page: contactsPage,
        per_page: 30
      });

      if (response.data) {
        setContacts(response.data.contacts || []);
        if (response.data.pagination) {
          setContactsPagination(response.data.pagination);
        }
        setUnreadCount(response.data.unread_count || 0);
      } else {
        console.error('Failed to fetch contacts:', response.error);
        setContacts([]);
      }
    } catch (error) {
      console.error('Error fetching admin contacts:', error);
      setContacts([]);
    } finally {
      setContactsLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('本当に削除しますか？')) return;

    try {
      const response = await apiClient.deleteAdminPost(postId.toString());
      if (response.data) {
        fetchPosts();
      } else {
        alert('削除に失敗しました: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('削除に失敗しました');
    }
  };

  const handleToggleFeatured = async (postId: number, currentFeatured: boolean) => {
    try {
      const response = await apiClient.updateAdminPost(postId.toString(), {
        featured: !currentFeatured
      });
      if (response.data) {
        fetchPosts();
      } else {
        alert('特集の更新に失敗しました: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
      alert('特集の更新に失敗しました');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('本当に削除しますか？')) return;

    try {
      const response = await apiClient.deleteAdminUser(userId.toString());
      if (response.data) {
        fetchUsers();
      } else {
        alert('削除に失敗しました: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('削除に失敗しました');
    }
  };

  const handleMarkAsRead = async (contactId: number) => {
    try {
      await apiClient.updateAdminContact(contactId, { read: true });
      fetchContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleUpdateContactStatus = async (contactId: number, status: string) => {
    try {
      await apiClient.updateAdminContact(contactId, { status });
      fetchContacts();
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const handleDeleteContact = async (contactId: number) => {
    if (!confirm('本当に削除しますか？')) return;

    try {
      const response = await apiClient.deleteAdminContact(contactId);
      if (response.data) {
        fetchContacts();
      } else {
        alert('削除に失敗しました: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('削除に失敗しました');
    }
  };

  const getSubjectLabel = (subject: string) => {
    const labels: { [key: string]: string } = {
      question: '質問',
      bug: '不具合報告',
      feedback: '要望',
      report: '違反報告',
      other: 'その他'
    };
    return labels[subject] || subject;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: '未対応',
      in_progress: '対応中',
      resolved: '解決済み'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!user || !user.admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">管理画面</h1>
          <p className="text-gray-600 mt-2">ユーザーと投稿の管理</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setActiveTab('posts');
                setPage(1);
              }}
              className={`px-6 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>投稿管理</span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('users');
                setUsersPage(1);
              }}
              className={`px-6 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>ユーザー管理</span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('contacts');
                setContactsPage(1);
              }}
              className={`px-6 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'contacts'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>お問い合わせ</span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'posts' ? (
          <>
            {/* Posts Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex-1 w-full lg:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="タイトルや内容で検索..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">並び替え:</span>
                  <button
                    onClick={() => {
                      setSort('recent');
                      setPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sort === 'recent'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    新着順
                  </button>
                  <button
                    onClick={() => {
                      setSort('popular');
                      setPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sort === 'popular'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    人気順
                  </button>
                </div>
              </div>
              {/* フィルター - 改良版 */}
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200">
                {/* 国フィルター - 検索機能付きドロップダウン */}
                <div className="relative" ref={countryDropdownRef}>
                  <label className="text-sm text-gray-600 block mb-1">国:</label>
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className={`min-w-[200px] px-3 py-2 border rounded-lg text-sm flex items-center justify-between transition-all ${
                      isCountryDropdownOpen
                        ? 'border-blue-500 ring-2 ring-blue-100 bg-white'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedCountryData ? (
                        <>
                          <span>{selectedCountryData.flag_emoji}</span>
                          <span className="font-medium">{selectedCountryData.name}</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-500">すべての国</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {selectedCountry && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCountry(null);
                            setPage(1);
                          }}
                          className="p-0.5 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {isCountryDropdownOpen && (
                    <div className="absolute z-30 w-72 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                      {/* 検索入力 */}
                      <div className="p-2 border-b border-gray-100 bg-gray-50">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            ref={countrySearchInputRef}
                            type="text"
                            value={countrySearchQuery}
                            onChange={(e) => setCountrySearchQuery(e.target.value)}
                            placeholder="国名で検索..."
                            className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                          {countrySearchQuery && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCountrySearchQuery('');
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* 国一覧 */}
                      <div className="max-h-64 overflow-y-auto">
                        {/* すべての国オプション */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCountry(null);
                            setIsCountryDropdownOpen(false);
                            setCountrySearchQuery('');
                            setPage(1);
                          }}
                          className={`w-full text-left px-4 py-2.5 flex items-center gap-2 transition-colors ${
                            !selectedCountry ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                          }`}
                        >
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">すべての国</span>
                          {!selectedCountry && <Check className="w-4 h-4 ml-auto text-blue-500" />}
                        </button>
                        
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country) => (
                            <button
                              key={country.id}
                              type="button"
                              onClick={() => handleCountrySelect(country)}
                              className={`w-full text-left px-4 py-2.5 flex items-center gap-2 transition-colors ${
                                selectedCountry === country.id
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <span className="text-base">{country.flag_emoji}</span>
                              <span className="font-medium">{country.name}</span>
                              {selectedCountry === country.id && (
                                <Check className="w-4 h-4 ml-auto text-blue-500" />
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-gray-500 text-sm">
                            「{countrySearchQuery}」に該当する国が見つかりません
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* カテゴリフィルター - 検索機能付きドロップダウン */}
                <div className="relative" ref={categoryDropdownRef}>
                  <label className="text-sm text-gray-600 block mb-1">カテゴリー:</label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className={`min-w-[180px] px-3 py-2 border rounded-lg text-sm flex items-center justify-between transition-all ${
                      isCategoryDropdownOpen
                        ? 'border-blue-500 ring-2 ring-blue-100 bg-white'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedCategory ? (
                        <>
                          <span className="text-blue-500">{categoryIconMap[selectedCategory]}</span>
                          <span className="font-medium">{selectedCategory}</span>
                        </>
                      ) : (
                        <span className="text-gray-500">すべて</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {selectedCategory && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory('');
                            setPage(1);
                          }}
                          className="p-0.5 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {isCategoryDropdownOpen && (
                    <div className="absolute z-30 w-64 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                      <div className="p-2">
                        {/* すべてのオプション */}
                        <button
                          type="button"
                          onClick={() => handleCategorySelectFilter('')}
                          className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors ${
                            !selectedCategory ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                          }`}
                        >
                          <span className="w-4 h-4 rounded bg-gray-200"></span>
                          <span className="font-medium">すべて</span>
                          {!selectedCategory && <Check className="w-4 h-4 ml-auto text-blue-500" />}
                        </button>
                        
                        {/* カテゴリ一覧 */}
                        <div className="mt-1 space-y-1">
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => handleCategorySelectFilter(cat)}
                              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors ${
                                selectedCategory === cat
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <span className={selectedCategory === cat ? 'text-blue-500' : 'text-gray-400'}>
                                {categoryIconMap[cat] || <span className="w-4 h-4"></span>}
                              </span>
                              <span className="font-medium">{cat}</span>
                              {selectedCategory === cat && (
                                <Check className="w-4 h-4 ml-auto text-blue-500" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {(selectedCountry || selectedCategory) && (
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSelectedCountry(null);
                        setSelectedCategory('');
                        setPage(1);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 px-3 py-2"
                    >
                      フィルターをクリア
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Posts Table */}
            {postsLoading ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">読み込み中...</p>
              </div>
            ) : posts.length > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タイトル</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">国</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">カテゴリー</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">投稿者</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">閲覧数</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">特集</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.id}</td>
                          <td className="px-6 py-4 text-sm">
                            <div className="max-w-xs truncate font-medium" title={post.title}>{post.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {post.country.flag_emoji} {post.country.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {post.category ? (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {post.category}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <Link 
                              to={`/admin/users/${post.user.id}/edit`}
                              className="hover:text-blue-600"
                            >
                              {post.user.name}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.view_count || 0}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleToggleFeatured(post.id, post.featured || false)}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                post.featured
                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={post.featured ? '特集を解除' : '特集に設定'}
                            >
                              {post.featured ? '特集' : '通常'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(post.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/admin/posts/${post.id}/edit`}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="編集"
                              >
                                <Edit className="w-5 h-5" />
                              </Link>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="削除"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {pagination && (
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      全{pagination.total_count}件中 {((page - 1) * pagination.per_page) + 1}〜{Math.min(page * pagination.per_page, pagination.total_count)}件を表示
                    </div>
                    {pagination.total_pages > 1 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPage(page - 1)}
                          disabled={page === 1}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            page === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                          }`}
                        >
                          前へ
                        </button>
                        <span className="text-sm text-gray-700">
                          {page} / {pagination.total_pages}
                        </span>
                        <button
                          onClick={() => setPage(page + 1)}
                          disabled={page === pagination.total_pages}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            page === pagination.total_pages
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                          }`}
                        >
                          次へ
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchQuery ? '投稿が見つかりませんでした' : '投稿がありません'}
                </h3>
                <p className="text-gray-600">
                  {searchQuery ? '検索条件を変更して再度お試しください' : 'まだ投稿がありません'}
                </p>
              </div>
            )}
          </>
        ) : activeTab === 'users' ? (
          <>
            {/* Users Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex-1 w-full lg:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="名前やメールアドレスで検索..."
                      value={userSearchQuery}
                      onChange={(e) => {
                        setUserSearchQuery(e.target.value);
                        setUsersPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            {usersLoading ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">読み込み中...</p>
              </div>
            ) : users.length > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ユーザー</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メール</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">投稿数</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">管理者</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">登録日</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((adminUser) => (
                        <tr key={adminUser.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{adminUser.id}</td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-3">
                              <img
                                src={getAvatarUrl(adminUser.avatar_url, adminUser.email, 32)}
                                alt={adminUser.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <span className="font-medium text-gray-900">{adminUser.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{adminUser.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {adminUser.posts_count || 0}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {adminUser.admin ? (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">管理者</span>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(adminUser.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/admin/users/${adminUser.id}/edit`}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="編集"
                              >
                                <Edit className="w-5 h-5" />
                              </Link>
                              <button
                                onClick={() => handleDeleteUser(adminUser.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="削除"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {usersPagination && (
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      全{usersPagination.total_count}件中 {((usersPage - 1) * usersPagination.per_page) + 1}〜{Math.min(usersPage * usersPagination.per_page, usersPagination.total_count)}件を表示
                    </div>
                    {usersPagination.total_pages > 1 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setUsersPage(usersPage - 1)}
                          disabled={usersPage === 1}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            usersPage === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                          }`}
                        >
                          前へ
                        </button>
                        <span className="text-sm text-gray-700">
                          {usersPage} / {usersPagination.total_pages}
                        </span>
                        <button
                          onClick={() => setUsersPage(usersPage + 1)}
                          disabled={usersPage === usersPagination.total_pages}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            usersPage === usersPagination.total_pages
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                          }`}
                        >
                          次へ
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {userSearchQuery ? 'ユーザーが見つかりませんでした' : 'ユーザーがありません'}
                </h3>
                <p className="text-gray-600">
                  {userSearchQuery ? '検索条件を変更して再度お試しください' : 'まだユーザーが登録されていません'}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Contacts Table */}
            {contactsLoading ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">読み込み中...</p>
              </div>
            ) : contacts.length > 0 ? (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div 
                    key={contact.id} 
                    className={`bg-white rounded-lg border ${!contact.read ? 'border-blue-300 bg-blue-50' : 'border-gray-200'} p-6`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          {!contact.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                          <span className="font-medium text-gray-900">{contact.name}</span>
                          <span className="text-gray-500 text-sm">{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {getSubjectLabel(contact.subject)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(contact.status)}`}>
                            {getStatusLabel(contact.status)}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {formatDate(contact.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!contact.read && (
                          <button
                            onClick={() => handleMarkAsRead(contact.id)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="既読にする"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        )}
                        <select
                          value={contact.status}
                          onChange={(e) => handleUpdateContactStatus(contact.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">未対応</option>
                          <option value="in_progress">対応中</option>
                          <option value="resolved">解決済み</option>
                        </select>
                        <button
                          onClick={() => handleDeleteContact(contact.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="削除"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-4 text-gray-700 whitespace-pre-wrap">
                      {contact.message}
                    </div>
                  </div>
                ))}
                {contactsPagination && contactsPagination.total_pages > 1 && (
                  <div className="bg-white rounded-lg border border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      全{contactsPagination.total_count}件中 {((contactsPage - 1) * contactsPagination.per_page) + 1}〜{Math.min(contactsPage * contactsPagination.per_page, contactsPagination.total_count)}件を表示
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setContactsPage(contactsPage - 1)}
                        disabled={contactsPage === 1}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          contactsPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        前へ
                      </button>
                      <span className="text-sm text-gray-700">
                        {contactsPage} / {contactsPagination.total_pages}
                      </span>
                      <button
                        onClick={() => setContactsPage(contactsPage + 1)}
                        disabled={contactsPage === contactsPagination.total_pages}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          contactsPage === contactsPagination.total_pages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        次へ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  お問い合わせはありません
                </h3>
                <p className="text-gray-600">
                  新しいお問い合わせが届くとここに表示されます
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
