import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaStar, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaChalkboardTeacher } from 'react-icons/fa';
import TutorFilter from '../../components/student/TutorFilter';

const TutorList = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    subject: '',
    minRate: 0,
    maxRate: 100,
    teachingMethod: 'all',
    availability: []
  });
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.subject) params.append('subject', filters.subject);
        if (filters.minRate) params.append('minRate', filters.minRate);
        if (filters.maxRate) params.append('maxRate', filters.maxRate);
        if (filters.teachingMethod !== 'all') params.append('teachingMethod', filters.teachingMethod);
        if (filters.availability.length > 0) params.append('availability', filters.availability.join(','));
         params.append('verified', 'true'); 
        const response = await axios.get(`/api/tutors?${params.toString()}`);
        setTutors(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tutors');
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [filters]);

  const handleBookSession = (tutorId) => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/tutors' } });
      return;
    }
    navigate(`/book-session/${tutorId}`);
  };

  if (loading) return <div className="text-center py-8">Loading tutors...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Find Your Perfect Tutor</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <TutorFilter filters={filters} setFilters={setFilters} />
        </div>
        
        {/* Tutors List */}
        <div className="lg:col-span-3">
          {tutors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl">No tutors found matching your criteria</p>
              <button 
                onClick={() => setFilters({
                  subject: '',
                  minRate: 0,
                  maxRate: 100,
                  teachingMethod: 'all',
                  availability: []
                })}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tutors.map(tutor => (
                <TutorCard 
                  key={tutor._id} 
                  tutor={tutor} 
                  onBookSession={handleBookSession} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TutorCard = ({ tutor, onBookSession }) => {
  const primarySubject = tutor.subjects?.[0] || {};
  const primaryEducation = tutor.education?.[0] || {};

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Tutor Image and Basic Info */}
      <div className="p-4 border-b">
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
            {tutor.userId?.profilePicture ? (
              <img 
                src={tutor.userId.profilePicture} 
                alt={tutor.userId.firstName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-500">
                {tutor.userId?.firstName?.charAt(0)}{tutor.userId?.lastName?.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold">
              {tutor.userId?.firstName} {tutor.userId?.lastName}
            </h3>
            <p className="text-gray-600">{primarySubject.name} Tutor</p>
            
            <div className="flex items-center mt-1">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="font-medium">
                {tutor.rating?.toFixed(1) || 'New'}
              </span>
              <span className="text-gray-500 ml-2">
                ({tutor.reviews?.length || 0} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tutor Details */}
      <div className="p-4 space-y-3">
        <div className="flex items-center">
          <FaChalkboardTeacher className="text-gray-500 mr-2" />
          <span>
            Teaches: {tutor.subjects?.map(s => s.name).join(', ')}
          </span>
        </div>
        
        <div className="flex items-center">
          <FaMoneyBillWave className="text-gray-500 mr-2" />
          <span>${tutor.hourlyRate}/hour</span>
        </div>
        
        <div className="flex items-center">
          <FaMapMarkerAlt className="text-gray-500 mr-2" />
          <span>
            {tutor.teachingMethods?.online && tutor.teachingMethods?.inPerson 
              ? 'Online & In-Person' 
              : tutor.teachingMethods?.online 
                ? 'Online Only' 
                : 'In-Person Only'}
            {tutor.location?.city && ` (${tutor.location.city})`}
          </span>
        </div>
        
        <div className="flex items-center">
          <FaClock className="text-gray-500 mr-2" />
          <span>
            {tutor.availability?.length > 0 
              ? `${tutor.availability.length} time slots available` 
              : 'No availability set'}
          </span>
        </div>
        
        {primaryEducation.degree && (
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Education:</span> {primaryEducation.degree} 
              {primaryEducation.institution && ` from ${primaryEducation.institution}`}
            </p>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="p-4 bg-gray-50 flex justify-between">
        <button 
          onClick={() => onBookSession(tutor._id)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Book Session
        </button>
        <button 
          onClick={() => navigate(`/tutors/${tutor._id}`)}
          className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default TutorList;