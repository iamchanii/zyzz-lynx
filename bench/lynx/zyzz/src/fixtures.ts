/**
 * Offline fixture data for the product sample. Shapes mirror the fields the screen sections
 * read, so components stay independent of any network client.
 * @module
 */

export type DayKey = 'fri' | 'mon' | 'sat' | 'sun' | 'thu' | 'tue' | 'wed'

export type BadgeTone = 'brand' | 'informative' | 'neutral' | 'positive'

export type Badge = {
  label: string
  tone: BadgeTone
}

export type CalendarSegment = 'end' | 'middle' | 'none' | 'single' | 'start'

export type CalendarDay = {
  day: number
  holiday: boolean
  past: boolean
  segment: CalendarSegment
  selected: boolean
}

export type Benefit = {
  description: string
  kind: 'other' | 'reward' | 'shipping'
  title: string
}

export type Product = {
  address: string
  benefits: readonly Benefit[]
  body: string
  calendar: readonly (readonly CalendarDay[])[]
  id: string
  images: readonly string[]
  isEvent: boolean
  notices: readonly string[]
  orderCount: number
  pickupDays: readonly DayKey[]
  price: {
    amount: string
    annotations: readonly string[]
    type: string
  }
  publishedAt: string
  shipping: string
  shippingNote: string
  storeName: string
  tags: readonly string[]
  title: string
  viewCount: number
  watchCount: number
}

export type Certification = {
  description: string
  label: string
}

export type Seller = {
  avatar: string
  badges: readonly string[]
  certifications: readonly Certification[]
  nickname: string
  responseRate: string
  reviewCount: number
  saleCount: number
  satisfaction: string
}

export type Review = {
  body: string
  id: string
  nickname: string
  purchasedAt: string
  tags: readonly string[]
  thumbnail?: string
  time: string
}

export type NearbyProduct = {
  address: string
  badges: readonly Badge[]
  distance: string
  hours: string
  id: string
  pickup: string
  price: string
  store: string
  thumbnail: string
  title: string
}

export type Brand = {
  category: string
  id: string
  name: string
  photo: string
  productCount: number
  rating: string
  tags: readonly string[]
}

export type CurationTab = {
  id: string
  label: string
}

export type CurationProduct = {
  id: string
  meta: string
  price: string
  title: string
}

export type SimilarProduct = {
  badges: readonly Badge[]
  delivery: string
  id: string
  price: string
  store: string
  thumbnail: string
  title: string
}

export type SubwayStation = {
  lines: readonly { color: string; name: string }[]
  name: string
  walk: string
}

export type LinkedStore = {
  description: string
  followerCount: number
  logo: string
  name: string
}

export const product: Product = {
  address: '서울 마포구 연남동 123-4 1층',
  benefits: [
    {
      description: '3만원 이상 주문 시 무료 배송, 평일 당일 출고',
      kind: 'shipping',
      title: '배송 혜택',
    },
    {
      description: '구매 금액의 2% 포인트 적립',
      kind: 'reward',
      title: '적립 혜택',
    },
    {
      description: '선물 포장 무료, 손편지 동봉 가능',
      kind: 'other',
      title: '기타',
    },
  ],
  body: '안녕하세요. 연남동에서 직접 로스팅한 원두로 만든 드립백 세트예요.\n\n에티오피아 예가체프 단일 원두를 사용하고, 주문을 받은 뒤 로스팅해 가장 신선한 상태로 보내드려요. 드립백 10개와 간단한 추출 가이드가 함께 들어 있어요.\n\n매장에서 직접 픽업하시면 시음 한 잔을 드려요. 선물 포장이 필요하시면 주문할 때 남겨주세요.',
  calendar: [
    [
      { day: 27, holiday: false, past: true, segment: 'none', selected: false },
      { day: 28, holiday: false, past: true, segment: 'none', selected: false },
      { day: 29, holiday: false, past: true, segment: 'none', selected: false },
      { day: 30, holiday: false, past: true, segment: 'none', selected: false },
      { day: 1, holiday: false, past: true, segment: 'none', selected: false },
      { day: 2, holiday: false, past: true, segment: 'none', selected: false },
      { day: 3, holiday: true, past: true, segment: 'none', selected: false },
    ],
    [
      { day: 4, holiday: false, past: true, segment: 'none', selected: false },
      { day: 5, holiday: false, past: true, segment: 'start', selected: true },
      {
        day: 6,
        holiday: false,
        past: false,
        segment: 'middle',
        selected: true,
      },
      { day: 7, holiday: false, past: false, segment: 'end', selected: true },
      { day: 8, holiday: false, past: false, segment: 'none', selected: false },
      { day: 9, holiday: true, past: false, segment: 'single', selected: true },
      {
        day: 10,
        holiday: false,
        past: false,
        segment: 'none',
        selected: false,
      },
    ],
    [
      {
        day: 11,
        holiday: false,
        past: false,
        segment: 'none',
        selected: false,
      },
      {
        day: 12,
        holiday: false,
        past: false,
        segment: 'start',
        selected: true,
      },
      {
        day: 13,
        holiday: false,
        past: false,
        segment: 'middle',
        selected: true,
      },
      { day: 14, holiday: false, past: false, segment: 'end', selected: true },
      {
        day: 15,
        holiday: false,
        past: false,
        segment: 'none',
        selected: false,
      },
      {
        day: 16,
        holiday: false,
        past: false,
        segment: 'none',
        selected: false,
      },
      {
        day: 17,
        holiday: false,
        past: false,
        segment: 'none',
        selected: false,
      },
    ],
  ],
  id: 'product-1',
  images: [
    'https://assets.example.invalid/product/beans-front.jpg',
    'https://assets.example.invalid/product/beans-inside.jpg',
    'https://assets.example.invalid/product/beans-brew.jpg',
  ],
  isEvent: false,
  notices: [
    '단순 변심 교환은 수령 후 7일 이내에 가능해요.',
    '로스팅한 지 2주 이내의 원두만 보내드려요.',
  ],
  orderCount: 12,
  pickupDays: ['mon', 'wed', 'fri'],
  price: {
    amount: '29,000원',
    annotations: ['무료 배송', '쿠폰 적용 가능'],
    type: '판매가',
  },
  publishedAt: '3시간 전',
  shipping: '주문 후 2~3일 배송',
  shippingNote: '평일 15시 이전 주문은 당일 출고',
  storeName: '연남 브루잉 커피',
  tags: ['무료 배송', '당일 출고', '선물 포장', '매장 픽업'],
  title: '싱글 오리진 드립백 원두 세트 (10개입)',
  viewCount: 1324,
  watchCount: 48,
}

