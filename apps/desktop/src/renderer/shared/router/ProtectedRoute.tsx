import {type ReactElement} from "react";
import {Navigate} from "react-router-dom";
import {useAuth} from "../../features/auth/model/auth.context";
import {AppLoader} from "../ui/AppLoader/AppLoader";

type ProtectedRouteProps = {
  children: ReactElement;
};

export function ProtectedRoute({children}: ProtectedRouteProps) {
  const {initialized, isAuthenticated} = useAuth();

  if (!initialized) {
    return <AppLoader/>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace/>;
  }

  return children;
}