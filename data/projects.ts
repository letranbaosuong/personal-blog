/**
 * Projects Data
 * Portfolio projects with multilingual support
 */

export interface Project {
  id: string;
  slug: string;
  image: string;
  technologies: string[];
  github?: string;
  demo?: string;
  status: 'completed' | 'in-progress';
  featured?: boolean;
}

export interface ProjectContent {
  title: string;
  description: string;
  features: string[];
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'personal-blog',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    technologies: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'next-intl'],
    github: 'https://github.com/yourusername/personal-blog',
    demo: 'https://yourblog.com',
    status: 'completed',
    featured: true,
  },
  {
    id: '2',
    slug: 'task-management-app',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    github: 'https://github.com/yourusername/task-app',
    demo: 'https://task-app.com',
    status: 'completed',
    featured: true,
  },
  {
    id: '3',
    slug: 'ecommerce-platform',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
    technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Prisma'],
    github: 'https://github.com/yourusername/ecommerce',
    status: 'in-progress',
  },
  {
    id: '4',
    slug: 'fitness-tracker',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    technologies: ['React Native', 'Firebase', 'Redux'],
    github: 'https://github.com/yourusername/fitness-tracker',
    status: 'completed',
  },
  {
    id: '5',
    slug: 'weather-dashboard',
    image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80',
    technologies: ['Vue.js', 'OpenWeather API', 'Chart.js'],
    github: 'https://github.com/yourusername/weather-dashboard',
    demo: 'https://weather.com',
    status: 'completed',
  },
  {
    id: '6',
    slug: 'recipe-sharing-platform',
    image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80',
    technologies: ['Next.js', 'Supabase', 'TypeScript'],
    github: 'https://github.com/yourusername/recipe-platform',
    status: 'in-progress',
  },
];

