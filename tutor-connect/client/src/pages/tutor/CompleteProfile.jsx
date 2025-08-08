import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash } from 'react-icons/fa';

const CompleteProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'tutor') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const validationSchema = Yup.object().shape({
    subjects: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Subject is required'),
        level: Yup.string().required('Level is required')
      })
    ).min(1, 'Add at least one subject'),
    education: Yup.array().of(
      Yup.object().shape({
        degree: Yup.string().required('Degree is required'),
        institution: Yup.string().required('Institution is required'),
        year: Yup.number().min(1900, 'Invalid year').max(new Date().getFullYear(), 'Invalid year')
      })
    ).min(1, 'Add at least one education'),
    hourlyRate: Yup.number().min(5, 'Minimum rate is $5').required('Required'),
    teachingMethods: Yup.object().test(
      'at-least-one-method',
      'Select at least one teaching method',
      (value) => value.online || value.inPerson
    ),
    bio: Yup.string().max(500, 'Bio too long').required('Required')
  });

  const formik = useFormik({
    initialValues: {
      subjects: [{ name: '', level: 'beginner' }],
      education: [{ degree: '', institution: '', year: '' }],
      hourlyRate: '',
      teachingMethods: { online: false, inPerson: false },
      bio: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const token = await auth.currentUser.getIdToken();
        await axios.put('/api/tutors/profile', values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Profile submitted for verification!');
        navigate('/tutor/dashboard');
      } catch (error) {
        toast.error('Failed to update profile');
        console.error('Profile submission error:', error);
      }
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Complete Your Tutor Profile</h1>
      <p className="mb-8 text-gray-600">
        Please fill out all required information. Your profile will be reviewed before appearing in search results.
      </p>
      
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Subjects Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Subjects You Teach</h2>
          {formik.values.subjects.map((subject, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  name={`subjects.${index}.name`}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  value={subject.name}
                  onChange={formik.handleChange}
                />
                {formik.errors.subjects?.[index]?.name && (
                  <div className="text-red-500 text-sm">{formik.errors.subjects[index].name}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Level</label>
                <select
                  name={`subjects.${index}.level`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  value={subject.level}
                  onChange={formik.handleChange}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              {index > 0 && (
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => {
                      const newSubjects = [...formik.values.subjects];
                      newSubjects.splice(index, 1);
                      formik.setFieldValue('subjects', newSubjects);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => formik.setFieldValue('subjects', [...formik.values.subjects, { name: '', level: 'beginner' }])}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
          >
            <FaPlus className="mr-2" /> Add Subject
          </button>
          {formik.errors.subjects && typeof formik.errors.subjects === 'string' && (
            <div className="text-red-500 text-sm mt-2">{formik.errors.subjects}</div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {formik.isSubmitting ? 'Submitting...' : 'Submit Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompleteProfile;