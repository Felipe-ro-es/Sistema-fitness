import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { PersonalAuthProvider } from "./context/PersonalAuthContext";

function App() {
  return (
    <AuthProvider>
      <PersonalAuthProvider>
        <AppRoutes />
      </PersonalAuthProvider>
    </AuthProvider>
  );
}

export default App;