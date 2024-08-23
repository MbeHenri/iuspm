import { useCallback, useEffect, useState } from "react";
import Student from "../../..//models/student";
import useService from "../../../providers/Service/hooks";
import { useLoading } from "../../../utils/hooks";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Spinner,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { NoteSimple, Semester } from "../../../models/note";
import { FormStudentNote } from "./form";
import { copyMap } from "../../../utils/functions";
import StudentNoteTable from "./table";

interface Props {
  student: Student;
}

const StudentNoteList: React.FC<Props> = ({ student }) => {
  const [mapNotes, setMapNotes] = useState<Map<Semester, NoteSimple[]>>(
    new Map<Semester, NoteSimple[]>([
      [Semester.s1, []],
      [Semester.s2, []],
    ])
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentNote, setCurrentNote] = useState<NoteSimple | null>(null);

  // chargement du service
  const { base } = useService();
  // etat de chargement des réponses
  const { setLoading, loading } = useLoading();

  const loadNotes = useCallback(() => {
    setLoading(true);
    base
      .getStudentNotes(student)
      .then((data) => {
        setMapNotes(data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [base, setLoading, student]);

  useEffect(() => {
    loadNotes();
    return () => {};
  }, [loadNotes]);

  const updateMapNotes = useCallback(
    (note: NoteSimple) => {
      const new_notes = mapNotes.get(note.semester)?.map((e) => {
        if (e.id === note.id) {
          return note;
        }
        return e;
      });

      setMapNotes(copyMap(mapNotes).set(note.semester, new_notes ?? []));
    },
    [mapNotes]
  );

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

  return (
    <>
      {/*  <Heading>Notes</Heading> */}

      <Accordion defaultIndex={0}>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Semestre 1
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <StudentNoteTable
              notes={mapNotes.get(Semester.s1) ?? []}
              handleClickUpdateButtonOne={(note) => {
                setCurrentNote(note);
                onOpen();
              }}
            />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Semestre 2
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <StudentNoteTable
              notes={mapNotes.get(Semester.s2) ?? []}
              handleClickUpdateButtonOne={(note) => {
                setCurrentNote(note);
                onOpen();
              }}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {currentNote ? (
        <FormStudentNote
          student={student}
          isOpen={isOpen}
          clearCurrentNote={() => setCurrentNote(null)}
          note={currentNote}
          onClose={onClose}
          updateNotes={updateMapNotes}
        />
      ) : null}
    </>
  );
};

export default StudentNoteList;
