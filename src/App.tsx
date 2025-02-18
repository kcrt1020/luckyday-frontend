import { useEffect, useState } from "react";
import "./App.css";
import Login from "./routes/login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoadingScreen from "./components/loading-screen";
import Home from "./routes/home";
import ProtectedRoute from "./routes/protected-route";
import Layout from "./components/layout";

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
]);

function App() {
  const [count, setCount] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    setLoading(false);
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <h1>Lucky Day</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </>
  );
}

export default App;
