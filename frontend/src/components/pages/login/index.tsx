import React from "react";
import FormViewTemplate from "../../templates/formview";
import LoginForm from "../../organisms/loginform";
import { LoginCredentials, loginWithEmail } from "../../../services/auth/auth.usecase";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (credentials: LoginCredentials) => {
    try {
      loginWithEmail(credentials);
      console.log("Login with: ", credentials.email);
      navigate("/home");
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  return (
    <FormViewTemplate>
      <LoginForm onLogin={ handleLogin } />
    </FormViewTemplate>
  );
};

export default LoginPage;
