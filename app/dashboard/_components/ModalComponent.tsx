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
          <div className="fixed inset-0 bg-black/40" />
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
            <DialogPanel className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-xl text-center overflow-hidden">
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-3 top-3 p-2 rounded-full bg-white hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Top Banner */}
              {icon && (
                <div className="bg-[#FAEFE6] flex justify-center items-center py-6">
                  {icon}
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-6">
                <DialogTitle className="text-[24px] font-bold text-[#1A1A1A] mb-2 px-1">
                  {title}
                </DialogTitle>

                <Description className="text-[18px] text-[#707070] mb-6">
                  {description}
                </Description>

                {/* Actions */}
                <div className="flex gap-3">
                  {actions?.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={action.onClick}
                      className={`w-full rounded-xl py-3 text-[16px] font-semibold flex items-center justify-center
                        ${
                          action.variant === "outlined"
                            ? "bg-[conic-gradient(#FFE8CCAD)] text-[#C88D4A] border border-[#E6E6E6] hover:bg-gray-50"
                            : "bg-[conic-gradient(from_0deg,_#CA924E,_#CF8C3A)] text-white hover:bg-[#C88D4A]"
                        }
                      `}
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