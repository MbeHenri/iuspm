import { ChakraProvider, theme } from "@chakra-ui/react";
import Home from "./pages/home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Page404 from "./pages/404";
import StudentPage from "./pages/student";

export const App = () => (
  <Router>
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="student" element={<StudentPage />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </ChakraProvider>
  </Router>
);
