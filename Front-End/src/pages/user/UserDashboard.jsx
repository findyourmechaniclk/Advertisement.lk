'use client'

import { useState, useEffect } from 'react'
import blankProfileImage from '../../assets/blank-profile-picture.jpg';
import {
  User,
  Settings,
  FileText,
  ShoppingBag,
  Package,
  Plus,
  Heart,
  ChartBar,
} from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useUser from '../../hooks/useUser';
import SettingsPage from './Settings'
import { getUserById } from '../../api/userApi'
import { useDispatch } from 'react-redux';

import Favourites from './Favourites';
import MyOrders from './MyOrders';
import MyPackages from './MyPackages';

import AddAdvertisement from "./AddAdvertisement";
import MyAds from "./MyAds";
import { getAdvertisementsByUser } from '../../api/advertisementApi.js';
import { getUserOrders } from '../../api/orderApi.js';
import AdStats from './AdStats.jsx';

const UserDashboard = () => {
  const { user, token } = useAuth();
  const { fetchUser } = useUser();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [totalAds, setTotalAds] = useState(0);
  const [totalPackages, setTotalPackages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  // Extract the active tab from URL parameters
  useEffect(() => {
    // Get the section from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const section = searchParams.get('section');

    // If section exists in URL, update the active tab
    if (section) {
      setActiveTab(section);
    }
  }, [location.search]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        if (user?.id || user._id && token) {
          const data = await getUserById(user.id || user._id, token);
          setUserData(data.data);
          dispatch(fetchUser({ userData: data.data }))

          const ads = await getAdvertisementsByUser(user.id || user._id, token);
          setTotalAds(ads?.length || 0);

          const packages = ads.filter(ad => ad.packageId);
          setTotalPackages(packages?.length || 0);

          const orders = await getUserOrders(user.id || user._id, token);
          setTotalOrders(orders?.length || 0);
        }
      } catch (err) {
        console.error(err?.response?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id, token]);

  // Rendering different content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'add-new-ad':
        return (
          <AddAdvertisement />
        )
      case 'my-ads':
        return (
          <MyAds />
        )
      case 'favourites':
        return (
          <Favourites />
        )
      case 'my-packages':
        return (
          <MyPackages />
        )
      case 'my-orders':
        return (
          <MyOrders />
        )
      case 'statistics':
        return (
          <AdStats />
        )
      case 'settings':
        return (
          <SettingsPage />
        )
      default:
        return (
          console.log('No section selected')
        )
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page heading and user info with larger profile image */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center">
              {/* Profile image */}
              <div className="relative flex-shrink-0 self-start md:self-start">
                <img
                  src={userData.profileImage || blankProfileImage}
                  alt="Profile-image"
                  className="h-48 w-48 rounded-full object-cover border-4 border-gray-300 dark:border-gray-700"
                />
              </div>

              {/* User details section */}
              <div className="flex-1 mt-6 md:-mt-6 md:ml-6 flex flex-col justify-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{userData.firstName} {userData.lastName}</h1>

                {/* Details under the name */}
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <div className="flex items-center">
                    <User size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                    <span>{userData.username}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                    <span>{userData.phone}</span>
                  </div>
                </div>
              </div>

              {/* Ad stats column */}
              <div className="w-full md:w-64 mt-8 md:mt-0 md:ml-6">
                <div className="space-y-4">
                  {/* Active Ads */}
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText size={18} className="text-green-600 dark:text-green-400" />
                        <h3 className="ml-2 font-medium text-green-600 dark:text-green-400">My Ads</h3>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalAds}</p>
                    </div>
                  </div>

                  {/* Expired Ads */}
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ShoppingBag size={18} className="text-red-600 dark:text-red-400" />
                        <h3 className="ml-2 font-medium text-red-600 dark:text-red-400">My Orders</h3>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOrders}</p>
                    </div>
                  </div>

                  {/* Pending Ads */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Package size={18} className="text-yellow-600 dark:text-yellow-400" />
                        <h3 className="ml-2 font-medium text-yellow-600 dark:text-yellow-400">My Packages</h3>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPackages}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard navigation tabs - Mobile-friendly tile layout */}
        <div className="mb-4">
          {/* Desktop horizontal tabs - hidden on mobile */}
          <div className="border-b border-gray-200 dark:border-gray-700 hidden md:block">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
              <Link
                to="/user/dashboard?section=my-ads"
                className={`${activeTab === 'my-ads'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <FileText size={16} className="mr-2" /> My Ads
              </Link>
              <Link
                to="/user/dashboard?section=add-new-ad"
                className={`${activeTab === 'add-new-ad'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Plus size={16} className="mr-2" /> New Ad
              </Link>
              <Link
                to="/user/dashboard?section=favourites"
                className={`${activeTab === 'favourites'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Heart size={16} className="mr-2" /> Favourites
              </Link>
              <Link
                to="/user/dashboard?section=my-packages"
                className={`${activeTab === 'my-packages'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Package size={16} className="mr-2" /> My Packages
              </Link>
              <Link
                to="/user/dashboard?section=my-orders"
                className={`${activeTab === 'my-orders'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <ShoppingBag size={16} className="mr-2" /> My Orders
              </Link>
              <Link
                to="/user/dashboard?section=statistics"
                className={`${activeTab === 'statistics'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <ChartBar size={16} className="mr-2" /> Statistics
              </Link>
              <Link
                to="/user/dashboard?section=settings"
                className={`${activeTab === 'settings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Settings size={16} className="mr-2" /> Settings
              </Link>
            </nav>
          </div>

          {/* Mobile tile layout - visible only on mobile */}
          <div className="grid grid-cols-3 gap-2 md:hidden px-2">
            <Link
              to="/user/dashboard?section=my-ads"
              className={`flex items-center justify-center p-2 rounded-lg border ${activeTab === 'my-ads'
                ? 'bg-blue-50 border-primary text-primary dark:bg-blue-900/20 dark:border-blue-400'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                }`}
            >
              <FileText size={16} className="mr-2" />
              <span className="text-sm font-medium">My Ads</span>
            </Link>

            <Link
              to="/user/dashboard?section=add-new-ad"
              className={`flex items-center justify-center p-2 rounded-lg border ${activeTab === 'add-new-ad'
                ? 'bg-blue-50 border-primary text-primary dark:bg-blue-900/20 dark:border-blue-400'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                }`}
            >
              <Plus size={16} className="mr-2" />
              <span className="text-sm font-medium">New Ad</span>
            </Link>

            <Link
              to="/user/dashboard?section=favourites"
              className={`flex items-center justify-center p-2 rounded-lg border ${activeTab === 'favourites'
                ? 'bg-blue-50 border-primary text-primary dark:bg-blue-900/20 dark:border-blue-400'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                }`}
            >
              <Heart size={16} className="mr-2" />
              <span className="text-sm font-medium">Favourites</span>
            </Link>

            <Link
              to="/user/dashboard?section=my-packages"
              className={`flex items-center justify-center p-2 rounded-lg border ${activeTab === 'my-packages'
                ? 'bg-blue-50 border-primary text-primary dark:bg-blue-900/20 dark:border-blue-400'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                }`}
            >
              <Package size={16} className="mr-2" />
              <span className="text-sm font-medium">Packages</span>
            </Link>

            <Link
              to="/user/dashboard?section=my-orders"
              className={`flex items-center justify-center p-2 rounded-lg border ${activeTab === 'my-orders'
                ? 'bg-blue-50 border-primary text-primary dark:bg-blue-900/20 dark:border-blue-400'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                }`}
            >
              <ShoppingBag size={16} className="mr-2" />
              <span className="text-sm font-medium">My Orders</span>
            </Link>

            <Link
              to="/user/dashboard?section=statistics"
              className={`flex items-center justify-center p-2 rounded-lg border ${activeTab === 'statistics'
                ? 'bg-blue-50 border-primary text-primary dark:bg-blue-900/20 dark:border-blue-400'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                }`}
            >
              <Settings size={16} className="mr-2" />
              <span className="text-sm font-medium">Settings</span>
            </Link>

            <Link
              to="/user/dashboard?section=settings"
              className={`flex items-center justify-center p-2 rounded-lg border ${activeTab === 'settings'
                ? 'bg-blue-50 border-primary text-primary dark:bg-blue-900/20 dark:border-blue-400'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                }`}
            >
              <Settings size={16} className="mr-2" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
          </div>
        </div>

        {/* Main content area */}
        {renderContent()}
      </div>
    </div>
  )
}

// Custom icon components
function Phone(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  );
}

function Mail(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
  );
}

export default UserDashboard