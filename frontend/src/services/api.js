const API_BASE = '/api';

export const api = {
  // Investigations CRUD
  async getInvestigations() {
    const res = await fetch(`${API_BASE}/investigations`);
    if (!res.ok) throw new Error('Failed to fetch investigations list');
    return res.json();
  },

  async getInvestigation(id) {
    const res = await fetch(`${API_BASE}/investigations/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch investigation #${id}`);
    return res.json();
  },

  async createInvestigation(data) {
    const res = await fetch(`${API_BASE}/investigations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create new investigation');
    return res.json();
  },

  async updateInvestigation(id, data) {
    const res = await fetch(`${API_BASE}/investigations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Failed to update investigation #${id}`);
    return res.json();
  },

  async deleteInvestigation(id) {
    const res = await fetch(`${API_BASE}/investigations/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Failed to delete investigation #${id}`);
    return res.json();
  },

  async signOff(id, signedBy, comments) {
    const res = await fetch(`${API_BASE}/investigations/${id}/sign-off`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        signed_by: signedBy,
        approval_comments: comments
      })
    });
    if (!res.ok) throw new Error(`Sign-off failed for investigation #${id}`);
    return res.json();
  },

  // AI Pipeline & Copilot
  async getPresets() {
    const res = await fetch(`${API_BASE}/ai/presets`);
    if (!res.ok) throw new Error('Failed to fetch sample presets');
    return res.json();
  },

  async analyzeText(inputText, documentType = 'pasted_text', documentName = 'Pasted Text') {
    const res = await fetch(`${API_BASE}/ai/analyze-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input_text: inputText,
        document_type: documentType,
        document_name: documentName
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to analyze text with AI');
    }
    return res.json();
  },

  async analyzeDocument(file, documentType = 'pdf_upload') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);

    const res = await fetch(`${API_BASE}/ai/analyze-document`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to analyze document with AI');
    }
    return res.json();
  },

  async chatWithCopilot(currentState, userQuery, contextType = 'general') {
    const res = await fetch(`${API_BASE}/ai/chat-assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        current_state: currentState,
        user_query: userQuery,
        context_type: contextType
      })
    });
    if (!res.ok) throw new Error('Failed to get copilot response');
    return res.json();
  }
};
