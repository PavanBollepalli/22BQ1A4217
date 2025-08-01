import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./components/Loginform";
import Registerform from "./components/Registerfrom";
import Dashboardpage from "./pages/Dashboardpage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Registerform />} />
        <Route
          path="/dashboard"
          element={
            // <PrivateRoute>
              <Dashboardpage />
            // </PrivateRoute>
          }
        />
        <Route
          path="/create-url"
          element={
            // <PrivateRoute>
              <Homepage />
            // </PrivateRoute>
          }
        />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
