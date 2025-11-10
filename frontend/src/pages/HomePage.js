import MainLayout from '../layouts/MainLayout';
import HeroSection from '../components/HeroSection';
import JobSelectionSection from '../components/JobSelectionSection';
import FeaturesSection from '../components/FeaturesSection';
import CTASection from '../components/CTASection';

function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <JobSelectionSection />
      <FeaturesSection />
      <CTASection />
    </MainLayout>
  );
}

export default HomePage;

