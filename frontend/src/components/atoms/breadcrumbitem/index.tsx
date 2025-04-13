import React from "react";
import classNames from "classnames";

interface BreadcrumbItemProps {
  label: string; // Nome do item
  href?: string; // URL (opcional)
  isActive?: boolean; // Define se é o item atual
}

const BreadcrumbItemAtom: React.FC<BreadcrumbItemProps> = ({ label, href, isActive = false }) => {
  const itemClasses = classNames(
    "text-sm",
    {
        "text-blue-600 hover:underline": href && !isActive,
        "text-gray-500 cursor-default": isActive,
    }
  );

  return href && !isActive ? (
    <a href={href} className={itemClasses}>
      {label}
    </a>
  ) : (
    <span className={itemClasses}>{label}</span>
  );
};

export default BreadcrumbItemAtom;
