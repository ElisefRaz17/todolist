import React, { ReactNode, useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import "./App.css";
import Footer from "./components/Footer/Footer";

interface AuthContextProps {
  token: string | null | any;
  login: (newToken: string | any) => void;
  logout: () => void;
  credentialsState: null | any;
  setCredentialsState: React.Dispatch<React.SetStateAction<any>>;
}

export const AuthContext = React.createContext<AuthContextProps>({
  login: () => {},
  logout: () => {},
  token: null,
  credentialsState: null,
  setCredentialsState: () => {},
});
interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [credentialsState, setCredentialsState] = useState(null);
  useEffect(() => {}, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ token, login, logout, credentialsState, setCredentialsState }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  const { token } = useAuth();

  return token ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="app-container">
      <AuthProvider>
        <Router>
          <Navbar />
          <main className="content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute element={<Home />} />} />
            </Routes>
          </main>
          <Footer/>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
