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
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import StudentSimple from "../../models/student";
import useService from "../../providers/Service/hooks";
import { useLoading } from "../../utils/hooks";
import { FaArrowLeft } from "react-icons/fa";

interface Props {
  currentStudent: StudentSimple | null;
  isOpen: boolean;
  setCurentStudent: React.Dispatch<React.SetStateAction<StudentSimple | null>>;
  onClose: () => void;
}

export const FormStudentRN: React.FC<Props> = ({
  currentStudent,
  isOpen,
  onClose,
  setCurentStudent,
}) => {
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState<string>(`${new Date().getFullYear()}`);
  const [errorYear, setErrorYear] = useState<string | null>(null);

  const handleChangeYear = useCallback(
    (value: string) => {
      // Vérifie si l'entrée est un nombre et s'il est compris entre 1900 et l'année en cours

      setYear(value);
      if (
        /^\d{0,4}$/.test(value) &&
        ((parseInt(value) >= 1900 && parseInt(value) <= currentYear) ||
          value === "")
      ) {
        setErrorYear(null);
      } else {
        setErrorYear(
          "Veuillez entrer une année valide entre 1900 et l'année en cours."
        );
      }
    },
    [currentYear]
  );

  const [semester, setSemester] = useState<string>(``);
  const [url, setUrl] = useState("");

  const clearVariable = useCallback(() => {
    onClose();
    setCurentStudent(null);
    setSemester("");
    setYear(`${currentYear}`);
    setUrl("");
  }, [currentYear, onClose, setCurentStudent]);

  // chargement du service
  const { base } = useService();
  // etat de chargement des réponses
  const { setLoading, loading } = useLoading();

  const handleSubmit = useCallback(() => {
    if (currentStudent) {
      if (!errorYear) {
        setLoading(true);
        base
          .getRN(
            currentStudent,
            year,
            semester === "" ? null : semester === "1" ? "1" : "2"
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
    }
    return () => {};
  }, [base, currentStudent, errorYear, semester, setLoading, year]);

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
                  <FormLabel>Année</FormLabel>
                  <NumberInput
                    onChange={handleChangeYear}
                    value={year}
                    min={1900}
                    max={currentYear}
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
                    <option value="1">Semestre 1</option>
                    <option value="2">Semestre 2</option>
                  </Select>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={handleSubmit}
                  isLoading={loading}
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
