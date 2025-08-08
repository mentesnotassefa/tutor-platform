import { FieldArray, useFormikContext } from 'formik';
import { FaPlus, FaTrash } from 'react-icons/fa';

const TutorProfileForm = () => {
  const { values, errors, handleChange, handleBlur } = useFormikContext();

  return (
    <div className="space-y-6">
      {/* Education Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Education Background</h2>
        <FieldArray name="education">
          {({ push, remove }) => (
            <>
              {values.education.map((edu, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Degree</label>
                    <input
                      name={`education.${index}.degree`}
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                      value={edu.degree}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.education?.[index]?.degree && (
                      <div className="text-red-500 text-sm">{errors.education[index].degree}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Institution</label>
                    <input
                      name={`education.${index}.institution`}
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                      value={edu.institution}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.education?.[index]?.institution && (
                      <div className="text-red-500 text-sm">{errors.education[index].institution}</div>
                    )}
                  </div>
                  <div className="flex items-end space-x-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Year</label>
                      <input
                        name={`education.${index}.year`}
                        type="number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        value={edu.year}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.education?.[index]?.year && (
                        <div className="text-red-500 text-sm">{errors.education[index].year}</div>
                      )}
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => push({ degree: '', institution: '', year: '' })}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
              >
                <FaPlus className="mr-2" /> Add Education
              </button>
              {errors.education && typeof errors.education === 'string' && (
                <div className="text-red-500 text-sm mt-2">{errors.education}</div>
              )}
            </>
          )}
        </FieldArray>
      </div>

      {/* Other Profile Sections */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Teaching Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
            <input
              name="hourlyRate"
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              value={values.hourlyRate}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.hourlyRate && <div className="text-red-500 text-sm">{errors.hourlyRate}</div>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Teaching Methods</label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="teachingMethods.online"
                  checked={values.teachingMethods.online}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 shadow-sm"
                />
                <span className="ml-2">Online</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="teachingMethods.inPerson"
                  checked={values.teachingMethods.inPerson}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 shadow-sm"
                />
                <span className="ml-2">In-Person</span>
              </label>
            </div>
            {errors.teachingMethods && <div className="text-red-500 text-sm">{errors.teachingMethods}</div>}
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">About You</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio (Max 500 characters)</label>
          <textarea
            name="bio"
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            value={values.bio}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div className="text-right text-sm text-gray-500">
            {values.bio.length}/500
          </div>
          {errors.bio && <div className="text-red-500 text-sm">{errors.bio}</div>}
        </div>
      </div>
    </div>
  );
};

export default TutorProfileForm;