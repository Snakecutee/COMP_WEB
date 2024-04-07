import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./customRouters/privateRouter";
import UnauthorizeRoute from "./customRouters/unauthorizeRouter";

import LoginPage from "../screens/login";
import UserPage from "../screens/users/";
import ErrorPage from "../screens/error";
import { roles } from "../constants/role";
import Departments from "../screens/departments";
import Academy from "../screens/academics";
import IdeaDetail from "../components/IdeaDetail";
import PostIdea from "../components/postIdea";

import LandingPage from "../screens/landingPage";
import IdeasList from "../components/ideasList";
import MagazinePage from "../screens/magazine";
import MagazineDatailPage from "../screens/magazine/magazineDetail";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <UnauthorizeRoute>
              <LoginPage />
            </UnauthorizeRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <LandingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute allowRoles={[roles.ADMIN]}>
              <UserPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/departments"
          element={
            <PrivateRoute allowRoles={[roles.ADMIN]}>
              <Departments />
            </PrivateRoute>
          }
        />
        <Route
          path="/academy"
          element={
            <PrivateRoute allowRoles={[roles.ADMIN]}>
              <Academy />
            </PrivateRoute>
          }
        />
        <Route
          path="/idea"
          element={
            <PrivateRoute allowRoles={[roles.ADMIN]}>
              <IdeasList />
            </PrivateRoute>
          }
        />
        <Route
          path="/student-idea"
          element={
            <PrivateRoute>
              <IdeasList />
            </PrivateRoute>
          }
        />
        <Route
          path="/contribute"
          element={
            <PrivateRoute>
              <PostIdea />
            </PrivateRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <PrivateRoute>
              <IdeaDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/magazines"
          element={
            <PrivateRoute>
              <MagazinePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/magazines/:id"
          element={
            <PrivateRoute>
              <MagazineDatailPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
