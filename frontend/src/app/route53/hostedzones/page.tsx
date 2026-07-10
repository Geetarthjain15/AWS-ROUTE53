"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/utils/api";
import { Search, Plus, Trash2, Pencil, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Modal, ConfirmModal } from "@/components/Modal";
import { useToastStore } from "@/components/Toast";

interface HostedZone {
  id: string;
  name: string;
  type: string;
  record_count: number;
  comment?: string;
  created_at: string;
}

const PAGE_SIZE = 10;

export default function HostedZonesPage() {
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<HostedZone | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Edit modal
  const [editTarget, setEditTarget] = useState<HostedZone | null>(null);
  const [editComment, setEditComment] = useState("");
  const [editType, setEditType] = useState("Public");
  const [editLoading, setEditLoading] = useState(false);

  const { addToast } = useToastStore();

  const fetchZones = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * PAGE_SIZE;
      const res = await api.get(`/zones/?search=${search}&skip=${skip}&limit=${PAGE_SIZE}`);
      setZones(res.data);
      // Get total count for pagination
      const countRes = await api.get(`/zones/?search=${search}&skip=0&limit=9999`);
      setTotal(countRes.data.length);
    } catch (err) {
      addToast("Failed to load hosted zones", "error");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { fetchZones(); }, [fetchZones]);
  useEffect(() => { setPage(1); }, [search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/zones/${deleteTarget.id}`);
      addToast(`Hosted zone "${deleteTarget.name}" deleted successfully.`, "success");
      setDeleteTarget(null);
      fetchZones();
    } catch {
      addToast("Failed to delete hosted zone.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEdit = (zone: HostedZone) => {
    setEditTarget(zone);
    setEditComment(zone.comment || "");
    setEditType(zone.type);
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    setEditLoading(true);
    try {
      await api.put(`/zones/${editTarget.id}`, {
        name: editTarget.name,
        type: editType,
        comment: editComment,
      });
      addToast(`Hosted zone "${editTarget.name}" updated successfully.`, "success");
      setEditTarget(null);
      fetchZones();
    } catch {
      addToast("Failed to update hosted zone.", "error");
    } finally {
      setEditLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-[1100px] mx-auto text-[#16191f]">
      {/* Breadcrumbs */}
      <div className="mb-3 text-[13px]">
        <span className="text-[#0073bb] cursor-pointer hover:underline">Route 53</span>
        <span className="mx-2 text-gray-400">›</span>
        <span className="text-gray-500">Hosted zones</span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[24px] font-bold">Hosted zones</h1>
        <Link
          href="/route53/hostedzones/create"
          className="bg-[#ec7211] hover:bg-[#d35400] text-white px-4 py-2 rounded text-[13px] font-bold flex items-center shadow-sm"
        >
          <Plus size={16} className="mr-2" />
          Create hosted zone
        </Link>
      </div>

      <div className="bg-white border border-[#eaeded] shadow-sm rounded">
        {/* Table Toolbar */}
        <div className="px-4 py-3 border-b border-[#eaeded] flex flex-wrap gap-3 items-center justify-between bg-[#fafafa]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-[#545b64]" />
            </div>
            <input
              type="text"
              placeholder="Search hosted zones by name"
              className="pl-9 pr-4 block w-[300px] text-[13px] border border-[#aab7b8] rounded h-8 focus:outline-none focus:ring-1 focus:ring-[#0073bb] focus:border-[#0073bb]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={fetchZones} className="p-1.5 border border-[#d5dbdb] bg-white rounded hover:bg-[#fafafa] shadow-sm">
            <RefreshCw size={14} className="text-[#545b64]" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#fafafa] border-b border-[#eaeded]">
              <tr>
                <th className="px-4 py-2 text-left text-[12px] font-bold text-[#16191f]">Domain name</th>
                <th className="px-4 py-2 text-left text-[12px] font-bold text-[#16191f]">Type</th>
                <th className="px-4 py-2 text-left text-[12px] font-bold text-[#16191f]">Record count</th>
                <th className="px-4 py-2 text-left text-[12px] font-bold text-[#16191f]">Description</th>
                <th className="px-4 py-2 text-right text-[12px] font-bold text-[#16191f]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaeded]">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-[13px] text-[#545b64]">Loading...</td></tr>
              ) : zones.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <p className="text-[14px] font-bold text-[#16191f]">No hosted zones</p>
                    <p className="text-[13px] text-[#545b64] mt-1">Create a hosted zone to get started.</p>
                  </td>
                </tr>
              ) : (
                zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-[#f2f3f3]">
                    <td className="px-4 py-3 text-[13px] text-[#0073bb] font-medium">
                      <Link href={`/route53/hostedzones/${zone.id}`} className="hover:underline">{zone.name}</Link>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#16191f]">{zone.type}</td>
                    <td className="px-4 py-3 text-[13px] text-[#16191f]">{zone.record_count}</td>
                    <td className="px-4 py-3 text-[13px] text-[#545b64] max-w-xs truncate">{zone.comment || "—"}</td>
                    <td className="px-4 py-3 text-right space-x-1">
                      <button
                        onClick={() => openEdit(zone)}
                        className="p-1.5 text-[#545b64] hover:text-[#16191f] border border-[#d5dbdb] bg-white hover:bg-[#fafafa] rounded shadow-sm inline-flex"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(zone)}
                        className="p-1.5 text-[#d13212] hover:text-[#b22a0c] border border-[#d5dbdb] bg-white hover:bg-[#fafafa] rounded shadow-sm inline-flex"
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
          <span>{total} hosted zone{total !== 1 ? "s" : ""}</span>
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

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete hosted zone"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone and will delete all records within the zone.`}
        confirmLabel="Delete hosted zone"
      />

      {/* Edit Modal */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit hosted zone"
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
          <div>
            <label className="block text-[13px] font-bold text-[#16191f] mb-1">Domain name</label>
            <p className="text-[13px] text-[#545b64] bg-[#f2f3f3] border border-[#eaeded] rounded px-3 py-2">
              {editTarget?.name}
            </p>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#16191f] mb-1">Type</label>
            <select
              className="w-full border border-[#aab7b8] rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0073bb]"
              value={editType}
              onChange={(e) => setEditType(e.target.value)}
            >
              <option value="Public">Public hosted zone</option>
              <option value="Private">Private hosted zone</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#16191f] mb-1">Description</label>
            <textarea
              rows={3}
              className="w-full border border-[#aab7b8] rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0073bb]"
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              placeholder="Optional description"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
