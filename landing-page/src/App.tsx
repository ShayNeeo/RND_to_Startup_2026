import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InteractiveSavingsCalculator } from './components/InteractiveSavingsCalculator';
import { Solutions } from './components/Solutions';
import { WorkflowShowcase } from './components/WorkflowShowcase';
import { DriverAndDispatcherShowcase } from './components/DriverAndDispatcherShowcase';
import { ImpactAndSDG } from './components/ImpactAndSDG';
import { PricingAndPilot } from './components/PricingAndPilot';
import { TeamAndCompetition } from './components/TeamAndCompetition';
import { Footer } from './components/Footer';
import { PilotModal } from './components/PilotModal';

export function App() {
  const [isPilotModalOpen, setIsPilotModalOpen] = useState(false);

  const handleOpenPilotModal = () => {
    setIsPilotModalOpen(true);
  };

  const handleClosePilotModal = () => {
    setIsPilotModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#4B5563] flex flex-col selection:bg-[#5C7D52]/20 selection:text-[#5C7D52]">
      {/* Navigation */}
      <Navbar onOpenPilotModal={handleOpenPilotModal} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section with 3D Video & Live Telemetry */}
        <Hero onOpenPilotModal={handleOpenPilotModal} />

        {/* 2. Interactive ROI & CO2 Savings Simulator */}
        <InteractiveSavingsCalculator onOpenPilotModal={handleOpenPilotModal} />

        {/* 3. Core Solutions (4 Feature Cards with Curved Masks) */}
        <Solutions onOpenPilotModal={handleOpenPilotModal} />

        {/* 4. 8-Step Dispatch Workflow & Before vs. After */}
        <WorkflowShowcase onOpenPilotModal={handleOpenPilotModal} />

        {/* 5. Dispatcher Web Portal & Driver Mobile App Showcase */}
        <DriverAndDispatcherShowcase />

        {/* 6. Environmental Impact, SDGs & National Policy */}
        <ImpactAndSDG />

        {/* 7. Pricing Tiers & Free Pilot 4-6 Weeks Program */}
        <PricingAndPilot onOpenPilotModal={handleOpenPilotModal} />

        {/* 8. Interdisciplinary Team & Competition */}
        <TeamAndCompetition />
      </main>

      {/* Global Footer */}
      <Footer onOpenPilotModal={handleOpenPilotModal} />

      {/* Interactive Pilot Registration Modal */}
      <PilotModal
        isOpen={isPilotModalOpen}
        onClose={handleClosePilotModal}
      />
    </div>
  );
}

export default App;
