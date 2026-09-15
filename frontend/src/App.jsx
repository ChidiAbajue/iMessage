// import './App.css'
import { useAuth } from '@clerk/react'
import { Button } from '@heroui/react';
import { ThemeProvider } from './context/ThemeContext';
import { WallpaperProvider } from './context/WallpaperContext';
import { Navigate, Route, Routes } from 'react-router';
import ChatPage from './pages/ChatPage';
import AuthPage from './pages/AuthPage';
import PageLoader from './components/PageLoader.jsx'


function App() {
  const {isSignedIn, isLoaded} = useAuth()
  //todo: make this a better component
  if (!isLoaded) return <PageLoader />
  return (
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>
          <Route path="/" element={isSignedIn ? <ChatPage /> : <Navigate to={"/auth"} replace/> }></Route>
          <Route path="/auth" element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} replace/>}></Route>
        </Routes>
      </WallpaperProvider>
    </ThemeProvider>
  )
}

export default App