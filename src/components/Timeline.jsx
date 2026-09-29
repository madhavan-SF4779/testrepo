import { CheckCircle2, FileText } from 'lucide-react';

export function Timeline({ items }) {
  return (
    <section className="panel timeline-panel">
      <div className="section-heading"><div><p className="eyebrow">Activity timeline</p><h2>Completed work</h2></div></div>
      <div className="timeline">
        {items.map((item) => (
          <div className="timeline-item" key={`${item.type}-${item.id}`}>
            <div className="timeline-dot">{item.type === 'task' ? <CheckCircle2 size={16} /> : <FileText size={16} />}</div>
            <div><strong>{item.title}</strong><p>{item.detail}</p><span>{new Date(item.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}
