"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/utils/api";
import { Search, Plus, Trash2, Pencil, ArrowLeft, Download, Upload, Trash, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Modal, ConfirmModal } from "@/components/Modal";
import { useToastStore } from "@/components/Toast";

const RECORD_TYPES = ["All types", "A", "AAAA", "CNAME", "TXT", "MX", "NS", "PTR", "SRV", "CAA"];
const ROUTING_POLICIES = ["Simple", "Weighted", "Geolocation", "Latency", "Failover"];
const PAGE_SIZE = 20;

export default function ZoneDetailsPage() {
  const params = useParams();
  const zoneId = params.id as string;
  const { addToast } = useToastStore();

  const [zone, setZone] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  // Edit state
  const [editTarget, setEditTarget] = useState<any>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", type: "A", value: "", ttl: 300, routing_policy: "Simple" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * PAGE_SIZE;
      const typeParam = typeFilter !== "All types" ? `&type=${typeFilter}` : "";
      const [zoneRes, recordsRes, totalRes] = await Promise.all([
        api.get(`/zones/${zoneId}`),
        api.get(`/zones/${zoneId}/records/?search=${search}&skip=${skip}&limit=${PAGE_SIZE}${typeParam}`),
        api.get(`/zones/${zoneId}/records/?search=${search}&skip=0&limit=9999${typeParam}`)
      ]);
      setZone(zoneRes.data);
      setRecords(recordsRes.data);
      setTotal(totalRes.data.length);
    } catch {
      addToast("Failed to load zone data", "error");
    } finally {
      setLoading(false);
    }
  }, [zoneId, search, page, typeFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setPage(1); setSelectedRecords(new Set()); }, [search, typeFilter]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("record-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openEdit = (record: any) => {
    setEditTarget(record);
    setEditForm({
      name: record.name,
      type: record.type,
      value: record.value,
      ttl: record.ttl,
      routing_policy: record.routing_policy,
    });
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    setEditLoading(true);
    try {
      await api.put(`/zones/${zoneId}/records/${editTarget.id}`, editForm);
      addToast(`Record "${editForm.name}" updated successfully.`, "success");
      setEditTarget(null);
      fetchData();
    } catch {
      addToast("Failed to update record.", "error");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/zones/${zoneId}/records/${deleteTarget.id}`);
      addToast(`Record "${deleteTarget.name}" deleted.`, "success");
      setDeleteTarget(null);
      fetchData();
    } catch {
      addToast("Failed to delete record.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    setBulkDeleteLoading(true);
    try {
      await api.post(`/bulk/zones/${zoneId}/records/delete`, { record_ids: Array.from(selectedRecords) });
      addToast(`${selectedRecords.size} record(s) deleted successfully.`, "success");
      setSelectedRecords(new Set());
      setBulkDeleteOpen(false);
      fetchData();
    } catch {
      addToast("Failed to delete records.", "error");
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  const handleExportJson = async () => {
    try {
      const res = await api.get(`/zones/${zoneId}/export/json`);
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${zone?.name || "zone"}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addToast("Zone exported as JSON.", "info");
    } catch {
      addToast("Failed to export zone.", "error");
    }
  };

  const handleExportBind = async () => {
    try {
      const res = await api.get(`/zones/${zoneId}/export/bind`);
      const blob = new Blob([res.data], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${zone?.name || "zone"}.zone`;
      a.click();
      URL.revokeObjectURL(url);
      addToast("Zone exported as BIND format.", "info");
    } catch {
      addToast("Failed to export zone as BIND.", "error");
    }
  };

  const handleImportBind = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post(`/zones/${zoneId}/import/bind`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      addToast("BIND zone file imported successfully.", "success");
      fetchData();
    } catch (err: any) {
      addToast("Failed to import BIND file: " + (err.response?.data?.detail || err.message), "error");
    }
    e.target.value = "";
  };

  const toggleSelectAll = () => {
    if (selectedRecords.size === records.length) {
      setSelectedRecords(new Set());
    } else {
      setSelectedRecords(new Set(records.map((r) => r.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const s = new Set(selectedRecords);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelectedRecords(s);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (!zone && !loading) return <div className="p-8 text-center text-red-500">Zone not found</div>;

  return (
    <div className="max-w-[1200px] mx-auto text-[#16191f]">
      {/* Breadcrumb */}
      <div className="mb-3 text-[13px]">
        <Link href="/route53/hostedzones" className="text-[#0073bb] hover:underline">Hosted zones</Link>
        <span className="mx-2 text-gray-400">›</span>
        <span className="text-gray-500">{zone?.name || "..."}</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-start mb-4 gap-3">
        <div>
          <h1 className="text-[24px] font-bold">{zone?.name}</h1>
          <p className="text-[13px] text-[#545b64] mt-1">
            {zone?.type} hosted zone &nbsp;|&nbsp; Zone ID: <span className="font-mono">{zone?.id}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportJson}
            className="bg-white border border-[#d5dbdb] text-[#16191f] text-[13px] font-bold px-3 py-1.5 rounded hover:bg-[#fafafa] shadow-sm flex items-center gap-1.5"
          >
            <Download size={14} /> Export JSON
          </button>
          <button
            onClick={handleExportBind}
            className="bg-white border border-[#d5dbdb] text-[#16191f] text-[13px] font-bold px-3 py-1.5 rounded hover:bg-[#fafafa] shadow-sm flex items-center gap-1.5"
          >
            <Download size={14} /> Export BIND
          </button>
          <label className="bg-white border border-[#d5dbdb] text-[#16191f] text-[13px] font-bold px-3 py-1.5 rounded hover:bg-[#fafafa] shadow-sm flex items-center gap-1.5 cursor-pointer">
            <Upload size={14} /> Import BIND
            <input type="file" className="hidden" accept=".txt,.zone" onChange={handleImportBind} />
          </label>
        </div>
      </div>

      {/* Records Panel */}
      <div className="bg-white border border-[#eaeded] shadow-sm rounded">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-[#eaeded] bg-[#fafafa] flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2 items-center flex-wrap">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className="text-[#545b64]" />
              </div>
              <input
                id="record-search"
                type="text"
                placeholder="Search records (⌘K)"
                className="pl-9 pr-3 w-[250px] text-[13px] border border-[#aab7b8] rounded h-8 focus:outline-none focus:ring-1 focus:ring-[#0073bb]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <select
              className="text-[13px] border border-[#aab7b8] rounded h-8 px-2 focus:outline-none focus:ring-1 focus:ring-[#0073bb] bg-white"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {RECORD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            <button onClick={fetchData} className="p-1.5 border border-[#d5dbdb] bg-white rounded hover:bg-[#fafafa] shadow-sm">
              <RefreshCw size={14} className="text-[#545b64]" />
            </button>
          </div>

          <div className="flex gap-2 items-center">
            {selectedRecords.size > 0 && (
              <button
                onClick={() => setBulkDeleteOpen(true)}
                className="bg-white border border-[#d5dbdb] text-[#d13212] text-[13px] font-bold px-3 py-1.5 rounded hover:bg-[#fafafa] shadow-sm flex items-center gap-1.5"
              >
                <Trash size={14} /> Delete selected ({selectedRecords.size})
              </button>
            )}
            <Link
              href={`/route53/hostedzones/${zoneId}/records/create`}
              className="bg-[#ec7211] hover:bg-[#d35400] text-white text-[13px] font-bold px-4 py-1.5 rounded shadow-sm flex items-center gap-1.5"
            >
              <Plus size={14} /> Create record
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#fafafa] border-b border-[#eaeded]">
              <tr>
                <th className="px-4 py-2 w-10">
                  <input
                    type="checkbox"
                    className="rounded border-[#aab7b8]"
                    checked={records.length > 0 && selectedRecords.size === records.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-2 text-left text-[12px] font-bold text-[#16191f]">Record name</th>
                <th className="px-4 py-2 text-left text-[12px] font-bold text-[#16191f]">Type</th>
                <th className="px-4 py-2 text-left text-[12px] font-bold text-[#16191f]">Routing policy</th>
                <th className="px-4 py-2 text-left text-[12px] font-bold text-[#16191f]">Value/Route traffic to</th>
                <th className="px-4 py-2 text-left text-[12px] font-bold text-[#16191f]">TTL (seconds)</th>
                <th className="px-4 py-2 text-right text-[12px] font-bold text-[#16191f]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaeded]">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-[13px] text-[#545b64]">Loading...</td></tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <p className="text-[14px] font-bold text-[#16191f]">No records found</p>
                    <p className="text-[13px] text-[#545b64] mt-1">Create a record or adjust your filters.</p>
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-[#f2f3f3]">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-[#aab7b8]"
                        checked={selectedRecords.has(record.id)}
                        onChange={() => toggleSelect(record.id)}
                      />
                    </td>
                    <td className="px-4 py-3 text-[13px] font-medium text-[#16191f]">{record.name}</td>
                    <td className="px-4 py-3 text-[13px] text-[#16191f]">
                      <span className="bg-[#f2f3f3] border border-[#eaeded] rounded px-1.5 py-0.5 text-[12px] font-mono">{record.type}</span>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#545b64]">{record.routing_policy}</td>
                    <td className="px-4 py-3 text-[13px] text-[#545b64] max-w-[300px] truncate font-mono">{record.value}</td>
                    <td className="px-4 py-3 text-[13px] text-[#545b64]">{record.ttl}</td>
                    <td className="px-4 py-3 text-right space-x-1">
                      <button
                        onClick={() => openEdit(record)}
                        className="p-1.5 border border-[#d5dbdb] bg-white text-[#545b64] hover:text-[#16191f] hover:bg-[#fafafa] rounded shadow-sm inline-flex"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(record)}
                        className="p-1.5 border border-[#d5dbdb] bg-white text-[#d13212] hover:bg-[#fafafa] rounded shadow-sm inline-flex"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 border-t border-[#eaeded] bg-[#fafafa] flex items-center justify-between text-[13px] text-[#545b64]">
          <span>{total} record{total !== 1 ? "s" : ""}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 border border-[#d5dbdb] bg-white rounded hover:bg-[#fafafa] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[#16191f] font-medium">{page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 border border-[#d5dbdb] bg-white rounded hover:bg-[#fafafa] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Record Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete record"
        message={`Are you sure you want to delete the record "${deleteTarget?.name}" (${deleteTarget?.type})? This action cannot be undone.`}
        confirmLabel="Delete record"
      />

      {/* Bulk Delete Modal */}
      <ConfirmModal
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        loading={bulkDeleteLoading}
        title="Delete records"
        message={`Are you sure you want to delete ${selectedRecords.size} selected record(s)? This action cannot be undone.`}
        confirmLabel={`Delete ${selectedRecords.size} record(s)`}
      />

      {/* Edit Record Modal */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit record"
        size="lg"
        footer={
          <>
            <button
              onClick={() => setEditTarget(null)}
              className="px-4 py-2 border border-[#d5dbdb] bg-white text-[#16191f] text-[13px] font-bold rounded hover:bg-[#fafafa] shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              disabled={editLoading}
              className="px-4 py-2 bg-[#ec7211] hover:bg-[#d35400] text-white text-[13px] font-bold rounded shadow-sm disabled:opacity-50"
            >
              {editLoading ? "Saving..." : "Save changes"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#16191f] mb-1">Record name <span className="text-[#d13212]">*</span></label>
              <input
                type="text"
                className="w-full border border-[#aab7b8] rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0073bb]"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#16191f] mb-1">Record type <span className="text-[#d13212]">*</span></label>
              <select
                className="w-full border border-[#aab7b8] rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0073bb] bg-white"
                value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
              >
                {["A", "AAAA", "CNAME", "TXT", "MX", "NS", "PTR", "SRV", "CAA"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#16191f] mb-1">Value <span className="text-[#d13212]">*</span></label>
            <textarea
              rows={3}
              className="w-full border border-[#aab7b8] rounded px-3 py-2 text-[13px] font-mono focus:outline-none focus:ring-1 focus:ring-[#0073bb]"
              value={editForm.value}
              onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#16191f] mb-1">TTL (seconds) <span className="text-[#d13212]">*</span></label>
              <input
                type="number"
                className="w-full border border-[#aab7b8] rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0073bb]"
                value={editForm.ttl}
                onChange={(e) => setEditForm({ ...editForm, ttl: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#16191f] mb-1">Routing policy <span className="text-[#d13212]">*</span></label>
              <select
                className="w-full border border-[#aab7b8] rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0073bb] bg-white"
                value={editForm.routing_policy}
                onChange={(e) => setEditForm({ ...editForm, routing_policy: e.target.value })}
              >
                {ROUTING_POLICIES.map((p) => <option key={p} value={p}>{p} routing</option>)}
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
