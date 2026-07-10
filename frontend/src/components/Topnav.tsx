"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { Search, Grid, Terminal, Bell, HelpCircle, ChevronDown } from "lucide-react";
import { useEffect } from "react";

export function Topnav() {
  const router = useRouter();
  const { logout, accountName, checkAuth } = useAuthStore();

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-[#232f3e] text-white h-10 flex items-center justify-between px-3 border-b border-[#131a22] sticky top-0 z-50 text-sm select-none">
      {/* Left */}
      <div className="flex items-center h-full">
        {/* AWS logo */}
        <div className="flex flex-col items-center justify-center px-3 h-full hover:bg-[#131a22] cursor-pointer">
          <span className="text-[18px] font-bold text-white leading-none tracking-tighter">aws</span>
          <div className="w-full h-[2px] bg-[#ff9900] rounded-full mt-0.5" />
        </div>

        {/* Services */}
        <div className="flex items-center gap-1.5 px-3 h-full hover:bg-[#131a22] cursor-pointer">
          <Grid size={15} className="text-gray-300" />
          <span className="text-[13px] font-medium">Services</span>
        </div>

        {/* Search bar */}
        <div className="relative ml-2 hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={13} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for services, features, blogs, docs, and more"
            className="pl-8 pr-24 w-[480px] text-[12px] bg-[#161e2d] border border-transparent rounded h-7 text-gray-200 focus:bg-white focus:text-black focus:border-[#0073bb] outline-none transition-colors"
          />
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <span className="text-[10px] text-gray-500 border border-gray-600 px-1 rounded bg-[#232f3e]">[Option+S]</span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center h-full">
        <button className="px-2 h-full flex items-center hover:bg-[#131a22]">
          <Terminal size={15} />
        </button>
        <button className="px-2 h-full flex items-center hover:bg-[#131a22]">
          <Bell size={15} />
        </button>
        <button className="px-2 h-full flex items-center hover:bg-[#131a22]">
          <HelpCircle size={15} />
        </button>

        {/* Region */}
        <div className="flex items-center gap-1 px-3 h-full hover:bg-[#131a22] cursor-pointer border-l border-[#131a22]">
          <span className="text-[12px] font-medium">Global</span>
          <ChevronDown size={12} />
        </div>

        {/* Account */}
        <div
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 h-full hover:bg-[#131a22] cursor-pointer border-l border-[#131a22]"
          title="Click to sign out"
        >
          <span className="text-[12px] font-medium max-w-[120px] truncate">
            {accountName || "Account"}
          </span>
          <ChevronDown size={12} />
        </div>
      </div>
    </header>
  );
}
