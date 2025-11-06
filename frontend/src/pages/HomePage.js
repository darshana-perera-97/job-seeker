import MainLayout from '../layouts/MainLayout';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import CTASection from '../components/CTASection';

function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </MainLayout>
  );
}

export default HomePage;

