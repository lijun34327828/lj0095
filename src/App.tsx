import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Config3874 from "@/pages/Config3874";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/3874" replace />} />
        <Route path="/3874" element={<Config3874 />} />
      </Routes>
    </Router>
  );
}
