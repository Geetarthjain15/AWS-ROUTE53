"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

const ungroupedItems = [
  { name: "Dashboard", href: "/route53" },
  { name: "Hosted zones", href: "/route53/hostedzones" },
  { name: "Health checks", href: "/route53/healthchecks" },
];

const groupedItems = [
  {
    title: "Traffic flow",
    items: [
      { name: "Traffic policies", href: "/route53/trafficpolicies" },
      { name: "Policy records", href: "/route53/policyrecords" },
    ],
  },
  {
    title: "Domains",
    items: [
      { name: "Registered domains", href: "/route53/domains" },
      { name: "Pending requests", href: "/route53/pending" },
    ],
  },
  {
    title: "Resolver",
    items: [
      { name: "VPCs", href: "/route53/vpcs" },
      { name: "Inbound endpoints", href: "/route53/inbound" },
      { name: "Outbound endpoints", href: "/route53/outbound" },
      { name: "Rules", href: "/route53/rules" },
      { name: "Query logging", href: "/route53/querylogging" },
    ],
  },
  {
    title: "DNS Firewall",
    items: [
      { name: "Rule groups", href: "/route53/rulegroups" },
      { name: "Domain lists", href: "/route53/domainlists" },
    ],
  },
  {
    title: "Profiles",
    items: [
      { name: "Profiles", href: "/route53/profiles" },
      { name: "Profile associations", href: "/route53/profileassociations" },
    ],
  },
  {
    title: "Application Recovery Controller",
    items: [
      { name: "Getting started", href: "/route53/arc" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    groupedItems.reduce((acc, g) => ({ ...acc, [g.title]: true }), {})
  );

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-[240px] bg-white border-r border-[#eaeded] h-[calc(100vh-2.5rem)] overflow-y-auto hidden md:flex flex-col text-[14px] flex-shrink-0">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#eaeded]">
        <h2 className="text-[18px] font-bold text-[#16191f]">Route 53</h2>
        <button className="text-[#545b64] hover:text-[#16191f]">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {/* Ungrouped */}
        <ul className="mb-2">
          {ungroupedItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/route53" && pathname.startsWith(item.href));
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={clsx(
                    "block py-[5px] text-[14px] transition-colors",
                    isActive
                      ? "text-[#ec7211] font-bold border-l-4 border-[#ec7211] pl-[16px] bg-[#fef6ee]"
                      : "text-[#545b64] hover:text-[#16191f] hover:bg-[#f2f3f3] pl-[20px]"
                  )}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="border-t border-[#eaeded] pt-2 space-y-1">
          {groupedItems.map((group) => (
            <div key={group.title}>
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center px-4 py-[5px] text-[13px] font-bold text-[#16191f] hover:bg-[#f2f3f3] text-left"
              >
                <span className="mr-1.5 text-[#545b64]">
                  {openGroups[group.title] ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </span>
                {group.title}
              </button>
              {openGroups[group.title] && (
                <ul>
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={clsx(
                            "block py-[5px] text-[13px] transition-colors",
                            isActive
                              ? "text-[#ec7211] font-bold border-l-4 border-[#ec7211] pl-[34px] bg-[#fef6ee]"
                              : "text-[#545b64] hover:text-[#16191f] hover:bg-[#f2f3f3] pl-[38px]"
                          )}
                        >
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}
