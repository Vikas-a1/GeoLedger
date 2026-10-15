import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

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
import { Applications } from './components/screens/Applications';
import { ApplicationDetails } from './components/screens/ApplicationDetails';
import { MyProperties } from './components/screens/MyProperties';
import { Transactions } from './components/screens/Transactions';
import { ScrollToTop } from './components/ScrollToTop';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Properties */}
        <Route
          path="/properties"
          element={<MyProperties />}
        />

        <Route
          path="/search"
          element={<PropertySearch />}
        />

        <Route
          path="/properties/:propertyId"
          element={<PropertyDetails />}
        />
        <Route
          path="/property/details"
          element={<PropertyDetails />}
        />

        {/* Applications */}
        <Route path="/applications" element={<Applications />} />
        <Route
          path="/applications/:applicationId"
          element={<ApplicationDetails />}
        />

        {/* Temporary: existing registration screen */}
        <Route
          path="/applications/new"
          element={<PropertyRegistration />}
        />

        {/* Existing transfer screen — we'll redesign this later */}
        <Route
          path="/transfer"
          element={<PropertyTransfer />}
        />

        {/* Documents & GIS */}
        <Route
          path="/verify"
          element={<DocumentVerification />}
        />

        <Route
          path="/map"
          element={<PropertySearch />}
        />

        {/* Transactions */}
        <Route
          path="/transactions"
          element={<Transactions />}
        />

        {/* Account */}
        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* Backward compatibility */}
        <Route
          path="/register"
          element={<Navigate to="/applications/new" replace />}
        />

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}