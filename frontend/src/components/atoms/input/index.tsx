import React from "react";

interface InputAtomProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputAtom: React.FC<InputAtomProps> = ({ type, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border rounded-md p-2 w-full"
    />
  );
};

export default InputAtom;
