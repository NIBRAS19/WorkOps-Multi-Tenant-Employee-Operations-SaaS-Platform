import { ArrowRight, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Login() {
  const navigate = useNavigate()
  return <div className="auth-page"><div className="auth-card"><div className="auth-brand"><span className="brand-mark">W</span><strong>WorkOps</strong></div><div className="auth-head"><div className="page-eyebrow">WELCOME BACK</div><h1>Sign in to your workspace.</h1><p>Use the demo account below or connect your API later.</p></div><form className="form-stack" onSubmit={(e) => { e.preventDefault(); navigate('/app/dashboard') }}><label>Work email<input type="email" defaultValue="owner@acme.test" /></label><label>Password<input type="password" defaultValue="password" /></label><div className="form-row-between"><label className="checkbox-row"><input type="checkbox" defaultChecked /> Remember me</label><button type="button" className="text-button">Forgot password?</button></div><button className="btn btn-primary btn-lg" type="submit">Sign in <ArrowRight size={17} /></button></form><div className="demo-note"><ShieldCheck size={16} /><span>Demo mode: any valid-looking credentials open the frontend workspace.</span></div><p className="auth-footer">Don't have an account? <button className="text-button" onClick={() => navigate('/register')}>Create one</button></p></div></div>
}
