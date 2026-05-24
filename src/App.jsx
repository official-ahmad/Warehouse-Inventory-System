import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import AddProduct from "./pages/AddProduct";
import Transactions from "./pages/Transactions";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