export const seller: Seller = {
  avatar: 'https://assets.example.invalid/profile/owner.jpg',
  badges: ['사업자 인증', '스토어 3년차'],
  certifications: [
    { description: '사업자 등록 정보를 확인했어요.', label: '사업자 인증' },
    {
      description: '결제 금액을 배송 완료까지 보호해요.',
      label: '안전 결제',
    },
  ],
  nickname: '브루잉마스터',
  responseRate: '98%',
  reviewCount: 17,
  saleCount: 23,
  satisfaction: '98%',
}

export const reviews: readonly Review[] = [
  {
    body: '판매자분이 정말 친절하시고 추출 방법도 차근차근 알려주셨어요. 배송도 약속한 날짜에 정확히 도착했습니다.',
    id: 'review-1',
    nickname: '민트초코',
    purchasedAt: '드립백 세트 · 3회 구매',
    tags: ['친절해요', '설명과 같아요'],
    thumbnail: 'https://assets.example.invalid/review/review-1.jpg',
    time: '2주 전',
  },
  {
    body: '향이 좋고 산미가 적당해서 매일 아침 마시기 편했어요. 다음에 또 주문하고 싶어요.',
    id: 'review-2',
    nickname: '라떼아트',
    purchasedAt: '원두 200g · 1회 구매',
    tags: ['향이 좋아요'],
    time: '1개월 전',
  },
  {
    body: '주문 다음 날 바로 받아서 다른 선물과 함께 챙기기 좋았습니다.',
    id: 'review-3',
    nickname: '아메리카노',
    purchasedAt: '선물 세트 · 2회 구매',
    tags: ['배송이 빨라요', '친절해요'],
    time: '2개월 전',
  },
]

export const nearbyProducts: readonly NearbyProduct[] = [
  {
    address: '연남동',
    badges: [
      { label: '한정 수량', tone: 'brand' },
      { label: '신상품', tone: 'neutral' },
    ],
    distance: '도보 6분',
    hours: '11:00 ~ 20:00',
    id: 'nb-1',
    pickup: '매장 픽업',
    price: '12,000원',
    store: '연남 로스터스',
    thumbnail: 'https://assets.example.invalid/nb/1.jpg',
    title: '콜드브루 원액 500ml 2병 묶음',
  },
  {
    address: '망원동',
    badges: [{ label: '당일 발송', tone: 'positive' }],
    distance: '도보 12분',
    hours: '09:00 ~ 18:00',
    id: 'nb-2',
    pickup: '택배 배송',
    price: '18,000원',
    store: '망원 티하우스',
    thumbnail: 'https://assets.example.invalid/nb/2.jpg',
    title: '유기농 홍차 티백 40개입 선물 상자',
  },
  {
    address: '연남동',
    badges: [
      { label: '사업자 인증', tone: 'informative' },
      { label: '무료 배송', tone: 'neutral' },
    ],
    distance: '도보 9분',
    hours: '14:00 ~ 22:00',
    id: 'nb-3',
    pickup: '매장 픽업',
    price: '9,500원',
    store: '연남 베이커리',
    thumbnail: 'https://assets.example.invalid/nb/3.jpg',
    title: '통밀 사워도우 식빵 1kg',
  },
  {
    address: '합정동',
    badges: [{ label: '마감 임박', tone: 'brand' }],
    distance: '도보 15분',
    hours: '10:00 ~ 16:00',
    id: 'nb-4',
    pickup: '매장 픽업',
    price: '25,000원',
    store: '합정 꽃집',
    thumbnail: 'https://assets.example.invalid/nb/4.jpg',
    title: '드라이플라워 미니 꽃다발',
  },
]

