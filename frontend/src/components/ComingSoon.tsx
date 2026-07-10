interface ComingSoonProps {
  title: string;
  description?: string;
  breadcrumb?: string;
}

export function ComingSoon({ title, description, breadcrumb }: ComingSoonProps) {
  return (
    <div className="max-w-[1000px] mx-auto text-[#16191f]">
      {breadcrumb && (
        <div className="mb-3 text-[13px]">
          <span className="text-[#0073bb]">Route 53</span>
          <span className="mx-2 text-gray-400">›</span>
          <span className="text-gray-500">{breadcrumb}</span>
        </div>
      )}
      <h1 className="text-[24px] font-bold mb-6">{title}</h1>
      <div className="bg-white border border-[#eaeded] shadow-sm rounded p-10 text-center">
        <div className="text-4xl mb-4">🚧</div>
        <h2 className="text-[18px] font-bold text-[#16191f] mb-2">Coming Soon</h2>
        <p className="text-[14px] text-[#545b64] max-w-md mx-auto">
          {description || `The ${title} section is not yet available in this clone. This is a placeholder page.`}
        </p>
      </div>
    </div>
  );
}
