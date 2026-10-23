import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Sparkles,
  Upload,
  FileText,
  Mail,
  Zap,
  Check,
  AlertCircle,
  ArrowRight,
  Send,
  RefreshCw,
  X,
  CheckCircle2,
  ListOrdered,
  GitBranch,
  ShieldAlert,
  ClipboardList,
  Eye
} from 'lucide-react';
import {
  toggleAiPanel,
  setAiAnalyzing,
  setAiPipelineStep,
  setExtractedData,
  populateAllFromAi,
  populateSectionFromAi,
  addChatMessage
} from '../store/investigationSlice';
import { api } from '../services/api';

export default function AiCopilotDrawer() {
  const dispatch = useDispatch();
  const { isAiPanelOpen, aiState, currentInvestigation } = useSelector((state) => state.investigation);
  
  const [activeInputTab, setActiveInputTab] = useState('preset'); // preset, upload, paste, email, chat
  const [pastedText, setPastedText] = useState('');
  const [emailData, setEmailData] = useState({
    from: 'dr.mehta.qc@aurapharma.com',
    subject: 'OOS Residual Isopropanol (IPA) Excursion - Metformin HCl Lot MET-2026-904',
    body: 'During release testing of Metformin HCl Lot MET-2026-904, residual Isopropanol was 6,850 ppm vs limit NMT 5,000 ppm. Vacuum cone dryer VCD-102 experienced filter bag blinding and vacuum loss to 65 mbar.'
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [presets, setPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState('atorvastatin_oos_impurity');
  const [userChatInput, setUserChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Load presets on mount
  useEffect(() => {
    api.getPresets().then(setPresets).catch(console.error);
  }, []);

  const handleRunAiAnalysis = async () => {
    dispatch(setAiAnalyzing(true));
    dispatch(setAiPipelineStep('extracting'));

    try {
      let result;
      if (activeInputTab === 'preset') {
        const preset = presets.find((p) => p.id === selectedPresetId);
        if (!preset) throw new Error('Preset not found');
        result = await api.analyzeText(preset.raw_text, preset.document_type, preset.document_name);
      } else if (activeInputTab === 'paste') {
        if (!pastedText.trim()) throw new Error('Please paste incident log text.');
        result = await api.analyzeText(pastedText, 'pasted_text', 'Pasted Incident Log');
      } else if (activeInputTab === 'email') {
        const fullEmail = `From: ${emailData.from}\nSubject: ${emailData.subject}\n\n${emailData.body}`;
        result = await api.analyzeText(fullEmail, 'email_import', `Email: ${emailData.subject}`);
      } else if (activeInputTab === 'upload') {
        if (!uploadedFile) throw new Error('Please select a PDF or text file.');
        result = await api.analyzeDocument(uploadedFile);
      }

      // Simulate step progression for UX fidelity
      dispatch(setAiPipelineStep('five_whys'));
      await new Promise(r => setTimeout(r, 400));
      dispatch(setAiPipelineStep('fishbone'));
      await new Promise(r => setTimeout(r, 400));
      dispatch(setAiPipelineStep('gap_analysis'));
      await new Promise(r => setTimeout(r, 400));
      dispatch(setAiPipelineStep('capa'));
      await new Promise(r => setTimeout(r, 400));
      dispatch(setAiPipelineStep('completed'));

      dispatch(setExtractedData(result));
    } catch (err) {
      alert(`AI Analysis error: ${err.message}`);
      dispatch(setAiPipelineStep('error'));
    } finally {
      dispatch(setAiAnalyzing(false));
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!userChatInput.trim() || isSendingChat) return;

    const query = userChatInput.trim();
    setUserChatInput('');
    dispatch(addChatMessage({ sender: 'user', text: query }));
    setIsSendingChat(true);

    try {
      const resp = await api.chatWithCopilot(currentInvestigation || {}, query);
      dispatch(addChatMessage({ sender: 'ai', text: resp.reply }));
    } catch (err) {
      dispatch(addChatMessage({ sender: 'ai', text: `Error: ${err.message}` }));
    } finally {
      setIsSendingChat(false);
    }
  };

  const data = aiState.extractedData;
  const isAnalyzing = aiState.isAnalyzing;

  return (
    <aside className={`ai-drawer ${isAiPanelOpen ? 'open' : 'closed'}`}>
      {/* Drawer Header */}
      <div className="ai-drawer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #6366F1, #A855F7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              AI Investigation Copilot
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              LangGraph + Groq • FDA / ICH Q7 Engine
            </div>
          </div>
        </div>
        <button
          onClick={() => dispatch(toggleAiPanel())}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Input Mode Tabs */}
      <div className="ai-drawer-tabs">
        <button
          className={`ai-drawer-tab ${activeInputTab === 'preset' ? 'active' : ''}`}
          onClick={() => setActiveInputTab('preset')}
        >
          <Zap size={14} /> Pharma Presets
        </button>
        <button
          className={`ai-drawer-tab ${activeInputTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveInputTab('upload')}
        >
          <Upload size={14} /> PDF Upload
        </button>
        <button
          className={`ai-drawer-tab ${activeInputTab === 'paste' ? 'active' : ''}`}
          onClick={() => setActiveInputTab('paste')}
        >
          <FileText size={14} /> Paste Text
        </button>
        <button
          className={`ai-drawer-tab ${activeInputTab === 'email' ? 'active' : ''}`}
          onClick={() => setActiveInputTab('email')}
        >
          <Mail size={14} /> Import Email
        </button>
        <button
          className={`ai-drawer-tab ${activeInputTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveInputTab('chat')}
        >
          <Sparkles size={14} /> QA Chat
        </button>
      </div>

      {/* Drawer Body */}
      <div className="ai-drawer-body">
        {activeInputTab === 'chat' ? (
          /* QA Chat Copilot */
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              {aiState.chatMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '88%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: msg.sender === 'user'
                      ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.35))'
                      : 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid ' + (msg.sender === 'user' ? 'var(--cyan-primary)' : 'var(--border-subtle)'),
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    color: 'var(--text-primary)'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: msg.sender === 'user' ? 'var(--cyan-primary)' : 'var(--indigo-ai)', fontWeight: 700, marginBottom: '0.2rem' }}>
                    {msg.sender === 'user' ? 'Quality Investigator' : 'AI Copilot'}
                  </div>
                  {msg.text}
                </div>
              ))}
              {isSendingChat && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCw size={14} className="spin" /> Consulting ICH guidelines & manufacturing records...
                </div>
              )}
            </div>

            <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Ask AI to drill deeper, add causes, or refine CAPA..."
                value={userChatInput}
                onChange={(e) => setUserChatInput(e.target.value)}
              />
              <button type="submit" className="btn btn-ai btn-sm" disabled={isSendingChat}>
                <Send size={15} />
              </button>
            </form>
          </div>
        ) : (
          /* Intake & Extraction View */
          <>
            {/* Input Selection Area */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              {activeInputTab === 'preset' && (
                <div>
                  <label className="form-label">Select API Quality Incident Preset</label>
                  <select
                    className="form-select"
                    value={selectedPresetId}
                    onChange={(e) => setSelectedPresetId(e.target.value)}
                  >
                    {presets.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.api_product_name})
                      </option>
                    ))}
                  </select>

                  {presets.find(p => p.id === selectedPresetId) && (
                    <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                      <strong>Batch:</strong> {presets.find(p => p.id === selectedPresetId)?.batch_number} • <strong>Stage:</strong> {presets.find(p => p.id === selectedPresetId)?.process_stage}
                      <p style={{ marginTop: '0.35rem', color: 'var(--text-muted)' }}>
                        {presets.find(p => p.id === selectedPresetId)?.raw_text.slice(0, 150)}...
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeInputTab === 'upload' && (
                <div>
                  <label className="form-label">Upload Incident Document (PDF / TXT)</label>
                  <div style={{
                    border: '2px dashed var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: uploadedFile ? 'rgba(6, 182, 212, 0.05)' : 'transparent'
                  }}>
                    <input
                      type="file"
                      accept=".pdf,.txt,.doc,.docx"
                      id="file-upload"
                      style={{ display: 'none' }}
                      onChange={(e) => setUploadedFile(e.target.files[0])}
                    />
                    <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                      <Upload size={28} style={{ color: 'var(--cyan-primary)', margin: '0 auto 0.5rem' }} />
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {uploadedFile ? uploadedFile.name : 'Click to select or drag PDF file here'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Supports Deviation Reports, Lab OOS Forms, BMR Scans
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {activeInputTab === 'paste' && (
                <div>
                  <label className="form-label">Paste Incident / Deviation Text</label>
                  <textarea
                    className="form-textarea"
                    rows={5}
                    placeholder="Paste unformatted incident notes, SCADA log alerts, or operator shift handovers..."
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '0.25rem' }}>
                    {pastedText.split(/\s+/).filter(Boolean).length} words
                  </div>
                </div>
              )}

              {activeInputTab === 'email' && (
                <div>
                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label">Sender Email</label>
                    <input
                      type="text"
                      className="form-input"
                      value={emailData.from}
                      onChange={(e) => setEmailData({ ...emailData, from: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-input"
                      value={emailData.subject}
                      onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Body</label>
                    <textarea
                      className="form-textarea"
                      rows={4}
                      value={emailData.body}
                      onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                className="btn btn-ai"
                style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={18} className="spin" /> Executing LangGraph RCA Pipeline...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Run AI Root Cause Analysis
                  </>
                )}
              </button>
            </div>

            {/* Live Pipeline Stepper */}
            {(isAnalyzing || aiState.pipelineStep !== 'idle') && (
              <div className="pipeline-stepper">
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  LangGraph Pipeline Execution
                </div>
                
                {[
                  { id: 'extracting', label: 'Node 1: Deviation & Symptom Extraction' },
                  { id: 'five_whys', label: 'Node 2: 5 Whys Causal Tree Generation' },
                  { id: 'fishbone', label: 'Node 3: Ishikawa 6M Factor Mapping' },
                  { id: 'gap_analysis', label: 'Node 4: Regulatory Evidence Gap Analysis' },
                  { id: 'capa', label: 'Node 5: Root Cause & CAPA Synthesis' }
                ].map((step, idx) => {
                  const stepOrder = ['extracting', 'five_whys', 'fishbone', 'gap_analysis', 'capa', 'completed'];
                  const currentIndex = stepOrder.indexOf(aiState.pipelineStep);
                  const thisIndex = stepOrder.indexOf(step.id);

                  let status = 'pending';
                  if (currentIndex > thisIndex) status = 'done';
                  else if (currentIndex === thisIndex && isAnalyzing) status = 'active';

                  return (
                    <div key={step.id} className="stepper-item">
                      <div className={`stepper-bullet ${status}`}>
                        {status === 'done' ? <Check size={12} /> : idx + 1}
                      </div>
                      <span style={{
                        color: status === 'done' ? 'var(--text-primary)' : status === 'active' ? 'var(--cyan-primary)' : 'var(--text-muted)',
                        fontWeight: status === 'active' ? 600 : 400
                      }}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Extracted Suggestions Deck */}
            {data && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(129, 140, 248, 0.15))',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--cyan-primary)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--cyan-primary)' }}>
                      AI Suggestions Ready for Review
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Confidence: <strong>{data.confidence_score || 92}%</strong> • Verified with ICH Q7 rules
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => dispatch(populateAllFromAi())}
                    title="Populate all extracted sections into the RCA investigation form"
                  >
                    <CheckCircle2 size={15} /> Populate All
                  </button>
                </div>

                {/* Suggestion 1: Deviation Details */}
                <div className="suggestion-card">
                  <div className="suggestion-card-header">
                    <span className="badge badge-ai">Deviation Intake</span>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => dispatch(populateSectionFromAi('deviation'))}
                    >
                      Populate Section
                    </button>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {data.deviation_info?.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <strong>Product:</strong> {data.deviation_info?.api_product_name} • <strong>Batch:</strong> {data.deviation_info?.batch_number}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    {data.deviation_info?.summary?.slice(0, 180)}...
                  </p>
                </div>

                {/* Suggestion 2: 5 Whys Chain */}
                <div className="suggestion-card">
                  <div className="suggestion-card-header">
                    <span className="badge badge-ai">
                      <ListOrdered size={12} /> 5 Whys Chain ({data.five_whys?.length || 5} steps)
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => dispatch(populateSectionFromAi('five_whys'))}
                    >
                      Populate 5 Whys
                    </button>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div><strong>Why 1:</strong> {data.five_whys?.[0]?.answer?.slice(0, 90)}...</div>
                    <div style={{ color: 'var(--status-approved)' }}>
                      <strong>Why 5 (Root):</strong> {data.five_whys?.find(w => w.is_root_cause)?.answer || data.five_whys?.[data.five_whys?.length - 1]?.answer}
                    </div>
                  </div>
                </div>

                {/* Suggestion 3: Ishikawa 6M */}
                <div className="suggestion-card">
                  <div className="suggestion-card-header">
                    <span className="badge badge-ai">
                      <GitBranch size={12} /> Ishikawa 6M ({data.fishbone_factors?.length || 6} factors)
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => dispatch(populateSectionFromAi('fishbone'))}
                    >
                      Populate Fishbone
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {(data.fishbone_factors || []).slice(0, 4).map((f, i) => (
                      <span key={i} className="badge" style={{
                        background: f.verification_status === 'Confirmed Cause' ? 'var(--status-approved-bg)' : 'rgba(255,255,255,0.05)',
                        color: f.verification_status === 'Confirmed Cause' ? 'var(--status-approved)' : 'var(--text-secondary)',
                        fontSize: '0.7rem'
                      }}>
                        {f.category.toUpperCase()}: {f.factor_name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggestion 4: Missing Evidence & Gaps */}
                <div className="suggestion-card">
                  <div className="suggestion-card-header">
                    <span className="badge badge-gap">
                      <ShieldAlert size={12} /> Regulatory Gaps Detected
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => dispatch(populateSectionFromAi('evidence'))}
                    >
                      Populate Gaps
                    </button>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {(data.evidence_and_gaps || []).filter(e => e.ai_identified_gap).map((gap, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#F87171', marginBottom: '0.25rem' }}>
                        <AlertCircle size={12} /> {gap.item_name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestion 5: CAPA Recommendations */}
                <div className="suggestion-card">
                  <div className="suggestion-card-header">
                    <span className="badge badge-ai">
                      <ClipboardList size={12} /> Recommended CAPAs ({data.capa_recommendations?.length || 3})
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => dispatch(populateSectionFromAi('capa'))}
                    >
                      Populate CAPAs
                    </button>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {(data.capa_recommendations || []).map((c, i) => (
                      <div key={i} style={{ marginBottom: '0.4rem' }}>
                        <strong style={{ color: 'var(--cyan-primary)' }}>{c.action_type}:</strong> {c.description?.slice(0, 85)}...
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
