import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../App/store";

type Props = {
  children: ReactNode;
  requireAuth?: boolean;
  condition?: boolean;
  redirectTo?: string;
};

const ProtectedRoute = ({
  children,
  requireAuth = false,
  condition = true,
  redirectTo = "/",
}: Props) => {
  const token = useSelector((state: RootState) => state.auth.token);

  // 🔐 בדיקת התחברות (JWT)
  if (requireAuth && !token) {
    return <Navigate to="/" replace />;
  }

  // 🧠 בדיקת תנאים עסקיים (location וכו')
  if (!condition) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;