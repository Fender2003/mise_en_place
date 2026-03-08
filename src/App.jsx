import { useState, useEffect } from "react"
import { sb } from "./supabase"

const MODEL = "llama-3.3-70b-versatile"
const GROQ_KEY = ""

async function llm(prompt) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || "Groq API error")
  return data.choices?.[0]?.message?.content || ""
}

const S = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#1a1208;--paper:#fdfaf4;--card:#fff8ed;
  --rust:#bf4e2a;--amber:#d4973a;--sage:#5e7a52;
  --muted:#8a7560;--border:#e6dccb;--light:#f5ede0;
  --rust-light:rgba(191,78,42,0.09);
}
body{font-family:'Outfit',sans-serif;background:var(--paper);color:var(--ink);min-height:100vh}

.auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:var(--paper)}
.auth-box{background:var(--card);border:1px solid var(--border);border-radius:24px;padding:40px;max-width:420px;width:100%;box-shadow:0 8px 48px rgba(0,0,0,.08);animation:up .4s ease}
.auth-logo{font-family:'Lora',serif;font-size:26px;font-weight:700;text-align:center;margin-bottom:4px}
.auth-logo span{color:var(--rust);font-style:italic}
.auth-tagline{text-align:center;font-size:13px;color:var(--muted);margin-bottom:32px}
.auth-tabs{display:flex;background:var(--light);border-radius:10px;padding:4px;margin-bottom:24px}
.auth-tab{flex:1;padding:9px;border:none;border-radius:7px;font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;cursor:pointer;background:transparent;color:var(--muted);transition:all .2s}
.auth-tab.on{background:var(--card);color:var(--ink);box-shadow:0 1px 6px rgba(0,0,0,.08)}
.field{margin-bottom:14px}
.field label{display:block;font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px}
.inp{border:1.5px solid var(--border);border-radius:10px;padding:12px 15px;font-family:'Outfit',sans-serif;font-size:14px;color:var(--ink);background:var(--paper);outline:none;transition:border .2s;width:100%}
.inp:focus{border-color:var(--rust)}
.inp::placeholder{color:#c0ae98}
.auth-btn{width:100%;padding:14px;background:var(--ink);color:var(--paper);border:none;border-radius:11px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s;margin-top:8px}
.auth-btn:hover:not(:disabled){background:var(--rust);transform:translateY(-1px);box-shadow:0 6px 20px rgba(191,78,42,.25)}
.auth-btn:disabled{opacity:.5;cursor:not-allowed}
.auth-err{background:rgba(191,78,42,.08);border:1px solid rgba(191,78,42,.25);border-radius:9px;padding:11px 14px;font-size:13px;color:var(--rust);margin-top:12px;line-height:1.5}
.auth-ok{background:rgba(94,122,82,.1);border:1px solid rgba(94,122,82,.3);border-radius:9px;padding:11px 14px;font-size:13px;color:var(--sage);margin-top:12px}

.nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:var(--card);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;gap:12px;flex-wrap:wrap}
.nav-brand{font-family:'Lora',serif;font-size:19px;font-weight:700;color:var(--ink)}
.nav-brand span{color:var(--rust);font-style:italic}
.nav-center{display:flex;gap:4px;background:var(--light);border-radius:10px;padding:4px}
.nav-tab{padding:7px 15px;border-radius:7px;border:none;cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;background:transparent;color:var(--muted);transition:all .2s;white-space:nowrap}
.nav-tab.on{background:var(--card);color:var(--ink);box-shadow:0 1px 6px rgba(0,0,0,.08)}
.nav-right{display:flex;align-items:center;gap:10px}
.user-pill{font-size:12px;color:var(--muted);background:var(--light);padding:6px 12px;border-radius:100px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sign-out{background:none;border:1.5px solid var(--border);border-radius:8px;padding:6px 12px;font-family:'Outfit',sans-serif;font-size:12px;color:var(--muted);cursor:pointer;transition:all .2s}
.sign-out:hover{border-color:var(--rust);color:var(--rust)}

.page{max-width:860px;margin:0 auto;padding:32px 20px;animation:up .35s ease}
@keyframes up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.sec-eye{font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--rust);margin-bottom:6px}
.sec-title{font-family:'Lora',serif;font-size:28px;font-weight:700;color:var(--ink);line-height:1.2;margin-bottom:6px}
.sec-sub{font-size:14px;color:var(--muted);line-height:1.6;margin-bottom:28px}

.upload-zone{border:2px dashed var(--border);border-radius:14px;padding:26px 20px;text-align:center;cursor:pointer;transition:all .2s;background:var(--light);position:relative;margin-bottom:14px}
.upload-zone:hover,.upload-zone.drag{border-color:var(--rust);background:var(--rust-light)}
.upload-zone input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.upload-zone h4{font-family:'Lora',serif;font-size:15px;color:var(--ink);margin:8px 0 4px}
.upload-zone p{font-size:12px;color:var(--muted)}
.img-thumb{width:100%;max-height:150px;object-fit:cover;border-radius:10px;margin-bottom:8px}

