/**
 * Blog Posts Data
 * Sample blog posts with multilingual support
 */

export interface BlogPost {
  id: string;
  slug: string;
  category: 'technology' | 'health' | 'guitar' | 'calisthenics';
  image: string;
  date: string;
  readingTime: number;
  featured?: boolean;
}

// Multilingual content
export interface BlogPostContent {
  title: string;
  excerpt: string;
  content?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'nextjs-15-new-features',
    category: 'technology',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    date: '2024-11-01',
    readingTime: 8,
    featured: true,
  },
  {
    id: '2',
    slug: 'react-server-components',
    category: 'technology',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    date: '2024-10-28',
    readingTime: 10,
    featured: true,
  },
  {
    id: '3',
    slug: 'healthy-developer-lifestyle',
    category: 'health',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    date: '2024-10-25',
    readingTime: 6,
  },
  {
    id: '4',
    slug: 'beginner-guitar-tips',
    category: 'guitar',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80',
    date: '2024-10-20',
    readingTime: 7,
  },
  {
    id: '5',
    slug: 'calisthenics-progression',
    category: 'calisthenics',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    date: '2024-10-15',
    readingTime: 9,
  },
  {
    id: '6',
    slug: 'typescript-best-practices',
    category: 'technology',
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80',
    date: '2024-10-10',
    readingTime: 12,
  },
];

