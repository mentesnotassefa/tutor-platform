import { useState } from 'react';

const TutorFilter = ({ filters, setFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  
  const subjects = [
    'Mathematics', 'English', 'Science', 
    'History', 'Computer Science', 'Foreign Languages'
  ];
  
  const days = [
    'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const handleApplyFilters = () => {
    setFilters(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      subject: '',
      minRate: 0,
      maxRate: 100,
      teachingMethod: 'all',
      availability: []
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
  };

  const toggleAvailability = (day) => {
    setLocalFilters(prev => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter(d => d !== day)
        : [...prev.availability, day]
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Filter Tutors</h3>
      
      <div className="space-y-5">
        {/* Subject Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <select
            value={localFilters.subject}
            onChange={(e) => setLocalFilters({...localFilters, subject: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        
        {/* Rate Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="0"
              value={localFilters.minRate}
              onChange={(e) => setLocalFilters({...localFilters, minRate: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Min"
            />
            <span>to</span>
            <input
              type="number"
              min={localFilters.minRate}
              value={localFilters.maxRate}
              onChange={(e) => setLocalFilters({...localFilters, maxRate: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Max"
            />
          </div>
        </div>
        
        {/* Teaching Method Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teaching Method</label>
          <select
            value={localFilters.teachingMethod}
            onChange={(e) => setLocalFilters({...localFilters, teachingMethod: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="all">All Methods</option>
            <option value="online">Online Only</option>
            <option value="inPerson">In-Person Only</option>
            <option value="both">Both Online & In-Person</option>
          </select>
        </div>
        
        {/* Availability Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
          <div className="grid grid-cols-2 gap-2">
            {days.map(day => (
              <button
                key={day}
                type="button"
                onClick={() => toggleAvailability(day)}
                className={`p-2 text-sm rounded ${
                  localFilters.availability.includes(day)
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4">
          <button
            onClick={handleApplyFilters}
            className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorFilter;