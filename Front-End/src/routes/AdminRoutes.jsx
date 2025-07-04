import { Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AddCategory from "../pages/admin/AddCategory";
import UpdateCategory from "../pages/admin/UpdateCategory";
import AddPackage from "../pages/admin/AddPackage";
import UpdatePackage from "../pages/admin/UpdatePackage";
import AddUser from "../pages/admin/AddUser";
import UpdateUser from "../pages/admin/UpdateUser";
import Order from "../pages/admin/Order";
import OrdersAdmin from "../pages/admin/OrdersAdmin";
import Footer from "../components/Footer";
import CategoryAdmin from "../pages/admin/CategoryAdmin";
import NotFound from "../pages/NotFound.jsx";
import ViewPackage from "../pages/admin/ViewPackage.jsx";
import ViewUser from "../pages/admin/ViewUser.jsx";
import UserOrders from "../pages/admin/UserOrders.jsx";

const AdminRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/category-admin/:id"
          element={
            <ProtectedRoutes adminOnly={true}>
              <CategoryAdmin />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/add-category"
          element={
            <ProtectedRoutes adminOnly={true}>
              <AddCategory />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/update-category/:id"
          element={
            <ProtectedRoutes adminOnly={true}>
              <UpdateCategory />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/add-package"
          element={
            <ProtectedRoutes adminOnly={true}>
              <AddPackage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/update-package/:id"
          element={
            <ProtectedRoutes adminOnly={true}>
              <UpdatePackage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/view-package/:id"
          element={
            <ProtectedRoutes adminOnly={true}>
              <ViewPackage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/add-user"
          element={
            <ProtectedRoutes adminOnly={true}>
              <AddUser />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/view-user/:id"
          element={
            <ProtectedRoutes adminOnly={true}>
              <ViewUser />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/update-user/:id"
          element={
            <ProtectedRoutes adminOnly={true}>
              <UpdateUser />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/user-orders/:userId"
          element={
            <ProtectedRoutes adminOnly={true}>
              <UserOrders />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedRoutes adminOnly={true}>
              <Order />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoutes adminOnly={true}>
              <OrdersAdmin />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoutes adminOnly={true}>
              <NotFound />
            </ProtectedRoutes>
          }
        />
      </Routes>
      <Footer />
    </>
  );
};

export default AdminRoutes;