export const brands: readonly Brand[] = [
  {
    category: '드립 도구',
    id: 'brand-1',
    name: '브루잉랩',
    photo: 'https://assets.example.invalid/brand/1.jpg',
    productCount: 128,
    rating: '4.9',
    tags: ['신상품', '무료 배송'],
  },
  {
    category: '라떼 용품',
    id: 'brand-2',
    name: '밀크폼',
    photo: 'https://assets.example.invalid/brand/2.jpg',
    productCount: 64,
    rating: '4.8',
    tags: ['베스트'],
  },
  {
    category: '홈카페 베이킹',
    id: 'brand-3',
    name: '홈베이킹컴퍼니',
    photo: 'https://assets.example.invalid/brand/3.jpg',
    productCount: 212,
    rating: '5.0',
    tags: ['선물 포장', '당일 발송'],
  },
]

export const curationTabs: readonly CurationTab[] = [
  { id: 'beans', label: '원두' },
  { id: 'dripper', label: '드립 용품' },
  { id: 'mug', label: '머그' },
  { id: 'gift', label: '선물 세트' },
]

export const curationProducts: Readonly<
  Record<string, readonly CurationProduct[]>
> = {
  beans: [
    {
      id: 'cu-1',
      meta: '연남동 · 도보 4분',
      price: '11,500원',
      title: '브라질 세하도 원두 200g',
    },
    {
      id: 'cu-2',
      meta: '망원동 · 도보 11분',
      price: '10,800원',
      title: '콜롬비아 수프리모 원두 200g',
    },
    {
      id: 'cu-3',
      meta: '서교동 · 도보 18분',
      price: '12,000원',
      title: '디카페인 블렌드 원두 250g',
    },
  ],
  dripper: [
    {
      id: 'cu-4',
      meta: '연남동 · 도보 7분',
      price: '11,000원',
      title: '세라믹 드리퍼 1~2인용',
    },
    {
      id: 'cu-5',
      meta: '망원동 · 도보 10분',
      price: '10,500원',
      title: '드립 서버 400ml',
    },
  ],
  mug: [
    {
      id: 'cu-6',
      meta: '합정동 · 도보 14분',
      price: '15,000원',
      title: '수제 도자기 머그 300ml',
    },
    {
      id: 'cu-7',
      meta: '연남동 · 도보 3분',
      price: '8,000원',
      title: '이중 유리 머그 2개 세트',
    },
  ],
  gift: [
    {
      id: 'cu-8',
      meta: '망원동 · 도보 12분',
      price: '32,000원',
      title: '원두 2종 선물 세트',
    },
    {
      id: 'cu-9',
      meta: '연남동 · 도보 6분',
      price: '27,000원',
      title: '드립백 20개입 선물 상자',
    },
    {
      id: 'cu-10',
      meta: '합정동 · 도보 9분',
      price: '45,000원',
      title: '홈카페 입문 세트 (드리퍼, 원두, 머그)',
    },
  ],
}

export const similarProducts: readonly SimilarProduct[] = [
  {
    badges: [{ label: '무료 배송', tone: 'positive' }],
    delivery: '당일 발송',
    id: 'similar-1',
    price: '13,200원',
    store: '그린빈 커피',
    thumbnail: 'https://assets.example.invalid/similar/1.jpg',
    title: '그린빈 커피 디카페인 원두 200g',
  },
  {
    badges: [
      { label: '신상품', tone: 'neutral' },
      { label: '한정 수량', tone: 'brand' },
    ],
    delivery: '2~3일 배송',
    id: 'similar-2',
    price: '10,500원',
    store: '밀크티하우스',
    thumbnail: 'https://assets.example.invalid/similar/2.jpg',
    title: '밀크티 베이스 원액 1L',
  },
  {
    badges: [{ label: '사업자 인증', tone: 'informative' }],
    delivery: '매장 픽업',
    id: 'similar-3',
    price: '11,000원',
    store: '연남 베이글',
    thumbnail: 'https://assets.example.invalid/similar/3.jpg',
    title: '플레인 베이글 6개입 세트',
  },
]

export const subwayStations: readonly SubwayStation[] = [
  {
    lines: [
      { color: '#00a84d', name: '2' },
      { color: '#cd7c2f', name: '6' },
    ],
    name: '합정역',
    walk: '도보 5분',
  },
  {
    lines: [{ color: '#00a84d', name: '2' }],
    name: '홍대입구역',
    walk: '도보 11분',
  },
]

export const linkedStore: LinkedStore = {
  description:
    '연남동에서 8년째 커피를 볶고 있어요. 매장 소식과 신상품을 올립니다.',
  followerCount: 1_284,
  logo: 'https://assets.example.invalid/store/logo.jpg',
  name: '연남 브루잉 커피',
}

export const dayLabels: Readonly<Record<DayKey, string>> = {
  fri: '금',
  mon: '월',
  sat: '토',
  sun: '일',
  thu: '목',
  tue: '화',
  wed: '수',
}

export const weekOrder: readonly DayKey[] = [
  'sun',
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
]
