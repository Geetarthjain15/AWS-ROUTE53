"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function Route53Dashboard() {
  return (
    <div className="max-w-[1000px] mx-auto text-[#16191f] font-sans">
      
      {/* Breadcrumb & Header */}
      <div className="mb-4 text-[14px]">
        <span className="text-[#0073bb] cursor-pointer hover:underline">Route 53</span>
        <span className="mx-2 text-gray-500">{'>'}</span>
        <span className="text-gray-500">Dashboard</span>
      </div>

      <div className="flex items-end mb-6">
        <h1 className="text-[24px] font-bold mr-3">Route 53 Dashboard</h1>
        <span className="text-[#0073bb] text-[14px] font-bold cursor-pointer hover:underline mb-1">Info</span>
      </div>

      {/* Main Features Grid */}
      <div className="bg-white border border-[#eaeded] shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#eaeded]">
          
          {/* Feature 1 */}
          <div className="p-6 flex flex-col items-center text-center">
            <h3 className="font-bold text-[16px] mb-2">DNS management</h3>
            <p className="text-[#545b64] text-[14px] mb-6 flex-1">
              A hosted zone tells Route 53 how to respond to DNS queries for a domain such as example.com.
            </p>
            <Link 
              href="/route53/hostedzones/create" 
              className="bg-white text-[#16191f] border border-[#d5dbdb] hover:bg-[#fafafa] font-bold text-[14px] px-4 py-1.5 rounded-sm shadow-sm transition-colors"
            >
              Create hosted zone
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="p-6 flex flex-col items-center text-center">
            <h3 className="font-bold text-[16px] mb-2">Traffic management</h3>
            <p className="text-[#545b64] text-[14px] mb-6 flex-1">
              A visual tool that lets you easily create policies for multiple endpoints in complex configurations.
            </p>
            <button className="bg-white text-[#16191f] border border-[#d5dbdb] hover:bg-[#fafafa] font-bold text-[14px] px-4 py-1.5 rounded-sm shadow-sm transition-colors">
              Create policy
            </button>
          </div>

          {/* Feature 3 */}
          <div className="p-6 flex flex-col items-center text-center">
            <h3 className="font-bold text-[16px] mb-2">Availability monitoring</h3>
            <p className="text-[#545b64] text-[14px] mb-6 flex-1">
              Health checks monitor your applications and web resources, and direct DNS queries to healthy resources.
            </p>
            <button className="bg-white text-[#16191f] border border-[#d5dbdb] hover:bg-[#fafafa] font-bold text-[14px] px-4 py-1.5 rounded-sm shadow-sm transition-colors">
              Create health check
            </button>
          </div>

          {/* Feature 4 */}
          <div className="p-6 flex flex-col items-center text-center">
            <h3 className="font-bold text-[16px] mb-2">Domain registration</h3>
            <p className="text-[#545b64] text-[14px] mb-6 flex-1">
              A domain is the name, such as example.com, that your users use to access your application.
            </p>
            <button className="bg-white text-[#16191f] border border-[#d5dbdb] hover:bg-[#fafafa] font-bold text-[14px] px-4 py-1.5 rounded-sm shadow-sm transition-colors">
              Register domain
            </button>
          </div>

        </div>

        {/* Metrics Section underneath the first two cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#eaeded] border-t border-[#eaeded]">
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <h3 className="font-bold text-[16px] mb-4">Readiness check</h3>
            <div className="text-[32px] font-light text-[#16191f] mb-1">0</div>
            <a href="#" className="text-[#0073bb] hover:underline text-[14px]">Readiness checks</a>
          </div>
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <h3 className="font-bold text-[16px] mb-4">Routing control</h3>
            <div className="text-[32px] font-light text-[#16191f] mb-1">0</div>
            <a href="#" className="text-[#0073bb] hover:underline text-[14px]">Control panels</a>
          </div>
          <div className="col-span-2 hidden md:block bg-gray-50/30"></div>
        </div>
      </div>

      {/* Register domain section */}
      <div className="bg-white border border-[#eaeded] shadow-sm mb-6">
        <div className="px-5 py-3 border-b border-[#eaeded] bg-[#fafafa]">
          <h2 className="font-bold text-[18px]">Register domain</h2>
        </div>
        <div className="p-5">
          <p className="text-[14px] text-[#16191f] mb-4">
            Find and register an available domain, or <a href="#" className="text-[#0073bb] hover:underline">transfer your existing domains</a> to Route 53.
          </p>
          <div className="max-w-[800px]">
            <input 
              type="text" 
              placeholder="Enter a domain name" 
              className="w-full border border-[#aab7b8] rounded-sm p-2 text-[14px] focus:outline-none focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb] mb-1"
            />
            <p className="text-[12px] text-[#545b64] mb-4">
              Each label (each part between dots) can be up to 63 characters long and must start with a-z or 0-9. Maximum length: 255 characters, including dots. Valid characters: a-z, 0-9, and - (hyphen)
            </p>
            <button className="bg-white text-[#16191f] border border-[#d5dbdb] hover:bg-[#fafafa] font-bold text-[14px] px-4 py-1.5 rounded-sm shadow-sm transition-colors">
              Check
            </button>
          </div>
        </div>
      </div>

      {/* Notifications section */}
      <div className="bg-white border border-[#eaeded] shadow-sm mb-6">
        <div className="px-5 py-3 border-b border-[#eaeded] bg-[#fafafa] flex justify-between items-center">
          <h2 className="font-bold text-[18px]">Notifications</h2>
          <button className="p-1 border border-[#d5dbdb] rounded-sm bg-white hover:bg-[#fafafa] shadow-sm">
            <RefreshCw size={14} className="text-[#545b64]" />
          </button>
        </div>
        <div className="p-5">
          <p className="text-[14px] text-[#545b64]">No notifications at this time.</p>
        </div>
      </div>

    </div>
  );
}