.btn{padding:10px 18px;border-radius:10px;border:none;cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;transition:all .2s;white-space:nowrap}
.btn-rust{background:var(--rust);color:#fff}
.btn-rust:hover:not(:disabled){background:#a83e1f;transform:translateY(-1px)}
.btn-ghost{background:transparent;border:1.5px solid var(--border);color:var(--muted)}
.btn-ghost:hover{border-color:var(--muted);color:var(--ink)}
.btn-sage{background:var(--sage);color:#fff}
.btn-sage:hover{background:#4a6340}
.btn:disabled{opacity:.5;cursor:not-allowed}
.gen-btn{width:100%;padding:15px;background:var(--ink);color:var(--paper);border:none;border-radius:12px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s;margin-top:18px;display:flex;align-items:center;justify-content:center;gap:8px}
.gen-btn:hover:not(:disabled){background:var(--rust);transform:translateY(-1px);box-shadow:0 8px 24px rgba(191,78,42,.25)}
.gen-btn:disabled{opacity:.45;cursor:not-allowed}

.count-badge{background:var(--rust);color:#fff;border-radius:100px;font-size:11px;font-weight:700;padding:2px 8px;margin-left:6px}
.cat-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
.cat-pill{padding:5px 12px;border-radius:100px;border:1.5px solid var(--border);font-size:12px;cursor:pointer;transition:all .15s;background:transparent;color:var(--muted);font-family:'Outfit',sans-serif}
.cat-pill.on{border-color:var(--rust);background:var(--rust);color:#fff}
.ing-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:9px}

/* Ingredient card — skipped state */
.ing-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:11px 13px;display:flex;align-items:center;justify-content:space-between;gap:8px;transition:all .2s;animation:popIn .2s ease}
.ing-card.skipped{opacity:.45;background:var(--light);border-style:dashed}
@keyframes popIn{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}
.ing-card:hover{border-color:var(--rust);box-shadow:0 3px 12px rgba(191,78,42,.1)}
.ing-card.skipped:hover{border-color:var(--muted)}
.ing-name{font-size:13px;font-weight:500;color:var(--ink);flex:1;line-height:1.3}
.ing-cat{font-size:10px;color:var(--muted);margin-top:2px}
.ing-actions{display:flex;gap:4px;align-items:center;flex-shrink:0}
.ing-skip{background:none;border:none;cursor:pointer;font-size:13px;line-height:1;padding:2px 4px;border-radius:5px;transition:all .15s;color:var(--muted)}
.ing-skip:hover{background:rgba(212,151,58,.15);color:var(--amber)}
.ing-skip.active{color:var(--amber)}
.ing-del{background:none;border:none;cursor:pointer;color:#ccc;font-size:17px;line-height:1;padding:0;transition:color .15s;flex-shrink:0}
.ing-del:hover{color:var(--rust)}
.skip-banner{background:rgba(212,151,58,.1);border:1px solid rgba(212,151,58,.3);border-radius:10px;padding:10px 14px;font-size:12px;color:#9a6220;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.skip-banner b{font-weight:600}
.skip-clear{background:none;border:none;cursor:pointer;font-size:11px;color:var(--amber);font-weight:600;font-family:'Outfit',sans-serif;text-decoration:underline;padding:0}

.divider{display:flex;align-items:center;gap:12px;margin:18px 0;color:var(--muted);font-size:11px;letter-spacing:1px;text-transform:uppercase}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border)}
.empty-state{text-align:center;padding:48px 20px;color:var(--muted)}
.empty-state .big{font-size:40px;margin-bottom:12px}
.empty-state h3{font-family:'Lora',serif;font-size:18px;color:var(--ink);margin-bottom:6px}
.empty-state p{font-size:13px;line-height:1.6}

.pref-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px;margin-bottom:13px}
.pref-card h3{font-family:'Lora',serif;font-size:16px;margin-bottom:12px;color:var(--ink)}
.pref-chips{display:flex;flex-wrap:wrap;gap:7px}
.pref-chip{padding:7px 14px;border-radius:100px;border:1.5px solid var(--border);font-size:13px;cursor:pointer;transition:all .2s;background:transparent;color:var(--muted);font-family:'Outfit',sans-serif}
.pref-chip.on{border-color:var(--rust);background:var(--rust);color:#fff}
.people-row{display:flex;align-items:center;justify-content:space-between;gap:16px}
.people-ctrl{display:flex;align-items:center;border:1.5px solid var(--border);border-radius:100px;overflow:hidden}
.p-btn{width:38px;height:38px;background:none;border:none;font-size:18px;cursor:pointer;color:var(--rust);transition:background .15s;display:flex;align-items:center;justify-content:center}
.p-btn:hover{background:var(--rust-light)}
.p-num{font-family:'Lora',serif;font-size:20px;font-weight:700;min-width:42px;text-align:center}

/* Time chips — reuse pref-chip but with clock icon feel */
.time-chips{display:flex;flex-wrap:wrap;gap:7px}
.time-chip{padding:8px 15px;border-radius:100px;border:1.5px solid var(--border);font-size:13px;cursor:pointer;transition:all .2s;background:transparent;color:var(--muted);font-family:'Outfit',sans-serif;display:flex;align-items:center;gap:5px}
.time-chip.on{border-color:var(--amber);background:var(--amber);color:#fff}
.time-chip:hover:not(.on){border-color:var(--amber);color:var(--amber)}

.recipe-list{display:grid;gap:22px;margin-top:8px}
.r-card{background:var(--card);border:1px solid var(--border);border-radius:22px;overflow:hidden;transition:all .25s;box-shadow:0 2px 14px rgba(0,0,0,.05)}
.r-card:hover{box-shadow:0 10px 40px rgba(0,0,0,.1);border-color:var(--amber)}
.r-head{padding:26px 26px 0;display:flex;gap:16px;align-items:flex-start}
.r-emoji{font-size:46px;flex-shrink:0;line-height:1}
.r-meta{flex:1}
.r-name{font-family:'Lora',serif;font-size:23px;font-weight:700;color:var(--ink);margin-bottom:6px;line-height:1.2}
.r-desc{font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:8px}
.r-why{font-size:12px;color:var(--sage);font-style:italic;line-height:1.5;margin-bottom:10px;padding:8px 12px;background:rgba(94,122,82,.07);border-radius:8px;border-left:3px solid var(--sage)}
.r-badges{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}
.badge{padding:4px 10px;border-radius:100px;font-size:11px;font-weight:600}
.b-time{background:#fef3e2;color:#9a6220}
.b-diff{background:#e8f0e5;color:#3d5c30}
.b-match{background:var(--rust-light);color:var(--rust)}
.b-flavour{background:rgba(26,18,8,.06);color:var(--muted)}
.r-timing{display:flex;gap:16px;padding:14px 26px;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--light);margin-top:16px}
.r-timing-item{display:flex;flex-direction:column;gap:2px}
.r-timing-item .tl{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;font-weight:600}
.r-timing-item .tv{font-family:'Lora',serif;font-size:15px;color:var(--ink);font-weight:600}
.r-footer{padding:14px 26px 20px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.r-stats{display:flex;gap:14px;font-size:12px;color:var(--muted)}
.r-actions{display:flex;gap:8px;align-items:center}
.expand-btn{background:none;border:none;cursor:pointer;font-size:12px;color:var(--rust);font-weight:600;font-family:'Outfit',sans-serif;padding:0}
.r-detail{border-top:1px solid var(--border);padding:26px;animation:up .25s ease}
.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:22px}
@media(max-width:560px){.detail-grid{grid-template-columns:1fr}}
.d-sec h4{font-family:'Lora',serif;font-size:15px;color:var(--ink);margin-bottom:12px;padding-bottom:8px;border-bottom:1.5px solid var(--border);display:flex;align-items:center;gap:6px}
.ing-list{list-style:none;display:flex;flex-direction:column;gap:7px}
.ing-list li{font-size:13.5px;display:flex;gap:8px;line-height:1.5;color:var(--ink)}
.ing-list li::before{content:'·';color:var(--rust);font-weight:700;flex-shrink:0;font-size:16px;line-height:1.3}
.step-list{list-style:none;display:flex;flex-direction:column;gap:13px}
.step-list li{font-size:13.5px;display:flex;gap:11px;align-items:flex-start;line-height:1.65;color:var(--ink)}
.sn{min-width:24px;height:24px;border-radius:50%;background:var(--rust);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
.tips-section{margin-top:4px}
.tips-section h4{font-family:'Lora',serif;font-size:15px;color:var(--ink);margin-bottom:12px;padding-bottom:8px;border-bottom:1.5px solid var(--border)}
.tips-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}
.tip-item{background:rgba(212,151,58,.08);border:1px solid rgba(212,151,58,.25);border-radius:11px;padding:13px 14px;font-size:13px;color:var(--ink);line-height:1.6}
.tip-item .tip-label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--amber);margin-bottom:4px}
.serving-row{background:rgba(94,122,82,.07);border:1px solid rgba(94,122,82,.2);border-radius:11px;padding:13px 16px;margin-top:14px;font-size:13px;color:var(--ink);line-height:1.6;display:flex;gap:8px;align-items:flex-start}
.serving-row b{color:var(--sage);flex-shrink:0}
.nut-row{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap}
.nut{flex:1;min-width:62px;background:var(--paper);border:1px solid var(--border);border-radius:11px;padding:11px;text-align:center}
.nut .v{font-family:'Lora',serif;font-size:16px;font-weight:600;color:var(--ink)}
.nut .l{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-top:3px}

.modal-bg{position:fixed;inset:0;background:rgba(26,18,8,.55);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadein .2s}
@keyframes fadein{from{opacity:0}to{opacity:1}}
.modal{background:var(--card);border-radius:20px;padding:30px;max-width:440px;width:100%;box-shadow:0 24px 80px rgba(0,0,0,.2);animation:up .25s ease}
.modal h3{font-family:'Lora',serif;font-size:21px;margin-bottom:5px}
.modal .sub{font-size:13px;color:var(--muted);margin-bottom:18px;line-height:1.5}
.stars{display:flex;gap:8px;margin-bottom:15px}
.star{font-size:29px;cursor:pointer;transition:transform .15s;filter:grayscale(1) opacity(.35)}
.star.on{filter:none;transform:scale(1.1)}
.modal textarea{width:100%;border:1.5px solid var(--border);border-radius:10px;padding:11px 13px;font-family:'Outfit',sans-serif;font-size:13px;color:var(--ink);background:var(--paper);resize:vertical;min-height:76px;outline:none;transition:border .2s;line-height:1.6}
.modal textarea:focus{border-color:var(--rust)}
.modal-actions{display:flex;gap:9px;margin-top:15px}

.ck-card{background:var(--card);border:1px solid var(--border);border-radius:15px;padding:18px;display:flex;gap:14px;align-items:flex-start;transition:all .2s;margin-bottom:11px}
.ck-card:hover{box-shadow:0 4px 20px rgba(0,0,0,.07)}
.ck-emoji{font-size:30px;flex-shrink:0}
.ck-body{flex:1}
.ck-name{font-family:'Lora',serif;font-size:16px;font-weight:700;color:var(--ink);margin-bottom:3px}
.ck-date{font-size:11px;color:var(--muted);margin-bottom:5px}
.ck-stars{font-size:14px;margin-bottom:4px;color:var(--amber)}
.ck-notes{font-size:13px;color:var(--muted);line-height:1.5;font-style:italic}
.ck-del{background:none;border:none;cursor:pointer;color:#ccc;font-size:15px;padding:0;transition:color .15s;flex-shrink:0}
.ck-del:hover{color:var(--rust)}

.err{background:rgba(191,78,42,.08);border:1px solid rgba(191,78,42,.25);border-radius:10px;padding:13px 16px;font-size:13px;color:var(--rust);margin-top:11px;line-height:1.5;word-break:break-word}
.loader{text-align:center;padding:56px 20px}
.spin{width:42px;height:42px;border:3px solid var(--border);border-top-color:var(--rust);border-radius:50%;animation:spin .75s linear infinite;margin:0 auto 18px}
@keyframes spin{to{transform:rotate(360deg)}}
.loader h3{font-family:'Lora',serif;font-size:19px;margin-bottom:5px}
.loader p{color:var(--muted);font-size:13px}
`

const CATS  = ["All","🥩 Meat","🥦 Veg","🥛 Dairy","🌾 Grains","🧴 Pantry","🍎 Fruit","🥚 Eggs","🐟 Fish","Other"]
const DIETS = ["No restrictions","Vegetarian","Vegan","Gluten-free","Dairy-free","Low-carb","Keto","Halal"]
const MEALS = ["Any","Breakfast","Lunch","Dinner","Snack","Dessert"]

// ── NEW: cook-time options ──────────────────────────────────────────────────
const TIMES = [
  { label: "⚡ 15 min",   value: "under 15 minutes" },
  { label: "🕐 30 min",   value: "under 30 minutes" },
  { label: "🕑 45 min",   value: "under 45 minutes" },
  { label: "🕒 1 hour",   value: "under 1 hour"     },
  { label: "🍲 1 hour+",  value: "over 1 hour (slow cook / elaborate)" },
]

function catOf(n) {
  n = n.toLowerCase()
  if (/chicken|beef|pork|lamb|turkey|bacon|sausage|meat/.test(n))           return "🥩 Meat"
  if (/milk|cheese|yogurt|butter|cream/.test(n))                            return "🥛 Dairy"
  if (/rice|pasta|bread|flour|oat|wheat|noodle/.test(n))                    return "🌾 Grains"
  if (/apple|banana|orange|berry|mango|grape|lemon|lime/.test(n))           return "🍎 Fruit"
  if (/egg/.test(n))                                                         return "🥚 Eggs"
  if (/salmon|tuna|fish|shrimp|prawn|cod|seafood/.test(n))                  return "🐟 Fish"
  if (/onion|garlic|tomato|pepper|carrot|spinach|broccoli|lettuce|mushroom|potato|zucchini|cucumber|celery|cabbage/.test(n)) return "🥦 Veg"
  if (/oil|salt|sugar|spice|sauce|vinegar|stock|broth|can|jar/.test(n))     return "🧴 Pantry"
  return "Other"
}

// ── Auth ────────────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode]       = useState("login")
  const [email, setEmail]     = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr]         = useState("")
  const [ok, setOk]           = useState("")

  const submit = async () => {
    setLoading(true); setErr(""); setOk("")
    try {
      if (mode === "login") {
        const { data, error } = await sb.auth.signInWithPassword({ email, password })
        if (error) throw error
        onAuth(data.user)
      } else {
        const { error } = await sb.auth.signUp({ email, password })
        if (error) throw error
        setOk("Account created! Check your email to confirm, then sign in.")
        setMode("login")
      }
    } catch (e) { setErr(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <div className="auth-logo">mise <span>en place</span></div>
        <div className="auth-tagline">Your personal AI kitchen assistant</div>
        <div className="auth-tabs">
          <button className={`auth-tab ${mode==="login"?"on":""}`}  onClick={()=>{setMode("login");setErr("");setOk("")}}>Sign In</button>
          <button className={`auth-tab ${mode==="signup"?"on":""}`} onClick={()=>{setMode("signup");setErr("");setOk("")}}>Create Account</button>
        </div>
        <div className="field"><label>Email</label><input className="inp" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} /></div>
        <div className="field"><label>Password</label><input className="inp" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} /></div>
        <button className="auth-btn" onClick={submit} disabled={loading||!email||!password}>
          {loading ? "Please wait…" : mode==="login" ? "Sign In →" : "Create Account →"}
        </button>
        {err && <div className="auth-err">{err}</div>}
        {ok  && <div className="auth-ok">{ok}</div>}
      </div>
    </div>
  )
}

// ── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]           = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [tab, setTab]             = useState("pantry")

  // Pantry
  const [pantry, setPantry]       = useState([])
  const [newIng, setNewIng]       = useState("")
  const [filterCat, setFilterCat] = useState("All")
  const [imgBase64, setImgBase64] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [drag, setDrag]           = useState(false)
  const [scanning, setScanning]   = useState(false)
  const [scanErr, setScanErr]     = useState("")
  const [pantryLoading, setPantryLoading] = useState(false)

  // ── NEW: set of item IDs skipped for the current session ──────────────────
  const [skippedIds, setSkippedIds] = useState(new Set())

  // Recipes
  const [people, setPeople]       = useState(2)
  const [diet, setDiet]           = useState("No restrictions")
  const [meal, setMeal]           = useState("Any")
  const [cookTime, setCookTime]   = useState(TIMES[1].value)   // default 30 min
  const [loading, setLoading]     = useState(false)
  const [recipes, setRecipes]     = useState(null)
  const [expanded, setExpanded]   = useState(null)
  const [recipeErr, setRecipeErr] = useState("")

  // Cookbook
  const [cookbook, setCookbook]   = useState([])
  const [madeModal, setMadeModal] = useState(null)
  const [stars, setStars]         = useState(0)
  const [notes, setNotes]         = useState("")
  const [saving, setSaving]       = useState(false)

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setAuthChecked(true)
    })
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) { setPantry([]); setCookbook([]); return }
    loadPantry(); loadCookbook()
  }, [user])

  const loadPantry = async () => {
    setPantryLoading(true)
    const { data } = await sb.from("pantry_items").select("*").order("created_at", { ascending: true })
    if (data) setPantry(data)
    setPantryLoading(false)
  }

  const loadCookbook = async () => {
    const { data } = await sb.from("cookbook").select("*").order("created_at", { ascending: false })
    if (data) setCookbook(data)
  }

  const addIngredient = async (name) => {
    const clean = name.trim()
    if (!clean || pantry.find(i => i.name.toLowerCase() === clean.toLowerCase())) return
    const { data } = await sb.from("pantry_items").insert({ user_id: user.id, name: clean, cat: catOf(clean) }).select().single()
    if (data) setPantry(p => [...p, data])
  }

  const removeIngredient = async (id) => {
    await sb.from("pantry_items").delete().eq("id", id)
    setPantry(p => p.filter(i => i.id !== id))
    setSkippedIds(s => { const n = new Set(s); n.delete(id); return n })
  }

  // ── Toggle skip-for-now (no DB write — session only) ─────────────────────
  const toggleSkip = (id) => {
    setSkippedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const clearSkips = () => setSkippedIds(new Set())

  const handleFile = (file) => {
    if (!file?.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = e => { setImgPreview(e.target.result); setImgBase64(e.target.result.split(",")[1]) }
    reader.readAsDataURL(file)
  }

  const scanImage = async () => {
    if (!imgBase64) return
    setScanning(true); setScanErr("")
    try {
      const text = await llm(
        `List every food ingredient or grocery item visible in this image description. Return ONLY a JSON array of strings, no markdown. Example: ["chicken","tomatoes","garlic"]`
      )
      const match = text.match(/\[[\s\S]*?\]/)
      if (!match) throw new Error("Could not read ingredients")
      const items = JSON.parse(match[0])
      for (const item of items) await addIngredient(item)
      setImgPreview(null); setImgBase64(null)
    } catch (e) { setScanErr("Scan failed: " + e.message) }
    finally { setScanning(false) }
  }

  const generateRecipes = async () => {
    // Only include ingredients that are NOT skipped
    const activeIngredients = pantry.filter(i => !skippedIds.has(i.id))
    if (!activeIngredients.length) return

    setLoading(true); setRecipeErr(""); setRecipes(null); setExpanded(null)

    const ingList   = activeIngredients.map(i => i.name).join(", ")
    const skippedNames = pantry.filter(i => skippedIds.has(i.id)).map(i => i.name).join(", ")
    const skipNote  = skippedNames ? ` Do NOT use these ingredients: ${skippedNames}.` : ""

    const prompt = `You are a world-class chef and food writer. Ingredients available: ${ingList}.${skipNote}
Generate exactly 3 detailed, restaurant-quality recipes for ${people} people. Diet: ${diet}. Meal type: ${meal}. Cook time constraint: ${cookTime}.

Each recipe must be rich and thorough. For each recipe provide:
- A vivid 2-3 sentence description that makes the reader hungry
- Detailed ingredients with exact scaled quantities for ${people} people
- At least 6-8 detailed cooking steps, each step being a full instructional sentence with temperatures, timings, and technique tips embedded inline
- 3 distinct chef's tips covering: a substitution, a technique secret, and a serving/plating suggestion
- "prepTime" and "cookTime" as separate strings (e.g. "10 mins", "25 mins")
- "servingSuggestion": a short string describing what to serve alongside
- "flavourProfile": array of 3-5 short tags e.g. ["Smoky","Umami","Hearty"]
- "whyItWorks": one sentence explaining the culinary science or flavour logic behind the dish

Respond ONLY with a valid JSON array (no markdown, no backticks, no extra text):
[{
  "emoji":"🍝",
  "name":"",
  "description":"",
  "prepTime":"",
  "cookTime":"",
  "difficulty":"",
  "matchPercent":90,
  "calories":400,
  "protein":"25g",
  "carbs":"40g",
  "fat":"10g",
  "fibre":"5g",
  "flavourProfile":["tag"],
  "servingSuggestion":"",
  "whyItWorks":"",
  "ingredients":["exact qty + item, preparation note"],
  "steps":["Detailed step with timing and technique"],
  "tips":["substitution tip","technique secret","serving/plating tip"]
}]`

    try {
      const text  = await llm(prompt)
      const match = text.match(/\[[\s\S]*\]/)
      if (!match) throw new Error("No JSON in response: " + text.slice(0, 150))
      setRecipes(JSON.parse(match[0]))
    } catch (e) { setRecipeErr("Error: " + e.message) }
    finally { setLoading(false) }
  }

  const saveToCookbook = async () => {
  if (!madeModal) return
  setSaving(true)
  console.log("madeModal at save time:", JSON.stringify(madeModal))  // 👈 add this
  const { data, error } = await sb.from("cookbook").insert({ 
    user_id: user.id, 
    name: madeModal.name, 
    emoji: madeModal.emoji, 
    description: madeModal.description, 
    stars, 
    notes, 
    people, 
    recipe_data: madeModal
  }).select().single()
  console.log("insert result:", data, error)  // 👈 and this
  if (data) setCookbook(c => [data, ...c])
  setMadeModal(null); setStars(0); setNotes(""); setSaving(false)
  }

  const deleteCookbookEntry = async (id) => {
    await sb.from("cookbook").delete().eq("id", id)
    setCookbook(c => c.filter(e => e.id !== id))
  }

  const signOut = async () => {
    await sb.auth.signOut()
    setUser(null); setPantry([]); setCookbook([])
  }

  const filtered         = filterCat === "All" ? pantry : pantry.filter(i => i.cat === filterCat)
  const activeCount      = pantry.length - skippedIds.size
  const skippedCount     = skippedIds.size

  if (!authChecked) return (
    <><style>{S}</style>
    <div className="auth-wrap">
      <div className="spin" style={{width:40,height:40,border:"3px solid #e6dccb",borderTopColor:"#bf4e2a",borderRadius:"50%",animation:"spin .75s linear infinite",margin:"auto"}} />
    </div></>
  )
  if (!user) return <><style>{S}</style><AuthScreen onAuth={setUser} /></>

  return (
    <>
      <style>{S}</style>

      {/* ── Made-it modal ── */}
      {madeModal && (
        <div className="modal-bg" onClick={() => setMadeModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>You made it! 🎉</h3>
            <p className="sub">Save <strong>{madeModal.name}</strong> to your cookbook.</p>
            <div className="stars">{[1,2,3,4,5].map(n => <span key={n} className={`star ${stars>=n?"on":""}`} onClick={()=>setStars(n)}>★</span>)}</div>
            <textarea placeholder="How did it go? Any tweaks? (optional)" value={notes} onChange={e=>setNotes(e.target.value)} />
            <div className="modal-actions">
              <button className="btn btn-rust" style={{flex:1}} onClick={saveToCookbook} disabled={saving}>{saving?"Saving…":"Save to Cookbook"}</button>
              <button className="btn btn-ghost" onClick={()=>setMadeModal(null)}>Skip</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Nav ── */}
      <nav className="nav">
        <div className="nav-brand">mise <span>en place</span></div>
        <div className="nav-center">
          {[["pantry","🥕 Pantry"],["recipes","✨ Recipes"],["cookbook","📖 Cookbook"]].map(([k,l]) => (
            <button key={k} className={`nav-tab ${tab===k?"on":""}`} onClick={()=>setTab(k)}>
              {l}
              {k==="pantry"   && pantry.length   > 0 && <span className="count-badge">{pantry.length}</span>}
              {k==="cookbook" && cookbook.length > 0 && <span className="count-badge">{cookbook.length}</span>}
            </button>
          ))}
        </div>
        <div className="nav-right">
          <span className="user-pill">👤 {user.email}</span>
          <button className="sign-out" onClick={signOut}>Sign out</button>
        </div>
      </nav>

      {/* ════════════════════════════════════
          PANTRY TAB
      ════════════════════════════════════ */}
      {tab === "pantry" && (
        <div className="page">
          <div className="sec-eye">Your Kitchen</div>
          <div className="sec-title">Pantry & Fridge</div>
          <div className="sec-sub">
            Saved to your account. Remove items as you use them, add new ones anytime.
            {" "}Tap <strong>⊘</strong> on any item to skip it for the current meal without deleting it.
          </div>

          {/* Skip banner */}
          {skippedCount > 0 && (
            <div className="skip-banner">
              <span>⊘ <b>{skippedCount} item{skippedCount>1?"s":""}</b> skipped for this session — won't appear in recipes.</span>
              <button className="skip-clear" onClick={clearSkips}>Clear all skips</button>
            </div>
          )}

          {/* Photo upload */}
          <div className={`upload-zone ${drag?"drag":""}`}
            onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)}
            onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0])}}>
            <input type="file" accept="image/*" onChange={e=>handleFile(e.target.files[0])} />
            {imgPreview
              ? <><img src={imgPreview} className="img-thumb" alt="groceries"/><p style={{fontSize:12,color:"var(--sage)"}}>✓ Ready to scan</p></>
              : <><div style={{fontSize:30,marginBottom:8}}>📷</div><h4>Drop a grocery photo to auto-scan</h4><p>AI detects all ingredients and adds them to your pantry</p></>}
          </div>
          {imgPreview && (
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <button className="btn btn-rust" style={{flex:1}} onClick={scanImage} disabled={scanning}>{scanning?"Scanning…":"✨ Scan & Add to Pantry"}</button>
              <button className="btn btn-ghost" onClick={()=>{setImgPreview(null);setImgBase64(null)}}>Clear</button>
            </div>
          )}
          {scanErr && <div className="err">{scanErr}</div>}

          <div className="divider">or add manually</div>
          <div style={{display:"flex",gap:8,marginBottom:18}}>
            <input className="inp" placeholder="Type an ingredient + Enter…" value={newIng} onChange={e=>setNewIng(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"){addIngredient(newIng);setNewIng("")}}} />
            <button className="btn btn-rust" onClick={()=>{addIngredient(newIng);setNewIng("")}}>Add</button>
          </div>

          {pantry.length > 0 && (
            <div className="cat-row">
              {CATS.filter(c=>c==="All"||pantry.some(i=>i.cat===c)).map(c=>(
                <button key={c} className={`cat-pill ${filterCat===c?"on":""}`} onClick={()=>setFilterCat(c)}>{c}</button>
              ))}
            </div>
          )}

          {pantryLoading
            ? <div className="loader"><div className="spin"/><p>Loading your pantry…</p></div>
            : pantry.length === 0
              ? <div className="empty-state"><div className="big">🛒</div><h3>Your pantry is empty</h3><p>Upload a grocery photo or add items above.</p></div>
              : filtered.length === 0
                ? <div className="empty-state"><p>No items in this category.</p></div>
                : <div className="ing-grid">
                    {filtered.map(ing => {
                      const isSkipped = skippedIds.has(ing.id)
                      return (
                        <div key={ing.id} className={`ing-card ${isSkipped?"skipped":""}`}>
                          <div>
                            <div className="ing-name" style={isSkipped?{textDecoration:"line-through"}:{}}>{ing.name}</div>
                            <div className="ing-cat">{isSkipped ? "skipped for now" : ing.cat}</div>
                          </div>
                          <div className="ing-actions">
                            {/* Skip-for-now toggle */}
                            <button
                              className={`ing-skip ${isSkipped?"active":""}`}
                              title={isSkipped ? "Restore for recipes" : "Skip for this meal"}
                              onClick={()=>toggleSkip(ing.id)}
                            >⊘</button>
                            {/* Permanent delete */}
                            <button className="ing-del" title="Remove from pantry" onClick={()=>removeIngredient(ing.id)}>×</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
          }

          {pantry.length > 0 && (
            <button className="gen-btn" onClick={()=>setTab("recipes")}>
              Cook with {activeCount} ingredient{activeCount!==1?"s":""}
              {skippedCount > 0 ? ` (${skippedCount} skipped)` : ""} →
            </button>
          )}
        </div>
      )}

      {/* ════════════════════════════════════
          RECIPES TAB
      ════════════════════════════════════ */}
      {tab === "recipes" && (
        <div className="page">
          <div className="sec-eye">What to Cook</div>
          <div className="sec-title">Recipe Ideas</div>
          <div className="sec-sub">
            Generated from {activeCount} of your {pantry.length} pantry ingredients
            {skippedCount > 0 ? ` (${skippedCount} skipped)` : ""}.
          </div>

          {pantry.length === 0
            ? <div className="empty-state">
                <div className="big">🥕</div>
                <h3>No ingredients yet</h3>
                <p>Add groceries to your Pantry first.</p>
                <button className="btn btn-rust" style={{marginTop:16}} onClick={()=>setTab("pantry")}>Go to Pantry</button>
              </div>
            : <>
                {/* People */}
                <div className="pref-card">
                  <h3>How many people?</h3>
                  <div className="people-row">
                    <span style={{fontSize:13,color:"var(--muted)"}}>Scales all quantities automatically</span>
                    <div className="people-ctrl">
                      <button className="p-btn" onClick={()=>setPeople(p=>Math.max(1,p-1))}>−</button>
                      <div className="p-num">{people}</div>
                      <button className="p-btn" onClick={()=>setPeople(p=>Math.min(20,p+1))}>+</button>
                    </div>
                  </div>
                </div>

                {/* ── NEW: Cook time ── */}
                <div className="pref-card">
                  <h3>How much time do you have?</h3>
                  <div className="time-chips">
                    {TIMES.map(t => (
                      <button
                        key={t.value}
                        className={`time-chip ${cookTime===t.value?"on":""}`}
                        onClick={()=>setCookTime(t.value)}
                      >{t.label}</button>
                    ))}
                  </div>
                </div>

                {/* Diet */}
                <div className="pref-card">
                  <h3>Dietary preference</h3>
                  <div className="pref-chips">
                    {DIETS.map(d=><button key={d} className={`pref-chip ${diet===d?"on":""}`} onClick={()=>setDiet(d)}>{d}</button>)}
                  </div>
                </div>

                {/* Meal type */}
                <div className="pref-card">
                  <h3>Meal type</h3>
                  <div className="pref-chips">
                    {MEALS.map(m=><button key={m} className={`pref-chip ${meal===m?"on":""}`} onClick={()=>setMeal(m)}>{m}</button>)}
                  </div>
                </div>

                {/* Skipped items reminder */}
                {skippedCount > 0 && (
                  <div className="skip-banner" style={{marginBottom:0}}>
                    <span>⊘ Excluding <b>{skippedCount} skipped item{skippedCount>1?"s":""}</b> from recipes.</span>
                    <button className="skip-clear" onClick={()=>{clearSkips()}}>Restore all</button>
                  </div>
                )}

                <button className="gen-btn" onClick={generateRecipes} disabled={loading||activeCount===0}>
                  {loading ? "✨ Generating…" : `✨ Generate Recipes for ${people} ${people===1?"person":"people"}`}
                </button>

                {recipeErr && <div className="err">{recipeErr}</div>}
                {loading && (
                  <div className="loader">
                    <div className="spin"/>
                    <h3>Chef is thinking…</h3>
                    <p>Crafting recipes from {activeCount} ingredients in {TIMES.find(t=>t.value===cookTime)?.label}</p>
                  </div>
                )}

                {recipes && (
                  <>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",margin:"26px 0 14px",flexWrap:"wrap",gap:10}}>
                      <div style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:700}}>3 Recipes for you ✨</div>
                      <button className="btn btn-ghost" style={{fontSize:12}} onClick={generateRecipes}>↺ Regenerate</button>
                    </div>
                    <div className="recipe-list">
                      {recipes.map((r,i) => (
                        <div key={i} className="r-card">
                          {/* Header */}
                          <div className="r-head">
                            <span className="r-emoji">{r.emoji}</span>
                            <div className="r-meta">
                              <div className="r-name">{r.name}</div>
                              <div className="r-desc">{r.description}</div>
                              {r.whyItWorks && <div className="r-why">💡 {r.whyItWorks}</div>}
                              <div className="r-badges">
                                <span className="badge b-diff">{r.difficulty}</span>
                                <span className="badge b-match">{r.matchPercent}% match</span>
                                {r.flavourProfile?.map(f => <span key={f} className="badge b-flavour">{f}</span>)}
                              </div>
                            </div>
                          </div>

                          {/* Timing bar */}
                          <div className="r-timing">
                            <div className="r-timing-item"><span className="tl">Prep</span><span className="tv">{r.prepTime || "—"}</span></div>
                            <div className="r-timing-item"><span className="tl">Cook</span><span className="tv">{r.cookTime || r.time || "—"}</span></div>
                            <div className="r-timing-item"><span className="tl">Serves</span><span className="tv">{people} {people===1?"person":"people"}</span></div>
                            <div className="r-timing-item"><span className="tl">Calories</span><span className="tv">{r.calories} kcal</span></div>
                          </div>

                          {/* Footer actions */}
                          <div className="r-footer">
                            <div className="r-stats">
                              <span>🥩 {r.protein}</span>
                              <span>🌾 {r.carbs}</span>
                              <span>🫙 {r.fat}</span>
                              {r.fibre && <span>🌿 {r.fibre}</span>}
                            </div>
                            <div className="r-actions">
                              <button className="btn btn-sage" style={{fontSize:12,padding:"7px 13px"}} onClick={()=>{setMadeModal(r);setStars(0);setNotes("")}}>✓ Made it!</button>
                              <button className="expand-btn" onClick={()=>setExpanded(expanded===i?null:i)}>{expanded===i?"▲ Hide details":"▼ Full recipe"}</button>
                            </div>
                          </div>

                          {/* Expanded detail */}
                          {expanded===i && (
                            <div className="r-detail">
                              {/* Nutrition */}
                              <div className="nut-row">
                                {[["Calories",r.calories+"kcal"],["Protein",r.protein],["Carbs",r.carbs],["Fat",r.fat],["Fibre",r.fibre||"—"]].map(([l,v])=>(
                                  <div key={l} className="nut"><div className="v">{v}</div><div className="l">{l}</div></div>
                                ))}
                              </div>

                              {/* Ingredients + Steps */}
                              <div className="detail-grid">
                                <div className="d-sec">
                                  <h4>🧺 Ingredients</h4>
                                  <ul className="ing-list">{r.ingredients?.map((x,j)=><li key={j}>{x}</li>)}</ul>
                                </div>
                                <div className="d-sec">
                                  <h4>👨‍🍳 Method</h4>
                                  <ol className="step-list">{r.steps?.map((s,j)=><li key={j}><span className="sn">{j+1}</span><span>{s}</span></li>)}</ol>
                                </div>
                              </div>

                              {/* Tips */}
                              {r.tips && (
                                <div className="tips-section">
                                  <h4>Chef's Tips</h4>
                                  <div className="tips-grid">
                                    {(Array.isArray(r.tips) ? r.tips : [r.tips]).map((tip, j) => (
                                      <div key={j} className="tip-item">
                                        <div className="tip-label">{["💡 Substitution","🔪 Technique","🍽️ Serving"][j] || "💡 Tip"}</div>
                                        {tip}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Serving suggestion */}
                              {r.servingSuggestion && (
                                <div className="serving-row">
                                  <b>🥗 Serve with:</b> {r.servingSuggestion}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
          }
        </div>
      )}

      {/* ════════════════════════════════════
          COOKBOOK TAB
      ════════════════════════════════════ */}
      {tab === "cookbook" && (
        <div className="page">
          <div className="sec-eye">Your History</div>
          <div className="sec-title">My Cookbook</div>
          <div className="sec-sub">Every recipe you've cooked, saved with ratings and notes.</div>
          {cookbook.length === 0
            ? <div className="empty-state">
                <div className="big">📖</div>
                <h3>Your cookbook is empty</h3>
                <p>Cook a recipe and tap <strong>"Made it!"</strong> to save it here.</p>
                <button className="btn btn-rust" style={{marginTop:16}} onClick={()=>setTab("recipes")}>Find a recipe</button>
              </div>
            : cookbook.map(e => {
                const r = e.recipe_data
                const isOpen = expanded === e.id
                return (
                  <div key={e.id} className="r-card" style={{marginBottom:15}}>
                    {/* Header */}
                    <div className="r-head">
                      <span className="r-emoji">{e.emoji||"🍽️"}</span>
                      <div className="r-meta" style={{flex:1}}>
                        <div className="r-name">{e.name}</div>
                        <div style={{fontSize:12,color:"var(--muted)",marginBottom:6}}>
                          {new Date(e.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                          {" · "}{e.people} {e.people===1?"person":"people"}
                        </div>
                        {e.stars > 0 && <div className="ck-stars" style={{marginBottom:4}}>{"★".repeat(e.stars)}{"☆".repeat(5-e.stars)}</div>}
                        {e.notes && <div className="ck-notes">"{e.notes}"</div>}
                        {r?.flavourProfile && (
                          <div className="r-badges" style={{marginTop:8}}>
                            {r.flavourProfile.map(f=><span key={f} className="badge b-flavour">{f}</span>)}
                          </div>
                        )}
                      </div>
                      <button className="ck-del" onClick={()=>deleteCookbookEntry(e.id)}>×</button>
                    </div>

                    {/* Timing bar — only if full recipe saved */}
                    {r && (
                      <div className="r-timing">
                        <div className="r-timing-item"><span className="tl">Prep</span><span className="tv">{r.prepTime||"—"}</span></div>
                        <div className="r-timing-item"><span className="tl">Cook</span><span className="tv">{r.cookTime||r.time||"—"}</span></div>
                        <div className="r-timing-item"><span className="tl">Calories</span><span className="tv">{r.calories} kcal</span></div>
                        <div className="r-timing-item"><span className="tl">Difficulty</span><span className="tv">{r.difficulty||"—"}</span></div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="r-footer">
                      {r ? (
                        <div className="r-stats">
                          <span>🥩 {r.protein}</span>
                          <span>🌾 {r.carbs}</span>
                          <span>🫙 {r.fat}</span>
                        </div>
                      ) : <div/>}
                      {r && (
                        <button className="expand-btn" onClick={()=>setExpanded(isOpen ? null : e.id)}>
                          {isOpen ? "▲ Hide recipe" : "▼ Full recipe"}
                        </button>
                      )}
                    </div>

                    {/* Expanded full recipe */}
                    {r && isOpen && (
                      <div className="r-detail">
                        {r.whyItWorks && <div className="r-why" style={{marginBottom:16}}>💡 {r.whyItWorks}</div>}
                        <div className="nut-row">
                          {[["Calories",r.calories+"kcal"],["Protein",r.protein],["Carbs",r.carbs],["Fat",r.fat],["Fibre",r.fibre||"—"]].map(([l,v])=>(
                            <div key={l} className="nut"><div className="v">{v}</div><div className="l">{l}</div></div>
                          ))}
                        </div>
                        <div className="detail-grid">
                          <div className="d-sec">
                            <h4>🧺 Ingredients</h4>
                            <ul className="ing-list">{r.ingredients?.map((x,j)=><li key={j}>{x}</li>)}</ul>
                          </div>
                          <div className="d-sec">
                            <h4>👨‍🍳 Method</h4>
                            <ol className="step-list">{r.steps?.map((s,j)=><li key={j}><span className="sn">{j+1}</span><span>{s}</span></li>)}</ol>
                          </div>
                        </div>
                        {r.tips && (
                          <div className="tips-section">
                            <h4>Chef's Tips</h4>
                            <div className="tips-grid">
                              {(Array.isArray(r.tips) ? r.tips : [r.tips]).map((tip,j)=>(
                                <div key={j} className="tip-item">
                                  <div className="tip-label">{["💡 Substitution","🔪 Technique","🍽️ Serving"][j]||"💡 Tip"}</div>
                                  {tip}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {r.servingSuggestion && (
                          <div className="serving-row"><b>🥗 Serve with:</b> {r.servingSuggestion}</div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
          }
        </div>
      )}
    </>
  )
}