import React from "react";
import ButtonAtom from "../../atoms/button";

interface FormOrganismProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  submitText: string;
  footer?: React.ReactNode;
}

const FormOrganism: React.FC<FormOrganismProps> = ({ onSubmit, children, submitText, footer }) => {
  return (
    <form onSubmit={onSubmit} className="relative flex flex-col p-6">
      { children }
      <ButtonAtom size="full" text={submitText} onClick={() => {}} color="primary" />
      { footer && <div className="mt-4">{ footer }</div>}
    </form>
  );
};

export default FormOrganism;
