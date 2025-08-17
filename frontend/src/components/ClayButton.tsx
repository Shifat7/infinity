import React from "react";

interface ClayButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const ClayButton: React.FC<ClayButtonProps> = ({
  children,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-6 rounded-2xl text-xl font-bold text-foreground transition-all duration-200 puffy-shadow active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
};

export default ClayButton;
