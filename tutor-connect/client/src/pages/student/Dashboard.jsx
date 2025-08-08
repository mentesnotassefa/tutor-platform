import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaChalkboardTeacher, FaClock, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [favoriteTutors, setFavoriteTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    hoursLearned: 0,
    favoriteSubject: '',
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const [sessionsRes, favoritesRes, statsRes] = await Promise.all([
          axios.get('/api/students/sessions', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/students/favorites', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/students/stats', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const now = new Date();
        const upcoming = sessionsRes.data.filter(session => new Date(session.startTime) > now);
        const past = sessionsRes.data.filter(session => new Date(session.startTime) <= now);

        setUpcomingSessions(upcoming);
        setPastSessions(past);
        setFavoriteTutors(favoritesRes.data);
        setStats(statsRes.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  const handleCancelSession = async (sessionId) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete(`/api/students/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpcomingSessions(upcomingSessions.filter(session => session._id !== sessionId));
      toast.success('Session cancelled successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel session');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {currentUser.firstName}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <FaCalendarAlt className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Sessions
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.totalSessions}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <FaClock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Hours Learned
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.hoursLearned}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <FaChalkboardTeacher className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Favorite Subject
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.favoriteSubject || 'None'}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Upcoming Sessions
              </h3>
            </div>
            <div className="bg-white overflow-hidden">
              {upcomingSessions.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {upcomingSessions.map((session) => (
                    <li key={session._id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              {session.tutor?.firstName?.charAt(0)}{session.tutor?.lastName?.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {session.tutor?.firstName} {session.tutor?.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {session.subject}
                              </div>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <button
                              onClick={() => handleCancelSession(session._id)}
                              className="px-2 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {new Date(session.startTime).toLocaleDateString()}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              <FaClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {new Date(session.startTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })} -{' '}
                              {new Date(session.endTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>${session.price.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-12 text-center">
                  <p className="text-gray-500">No upcoming sessions scheduled</p>
                  <Link
                    to="/tutors"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Find Tutors
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Past Sessions */}
          <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Past Sessions
              </h3>
            </div>
            <div className="bg-white overflow-hidden">
              {pastSessions.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {pastSessions.slice(0, 3).map((session) => (
                    <li key={session._id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {session.tutor?.firstName?.charAt(0)}{session.tutor?.lastName?.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {session.tutor?.firstName} {session.tutor?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {session.subject}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {new Date(session.startTime).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>${session.price.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-12 text-center text-gray-500">
                  No past sessions yet
                </div>
              )}
              {pastSessions.length > 3 && (
                <div className="px-4 py-4 border-t border-gray-200 text-center">
                  <Link
                    to="/student/sessions"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View all past sessions
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Favorite Tutors */}
        <div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Favorite Tutors
              </h3>
            </div>
            <div className="bg-white overflow-hidden">
              {favoriteTutors.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {favoriteTutors.map((tutor) => (
                    <li key={tutor._id}>
                      <div className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {tutor.userId?.firstName?.charAt(0)}{tutor.userId?.lastName?.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {tutor.userId?.firstName} {tutor.userId?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {tutor.subjects?.map(s => s.name).join(', ')}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Link
                            to={`/tutors/${tutor._id}`}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            View Profile
                          </Link>
                          <button
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Book Again
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-12 text-center">
                  <p className="text-gray-500">No favorite tutors yet</p>
                  <Link
                    to="/tutors"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Find Tutors
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <Link
                  to="/tutors"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <FaSearch className="mr-2" /> Find New Tutor
                </Link>
                <Link
                  to="/student/sessions"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  View All Sessions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}