import {type ReactElement} from "react";
import {Navigate} from "react-router-dom";
import {useAuth} from "../../features/auth/model/auth.context";
import {AppLoader} from "../ui/AppLoader/AppLoader";

type GuestRouteProps = {
  children: ReactElement;
};

export function GuestRoute({children}: GuestRouteProps) {
  const {initialized, isAuthenticated} = useAuth();

  if (!initialized) {
    return <AppLoader/>;
  }

  if (isAuthenticated) {
    return <Navigate to="/parser" replace/>;
  }

  return children;
}