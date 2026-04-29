import React, { useState, useContext } from 'react';
import Navbar from './components/Navbar';
import TaskList from './views/TaskList';
import Dashboard from './views/Dashboard';
import Calendar from './views/Calendar';
import Login from './views/Login';
import { TaskProvider } from './context/TaskContext';
import { AuthContext, AuthProvider } from './context/AuthContext';

function MainApp() {
  const { user } = useContext(AuthContext);
  const [currentView, setCurrentView] = useState('tasks');

  if (!user) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'analytics':
        return <Dashboard />;
      case 'calendar':
        return <Calendar />;
      case 'tasks':
      default:
        return <TaskList />;
    }
  };

  return (
    <TaskProvider>
      <div className="min-h-screen bg-deepBlue text-gray-200 pb-20 md:pb-0">
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          {renderView()}
        </main>
      </div>
    </TaskProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
