"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/utils/api";
import { useAuthStore } from "@/store/auth";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasUsers, setHasUsers] = useState<boolean | null>(null);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  // Check if any users exist → decide whether to show Login or nudge to Sign-up
  useEffect(() => {
    api.get("/auth/user-count").then((res) => {
      setHasUsers(res.data.count > 0);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.access_token, res.data.account_name, res.data.email);
      router.push("/route53");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Amazon_Ember',Arial,sans-serif] flex flex-col items-center">
      

      {/* Centered Logo */}
      <div className="w-full max-w-[1000px] mt-10 mb-8 flex justify-center">
        <div className="flex flex-col items-center">
          <span className="text-[44px] font-bold text-[#232f3e] leading-none tracking-tighter">aws</span>
          <div className="w-[60px] h-[4px] bg-gradient-to-r from-[#ff9900] to-[#ffb84d] rounded-full mt-1" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-[1000px] px-6 gap-10 lg:gap-16 items-start">
        {/* Left panel - Info */}
        <div className="flex-1 w-full pt-4 relative">
          <h2 className="text-[20px] font-bold text-[#16191f] mb-4">
            Try AWS at no cost for up to 6 months
          </h2>
          <p className="text-[14px] text-[#16191f] leading-relaxed mb-10 max-w-[360px]">
            Start with USD $100 in AWS credits, plus earn up to USD $100 by completing various activities.
          </p>
          
          {/* Isometric illustration (Full Screen Background) */}
          <div className="fixed inset-0 w-full h-full opacity-60 pointer-events-none -z-10 overflow-hidden">
            <svg viewBox="0 0 1440 900" className="w-full h-full object-cover preserve-3d" preserveAspectRatio="xMidYMax slice">
              
              {/* Bottom Left cube stack */}
              <g transform="translate(-50, 500) scale(1.8)" fill="none" stroke="#a7bced" strokeWidth="1">
                <polygon points="0,30 40,0 80,30 80,90 40,120 0,90" fill="#ffffff" />
                <polygon points="0,30 40,60 40,120 0,90" fill="#f8faff" />
                <polygon points="40,0 80,30 80,90 40,60" fill="#f0f4fd" />
                <line x1="0" y1="50" x2="40" y2="80" stroke="#c4d3fa" />
                <line x1="40" y1="80" x2="80" y2="50" stroke="#c4d3fa" />
                <line x1="0" y1="70" x2="40" y2="100" stroke="#c4d3fa" />
                <line x1="40" y1="100" x2="80" y2="70" stroke="#c4d3fa" />
              </g>

              {/* Bottom Center Rocket */}
              <g transform="translate(350, 600) scale(2)" fill="none" stroke="#232f3e" strokeWidth="1">
                 <polygon points="0,40 60,0 120,40 120,110 60,150 0,110" fill="#ffffff" stroke="#a7bced" />
                 <line x1="0" y1="40" x2="60" y2="80" stroke="#a7bced" />
                 <line x1="60" y1="80" x2="120" y2="40" stroke="#a7bced" />
                 <line x1="60" y1="80" x2="60" y2="150" stroke="#a7bced" />
                 
                 {/* Rocket inside box */}
                 <g transform="translate(60, 40) rotate(45) scale(1)">
                    <path d="M0,-30 C15,-30 20,-10 20,10 C20,20 15,30 0,30 C-15,30 -20,20 -20,10 C-20,-10 -15,-30 0,-30 Z" fill="#ffffff" stroke="#232f3e" strokeWidth="2"/>
                    <circle cx="0" cy="-5" r="5" fill="none" stroke="#232f3e" strokeWidth="2" />
                    <polygon points="-15,15 -25,25 -20,5 -15,5" fill="#ffffff" stroke="#232f3e" strokeWidth="2" />
                    <polygon points="15,15 25,25 20,5 15,5" fill="#ffffff" stroke="#232f3e" strokeWidth="2" />
                    {/* Thrust */}
                    <line x1="-10" y1="45" x2="0" y2="35" stroke="#3b82f6" strokeWidth="2" />
                    <line x1="0" y1="50" x2="10" y2="40" stroke="#3b82f6" strokeWidth="2" />
                    <line x1="10" y1="45" x2="20" y2="35" stroke="#3b82f6" strokeWidth="2" />
                 </g>
              </g>

              {/* Bottom Right cube stack */}
              <g transform="translate(900, 400) scale(2)" fill="none" stroke="#a7bced" strokeWidth="1">
                <polygon points="0,30 40,0 80,30 80,90 40,120 0,90" fill="#ffffff" />
                <polygon points="0,30 40,60 40,120 0,90" fill="#f8faff" />
                <polygon points="40,0 80,30 80,90 40,60" fill="#f0f4fd" />
                <line x1="0" y1="50" x2="40" y2="80" stroke="#c4d3fa" />
                <line x1="40" y1="80" x2="80" y2="50" stroke="#c4d3fa" />
                <line x1="0" y1="70" x2="40" y2="100" stroke="#c4d3fa" />
                <line x1="40" y1="100" x2="80" y2="70" stroke="#c4d3fa" />
              </g>
              
              {/* Far Right Bottom cube */}
              <g transform="translate(1300, 650) scale(1.5)" fill="none" stroke="#a7bced" strokeWidth="1">
                <polygon points="0,30 40,0 80,30 80,90 40,120 0,90" fill="#ffffff" />
                <polygon points="0,30 40,60 40,120 0,90" fill="#f8faff" />
                <polygon points="40,0 80,30 80,90 40,60" fill="#f0f4fd" />
              </g>
            </svg>
          </div>
        </div>
        {/* Right panel - Form */}
        <div className="flex-1 w-full max-w-[440px] pl-0 md:pl-12 border-t md:border-t-0 md:border-l border-gray-300 pt-8 md:pt-0">
          <h1 className="text-[24px] font-[400] text-[#16191f] mb-6">Sign in</h1>

          {hasUsers === false && (
            <div className="mb-5 bg-[#fff8e6] border border-[#f0c14b] rounded-sm p-3 text-[13px] text-[#7d6608]">
              No accounts found.{" "}
              <Link href="/signup" className="text-[#0073bb] hover:underline font-bold">
                Create your first account →
              </Link>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-[#fdf2f0] border border-[#f5c6c0] rounded-sm p-3 text-[13px] text-[#d13212]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-[600] text-[#16191f] mb-1">
                Root user email address
              </label>
              <input
                type="email"
                required
                className="w-full border border-[#8d9db6] rounded-sm px-3 py-1.5 text-[14px] focus:outline-none focus:ring-[2px] focus:ring-[#0073bb] focus:border-[#0073bb]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-[13px] font-[600] text-[#16191f] mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full border border-[#8d9db6] rounded-sm px-3 py-1.5 pr-10 text-[14px] focus:outline-none focus:ring-[2px] focus:ring-[#0073bb] focus:border-[#0073bb]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#545b64]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff9900] hover:bg-[#e88b00] border border-[#ff9900] hover:border-[#e88b00] text-[#111111] font-bold py-1.5 rounded-sm text-[14px] transition-colors disabled:opacity-50 shadow-sm mt-2"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-[12px] text-gray-500 font-medium bg-white px-2">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <Link
            href="/signup"
            className="w-full block text-center border border-[#8d9db6] text-[#16191f] font-bold py-1.5 rounded-sm text-[14px] hover:bg-[#f7f7f7] transition-colors"
          >
            Create a new AWS account
          </Link>
        </div>
      </div>

      {/* Spacer to push footer down */}
      <div className="flex-1 min-h-[40px]"></div>

      {/* Footer */}
      <div className="w-full border-t border-gray-200 py-6 flex flex-col items-center gap-4 mt-12 bg-white">
        <div className="flex gap-6 text-[12px] text-[#0073bb] font-medium">
          <span className="cursor-pointer hover:underline">Terms of Use</span>
          <span className="cursor-pointer hover:underline">Privacy Policy</span>
        </div>
        <span className="text-[12px] text-[#545b64]">© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.</span>
      </div>
    </div>
  );
}
