import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ruler, Menu, X, UserCircle, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserDisplayName } from '../types/user';

const navigation = [
  { name: 'Generate Quote', href: '/generate-quote', role: 'sales' },
  { name: 'Quotes', href: '/quotes', role: 'sales' },
  { name: 'Orders', href: '/orders', role: 'sales' },
  { name: 'Catalog', href: '/catalog', role: 'admin' },
  { 
    name: 'Settings', 
    items: [
      { name: 'Preset Values', href: '/preset-values', role: 'admin' },
      { name: 'Quote Template', href: '/quote-template', role: 'admin' },
      { name: 'Receipt Template', href: '/receipt-template', role: 'admin' },
    ]
  },
];

export function Header() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const userRole = user?.user_metadata?.role || 'visitor';
  const isAdmin = userRole === 'admin';
  const isSales = userRole === 'sales' || isAdmin;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNavigation = navigation.filter(item => {
    if (item.role) {
      if (item.role === 'admin' && !isAdmin) return false;
      if (item.role === 'sales' && !isSales) return false;
    }
    return true;
  });

  const handleSignOut = async () => {
    await signOut();
    setShowProfileMenu(false);
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Ruler className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">CabinetQuote</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:space-x-6">
            {filteredNavigation.map((item) => 
              item.items ? (
                <div key={item.name} className="relative" ref={settingsRef}>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`${
                      item.items.some(subItem => location.pathname === subItem.href)
                        ? 'text-indigo-600'
                        : 'text-gray-500 hover:text-gray-900'
                    } inline-flex items-center px-1 pt-1 text-sm font-medium`}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    {item.name}
                  </button>
                  {showSettings && (
                    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className={`${
                            location.pathname === subItem.href
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700'
                          } block px-4 py-2 text-sm hover:bg-gray-50`}
                          onClick={() => setShowSettings(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-900'
                  } inline-flex items-center px-1 pt-1 text-sm font-medium`}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* User Profile */}
          {user ? (
            <div className="hidden lg:relative lg:flex lg:items-center" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <UserCircle className="h-8 w-8 text-gray-400" />
                <span className="font-medium">{getUserDisplayName(user)}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Your Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/users"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      User Management
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden lg:inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Log in
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {filteredNavigation.map((item) => 
                item.items ? (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {item.name}
                    </button>
                    {showSettings && (
                      <div className="pl-4">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`${
                              location.pathname === subItem.href
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-gray-600'
                            } block px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-gray-900`}
                            onClick={() => {
                              setShowSettings(false);
                              setIsOpen(false);
                            }}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      location.pathname === item.href
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600'
                    } block px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-gray-900`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              )}
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => setIsOpen(false)}
                  >
                    Your Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/users"
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      onClick={() => setIsOpen(false)}
                    >
                      User Management
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center px-3 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}