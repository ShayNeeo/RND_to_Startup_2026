import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Solutions } from './components/Solutions';
import { InteractiveSavingsCalculator } from './components/InteractiveSavingsCalculator';
import { WorkflowShowcase } from './components/WorkflowShowcase';
import { DriverAndDispatcherShowcase } from './components/DriverAndDispatcherShowcase';
import { Team } from './components/Team';
import { PricingAndPilot } from './components/PricingAndPilot';
import { Footer } from './components/Footer';
import { PilotModal } from './components/PilotModal';

export function App() {
  const [pilotModalOpen, setPilotModalOpen] = useState<boolean>(false);
  const [selectedInterest, setSelectedInterest] = useState<string>('Dùng thử miễn phí 4–6 tuần');

  const handleOpenPilotModal = (interest?: string) => {
    if (interest) {
      setSelectedInterest(interest);
    }
    setPilotModalOpen(true);
  };

  return (
    <div className="site-shell min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-greenlogix-lime selection:text-slate-950">
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-full bg-greenlogix-lime px-4 py-2 text-sm font-bold text-slate-950 shadow-xl transition-transform focus:translate-y-0"
      >
        Bỏ qua điều hướng
      </a>

      {/* Floating Glass Pill Top Bar */}
      <Navbar onOpenPilotModal={() => handleOpenPilotModal('Dùng thử miễn phí 4–6 tuần')} />

      <main id="main-content" tabIndex={-1}>
        {/* 1. Hero Section (Full Viewport Video with Barlow Condensed Headline & Route Map) */}
        <Hero onOpenPilotModal={() => handleOpenPilotModal('Dùng thử miễn phí 4–6 tuần')} />

        {/* 2. Solutions Section (4 Core VRPTW & Carbon Accounting Pillars) */}
        <Solutions />

        {/* 3. Interactive ROI & CO₂ Savings Calculator */}
        <InteractiveSavingsCalculator onOpenPilotModal={() => handleOpenPilotModal('Dùng thử miễn phí 4–6 tuần')} />

        {/* 4. 8-Step Interactive Dispatch Workflow */}
        <WorkflowShowcase />

        {/* 5. Dispatcher & Driver Web Portal Showcase */}
        <DriverAndDispatcherShowcase />

        {/* 6. Interdisciplinary Founding Team */}
        <Team />

        {/* 7. Pricing & Pilot Program */}
        <PricingAndPilot onOpenPilotModal={handleOpenPilotModal} />
      </main>

      {/* Footer */}
      <Footer onOpenPilotModal={() => handleOpenPilotModal('Dùng thử miễn phí 4–6 tuần')} />

      {/* Pilot Registration Modal */}
      <PilotModal
        isOpen={pilotModalOpen}
        onClose={() => setPilotModalOpen(false)}
        initialInterest={selectedInterest}
      />
    </div>
  );
}

export default App;
