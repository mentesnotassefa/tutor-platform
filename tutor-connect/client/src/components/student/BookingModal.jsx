import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const BookingModal = ({ isOpen, onClose, tutor, selectedSlot, onSubmit }) => {
  const [submitting, setSubmitting] = useState(false);

  // Form validation schema
  const validationSchema = Yup.object().shape({
    date: Yup.date().required('Required'),
    startTime: Yup.string().required('Required'),
    duration: Yup.number()
      .min(30, 'Minimum 30 minutes')
      .max(120, 'Maximum 120 minutes')
      .required('Required'),
    subject: Yup.string().required('Required'),
    notes: Yup.string().max(500, 'Maximum 500 characters'),
  });

  // Initial values based on selected slot or empty
  const initialValues = selectedSlot
    ? {
        date: new Date(selectedSlot.start),
        startTime: new Date(selectedSlot.start).toTimeString().substring(0, 5),
        duration: 60,
        subject: tutor.subjects?.[0]?.name || '',
        notes: '',
      }
    : {
        date: '',
        startTime: '',
        duration: 60,
        subject: tutor.subjects?.[0]?.name || '',
        notes: '',
      };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const startDateTime = new Date(values.date);
        const [hours, minutes] = values.startTime.split(':');
        startDateTime.setHours(parseInt(hours, 10));
        startDateTime.setMinutes(parseInt(minutes, 10));
        
        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + values.duration);

        await onSubmit({
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          subject: values.subject,
          notes: values.notes,
          price: (values.duration / 60) * tutor.hourlyRate,
        });
      } catch (error) {
        console.error('Booking error:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Transition.Root show={isOpen} as="div">
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Book Session with {tutor.userId?.firstName} {tutor.userId?.lastName}
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      ${tutor.hourlyRate}/hour • {tutor.teachingMethods?.online ? 'Online' : ''}{' '}
                      {tutor.teachingMethods?.online && tutor.teachingMethods?.inPerson
                        ? '& '
                        : ''}
                      {tutor.teachingMethods?.inPerson ? 'In-Person' : ''}
                    </p>
                  </div>
                </div>
              </div>
              <form onSubmit={formik.handleSubmit} className="mt-5">
                <div className="space-y-4">
                  {/* Date Field */}
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.date ? new Date(formik.values.date).toISOString().split('T')[0] : ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {formik.touched.date && formik.errors.date ? (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.date}</p>
                    ) : null}
                  </div>

                  {/* Time Field */}
                  <div>
                    <label
                      htmlFor="startTime"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start Time
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.startTime}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {formik.touched.startTime && formik.errors.startTime ? (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.startTime}</p>
                    ) : null}
                  </div>

                  {/* Duration Field */}
                  <div>
                    <label
                      htmlFor="duration"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Duration (minutes)
                    </label>
                    <select
                      id="duration"
                      name="duration"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.duration}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                      <option value="120">120 minutes</option>
                    </select>
                    {formik.touched.duration && formik.errors.duration ? (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.duration}</p>
                    ) : null}
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.subject}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      {tutor.subjects?.map((subject) => (
                        <option key={subject.name} value={subject.name}>
                          {subject.name} ({subject.level})
                        </option>
                      ))}
                    </select>
                    {formik.touched.subject && formik.errors.subject ? (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.subject}</p>
                    ) : null}
                  </div>

                  {/* Notes Field */}
                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.notes}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {formik.touched.notes && formik.errors.notes ? (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.notes}</p>
                    ) : null}
                  </div>

                  {/* Price Calculation */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm font-medium text-gray-700">
                      Session Cost:{' '}
                      <span className="text-lg font-bold text-indigo-600">
                        ${((formik.values.duration / 60) * tutor.hourlyRate).toFixed(2)}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formik.values.duration} minutes × ${tutor.hourlyRate}/hour
                    </p>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                  >
                    {submitting ? 'Booking...' : 'Confirm Booking'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default BookingModal;