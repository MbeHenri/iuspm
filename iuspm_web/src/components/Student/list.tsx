import { useEffect, useState } from "react";
import StudentSimple from "../../models/student";
import useService from "../../providers/Service/hooks";
import { useLoading } from "../../utils/hooks";
import {
  Box,
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
  useDisclosure,
} from "@chakra-ui/react";
import { FaBookReader } from "react-icons/fa";
import { FormStudentRN } from "./form";

const StudentList = () => {
  const [students, setStudents] = useState<StudentSimple[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [curentStudent, setCurentStudent] = useState<StudentSimple | null>(
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
        <VStack mt="15vh">
          <Spinner />
          <Heading textAlign="center">Loading</Heading>
        </VStack>
      </>
    );
  }

  if (students.length === 0) {
    return (
      <>
        <VStack mt="15vh">
          <Text>No studentds found</Text>
        </VStack>
      </>
    );
  }

  return (
    <Box mt="15vh">
      <Heading as="h3" size="lg" marginBottom={"1rem"}>
        Etudiants
      </Heading>
      <TableContainer w={"100%"}>
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
                  <Td>{st.register}</Td>
                  <Td>{st.name}</Td>
                  <Td>{`Niveau ${st.level}`}</Td>
                  <Td>{`${st.sector}`}</Td>
                  <Td>
                    <IconButton
                      aria-label={"Releve" + i}
                      icon={<FaBookReader />}
                      onClick={() => {
                        setCurentStudent(st);
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
      <FormStudentRN
        currentStudent={curentStudent}
        isOpen={isOpen}
        onClose={onClose}
        setCurentStudent={setCurentStudent}
      />
    </Box>
  );
};

export default StudentList;
