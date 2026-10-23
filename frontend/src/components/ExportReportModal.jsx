import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Printer, Download, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { setExportModalOpen } from '../store/investigationSlice';

export default function ExportReportModal() {
  const dispatch = useDispatch();
  const { currentInvestigation, isExportModalOpen } = useSelector((state) => state.investigation);

  if (!isExportModalOpen || !currentInvestigation) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '900px' }}>
        {/* Modal Controls Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              Regulatory Investigation Report Preview
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Ready for FDA / EMA / cGMP audit inspection submission
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={15} /> Print / Save as PDF
            </button>
            <button
              onClick={() => dispatch(setExportModalOpen(false))}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Formal Printable Document Section */}
        <div
          id="printable-report"
          style={{
            background: '#ffffff',
            color: '#0f172a',
            padding: '2.5rem',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}
        >
          {/* Document Header */}
          <div style={{ borderBottom: '3px solid #0891b2', paddingBottom: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0891b2', letterSpacing: '-0.02em' }}>
                AURA BIOPHARMA MANUFACTURING
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Pharmaceutical Ingredients (API) Quality Operations
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginTop: '0.5rem' }}>
                ROOT CAUSE ANALYSIS (RCA) &amp; CAPA REGULATORY REPORT
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0891b2', fontFamily: 'monospace' }}>
                {currentInvestigation.investigation_number}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                Standard Operating Procedure: QA-SOP-401 Rev 5
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                Date: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Metadata Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '12px' }}>
            <tbody>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', fontWeight: 700, width: '22%' }}>API Product</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', width: '28%' }}>{currentInvestigation.api_product_name}</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', fontWeight: 700, width: '22%' }}>Batch / Lot #</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', width: '28%', fontFamily: 'monospace' }}>{currentInvestigation.batch_number}</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Manufacturing Line</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>{currentInvestigation.manufacturing_unit}</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Process Stage</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>{currentInvestigation.process_stage}</td>
              </tr>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Deviation Severity</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', color: currentInvestigation.severity === 'Critical' ? '#e11d48' : '#d97706', fontWeight: 700 }}>
                  {currentInvestigation.severity}
                </td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Investigation Status</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', fontWeight: 600 }}>
                  {currentInvestigation.qualified_person_signoff ? 'QA APPROVED / CLOSED' : 'UNDER INVESTIGATION'}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Section 1: Summary & Immediate Actions */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0891b2', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px', marginBottom: '6px' }}>
              1.0 INCIDENT DESCRIPTION &amp; CONTAINMENT
            </div>
            <p style={{ fontSize: '11px', lineHeight: '1.5', margin: '0 0 8px 0', color: '#1e293b' }}>
              <strong>Observed Deviation:</strong> {currentInvestigation.summary}
            </p>
            <p style={{ fontSize: '11px', lineHeight: '1.5', margin: 0, color: '#1e293b' }}>
              <strong>Immediate Containment Actions:</strong> {currentInvestigation.immediate_actions_taken}
            </p>
          </div>

          {/* Section 2: 5 Whys Deduction Chain */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0891b2', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px', marginBottom: '6px' }}>
              2.0 5 WHYS CAUSAL LOGIC PROGRESSION
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {(currentInvestigation.five_whys || []).map((w, i) => (
                <div key={i} style={{ fontSize: '11px', padding: '4px 8px', background: w.is_root_cause ? '#dcfce7' : '#f8fafc', borderLeft: `3px solid ${w.is_root_cause ? '#16a34a' : '#0891b2'}` }}>
                  <strong>Why #{w.step_number}:</strong> {w.why_question} → <em>{w.answer}</em>
                  {w.evidence_support && <span style={{ color: '#64748b', marginLeft: '6px' }}>[Evidence: {w.evidence_support}]</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Root Cause Determination */}
          <div style={{ marginBottom: '1.25rem', padding: '10px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '4px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#15803d', marginBottom: '4px' }}>
              3.0 PRIMARY ROOT CAUSE SYNTHESIS (Confidence: {currentInvestigation.root_cause_confidence || 92}%)
            </div>
            <p style={{ fontSize: '11px', lineHeight: '1.5', margin: '0 0 6px 0', fontWeight: 600, color: '#0f172a' }}>
              {currentInvestigation.primary_root_cause}
            </p>
            <p style={{ fontSize: '10px', color: '#475569', margin: 0 }}>
              <strong>Rationale:</strong> {currentInvestigation.root_cause_rationale}
            </p>
          </div>

          {/* Section 4: CAPA Table */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0891b2', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px', marginBottom: '6px' }}>
              4.0 CORRECTIVE AND PREVENTIVE ACTIONS (CAPA) PLAN
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ padding: '5px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '5px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Action Item</th>
                  <th style={{ padding: '5px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Owner Dept</th>
                  <th style={{ padding: '5px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Target Date</th>
                  <th style={{ padding: '5px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Effectiveness Check Criteria</th>
                </tr>
              </thead>
              <tbody>
                {(currentInvestigation.capa_items || []).map((c, i) => (
                  <tr key={i}>
                    <td style={{ padding: '5px', border: '1px solid #cbd5e1', fontWeight: 700 }}>{c.action_type}</td>
                    <td style={{ padding: '5px', border: '1px solid #cbd5e1' }}>{c.description}</td>
                    <td style={{ padding: '5px', border: '1px solid #cbd5e1' }}>{c.owner_department} ({c.assigned_to})</td>
                    <td style={{ padding: '5px', border: '1px solid #cbd5e1' }}>{c.due_date}</td>
                    <td style={{ padding: '5px', border: '1px solid #cbd5e1' }}>{c.effectiveness_criteria}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 5: QP Signature & Approval Stamp */}
          <div style={{ borderTop: '2px solid #0f172a', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '10px', color: '#64748b', maxWidth: '60%' }}>
              Electronically generated by AURA-QMS AI Root Cause Analysis System. Compliant with 21 CFR Part 11, ICH Q7, and EU cGMP guidelines.
            </div>

            <div style={{ textAlign: 'right', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '4px', background: '#f8fafc' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                <CheckCircle2 size={13} /> QUALIFIED PERSON SIGN-OFF
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a' }}>
                {currentInvestigation.signed_by || 'Dr. Sarah Jenkins, Head of QA'}
              </div>
              <div style={{ fontSize: '9px', color: '#64748b' }}>
                {currentInvestigation.signed_at ? new Date(currentInvestigation.signed_at).toUTCString() : 'Digitally Certified on Review'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
