import type { ReactNode } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { WalletProvider } from './context/WalletContext';
import { RequireWallet } from './components/RequireWallet';
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

function Protected({ children }: { children: ReactNode }) {
  return <RequireWallet>{children}</RequireWallet>;
}

export default function App() {
  return (
    <WalletProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/properties" element={<Protected><MyProperties /></Protected>} />
          <Route path="/search" element={<Protected><PropertySearch /></Protected>} />
          <Route path="/properties/:propertyId" element={<Protected><PropertyDetails /></Protected>} />
          <Route path="/property/details" element={<Protected><PropertyDetails /></Protected>} />
          <Route path="/applications" element={<Protected><Applications /></Protected>} />
          <Route path="/applications/:applicationId" element={<Protected><ApplicationDetails /></Protected>} />
          <Route path="/applications/new" element={<Protected><PropertyRegistration /></Protected>} />
          <Route path="/transfer" element={<Protected><PropertyTransfer /></Protected>} />
          <Route path="/verify" element={<Protected><DocumentVerification /></Protected>} />
          <Route path="/map" element={<Protected><PropertySearch /></Protected>} />
          <Route path="/transactions" element={<Protected><Transactions /></Protected>} />
          <Route path="/notifications" element={<Protected><Notifications /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/register" element={<Navigate to="/applications/new" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
}
