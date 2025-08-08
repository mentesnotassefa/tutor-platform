import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

const VerifyTutors = () => {
  const [pendingTutors, setPendingTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchPendingTutors();
    }
  }, [currentUser]);

  const fetchPendingTutors = async () => {
    try {
      const response = await axios.get('/api/admin/pending-tutors');
      setPendingTutors(response.data);
    } catch (error) {
      console.error('Error fetching pending tutors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (tutorId, action) => {
    try {
      await axios.post('/api/admin/verify-tutor', { tutorId, action });
      fetchPendingTutors();
      toast.success(`Tutor ${action === 'approve' ? 'approved' : 'rejected'}`);
    } catch (error) {
      toast.error('Verification failed');
      console.error('Verification error:', error);
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return <div>Unauthorized</div>;
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Tutor Verifications</h1>
      
      {pendingTutors.length === 0 ? (
        <p>No tutors pending verification</p>
      ) : (
        <div className="space-y-4">
          {pendingTutors.map(tutor => (
            <div key={tutor._id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">
                {tutor.userId.firstName} {tutor.userId.lastName}
              </h3>
              <p>Subjects: {tutor.subjects.map(s => s.name).join(', ')}</p>
              <p>Rate: ${tutor.hourlyRate}/hour</p>
              
              <div className="mt-4 flex space-x-2">
                <button 
                  onClick={() => handleVerification(tutor._id, 'approve')}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleVerification(tutor._id, 'reject')}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Reject
                </button>
                <button 
                  onClick={() => window.open(`/admin/tutors/${tutor._id}`, '_blank')}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerifyTutors;