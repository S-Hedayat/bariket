import { Routes, Route } from "react-router-dom";
import AdminLayout from "./admin/AdminLayout";
import SiteLayout from "./site/SiteLayout";

const App = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/*" element={<SiteLayout />} />
    </Routes>
  );
};

export default App;
