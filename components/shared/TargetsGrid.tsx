export default function TargetsGrid({ targets }: { targets: string[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {targets.map((t, i) => (
        <li
          key={i}
          className="flex flex-col gap-8 md:gap-4 bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900 shrink-0">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-gray-700 text-sm sm:text-base leading-relaxed tracking-[0]">{t}</span>
        </li>
      ))}
    </ul>
  );
}
