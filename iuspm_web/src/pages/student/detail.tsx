import { useParams } from "react-router-dom";
import StudentDetail from "../../components/Student/detail";
import SidebarGlobal from "../../components/SidebarGlobal";
import { Box, Card, CardBody } from "@chakra-ui/react";

const StudentDetailPage = () => {
  const { uuid } = useParams<Record<string, string>>();
  return (
    <>
      <SidebarGlobal page="student">
        <Box p={8}>
          <Card>
            <CardBody>
              <StudentDetail uuid={uuid ?? ""} />
            </CardBody>
          </Card>
        </Box>
      </SidebarGlobal>
    </>
  );
};

export default StudentDetailPage;
