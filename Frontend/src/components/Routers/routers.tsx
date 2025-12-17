import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import SignIn from '../SignIn/signIn'
import SignUp from '../SignUP/signUp'
import ForgotPassword from '../ForgotPassword/forgotPassword'
import ForgotPasswordChange from '../ForgotPassword/forgotPasswordChange'
import Dashboard from '../Dashboard/Dashboard'
import BusinessDashboard from '../Dashboard/BusinessDashboard'
import BusinessProfileForm from '../BusinessOwner/BusinessProfileForm'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'

const routers = () => {
  return (
    <div>
        <Router>
            <Routes>
                <Route path='/signin' element={<SignIn />}></Route>
                <Route path='/signup' element={<SignUp />}></Route>
                <Route path='/forgot-password' element={<ForgotPassword />}></Route>
                <Route path='/reset-password' element={<ForgotPasswordChange />}></Route>
                
                {/* Protected Routes */}
                <Route 
                  path='/dashboard' 
                  element={
                    <ProtectedRoute requireUserType='user'>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path='/business/dashboard' 
                  element={
                    <ProtectedRoute requireUserType='business'>
                      <BusinessDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path='/business/profile' 
                  element={
                    <ProtectedRoute requireUserType='business'>
                      <BusinessProfileForm />
                    </ProtectedRoute>
                  }
                />
                
                {/* Default redirect */}
                <Route path='/' element={<Navigate to='/signin' replace />} />
            </Routes>
        </Router>
    </div>
  )
}

export default routers
