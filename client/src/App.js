import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Navbar } from './components/Navbar';
import { Contact } from './pages/Contact';
import { ProgramsList } from './pages/ProgramsList';
import { ProgramDetails } from './pages/ProgramDetails';
import { Facilities } from './pages/Facilities';
import { FacilityDetails } from './pages/FacilityDetails';
import Booking from './pages/Booking';
import { AuthProvider } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import PrivateRoute from './components/auth/PrivateRoute';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import RoomBookingForm from './pages/RoomBookingForm';
import BookingConfirmationPage from './pages/RoomBookingConfirmation';
import FacilityAdminList from './pages/admin/FacilityAdminList';
import FacilityAvailabilityForm from './pages/admin/FacilityAvailabilityForm';
import FacilityAdminForm from './pages/admin/FacilityAdminForm';
import ProgramAdminList from './pages/admin/ProgramAdminList';
import ProgramAdminForm from './pages/admin/ProgramAdminForm';
import ContactAdminList from './pages/admin/ContactAdminList';
import DonationPage from './pages/Donate';
import BookingAdminList from './pages/admin/BookingAdminList';
import RoomBookingAdminList from './pages/admin/RoomBookingAdminList';
import AboutUs from './pages/AboutUs';
import BookingDetailView from './pages/admin/BookingDetailView';
import RoomBookingDetailView from './pages/admin/RoomBookingDetailView';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export const PAYPAL_CLIENT_ID = "AUEwkO2TO6LLT1jKAS8EQ3PdbO5JBLe8X3amwF6qnTb89V5EnRl7vzFtNP66Squd7so-gvekzcQNKrYy";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="*" element={<Home />} />
            <Route path="/donate" element={<DonationPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/programs" element={<ProgramsList />} />
            <Route path="/programs/:id" element={<ProgramDetails />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/facilities/:id" element={<FacilityDetails />} />

            <Route path="/room-booking" element={
              <PrivateRoute>
                <RoomBookingForm />
              </PrivateRoute>
            } />

            <Route path="/booking/:programId" element={<Booking />} />
            <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
            <Route path="/room-booking-confirmation" element={<BookingConfirmationPage />} />
            <Route path="/my-bookings"
              element={
                <PrivateRoute>
                  <MyBookings />
                </PrivateRoute>
              }
            />

            <Route path="/admin/contacts" element={
              <PrivateRoute adminRoute>
                <ContactAdminList />
              </PrivateRoute>
            }
            />
            <Route path="/admin/programs" element={
              <PrivateRoute adminRoute>
                <ProgramAdminList />
              </PrivateRoute>
            }
            />
            <Route path="/admin/programs/new" element={
              <PrivateRoute adminRoute>
                <ProgramAdminForm />
              </PrivateRoute>
            }
            />
            <Route path="/admin/programs/edit/:id" element={
              <PrivateRoute adminRoute>
                <ProgramAdminForm />
              </PrivateRoute>
            }
            />
            <Route path="/admin/bookings" element={
              <PrivateRoute adminRoute>
                <BookingAdminList />
              </PrivateRoute>
            }
            />
            <Route path="/admin/bookings/:id" element={
              <PrivateRoute adminRoute>
                <BookingDetailView />
              </PrivateRoute>
            }
            />
            <Route path="/admin/room-bookings" element={
              <PrivateRoute adminRoute>
                <RoomBookingAdminList />
              </PrivateRoute>
            }
            />
            <Route path="/admin/room-bookings/:id" element={
              <PrivateRoute adminRoute>
                <RoomBookingDetailView />
              </PrivateRoute>
            }
            />
            <Route path="/admin/facility" element={
              <PrivateRoute adminRoute>
                <FacilityAdminList />
              </PrivateRoute>
            }
            />
            <Route path="/admin/facilities/availability/:id" element={
              <PrivateRoute adminRoute>
                <FacilityAvailabilityForm />
              </PrivateRoute>
            }
            />
            <Route path="/admin/facilities/edit/:id" element={
              <PrivateRoute adminRoute>
                <FacilityAdminForm />
              </PrivateRoute>
            }
            />
            <Route path="/admin/facilities/new" element={
              <PrivateRoute adminRoute>
                <FacilityAdminForm />
              </PrivateRoute>
            }
            />

            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;