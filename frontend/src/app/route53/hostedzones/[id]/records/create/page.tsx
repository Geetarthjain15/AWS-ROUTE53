"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/utils/api";
import Link from "next/link";
import { useToastStore } from "@/components/Toast";

const RECORD_TYPES = ["A", "AAAA", "CNAME", "TXT", "MX", "NS", "PTR", "SRV", "CAA"];
const ROUTING_POLICIES = ["Simple", "Weighted", "Geolocation", "Latency", "Failover"];

const RECORD_HINTS: Record<string, string> = {
  A: "e.g., 192.0.2.1",
  AAAA: "e.g., 2001:0db8:85a3:0000:0000:8a2e:0370:7334",
  CNAME: "e.g., www.example.com",
  TXT: 'e.g., "v=spf1 include:example.com ~all"',
  MX: "e.g., 10 mail.example.com",
  NS: "e.g., ns1.example.com",
  PTR: "e.g., hostname.example.com",
  SRV: "e.g., 10 20 5060 sipserver.example.com",
  CAA: '0 issue "letsencrypt.org"',
};

export default function CreateRecordPage() {
  const router = useRouter();
  const params = useParams();
  const zoneId = params.id as string;
  const { addToast } = useToastStore();

  const [form, setForm] = useState({
    name: "",
    type: "A",
    value: "",
    ttl: 300,
    routing_policy: "Simple",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post(`/zones/${zoneId}/records/`, { ...form, routing_policy: form.routing_policy });
      addToast(`Record "${form.name}" created successfully.`, "success");
      router.push(`/route53/hostedzones/${zoneId}`);
    } catch (err: any) {
      const msg = err.response?.data?.detail || "An error occurred";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="max-w-[800px] mx-auto text-[#16191f]">
      <div className="mb-3 text-[13px]">
        <Link href="/route53/hostedzones" className="text-[#0073bb] hover:underline">Hosted zones</Link>
        <span className="mx-2 text-gray-400">›</span>
        <Link href={`/route53/hostedzones/${zoneId}`} className="text-[#0073bb] hover:underline">Zone</Link>
        <span className="mx-2 text-gray-400">›</span>
        <span className="text-gray-500">Create record</span>
      </div>
      <h1 className="text-[24px] font-bold mb-6">Create record</h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-[#eaeded] shadow-sm rounded mb-4">
          <div className="px-5 py-4 border-b border-[#eaeded] bg-[#fafafa]">
            <h2 className="text-[16px] font-bold">Record details</h2>
          </div>
          <div className="p-5 space-y-5">
            {error && (
              <div className="bg-[#fdf2f0] border border-[#f5c6c0] rounded p-3 text-[13px] text-[#d13212]">{error}</div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-bold text-[#16191f] mb-1">Record name <span className="text-[#d13212]">*</span></label>
                <input
                  type="text"
                  required
                  className="w-full border border-[#aab7b8] rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0073bb]"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#16191f] mb-1">Record type <span className="text-[#d13212]">*</span></label>
                <select
                  className="w-full border border-[#aab7b8] rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0073bb] bg-white"
                  value={form.type}
                  onChange={(e) => set("type", e.target.value)}
                >
                  {RECORD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[#16191f] mb-1">Value <span className="text-[#d13212]">*</span></label>
              <textarea
                required
                rows={3}
                className="w-full border border-[#aab7b8] rounded px-3 py-2 text-[13px] font-mono focus:outline-none focus:ring-1 focus:ring-[#0073bb]"
                value={form.value}
                onChange={(e) => set("value", e.target.value)}
                placeholder={RECORD_HINTS[form.type]}
              />
              <p className="mt-1 text-[12px] text-[#545b64]">{RECORD_HINTS[form.type]}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-bold text-[#16191f] mb-1">TTL (seconds) <span className="text-[#d13212]">*</span></label>
                <input
                  type="number"
                  required
                  min={0}
                  className="w-full border border-[#aab7b8] rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0073bb]"
                  value={form.ttl}
                  onChange={(e) => set("ttl", Number(e.target.value))}
                />
                <p className="mt-1 text-[12px] text-[#545b64]">Recommended: 300 for dynamic, 86400 for static records.</p>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#16191f] mb-1">Routing policy <span className="text-[#d13212]">*</span></label>
                <select
                  className="w-full border border-[#aab7b8] rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0073bb] bg-white"
                  value={form.routing_policy}
                  onChange={(e) => set("routing_policy", e.target.value)}
                >
                  {ROUTING_POLICIES.map((p) => <option key={p} value={p}>{p} routing</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href={`/route53/hostedzones/${zoneId}`}
            className="px-4 py-2 border border-[#d5dbdb] bg-white text-[#16191f] text-[13px] font-bold rounded hover:bg-[#fafafa] shadow-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#ec7211] hover:bg-[#d35400] text-white text-[13px] font-bold rounded shadow-sm disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create record"}
          </button>
        </div>
      </form>
    </div>
  );
}
