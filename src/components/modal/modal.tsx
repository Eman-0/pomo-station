import ReactDom from "react-dom";
import type { FC } from "react";
import React from "react";

type IBreakModal = {
  openBreakModal: boolean;
  setOpenBreakModal: (open: boolean) => void;
  children: React.ReactNode;
};

const BreakModal: FC<IBreakModal> = ({
  openBreakModal,
  setOpenBreakModal,
  children,
}) => {
  if (!openBreakModal) return null;
  return ReactDom.createPortal(
    <>
      <div
        className="fixed inset-0 bg-[rgba(0,0,0,.5)] z-[1000]"
        onClick={() => setOpenBreakModal(false)}
      ></div>
      <div className="max-w-lg w-full rounded-md fixed top-[5%] xl:top-[10%] left-1/2 -translate-x-1/2 bg-white z-[1001] p-6">
        {children}
      </div>
    </>,
    document.getElementById("break-modal") as HTMLElement
  );
};

export default BreakModal;
