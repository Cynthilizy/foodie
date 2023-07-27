import { signInWithEmailAndPassword } from "firebase/auth";

export const LoginRequest = (auth, email, password) =>
  signInWithEmailAndPassword(auth, email, password);
