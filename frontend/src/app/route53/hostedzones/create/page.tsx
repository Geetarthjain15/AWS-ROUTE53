"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import Link from "next/link";
import { useToastStore } from "@/components/Toast";

export default function CreateHostedZone() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState("Public");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addToast } = useToastStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/zones/", { name, type, comment });
      addToast(`Hosted zone "${name}" created successfully.`, "success");
      router.push("/route53/hostedzones");
    } catch (err: any) {
      const msg = err.response?.data?.detail || "An error occurred";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto text-[#16191f]">
      <div className="mb-3 text-[13px]">
        <Link href="/route53/hostedzones" className="text-[#0073bb] hover:underline">Hosted zones</Link>
        <span className="mx-2 text-gray-400">›</span>
        <span className="text-gray-500">Create hosted zone</span>
      </div>
      <h1 className="text-[24px] font-bold mb-6">Create hosted zone</h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-[#eaeded] shadow-sm rounded mb-4">
          <div className="px-5 py-4 border-b border-[#eaeded] bg-[#fafafa]">
            <h2 className="text-[16px] font-bold">Hosted zone configuration</h2>
          </div>
          <div className="p-5 space-y-5">
            {error && (
              <div className="bg-[#fdf2f0] border border-[#f5c6c0] rounded p-3 text-[13px] text-[#d13212]">{error}</div>
            )}
            <div>
              <label className="block text-[13px] font-bold text-[#16191f] mb-1">
                Domain name <span className="text-[#d13212]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="example.com"
                className="w-full border border-[#aab7b8] rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0073bb] focus:border-[#0073bb]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="mt-1 text-[12px] text-[#545b64]">Enter the name of the domain (e.g., example.com).</p>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#16191f] mb-1">Description</label>
              <textarea
                className="w-full border border-[#aab7b8] rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0073bb]"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#16191f] mb-2">Type <span className="text-[#d13212]">*</span></label>
              <div className="space-y-3">
                {[
                  { value: "Public", label: "Public hosted zone", desc: "Routes traffic on the internet." },
                  { value: "Private", label: "Private hosted zone", desc: "Routes traffic within Amazon VPCs." }
                ].map((opt) => (
                  <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={opt.value}
                      checked={type === opt.value}
                      onChange={(e) => setType(e.target.value)}
                      className="mt-0.5 text-[#0073bb] focus:ring-[#0073bb]"
                    />
                    <div>
                      <p className="text-[13px] font-bold text-[#16191f]">{opt.label}</p>
                      <p className="text-[12px] text-[#545b64]">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Link href="/route53/hostedzones" className="px-4 py-2 border border-[#d5dbdb] bg-white text-[#16191f] text-[13px] font-bold rounded hover:bg-[#fafafa] shadow-sm">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#ec7211] hover:bg-[#d35400] text-white text-[13px] font-bold rounded shadow-sm disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create hosted zone"}
          </button>
        </div>
      </form>
    </div>
  );
}
