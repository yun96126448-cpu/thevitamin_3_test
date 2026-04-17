import Link from "next/link";
import { Heart, Users, Package, UserCheck, ArrowRight } from "lucide-react";

const services = [
  {
    href: "/visit-care",
    icon: Heart,
    title: "방문요양",
    description:
      "전문 요양보호사가 가정을 직접 방문하여 식사, 위생, 외출 동행 등 일상생활을 도와드립니다.",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    href: "/family-care",
    icon: Users,
    title: "가족요양",
    description:
      "요양보호사 자격을 취득한 가족이 직접 어르신을 돌보며 급여를 받을 수 있는 서비스입니다.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    href: "/welfare-equipment",
    icon: Package,
    title: "복지용구",
    description:
      "휠체어, 전동침대, 안전손잡이 등 일상을 편리하게 돕는 복지용구를 대여·구매할 수 있습니다.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    href: "/caregiver",
    icon: UserCheck,
    title: "간병인협회",
    description:
      "병원 및 가정에서 전문 간병인을 연결해드립니다. 상담을 통해 맞춤형 간병 서비스를 안내드립니다.",
    color: "text-brand-green-dark",
    bg: "bg-brand-green-light",
  },
];

export default function ServiceCards() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            더비타민의 <span className="text-brand-green">서비스</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            어르신과 가족 모두를 위한 맞춤형 돌봄 서비스를 제공합니다
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.href}
                href={service.href}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-brand-green hover:shadow-md transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center mb-4`}>
                  <Icon size={24} className={service.color} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{service.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-green group-hover:gap-2 transition-all">
                  자세히 보기 <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
