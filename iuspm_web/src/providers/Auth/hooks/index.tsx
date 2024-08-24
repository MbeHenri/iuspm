import { useContext } from "react";
import { AuthContext } from "..";

export default function useAuth() {
  return useContext(AuthContext);
}
