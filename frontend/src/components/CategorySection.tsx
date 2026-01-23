import { useNavigate } from 'react-router-dom'
import { 
  Luggage, 
  Smartphone, 
  Plane, 
  UtensilsCrossed, 
  Bed, 
  Zap
} from 'lucide-react'

interface Category {
  id: string
  name: string
  icon: React.ReactNode
  color: string
}

const categories: Category[] = [
  {
    id: 'preparation',
    name: '準備',
    icon: <Luggage className="w-8 h-8" />,
    color: '#4FC3F7'
  },
  {
    id: 'communication',
    name: '通信',
    icon: <Smartphone className="w-8 h-8" />,
    color: '#4FC3F7'
  },
  {
    id: 'transport',
    name: '移動',
    icon: <Plane className="w-8 h-8" />,
    color: '#4FC3F7'
  },
  {
    id: 'food',
    name: '食',
    icon: <UtensilsCrossed className="w-8 h-8" />,
    color: '#4FC3F7'
  },
  {
    id: 'accommodation',
    name: '宿泊',
    icon: <Bed className="w-8 h-8" />,
    color: '#4FC3F7'
  },
  {
    id: 'tips',
    name: '裏ワザ',
    icon: <Zap className="w-8 h-8" />,
    color: '#4FC3F7'
  }
]

export function CategorySection() {
  const navigate = useNavigate()

  const handleCategoryClick = (categoryId: string) => {
    // カテゴリーページに遷移
    navigate(`/category/${categoryId}`)
  }

  const handleViewAll = () => {
    // 全カテゴリーの投稿一覧ページに遷移（カテゴリーフィルターなし）
    navigate('/posts')
  }

  return (
    <div className="bg-white py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">カテゴリで探す</h2>
          <button
            onClick={handleViewAll}
            className="relative text-blue-600 hover:text-blue-700 font-medium transition-colors group"
          >
          </button>
        </div>

        {/* カテゴリグリッド */}
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group relative bg-[#E0F2F7] rounded-xl p-6 aspect-square flex flex-col items-center justify-center hover:bg-[#B3E5FC] transition-colors duration-200 hover:shadow-md"
            >
              <div 
                className="mb-3 transition-transform duration-200 group-hover:scale-110"
                style={{ color: category.color }}
              >
                {category.icon}
              </div>
              <span className="text-gray-900 font-medium text-sm md:text-base">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

