import { Download, Search, ShieldCheck } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

const logs = [
  ['18 Sep · 10:42', 'Nibras', 'Updated employee', 'Sarah Ahmed', 'Success'],
  ['18 Sep · 10:31', 'Omar Khalid', 'Uploaded document', 'Employment Contract', 'Success'],
  ['18 Sep · 10:14', 'Aisha Rahman', 'Requested leave', 'LV-0192', 'Success'],
  ['18 Sep · 09:51', 'Nibras', 'Assigned asset', 'AST-2004', 'Success'],
  ['18 Sep · 09:08', 'Unknown', 'Login attempt', 'owner@acme.test', 'Blocked'],
]

export function AuditLogs() {
  return <div className="page-stack"><PageHeader eyebrow="ADMINISTRATION" title="Audit logs" description="Trace important workspace activity and access events." actions={<Button variant="secondary" icon={<Download size={16} />}>Export logs</Button>} /><Card><div className="notice-card"><ShieldCheck size={17} /><span>Audit logs are append-only records for critical operations. Connect the backend to persist and sign events.</span></div><div className="toolbar"><div className="search-field"><Search size={17} /><input placeholder="Search actions, users or resources…" /></div><select><option>All actions</option><option>Authentication</option><option>Employee</option><option>Document</option><option>Asset</option></select><select><option>All results</option><option>Success</option><option>Blocked</option></select></div><div className="table-wrap"><table className="data-table"><thead><tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Resource</th><th>Result</th></tr></thead><tbody>{logs.map(r => <tr key={`${r[0]}-${r[1]}`}><td>{r[0]}</td><td><strong>{r[1]}</strong></td><td>{r[2]}</td><td>{r[3]}</td><td><Badge tone={r[4] === 'Success' ? 'green' : 'red'} dot>{r[4]}</Badge></td></tr>)}</tbody></table></div></Card></div>
}
