import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { FaLock, FaUnlockAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuth from "../../providers/Auth/hooks";
import { useLoading } from "../../utils/hooks";

const LoginForm = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { connexion } = useAuth();

  const { loading, setLoading } = useLoading();

  const [showPassword, setShowPassword] = useState(false);
  const [errorUsername, setErrorUsername] = useState<string | null>(null);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);

  const toggleShowPassword = useCallback(
    () => setShowPassword(!showPassword),
    [showPassword]
  );

  const handleChangeUserName = useCallback((val: string, withSetVal = true) => {
    withSetVal && setUsername(val);
    val === ""
      ? setErrorUsername("Entrez un nom d'utilisateur non vide")
      : setErrorUsername(null);
  }, []);

  const handleChangePassword = useCallback((val: string, withSetVal = true) => {
    withSetVal && setPassword(val);
    val === ""
      ? setErrorPassword("Entrez un mot de passe non vide")
      : setErrorPassword(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!loading) {
      if (username !== "" && password !== "") {
        setLoading(true);
        connexion(username, password)
          .then((e) => {
            navigate("/dashboard");
          })
          .catch((e) => console.log(e))
          .finally(() => setLoading(false));
      }

      handleChangeUserName(username, false);
      handleChangePassword(password, false);
    }
  }, [
    connexion,
    handleChangePassword,
    handleChangeUserName,
    loading,
    navigate,
    password,
    setLoading,
    username,
  ]);

  return (
    <>
      <FormControl isInvalid={errorUsername ? true : false} mb={4} isRequired>
        <FormLabel>Nom d'utilisateur</FormLabel>
        <Input
          isInvalid={errorUsername ? true : false}
          placeholder="Enter Username"
          onChange={(e) => handleChangeUserName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          value={username}
        />
        {errorUsername && <FormErrorMessage>{errorUsername}</FormErrorMessage>}
      </FormControl>

      <FormControl isInvalid={errorPassword ? true : false} mb={8} isRequired>
        <FormLabel>Mot de passe</FormLabel>
        <InputGroup size="md">
          <Input
            isInvalid={errorPassword ? true : false}
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => handleChangePassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            value={password}
          />
          <InputRightElement width="4.5rem">
            <IconButton
              aria-label=""
              rounded="full"
              h="1.75rem"
              size="sm"
              icon={showPassword ? <FaLock /> : <FaUnlockAlt />}
              onClick={toggleShowPassword}
            />
          </InputRightElement>
        </InputGroup>
        {errorPassword && <FormErrorMessage>{errorPassword}</FormErrorMessage>}
      </FormControl>

      <Button
        size="md"
        p={6}
        w="100%"
        rounded="full"
        backgroundColor={useColorModeValue("black", "white")}
        color={useColorModeValue("white", "black")}
        _hover={{
          backgroundColor: useColorModeValue(
            "blackAlpha.600",
            "whiteAlpha.600"
          ),
        }}
        onClick={handleSubmit}
        isDisabled={loading}
      >
        Connexion
      </Button>
    </>
  );
};

export default LoginForm;
