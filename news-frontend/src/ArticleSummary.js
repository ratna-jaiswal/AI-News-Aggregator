import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';

function ArticleSummary() {
  const { url } = useParams();
  const decodedUrl = decodeURIComponent(url);
  const [summary, setSummary] = useState(null);
  const [translatedSummary, setTranslatedSummary] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  const languages = [
    { code: 'spanish', name: 'Spanish' },
    { code: 'french', name: 'French' },
    { code: 'german', name: 'German' },
    { code: 'hindi', name: 'Hindi' },
    { code: 'chinese (simplified)', name: 'Chinese (Simplified)' },
  ];

  useEffect(() => {
    console.log('Fetching summary for URL:', decodedUrl); // Debug log
    const fetchSummary = async () => {
      setLoadingSummary(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      try {
        const query = `Summarize this article: ${decodedUrl}`;
        const res = await fetch('http://localhost:8000/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: query }),
          signal: controller.signal,
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setSummary(data.output || 'No summary available');
      } catch (err) {
        setSummary(`Error: ${err.name === 'AbortError' ? 'The article request timed out.' : err.message || 'Failed to fetch summary'}`);
      } finally {
        clearTimeout(timeoutId);
      }
      setLoadingSummary(false);
    };
    fetchSummary();
  }, [decodedUrl]);

  const handleLanguageChange = async (langCode) => {
    setSelectedLanguage(langCode);
    if (!summary || langCode === '') {
      setTranslatedSummary(null);
      return;
    }
    setLoadingTranslation(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);
    try {
      const query = `Translate this text to ${langCode}: ${summary}`;
      const res = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: query }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setTranslatedSummary(data.output || 'No translation available');
    } catch (err) {
      setTranslatedSummary(`Error: ${err.name === 'AbortError' ? 'Translation timed out.' : err.message || 'Failed to translate'}`);
    } finally {
      clearTimeout(timeoutId);
    }
    setLoadingTranslation(false);
  };

  const summaryPoints = summary ? summary.split('\n').filter(Boolean) : [];
  const sourceName = new URL(decodedUrl).hostname.replace(/^www\./, '');

  return (
    <main className="summary-shell">
      <div className="summary-topline">
        <span className="eyebrow">The daily brief / analysis</span>
        <a href={decodedUrl} target="_blank" rel="noopener noreferrer" className="summary-source">
          Read original at {sourceName}
        </a>
      </div>
      <h1 className="summary-title">Article summary</h1>
      {loadingSummary ? (
        <div className="summary-panel"><p className="summary-status">Preparing the briefing...</p></div>
      ) : (
        <div className="summary-grid">
          <section className="summary-panel">
            <div className="summary-panel-heading">
              <span>English summary</span>
              <span className="summary-label">Key points</span>
            </div>
            <ul className="summary-points">
              {summaryPoints.map((point, index) => <li key={index}>{point.replace(/^•\s*/, '')}</li>)}
            </ul>
          </section>
          <aside className="translation-panel">
            <p className="section-kicker">Translate briefing</p>
            <label htmlFor="language-select">Choose a language</label>
            <select id="language-select" value={selectedLanguage} onChange={(e) => handleLanguageChange(e.target.value)}>
              <option value="">Select language</option>
              {languages.map((lang) => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
            </select>
            {loadingTranslation && <p className="summary-status">Translating...</p>}
          </aside>
          {translatedSummary && (
            <div className="summary-panel translated-panel">
              <div className="summary-panel-heading">
                <span>{languages.find(lang => lang.code === selectedLanguage)?.name || 'Translated'} summary</span>
              </div>
              <p>{translatedSummary}</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default ArticleSummary;