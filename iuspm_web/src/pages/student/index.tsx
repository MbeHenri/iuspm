import { Box, Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";
import SidebarGlobal from "../../components/SidebarGlobal";
import StudentList from "../../components/Student/list";

const StudentPage = () => {
  return (
    <>
      <SidebarGlobal page="student">
        <Box p={8}>
          <Card>
            <CardHeader>
              <Heading size="md">Etudiants</Heading>
            </CardHeader>
            <CardBody>
              <StudentList />
            </CardBody>
          </Card>
        </Box>
      </SidebarGlobal>
    </>
  );
};

export default StudentPage;