// Blog post content by locale
export const blogPostsContent: Record<string, Record<string, BlogPostContent>> = {
  en: {
    'nextjs-15-new-features': {
      title: 'Next.js 15: What\'s New and Why You Should Care',
      excerpt: 'Exploring the latest features in Next.js 15, including improved performance, enhanced developer experience, and new capabilities that will change how we build web applications.',
      content: 'Full content here...',
    },
    'react-server-components': {
      title: 'Understanding React Server Components',
      excerpt: 'A deep dive into React Server Components - what they are, how they work, and when to use them in your Next.js applications.',
      content: 'Full content here...',
    },
    'healthy-developer-lifestyle': {
      title: 'Maintaining a Healthy Lifestyle as a Developer',
      excerpt: 'Tips and strategies for staying healthy while working long hours at a desk. Learn about nutrition, exercise, and mental wellness.',
      content: 'Full content here...',
    },
    'beginner-guitar-tips': {
      title: '10 Essential Tips for Beginner Guitarists',
      excerpt: 'Starting your guitar journey? Here are the fundamental tips that will help you progress faster and avoid common pitfalls.',
      content: 'Full content here...',
    },
    'calisthenics-progression': {
      title: 'Calisthenics Progression: From Beginner to Advanced',
      excerpt: 'A comprehensive guide to progressing in calisthenics, from basic exercises to advanced movements like muscle-ups and planches.',
      content: 'Full content here...',
    },
    'typescript-best-practices': {
      title: 'TypeScript Best Practices for Large-Scale Applications',
      excerpt: 'Learn the best practices for using TypeScript in production applications, including type safety, performance optimization, and maintainability.',
      content: 'Full content here...',
    },
  },
  vi: {
    'nextjs-15-new-features': {
      title: 'Next.js 15: Có gì mới và tại sao bạn nên quan tâm',
      excerpt: 'Khám phá các tính năng mới nhất trong Next.js 15, bao gồm cải thiện hiệu suất, nâng cao trải nghiệm phát triển và khả năng mới sẽ thay đổi cách chúng ta xây dựng ứng dụng web.',
      content: 'Nội dung đầy đủ ở đây...',
    },
    'react-server-components': {
      title: 'Hiểu về React Server Components',
      excerpt: 'Tìm hiểu sâu về React Server Components - chúng là gì, hoạt động như thế nào và khi nào nên sử dụng trong ứng dụng Next.js.',
      content: 'Nội dung đầy đủ ở đây...',
    },
    'healthy-developer-lifestyle': {
      title: 'Duy trì lối sống lành mạnh cho Lập trình viên',
      excerpt: 'Mẹo và chiến lược để giữ sức khỏe khi làm việc nhiều giờ trước màn hình. Tìm hiểu về dinh dưỡng, tập luyện và sức khỏe tinh thần.',
      content: 'Nội dung đầy đủ ở đây...',
    },
    'beginner-guitar-tips': {
      title: '10 Mẹo thiết yếu cho người mới chơi Guitar',
      excerpt: 'Bắt đầu hành trình guitar của bạn? Đây là những mẹo cơ bản giúp bạn tiến bộ nhanh hơn và tránh những sai lầm phổ biến.',
      content: 'Nội dung đầy đủ ở đây...',
    },
    'calisthenics-progression': {
      title: 'Tiến trình Calisthenics: Từ người mới đến nâng cao',
      excerpt: 'Hướng dẫn toàn diện về tiến trình calisthenics, từ bài tập cơ bản đến động tác nâng cao như muscle-up và planche.',
      content: 'Nội dung đầy đủ ở đây...',
    },
    'typescript-best-practices': {
      title: 'Best Practices TypeScript cho Ứng dụng quy mô lớn',
      excerpt: 'Học các best practices để sử dụng TypeScript trong ứng dụng production, bao gồm type safety, tối ưu hiệu suất và khả năng bảo trì.',
      content: 'Nội dung đầy đủ ở đây...',
    },
  },
  ja: {
    'nextjs-15-new-features': {
      title: 'Next.js 15：新機能と注目すべき理由',
      excerpt: 'Next.js 15の最新機能を探る。パフォーマンスの向上、開発者体験の強化、Webアプリケーションの構築方法を変える新機能を含みます。',
    },
    'react-server-components': {
      title: 'React Server Componentsの理解',
      excerpt: 'React Server Componentsの詳細 - それが何で、どのように機能し、Next.jsアプリケーションでいつ使用するか。',
    },
    'healthy-developer-lifestyle': {
      title: '開発者として健康的なライフスタイルを維持する',
      excerpt: '長時間デスクで作業しながら健康を保つためのヒントと戦略。栄養、運動、メンタルウェルネスについて学ぶ。',
    },
    'beginner-guitar-tips': {
      title: '初心者ギタリストのための10の必須ヒント',
      excerpt: 'ギターの旅を始めますか？より速く進歩し、一般的な落とし穴を避けるのに役立つ基本的なヒントがここにあります。',
    },
    'calisthenics-progression': {
      title: 'カリステニクスの進歩：初心者から上級者へ',
      excerpt: '基本的なエクササイズからマッスルアップやプランシェなどの上級動作まで、カリステニクスでの進歩に関する包括的なガイド。',
    },
    'typescript-best-practices': {
      title: '大規模アプリケーションのためのTypeScriptベストプラクティス',
      excerpt: 'タイプセーフティ、パフォーマンス最適化、保守性を含む、本番アプリケーションでTypeScriptを使用するためのベストプラクティスを学ぶ。',
    },
  },
  zh: {
    'nextjs-15-new-features': {
      title: 'Next.js 15：新功能及为何值得关注',
      excerpt: '探索Next.js 15的最新功能，包括性能改进、增强的开发者体验以及将改变我们构建Web应用程序的新功能。',
    },
    'react-server-components': {
      title: '理解React Server Components',
      excerpt: '深入了解React Server Components - 它们是什么、如何工作以及何时在Next.js应用程序中使用。',
    },
    'healthy-developer-lifestyle': {
      title: '作为开发者保持健康的生活方式',
      excerpt: '长时间在办公桌前工作时保持健康的提示和策略。了解营养、运动和心理健康。',
    },
    'beginner-guitar-tips': {
      title: '初学吉他者的10个必备技巧',
      excerpt: '开始您的吉他之旅？这里有基本技巧，可帮助您更快进步并避免常见陷阱。',
    },
    'calisthenics-progression': {
      title: '健美操进阶：从初学者到高级',
      excerpt: '关于健美操进阶的全面指南，从基础练习到肌肉上升和平衡等高级动作。',
    },
    'typescript-best-practices': {
      title: '大型应用程序的TypeScript最佳实践',
      excerpt: '学习在生产应用程序中使用TypeScript的最佳实践，包括类型安全、性能优化和可维护性。',
    },
  },
  ko: {
    'nextjs-15-new-features': {
      title: 'Next.js 15: 새로운 기능과 주목해야 하는 이유',
      excerpt: 'Next.js 15의 최신 기능 탐색, 개선된 성능, 향상된 개발자 경험 및 웹 애플리케이션 구축 방식을 변경할 새로운 기능 포함.',
    },
    'react-server-components': {
      title: 'React Server Components 이해하기',
      excerpt: 'React Server Components에 대한 심층 분석 - 그것이 무엇인지, 어떻게 작동하는지, Next.js 애플리케이션에서 언제 사용하는지.',
    },
    'healthy-developer-lifestyle': {
      title: '개발자로서 건강한 라이프스타일 유지하기',
      excerpt: '책상에서 오랜 시간 일하면서 건강을 유지하기 위한 팁과 전략. 영양, 운동, 정신 건강에 대해 알아보세요.',
    },
    'beginner-guitar-tips': {
      title: '초보 기타리스트를 위한 10가지 필수 팁',
      excerpt: '기타 여정을 시작하나요? 더 빠르게 진행하고 일반적인 함정을 피하는 데 도움이 되는 기본 팁이 여기 있습니다.',
    },
    'calisthenics-progression': {
      title: '칼리스테닉스 진행: 초보자에서 고급자까지',
      excerpt: '기본 운동에서 머슬업 및 플란쉬와 같은 고급 동작까지 칼리스테닉스 진행에 대한 포괄적인 가이드.',
    },
    'typescript-best-practices': {
      title: '대규모 애플리케이션을 위한 TypeScript 모범 사례',
      excerpt: '타입 안전성, 성능 최적화 및 유지보수성을 포함한 프로덕션 애플리케이션에서 TypeScript 사용을 위한 모범 사례를 배우세요.',
    },
  },
  th: {
    'nextjs-15-new-features': {
      title: 'Next.js 15: มีอะไรใหม่และทำไมคุณควรสนใจ',
      excerpt: 'สำรวจฟีเจอร์ล่าสุดใน Next.js 15 รวมถึงประสิทธิภาพที่ดีขึ้น ประสบการณ์นักพัฒนาที่เพิ่มขึ้น และความสามารถใหม่ที่จะเปลี่ยนวิธีที่เราสร้างแอปพลิเคชันเว็บ',
    },
    'react-server-components': {
      title: 'ทำความเข้าใจ React Server Components',
      excerpt: 'เจาะลึกใน React Server Components - มันคืออะไร ทำงานอย่างไร และเมื่อใดที่ควรใช้ในแอปพลิเคชัน Next.js ของคุณ',
    },
    'healthy-developer-lifestyle': {
      title: 'การรักษาไลฟ์สไตล์ที่มีสุขภาพดีในฐานะนักพัฒนา',
      excerpt: 'เคล็ดลับและกลยุทธ์สำหรับการรักษาสุขภาพขณะทำงานหลายชั่วโมงที่โต๊ะทำงาน เรียนรู้เกี่ยวกับโภชนาการ การออกกำลังกาย และสุขภาพจิต',
    },
    'beginner-guitar-tips': {
      title: '10 เคล็ดลับสำคัญสำหรับนักกีตาร์มือใหม่',
      excerpt: 'เริ่มต้นการเดินทางกีตาร์ของคุณ? นี่คือเคล็ดลับพื้นฐานที่จะช่วยให้คุณก้าวหน้าเร็วขึ้นและหลีกเลี่ยงข้อผิดพลาดทั่วไป',
    },
    'calisthenics-progression': {
      title: 'การก้าวหน้าในคาลิสเทนิกส์: จากผู้เริ่มต้นสู่ขั้นสูง',
      excerpt: 'คู่มือที่ครอบคลุมเกี่ยวกับการก้าวหน้าในคาลิสเทนิกส์ จากการออกกำลังกายพื้นฐานไปจนถึงท่าทางขั้นสูงเช่น muscle-up และ planche',
    },
    'typescript-best-practices': {
      title: 'แนวปฏิบัติที่ดีที่สุดของ TypeScript สำหรับแอปพลิเคชันขนาดใหญ่',
      excerpt: 'เรียนรู้แนวปฏิบัติที่ดีที่สุดสำหรับการใช้ TypeScript ในแอปพลิเคชันการผลิต รวมถึงความปลอดภัยของประเภท การเพิ่มประสิทธิภาพ และความสามารถในการบำรุงรักษา',
    },
  },
};
