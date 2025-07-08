
import { useState, useEffect } from 'react';
import Login from '@/components/Login';
import TaskDashboard from '@/components/TaskDashboard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('taskTracker_username');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (name: string) => {
    localStorage.setItem('taskTracker_username', name);
    setUsername(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('taskTracker_username');
    setUsername('');
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <TaskDashboard username={username} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;
