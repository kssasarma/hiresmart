import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
	return (
		<BrowserRouter basename="/hiresmart">
			<div className="min-h-screen bg-gray-50">
				<Navbar />
				<div className="container mx-auto px-4 py-8">
					<Routes>
						<Route path="/" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/candidate" element={<CandidateDashboard />} />
						<Route path="/recruiter" element={<RecruiterDashboard />} />
					</Routes>
				</div>
				<Toaster position="top-right" />
			</div>
		</BrowserRouter>
	);
}

export default App;
