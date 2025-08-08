import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TutorCard from '../../components/student/TutorCard';
import TutorFilter from '../../components/student/TutorFilter';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const TutorList = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
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
        let url = '/api/tutors?verified=true';
        if (searchTerm) url += `&search=${searchTerm}`;
        
        const response = await axios.get(url);
        setTutors(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tutors');
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [searchTerm, filters]);

  const handleBookSession = (tutorId) => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/tutors' } });
      return;
    }
    navigate(`/book-session/${tutorId}`);
  };

  if (loading) return <div className="text-center py-12">Loading tutors...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Tutors</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tutors..."
              className="pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center"
          >
            <FaFilter className="mr-2" /> Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-8">
          <TutorFilter filters={filters} setFilters={setFilters} />
        </div>
      )}

      {tutors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl">No tutors found matching your criteria</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilters({
                subject: '',
                minRate: 0,
                maxRate: 100,
                teachingMethod: 'all',
                availability: []
              });
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
};

export default TutorList;