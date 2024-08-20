import { useContext } from "react";
import { ServiceContext } from ".";

export default function useService() {
  return useContext(ServiceContext);
}
