import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import { StudentSimple } from "../../models/student";
import useService from "../../providers/Service/hooks";
import { useLoading } from "../../utils/hooks";
import { FaArrowLeft } from "react-icons/fa";
import { Semester } from "../../models/note";

interface Props {
  student: StudentSimple;
  isOpen: boolean;
  clearCurrentStudent: () => void;
  onClose: () => void;
}

export const FormStudentRN: React.FC<Props> = ({
  student,
  isOpen,
  onClose,
  clearCurrentStudent,
}) => {
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const defaultYear = new Date().getFullYear();

  const [year, setYear] = useState<string>(`${defaultYear}`);
  const [errorYear, setErrorYear] = useState<string | null>(null);

  const handleChangeYear = useCallback((value: string) => {
    // Vérifie si l'entrée est un nombre et s'il est compris entre 1900 et l'année en cours
    setYear(value);
    if (/^\d{0,4}$/.test(value) && parseInt(value) >= 1900) {
      setErrorYear(null);
    } else {
      setErrorYear("Veuillez entrer une année valide supérieur à 1900.");
    }
  }, []);

  const [semester, setSemester] = useState<string>(``);
  const [url, setUrl] = useState("");

  // chargement du service
  const { base } = useService();
  // etat de chargement des réponses
  const { setLoading, loading } = useLoading();

  const handleSubmit = useCallback(() => {
    if (!errorYear) {
      setLoading(true);
      base
        .getRN(
          student,
          year,
          semester === ""
            ? null
            : parseInt(semester) === Semester.s1
            ? Semester.s1
            : Semester.s2
        )
        .then((data) => {
          setUrl(data);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    return () => {};
  }, [base, student, errorYear, semester, setLoading, year]);

  const clearVariable = useCallback(() => {
    if (!loading) {
      onClose();
      clearCurrentStudent();
    }
  }, [loading, onClose, clearCurrentStudent]);

  const validateBackgroundColor = useColorModeValue("black", "white");
  const validateColor = useColorModeValue("white", "black");
  const validateBackgroundColorHover = useColorModeValue(
    "blackAlpha.600",
    "whiteAlpha.600"
  );
  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={clearVariable}
        size={url === "" ? "sm" : "xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {url === "" ? (
              "Obtenir le relevé"
            ) : (
              <Button
                leftIcon={<FaArrowLeft />}
                variant="ghost"
                onClick={() => {
                  setUrl("");
                }}
              >
                Retour
              </Button>
            )}
          </ModalHeader>
          <ModalCloseButton />
          {url !== "" ? (
            <iframe
              src={url}
              style={{ display: "block" }}
              title="RN"
              width={"100%"}
              height={"800px"}
            />
          ) : (
            <>
              <ModalBody pb={6}>
                <FormControl isInvalid={errorYear ? true : false}>
                  <FormLabel>Année Académique (Début)</FormLabel>
                  <NumberInput
                    onChange={handleChangeYear}
                    value={year}
                    min={1900}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  {errorYear && (
                    <FormErrorMessage>{errorYear}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Semestre</FormLabel>
                  <Select
                    placeholder="Tous les deux semestres"
                    value={semester}
                    onChange={(e) => {
                      setSemester(e.target.value);
                    }}
                  >
                    <option value={`${Semester.s1}`}>Semestre 1</option>
                    <option value={`${Semester.s2}`}>Semestre 2</option>
                  </Select>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button
                  mr={3}
                  onClick={handleSubmit}
                  isLoading={loading}
                  backgroundColor={validateBackgroundColor}
                  color={validateColor}
                  _hover={{
                    backgroundColor: validateBackgroundColorHover,
                  }}
                >
                  Valider
                </Button>
                <Button onClick={clearVariable}>Annuler</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
