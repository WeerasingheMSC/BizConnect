import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import SignIn from '../SignIn/signIn'
import SignUp from '../SignUP/signUp'
import ForgotPassword from '../ForgotPassword/forgotPassword'
import Dashboard from '../Dashboard/Dashboard'
import BusinessDashboard from '../Dashboard/BusinessDashboard'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'

const routers = () => {
  return (
    <div>
        <Router>
            <Routes>
                <Route path='/signin' element={<SignIn />}></Route>
                <Route path='/signup' element={<SignUp />}></Route>
                <Route path='/forgot-password' element={<ForgotPassword />}></Route>
                
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
                
                {/* Default redirect */}
                <Route path='/' element={<Navigate to='/signin' replace />} />
            </Routes>
        </Router>
    </div>
  )
}

export default routers
