import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Flex,
  HStack,
  Heading,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaArrowLeft,
  FaBookOpen,
  FaHome,
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";
import { ColorModeSwitcher } from "../../components/utils/ColorModeSwitcher";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../providers/Auth/hooks";

interface Props {
  page?: "dashboard" | "student";
  children?: ReactNode;
}

const SidebarGlobal: React.FC<Props> = ({ page, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();
  const { deconnexion } = useAuth();

  const currentLink = page ? page : "dashboard";
  return (
    <>
      <Box
        backgroundColor={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
        w="100vw"
        h="100vh"
      >
        <HStack
          backgroundColor={useColorModeValue("white", "blackAlpha.500")}
          p={3}
          justifyContent="space-between"
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            aria-label=""
            icon={<FaBookOpen />}
            onClick={onOpen}
            variant="ghost"
          />
          <ColorModeSwitcher />
        </HStack>

        <Flex w="100%" h="100%" display={{ base: "none", md: "flex" }}>
          <Stack
            h="100%"
            w="240px"
            px={6}
            py={16}
            backgroundColor={useColorModeValue("white", "blackAlpha.500")}
            justify="space-between"
          >
            <Box position="absolute" right={0} top={0}>
              <ColorModeSwitcher />
            </Box>
            <Box>
              <Heading size="lg" mb={10}>
                IUSPM
              </Heading>

              <Heading
                color={useColorModeValue("blackAlpha.500", "whiteAlpha.500")}
                size="xs"
                mb={6}
              >
                MAIN MENU
              </Heading>
              <Button
                leftIcon={<FaHome />}
                justifyContent="start"
                width="100%"
                variant="ghost"
                borderRadius="10px"
                color={useColorModeValue(
                  currentLink === "dashboard" ? "black" : "blackAlpha.600",
                  currentLink === "dashboard" ? "white" : "whiteAlpha.600"
                )}
                backgroundColor={useColorModeValue(
                  currentLink === "dashboard" ? "gray.200" : "transparent",
                  currentLink === "dashboard" ? "gray.600" : "transparent"
                )}
                _hover={{
                  color: useColorModeValue("black", "white"),
                  backgroundColor: useColorModeValue("gray.200", "gray.600"),
                }}
                mb={2}
                onClick={() => {
                  onClose();
                  navigate("/dashboard");
                }}
              >
                DashBoard
              </Button>

              <Button
                leftIcon={<FaUsers />}
                justifyContent="start"
                width="100%"
                variant="ghost"
                borderRadius="10px"
                color={useColorModeValue(
                  currentLink === "student" ? "black" : "blackAlpha.600",
                  currentLink === "student" ? "white" : "whiteAlpha.600"
                )}
                backgroundColor={useColorModeValue(
                  currentLink === "student" ? "gray.200" : "transparent",
                  currentLink === "student" ? "gray.600" : "transparent"
                )}
                _hover={{
                  color: useColorModeValue("black", "white"),
                  backgroundColor: useColorModeValue("gray.200", "gray.600"),
                }}
                mb={2}
                onClick={() => {
                  onClose();
                  navigate("/student");
                }}
              >
                Student
              </Button>
            </Box>

            <Button
              leftIcon={<FaSignOutAlt />}
              justifyContent="start"
              width="100%"
              variant="ghost"
              borderRadius="10px"
              color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}
              _hover={{
                color: useColorModeValue("black", "white"),
                backgroundColor: useColorModeValue("red.200", "red.600"),
              }}
              mt={16}
              onClick={deconnexion}
            >
              Log out
            </Button>
          </Stack>
          <Box flexGrow={1}>{children}</Box>
        </Flex>
        <Box display={{ base: "block", md: "none" }}>{children}</Box>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
      >
        <DrawerContent>
          <DrawerHeader>
            <HStack justifyContent="space-between">
              <Text>IUSPM</Text>
              <IconButton
                aria-label=""
                icon={<FaArrowLeft />}
                variant="ghost"
                onClick={onClose}
              />
            </HStack>
          </DrawerHeader>
          <Divider />

          <Box pt={10} px={5}>
            <Heading
              color={useColorModeValue("blackAlpha.500", "whiteAlpha.500")}
              size="xs"
              mb={6}
            >
              MAIN MENU
            </Heading>
            <Button
              leftIcon={<FaHome />}
              justifyContent="start"
              width="100%"
              variant="ghost"
              borderRadius="10px"
              color={useColorModeValue(
                currentLink === "dashboard" ? "black" : "blackAlpha.600",
                currentLink === "dashboard" ? "white" : "whiteAlpha.600"
              )}
              backgroundColor={useColorModeValue(
                currentLink === "dashboard" ? "gray.200" : "transparent",
                currentLink === "dashboard" ? "gray.600" : "transparent"
              )}
              _hover={{
                color: useColorModeValue("black", "white"),
                backgroundColor: useColorModeValue("gray.200", "gray.600"),
              }}
              onClick={() => {
                onClose();
                navigate("/dashboard");
              }}
            >
              DashBoard
            </Button>

            <Button
              leftIcon={<FaUsers />}
              justifyContent="start"
              width="100%"
              variant="ghost"
              borderRadius="10px"
              color={useColorModeValue(
                currentLink === "student" ? "black" : "blackAlpha.600",
                currentLink === "student" ? "white" : "whiteAlpha.600"
              )}
              backgroundColor={useColorModeValue(
                currentLink === "student" ? "gray.200" : "transparent",
                currentLink === "student" ? "gray.600" : "transparent"
              )}
              _hover={{
                color: useColorModeValue("black", "white"),
                backgroundColor: useColorModeValue("gray.200", "gray.600"),
              }}
              onClick={() => {
                onClose();
                navigate("/student");
              }}
            >
              Student
            </Button>
          </Box>
          <DrawerFooter>
            <Button
              leftIcon={<FaSignOutAlt />}
              justifyContent="start"
              width="100%"
              variant="ghost"
              borderRadius="10px"
              color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}
              _hover={{
                color: useColorModeValue("black", "white"),
                backgroundColor: useColorModeValue("red.200", "red.600"),
              }}
              onClick={deconnexion}
            >
              Log out
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SidebarGlobal;
