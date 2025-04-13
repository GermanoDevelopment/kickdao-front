import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from "firebase/auth";
import { auth } from "../firebase";

export interface RegisterCredentials {
  email: string;
  password: string;
  fullname: string;
  cpf: string;
}

// Função para registrar um novo usuário
export const registerWithEmail = async (credentials: RegisterCredentials): Promise<User> => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
    console.log("Usuário registrado:", userCredentials.user);
    return userCredentials.user;
  } catch (error: any) {
    console.error("Erro ao registrar:", error.message);
    throw new Error(error.message);
  }
};

export interface LoginCredentials {
  email: string;
  password: string;
}

// Função para fazer login com email e senha
export const loginWithEmail = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    console.log("Usuário logado:", userCredential.user);
    return userCredential.user;
  } catch (error: any) {
    console.error("Erro ao fazer login:", error.message);
    throw new Error(error.message);
  }
};
