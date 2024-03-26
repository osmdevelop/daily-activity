import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DailyActivityReport from './DailyActivityReport';
import AdminPage from './AdminPage'; // The new admin page component you'll create


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DailyActivityReport />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
