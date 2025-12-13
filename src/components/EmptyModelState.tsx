import React from "react";

interface EmptyModelStateProps {
  message?: string;
  previewSrc?: string; // optional preview image path
  className?: string;
}

export const EmptyModelState: React.FC<EmptyModelStateProps> = ({
  message = "Set VITE_MODEL_URL to load a model",
  previewSrc,
  className = "",
}) => {
  return (
    <div className={`relative flex items-center justify-center w-full h-full ${className}`}>
      {previewSrc ? (
        <img
          src={previewSrc}
          alt="Model preview"
          className="max-w-full max-h-full object-contain opacity-90"
        />
      ) : (
        <div className="text-sm opacity-70 px-4 py-2 rounded border border-white/10">
          {message}
        </div>
      )}
    </div>
  );
};

export default EmptyModelState;

