import { useEffect, useState } from "react";
import Student from "../../models/student";
import useService from "../../providers/Service/hooks";
import { useLoading } from "../../utils/hooks";
import {
  Box,
  Heading,
  List,
  ListItem,
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
import { formatDate } from "../../utils/functions";

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
    <Box>
      <Tabs /* align='end' */>
        <TabList>
          <Tab>Détails</Tab>
          <Tab>Notes</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {/* <Heading>Informations de l'étudiant</Heading> */}

            <List spacing={2}>
              <ListItem>
                <Text as={"span"} fontWeight={"bold"}>
                  Matricule:
                </Text>
                {` ${student.register}`}
              </ListItem>
              <ListItem>
                <Text as={"span"} fontWeight={"bold"}>
                  Noms et Prenoms:
                </Text>
                {` ${student.name}`}
              </ListItem>
              <ListItem>
                <Text as={"span"} fontWeight={"bold"}>
                  Filière :
                </Text>
                {` ${student.sector.label}`}
              </ListItem>
              <ListItem>
                <Text as={"span"} fontWeight={"bold"}>
                  Niveau :
                </Text>
                {` ${student.level}`}
              </ListItem>
              <ListItem>
                <Text as={"span"} fontWeight={"bold"}>
                  Lieu de naissance :
                </Text>
                {` ${student.birthPlace}`}
              </ListItem>
              <ListItem>
                <Text as={"span"} fontWeight={"bold"}>
                  Date de naissance :
                </Text>
                {` ${formatDate(student.birthAt)}`}
              </ListItem>
              <ListItem>
                <Text as={"span"} fontWeight={"bold"}>
                  Date d'insertion :
                </Text>
                {` ${formatDate(student.insertedAt, true)}`}
              </ListItem>
            </List>
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
