import {
  IconButton,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { NoteSimple } from "../../../models/note";
import { FaStickyNote } from "react-icons/fa";

interface Props {
  notes: NoteSimple[];
  handleClickUpdateButtonOne: (note: NoteSimple) => void;
}

const StudentNoteTable: React.FC<Props> = ({
  notes,
  handleClickUpdateButtonOne,
}) => {
  return (
    <>
      {notes.length === 0 ? (
        <Text>Aucun UE programmé </Text>
      ) : (
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>UE</Th>
                <Th>EC</Th>
                <Th>CC / 20</Th>
                <Th>EF / 20</Th>
                <Th>SN/R</Th>
                <Th>Options</Th>
              </Tr>
            </Thead>
            <Tbody>
              {notes.map((note, i) => {
                return (
                  <Tr key={i}>
                    <Td>
                      <Tooltip
                        label={note.ec.ue.label}
                        aria-label="A tooltip 1"
                      >
                        {note.ec.ue.code}
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip
                        label={
                          note.ec.ue.code === note.ec.code
                            ? undefined
                            : note.ec.label
                        }
                        aria-label="A tooltip 2"
                      >
                        {note.ec.ue.code === note.ec.code
                          ? "------"
                          : note.ec.code}
                      </Tooltip>
                    </Td>
                    <Td>{note.cc ?? "----"}</Td>
                    <Td>{note.ef ?? "----"}</Td>
                    <Td>
                      {note.isNormal !== null ? (
                        <Tag
                          borderRadius="full"
                          colorScheme={note.isNormal ? "green" : "red"}
                        >
                          {note.isNormal ? "yes" : "no"}
                        </Tag>
                      ) : (
                        "-----"
                      )}
                    </Td>
                    <Td>
                      <IconButton
                        icon={<FaStickyNote />}
                        onClick={() => handleClickUpdateButtonOne(note)}
                        aria-label="update-note"
                      />
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default StudentNoteTable;
