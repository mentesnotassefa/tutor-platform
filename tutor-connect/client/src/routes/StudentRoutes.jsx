import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const TutorList = lazy(() => import('../pages/student/TutorList'));
const TutorProfile = lazy(() => import('../pages/student/TutorProfile'));

function StudentRoutes() {
  return (
    <Routes>
      <Route path="tutors" element={<TutorList />} />
      <Route path="tutors/:id" element={<TutorProfile />} />
      {/* Other student routes... */}
    </Routes>
  );
}

export default StudentRoutes;