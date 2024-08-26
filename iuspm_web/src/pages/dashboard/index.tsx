import { Heading, VStack } from "@chakra-ui/react";
import SidebarGlobal from "../../components/SidebarGlobal";
import useAuth from "../../providers/Auth/hooks";

const DashBoardPage: React.FC = () => {
  const { user } = useAuth();
  return (
    <>
      <SidebarGlobal page="dashboard">
        <VStack h="100%" justify="center">
          <Heading>Bienvenu {user?.username} !!!</Heading>
        </VStack>
      </SidebarGlobal>
    </>
  );
};

export default DashBoardPage;
