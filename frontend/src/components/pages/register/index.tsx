import React from "react";
import FormViewTemplate from "../../templates/formview";
import RegisterForm from "../../organisms/registerform";
import { RegisterCredentials, registerWithEmail } from "../../../services/auth/auth.usecase";
import { Link } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const handleRegister = (credentials: RegisterCredentials) => {
    // console.log("Registering: ", credentials);
    registerWithEmail(credentials);
  };

  return (
    <FormViewTemplate>
      <RegisterForm onRegister={ handleRegister } />
      {/* Ícone de seta para trás */}
      <Link
          to="/"
          className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          aria-label="Voltar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </Link>
    </FormViewTemplate>
  );
};

export default RegisterPage;
