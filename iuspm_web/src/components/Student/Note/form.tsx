import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import Student from "../../../models/student";
import useService from "../../../providers/Service/hooks";
import { useLoading } from "../../../utils/hooks";
import { NoteSimple } from "../../../models/note";

interface Props {
  student: Student;
  isOpen: boolean;
  note: NoteSimple;
  clearCurrentNote: () => void;
  onClose: () => void;
  updateNotes?: (note: NoteSimple) => void;
}

export const FormStudentNote: React.FC<Props> = ({
  student,
  isOpen,
  onClose,
  note,
  clearCurrentNote,
  updateNotes,
}) => {
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  // note de CC
  const [CC, setCC] = useState<string>(`${note.cc ?? "0"}`);
  const [errorCC, setErrorCC] = useState<string | null>(null);

  const handleChangeCC = useCallback((value: string) => {
    setCC(value);
    if (value !== "" && parseFloat(value) >= 0 && parseFloat(value) <= 20) {
      setErrorCC(null);
    } else {
      setErrorCC("Veuillez entrer une note comprise entre 0 et 20");
    }
  }, []);

  // note de EF
  const [EF, setEF] = useState<string>(`${note.ef ?? "0"}`);
  const [errorEF, setErrorEF] = useState<string | null>(null);

  const handleChangeEF = useCallback((value: string) => {
    setEF(value);
    if (value !== "" && parseFloat(value) >= 0 && parseFloat(value) <= 20) {
      setErrorEF(null);
    } else {
      setErrorEF("Veuillez entrer une note comprise entre 0 et 20");
    }
  }, []);

  // Indicateur de SN ou de rattrapage
  const [isNormal, setIsNormal] = useState(
    `${note.isNormal !== null ? (note.isNormal ? "1" : "0") : "1"}`
  );

  // chargement du service
  const { base } = useService();
  // etat de chargement des réponses
  const { setLoading, loading } = useLoading();

  const handleSubmit = useCallback(() => {
    if (!errorCC && !errorEF) {
      const newNote = {
        ...note,
        cc: parseFloat(CC),
        ef: parseFloat(EF),
        isNormal: isNormal === "1",
      };

      setLoading(true);
      base
        .updateStudentNote(newNote, student)
        .then((data) => {
          // on met à jour la liste des notes
          updateNotes && updateNotes(data);
          // on ferme le formulaire
          clearCurrentNote();
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => setLoading(false));
    }
  }, [
    CC,
    EF,
    base,
    clearCurrentNote,
    errorCC,
    errorEF,
    isNormal,
    note,
    setLoading,
    student,
    updateNotes,
  ]);

  const clearVariable = useCallback(() => {
    if (!loading) {
      onClose();
      clearCurrentNote();
    }
  }, [clearCurrentNote, loading, onClose]);

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={clearVariable}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {note.uuid ? "Modifier la note" : "Donner la note"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={errorCC ? true : false} pb={6}>
              <FormLabel>Note de CC</FormLabel>
              <NumberInput
                onChange={handleChangeCC}
                value={CC}
                min={0}
                max={20}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {errorCC && <FormErrorMessage>{errorCC}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={errorEF ? true : false} pb={6}>
              <FormLabel>Note de EF</FormLabel>
              <NumberInput
                onChange={handleChangeEF}
                value={EF}
                min={0}
                max={20}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {errorEF && <FormErrorMessage>{errorEF}</FormErrorMessage>}
            </FormControl>

            <RadioGroup
              defaultValue={isNormal}
              onChange={(value) => setIsNormal(value)}
            >
              <HStack spacing={5}>
                <Radio colorScheme="green" value="1">
                  Session Normale
                </Radio>
                <Radio colorScheme="red" value="0">
                  Rattrapage
                </Radio>
              </HStack>
            </RadioGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              backgroundColor={useColorModeValue("black", "white")}
              color={useColorModeValue("white", "black")}
              _hover={{
                backgroundColor: useColorModeValue(
                  "blackAlpha.600",
                  "whiteAlpha.600"
                ),
              }}
              mr={3}
              onClick={handleSubmit}
              isLoading={loading}
            >
              Valider
            </Button>
            <Button onClick={clearVariable}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
