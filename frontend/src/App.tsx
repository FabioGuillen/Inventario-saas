import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

import Dashboard from "./pages/Deshboard";
import Products from "./pages/Products";
import Movements from "./pages/Movements";
import Reports from "./pages/Reports";
import CreateProductPage from "./pages/CreateProductPage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";

import Users from "./pages/Users";
import CreateUser from "./pages/CreateUsersPages";
import ChangeRolesPage from "./pages/ChangeRolePages";
import { Toaster } from "react-hot-toast";
import MovementUsers from "./pages/MovementUsers";
import { useEffect } from "react";
import { getUser } from "./services/auth";
import { useAuthStore } from "./store/auth.store";

function App() {
  const { token, user, setAuth } = useAuthStore();
  useEffect(() => {
    if (token && !user) {
      getUser().then((res) => {
        setAuth(res.data, token);
      });
    }
  }, [token, user, setAuth]);
  return (
    <>
      {" "}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={12}
        containerStyle={{
          top: 20,
          right: 20,
        }}
        toastOptions={{
          duration: 4000,

          style: {
            background: "rgba(15,15,15,0.92)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "18px",
            padding: "14px 16px",
            minWidth: "320px",
            boxShadow: "0 10px 35px rgba(0,0,0,.45)",
            fontSize: "14px",
            fontWeight: 500,
          },

          success: {
            iconTheme: {
              primary: "#BB86FC",
              secondary: "#000",
            },
          },

          error: {
            iconTheme: {
              primary: "#ff4d4f",
              secondary: "#fff",
            },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/create" element={<CreateProductPage />} />
          <Route path="/movements" element={<Movements />} />
          <Route path="/reports" element={<Reports />} />

          <Route
            path="/create-user"
            element={
              <ProtectedRoute roles={["owner"]}>
                <CreateUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movement-users"
            element={
              <ProtectedRoute roles={["owner", "admin"]}>
                <MovementUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute roles={["owner", "admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="/roles"
            element={
              <ProtectedRoute roles={["owner"]}>
                <ChangeRolesPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
