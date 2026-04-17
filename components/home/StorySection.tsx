import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function StorySection() {
  const stories = [
    {
      id: 1,
      title: "어르신 맞춤형 돌봄",
      description:
        "개인별 건강 상태와 필요를 반영한 전문적인 요양보호 서비스로 어르신의 삶의 질을 높입니다.",
      bgColor: "bg-gray-100",
      textColor: "text-gray-900",
    },
    {
      id: 2,
      title: "실제 이용 후기",
      description:
        "더비타민의 따뜻한 돌봄으로 어르신과 가족이 함께 행복해지는 순간들을 만나보세요.",
      bgColor: "bg-gray-900",
      textColor: "text-white",
    },
    {
      id: 3,
      title: "함께하면 든든해요",
      description:
        "더비타민과 함께라면 가족의 부담을 덜고 어르신의 존엄성과 자립심을 지킬 수 있습니다.",
      bgColor: "bg-brand-green",
      textColor: "text-white",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-12 flex items-center justify-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">더비타민 이야기</h2>
        </div>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stories.map((story) => (
            <Link
              key={story.id}
              href="/notices"
              className="group flex flex-col h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* 이미지 영역 (비어있음) */}
              <div
                className={`${story.bgColor} flex-1 min-h-64 flex items-center justify-center relative overflow-hidden`}
              >
                <div className={`text-center ${story.textColor}`}>
                  <div className="text-5xl mb-3 opacity-30">📸</div>
                  <p className="text-xs opacity-50">이미지 영역</p>
                </div>
              </div>

              {/* 텍스트 영역 */}
              <div className="bg-white p-6 sm:p-7 flex flex-col justify-between">
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-green transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {story.description}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-1 text-brand-green text-sm font-medium group-hover:gap-2 transition-all">
                  자세히 보기
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 모바일 버튼 */}
        <div className="sm:hidden">
          <Link
            href="/notices"
            className="block w-full bg-brand-green text-white py-3 rounded-lg text-center font-medium hover:bg-brand-green-dark transition-colors"
          >
            공지사항 더보기
          </Link>
        </div>
      </div>
    </section>
  );
}
