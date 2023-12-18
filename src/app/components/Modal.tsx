import React, { useCallback, useRef } from "react";

import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageURL: string; // Define imageURL prop
  children: React.ReactNode;
  madeBy: string
}

export default function Modal({ isOpen, onClose, imageURL, children, madeBy }: ModalProps) {
  const overlay = useRef(null);
  const wrapper = useRef(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlay.current && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);


  return (
    <div ref={overlay} className="fixed z-50 left-0 right-0 top-0 bottom-0 mx-auto bg-black/80" onClick={handleClick}>
      <button type="button" onClick={onClose} className="absolute top-0 right-8 text-white">
        <X size={32} color="white" />
      </button>
      <div ref={wrapper} className="flex justify-start items-center flex-col absolute h-[95%] md:w-full md:mx-auto md:left-0 md:right-0 w-full bottom-0 bg-white rounded-t-3xl lg:px-40 px-8 pt-14 pb-20 overflow-auto">
        {children}
      </div>
    </div>
  );
}
