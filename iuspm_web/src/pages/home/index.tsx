import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/dashboard", { replace: true });

    return () => {};
  }, [navigate]);

  return <></>;
};

export default Home;
