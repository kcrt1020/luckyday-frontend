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
import CloverDetail from "./routes/clover-detail";
import FollowListPage from "./routes/FollowListPage";
import Search from "./routes/Search";

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
        path: ":userId",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/clovers/:id",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <CloverDetail />,
      },
    ],
  },
  {
    path: "/profile/:type/:userId",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <FollowListPage />,
      },
    ],
  },
  {
    path: "/search",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Search />,
      },
    ],
  },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  html, body {
  min-height: 100vh;
  background-color: black;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow-x: hidden;
}

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  background-color: black;
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    setLoading(false);
  };

  useEffect(() => {
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
