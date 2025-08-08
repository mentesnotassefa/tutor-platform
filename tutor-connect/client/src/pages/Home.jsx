import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/images/hero.png';

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Tutoring session"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Find the Perfect Tutor
          </h1>
          <p className="mt-6 text-xl max-w-3xl">
            Connect with expert tutors in any subject, anytime, anywhere.
          </p>
          <div className="mt-10">
            {currentUser ? (
              <Link
                to="/tutors"
                className="inline-block bg-indigo-600 py-3 px-8 rounded-md text-lg font-medium hover:bg-indigo-700"
              >
                Browse Tutors
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-block bg-indigo-600 py-3 px-8 rounded-md text-lg font-medium hover:bg-indigo-700"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Us
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Expert Tutors',
                description: 'Verified professionals with proven teaching experience',
                icon: '👨‍🏫',
              },
              {
                name: 'Flexible Scheduling',
                description: 'Book sessions at your convenience, 24/7 availability',
                icon: '⏱️',
              },
              {
                name: 'Personalized Learning',
                description: 'Tailored lessons to match your learning style',
                icon: '🎯',
              },
            ].map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                  <div className="-mt-6">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {feature.name}
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}