import React from "react";
import BreadcrumbItemAtom from "../../atoms/breadcrumbitem";

interface BreadcrumbsProps {
  items: { label: string; href?: string }[]; // Lista de itens
  separator?: React.ReactNode; // Separador (ícone ou símbolo)
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = "/",
}) => {
  return (
    <nav aria-label="breadcrumb" className="flex items-center space-x-2">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <BreadcrumbItemAtom
            label={item.label}
            href={item.href}
            isActive={index === items.length - 1} // Último item é o ativo
          />
          {index < items.length - 1 && (
            <span className="text-gray-400">{separator}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
