// import './App.css'
import { useAuth } from '@clerk/react'
import { Button } from '@heroui/react';
import { ThemeProvider } from './context/ThemeContext';
import { WallpaperProvider } from './context/WallpaperContext';
import { Navigate, Route, Routes } from 'react-router';
import ChatPage from './pages/ChatPage';
import AuthPage from './pages/AuthPage';
import PageLoader from './components/PageLoader.jsx'
import { axiosInstance } from './lib/axios.js';
import { useAuthStore } from './store/useAuthStore.js';
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function App() {
  const {isSignedIn, isLoaded} = useAuth()

  const { checkAuth, isCheckingAuth, clearAuth } = useAuthStore()

  useEffect(() => {
    if(!isLoaded) return
    if (isSignedIn) checkAuth()
    else clearAuth()
  }, [checkAuth, clearAuth, isLoaded, isSignedIn])

  if (!isLoaded || (isSignedIn && isCheckingAuth)) {return <PageLoader />}
  
  return (
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>
          <Route path="/" element={isSignedIn ? <ChatPage /> : <Navigate to={"/auth"} replace/> }></Route>
          <Route path="/auth" element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} replace/>}></Route>
        </Routes>
        <Toaster />
      </WallpaperProvider>
    </ThemeProvider>
  )
}

export default App