import { Link } from 'react-router-dom';

function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-100">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of users who are already building amazing things.
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm"
        >
          Start Your Journey
        </Link>
      </div>
    </section>
  );
}

export default CTASection;

