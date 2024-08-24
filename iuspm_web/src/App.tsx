import { ChakraProvider, theme } from "@chakra-ui/react";
import Home from "./pages/home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Page404 from "./pages/404";
import StudentPage from "./pages/student";
import StudentDetailPage from "./pages/student/detail";
import LoginPage from "./pages/login";
import DashBoardPage from "./pages/dashboard";
import Private from "./components/Private";
import PrivateRev from "./components/Private/rev";
import AuthProvider from "./providers/Auth";
import ServiceProvider from "./providers/Service";

export const App = () => (
  <Router>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <ServiceProvider>
          <Routes>
            <Route path="" element={<Home />} />
            <Route
              path="login"
              element={
                <PrivateRev>
                  <LoginPage />
                </PrivateRev>
              }
            />
            <Route
              path="dashboard"
              element={
                <Private>
                  <DashBoardPage />
                </Private>
              }
            />
            <Route
              path="student"
              element={
                <Private>
                  <StudentPage />
                </Private>
              }
            />
            <Route
              path="student/:uuid"
              element={
                <Private>
                  <StudentDetailPage />
                </Private>
              }
            />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </ServiceProvider>
      </AuthProvider>
    </ChakraProvider>
  </Router>
);
