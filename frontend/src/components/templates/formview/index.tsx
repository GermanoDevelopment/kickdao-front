import React from "react";

interface FormViewTemplateProps {
  children: React.ReactNode;
}

const FormViewTemplate: React.FC<FormViewTemplateProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="relative w-full max-w-md p-8 border-2 rounded-[24px] bg-neutral">
        <h1 className="text-4xl text-primary font-bold mb-6 text-center">Kick DAO</h1>
        {children}
      </div>
    </div>
  );
};

export default FormViewTemplate;
