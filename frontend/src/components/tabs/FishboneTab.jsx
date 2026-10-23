import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PlusCircle, Trash2, GitBranch, CheckCircle2, AlertTriangle, XCircle, Clock, Sparkles } from 'lucide-react';
import { updateFishboneFactor, addFishboneFactor, deleteFishboneFactor } from '../../store/investigationSlice';

const CATEGORIES = [
  { id: 'machine', label: 'Machine (Equipment)', color: '#06B6D4' },
  { id: 'method', label: 'Method (Process / SOP)', color: '#818CF8' },
  { id: 'milieu', label: 'Milieu (Environment / HVAC)', color: '#A855F7' },
  { id: 'man', label: 'Man (Personnel / Training)', color: '#F59E0B' },
  { id: 'material', label: 'Material (Solvents / Reagents)', color: '#EC4899' },
  { id: 'measurement', label: 'Measurement (Lab / Sensor)', color: '#10B981' }
];

export default function FishboneTab() {
  const dispatch = useDispatch();
  const currentInvestigation = useSelector((state) => state.investigation.currentInvestigation);
  const factors = currentInvestigation?.fishbone_factors || [];

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [newFactorCategory, setNewFactorCategory] = useState('machine');
  const [newFactorName, setNewFactorName] = useState('');
  const [newFactorDetails, setNewFactorDetails] = useState('');

  const handleStatusChange = (index, status) => {
    dispatch(updateFishboneFactor({ index, field: 'verification_status', value: status }));
  };

  const handleAddNewFactor = (e) => {
    e.preventDefault();
    if (!newFactorName.trim()) return;

    dispatch(addFishboneFactor({
      category: newFactorCategory,
      factor_name: newFactorName.trim(),
      details: newFactorDetails.trim(),
      verification_status: 'Potential Contributor',
      evidence_notes: 'Investigator hypothesis',
      ai_suggested: false
    }));

    setNewFactorName('');
    setNewFactorDetails('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed Cause':
        return <span className="badge badge-approved"><CheckCircle2 size={11} /> Confirmed</span>;
      case 'Ruled Out':
        return <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}><XCircle size={11} /> Ruled Out</span>;
      case 'Under Testing':
        return <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)' }}><Clock size={11} /> Under Testing</span>;
      default:
        return <span className="badge badge-major"><AlertTriangle size={11} /> Potential</span>;
    }
  };

  // Group factors by category for SVG render
  const factorsByCategory = {
    machine: factors.filter(f => f.category === 'machine'),
    method: factors.filter(f => f.category === 'method'),
    milieu: factors.filter(f => f.category === 'milieu'),
    man: factors.filter(f => f.category === 'man'),
    material: factors.filter(f => f.category === 'material'),
    measurement: factors.filter(f => f.category === 'measurement')
  };

  const filteredFactors = selectedCategoryFilter === 'all'
    ? factors
    : factors.filter(f => f.category === selectedCategoryFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div style={{
        background: 'rgba(129, 140, 248, 0.08)',
        border: '1px solid rgba(129, 140, 248, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(129, 140, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--indigo-ai)'
          }}>
            <GitBranch size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Ishikawa 6M Cause-and-Effect Framework
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Systematic classification across Machine, Method, Milieu, Man, Material, and Measurement dimensions.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`btn btn-sm ${selectedCategoryFilter === c.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === c.id ? 'all' : c.id)}
            >
              {c.label.split(' ')[0]} ({factorsByCategory[c.id]?.length || 0})
            </button>
          ))}
        </div>
      </div>

      {/* High-Precision SVG Ishikawa Fishbone Diagram */}
      <div className="fishbone-wrapper">
        <svg
          viewBox="0 0 1000 480"
          className="fishbone-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="spineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0891B2" />
              <stop offset="85%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
            </marker>
          </defs>

          {/* Central Horizontal Spine */}
          <line x1="40" y1="240" x2="800" y2="240" stroke="url(#spineGrad)" strokeWidth="5" strokeLinecap="round" markerEnd="url(#arrow)" />

          {/* Head Box: Deviation Effect */}
          <g transform="translate(800, 185)">
            <rect width="180" height="110" rx="10" fill="#111827" stroke="#06B6D4" strokeWidth="2" filter="drop-shadow(0 4px 12px rgba(6,182,212,0.25))" />
            <text x="90" y="30" fill="#38BDF8" fontSize="12" fontWeight="700" textAnchor="middle" textTransform="uppercase">
              QUALITY DEVIATION
            </text>
            <foreignObject x="10" y="40" width="160" height="60">
              <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: '11px', color: '#F8FAFC', lineHeight: '1.3', textAlign: 'center', fontWeight: '500' }}>
                {currentInvestigation?.api_product_name || 'Active API Deviation'}
                <div style={{ color: '#F59E0B', fontSize: '10px', marginTop: '2px' }}>
                  {currentInvestigation?.batch_number} • {currentInvestigation?.severity}
                </div>
              </div>
            </foreignObject>
          </g>

          {/* Upper Bones: Machine (x=220), Method (x=450), Milieu (x=680) */}
          {/* 1. Machine */}
          <line x1="220" y1="240" x2="130" y2="60" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" />
          <rect x="50" y="35" width="150" height="26" rx="6" fill="#0E1726" stroke="#06B6D4" strokeWidth="1.5" />
          <text x="125" y="52" fill="#06B6D4" fontSize="11" fontWeight="700" textAnchor="middle">MACHINE</text>
          {factorsByCategory.machine.slice(0, 3).map((f, i) => (
            <g key={i} transform={`translate(${140 - i * 15}, ${90 + i * 40})`}>
              <line x1="0" y1="0" x2="35" y2="0" stroke="rgba(6,182,212,0.5)" strokeWidth="1.5" strokeDasharray="3 3" />
              <rect x="35" y="-12" width="130" height="24" rx="4" fill="#1F2937" stroke={f.verification_status === 'Confirmed Cause' ? '#10B981' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
              <text x="42" y="4" fill={f.verification_status === 'Confirmed Cause' ? '#34D399' : '#E2E8F0'} fontSize="9" fontWeight="600">
                {f.factor_name.length > 20 ? f.factor_name.slice(0, 19) + '…' : f.factor_name}
              </text>
            </g>
          ))}

          {/* 2. Method */}
          <line x1="450" y1="240" x2="360" y2="60" stroke="#818CF8" strokeWidth="3" strokeLinecap="round" />
          <rect x="280" y="35" width="150" height="26" rx="6" fill="#0E1726" stroke="#818CF8" strokeWidth="1.5" />
          <text x="355" y="52" fill="#818CF8" fontSize="11" fontWeight="700" textAnchor="middle">METHOD (SOP)</text>
          {factorsByCategory.method.slice(0, 3).map((f, i) => (
            <g key={i} transform={`translate(${370 - i * 15}, ${90 + i * 40})`}>
              <line x1="0" y1="0" x2="35" y2="0" stroke="rgba(129,140,248,0.5)" strokeWidth="1.5" strokeDasharray="3 3" />
              <rect x="35" y="-12" width="130" height="24" rx="4" fill="#1F2937" stroke={f.verification_status === 'Confirmed Cause' ? '#10B981' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
              <text x="42" y="4" fill={f.verification_status === 'Confirmed Cause' ? '#34D399' : '#E2E8F0'} fontSize="9" fontWeight="600">
                {f.factor_name.length > 20 ? f.factor_name.slice(0, 19) + '…' : f.factor_name}
              </text>
            </g>
          ))}

          {/* 3. Milieu / Environment */}
          <line x1="680" y1="240" x2="590" y2="60" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" />
          <rect x="510" y="35" width="150" height="26" rx="6" fill="#0E1726" stroke="#A855F7" strokeWidth="1.5" />
          <text x="585" y="52" fill="#A855F7" fontSize="11" fontWeight="700" textAnchor="middle">MILIEU (ENV)</text>
          {factorsByCategory.milieu.slice(0, 3).map((f, i) => (
            <g key={i} transform={`translate(${600 - i * 15}, ${90 + i * 40})`}>
              <line x1="0" y1="0" x2="35" y2="0" stroke="rgba(168,85,247,0.5)" strokeWidth="1.5" strokeDasharray="3 3" />
              <rect x="35" y="-12" width="130" height="24" rx="4" fill="#1F2937" stroke={f.verification_status === 'Confirmed Cause' ? '#10B981' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
              <text x="42" y="4" fill={f.verification_status === 'Confirmed Cause' ? '#34D399' : '#E2E8F0'} fontSize="9" fontWeight="600">
                {f.factor_name.length > 20 ? f.factor_name.slice(0, 19) + '…' : f.factor_name}
              </text>
            </g>
          ))}

          {/* Lower Bones: Man (x=220), Material (x=450), Measurement (x=680) */}
          {/* 4. Man */}
          <line x1="220" y1="240" x2="130" y2="420" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <rect x="50" y="415" width="150" height="26" rx="6" fill="#0E1726" stroke="#F59E0B" strokeWidth="1.5" />
          <text x="125" y="432" fill="#F59E0B" fontSize="11" fontWeight="700" textAnchor="middle">MAN (PEOPLE)</text>
          {factorsByCategory.man.slice(0, 3).map((f, i) => (
            <g key={i} transform={`translate(${160 - i * 15}, ${290 + i * 40})`}>
              <line x1="0" y1="0" x2="35" y2="0" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" strokeDasharray="3 3" />
              <rect x="35" y="-12" width="130" height="24" rx="4" fill="#1F2937" stroke={f.verification_status === 'Confirmed Cause' ? '#10B981' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
              <text x="42" y="4" fill={f.verification_status === 'Confirmed Cause' ? '#34D399' : '#E2E8F0'} fontSize="9" fontWeight="600">
                {f.factor_name.length > 20 ? f.factor_name.slice(0, 19) + '…' : f.factor_name}
              </text>
            </g>
          ))}

          {/* 5. Material */}
          <line x1="450" y1="240" x2="360" y2="420" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" />
          <rect x="280" y="415" width="150" height="26" rx="6" fill="#0E1726" stroke="#EC4899" strokeWidth="1.5" />
          <text x="355" y="432" fill="#EC4899" fontSize="11" fontWeight="700" textAnchor="middle">MATERIAL</text>
          {factorsByCategory.material.slice(0, 3).map((f, i) => (
            <g key={i} transform={`translate(${390 - i * 15}, ${290 + i * 40})`}>
              <line x1="0" y1="0" x2="35" y2="0" stroke="rgba(236,72,153,0.5)" strokeWidth="1.5" strokeDasharray="3 3" />
              <rect x="35" y="-12" width="130" height="24" rx="4" fill="#1F2937" stroke={f.verification_status === 'Confirmed Cause' ? '#10B981' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
              <text x="42" y="4" fill={f.verification_status === 'Confirmed Cause' ? '#34D399' : '#E2E8F0'} fontSize="9" fontWeight="600">
                {f.factor_name.length > 20 ? f.factor_name.slice(0, 19) + '…' : f.factor_name}
              </text>
            </g>
          ))}

          {/* 6. Measurement */}
          <line x1="680" y1="240" x2="590" y2="420" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
          <rect x="510" y="415" width="150" height="26" rx="6" fill="#0E1726" stroke="#10B981" strokeWidth="1.5" />
          <text x="585" y="432" fill="#10B981" fontSize="11" fontWeight="700" textAnchor="middle">MEASUREMENT</text>
          {factorsByCategory.measurement.slice(0, 3).map((f, i) => (
            <g key={i} transform={`translate(${620 - i * 15}, ${290 + i * 40})`}>
              <line x1="0" y1="0" x2="35" y2="0" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" strokeDasharray="3 3" />
              <rect x="35" y="-12" width="130" height="24" rx="4" fill="#1F2937" stroke={f.verification_status === 'Confirmed Cause' ? '#10B981' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
              <text x="42" y="4" fill={f.verification_status === 'Confirmed Cause' ? '#34D399' : '#E2E8F0'} fontSize="9" fontWeight="600">
                {f.factor_name.length > 20 ? f.factor_name.slice(0, 19) + '…' : f.factor_name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Factors Table & Management */}
      <div className="glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            Ishikawa Factor Verification Matrix ({filteredFactors.length} items)
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Click status to verify hypothesis with physical or analytical proof
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table-rca">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Category</th>
                <th style={{ width: '220px' }}>Factor Name</th>
                <th>Technical Details</th>
                <th style={{ width: '160px' }}>Verification Status</th>
                <th style={{ width: '220px' }}>Evidence / Proof</th>
                <th style={{ width: '60px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFactors.map((f, idx) => {
                const originalIndex = factors.indexOf(f);
                return (
                  <tr key={originalIndex}>
                    <td>
                      <span className="badge" style={{
                        background: 'rgba(255,255,255,0.06)',
                        color: CATEGORIES.find(c => c.id === f.category)?.color || '#38BDF8'
                      }}>
                        {f.category.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input"
                        style={{ fontSize: '0.825rem', padding: '0.35rem 0.6rem' }}
                        value={f.factor_name || ''}
                        onChange={(e) => dispatch(updateFishboneFactor({ index: originalIndex, field: 'factor_name', value: e.target.value }))}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input"
                        style={{ fontSize: '0.825rem', padding: '0.35rem 0.6rem' }}
                        value={f.details || ''}
                        onChange={(e) => dispatch(updateFishboneFactor({ index: originalIndex, field: 'details', value: e.target.value }))}
                      />
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                        value={f.verification_status || 'Potential Contributor'}
                        onChange={(e) => handleStatusChange(originalIndex, e.target.value)}
                      >
                        <option value="Confirmed Cause">Confirmed Cause</option>
                        <option value="Potential Contributor">Potential Contributor</option>
                        <option value="Under Testing">Under Testing</option>
                        <option value="Ruled Out">Ruled Out</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input"
                        style={{ fontSize: '0.825rem', padding: '0.35rem 0.6rem' }}
                        value={f.evidence_notes || ''}
                        onChange={(e) => dispatch(updateFishboneFactor({ index: originalIndex, field: 'evidence_notes', value: e.target.value }))}
                        placeholder="Log reference, calibration sheet..."
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.25rem 0.5rem' }}
                        onClick={() => dispatch(deleteFishboneFactor(originalIndex))}
                        title="Delete factor"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Quick Add Factor Form */}
        <form onSubmit={handleAddNewFactor} style={{
          display: 'grid',
          gridTemplateColumns: '150px 1fr 1fr auto',
          gap: '0.75rem',
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          alignItems: 'end'
        }}>
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Category</label>
            <select
              className="form-select"
              value={newFactorCategory}
              onChange={(e) => setNewFactorCategory(e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Factor Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Chiller Glycol Circulation Pressure"
              value={newFactorName}
              onChange={(e) => setNewFactorName(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Technical Hypothesis Details</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Pressure fluctuation observed at 02:15 UTC"
              value={newFactorDetails}
              onChange={(e) => setNewFactorDetails(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '38px', whiteSpace: 'nowrap' }}>
            <PlusCircle size={15} /> Add Factor
          </button>
        </form>
      </div>
    </div>
  );
}
