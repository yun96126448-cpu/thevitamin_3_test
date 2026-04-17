import Link from "next/link";
import { Phone, MessageCircle, UserCheck, ShieldCheck, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: UserCheck,
    title: "검증된 전문 간병인",
    desc: "체계적인 교육과 검증을 거친 전문 간병인을 연결해드립니다.",
  },
  {
    icon: ShieldCheck,
    title: "안전한 서비스",
    desc: "간병인 신원조회 및 자격 확인으로 안전한 서비스를 보장합니다.",
  },
  {
    icon: Clock,
    title: "24시간 대응",
    desc: "응급 상황 발생 시에도 빠른 간병인 배정이 가능합니다.",
  },
  {
    icon: Award,
    title: "다양한 서비스",
    desc: "병원 간병, 가정 간병, 단기 간병 등 다양한 니즈에 대응합니다.",
  },
];

const serviceTypes = [
  { title: "병원 간병", desc: "입원 환자 옆에서 24시간 돌봄 서비스 제공" },
  { title: "가정 간병", desc: "퇴원 후 가정에서의 전문 간병 서비스" },
  { title: "단기 간병", desc: "보호자 부재 시 단기간 긴급 간병 서비스" },
  { title: "치매 전문 간병", desc: "치매 어르신을 위한 전문적인 돌봄 서비스" },
];

export default function CaregiverAssociation() {
  return (
    <div className="min-h-screen">
      <div
        className="relative h-64 flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1920&auto=format&fit=crop&q=80)",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white">
          <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-2">서비스 안내</p>
          <h1 className="text-4xl font-bold">간병인협회</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* 소개 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-7 bg-brand-green rounded-full inline-block" />
            간병인협회란?
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            더비타민 재가복지센터와 연계된 간병인협회는 전문적으로 교육받은 간병인을 환자와 가족에게
            연결해드리는 서비스입니다. 병원 입원 중이거나 퇴원 후 가정에서 전문적인 간병이 필요할 때,
            상담을 통해 맞춤형 간병 서비스를 안내해드립니다.
          </p>
        </section>

        {/* 서비스 특징 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">서비스 특징</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-brand-green-light flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-brand-green-dark" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                    <p className="text-sm text-gray-600">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 서비스 종류 */}
        <section className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">제공 서비스 종류</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {serviceTypes.map((s) => (
              <div key={s.title} className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-bold text-brand-green-dark mb-1">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 상담 안내 */}
        <section className="bg-brand-green-light border border-brand-green rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <MessageCircle size={32} className="text-brand-green shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">문의주시면 상담을 통해 안내드립니다</h2>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                간병인 서비스는 개인마다 필요한 서비스 형태와 기간이 다릅니다.
                아래 정보를 미리 준비해주시면 더 빠르고 정확한 안내가 가능합니다.
              </p>
              <div className="bg-white rounded-xl p-4 text-sm text-gray-700 mb-6">
                <p className="font-semibold text-gray-900 mb-2">💡 빠른 상담을 위해 준비하세요</p>
                <ul className="space-y-1 list-disc list-inside text-gray-600">
                  <li>환자 연령 및 성별</li>
                  <li>현재 진단명 / 주요 증상</li>
                  <li>간병 장소 (병원명 또는 자택 주소)</li>
                  <li>희망 간병 시작일 및 기간</li>
                  <li>24시간 또는 시간제 여부</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg">
                  <a href="tel:061-242-3536" className="flex items-center gap-2">
                    <Phone size={16} /> 061-242-3536
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">온라인 문의하기</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
