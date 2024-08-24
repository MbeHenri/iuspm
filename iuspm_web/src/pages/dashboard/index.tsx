import { Heading, VStack } from "@chakra-ui/react";
import SidebarGlobal from "../../components/SidebarGlobal";

const DashBoardPage: React.FC = () => {
  return (
    <>
      <SidebarGlobal page="dashboard">
        <VStack h="100%" justify="center">
          <Heading>Welcome Manager !!!</Heading>
        </VStack>
      </SidebarGlobal>
    </>
  );
};

export default DashBoardPage;
