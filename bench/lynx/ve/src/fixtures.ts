/**
 * Offline fixture data for the job-post sample. Shapes mirror the fields the screen sections
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
  kind: 'compensation' | 'other' | 'support'
  title: string
}

export type JobPost = {
  address: string
  applicantCount: number
  benefits: readonly Benefit[]
  body: string
  calendar: readonly (readonly CalendarDay[])[]
  companyName: string
  id: string
  images: readonly string[]
  isOfficialEvent: boolean
  notices: readonly string[]
  publishedAt: string
  salary: {
    amount: string
    annotations: readonly string[]
    type: string
  }
  tags: readonly string[]
  title: string
  viewCount: number
  watchCount: number
  workDays: readonly DayKey[]
  workPeriod: string
  workTime: string
}

export type Certification = {
  description: string
  label: string
}

export type Author = {
  avatar: string
  badges: readonly string[]
  certifications: readonly Certification[]
  hireCount: number
  nickname: string
  responseRate: string
  reviewCount: number
  temperature: string
}

export type Review = {
  body: string
  id: string
  nickname: string
  tags: readonly string[]
  thumbnail?: string
  time: string
  workedAt: string
}

export type NeighborhoodJob = {
  address: string
  badges: readonly Badge[]
  company: string
  distance: string
  id: string
  pay: string
  thumbnail: string
  title: string
  workDays: string
  workTime: string
}

export type Teacher = {
  id: string
  lessonCount: number
  name: string
  photo: string
  rating: string
  subject: string
  tags: readonly string[]
}

export type CurationTab = {
  id: string
  label: string
}

export type CurationPost = {
  id: string
  meta: string
  pay: string
  title: string
}

export type SimilarPost = {
  badges: readonly Badge[]
  company: string
  id: string
  pay: string
  thumbnail: string
  title: string
  workTime: string
}

export type SubwayStation = {
  lines: readonly { color: string; name: string }[]
  name: string
  walk: string
}

export type LinkedBizAccount = {
  description: string
  followerCount: number
  logo: string
  name: string
}

export const jobPost: JobPost = {
  address: '서울 서초구 서초동 1316-5 1층',
  applicantCount: 12,
  benefits: [
    {
      description: '4대 보험 가입, 주휴수당 지급',
      kind: 'support',
      title: '복리후생',
    },
    {
      description: '식대 1일 8,000원 별도 지급',
      kind: 'compensation',
      title: '식대 지원',
    },
    { description: '근무복 제공, 명절 상여금', kind: 'other', title: '기타' },
  ],
  body: '안녕하세요. 서초역 근처 카페에서 함께 일할 오전 파트 타임 직원을 찾습니다.\n\n주요 업무는 음료 제조, 매장 정리, 간단한 베이킹 보조입니다. 바리스타 경험이 있으면 좋지만 없어도 친절하게 알려드려요.\n\n성실하고 책임감 있는 분이라면 누구든 환영합니다. 장기 근무 가능하신 분을 우대합니다.',
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
  companyName: '서초 브루잉 커피',
  id: 'job-post-1',
  images: [
    'https://assets.example.invalid/job-post/cafe-front.jpg',
    'https://assets.example.invalid/job-post/cafe-inside.jpg',
    'https://assets.example.invalid/job-post/cafe-bar.jpg',
  ],
  isOfficialEvent: false,
  notices: [
    '미성년자 지원 불가 공고예요.',
    '면접 후 당일 채용 여부를 안내드려요.',
  ],
  publishedAt: '3시간 전',
  salary: {
    amount: '11,000원',
    annotations: ['최저시급 이상', '주휴수당 별도'],
    type: '시급',
  },
  tags: ['초보 가능', '주휴수당', '식대 지원', '장기 우대'],
  title: '서초역 카페 오전 파트타임 바리스타 구해요 (주 3일)',
  viewCount: 1324,
  watchCount: 48,
  workDays: ['mon', 'wed', 'fri'],
  workPeriod: '1개월 이상',
  workTime: '08:00 ~ 13:00',
}

export const author: Author = {
  avatar: 'https://assets.example.invalid/profile/owner.jpg',
  badges: ['사업자 인증', '당근 알바 3년차'],
  certifications: [
    { description: '사업자 등록 정보를 확인했어요.', label: '사업자 인증' },
    {
      description: '최근 6개월 내 급여 지급 지연이 없어요.',
      label: '급여 안심',
    },
  ],
  hireCount: 23,
  nickname: '브루잉사장',
  responseRate: '98%',
  reviewCount: 17,
  temperature: '41.2°C',
}

export const reviews: readonly Review[] = [
  {
    body: '사장님이 정말 친절하시고 처음 하는 일도 차근차근 알려주셨어요. 급여도 정확한 날짜에 입금해주셨습니다.',
    id: 'review-1',
    nickname: '민트초코',
    tags: ['친절해요', '급여가 정확해요'],
    thumbnail: 'https://assets.example.invalid/review/review-1.jpg',
    time: '2주 전',
    workedAt: '바리스타 · 3개월 근무',
  },
  {
    body: '분위기가 좋고 손님도 적당해서 일하기 편했어요. 다음에 또 지원하고 싶어요.',
    id: 'review-2',
    nickname: '라떼아트',
    tags: ['분위기가 좋아요'],
    time: '1개월 전',
    workedAt: '홀 서빙 · 1개월 근무',
  },
  {
    body: '시간 약속을 잘 지켜주셔서 다른 일정과 병행하기 좋았습니다.',
    id: 'review-3',
    nickname: '아메리카노',
    tags: ['시간 약속을 지켜요', '친절해요'],
    time: '2개월 전',
    workedAt: '주말 알바 · 2개월 근무',
  },
]

export const neighborhoodJobs: readonly NeighborhoodJob[] = [
  {
    address: '서초동',
    badges: [
      { label: '급구', tone: 'brand' },
      { label: '초보 가능', tone: 'neutral' },
    ],
    company: '교대 분식',
    distance: '도보 6분',
    id: 'nb-1',
    pay: '시급 10,500원',
    thumbnail: 'https://assets.example.invalid/nb/1.jpg',
    title: '교대역 분식집 주말 홀 서빙 구합니다',
    workDays: '토, 일',
    workTime: '11:00 ~ 20:00',
  },
  {
    address: '방배동',
    badges: [{ label: '당일 지급', tone: 'positive' }],
    company: '방배 세탁소',
    distance: '도보 12분',
    id: 'nb-2',
    pay: '일급 90,000원',
    thumbnail: 'https://assets.example.invalid/nb/2.jpg',
    title: '세탁물 분류 및 포장 단기 알바',
    workDays: '월 ~ 금',
    workTime: '09:00 ~ 18:00',
  },
  {
    address: '서초동',
    badges: [
      { label: '사업자 인증', tone: 'informative' },
      { label: '식사 제공', tone: 'neutral' },
    ],
    company: '서초 헬스클럽',
    distance: '도보 9분',
    id: 'nb-3',
    pay: '월급 2,300,000원',
    thumbnail: 'https://assets.example.invalid/nb/3.jpg',
    title: '피트니스 센터 프런트 데스크 상주 직원',
    workDays: '월 ~ 토',
    workTime: '14:00 ~ 22:00',
  },
  {
    address: '잠원동',
    badges: [{ label: '급구', tone: 'brand' }],
    company: '잠원 꽃집',
    distance: '도보 15분',
    id: 'nb-4',
    pay: '시급 12,000원',
    thumbnail: 'https://assets.example.invalid/nb/4.jpg',
    title: '꽃다발 포장 보조 및 배송 준비',
    workDays: '화, 목',
    workTime: '10:00 ~ 16:00',
  },
]

export const teachers: readonly Teacher[] = [
  {
    id: 'teacher-1',
    lessonCount: 128,
    name: '김수진 선생님',
    photo: 'https://assets.example.invalid/teacher/1.jpg',
    rating: '4.9',
    subject: '바리스타 자격증',
    tags: ['자격증 대비', '1:1 수업'],
  },
  {
    id: 'teacher-2',
    lessonCount: 64,
    name: '박도현 선생님',
    photo: 'https://assets.example.invalid/teacher/2.jpg',
    rating: '4.8',
    subject: '라떼아트',
    tags: ['초보 환영'],
  },
  {
    id: 'teacher-3',
    lessonCount: 212,
    name: '이하늘 선생님',
    photo: 'https://assets.example.invalid/teacher/3.jpg',
    rating: '5.0',
    subject: '홈카페 베이킹',
    tags: ['주말 수업', '재료 제공'],
  },
]

export const curationTabs: readonly CurationTab[] = [
  { id: 'cafe', label: '카페' },
  { id: 'serving', label: '서빙' },
  { id: 'short', label: '단기' },
  { id: 'weekend', label: '주말' },
]

export const curationPosts: Readonly<Record<string, readonly CurationPost[]>> =
  {
    cafe: [
      {
        id: 'cu-1',
        meta: '서초동 · 도보 4분',
        pay: '시급 11,500원',
        title: '강남역 디저트 카페 오후 바리스타',
      },
      {
        id: 'cu-2',
        meta: '반포동 · 도보 11분',
        pay: '시급 10,800원',
        title: '반포 한강공원 카페 주말 근무',
      },
      {
        id: 'cu-3',
        meta: '양재동 · 도보 18분',
        pay: '시급 12,000원',
        title: '양재 로스터리 포장 및 홀 관리',
      },
    ],
    serving: [
      {
        id: 'cu-4',
        meta: '서초동 · 도보 7분',
        pay: '시급 11,000원',
        title: '서초 파스타집 저녁 홀 서빙',
      },
      {
        id: 'cu-5',
        meta: '방배동 · 도보 10분',
        pay: '시급 10,500원',
        title: '방배 고깃집 주말 서빙',
      },
    ],
    short: [
      {
        id: 'cu-6',
        meta: '잠원동 · 도보 14분',
        pay: '일급 120,000원',
        title: '행사장 부스 세팅 단기 알바 (2일)',
      },
      {
        id: 'cu-7',
        meta: '서초동 · 도보 3분',
        pay: '일급 80,000원',
        title: '매장 재고 조사 하루 알바',
      },
    ],
    weekend: [
      {
        id: 'cu-8',
        meta: '반포동 · 도보 12분',
        pay: '시급 11,000원',
        title: '백화점 팝업스토어 주말 안내',
      },
      {
        id: 'cu-9',
        meta: '서초동 · 도보 6분',
        pay: '시급 10,500원',
        title: '주말 베이커리 판매 보조',
      },
      {
        id: 'cu-10',
        meta: '방배동 · 도보 9분',
        pay: '시급 12,500원',
        title: '키즈카페 주말 안전 요원',
      },
    ],
  }

export const similarPosts: readonly SimilarPost[] = [
  {
    badges: [{ label: '주휴수당', tone: 'positive' }],
    company: '그린빈 커피',
    id: 'similar-1',
    pay: '시급 11,200원',
    thumbnail: 'https://assets.example.invalid/similar/1.jpg',
    title: '강남 그린빈 커피 오전 오픈 바리스타',
    workTime: '07:30 ~ 12:30',
  },
  {
    badges: [
      { label: '초보 가능', tone: 'neutral' },
      { label: '급구', tone: 'brand' },
    ],
    company: '밀크티하우스',
    id: 'similar-2',
    pay: '시급 10,500원',
    thumbnail: 'https://assets.example.invalid/similar/2.jpg',
    title: '밀크티 전문점 오후 음료 제조',
    workTime: '13:00 ~ 18:00',
  },
  {
    badges: [{ label: '사업자 인증', tone: 'informative' }],
    company: '서초 베이글',
    id: 'similar-3',
    pay: '시급 11,000원',
    thumbnail: 'https://assets.example.invalid/similar/3.jpg',
    title: '베이글 가게 오픈 준비 및 음료',
    workTime: '06:30 ~ 11:30',
  },
]

export const subwayStations: readonly SubwayStation[] = [
  {
    lines: [
      { color: '#00a84d', name: '2' },
      { color: '#ef7c1c', name: '3' },
    ],
    name: '교대역',
    walk: '도보 5분',
  },
  {
    lines: [{ color: '#ef7c1c', name: '3' }],
    name: '남부터미널역',
    walk: '도보 11분',
  },
]

export const linkedBizAccount: LinkedBizAccount = {
  description:
    '서초동에서 8년째 커피를 내리고 있어요. 매장 소식과 신메뉴를 올립니다.',
  followerCount: 1_284,
  logo: 'https://assets.example.invalid/biz/logo.jpg',
  name: '서초 브루잉 커피',
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
