import { useParams } from "react-router-dom";
import StudentDetail from "../../components/Student/detail";

const StudentDetailPage = () => {
    const { uuid } = useParams<Record<string, string>>();
  return (
    <>
      <StudentDetail uuid={uuid ?? ""} />
    </>
  );
};

export default StudentDetailPage;
