import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { format } from 'date-fns'
import type { WorkLog } from '../types'

interface Props { onClose: () => void; onSave: (log: WorkLog) => void }
export function WorkLogModal({ onClose, onSave }: Props) {
  const [hours, setHours] = useState(6)
  const [mood, setMood] = useState(4)
  const [note, setNote] = useState('')
  function submit(event: FormEvent) { event.preventDefault(); onSave({ id: crypto.randomUUID(), date: format(new Date(), 'yyyy-MM-dd'), mood, hours, note }) }
  return <div className="modal-backdrop"><section className="modal small"><div className="modal-header"><div><span className="eyebrow">DAILY CHECK-IN</span><h2>Log today’s work</h2></div><button className="icon-button" onClick={onClose}><X size={20} /></button></div><form onSubmit={submit}><label>Focused hours<input type="number" min="0" max="24" step="0.5" value={hours} onChange={(event) => setHours(Number(event.target.value))} /></label><label>How did today feel?<div className="mood-picker">{[1,2,3,4,5].map((value) => <button type="button" className={mood === value ? 'selected' : ''} onClick={() => setMood(value)} key={value}>{['Hard','Okay','Good','Great','Flow'][value - 1]}</button>)}</div></label><label>Daily reflection<textarea rows={4} value={note} onChange={(event) => setNote(event.target.value)} placeholder="What moved forward today?" required /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button">Save check-in</button></div></form></section></div>
}
