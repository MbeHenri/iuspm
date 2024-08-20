import React, { ReactNode, createContext } from "react";
import BaseService from "../../services/base";

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
  //const { user } = useAuth();

  const base = new BaseService();

  return (
    <ServiceContext.Provider value={{ base }}>
      {children}
    </ServiceContext.Provider>
  );
};

export default ServiceProvider;
