import { Navigate } from "react-router-dom";
import useAuth from "../../providers/Auth/hooks";

interface Props {
  children?: React.ReactNode;
  isComponent?: boolean;
}

const PrivateRev: React.FC<Props> = ({ children, isComponent }) => {
  const { user } = useAuth();
  if (user) {
    // if user isn't authenticated, redirect to home page
    return isComponent ? <></> : <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default PrivateRev;
