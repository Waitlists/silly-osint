import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Search, Activity, BarChart3 } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                SillyOSINT
              </h1>
              <div className="hidden md:flex items-center space-x-3 ml-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Intelligence Systems Online</span>
              </div>
            </div>
            
            {user && (
              <nav className="flex items-center space-x-6">
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                    isActive('/dashboard')
                      ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 text-gray-600 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                  
                  <button
                    onClick={signOut}
                    className="flex items-center space-x-3 px-6 py-3 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 border border-transparent transition-all duration-300"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;