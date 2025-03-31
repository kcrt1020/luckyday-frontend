import { useEffect, useState } from "react";
import "./App.css";
import Login from "./routes/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import Home from "./routes/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/Layout";
import reset from "styled-reset";
import styled, { createGlobalStyle } from "styled-components";
import CreateAccount from "./routes/CreateAccount";
import Profile from "./routes/Profile";
import CloverDetail from "./routes/CloverDetail";
import FollowList from "./routes/FollowList";
import Search from "./routes/Search";
import NotificationPage from "./routes/Notification";

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
        path: ":username",
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
    path: "/profile/:type/:username",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <FollowList />,
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
  {
    path: "/notifications",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <NotificationPage />,
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
    overflow-x: hidden;
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
