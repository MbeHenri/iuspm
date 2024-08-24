import React, { ReactNode, createContext, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth, UserRole } from "../../models/user";
import { useLocalStorage } from "../../utils/hooks";
import LoginService from "../../services/login";

interface PropsContext {
  user: UserAuth | null;
  role?: UserRole;
  connexion: (username: string, password: string) => Promise<void>;
  deconnexion: () => Promise<void>;
}
interface PropsProvider {
  children: ReactNode;
}

export const AuthContext = createContext<PropsContext>({
  user: null,
  connexion: async (username: string, password: string) => {},
  deconnexion: async () => {},
});
const AuthProvider: React.FC<PropsProvider> = ({ children }) => {
  // state for current user
  const { setValue, storedValue } = useLocalStorage<UserAuth | null>(
    "user",
    null
  );

  const user = useMemo(() => storedValue, [storedValue]);

  const role = useMemo(() => (user ? "manager" : undefined), [user]);

  const setUser = useCallback(setValue, [setValue]);
  const navigate = useNavigate();

  // login service
  const loginService = useMemo(() => new LoginService(), []);

  // cette fonction est la fontion permettant de se conneter
  const connexion = useCallback(
    async (username: string, password: string) =>
      loginService
        .connection(username, password)
        .then((token) => {
          setUser({
            username,
            token,
          });
          navigate("/", { replace: true });
        })
        .catch((e) => {
          console.log(e);
        }),
    [loginService, setUser, navigate]
  );

  // cette fonction est la fonction permettant de se déconnecter
  // il utilisera potentiellement l'API de deconnexion
  const deconnexion = useCallback(async () => {
    setUser(null);
    navigate("/login", { replace: true });
  }, [setUser, navigate]);

  return (
    <AuthContext.Provider value={{ user, connexion, deconnexion, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
