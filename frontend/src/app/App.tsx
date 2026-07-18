import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './components/screens/Landing';
import { Login } from './components/screens/Login';
import { Dashboard } from './components/screens/Dashboard';
import { PropertySearch } from './components/screens/PropertySearch';
import { PropertyRegistration } from './components/screens/PropertyRegistration';
import { PropertyTransfer } from './components/screens/PropertyTransfer';
import { PropertyDetails } from './components/screens/PropertyDetails';
import { DocumentVerification } from './components/screens/DocumentVerification';
import { Notifications } from './components/screens/Notifications';
import { Profile } from './components/screens/Profile';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<PropertySearch />} />
        <Route path="/map" element={<PropertySearch />} />
        <Route path="/register" element={<PropertyRegistration />} />
        <Route path="/transfer" element={<PropertyTransfer />} />
        <Route path="/property/details" element={<PropertyDetails />} />
        <Route path="/verify" element={<DocumentVerification />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}