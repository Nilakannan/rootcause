import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FileText,
  ListOrdered,
  GitBranch,
  ShieldAlert,
  ClipboardCheck,
  History,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import Header from './components/Header';
import AiCopilotDrawer from './components/AiCopilotDrawer';
import IntakeTab from './components/tabs/IntakeTab';
import FiveWhysTab from './components/tabs/FiveWhysTab';
import FishboneTab from './components/tabs/FishboneTab';
import EvidenceGapsTab from './components/tabs/EvidenceGapsTab';
import RootCauseCapaTab from './components/tabs/RootCauseCapaTab';
import AuditSignoffTab from './components/tabs/AuditSignoffTab';
import ExportReportModal from './components/ExportReportModal';
import SignoffModal from './components/SignoffModal';
import NewInvestigationModal from './components/NewInvestigationModal';

import {
  setInvestigations,
  setCurrentInvestigation,
  setActiveTab
} from './store/investigationSlice';
import { api } from './services/api';

const TABS = [
  { id: 'intake', label: '1. Incident Intake & Deviation', icon: FileText },
  { id: 'five_whys', label: '2. 5 Whys Causal Tree', icon: ListOrdered },
  { id: 'fishbone', label: '3. Ishikawa 6M Diagram', icon: GitBranch },
  { id: 'evidence_gaps', label: '4. Evidence & Regulatory Gaps', icon: ShieldAlert },
  { id: 'root_cause_capa', label: '5. Root Cause & CAPA Plan', icon: ClipboardCheck },
  { id: 'audit_signoff', label: '6. Audit Trail & QP Sign-off', icon: History }
];

export default function App() {
  const dispatch = useDispatch();
  const { currentInvestigation, activeTab, isAiPanelOpen } = useSelector((state) => state.investigation);

  useEffect(() => {
    // Initial fetch of investigations
    api.getInvestigations()
      .then((list) => {
        dispatch(setInvestigations(list));
        if (list.length > 0) {
          // Fetch full details of the first one
          api.getInvestigation(list[0].id)
            .then((fullInv) => dispatch(setCurrentInvestigation(fullInv)))
            .catch(console.error);
        }
      })
      .catch((err) => {
        console.error('Failed to load initial investigations:', err);
      });
  }, [dispatch]);

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'intake': return <IntakeTab />;
      case 'five_whys': return <FiveWhysTab />;
      case 'fishbone': return <FishboneTab />;
      case 'evidence_gaps': return <EvidenceGapsTab />;
      case 'root_cause_capa': return <RootCauseCapaTab />;
      case 'audit_signoff': return <AuditSignoffTab />;
      default: return <IntakeTab />;
    }
  };

  return (
    <div className="app-container">
      {/* Top Application Header */}
      <Header />

      {/* Main Workspace Body */}
      <div className="workspace-layout">
        <main className={`main-content ${isAiPanelOpen ? 'drawer-open' : ''}`}>
          {/* Navigation Tabs */}
          <nav className="tabs-nav">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => dispatch(setActiveTab(tab.id))}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Active View Container */}
          {renderActiveTabContent()}
        </main>

        {/* AI Copilot Side Drawer */}
        <AiCopilotDrawer />
      </div>

      {/* Modals */}
      <ExportReportModal />
      <SignoffModal />
      <NewInvestigationModal />
    </div>
  );
}
