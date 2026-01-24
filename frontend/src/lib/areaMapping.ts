// エリアの英語slug ⇔ 日本語名のマッピング

export interface AreaInfo {
  slug: string;
  nameJa: string;
  dbName: string; // DBに保存されている名前
  imageUrl: string;
}

export const AREAS: AreaInfo[] = [
  {
    slug: 'asia',
    nameJa: 'アジア',
    dbName: 'アジア',
    imageUrl: 'https://images.unsplash.com/photo-1535139262971-c51845709a48?auto=format&fit=crop&w=600&q=80'
  },
  {
    slug: 'europe',
    nameJa: 'ヨーロッパ',
    dbName: 'ヨーロッパ',
    imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=80'
  },
  {
    slug: 'africa',
    nameJa: 'アフリカ',
    dbName: 'アフリカ',
    imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=600&q=80'
  },
  {
    slug: 'north-america',
    nameJa: '北アメリカ',
    dbName: '北アメリカ',
    imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80'
  },
  {
    slug: 'south-america',
    nameJa: '南アメリカ',
    dbName: '南アメリカ',
    imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=600&q=80'
  },
  {
    slug: 'oceania',
    nameJa: 'オセアニア',
    dbName: 'オセアニア',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80'
  },
];

// slug → DBの名前
export const getAreaDbNameBySlug = (slug: string): string | undefined => {
  const area = AREAS.find(a => a.slug === slug);
  return area?.dbName;
};

// DBの名前 → slug
export const getAreaSlugByDbName = (dbName: string): string | undefined => {
  const area = AREAS.find(a => a.dbName === dbName);
  return area?.slug;
};

// slug → 日本語名
export const getAreaNameJaBySlug = (slug: string): string | undefined => {
  const area = AREAS.find(a => a.slug === slug);
  return area?.nameJa;
};

// 日本語名 → slug
export const getAreaSlugByNameJa = (nameJa: string): string | undefined => {
  const area = AREAS.find(a => a.nameJa === nameJa);
  return area?.slug;
};

