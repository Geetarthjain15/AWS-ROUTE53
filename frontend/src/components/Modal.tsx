"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Modal({ isOpen, onClose, title, children, footer, size = "md" }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = {
    sm: "max-w-[400px]",
    md: "max-w-[600px]",
    lg: "max-w-[800px]",
  }[size];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className={clsx("bg-white rounded shadow-xl w-full mx-4", sizeClass)}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#eaeded]">
          <h2 className="text-[18px] font-bold text-[#16191f]">{title}</h2>
          <button onClick={onClose} className="text-[#545b64] hover:text-[#16191f]">
            <X size={20} />
          </button>
        </div>
        {/* Body */}
        <div className="px-5 py-5">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 bg-[#f2f3f3] border-t border-[#eaeded] flex justify-end gap-3 rounded-b">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  danger?: boolean;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = "Delete", loading = false, danger = true }: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#d5dbdb] bg-white text-[#16191f] text-[13px] font-bold rounded hover:bg-[#fafafa] shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={clsx(
              "px-4 py-2 text-white text-[13px] font-bold rounded shadow-sm disabled:opacity-50",
              danger ? "bg-[#d13212] hover:bg-[#b22a0c]" : "bg-[#0073bb] hover:bg-[#006da3]"
            )}
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-[14px] text-[#16191f]">{message}</p>
    </Modal>
  );
}
