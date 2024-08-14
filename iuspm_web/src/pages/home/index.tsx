import { Box, Code, Grid, Link, Text, VStack } from "@chakra-ui/react";
import { ColorModeSwitcher } from "../../components/utils/ColorModeSwitcher";
import { Logo } from "../../components/utils/Logo";

const Home: React.FC = () => {
  return (
    <>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <Logo h="40vmin" pointerEvents="none" />
            <Text>
              Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
            </Text>
            <Link
              color="brand.700"
              href="https://chakra-ui.com"
              fontSize="2xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn Chakra
            </Link>
          </VStack>
        </Grid>
      </Box>
    </>
  );
};

export default Home;
