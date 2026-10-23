import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShieldCheck,
  ClipboardList,
  AlertOctagon,
  PlusCircle,
  Trash2,
  Sparkles,
  Gauge,
  CheckCircle,
  Target,
  User,
  Calendar
} from 'lucide-react';
import { updateField, updateCapaItem, addCapaItem, deleteCapaItem } from '../../store/investigationSlice';

const ROOT_CATEGORIES = [
  'Equipment Failure',
  'Process Parameter Excursion',
  'Material Quality',
  'Human Error / Training Gap',
  'Environmental Anomaly',
  'Analytical / Method Error'
];

const CAPA_TYPES = [
  'Immediate Containment',
  'Corrective Action',
  'Preventive Action'
];

const DEPARTMENTS = [
  'Quality Assurance',
  'Production & Synthesis',
  'Maintenance / Mechanical Engineering',
  'Process Automation & SCADA',
  'Quality Control Lab',
  'Regulatory Affairs & Compliance'
];

export default function RootCauseCapaTab() {
  const dispatch = useDispatch();
  const currentInvestigation = useSelector((state) => state.investigation.currentInvestigation);
  const capas = currentInvestigation?.capa_items || [];

  const [newCapaType, setNewCapaType] = useState('Corrective Action');
  const [newCapaDesc, setNewCapaDesc] = useState('');
  const [newCapaDept, setNewCapaDept] = useState('Maintenance / Mechanical Engineering');
  const [newCapaAssignee, setNewCapaAssignee] = useState('');
  const [newCapaDue, setNewCapaDue] = useState('2026-11-20');
  const [newCapaCriteria, setNewCapaCriteria] = useState('');

  const [newContributingFactor, setNewContributingFactor] = useState('');

  const confidence = currentInvestigation?.root_cause_confidence || 92.5;

  const handleFieldChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  const handleAddContributing = (e) => {
    e.preventDefault();
    if (!newContributingFactor.trim()) return;
    const current = [...(currentInvestigation.contributing_factors || [])];
    current.push(newContributingFactor.trim());
    dispatch(updateField({ field: 'contributing_factors', value: current }));
    setNewContributingFactor('');
  };

  const handleRemoveContributing = (index) => {
    const current = [...(currentInvestigation.contributing_factors || [])];
    current.splice(index, 1);
    dispatch(updateField({ field: 'contributing_factors', value: current }));
  };

  const handleAddNewCapa = (e) => {
    e.preventDefault();
    if (!newCapaDesc.trim()) return;

    dispatch(addCapaItem({
      action_type: newCapaType,
      description: newCapaDesc.trim(),
      owner_department: newCapaDept,
      assigned_to: newCapaAssignee.trim() || 'Lead Engineer',
      due_date: newCapaDue,
      status: 'Accepted',
      effectiveness_criteria: newCapaCriteria.trim() || 'Verification protocol logged & verified by QA',
      ai_suggested: false
    }));

    setNewCapaDesc('');
    setNewCapaAssignee('');
    setNewCapaCriteria('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Primary Root Cause Synthesis Card */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(17, 24, 39, 0.95) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34D399'
            }}>
              <AlertOctagon size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                Primary Root Cause Determination
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Synthesized from 5 Whys deduction, confirmed 6M Ishikawa factors, and physical telemetry
              </div>
            </div>
          </div>

          {/* AI Confidence Meter */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '0.6rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            minWidth: '240px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Gauge size={13} style={{ color: 'var(--cyan-primary)' }} /> AI Confidence Score
              </span>
              <span style={{ fontWeight: 700, color: '#34D399' }}>{confidence.toFixed(1)}% High</span>
            </div>
            <div className="meter-bar">
              <div className="meter-fill" style={{ width: `${Math.min(confidence, 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Root Cause Category & Statement */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label className="form-label">Root Cause Taxonomy Category</label>
            <select
              className="form-select"
              style={{ fontWeight: 600 }}
              value={currentInvestigation?.root_cause_category || 'Equipment Failure'}
              onChange={(e) => handleFieldChange('root_cause_category', e.target.value)}
            >
              {ROOT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" style={{ color: '#34D399' }}>
              Formal Root Cause Statement (ICH Q7 Compliance)
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              style={{ borderColor: 'rgba(16, 185, 129, 0.4)', fontWeight: 600, fontSize: '0.925rem' }}
              value={currentInvestigation?.primary_root_cause || ''}
              onChange={(e) => handleFieldChange('primary_root_cause', e.target.value)}
              placeholder="State the fundamental mechanical, environmental, or systemic root cause..."
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Technical Rationale & Evidence Linkage</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={currentInvestigation?.root_cause_rationale || ''}
              onChange={(e) => handleFieldChange('root_cause_rationale', e.target.value)}
              placeholder="Explain how supporting evidence links directly to this root cause..."
            />
          </div>
        </div>

        {/* Contributing Factors */}
        <div>
          <label className="form-label" style={{ fontSize: '0.78rem' }}>
            Secondary Contributing Factors ({currentInvestigation?.contributing_factors?.length || 0})
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {(currentInvestigation?.contributing_factors || []).map((factor, i) => (
              <span
                key={i}
                className="badge badge-major"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', gap: '0.5rem' }}
              >
                {factor}
                <button
                  onClick={() => handleRemoveContributing(i)}
                  style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddContributing} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              style={{ fontSize: '0.825rem', height: '34px' }}
              placeholder="Add contributing factor (e.g. shift handover communication lag)..."
              value={newContributingFactor}
              onChange={(e) => setNewContributingFactor(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}>
              Add Factor
            </button>
          </form>
        </div>
      </div>

      {/* CAPA Action Plan Section */}
      <div className="glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cyan-primary)'
            }}>
              <ClipboardList size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                Corrective and Preventive Action (CAPA) Plan
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Mandatory Immediate Containment, Root Corrective Action, and Long-Term Preventive Controls
              </div>
            </div>
          </div>

          <span className="badge badge-approved" style={{ fontSize: '0.75rem' }}>
            {capas.length} Active CAPAs Defined
          </span>
        </div>

        {/* CAPA Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="table-rca">
            <thead>
              <tr>
                <th style={{ width: '170px' }}>Type</th>
                <th>Action Description</th>
                <th style={{ width: '180px' }}>Owner Department</th>
                <th style={{ width: '130px' }}>Assignee</th>
                <th style={{ width: '120px' }}>Target Date</th>
                <th style={{ width: '130px' }}>Status</th>
                <th style={{ width: '220px' }}>Effectiveness Criteria</th>
                <th style={{ width: '50px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {capas.map((capa, index) => (
                <tr key={index}>
                  <td>
                    <select
                      className="form-select"
                      style={{
                        fontSize: '0.8rem',
                        padding: '0.3rem 0.5rem',
                        fontWeight: 600,
                        color: capa.action_type === 'Immediate Containment' ? '#FBBF24' : capa.action_type === 'Corrective Action' ? '#06B6D4' : '#10B981'
                      }}
                      value={capa.action_type || 'Corrective Action'}
                      onChange={(e) => dispatch(updateCapaItem({ index, field: 'action_type', value: e.target.value }))}
                    >
                      {CAPA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </td>
                  <td>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      style={{ fontSize: '0.825rem', padding: '0.35rem 0.6rem' }}
                      value={capa.description || ''}
                      onChange={(e) => dispatch(updateCapaItem({ index, field: 'description', value: e.target.value }))}
                    />
                    {capa.ai_suggested && (
                      <span className="badge badge-ai" style={{ fontSize: '0.65rem', marginTop: '0.3rem' }}>
                        <Sparkles size={10} /> AI Recommendation
                      </span>
                    )}
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                      value={capa.owner_department || 'QA'}
                      onChange={(e) => dispatch(updateCapaItem({ index, field: 'owner_department', value: e.target.value }))}
                    >
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: '0.825rem', padding: '0.35rem 0.6rem' }}
                      value={capa.assigned_to || ''}
                      onChange={(e) => dispatch(updateCapaItem({ index, field: 'assigned_to', value: e.target.value }))}
                      placeholder="Assignee name"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: '0.825rem', padding: '0.35rem 0.6rem' }}
                      value={capa.due_date || ''}
                      onChange={(e) => dispatch(updateCapaItem({ index, field: 'due_date', value: e.target.value }))}
                      placeholder="YYYY-MM-DD"
                    />
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                      value={capa.status || 'Accepted'}
                      onChange={(e) => dispatch(updateCapaItem({ index, field: 'status', value: e.target.value }))}
                    >
                      <option value="Proposed (AI)">Proposed (AI)</option>
                      <option value="Accepted">Accepted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Implemented">Implemented</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                      value={capa.effectiveness_criteria || ''}
                      onChange={(e) => dispatch(updateCapaItem({ index, field: 'effectiveness_criteria', value: e.target.value }))}
                      placeholder="Quantifiable effectiveness metric (e.g. 3 consecutive batches < 0.05% Impurity-C)..."
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ padding: '0.25rem 0.5rem' }}
                      onClick={() => dispatch(deleteCapaItem(index))}
                      title="Delete CAPA"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Add Custom CAPA Form */}
        <form onSubmit={handleAddNewCapa} style={{
          display: 'grid',
          gridTemplateColumns: '170px 1.5fr 180px 120px 120px 1.5fr auto',
          gap: '0.65rem',
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          alignItems: 'end'
        }}>
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>CAPA Type</label>
            <select
              className="form-select"
              value={newCapaType}
              onChange={(e) => setNewCapaType(e.target.value)}
            >
              {CAPA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Action Description</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Re-calibrate RTD transmitter TT-204"
              value={newCapaDesc}
              onChange={(e) => setNewCapaDesc(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Department</label>
            <select
              className="form-select"
              value={newCapaDept}
              onChange={(e) => setNewCapaDept(e.target.value)}
            >
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Assignee</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Lead Chemist"
              value={newCapaAssignee}
              onChange={(e) => setNewCapaAssignee(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Due Date</label>
            <input
              type="text"
              className="form-input"
              value={newCapaDue}
              onChange={(e) => setNewCapaDue(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Effectiveness Criteria</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Zero drift across 3 consecutive batches"
              value={newCapaCriteria}
              onChange={(e) => setNewCapaCriteria(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '38px', whiteSpace: 'nowrap' }}>
            <PlusCircle size={15} /> Add CAPA
          </button>
        </form>
      </div>
    </div>
  );
}
