import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Page</h1>
        <p className="text-gray-600 mb-8">
          This is a sample about page to demonstrate routing.
        </p>
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default AboutPage;

