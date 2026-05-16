"use client";

import { Description, Dialog, DialogDescription, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { X, Loader2 } from "lucide-react";

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: "contained" | "outlined";
  isLoading?: boolean;
}

interface GenericModalProps {
  open: boolean;
  onClose: () => void;
  icon?: React.ReactNode;
  title: string;
  description: string;
  actions: ModalAction[];
}

export default function GenericModal({
  open,
  onClose,
  icon,
  title,
  description,
  actions,
}: GenericModalProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        
        {/* Overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-overlay" />
        </TransitionChild>

        {/* Modal Container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95 translate-y-2"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-2"
          >
            <DialogPanel className="relative w-full max-w-[420px] bg-surface rounded-2xl shadow-xl text-center overflow-hidden">
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-3 top-3 p-2 rounded-full bg-surface hover:bg-surface-muted"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Top Banner */}
              {icon && (
                <div className="bg-modal-banner flex justify-center items-center py-6">
                  {icon}
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-6">
                <DialogTitle className="text-[24px] font-bold text-modal-title mb-2 px-1">
                  {title}
                </DialogTitle>

                <Description className="text-[18px] text-muted mb-6">
                  {description}
                </Description>

                {/* Actions */}
                <div className="flex gap-3">
                  {actions?.map((action, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={action.onClick}
                      disabled={action.isLoading}
                      className={`btn w-full flex items-center justify-center ${
                        action.variant === "outlined"
                          ? "btn-outline-primary"
                          : "btn-primary"
                      }`}
                    >
                      {action.isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        action.label
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}