import React, { useEffect, useRef } from 'react';
import { XIcon } from './Icons';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  isOpen?: boolean;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children, isOpen = true }) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (isOpen) {
      modal.showModal();
    } else {
      modal.close();
    }

    const handleClose = () => {
      onClose();
    };

    modal.addEventListener('close', handleClose);
    return () => {
      modal.removeEventListener('close', handleClose);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const modal = modalRef.current;
    if (modal && e.target === modal) {
      onClose();
    }
  };

  return (
    <dialog 
      ref={modalRef}
      className="modal modal-open"
      onClick={handleBackdropClick}
    >
      <div className="modal-box relative max-w-lg w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-base-content">{title}</h2>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            aria-label="Cerrar modal"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
};

export default Modal;