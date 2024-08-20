import { Container, Heading, Image, VStack } from "@chakra-ui/react";
import image from "../../assets/img/404.png";

const Page404: React.FC = () => {
  return (
    <Container mt="container.lg">
      <VStack mt="15vh">
        <Image src={image} width="100%" />
        <Heading textAlign="center">Page not found</Heading>
      </VStack>
    </Container>
  );
};

export default Page404;