export const projectsContent: Record<string, Record<string, ProjectContent>> = {
  en: {
    'personal-blog': {
      title: 'Personal Blog & Portfolio',
      description: 'A modern, fully internationalized blog and portfolio website built with Next.js 15 and TypeScript. Features dark mode, multilingual support, and responsive design.',
      features: [
        'Multilingual support (6 languages)',
        'Dark/Light theme with smooth transitions',
        'Fully responsive design',
        'SEO optimized',
        'Fast performance with Next.js 15',
      ],
    },
    'task-management-app': {
      title: 'Task Management Application',
      description: 'A full-stack task management application with user authentication, real-time updates, and team collaboration features.',
      features: [
        'User authentication and authorization',
        'Real-time task updates',
        'Team collaboration',
        'Drag-and-drop interface',
        'Email notifications',
      ],
    },
    'ecommerce-platform': {
      title: 'E-commerce Platform',
      description: 'A complete e-commerce solution with payment integration, inventory management, and admin dashboard.',
      features: [
        'Stripe payment integration',
        'Product management',
        'Shopping cart',
        'Order tracking',
        'Admin dashboard',
      ],
    },
    'fitness-tracker': {
      title: 'Fitness Tracking Mobile App',
      description: 'A mobile application for tracking workouts, nutrition, and progress with social features.',
      features: [
        'Workout logging',
        'Nutrition tracking',
        'Progress charts',
        'Social sharing',
        'Custom workout plans',
      ],
    },
    'weather-dashboard': {
      title: 'Weather Dashboard',
      description: 'An interactive weather dashboard with forecasts, charts, and location-based weather information.',
      features: [
        'Real-time weather data',
        '7-day forecast',
        'Interactive charts',
        'Multiple locations',
        'Weather alerts',
      ],
    },
    'recipe-sharing-platform': {
      title: 'Recipe Sharing Platform',
      description: 'A social platform for sharing and discovering recipes with ratings, comments, and meal planning features.',
      features: [
        'Recipe creation and sharing',
        'User ratings and reviews',
        'Meal planning',
        'Shopping list generation',
        'Dietary filters',
      ],
    },
  },
  vi: {
    'personal-blog': {
      title: 'Blog & Portfolio Cá nhân',
      description: 'Website blog và portfolio hiện đại, hỗ trợ đa ngôn ngữ được xây dựng với Next.js 15 và TypeScript. Có chế độ tối, hỗ trợ đa ngôn ngữ và thiết kế responsive.',
      features: [
        'Hỗ trợ đa ngôn ngữ (6 ngôn ngữ)',
        'Chế độ Tối/Sáng với chuyển đổi mượt mà',
        'Thiết kế responsive hoàn toàn',
        'Tối ưu SEO',
        'Hiệu suất nhanh với Next.js 15',
      ],
    },
    'task-management-app': {
      title: 'Ứng dụng Quản lý Công việc',
      description: 'Ứng dụng quản lý công việc full-stack với xác thực người dùng, cập nhật real-time và tính năng cộng tác nhóm.',
      features: [
        'Xác thực và phân quyền người dùng',
        'Cập nhật công việc real-time',
        'Cộng tác nhóm',
        'Giao diện kéo thả',
        'Thông báo email',
      ],
    },
    'ecommerce-platform': {
      title: 'Nền tảng Thương mại Điện tử',
      description: 'Giải pháp thương mại điện tử hoàn chỉnh với tích hợp thanh toán, quản lý kho và dashboard quản trị.',
      features: [
        'Tích hợp thanh toán Stripe',
        'Quản lý sản phẩm',
        'Giỏ hàng',
        'Theo dõi đơn hàng',
        'Dashboard quản trị',
      ],
    },
    'fitness-tracker': {
      title: 'Ứng dụng Di động Theo dõi Thể hình',
      description: 'Ứng dụng di động để theo dõi tập luyện, dinh dưỡng và tiến độ với tính năng mạng xã hội.',
      features: [
        'Ghi lại tập luyện',
        'Theo dõi dinh dưỡng',
        'Biểu đồ tiến độ',
        'Chia sẻ mạng xã hội',
        'Kế hoạch tập luyện tùy chỉnh',
      ],
    },
    'weather-dashboard': {
      title: 'Dashboard Thời tiết',
      description: 'Dashboard thời tiết tương tác với dự báo, biểu đồ và thông tin thời tiết theo vị trí.',
      features: [
        'Dữ liệu thời tiết real-time',
        'Dự báo 7 ngày',
        'Biểu đồ tương tác',
        'Nhiều vị trí',
        'Cảnh báo thời tiết',
      ],
    },
    'recipe-sharing-platform': {
      title: 'Nền tảng Chia sẻ Công thức',
      description: 'Nền tảng mạng xã hội để chia sẻ và khám phá công thức với đánh giá, bình luận và tính năng lập kế hoạch bữa ăn.',
      features: [
        'Tạo và chia sẻ công thức',
        'Đánh giá và nhận xét của người dùng',
        'Lập kế hoạch bữa ăn',
        'Tạo danh sách mua sắm',
        'Bộ lọc chế độ ăn',
      ],
    },
  },
  ja: {
    'personal-blog': {
      title: '個人ブログ＆ポートフォリオ',
      description: 'Next.js 15とTypeScriptで構築された、完全に国際化されたモダンなブログとポートフォリオWebサイト。ダークモード、多言語サポート、レスポンシブデザインを特徴としています。',
      features: [
        '多言語サポート（6言語）',
        'スムーズな遷移を持つダーク/ライトテーマ',
        '完全レスポンシブデザイン',
        'SEO最適化',
        'Next.js 15による高速パフォーマンス',
      ],
    },
    'task-management-app': {
      title: 'タスク管理アプリケーション',
      description: 'ユーザー認証、リアルタイム更新、チームコラボレーション機能を備えたフルスタックタスク管理アプリケーション。',
      features: [
        'ユーザー認証と承認',
        'リアルタイムタスク更新',
        'チームコラボレーション',
        'ドラッグアンドドロップインターフェース',
        'メール通知',
      ],
    },
    'ecommerce-platform': {
      title: 'eコマースプラットフォーム',
      description: '決済統合、在庫管理、管理ダッシュボードを備えた完全なeコマースソリューション。',
      features: [
        'Stripe決済統合',
        '商品管理',
        'ショッピングカート',
        '注文追跡',
        '管理ダッシュボード',
      ],
    },
    'fitness-tracker': {
      title: 'フィットネストラッキングモバイルアプリ',
      description: 'ソーシャル機能を備えた、ワークアウト、栄養、進捗を追跡するモバイルアプリケーション。',
      features: [
        'ワークアウトロギング',
        '栄養追跡',
        '進捗チャート',
        'ソーシャル共有',
        'カスタムワークアウトプラン',
      ],
    },
    'weather-dashboard': {
      title: '天気ダッシュボード',
      description: '予報、チャート、位置情報ベースの天気情報を備えたインタラクティブな天気ダッシュボード。',
      features: [
        'リアルタイム天気データ',
        '7日間予報',
        'インタラクティブチャート',
        '複数の場所',
        '天気アラート',
      ],
    },
    'recipe-sharing-platform': {
      title: 'レシピ共有プラットフォーム',
      description: '評価、コメント、食事計画機能を備えた、レシピを共有および発見するためのソーシャルプラットフォーム。',
      features: [
        'レシピの作成と共有',
        'ユーザー評価とレビュー',
        '食事計画',
        'ショッピングリスト生成',
        '食事制限フィルター',
      ],
    },
  },
  zh: {
    'personal-blog': {
      title: '个人博客和作品集',
      description: '使用Next.js 15和TypeScript构建的现代化、完全国际化的博客和作品集网站。具有深色模式、多语言支持和响应式设计。',
      features: [
        '多语言支持（6种语言）',
        '具有平滑过渡的深色/浅色主题',
        '完全响应式设计',
        'SEO优化',
        'Next.js 15的快速性能',
      ],
    },
    'task-management-app': {
      title: '任务管理应用程序',
      description: '具有用户身份验证、实时更新和团队协作功能的全栈任务管理应用程序。',
      features: [
        '用户身份验证和授权',
        '实时任务更新',
        '团队协作',
        '拖放界面',
        '电子邮件通知',
      ],
    },
    'ecommerce-platform': {
      title: '电子商务平台',
      description: '具有支付集成、库存管理和管理仪表板的完整电子商务解决方案。',
      features: [
        'Stripe支付集成',
        '产品管理',
        '购物车',
        '订单跟踪',
        '管理仪表板',
      ],
    },
    'fitness-tracker': {
      title: '健身追踪移动应用',
      description: '具有社交功能的用于追踪锻炼、营养和进度的移动应用程序。',
      features: [
        '锻炼记录',
        '营养追踪',
        '进度图表',
        '社交分享',
        '自定义锻炼计划',
      ],
    },
    'weather-dashboard': {
      title: '天气仪表板',
      description: '具有预报、图表和基于位置的天气信息的交互式天气仪表板。',
      features: [
        '实时天气数据',
        '7天预报',
        '交互式图表',
        '多个位置',
        '天气警报',
      ],
    },
    'recipe-sharing-platform': {
      title: '食谱分享平台',
      description: '用于分享和发现食谱的社交平台，具有评分、评论和膳食计划功能。',
      features: [
        '食谱创建和分享',
        '用户评分和评论',
        '膳食计划',
        '购物清单生成',
        '饮食过滤器',
      ],
    },
  },
  ko: {
    'personal-blog': {
      title: '개인 블로그 및 포트폴리오',
      description: 'Next.js 15와 TypeScript로 구축된 현대적이고 완전히 국제화된 블로그 및 포트폴리오 웹사이트. 다크 모드, 다국어 지원 및 반응형 디자인을 특징으로 합니다.',
      features: [
        '다국어 지원 (6개 언어)',
        '부드러운 전환의 다크/라이트 테마',
        '완전 반응형 디자인',
        'SEO 최적화',
        'Next.js 15로 빠른 성능',
      ],
    },
    'task-management-app': {
      title: '작업 관리 애플리케이션',
      description: '사용자 인증, 실시간 업데이트 및 팀 협업 기능을 갖춘 풀스택 작업 관리 애플리케이션.',
      features: [
        '사용자 인증 및 권한 부여',
        '실시간 작업 업데이트',
        '팀 협업',
        '드래그 앤 드롭 인터페이스',
        '이메일 알림',
      ],
    },
    'ecommerce-platform': {
      title: '전자상거래 플랫폼',
      description: '결제 통합, 재고 관리 및 관리 대시보드를 갖춘 완전한 전자상거래 솔루션.',
      features: [
        'Stripe 결제 통합',
        '제품 관리',
        '장바구니',
        '주문 추적',
        '관리 대시보드',
      ],
    },
    'fitness-tracker': {
      title: '피트니스 추적 모바일 앱',
      description: '소셜 기능을 갖춘 운동, 영양 및 진행 상황 추적을 위한 모바일 애플리케이션.',
      features: [
        '운동 기록',
        '영양 추적',
        '진행 차트',
        '소셜 공유',
        '맞춤 운동 계획',
      ],
    },
    'weather-dashboard': {
      title: '날씨 대시보드',
      description: '예보, 차트 및 위치 기반 날씨 정보가 있는 대화형 날씨 대시보드.',
      features: [
        '실시간 날씨 데이터',
        '7일 예보',
        '대화형 차트',
        '여러 위치',
        '날씨 경보',
      ],
    },
    'recipe-sharing-platform': {
      title: '레시피 공유 플랫폼',
      description: '평점, 댓글 및 식사 계획 기능이 있는 레시피 공유 및 발견을 위한 소셜 플랫폼.',
      features: [
        '레시피 생성 및 공유',
        '사용자 평점 및 리뷰',
        '식사 계획',
        '쇼핑 목록 생성',
        '식이 제한 필터',
      ],
    },
  },
  th: {
    'personal-blog': {
      title: 'บล็อกและพอร์ตโฟลิโอส่วนตัว',
      description: 'เว็บไซต์บล็อกและพอร์ตโฟลิโอที่ทันสมัยและรองรับหลายภาษาอย่างสมบูรณ์ที่สร้างด้วย Next.js 15 และ TypeScript มีโหมดมืด การรองรับหลายภาษา และการออกแบบที่ตอบสนอง',
      features: [
        'รองรับหลายภาษา (6 ภาษา)',
        'ธีมมืด/สว่างพร้อมการเปลี่ยนที่ราบรื่น',
        'การออกแบบที่ตอบสนองอย่างสมบูรณ์',
        'เพิ่มประสิทธิภาพ SEO',
        'ประสิทธิภาพสูงด้วย Next.js 15',
      ],
    },
    'task-management-app': {
      title: 'แอปพลิเคชันการจัดการงาน',
      description: 'แอปพลิเคชันการจัดการงานแบบฟูลสแตกพร้อมการตรวจสอบสิทธิ์ผู้ใช้ การอัปเดตแบบเรียลไทม์ และฟีเจอร์การทำงานร่วมกันของทีม',
      features: [
        'การตรวจสอบสิทธิ์และการอนุญาตผู้ใช้',
        'การอัปเดตงานแบบเรียลไทม์',
        'การทำงานร่วมกันของทีม',
        'อินเทอร์เฟซลากและวาง',
        'การแจ้งเตือนทางอีเมล',
      ],
    },
    'ecommerce-platform': {
      title: 'แพลตฟอร์มอีคอมเมิร์ซ',
      description: 'โซลูชันอีคอมเมิร์ซที่สมบูรณ์พร้อมการผสานรวมการชำระเงิน การจัดการสินค้าคงคลัง และแดชบอร์ดผู้ดูแลระบบ',
      features: [
        'การผสานรวมการชำระเงิน Stripe',
        'การจัดการผลิตภัณฑ์',
        'ตะกร้าสินค้า',
        'การติดตามคำสั่งซื้อ',
        'แดชบอร์ดผู้ดูแลระบบ',
      ],
    },
    'fitness-tracker': {
      title: 'แอปมือถือติดตามฟิตเนส',
      description: 'แอปพลิเคชันมือถือสำหรับติดตามการออกกำลังกาย โภชนาการ และความคืบหน้าพร้อมฟีเจอร์โซเชียล',
      features: [
        'บันทึกการออกกำลังกาย',
        'ติดตามโภชนาการ',
        'แผนภูมิความคืบหน้า',
        'การแชร์ทางโซเชียล',
        'แผนออกกำลังกายที่กำหนดเอง',
      ],
    },
    'weather-dashboard': {
      title: 'แดชบอร์ดสภาพอากาศ',
      description: 'แดชบอร์ดสภาพอากาศแบบโต้ตอบพร้อมการพยากรณ์ แผนภูมิ และข้อมูลสภาพอากาศตามตำแหน่ง',
      features: [
        'ข้อมูลสภาพอากาศแบบเรียลไทม์',
        'การพยากรณ์ 7 วัน',
        'แผนภูมิแบบโต้ตอบ',
        'หลายสถานที่',
        'การแจ้งเตือนสภาพอากาศ',
      ],
    },
    'recipe-sharing-platform': {
      title: 'แพลตฟอร์มแบ่งปันสูตรอาหาร',
      description: 'แพลตฟอร์มโซเชียลสำหรับแบ่งปันและค้นหาสูตรอาหารพร้อมการให้คะแนน ความคิดเห็น และฟีเจอร์การวางแผนมื้ออาหาร',
      features: [
        'การสร้างและแบ่งปันสูตรอาหาร',
        'การให้คะแนนและรีวิวของผู้ใช้',
        'การวางแผนมื้ออาหาร',
        'การสร้างรายการช็อปปิ้ง',
        'ตัวกรองอาหาร',
      ],
    },
  },
};
