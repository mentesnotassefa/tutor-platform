import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaStar, FaCalendarAlt, FaClock, FaChalkboardTeacher, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import BookingModal from '../../components/student/BookingModal';

export default function TutorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchTutorProfile = async () => {
      try {
        const response = await axios.get(`/api/tutors/${id}`);
        setTutor(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load tutor profile');
      } finally {
        setLoading(false);
      }
    };

    fetchTutorProfile();
  }, [id]);

  const handleBookSession = (slot) => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/tutors/${id}` } });
      return;
    }
    setSelectedSlot(slot);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        '/api/bookings',
        {
          tutorId: id,
          ...bookingData
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Session booked successfully!');
      setShowBookingModal(false);
      // Refresh tutor data to show updated availability
      const response = await axios.get(`/api/tutors/${id}`);
      setTutor(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book session');
    }
  };

  if (loading) return <div className="text-center py-12">Loading tutor profile...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!tutor) return <div className="text-center py-12">Tutor not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Tutor Header Section */}
        <div className="px-6 py-8 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-24 w-24 rounded-full bg-gray-200 overflow-hidden">
              {tutor.userId?.profilePicture ? (
                <img
                  src={tutor.userId.profilePicture}
                  alt={`${tutor.userId.firstName} ${tutor.userId.lastName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-gray-500">
                  {tutor.userId?.firstName?.charAt(0)}{tutor.userId?.lastName?.charAt(0)}
                </div>
              )}
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {tutor.userId?.firstName} {tutor.userId?.lastName}
              </h1>
              <div className="flex items-center mt-1">
                <FaStar className="text-yellow-400" />
                <span className="ml-1 font-medium">
                  {tutor.rating?.toFixed(1) || 'New'}
                </span>
                <span className="ml-2 text-gray-500">
                  ({tutor.reviews?.length || 0} reviews)
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {tutor.subjects?.map((subject, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {subject.name} ({subject.level})
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => handleBookSession(null)}
              disabled={!tutor.availability || tutor.availability.length === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Book Session
            </button>
          </div>
        </div>

        <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tutor Details */}
          <div className="lg:col-span-2">
            {/* About Section */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">About</h2>
              {tutor.bio ? (
                <p className="text-gray-600 whitespace-pre-line">{tutor.bio}</p>
              ) : (
                <p className="text-gray-500 italic">No bio provided</p>
              )}
            </div>

            {/* Education Section */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Education</h2>
              {tutor.education?.length > 0 ? (
                <ul className="space-y-4">
                  {tutor.education.map((edu, index) => (
                    <li key={index}>
                      <h3 className="font-medium">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      {edu.year && (
                        <p className="text-sm text-gray-500">Completed {edu.year}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No education information provided</p>
              )}
            </div>

            {/* Experience Section */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Experience</h2>
              {tutor.experience ? (
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">{tutor.experience.years || '0'}</span> years of experience
                  </p>
                  {tutor.experience.description && (
                    <p className="mt-2 text-gray-600 whitespace-pre-line">
                      {tutor.experience.description}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">No experience information provided</p>
              )}
            </div>

            {/* Reviews Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Reviews</h2>
              {tutor.reviews?.length > 0 ? (
                <div className="space-y-6">
                  {tutor.reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {review.userId?.firstName?.charAt(0)}{review.userId?.lastName?.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium">
                            {review.userId?.firstName} {review.userId?.lastName}
                          </h4>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-gray-600">{review.comment}</p>
                        <p className="mt-2 text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No reviews yet</p>
              )}
            </div>
          </div>

          {/* Right Column - Booking Info */}
          <div>
            <div className="bg-gray-50 p-6 rounded-lg sticky top-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Session Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaMoneyBillWave className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Hourly Rate</p>
                    <p className="text-lg font-medium text-gray-900">
                      ${tutor.hourlyRate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FaChalkboardTeacher className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Teaching Method</p>
                    <p className="text-lg font-medium text-gray-900">
                      {tutor.teachingMethods?.online && tutor.teachingMethods?.inPerson
                        ? 'Online & In-Person'
                        : tutor.teachingMethods?.online
                        ? 'Online Only'
                        : 'In-Person Only'}
                    </p>
                  </div>
                </div>

                {tutor.location?.city && (
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-lg font-medium text-gray-900">
                        {tutor.location.city}, {tutor.location.country}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Availability Section */}
              <div className="mt-8">
                <h3 className="text-md font-medium text-gray-900 mb-3">Available Time Slots</h3>
                {tutor.availability?.length > 0 ? (
                  <div className="space-y-3">
                    {tutor.availability.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleBookSession(slot)}
                      >
                        <div>
                          <p className="font-medium">
                            {new Date(slot.start).toLocaleDateString([], {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(slot.start).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })} -{' '}
                            {new Date(slot.end).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Book
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No available time slots</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        tutor={tutor}
        selectedSlot={selectedSlot}
        onSubmit={handleBookingSubmit}
      />
    </div>
  );
}