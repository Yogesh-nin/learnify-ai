"use client";

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { Loader2, X } from "lucide-react";
import { DeleteIcon } from "../../../_components/icons/DeleteIcon";

export default function NoteDeleteModal({
  open,
  onClose,
  onConfirm,
  deleting = false,
}) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 p-2 rounded-full bg-surface hover:bg-surface-muted"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="bg-modal-banner flex justify-center items-center py-6">
                <DeleteIcon />
              </div>

              <div className="px-6 py-6">
                <DialogTitle className="text-[24px] font-bold text-modal-title mb-2 px-1">
                  Delete this note?
                </DialogTitle>
                <Description className="text-[18px] text-muted mb-6">
                  Are you sure you want to delete this note? This cannot be
                  undone.
                </Description>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={deleting}
                    className="btn btn-outline-primary w-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    disabled={deleting}
                    className="btn btn-error w-full flex items-center justify-center"
                  >
                    {deleting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
