import React, { useState } from "react";
import FormField from "../../molecules/formfield";
import AnchorAtom from "../../atoms/anchor";
import FormOrganism from "../form";
import { LoginCredentials } from "../../../services/auth/auth.usecase";
import { FormFooter } from "../../molecules/formfooter";

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <FormOrganism
      onSubmit={handleSubmit}
      submitText="Continuar"
      footer={
        <div className="flex flex-col items-center gap-2">
          <AnchorAtom 
          className="hover:underline"
          text="Registre sua conta" href="/register" />
          <FormFooter />
        </div>
      }
    >
        <FormField
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <AnchorAtom text="Esqueci a senha" href="/register" 
        className="mb-4 text-slate-400 underline text-right"/>
    </FormOrganism>
  );
};

export default LoginForm;
