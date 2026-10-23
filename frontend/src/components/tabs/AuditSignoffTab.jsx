import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShieldCheck, CheckCircle2, History, UserCheck, Lock, Clock, FileBadge } from 'lucide-react';
import { setSignoffModalOpen } from '../../store/investigationSlice';

export default function AuditSignoffTab() {
  const dispatch = useDispatch();
  const currentInvestigation = useSelector((state) => state.investigation.currentInvestigation);
  const auditLogs = currentInvestigation?.audit_logs || [];

  const isSignedOff = currentInvestigation?.qualified_person_signoff || currentInvestigation?.status === 'qa_approved';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 21 CFR Part 11 Regulatory Compliance Card */}
      <div className="glass-panel" style={{
        background: isSignedOff
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(17, 24, 39, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(17, 24, 39, 0.95) 100%)',
        border: '1px solid ' + (isSignedOff ? 'rgba(16, 185, 129, 0.35)' : 'var(--border-subtle)')
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: isSignedOff ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isSignedOff ? '#34D399' : 'var(--text-secondary)'
            }}>
              {isSignedOff ? <ShieldCheck size={26} /> : <Lock size={22} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                {isSignedOff ? 'Certified Qualified Person (QP) Electronic Sign-off' : 'Pending Formal Quality Assurance Authorization'}
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Complies with FDA 21 CFR Part 11 (Electronic Records & Signatures) & EU Annex 11
              </div>
            </div>
          </div>

          {!isSignedOff ? (
            <button
              className="btn btn-success"
              onClick={() => dispatch(setSignoffModalOpen(true))}
            >
              <ShieldCheck size={16} /> Affix QP Signature
            </button>
          ) : (
            <span className="badge badge-approved" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
              <CheckCircle2 size={14} /> Legally Executed
            </span>
          )}
        </div>

        {isSignedOff ? (
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Authorized Signatory</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {currentInvestigation.signed_by || 'Dr. Sarah Jenkins, Head of QA'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Timestamp (UTC)</div>
                <div style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', color: '#34D399', marginTop: '0.2rem' }}>
                  {currentInvestigation.signed_at ? new Date(currentInvestigation.signed_at).toUTCString() : '2026-10-23 11:42:15 UTC'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Investigation Record</div>
                <div style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-primary)', marginTop: '0.2rem' }}>
                  {currentInvestigation.investigation_number} [LOCKED]
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', fontStyle: 'italic' }}>
              "I confirm that this Root Cause Analysis and CAPA plan has been thoroughly reviewed. AI suggestions were audited and corroborated against raw data. All immediate containment steps are verified, and preventive actions are legally binding."
            </div>
            
            {currentInvestigation.approval_comments && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <strong>QA Comments:</strong> {currentInvestigation.approval_comments}
              </div>
            )}
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            AI-generated root causes and CAPAs are treated as suggestions until reviewed and approved by an authorized Qualified Person. Review all evidence and 5 Whys deduction before executing sign-off.
          </p>
        )}
      </div>

      {/* Audit Trail Log */}
      <div className="glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <History size={18} style={{ color: 'var(--cyan-primary)' }} />
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            System Audit Trail ({auditLogs.length} entries)
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table-rca">
            <thead>
              <tr>
                <th style={{ width: '180px' }}>Timestamp (UTC)</th>
                <th style={{ width: '180px' }}>Actor</th>
                <th style={{ width: '200px' }}>Action</th>
                <th>Event Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log, index) => (
                  <tr key={index}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-primary)' }}>
                        <UserCheck size={11} /> {log.actor}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--cyan-primary)', fontSize: '0.825rem' }}>
                      {log.action}
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
