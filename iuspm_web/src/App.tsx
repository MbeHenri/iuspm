import { ChakraProvider, theme } from "@chakra-ui/react";
import Home from "./pages/home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export const App = () => (
  <Router>
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="" element={<Home />} />
      </Routes>
    </ChakraProvider>
  </Router>
);
