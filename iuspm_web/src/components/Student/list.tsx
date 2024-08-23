import { useEffect, useState } from "react";
import { StudentSimple } from "../../models/student";
import useService from "../../providers/Service/hooks";
import { useLoading } from "../../utils/hooks";
import {
  Heading,
  IconButton,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  Link,
  useDisclosure,
  Center,
} from "@chakra-ui/react";
import { FaBookReader } from "react-icons/fa";
import { FormStudentRN } from "./form";
import { Link as LinkRouter } from "react-router-dom";

const StudentList = () => {
  const [students, setStudents] = useState<StudentSimple[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentStudent, setCurrentStudent] = useState<StudentSimple | null>(
    null
  );

  // chargement du service
  const { base } = useService();
  // etat de chargement des réponses
  const { setLoading, loading } = useLoading();

  useEffect(() => {
    setLoading(true);
    base
      .getStudents()
      .then((data) => {
        setStudents(data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {};
  }, [base, setLoading]);

  if (loading) {
    return (
      <>
        <VStack>
          <Spinner />
          <Heading textAlign="center">Loading</Heading>
        </VStack>
      </>
    );
  }

  if (students.length === 0) {
    return (
      <>
        <Center>
          <Text>Aucun étudiant a été trouvé</Text>
        </Center>
      </>
    );
  }

  return (
    <>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Matricule</Th>
              <Th>Noms et Prénoms</Th>
              <Th>Niveau</Th>
              <Th>Filière</Th>
              <Th>Options</Th>
            </Tr>
          </Thead>
          <Tbody>
            {students.map((st, i) => {
              return (
                <Tr key={i}>
                  <Td>
                    <Link as={LinkRouter} to={`/student/${st.uuid}`}>
                      {st.register}
                    </Link>
                  </Td>
                  <Td>{st.name}</Td>
                  <Td>{`Niveau ${st.level}`}</Td>
                  <Td>{`${st.sector}`}</Td>
                  <Td>
                    <IconButton
                      aria-label={"Releve" + i}
                      icon={<FaBookReader />}
                      onClick={() => {
                        setCurrentStudent(st);
                        onOpen();
                      }}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      {currentStudent ? (
        <FormStudentRN
          student={currentStudent}
          isOpen={isOpen}
          onClose={onClose}
          clearCurrentStudent={() => setCurrentStudent(null)}
        />
      ) : null}
    </>
  );
};

export default StudentList;
