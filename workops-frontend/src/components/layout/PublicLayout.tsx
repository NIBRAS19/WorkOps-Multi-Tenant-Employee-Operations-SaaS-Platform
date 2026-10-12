import { Link, Outlet } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

export function PublicLayout() {
  return <div className="public-shell"><header className="public-nav"><Link to="/" className="public-brand"><span className="brand-mark">W</span><span>WorkOps</span></Link><nav><a href="#features">Features</a><a href="#security">Security</a><a href="#pricing">Pricing</a></nav><div className="public-actions"><Link className="public-link" to="/login">Sign in</Link><Link className="btn btn-primary btn-sm" to="/register">Start free <ArrowRight size={15} /></Link></div></header><Outlet /><footer className="public-footer"><div><strong>WorkOps</strong><span>Employee operations, simplified.</span></div><div><ShieldCheck size={16} /> Built with a security-first mindset.</div></footer></div>
}
