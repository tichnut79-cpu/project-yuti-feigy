import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../App/store";

type Props = {
  children: ReactNode;
  condition: boolean;
  redirectTo?: string;
};

const ProtectedRoute = ({
  children,
  condition,
  redirectTo = "/",
}: Props) => {
  if (!condition) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;