import React from "react";
import classNames from "classnames";

interface ButtonAtomProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "danger";
  size?: "fit" | "full";
  filled?: boolean;
  onClick: () => void;
}

const ButtonAtom: React.FC<ButtonAtomProps> = ({
  size = "fit",
  color = "primary",
  variant = "small",
  filled = true,
  className,
  // children,
  text,
  onClick,
  // ...props
}) => {
  const buttonClasses = classNames(
    "rounded-md font-semibold transition duration-300 focus:outline-none",
    {
      // Size
      "w-fit": size === "fit",
      "w-full": size === "full",
      
      // Variants
      "px-4 py-2 text-sm": variant === "small",
      "px-6 py-3 text-base": variant === "medium",
      "px-8 py-4 text-lg": variant === "large",

      // Colors (filled styles)
      "bg-blue-600 text-white hover:bg-blue-700": filled && color === "primary",
      "bg-gray-600 text-white hover:bg-gray-700": filled && color === "secondary",
      "bg-red-600 text-white hover:bg-red-700": filled && color === "danger",

      // Colors (outlined styles)
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-100":
        !filled && color === "primary",
      "border-2 border-gray-600 text-gray-600 hover:bg-gray-100":
        !filled && color === "secondary",
      "border-2 border-red-600 text-red-600 hover:bg-red-100":
        !filled && color === "danger",
    },
    className // Custom classes passed as props
  );

  return (
    <button onClick={ onClick } className={ buttonClasses }>
      { text }
    </button>
  );
};

export default ButtonAtom;
