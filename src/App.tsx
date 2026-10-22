import { useState, type FormEvent } from 'react';

type Status = 'Open' | 'In progress' | 'Resolved';
type Enquiry = { id: string; company: string; contact: string; topic: string; summary: string; status: Status; createdAt: string };
const statuses: Status[] = ['Open', 'In progress', 'Resolved'];
const storageKey = 'mccia-helpline.enquiries.v1';
function readEnquiries(): Enquiry[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is Enquiry => item && ['id', 'company', 'contact', 'topic', 'summary', 'createdAt'].every(key => typeof item[key] === 'string') && statuses.includes(item.status));
  } catch { return []; }
}
export default function App() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(readEnquiries);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All statuses');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  function save(next: Enquiry[]) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setEnquiries(next); setError(''); return true;
    } catch { setError('Unable to save in this browser. Please check available storage and try again.'); return false; }
  }
  function addEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? '').trim();
    if (!field('company') || !field('contact') || !field('summary')) { setError('Please complete all required fields.'); return; }
    if (save([{ id: crypto.randomUUID(), company: field('company'), contact: field('contact'), topic: field('topic'), summary: field('summary'), status: 'Open', createdAt: new Date().toISOString() }, ...enquiries])) setShowForm(false);
  }
  const visible = enquiries.filter(item => (filter === 'All statuses' || item.status === filter) && `${item.company} ${item.contact} ${item.topic} ${item.summary}`.toLowerCase().includes(query.toLowerCase()));
  return <>
    <header><a className="brand" href="/" aria-label="MCCIA Helpline home"><span className="brand-mark">M</span><span>MCCIA<small>MSME HELPLINE</small></span></a><span className="workspace">Enquiry workspace</span></header>
    <main>
      <section className="intro"><div><p className="eyebrow">SUPPORTING ENTERPRISE. ENABLING GROWTH.</p><h1>Every enquiry.<br /><span>A step forward.</span></h1><p>Manage MSME enquiries and keep support moving.</p></div><button onClick={() => setShowForm(true)}>+ New enquiry</button></section>
      <aside className="notice"><strong>Your new, independent workspace.</strong> Records are saved only in this browser. There is no database connection, account system, or shared storage. Avoid sensitive information in this prototype.</aside>
      <section className="stats" aria-label="Enquiry overview">{[['Total enquiries', enquiries.length], ...statuses.map(status => [status, enquiries.filter(item => item.status === status).length])].map(([label, count]) => <article key={label}><span>{label}</span><strong>{count}</strong></article>)}</section>
      {error && <p role="alert" className="error">{error}</p>}
      {showForm && <section className="form-panel" aria-labelledby="new-enquiry"><h2 id="new-enquiry">New enquiry</h2><form onSubmit={addEnquiry}>
        <div className="form-grid"><label>Company name<input name="company" required maxLength={160} autoFocus /></label><label>Contact name<input name="contact" required maxLength={120} /></label><label>Topic<select name="topic">{['General guidance', 'Finance & funding', 'Government schemes', 'Compliance', 'Exports', 'Technology & skills'].map(topic => <option key={topic}>{topic}</option>)}</select></label></div>
        <label>Enquiry summary<textarea name="summary" required maxLength={2000} rows={3} /></label><div className="actions"><button type="button" className="secondary" onClick={() => { setShowForm(false); setError(''); }}>Cancel</button><button type="submit">Save enquiry</button></div>
      </form></section>}
      <section className="records" aria-labelledby="enquiries-title"><div className="records-heading"><div><p className="eyebrow">YOUR WORKSPACE</p><h2 id="enquiries-title">Enquiries <span className="count">{enquiries.length}</span></h2></div><div className="filters"><label className="sr-only" htmlFor="search">Search enquiries</label><input id="search" placeholder="Search enquiries…" value={query} onChange={event => setQuery(event.target.value)} /><label className="sr-only" htmlFor="status-filter">Filter by status</label><select id="status-filter" value={filter} onChange={event => setFilter(event.target.value)}><option>All statuses</option>{statuses.map(status => <option key={status}>{status}</option>)}</select></div></div>
        {visible.length === 0 ? <div className="empty"><div className="empty-icon">↗</div><h3>{enquiries.length ? 'No matching enquiries' : 'Good support starts here'}</h3><p>{enquiries.length ? 'Try a different search or status filter.' : 'Add your first enquiry to begin tracking MSME support.'}</p>{!enquiries.length && <button className="secondary" onClick={() => setShowForm(true)}>Create an enquiry</button>}</div> : <div className="table-scroll"><table><thead><tr><th>Company / contact</th><th>Enquiry</th><th>Created</th><th>Status</th></tr></thead><tbody>{visible.map(item => <tr key={item.id}><td><strong>{item.company}</strong><small>{item.contact}</small></td><td><span className="topic">{item.topic}</span><p>{item.summary}</p></td><td>{new Date(item.createdAt).toLocaleDateString('en-IN')}</td><td><select aria-label={`Status for ${item.company}`} value={item.status} onChange={event => save(enquiries.map(record => record.id === item.id ? { ...record, status: event.target.value as Status } : record))}>{statuses.map(status => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div>}
      </section><footer>MCCIA · MSME Helpline Tracker <span>Built for better business support</span></footer>
    </main>
  </>;
}
