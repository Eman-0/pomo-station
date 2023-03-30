import React from "react";
import { twMerge } from "tailwind-merge";
import Spinner from "./spinner";

type LoadingButtonProps = {
  isLoading: boolean;
  btnColor?: string;
  textColor?: string;
  children: React.ReactNode;
};

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  textColor = "text-white",
  btnColor = "bg-ct-blue-700",
  children,
  isLoading = false,
}) => {
  return (
    <button
      type="submit"
      className={twMerge(
        `w-full py-3 font-semibold ${btnColor} rounded-lg outline-none border-none flex justify-center`,
        isLoading && `${"bg-[#ccc]"}`
      )}
    >
      {isLoading ? (
        <div className="flex items-center gap-3">
          <Spinner />
          <span className="text-white inline-block">Loading...</span>
        </div>
      ) : (
        <span className={`text-lg font-normal ${textColor}`}>{children}</span>
      )}
    </button>
  );
};
