import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function VerifyTutors() {
  const [pendingTutors, setPendingTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPendingTutors = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.get('/api/admin/tutors/pending', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPendingTutors(response.data);
      } catch (error) {
        toast.error('Failed to fetch pending tutors');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingTutors();
  }, []);

  const handleVerification = async (tutorId, action) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        `/api/admin/tutors/${tutorId}/verify`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPendingTutors(pendingTutors.filter(tutor => tutor._id !== tutorId));
      toast.success(`Tutor ${action === 'approve' ? 'approved' : 'rejected'}`);
    } catch (error) {
      toast.error(`Verification failed: ${error.response?.data?.message || error.message}`);
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return <div className="text-center py-12">Unauthorized access</div>;
  }

  if (loading) return <div className="text-center py-12">Loading pending tutors...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tutor Verifications</h1>
        <p className="text-gray-600 mt-2">
          Review and approve tutor applications
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Pending Tutor Applications ({pendingTutors.length})
          </h3>
        </div>
        <div className="bg-white overflow-hidden">
          {pendingTutors.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500">
              No pending tutor applications
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pendingTutors.map((tutor) => (
                <li key={tutor._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {tutor.userId?.firstName?.charAt(0)}{tutor.userId?.lastName?.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {tutor.userId?.firstName} {tutor.userId?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {tutor.userId?.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleVerification(tutor._id, 'approve')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerification(tutor._id, 'reject')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Subjects:</span>{' '}
                        {tutor.subjects?.map(s => s.name).join(', ') || 'None specified'}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">Education:</span>{' '}
                        {tutor.education?.map(e => `${e.degree} (${e.institution})`).join(', ') || 'None specified'}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">Hourly Rate:</span> ${tutor.hourlyRate || 'Not specified'}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}