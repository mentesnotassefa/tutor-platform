import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TutorProfileForm from '../../components/tutor/TutorProfileForm';
import { toast } from 'react-toastify';

const CompleteProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'tutor') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (values) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.put(
        '/api/tutors/profile',
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Profile submitted for verification!');
      navigate('/tutor/dashboard');
    } catch (error) {
      toast.error('Error completing profile');
      console.error('Profile submission error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Complete Your Tutor Profile</h1>
      <p className="mb-8 text-gray-600">
        Please fill out all required information. Your profile will be reviewed 
        before appearing in search results (usually within 24 hours).
      </p>
      
      <TutorProfileForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CompleteProfile;