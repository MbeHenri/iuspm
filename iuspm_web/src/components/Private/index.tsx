import { Navigate } from "react-router-dom";
import useAuth from "../../providers/Auth/hooks";

interface Props {
  children?: React.ReactNode;
  isComponent?: boolean;
}

const Private: React.FC<Props> = ({ children, isComponent }) => {
  const { user } = useAuth();
  if (!user) {
    // if user isn't authenticated, redirect to login page
    return isComponent ? <></> : <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default Private;
