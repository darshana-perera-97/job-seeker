import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Build Something
          <span className="block text-gray-600 mt-2">Amazing Today</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 leading-relaxed">
          A modern, minimalistic platform designed to help you create beautiful experiences
          with clean design and powerful functionality.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm"
          >
            Start Free Trial
          </Link>
          <button className="px-8 py-3 bg-white text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

