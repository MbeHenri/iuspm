import {
  Box,
  HStack,
  Heading,
  Img,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import image from "../../assets/img/logo.png";
import LoginForm from "../../components/Login/form";
import { ColorModeSwitcher } from "../../components/utils/ColorModeSwitcher";

const LoginPage: React.FC = () => {
  return (
    <>
      <Box
        backgroundColor={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
        w="100vw"
        h="100vh"
      >
        <HStack justifyContent={"end"} w="100%" h="100%" p={5}>
          <VStack display={{ base: "none", md: "flex" }} flexGrow={1}>
            <Img src={image} w="450px" p={16} />
          </VStack>
          <VStack
            backgroundColor={useColorModeValue("white", "blackAlpha.500")}
            w={{ base: "100%", md: "588px" }}
            h="100%"
            borderRadius={20}
            position={"relative"}
            px={12}
            pt="15rem"
          >
            <ColorModeSwitcher position={"absolute"} right={0} top={0} />
            <Heading fontSize="3xl" textAlign="center">
              Bienvenu chez IUSPM !
            </Heading>
            <Text
              fontSize="xs"
              color={useColorModeValue("blackAlpha.600", "black.200")}
              mb={8}
            >
              S'il vous plait entrer vos identifiants
            </Text>
            <LoginForm />
          </VStack>
        </HStack>
      </Box>
    </>
  );
};

export default LoginPage;
