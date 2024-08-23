import { useEffect, useState } from "react";
import Student from "../../models/student";
import useService from "../../providers/Service/hooks";
import { useLoading } from "../../utils/hooks";
import {
  Box,
  HStack,
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import StudentNoteList from "./Note/list";

interface Props {
  uuid: string;
}

const StudentDetail: React.FC<Props> = ({ uuid }) => {
  const [student, setStudent] = useState<Student | null>(null);

  const navigate = useNavigate();
  // chargement du service
  const { base } = useService();
  // etat de chargement des réponses
  const { setLoading, loading } = useLoading();

  useEffect(() => {
    setLoading(true);
    base
      .getStudent(uuid)
      .then((data) => setStudent(data))
      .catch((e) => {
        console.log(e);
        navigate("*");
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {};
  }, [base, navigate, setLoading, uuid]);

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

  if (!student) {
    return (
      <>
        <VStack mt="15vh">
          <Text>Student not found</Text>
        </VStack>
      </>
    );
  }

  return (
    <Box mt="15vh">
      <Tabs /* align='end' */>
        <TabList>
          <Tab>Détails</Tab>
          <Tab>Notes</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {/* <Heading>Informations de l'étudiant</Heading> */}

            <HStack>
              <Text>Matricule : </Text>
              <Text>{student.register}</Text>
            </HStack>
            <HStack>
              <Text>Noms et Prenoms : </Text>
              <Text>{student.name}</Text>
            </HStack>
            <HStack>
              <Text>Filière : </Text>
              <Text>{student.sector.label}</Text>
            </HStack>
            <HStack>
              <Text>Niveau : </Text>
              <Text>{student.level}</Text>
            </HStack>
            <HStack>
              <Text>Lieu de naissance : </Text>
              <Text>{student.birthPlace}</Text>
            </HStack>
            <HStack>
              <Text>Date de naissance : </Text>
              <Text>{`${student.birthAt}`}</Text>
            </HStack>
            <HStack>
              <Text>Date d'insertion : </Text>
              <Text>{`${student.insertedAt}`}</Text>
            </HStack>
          </TabPanel>
          <TabPanel>
            <StudentNoteList student={student} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default StudentDetail;
