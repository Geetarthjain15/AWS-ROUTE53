"use client";

import { usePathname } from "next/navigation";

export default function MockedPage() {
  const pathname = usePathname();
  const pageName = pathname.split('/').pop()?.replace(/-/g, ' ') || 'Page';

  return (
    <div className="max-w-[1000px] mx-auto text-[#16191f] flex flex-col items-center justify-center pt-20">
      <div className="bg-white border border-[#eaeded] shadow-sm rounded-sm p-10 flex flex-col items-center max-w-lg text-center">
        <h1 className="text-[24px] font-bold mb-3 capitalize">{pageName}</h1>
        <div className="bg-[#e6f6ff] text-[#0073bb] px-3 py-1 rounded-full text-[12px] font-bold mb-6 border border-[#b8e5ff]">
          Coming Soon
        </div>
        <p className="text-[#545b64] text-[14px] leading-relaxed">
          This section of the AWS Route53 console is currently being mocked for the clone. 
          The core functionality is focused on Hosted Zones and DNS Records.
        </p>
      </div>
    </div>
  );
}
