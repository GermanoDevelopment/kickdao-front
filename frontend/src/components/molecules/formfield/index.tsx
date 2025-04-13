import React from "react";
import InputAtom from "../../atoms/input";

interface FormFieldMoleculeProps {
  label?: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormFieldMolecule: React.FC<FormFieldMoleculeProps> = ({ label, type, placeholder, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">{label}</label>
      <InputAtom type={type} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
};

export default FormFieldMolecule;
