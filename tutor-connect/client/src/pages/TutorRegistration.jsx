import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const TutorRegistration = () => {
  const { currentUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const initialValues = {
    subjects: [{ name: '', level: 'beginner' }],
    education: [{ degree: '', institution: '', yearCompleted: '' }],
    experience: { years: 0, description: '' },
    hourlyRate: '',
    availability: [],
    teachingMethods: { inPerson: false, online: false },
    location: {
      address: '',
      city: '',
      country: '',
      coordinates: { lat: null, lng: null }
    }
  };

  const validationSchema = Yup.object().shape({
    subjects: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Subject is required'),
        level: Yup.string().required('Level is required')
      })
    ),
    education: Yup.array().of(
      Yup.object().shape({
        degree: Yup.string().required('Degree is required'),
        institution: Yup.string().required('Institution is required'),
        yearCompleted: Yup.number().min(1900, 'Invalid year')
      })
    ),
    hourlyRate: Yup.number().min(5, 'Minimum rate is $5').required('Hourly rate is required'),
    teachingMethods: Yup.object().test(
      'at-least-one-method',
      'Select at least one teaching method',
      (value) => value.inPerson || value.online
    )
  });

  const handleSubmit = async (values) => {
    if (!currentUser) return;
    
    setSubmitting(true);
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.put('/api/tutors/profile', values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Complete Your Tutor Profile</h1>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Subjects Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Subjects You Teach</h2>
              {values.subjects.map((subject, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <Field
                      name={`subjects.${index}.name`}
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    <ErrorMessage name={`subjects.${index}.name`} component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Level</label>
                    <Field
                      as="select"
                      name={`subjects.${index}.level`}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </Field>
                  </div>
                  {index > 0 && (
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => {
                          const newSubjects = [...values.subjects];
                          newSubjects.splice(index, 1);
                          setFieldValue('subjects', newSubjects);
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFieldValue('subjects', [...values.subjects, { name: '', level: 'beginner' }])}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Add Another Subject
              </button>
            </div>

            {/* Education Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Education Background</h2>
              {values.education.map((edu, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Degree</label>
                    <Field
                      name={`education.${index}.degree`}
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    <ErrorMessage name={`education.${index}.degree`} component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Institution</label>
                    <Field
                      name={`education.${index}.institution`}
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    <ErrorMessage name={`education.${index}.institution`} component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year Completed</label>
                    <Field
                      name={`education.${index}.yearCompleted`}
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    <ErrorMessage name={`education.${index}.yearCompleted`} component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFieldValue('education', [...values.education, { degree: '', institution: '', yearCompleted: '' }])}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Add Another Education
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                {submitting ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TutorRegistration;