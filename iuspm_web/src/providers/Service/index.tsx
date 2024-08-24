import React, { ReactNode, createContext, useMemo } from "react";
import BaseService from "../../services/base";
import useAuth from "../Auth/hooks";

interface PropsContext {
  base: BaseService;
}
interface PropsProvider {
  children: ReactNode;
}

export const ServiceContext = createContext<PropsContext>({
  base: new BaseService(),
});
const ServiceProvider: React.FC<PropsProvider> = ({ children }) => {
  const { user } = useAuth();

  const base = useMemo(
    () => (user ? new BaseService(user) : new BaseService()),
    [user]
  );

  return (
    <ServiceContext.Provider value={{ base }}>
      {children}
    </ServiceContext.Provider>
  );
};

export default ServiceProvider;
