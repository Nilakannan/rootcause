import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShieldCheck, X, CheckCircle2, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { setSignoffModalOpen, setCurrentInvestigation, setInvestigations } from '../store/investigationSlice';
import { api } from '../services/api';

export default function SignoffModal() {
  const dispatch = useDispatch();
  const { currentInvestigation, isSignoffModalOpen } = useSelector((state) => state.investigation);

  const [signerName, setSignerName] = useState('Dr. Sarah Jenkins, Head of Quality Assurance');
  const [comments, setComments] = useState('All 5 Whys hypotheses and 6M factors verified with raw laboratory and telemetry data. Immediate containment verified, and corrective actions authorized.');
  const [hasVerified, setHasVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isSignoffModalOpen || !currentInvestigation) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasVerified) {
      alert('Please check the verification statement to certify review.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await api.signOff(currentInvestigation.id, signerName, comments);
      dispatch(setCurrentInvestigation(updated));
      
      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Refresh list
      const list = await api.getInvestigations();
      dispatch(setInvestigations(list));
      dispatch(setSignoffModalOpen(false));
    } catch (err) {
      alert(`Sign-off error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '580px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34D399'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                Qualified Person (QP) Electronic Sign-Off
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Compliant with FDA 21 CFR Part 11 &amp; EU cGMP Annex 11
              </div>
            </div>
          </div>

          <button
            onClick={() => dispatch(setSignoffModalOpen(false))}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
              Investigation Record: <strong style={{ color: 'var(--cyan-primary)' }}>{currentInvestigation.investigation_number}</strong>
            </div>
            <div style={{ color: 'var(--text-primary)' }}>
              {currentInvestigation.api_product_name} • Lot {currentInvestigation.batch_number}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Authorized Signatory Name &amp; Title</label>
            <input
              type="text"
              className="form-input"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Quality Assurance Review Comments</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              required
            />
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem'
          }}>
            <input
              type="checkbox"
              id="verify-check"
              style={{ marginTop: '0.25rem', width: '16px', height: '16px', accentColor: '#10B981' }}
              checked={hasVerified}
              onChange={(e) => setHasVerified(e.target.checked)}
            />
            <label htmlFor="verify-check" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: '1.4', cursor: 'pointer' }}>
              I hereby certify under 21 CFR Part 11 that I have independently audited this investigation. AI suggestions have been verified against raw evidence, and all CAPA commitments are approved for plant execution.
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => dispatch(setSignoffModalOpen(false))}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={isSubmitting || !hasVerified}
            >
              <CheckCircle2 size={16} />
              {isSubmitting ? 'Authorizing...' : 'Execute Digital Signature'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
