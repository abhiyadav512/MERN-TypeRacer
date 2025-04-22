import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import NotFound from "./pages/NotFound";
import AppLayout from "./layout/AppLayout";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import Room from "./pages/Room";
import SinglePlayer from "./pages/SinglePlayer";
import GoogleAuthSuccess from "./components/auth/GoogleAuthSuccess";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/auth-success", element: <GoogleAuthSuccess /> }
      ,
      // Protected Routes
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/single-player",
        element: (
          <ProtectedRoutes>
            <SinglePlayer />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/room",
        element: (
          <ProtectedRoutes>
            <Room />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/:username",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
     

      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
