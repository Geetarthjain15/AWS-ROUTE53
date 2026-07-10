"use client";

import { create } from "zustand";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import clsx from "clsx";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 5000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

const icons = {
  success: <CheckCircle size={16} className="text-[#1d8348]" />,
  error: <XCircle size={16} className="text-[#c0392b]" />,
  info: <AlertCircle size={16} className="text-[#0073bb]" />,
};

const styles = {
  success: "border-l-4 border-[#1d8348] bg-[#eafaf1]",
  error: "border-l-4 border-[#c0392b] bg-[#fdf2f0]",
  info: "border-l-4 border-[#0073bb] bg-[#e8f4fb]",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  return (
    <div className="fixed top-14 right-4 z-[9999] space-y-2 w-[380px]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            "flex items-start gap-3 p-3 shadow-lg rounded bg-white border border-[#d5dbdb]",
            styles[toast.type]
          )}
        >
          <span className="flex-shrink-0 mt-0.5">{icons[toast.type]}</span>
          <p className="text-[13px] text-[#16191f] flex-1">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-700 flex-shrink-0">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
