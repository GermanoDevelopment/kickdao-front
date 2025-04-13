import React from "react";
import classNames from "classnames";
import ButtonAtom from "../../atoms/button";
import ImageAtom from "../../atoms/image";

interface IconButtonProps {
  text?: string;
  variant?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "danger";
  size?: "fit" | "full";
  filled?: boolean;
  onClick: () => void;
  icon: string;
  alt: string;
  iconPosition?: "start" | "end";
  iconClassName?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  text,
  size,
  filled,
  variant,
  icon,
  alt,
  iconPosition = "start",
  iconClassName,
}) => {
  const wrapperClasses = classNames("flex items-center gap-2", {
    // Icon position
    "flex-row": iconPosition === "start",
    "flex-row-reverse": iconPosition === "end",
  });

  const iconClasses = classNames(
    "w-6 h-6",
    iconClassName
  );

  return (
     <ButtonAtom 
      text={ text }
      size={ size }
      filled={ filled }
      variant={ variant }
      onClick={ () => {} }>
      <span className={ wrapperClasses }>
        <ImageAtom src={icon} alt={alt} className={ iconClasses } />
      </span>
    </ButtonAtom>
  );
};

export default IconButton;
