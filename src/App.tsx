import { useEffect, useState } from "react";
import "./App.css";
import Login from "./routes/login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoadingScreen from "./components/loading-screen";
import Home from "./routes/home";
import ProtectedRoute from "./routes/protected-route";
import Layout from "./components/layout";
import reset from "styled-reset";
import styled, { createGlobalStyle } from "styled-components";
import CreateAccount from "./routes/create-account";
import Profile from "./routes/profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Profile />,
      },
    ],
  },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  *{
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color: white;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  ::-webkit-scrollbar {
    display:none;
  }
`;

const Wrapper = styled.div`
  height: 90vh;
  display: flex;
  justify-content: center;
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    setLoading(false);
  };

  useEffect(() => {
    console.log(
      "✅ GlobalStyles 적용 확인:",
      document.body.style.backgroundColor
    );
    init();
  }, []);

  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;
