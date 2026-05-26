/* eslint-disable */
const SUPABASE_URL = "https://cxmsvcbewyjnujuumakl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4bXN2Y2Jld3lqbnVqdXVtYWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDUyNjgsImV4cCI6MjA5NTMyMTI2OH0.nODg--WPwDP7cXDaZ16KiIkBTSJFLnDBpkaYylQmifQ";

// Supabase API helper
async function sb(table, method="GET", body=null, params="") {
  const url = `${SUPABASE_URL}/rest/v1/${table}${params}`;
  const res = await fetch(url, {
    method,
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": method==="POST"?"return=representation":"",
    },
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) { const e = await res.text(); console.error("Supabase error:", e); return null; }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

import { useState, useEffect, useRef, useCallback } from "react";

const C={bg:"#F9FAFB",white:"#FFFFFF",cream:"#FAF7F2",parchment:"#F0EAE0",tan:"#E4D5BC",amber:"#C8852A",amberL:"#E09A40",dark:"#1C1A17",darkM:"#2E2B26",darkL:"#4A4640",stone:"#7A7468",stoneL:"#A89F93",blue:"#1A6BB5",blueP:"#E8F0FB",green:"#4A8C5C",red:"#B84A4A",teal:"#1A7A6B",gold:"#B8860B"};
const RATE_AC=165,RATE_MEM=80,FUND_AMTS=[500,1000,2000,3000,4000,5000,6000,7000,8000,9000,10000];
const KCDW_LAT=40.8752,KCDW_LNG=-74.2844;
const now=new Date();
const pad=n=>String(n).padStart(2,"0");
const fmtDate=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const addDays=(d,n)=>{const r=new Date(d);r.setDate(r.getDate()+n);return r;};
const t2m=t=>{const[h,m]=t.split(":").map(Number);return h*60+m;};
const fmtH=h=>h===12?"12pm":h>12?(h-12)+"pm":h+"am";
const $$=n=>"$"+parseFloat(n).toFixed(2);
const TODAY=fmtDate(now);
const MEMBER_PROFILES={"sarah@kcdw.com":{name:"Sarah Mitchell",init:"SM",role:"member",instructorId:null},"torres@kcdw.com":{name:"Capt. Mike Torres",init:"MT",role:"instructor",instructorId:1},"chen@kcdw.com":{name:"Lisa Chen",init:"LC",role:"instructor",instructorId:2}};
const INSTRUCTORS=[{id:1,name:"Capt. Mike Torres",cert:"CFI/CFII/MEI",rate:85,avail:true,init:"MT",col:C.blue,bio:"15,000+ hrs. Instrument and commercial checkride prep.",phone:"973-555-0811",checkoutAuth:true},{id:2,name:"Lisa Chen",cert:"CFI/CFII",rate:75,avail:true,init:"LC",col:C.teal,bio:"Former regional FO. Primary and instrument instruction.",phone:"973-555-0822",checkoutAuth:false},{id:3,name:"Ryan Brooks",cert:"CFI",rate:65,avail:false,init:"RB",col:C.stone,bio:"Primary training. On leave through June 2026.",phone:"973-555-0833",checkoutAuth:false},{id:4,name:"Oliver MacLean",cert:"CFII",rate:75,avail:true,init:"OM",col:C.gold,bio:"Chief Instructor. Instrument and advanced flight training specialist.",phone:"973-555-0844",checkoutAuth:true,photo:"/photos/oliver-maclean.jpg"}];
const INIT_BOOKINGS=[{id:1,pilot:"Sarah Mitchell",ac:"N36JR",date:TODAY,start:"08:00",end:"10:30",type:"solo",instr:null},{id:2,pilot:"Priya Patel",ac:"N36JR",date:TODAY,start:"13:00",end:"15:00",type:"instruction",instr:"Lisa Chen"},{id:3,pilot:"James R.",ac:"N36JR",date:TODAY,start:"16:00",end:"17:30",type:"checkout",instr:"Capt. Mike Torres"},{id:4,pilot:"Sarah Mitchell",ac:"N36JR",date:fmtDate(addDays(now,1)),start:"09:00",end:"11:00",type:"solo",instr:null},{id:5,pilot:"James Rodriguez",ac:"N119S",date:TODAY,start:"11:00",end:"13:00",type:"instruction",instr:"Oliver MacLean"}];
const SQUAWKS=[{id:1,date:"4/24/26",desc:"Right landing light inop.",status:"open",res:"Safe to fly."},{id:2,date:"8/15/25",desc:"AMSAFE restraint INOP.",status:"open",res:"Deferred."},{id:3,date:"4/27/25",desc:"Pedestal lights inop.",status:"open",res:"Safe to fly."},{id:4,date:"1/10/25",desc:"Left tire worn.",status:"closed",res:"Tire replaced."},{id:5,ac:"N119S",date:"5/20/26",desc:"Transponder intermittent.",status:"open",res:"Scheduled with avionics shop."}];
const REMINDERS=[{id:1,name:"Annual Inspection",st:"warning",days:138,last:"10/8/2025"},{id:2,name:"AD 2001-06-17",st:"warning",days:138,last:"5/2/2025"},{id:3,name:"GFC700 Check",st:"warning",days:138,last:"5/2/2025"},{id:4,name:"ELT Inspection",st:"warning",days:138,last:"5/2/2025"},{id:5,name:"Oil Change (50-hr)",st:"ok",days:null,hrs:18.4,last:"4/22/2026"},{id:6,name:"Pitot-Static 91.411",st:"ok",days:480,last:"9/14/2025"},{id:7,name:"VOR Check 91.171",st:"expired",days:-12,last:"5/11/2026"}];
const PHOTOS=[
  {id:"a",src:"/photos/n36jr-hero.jpg",cap:"N36JR on the ramp"},
  {id:"b",src:"/photos/n36jr-hero.jpg",cap:"N36JR - 2012 Cessna 172 SP"},
  {id:"c",src:"/photos/n36jr-golden-hour.jpg",cap:"Golden hour flight"},
  {id:"d",src:"/photos/n36jr-cockpit.jpg",cap:"Cockpit - G1000 NXi"},
  {id:"e",src:"/photos/n36jr-panel.jpg",cap:"Switch panel"},
];
const SEED_TXN=[{id:"t1",type:"dep",date:fmtDate(addDays(now,-18)),desc:"Added funds - Credit Card 4242",amt:1000},{id:"t2",type:"chg",date:fmtDate(addDays(now,-12)),desc:"Aircraft time N36JR (2.1 hrs)",amt:-346.50},{id:"t3",type:"chg",date:fmtDate(addDays(now,-12)),desc:"Instruction - Lisa Chen (2.1 hrs)",amt:-157.50},{id:"t4",type:"chg",date:fmtDate(addDays(now,-5)),desc:"Aircraft time N36JR (1.9 hrs)",amt:-313.50},{id:"t5",type:"chg",date:fmtDate(addDays(now,-5)),desc:"Monthly membership May 2026",amt:-80},{id:"t6",type:"dep",date:fmtDate(addDays(now,-1)),desc:"Added funds - Bank 6789",amt:442.50}];
const SEED_INV=[{id:101,date:fmtDate(addDays(now,-5)),total:393.50,items:[{d:"Aircraft time N36JR",q:"1.9 hrs",r:165,a:313.50},{d:"Monthly membership",q:"May 2026",r:80,a:80}]},{id:102,date:fmtDate(addDays(now,-12)),total:504,items:[{d:"Aircraft time N36JR",q:"2.1 hrs",r:165,a:346.50},{d:"Instruction - Lisa Chen",q:"2.1 hrs",r:75,a:157.50}]}];
const SEED_CHECKOUTS=[{id:"co1",memberId:"sarah@kcdw.com",memberName:"Sarah Mitchell",instructorId:1,instructorName:"Capt. Mike Torres",date:fmtDate(addDays(now,-2)),hobbsIn:"3241.6",hobbsOut:"3243.4",status:"pending",notes:"",declineReason:""}];


function useGeo(){
  const[g,setG]=useState({ok:false,dist:null,near:false});
  useEffect(()=>{
    if(!navigator.geolocation)return;
    navigator.geolocation.getCurrentPosition(p=>{
      const R=3958.8,la=(p.coords.latitude-KCDW_LAT)*Math.PI/180,lo=(p.coords.longitude-KCDW_LNG)*Math.PI/180;
      const a=Math.sin(la/2)**2+Math.cos(KCDW_LAT*Math.PI/180)*Math.cos(p.coords.latitude*Math.PI/180)*Math.sin(lo/2)**2;
      setG({ok:true,dist:R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)),near:R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))<=1});
    },()=>{});
  },[]);
  return g;
}

function InjectCSS(){
  useEffect(()=>{
    if(document.getElementById("kcdw-css"))return;
    const el=document.createElement("style");
    el.id="kcdw-css";
    el.textContent=[
      "*{box-sizing:border-box;margin:0;padding:0}",
      "@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}",
      "@keyframes ring{0%{transform:scale(.8);opacity:1}100%{transform:scale(2.2);opacity:0}}",
      ".rdot{width:9px;height:9px;border-radius:50%;background:#C8852A;position:relative;flex-shrink:0}",
      ".rdot::after{content:'';position:absolute;inset:0;border-radius:50%;background:#C8852A;animation:ring 1.4s ease-out infinite}",
      ".ni{display:flex;align-items:center;gap:14px;padding:14px 24px;font-size:15px;font-weight:500;color:#444;cursor:pointer;border:none;background:transparent;width:100%;text-align:left;font-family:sans-serif}",
      ".ni:hover{background:#f5f5f5}",
      ".na{color:#1A6BB5!important;font-weight:700!important;background:#E8F0FB!important}",
      ".bb{position:absolute;left:3px;right:3px;border-radius:5px;padding:4px 7px;cursor:pointer;overflow:hidden;z-index:5}",
      ".bb:hover{filter:brightness(1.1)}",
      "::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#E4D5BC;border-radius:2px}",
    ].join("");
    document.head.appendChild(el);
    return()=>{const s=document.getElementById("kcdw-css");if(s)s.remove();};
  },[]);
  return null;
}

const iSt={width:"100%",border:"1.5px solid #E4D5BC",borderRadius:8,padding:"10px 12px",fontFamily:"sans-serif",fontSize:14,color:"#1C1A17",background:"#fafafa",outline:"none",boxSizing:"border-box"};
function Lbl({children}){return <div style={{color:C.stone,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",fontFamily:"sans-serif",marginBottom:5}}>{children}</div>;}
function Fld({label,children}){return <div style={{display:"flex",flexDirection:"column",gap:4}}><Lbl>{label}</Lbl>{children}</div>;}
function Card({children,style}){return <div style={{background:C.white,borderRadius:14,border:"1px solid #E4D5BC88",boxShadow:"0 1px 8px #0000000a",...style}}>{children}</div>;}
function Bdg({col,children}){return <span style={{display:"inline-flex",alignItems:"center",padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:700,textTransform:"uppercase",background:col+"22",color:col,fontFamily:"sans-serif"}}>{children}</span>;}
function SafeImg({src,alt,style}){
  const[err,setErr]=useState(false);
  if(err||!src)return <div style={{...style,background:"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#9ca3af",fontSize:10,fontFamily:"sans-serif",textAlign:"center",padding:4}}>No photo</span></div>;
  return <img src={src} alt={alt||""} style={style} onError={()=>setErr(true)}/>;
}
function Avt({init,col,sz=38}){return <div style={{width:sz,height:sz,borderRadius:"50%",background:col+"22",border:"2px solid "+col,display:"flex",alignItems:"center",justifyContent:"center",color:col,fontWeight:800,fontSize:sz*.35,flexShrink:0}}>{init}</div>;}
function Btn({onClick,disabled,children,v,style}){
  const s=v==="ol"?{background:C.white,color:C.blue,border:"2px solid "+C.blue}:v==="gr"?{background:C.green,color:"#fff",border:"none"}:v==="rd"?{background:C.red,color:"#fff",border:"none"}:v==="am"?{background:C.amber,color:"#fff",border:"none"}:{background:C.blue,color:"#fff",border:"none"};
  return <button style={{borderRadius:8,padding:"11px 0",fontFamily:"sans-serif",fontWeight:700,fontSize:14,cursor:disabled?"not-allowed":"pointer",width:"100%",opacity:disabled?.45:1,...s,...style}} onClick={disabled?undefined:onClick} disabled={disabled}>{children}</button>;
}
function Spin(){return <div style={{width:18,height:18,border:"2.5px solid rgba(255,255,255,.4)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>;}
function Modal({onClose,children}){
  return <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:800,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
    <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,padding:"20px 20px 40px",maxHeight:"90vh",overflowY:"auto"}}>
      <div style={{width:40,height:4,borderRadius:2,background:C.tan,margin:"0 auto 18px"}}/>
      {children}
    </div>
  </div>;
}

function useBilling(memberId){
  const[bal,setBal]=useState(0);
  const[txns,setTxns]=useState([]);
  const[invs,setInvs]=useState([]);
  const[loading,setLoading]=useState(true);

  useEffect(()=>{
    if(!memberId)return;
    // Load member balance
    sb("members","GET",null,`?id=eq.${memberId}&select=balance`).then(r=>{
      if(r&&r[0])setBal(parseFloat(r[0].balance)||0);
    });
    // Load transactions
    sb("transactions","GET",null,`?member_id=eq.${memberId}&order=created_at.desc`).then(r=>{
      if(r)setTxns(r.map(t=>({id:t.id,type:t.type==="deposit"?"dep":"chg",date:t.date,desc:t.description,amt:parseFloat(t.amount)})));
      setLoading(false);
    });
  },[memberId]);

  const charge=useCallback(async(items)=>{
    const total=items.reduce((s,i)=>s+i.a,0);
    const newBal=+(bal-total).toFixed(2);
    // Insert transactions
    await Promise.all(items.map(it=>sb("transactions","POST",{member_id:memberId,type:"charge",description:it.d,amount:-it.a,date:TODAY})));
    // Update balance
    await sb("members","PATCH",{balance:newBal},`?id=eq.${memberId}`);
    setBal(newBal);
    setTxns(p=>[...items.map(it=>({id:Date.now()+Math.random(),type:"chg",date:TODAY,desc:it.d,amt:-it.a})),...p]);
    return {id:Date.now(),date:TODAY,total,items};
  },[memberId,bal]);

  const deposit=useCallback(async(amt,m,l4)=>{
    const newBal=+(bal+amt).toFixed(2);
    const desc="Added funds - "+(m==="ach"?"Bank":"Card")+" "+l4;
    await sb("transactions","POST",{member_id:memberId,type:"deposit",description:desc,amount:amt,date:TODAY});
    await sb("members","PATCH",{balance:newBal},`?id=eq.${memberId}`);
    setBal(newBal);
    setTxns(p=>[{id:Date.now(),type:"dep",date:TODAY,desc,amt},...p]);
  },[memberId,bal]);

  return{bal,txns,invs,charge,deposit,loading};
}

function SignInForm({onLogin,onJoin}){
  const[email,setEmail]=useState("");
  const[pw,setPw]=useState("");
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState("");
  const go=async()=>{
    if(!email||!pw){setErr("Enter email and password.");return;}
    setLoading(true);setErr("");
    if(email.toLowerCase().includes("new")){onJoin();setLoading(false);return;}
    const rows=await sb("members","GET",null,`?email=eq.${email.toLowerCase()}&limit=1`);
    if(rows&&rows.length>0){
      const m=rows[0];
      onLogin({id:m.id,name:m.name,email:m.email,init:m.init||m.name.split(" ").map(n=>n[0]).join(""),role:m.role||"member",instructorId:m.instructor_id||null});
    } else {
      // Demo fallback
      const profile=MEMBER_PROFILES[email.toLowerCase()];
      if(profile)onLogin({...profile,email});
      else setErr("No account found. Check your email or join.");
    }
    setLoading(false);
  };
  return <div style={{display:"flex",flexDirection:"column",gap:14}}>
    {err&&<div style={{background:C.red+"12",border:"1px solid "+C.red+"44",borderRadius:10,padding:"10px 14px",color:C.red,fontSize:13,fontFamily:"sans-serif"}}>{err}</div>}
    <Fld label="Email"><input style={iSt} type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="you@example.com"/></Fld>
    <Fld label="Password"><input style={iSt} type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="Password"/></Fld>
    <Btn onClick={go} disabled={loading}>{loading?"Signing in...":"Sign In"}</Btn>
    <div style={{background:C.parchment,borderRadius:8,padding:"10px 12px",display:"flex",flexDirection:"column",gap:5}}>
      <div style={{color:C.stone,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",fontFamily:"sans-serif"}}>Demo Accounts</div>
      {[["sarah@kcdw.com","Member (checkout pending)"],["torres@kcdw.com","Instructor - Capt. Torres"],["chen@kcdw.com","Instructor - Lisa Chen"]].map(([e,l])=>(
        <button key={e} onClick={()=>{setEmail(e);setPw("demo");}} style={{background:"none",border:"none",cursor:"pointer",textAlign:"left",padding:"2px 0",display:"flex",justifyContent:"space-between",gap:8,width:"100%"}}>
          <span style={{color:C.blue,fontSize:11,fontFamily:"sans-serif",textDecoration:"underline"}}>{e}</span>
          <span style={{color:C.stone,fontSize:10,fontFamily:"sans-serif"}}>{l}</span>
        </button>
      ))}
      <div style={{color:C.stoneL,fontSize:10,fontFamily:"sans-serif"}}>Use "new" in email to see onboarding.</div>
    </div>
  </div>;
}

function OnboardingFlow({onDone}){
  const[step,setStep]=useState(1);
  const T=7;
  const[f,setF]=useState({firstName:"",lastName:"",email:"",phone:"",instagram:"",referral:"",addr1:"",addr2:"",city:"",state:"",zip:"",cert:"Student Pilot",ratings:[],hours:"",password:"",confirm:"",marketing:false,rental1:false,rental2:false,rental3:false,rental4:false,rental5:false,dlUploaded:false,dlImg:null,pilotCertUploaded:false,pilotCertImg:null,waiver:false,terms:false});
  const u=p=>setF(x=>({...x,...p}));
  const pct=Math.round(((step-1)/T)*100);
  const ok=()=>{
    if(step===1)return f.firstName&&f.lastName&&f.email.includes("@")&&f.phone.length>=7;
    if(step===2)return f.addr1&&f.city&&f.state&&f.zip.length>=5;
    if(step===4)return f.password.length>=8&&f.password===f.confirm;
    if(step===5)return f.rental1&&f.rental2&&f.rental3&&f.rental4&&f.rental5;
    if(step===6)return f.dlUploaded;
    if(step===7)return f.waiver&&f.terms;
    return true;
  };
  const CERTS=["Student Pilot","Private Pilot","Instrument Rating","Commercial","ATP","None - I want to learn!"];
  const RATS=["Instrument (IFR)","Multi-Engine","Commercial","CFI","CFII","G1000 NXi"];
  const STEPS=["Personal Info","Address","Aviation Background","Create Password","Rental Agreement","Documents","Membership & Terms"];
  const RA=[
    ["1. ELIGIBILITY","Valid FAA certificate and medical required. Club checkout with CFI required before solo rental."],
    ["2. PRE-FLIGHT","Thorough pre-flight per POH required. Do not fly with any airworthiness concern."],
    ["3. HOBBS & BILLING","Hobbs recorded before/after every flight. Rate: $165.00/hr wet."],
    ["4. INSURANCE","Renter responsible for $5,000 deductible for any damage during operation."],
    ["5. GEOGRAPHIC LIMITS","Contiguous 48 states only. Aerobatics and compensation prohibited."],
    ["6. FUEL","Wet rate includes fuel at KCDW FBO. 100LL only."],
    ["7. ACCIDENTS","Any accident reported to club within 2 hours."],
    ["8. CANCELLATIONS","Less than 2 hours notice may incur 1-hour minimum charge."],
    ["9. RENTER DUTIES","Return with minimum fuel. Secure with control lock, chocks, and tie-downs."],
    ["10. GOVERNING LAW","Governed by laws of New Jersey. Essex County courts."],
  ];
  const pwStr=p=>{if(!p)return 0;let s=0;if(p.length>=8)s++;if(/[A-Z]/.test(p))s++;if(/[0-9]/.test(p))s++;if(/[^A-Za-z0-9]/.test(p))s++;return s;};
  const pw=pwStr(f.password);
  const pwCol=pw<=1?C.red:pw===2?C.amber:pw===3?C.blue:C.green;
  return <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",fontFamily:"sans-serif"}}>
    <div style={{background:C.dark,padding:"14px 18px 12px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:"#fff"}}>Join KCDW Flying Club</div>
        <span style={{color:C.stone,fontSize:12,fontFamily:"sans-serif"}}>Step {step} of {T}</span>
      </div>
      <div style={{height:4,background:"rgba(255,255,255,.12)",borderRadius:2}}><div style={{height:"100%",width:pct+"%",background:C.amber,borderRadius:2,transition:"width .3s"}}/></div>
    </div>
    <div style={{flex:1,padding:"20px 18px 100px",display:"flex",flexDirection:"column",gap:14,maxWidth:480,margin:"0 auto",width:"100%"}}>
      {step===1&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Personal Information</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Fld label="First Name"><input style={iSt} value={f.firstName} onChange={e=>u({firstName:e.target.value})} placeholder="Jane"/></Fld>
          <Fld label="Last Name"><input style={iSt} value={f.lastName} onChange={e=>u({lastName:e.target.value})} placeholder="Smith"/></Fld>
        </div>
        <Fld label="Email"><input style={iSt} type="email" value={f.email} onChange={e=>u({email:e.target.value})} placeholder="jane@example.com"/></Fld>
        <Fld label="Phone"><input style={iSt} type="tel" value={f.phone} onChange={e=>u({phone:e.target.value})} placeholder="(973) 555-0100"/></Fld>
        <Fld label="Instagram (optional)"><input style={iSt} value={f.instagram} onChange={e=>u({instagram:e.target.value})} placeholder="@username"/></Fld>
        <Fld label="How did you hear about us?"><input style={iSt} value={f.referral} onChange={e=>u({referral:e.target.value})} placeholder="Friend, Instagram, Google..."/></Fld>
      </>}
      {step===2&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Home Address</div>
        <Fld label="Street Address"><input style={iSt} value={f.addr1} onChange={e=>u({addr1:e.target.value})} placeholder="123 Main St"/></Fld>
        <Fld label="Apt / Suite (optional)"><input style={iSt} value={f.addr2} onChange={e=>u({addr2:e.target.value})} placeholder="Apt 4B"/></Fld>
        <Fld label="City"><input style={iSt} value={f.city} onChange={e=>u({city:e.target.value})} placeholder="Caldwell"/></Fld>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Fld label="State"><input style={iSt} maxLength={2} value={f.state} onChange={e=>u({state:e.target.value.toUpperCase()})} placeholder="NJ"/></Fld>
          <Fld label="ZIP"><input style={iSt} maxLength={5} value={f.zip} onChange={e=>u({zip:e.target.value.replace(/[^0-9]/g,"")})} placeholder="07006"/></Fld>
        </div>
      </>}
      {step===3&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Aviation Background</div>
        <Fld label="Pilot Certificate">
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {CERTS.map(c=><button key={c} onClick={()=>u({cert:c})} style={{padding:"8px 14px",borderRadius:20,cursor:"pointer",fontWeight:600,fontSize:12,fontFamily:"sans-serif",border:"1.5px solid "+(f.cert===c?C.blue:C.tan),background:f.cert===c?C.blueP:C.white,color:f.cert===c?C.blue:C.stone}}>{c}</button>)}
          </div>
        </Fld>
        <Fld label="Ratings">
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {RATS.map(r=>{const on=f.ratings.includes(r);return <button key={r} onClick={()=>u({ratings:on?f.ratings.filter(x=>x!==r):[...f.ratings,r]})} style={{padding:"8px 14px",borderRadius:20,cursor:"pointer",fontWeight:600,fontSize:12,fontFamily:"sans-serif",border:"1.5px solid "+(on?C.teal:C.tan),background:on?C.teal+"12":C.white,color:on?C.teal:C.stone}}>{r}</button>;})}
          </div>
        </Fld>
        <Fld label="Total Flight Hours"><input style={iSt} type="number" min="0" value={f.hours} onChange={e=>u({hours:e.target.value})} placeholder="0"/></Fld>
        <label style={{display:"flex",gap:10,alignItems:"center",cursor:"pointer"}}><input type="checkbox" checked={f.marketing} onChange={e=>u({marketing:e.target.checked})} style={{width:18,height:18,accentColor:C.blue}}/><span style={{fontSize:13,fontFamily:"sans-serif"}}>Send me club news and flight tips.</span></label>
      </>}
      {step===4&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Create Your Password</div>
        <Fld label="Password"><input style={iSt} type="password" value={f.password} onChange={e=>u({password:e.target.value})} placeholder="At least 8 characters"/></Fld>
        {f.password&&<div><div style={{height:5,background:"#f3f4f6",borderRadius:3,overflow:"hidden",marginBottom:5}}><div style={{height:"100%",width:(pw/4*100)+"%",background:pwCol,borderRadius:3,transition:"width .3s"}}/></div><div style={{fontSize:12,color:pwCol,fontWeight:700,fontFamily:"sans-serif"}}>{["","Weak","Fair","Good","Strong"][pw]}</div></div>}
        <Fld label="Confirm Password"><input style={iSt} type="password" value={f.confirm} onChange={e=>u({confirm:e.target.value})} placeholder="Re-enter password"/></Fld>
        {f.confirm&&f.password!==f.confirm&&<div style={{color:C.red,fontSize:12,fontFamily:"sans-serif"}}>Passwords do not match.</div>}
      </>}
      {step===5&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Rental Agreement</div>
        <div style={{background:C.white,border:"1px solid "+C.tan,borderRadius:12,padding:"14px",maxHeight:220,overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
          {RA.map(([title,text])=><div key={title}><div style={{fontWeight:700,fontSize:12,fontFamily:"sans-serif",marginBottom:3}}>{title}</div><div style={{color:C.darkL,fontSize:12,lineHeight:1.7,fontFamily:"sans-serif"}}>{text}</div></div>)}
        </div>
        {[["rental1","I confirm I hold the required certificate/medical or am a student under CFI supervision."],["rental2","I agree to conduct pre-flight inspections and will not fly with any airworthiness concern."],["rental3","I agree to record Hobbs times and submit photos within 24 hours at $165/hr wet."],["rental4","I understand I am liable for the $5,000 insurance deductible for damage during my operation."],["rental5","I agree to all geographic restrictions and will report any accident within 2 hours."]].map(([key,text])=>(
          <label key={key} style={{display:"flex",gap:10,alignItems:"flex-start",cursor:"pointer",padding:"10px 12px",background:f[key]?C.green+"0a":C.parchment,borderRadius:10,border:"1.5px solid "+(f[key]?C.green:C.tan)}}>
            <input type="checkbox" checked={f[key]} onChange={e=>u({[key]:e.target.checked})} style={{width:18,height:18,marginTop:2,accentColor:C.green,flexShrink:0}}/>
            <span style={{fontSize:12,lineHeight:1.5,fontFamily:"sans-serif",color:C.darkL}}>{text}</span>
          </label>
        ))}
      </>}
      {step===6&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Upload Your Documents</div>
        <div style={{background:C.blueP,border:"1px solid "+C.blue+"33",borderRadius:10,padding:"10px 14px",fontSize:12,color:C.blue,fontFamily:"sans-serif",lineHeight:1.5}}>We collect these to verify your identity and qualifications. Files are encrypted and stored securely.</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"sans-serif"}}>Driver's License <span style={{color:C.red,fontSize:11}}>(Required)</span></div>
          <input type="file" accept="image/*,application/pdf" id="dl-up" style={{display:"none"}} onChange={e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>u({dlUploaded:true,dlImg:ev.target.result});reader.readAsDataURL(file);}}/>
          {f.dlImg&&<img src={f.dlImg} alt="DL" style={{width:"100%",borderRadius:10,maxHeight:140,objectFit:"cover",border:"2px solid "+C.green}}/>}
          <label htmlFor="dl-up" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,border:"2px dashed "+(f.dlUploaded?C.green:C.tan),borderRadius:10,padding:"16px",cursor:"pointer",background:f.dlUploaded?C.green+"0a":"#fafafa"}}>
            <span style={{fontSize:13,fontWeight:600,color:f.dlUploaded?C.green:C.stone,fontFamily:"sans-serif"}}>{f.dlUploaded?"Tap to replace - License Uploaded":"Tap to upload Driver License"}</span>
          </label>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"sans-serif"}}>Pilot Certificate <span style={{color:C.stone,fontSize:11}}>(Optional)</span></div>
          <input type="file" accept="image/*,application/pdf" id="cert-up" style={{display:"none"}} onChange={e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>u({pilotCertUploaded:true,pilotCertImg:ev.target.result});reader.readAsDataURL(file);}}/>
          {f.pilotCertImg&&<img src={f.pilotCertImg} alt="Cert" style={{width:"100%",borderRadius:10,maxHeight:140,objectFit:"cover",border:"2px solid "+C.green}}/>}
          <label htmlFor="cert-up" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,border:"2px dashed "+(f.pilotCertUploaded?C.green:C.tan),borderRadius:10,padding:"16px",cursor:"pointer",background:f.pilotCertUploaded?C.green+"0a":"#fafafa"}}>
            <span style={{fontSize:13,fontWeight:600,color:f.pilotCertUploaded?C.green:C.stone,fontFamily:"sans-serif"}}>{f.pilotCertUploaded?"Tap to replace - Certificate Uploaded":"Tap to upload Pilot Certificate"}</span>
          </label>
        </div>
        <div style={{background:C.parchment,borderRadius:10,padding:"11px 14px",fontSize:12,color:C.stone,lineHeight:1.6,fontFamily:"sans-serif"}}>Documents are encrypted and accessible only to authorized club administrators.</div>
      </>}
      {step===7&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Almost there!</div>
        <div style={{background:C.dark,borderRadius:16,padding:"18px",display:"flex",flexDirection:"column",gap:8}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:"#fff",marginBottom:4}}>KCDW Flying Club Membership</div>
          {[["Monthly Dues","$80/month"],["Aircraft Rate","$165/hr wet"],["Initiation Fee","$0"],["Commitment","Month-to-month"]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,.07)"}}><span style={{color:C.stone,fontSize:13,fontFamily:"sans-serif"}}>{l}</span><span style={{color:C.amberL,fontWeight:700,fontSize:13,fontFamily:"sans-serif"}}>{v}</span></div>)}
        </div>
        <label style={{display:"flex",gap:10,alignItems:"flex-start",cursor:"pointer",padding:"12px 14px",background:f.waiver?C.green+"0a":C.parchment,borderRadius:10,border:"1.5px solid "+(f.waiver?C.green:C.tan)}}>
          <input type="checkbox" checked={f.waiver} onChange={e=>u({waiver:e.target.checked})} style={{width:18,height:18,marginTop:2,accentColor:C.green,flexShrink:0}}/>
          <span style={{fontSize:12,lineHeight:1.5,fontFamily:"sans-serif",color:C.darkL}}>I have read and agree to the KCDW Flying Club Rental Agreement, Release of Liability, and Member Handbook.</span>
        </label>
        <label style={{display:"flex",gap:10,alignItems:"flex-start",cursor:"pointer",padding:"12px 14px",background:f.terms?C.blue+"0a":C.parchment,borderRadius:10,border:"1.5px solid "+(f.terms?C.blue:C.tan)}}>
          <input type="checkbox" checked={f.terms} onChange={e=>u({terms:e.target.checked})} style={{width:18,height:18,marginTop:2,accentColor:C.blue,flexShrink:0}}/>
          <span style={{fontSize:12,lineHeight:1.5,fontFamily:"sans-serif",color:C.darkL}}>I authorize KCDW Flying Club to charge my payment method for monthly dues and flight time via Stripe.</span>
        </label>
      </>}
    </div>
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.white,borderTop:"1px solid "+C.tan,padding:"14px 18px",display:"flex",gap:10,zIndex:100}}>
      {step>1&&<Btn v="ol" style={{flex:1}} onClick={()=>setStep(s=>s-1)}>Back</Btn>}
      {step<T?<Btn style={{flex:2}} disabled={!ok()} onClick={()=>setStep(s=>s+1)}>Continue</Btn>:<Btn style={{flex:2}} disabled={!ok()} onClick={()=>onDone(f)}>Submit Application</Btn>}
    </div>
  </div>;
}

function AboutPage({onJoin,onSignIn,setPage}){
  const[faq,setFaq]=useState(null);
  const FAQS=[
    ["Do I need a pilot certificate?","No! Student pilots welcome. Our CFIs can take you from zero to private pilot certificate."],
    ["What does $165/hr wet mean?","Fuel included. You pay Hobbs time only - no hidden fees."],
    ["How do I schedule?","Through this portal. Real-time availability, book from your phone."],
    ["Are there hidden fees?","$80/month + $165/hr. Instruction billed separately."],
    ["What if I have not flown recently?","Our CFIs will do a quick currency flight to get you back up to speed."],
  ];
  return <div style={{fontFamily:"sans-serif",color:C.dark,background:C.white}}>
    <div style={{position:"relative",minHeight:480,overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <SafeImg src="/photos/n36jr-hero.jpg" alt="N36JR" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 55%"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(175deg,rgba(6,13,26,.95) 0%,rgba(13,31,60,.88) 30%,rgba(26,53,96,.75) 55%,rgba(139,74,26,.65) 78%,rgba(200,112,48,.5) 100%)"}}/>
      <div style={{position:"absolute",top:16,right:16,background:"rgba(0,0,0,.5)",border:"1px solid rgba(255,255,255,.18)",borderRadius:20,padding:"5px 13px",display:"flex",alignItems:"center",gap:7}}>
        <div style={{width:7,height:7,borderRadius:"50%",background:C.green,boxShadow:"0 0 7px "+C.green}}/>
        <span style={{color:"#fff",fontSize:11,fontWeight:700,fontFamily:"sans-serif"}}>KCDW VFR</span>
      </div>
      <div style={{position:"relative",padding:"0 22px 36px",display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:2}}>
          <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#C8852A,#8B1A2F)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{"✈"}</div>
          <div>
            <div style={{fontFamily:"Georgia,serif",fontSize:13,fontWeight:700,color:"rgba(255,255,255,.9)",letterSpacing:".05em"}}>KCDW FLYING CLUB</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.5)",letterSpacing:".12em",fontFamily:"sans-serif"}}>CALDWELL, NEW JERSEY</div>
          </div>
        </div>
        <div style={{fontFamily:"Georgia,serif",fontSize:34,fontWeight:700,color:"#fff",lineHeight:1.15,textShadow:"0 3px 24px rgba(0,0,0,.5)"}}>Your Pilot<br/>Community<br/><em style={{color:C.amberL}}>Awaits.</em></div>
        <div style={{color:"rgba(255,255,255,.75)",fontSize:15,lineHeight:1.6,maxWidth:340,fontFamily:"sans-serif"}}>Affordable aircraft rental, experienced instructors, and a welcoming community at Essex County Airport.</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:4}}>
          <button onClick={onJoin} style={{background:"linear-gradient(135deg,#C8852A,#A0621A)",color:"#fff",border:"none",borderRadius:12,padding:"14px 24px",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"sans-serif",flexShrink:0}}>Join the Club</button>
          <button onClick={()=>setPage("schedule")} style={{background:"rgba(255,255,255,.12)",color:"#fff",border:"1px solid rgba(255,255,255,.28)",borderRadius:12,padding:"14px 20px",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"sans-serif",flexShrink:0}}>View Schedule</button>
        </div>
        <button onClick={onSignIn} style={{background:"none",border:"none",color:"rgba(255,255,255,.55)",cursor:"pointer",fontSize:13,fontFamily:"sans-serif",padding:0,textDecoration:"underline",textAlign:"left"}}>Already a member? Sign in</button>
      </div>
    </div>
    <div style={{background:C.dark,display:"grid",gridTemplateColumns:"repeat(4,1fr)"}}>
      {[["1","Aircraft"],["3","Instructors"],["$165","Per Hr Wet"],["KCDW","Caldwell NJ"]].map(([v,l],i)=>(
        <div key={l} style={{padding:"16px 6px",borderRight:i<3?"1px solid rgba(255,255,255,.08)":undefined,textAlign:"center"}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:800,color:C.amberL}}>{v}</div>
          <div style={{color:C.stone,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",fontFamily:"sans-serif",marginTop:3}}>{l}</div>
        </div>
      ))}
    </div>
    <div style={{background:C.dark,padding:"24px 20px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#fff",marginBottom:6}}>Meet N36JR</div>
      <div style={{color:C.stone,fontSize:13,lineHeight:1.6,marginBottom:14,fontFamily:"sans-serif"}}>2012 Cessna 172 Skyhawk SP - Garmin G1000 NXi - GFC700 autopilot - IFR capable</div>
      <div style={{position:"relative",borderRadius:14,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,.5)"}}>
        <SafeImg src="/photos/n36jr-hero.jpg" alt="N36JR" style={{width:"100%",display:"block",height:200,objectFit:"cover",objectPosition:"center 58%"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 45%,rgba(0,0,0,.8) 100%)"}}/>
        <div style={{position:"absolute",bottom:14,left:16,right:16,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div>
            <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:800,color:"#fff"}}>N36JR</div>
            <div style={{color:"rgba(255,255,255,.65)",fontSize:10,letterSpacing:".08em",fontFamily:"sans-serif"}}>2012 CESSNA 172 SKYHAWK SP</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,background:"rgba(0,0,0,.55)",border:"1px solid "+C.green+"66",borderRadius:20,padding:"5px 11px"}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:C.green,boxShadow:"0 0 6px "+C.green}}/>
            <span style={{color:C.green,fontSize:11,fontWeight:700,fontFamily:"sans-serif"}}>Available</span>
          </div>
        </div>
      </div>
    </div>
    <div style={{padding:"28px 20px",borderBottom:"1px solid "+C.tan}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,marginBottom:10}}>About the Club</div>
      <div style={{color:"#555",fontSize:14,lineHeight:1.8,marginBottom:14,fontFamily:"sans-serif"}}>Member-owned club at Essex County Airport (KCDW), Caldwell NJ. N36JR is a 2012 Cessna 172 Skyhawk SP with Garmin G1000 NXi and GFC700 autopilot. No large fleet, no corporate overhead - just pilots who love to fly.</div>
      <button onClick={onJoin} style={{background:C.blue,color:"#fff",border:"none",borderRadius:10,padding:"13px 0",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"sans-serif",width:"100%"}}>Become a Member - $80/month</button>
    </div>
    <div style={{padding:"28px 20px",borderBottom:"1px solid "+C.tan,background:C.cream}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,marginBottom:14}}>How It Works</div>
      {[{n:"01",t:"Become a Member",b:"$80/month gets you access to N36JR - no initiation fee."},{n:"02",t:"Complete Your Checkout",b:"Fly with a CFI once. Once cleared, the aircraft is yours anytime."},{n:"03",t:"Book and Fly",b:"Reserve N36JR in seconds. $165/hr wet, Hobbs-based."}].map((s,i,arr)=>(
        <div key={s.n} style={{display:"flex",gap:16,paddingBottom:i<arr.length-1?18:0,position:"relative"}}>
          {i<arr.length-1&&<div style={{position:"absolute",left:20,top:44,bottom:0,width:1.5,background:"linear-gradient(180deg,"+C.amber+","+C.tan+")"}}/>}
          <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,"+C.amber+",#A0621A)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{color:"#fff",fontSize:13,fontWeight:800,fontFamily:"sans-serif"}}>{s.n}</span>
          </div>
          <div style={{flex:1,paddingTop:4}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,marginBottom:4}}>{s.t}</div>
            <div style={{color:"#666",fontSize:13,lineHeight:1.7,fontFamily:"sans-serif"}}>{s.b}</div>
          </div>
        </div>
      ))}
      <button onClick={onJoin} style={{marginTop:20,background:"linear-gradient(135deg,#C8852A,#A0621A)",color:"#fff",border:"none",borderRadius:12,padding:"14px 0",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"sans-serif",width:"100%"}}>Start Your Application</button>
    </div>
    <div style={{padding:"28px 20px",borderBottom:"1px solid "+C.tan,background:C.cream}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,marginBottom:14}}>Common Questions</div>
      {FAQS.map(([q,a],i)=>(
        <div key={i} style={{borderBottom:"1px solid "+C.tan}}>
          <button onClick={()=>setFaq(faq===i?null:i)} style={{background:"none",border:"none",cursor:"pointer",width:"100%",textAlign:"left",padding:"14px 0",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,fontFamily:"sans-serif"}}>
            <span style={{fontSize:14,fontWeight:700,lineHeight:1.4}}>{q}</span>
            <span style={{fontSize:20,color:C.stone,flexShrink:0,lineHeight:1}}>{faq===i?"-":"+"}</span>
          </button>
          {faq===i&&<div style={{color:"#666",fontSize:13,lineHeight:1.75,paddingBottom:14,fontFamily:"sans-serif"}}>{a}</div>}
        </div>
      ))}
    </div>
    <div style={{background:"linear-gradient(135deg,#0d1b2a,#1a3560)",padding:"44px 22px 60px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
      <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#C8852A,#8B1A2F)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginBottom:4}}>{"✈"}</div>
      <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:"#fff",lineHeight:1.25}}>Ready to Fly?</div>
      <div style={{color:"rgba(255,255,255,.65)",fontSize:14,lineHeight:1.7,maxWidth:300,fontFamily:"sans-serif"}}>$80/month gets you access to N36JR and a community of pilots who love to fly.</div>
      <button onClick={onJoin} style={{background:"linear-gradient(135deg,#C8852A,#A0621A)",color:"#fff",border:"none",borderRadius:14,padding:"16px 0",fontWeight:800,fontSize:16,cursor:"pointer",fontFamily:"sans-serif",width:"100%",maxWidth:320}}>Apply Now - Join the Club</button>
      <button onClick={onSignIn} style={{background:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.7)",border:"1px solid rgba(255,255,255,.2)",borderRadius:10,padding:"12px 0",fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:"sans-serif",width:"100%",maxWidth:320}}>Already a Member? Sign In</button>
      <div style={{color:"rgba(255,255,255,.35)",fontSize:11,marginTop:6,fontFamily:"sans-serif"}}>Essex County Airport - KCDW - Caldwell, NJ 07006</div>
    </div>
  </div>;
}

function HomePage({setPage,geo,invs,bal,name}){
  const days=Math.floor((now-new Date("2026-03-15"))/86400000);
  const pct=Math.min(100,(days/90)*100);
  const upcoming=INIT_BOOKINGS.filter(b=>b.pilot==="Sarah Mitchell"&&b.date>=TODAY).slice(0,2);
  const recent=invs[0];
  const hr=now.getHours();
  const greet=hr<12?"Good Morning":hr<17?"Good Afternoon":"Good Evening";
  return <div style={{display:"flex",flexDirection:"column"}}>
    <div style={{position:"relative",height:300,overflow:"hidden",flexShrink:0}}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,#0a1628 0%,#1a2d4a 30%,#2d4a6b 55%,#c77f3a 80%,#e8995a 100%)"}}/>
      <SafeImg src="/photos/n36jr-hero.jpg" alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 55%",opacity:.25}}/>
      <div style={{position:"absolute",top:14,right:14,background:"rgba(0,0,0,.5)",border:"1px solid rgba(255,255,255,.2)",borderRadius:20,padding:"5px 12px",display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:7,height:7,borderRadius:"50%",background:C.green,boxShadow:"0 0 6px "+C.green}}/>
        <span style={{color:"#fff",fontSize:11,fontWeight:700,letterSpacing:".08em",fontFamily:"sans-serif"}}>KCDW VFR</span>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0 22px 22px",display:"flex",flexDirection:"column",gap:8}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:"#fff",lineHeight:1.2,textShadow:"0 2px 20px rgba(0,0,0,.4)"}}>{greet},<br/><em style={{color:C.amberL}}>{name}.</em></div>
        <div style={{color:"rgba(255,255,255,.65)",fontSize:13,fontFamily:"sans-serif",marginBottom:10}}>{now.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})} - Essex County Airport</div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setPage("schedule")} style={{background:"linear-gradient(135deg,#1A6BB5,#1044A0)",color:"#fff",border:"none",borderRadius:12,padding:"11px 18px",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"sans-serif"}}>Book a Flight</button>
          <button onClick={()=>setPage("hobbs")} style={{background:"rgba(255,255,255,.15)",color:"#fff",border:"1px solid rgba(255,255,255,.3)",borderRadius:12,padding:"11px 18px",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"sans-serif"}}>Log Hobbs</button>
        </div>
      </div>
    </div>
    <div style={{background:C.dark,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",borderBottom:"2px solid "+C.amber+"44"}}>
      {[["Hours (90d)","8.4 hrs","clock"],["Total Hours","124.5 hrs","plane"],["Balance",bal!==null?$$(bal):"--","card"]].map(([l,v,ic],i)=>(
        <div key={l} style={{padding:"12px 8px",borderRight:i<2?"1px solid rgba(255,255,255,.07)":undefined,textAlign:"center"}}>
          <div style={{color:C.amberL,fontSize:15,fontWeight:700,fontFamily:"Georgia,serif"}}>{v}</div>
          <div style={{color:C.stone,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",fontFamily:"sans-serif",marginTop:2}}>{l}</div>
        </div>
      ))}
    </div>
    <div style={{padding:"14px 14px 40px",display:"flex",flexDirection:"column",gap:12}}>
      {geo.near&&<div style={{background:C.amber+"15",border:"1.5px solid "+C.amber+"55",borderRadius:14,padding:"12px 14px",display:"flex",gap:12,alignItems:"center"}}>
        <div className="rdot"/>
        <div style={{flex:1}}>
          <div style={{color:C.amber,fontWeight:700,fontSize:14,fontFamily:"sans-serif"}}>You are at KCDW!</div>
          <div style={{color:C.darkL,fontSize:12,marginTop:2,fontFamily:"sans-serif"}}>Log your Hobbs before and after your flight.</div>
        </div>
        <button onClick={()=>setPage("hobbs")} style={{background:C.amber,color:"#fff",border:"none",borderRadius:8,padding:"7px 11px",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"sans-serif",flexShrink:0}}>Log Now</button>
      </div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <button onClick={()=>setPage("schedule")} style={{background:C.blue,color:"#fff",border:"none",borderRadius:10,padding:"14px 12px",textAlign:"left",cursor:"pointer",display:"flex",flexDirection:"column",gap:3,fontFamily:"sans-serif"}}>
          <span style={{fontSize:14,fontWeight:700}}>Schedule</span>
          <span style={{fontSize:11,opacity:.8}}>Book flights</span>
        </button>
        <button onClick={()=>setPage("hobbs")} style={{background:C.green,color:"#fff",border:"none",borderRadius:10,padding:"14px 12px",textAlign:"left",cursor:"pointer",display:"flex",flexDirection:"column",gap:3,fontFamily:"sans-serif"}}>
          <span style={{fontSize:14,fontWeight:700}}>Log Hobbs</span>
          <span style={{fontSize:11,opacity:.8}}>{geo.near?"At airport!":"Submit and bill"}</span>
        </button>
      </div>
      <Card style={{padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:600}}>Proficiency Status</div>
          <Bdg col={C.green}>Current</Bdg>
        </div>
        <div style={{height:7,background:"#f3f4f6",borderRadius:4,overflow:"hidden",marginBottom:7}}>
          <div style={{height:"100%",width:pct+"%",borderRadius:4,background:pct>75?"linear-gradient(90deg,"+C.amber+","+C.red+")":"linear-gradient(90deg,"+C.green+","+C.amberL+")"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <span style={{color:C.stone,fontSize:12,fontFamily:"sans-serif"}}>Day {days} of 90</span>
          <span style={{color:pct>75?C.red:C.green,fontSize:12,fontWeight:700,fontFamily:"sans-serif"}}>{90-days} days left</span>
        </div>
      </Card>
      {upcoming.length>0&&<Card style={{padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:600}}>Upcoming Flights</div>
          <button onClick={()=>setPage("schedule")} style={{background:"none",border:"none",color:C.blue,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif"}}>View all</button>
        </div>
        {upcoming.map(b=>(
          <div key={b.id} style={{display:"flex",gap:12,alignItems:"center",padding:"9px 0",borderBottom:"1px solid "+C.tan+"55"}}>
            <div style={{width:42,height:42,borderRadius:10,background:C.blue+"15",border:"1px solid "+C.blue+"33",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{color:C.blue,fontSize:9,fontWeight:700,fontFamily:"sans-serif"}}>{new Date(b.date+"T12:00").toLocaleDateString("en-US",{month:"short"}).toUpperCase()}</span>
              <span style={{fontSize:18,fontWeight:700,fontFamily:"Georgia,serif",lineHeight:1}}>{new Date(b.date+"T12:00").getDate()}</span>
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:13,fontFamily:"sans-serif"}}>{b.ac} - {b.type}</div>
              <div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",marginTop:1}}>{b.start}-{b.end}</div>
            </div>
            <Bdg col={C.green}>Confirmed</Bdg>
          </div>
        ))}
      </Card>}
    </div>
  </div>;
}

function ScheduleGate({onJoin,onSignIn}){
  return <div style={{display:"flex",flexDirection:"column",height:"100%",position:"relative"}}>
    <div style={{filter:"blur(3px)",opacity:.45,pointerEvents:"none",userSelect:"none",padding:"12px 14px 8px",background:"#f9fafb"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontSize:20,fontWeight:700,fontFamily:"Georgia,serif"}}>Schedule</span>
        <div style={{background:C.blue,color:"#fff",borderRadius:7,padding:"8px 14px",fontWeight:700,fontSize:13,fontFamily:"sans-serif"}}>+ New</div>
      </div>
      <div style={{background:"#fff",border:"1.5px solid #d1d5db",borderRadius:8,padding:"8px 12px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:18,color:C.blue,fontWeight:700}}>{"<"}</div>
        <span style={{fontSize:14,fontWeight:600,fontFamily:"sans-serif"}}>Today</span>
        <div style={{fontSize:18,color:C.blue,fontWeight:700}}>{">"}</div>
      </div>
    </div>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:"0 32px",background:"rgba(249,250,251,.15)"}}>
      <div style={{background:C.white,borderRadius:20,padding:"28px 24px",width:"100%",maxWidth:320,boxShadow:"0 20px 60px rgba(0,0,0,.18)",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:14,border:"1px solid "+C.tan}}>
        <div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,"+C.dark+","+C.darkM+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{"🔒"}</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:C.dark}}>Members Only</div>
        <div style={{color:C.stone,fontSize:13,lineHeight:1.6,fontFamily:"sans-serif"}}>Sign in or join to view the schedule, check availability, and book your next flight.</div>
        <button onClick={onJoin} style={{background:"linear-gradient(135deg,#C8852A,#A0621A)",color:"#fff",border:"none",borderRadius:10,padding:"13px 0",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"sans-serif",width:"100%"}}>Join the Club - $80/month</button>
        <button onClick={onSignIn} style={{background:C.white,color:C.blue,border:"2px solid "+C.blue,borderRadius:10,padding:"11px 0",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"sans-serif",width:"100%"}}>Sign In</button>
      </div>
    </div>
  </div>;
}

function SchedulePage({geo,checkoutComplete=false,checkoutPending=false}){
  const[date,setDate]=useState(TODAY);
  const[bookings,setBookings]=useState(INIT_BOOKINGS);
  const[detailB,setDetailB]=useState(null);
  const[form,setForm]=useState({start:"09:00",end:"11:00",type:"solo",instr:"",notes:""});
  const[modal,setModal]=useState(false);
  const[done,setDone]=useState(false);
  const isToday=date===TODAY;
  const nav=d=>{const dt=new Date(date+"T12:00");dt.setDate(dt.getDate()+d);setDate(fmtDate(dt));};
  const DAY_START=6,DAY_END=21,HR_H=60;
  const hrs=Array.from({length:DAY_END-DAY_START},(_,i)=>DAY_START+i);
  const shown=bookings.filter(b=>b.date===date);
  const bColor=type=>type==="instruction"?{bg:"#1A4A8A",br:"#2563EB"}:type==="checkout"?{bg:C.gold,br:C.amber}:{bg:C.blue,br:"#1A6BB5"};
  const geo2=b=>{const top=((t2m(b.start)-DAY_START*60)/60)*HR_H;const ht=Math.max(((t2m(b.end)-t2m(b.start))/60)*HR_H,28);return{top,height:ht};};
  const[nowTop,setNowTop]=useState(null);
  useEffect(()=>{
    const upd=()=>{const n=new Date(),m=n.getHours()*60+n.getMinutes();setNowTop(m<DAY_START*60||m>DAY_END*60?null:((m-DAY_START*60)/((DAY_END-DAY_START)*60))*100);};
    upd();const id=setInterval(upd,60000);return()=>clearInterval(id);
  },[]);
  const submit=()=>{setBookings(p=>[...p,{id:Date.now(),pilot:"Sarah Mitchell",ac:"N36JR",date,...form}]);setDone(true);};
  return <div style={{display:"flex",flexDirection:"column",height:"100%",background:"#f9fafb"}}>
    <div style={{padding:"12px 14px 8px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontSize:20,fontWeight:700,fontFamily:"Georgia,serif"}}>Schedule</span>
        <button onClick={()=>{setForm({start:"09:00",end:"11:00",type:"solo",instr:"",notes:""});setDone(false);setModal(true);}} style={{background:C.blue,color:"#fff",border:"none",borderRadius:7,padding:"8px 14px",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"sans-serif"}}>+ New</button>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",border:"1.5px solid #d1d5db",borderRadius:8,background:C.white,padding:"8px 12px",marginBottom:8}}>
        <button onClick={()=>nav(-1)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:C.blue,padding:"0 4px",fontWeight:700}}>{"<"}</button>
        <span style={{fontSize:14,fontWeight:600,fontFamily:"sans-serif"}}>{isToday?"Today - ":""}{new Date(date+"T12:00").toLocaleDateString("en-US",{month:"long",day:"numeric"})}</span>
        <button onClick={()=>nav(1)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:C.blue,padding:"0 4px",fontWeight:700}}>{">"}</button>
      </div>
      <div style={{background:C.white,border:"1px solid #e5e7eb",borderRadius:7,padding:"6px 12px",display:"flex",gap:8,marginBottom:8}}>
        <span style={{color:C.green,fontSize:11,fontWeight:800,flexShrink:0,fontFamily:"sans-serif"}}>KCDW VFR</span>
        <span style={{fontSize:10,fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>AUTO 00000KT 10SM CLR 24/M03 A3012</span>
      </div>
    </div>
    <div style={{flex:1,overflow:"auto",borderTop:"1px solid #e5e7eb"}}>
      <div style={{display:"flex",minWidth:200}}>
        <div style={{width:46,flexShrink:0,borderRight:"1px solid #e5e7eb",position:"sticky",left:0,background:"#f9fafb",zIndex:10}}>
          <div style={{height:52,borderBottom:"2px solid #e5e7eb"}}/>
          {hrs.map(h=><div key={h} style={{height:HR_H,display:"flex",alignItems:"flex-start",justifyContent:"flex-end",paddingRight:6,paddingTop:2,color:"#9ca3af",fontSize:9,fontFamily:"sans-serif",borderBottom:"1px solid #f3f4f6"}}>{fmtH(h)}</div>)}
        </div>
        <div style={{flex:1,minWidth:150}}>
          <div style={{height:52,borderBottom:"2px solid #e5e7eb",padding:"8px",background:C.white,position:"sticky",top:0,zIndex:9}}>
            <div style={{height:3,borderRadius:2,background:C.green,marginBottom:4}}/>
            <span style={{fontSize:14,fontWeight:800,fontFamily:"sans-serif",display:"block"}}>N36JR</span>
            <span style={{color:"#6b7280",fontSize:10,fontFamily:"sans-serif"}}>Cessna 172 SP</span>
          </div>
          <div style={{position:"relative",height:(DAY_END-DAY_START)*HR_H}} onClick={e=>{
            if(e.target.closest(".bb"))return;
            const rect=e.currentTarget.getBoundingClientRect();
            const relY=e.clientY-rect.top;
            const mins=DAY_START*60+(relY/HR_H)*60;
            const hr=Math.floor(mins/60),mn=mins%60<30?0:30;
            const s=pad(hr)+":"+pad(mn);
            const eH=hr+1,eMn=mn;
            setForm(p=>({...p,start:s,end:pad(eH)+":"+pad(eMn),instr:"",notes:""}));
            setDone(false);setModal(true);
          }}>
            {hrs.map(h=><div key={h} style={{position:"absolute",top:(h-DAY_START)*HR_H,left:0,right:0,height:HR_H,borderBottom:"1px solid #f3f4f6",cursor:"crosshair"}}>
              <div style={{position:"absolute",left:0,right:0,top:30,borderTop:"1px dashed #f3f4f6"}}/>
            </div>)}
            {isToday&&nowTop!==null&&<div style={{position:"absolute",left:0,right:0,top:nowTop+"%",zIndex:8,display:"flex",alignItems:"center",pointerEvents:"none"}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#EF4444",marginLeft:-3}}/>
              <div style={{flex:1,height:1.5,background:"#EF4444",opacity:.8}}/>
            </div>}
            {shown.filter(b=>b.ac==="N36JR").map(b=>{
              const{top,height}=geo2(b);
              const{bg,br}=bColor(b.type);
              const mine=b.pilot==="Sarah Mitchell";
              return <div key={b.id} className="bb" onClick={e=>{e.stopPropagation();setDetailB(b);}} style={{top,height,background:bg,border:"1.5px solid "+br,borderLeft:"4px solid "+br,outline:mine?"2px solid "+C.amberL:"none",outlineOffset:1}}>
                <span style={{color:"#fff",fontSize:11,fontWeight:700,display:"block",lineHeight:1.2}}>{b.start} {b.pilot.split(" ")[0]}</span>
                {height>44&&<span style={{color:"#fff",fontSize:10,opacity:.8}}>{b.type}</span>}
              </div>;
            })}
          </div>
        </div>
      </div>
    </div>
    <div style={{padding:"7px 14px",borderTop:"1px solid #e5e7eb",background:C.white,display:"flex",gap:12}}>
      {[["Solo",C.blue],["Instruction","#1A4A8A"],["Checkout",C.gold]].map(([l,c])=>(
        <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:3,height:11,borderRadius:2,background:c}}/>
          <span style={{color:"#6b7280",fontSize:11,fontFamily:"sans-serif"}}>{l}</span>
        </div>
      ))}
    </div>
    {detailB&&<Modal onClose={()=>setDetailB(null)}>
      <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,marginBottom:14}}>Reservation</div>
      <div style={{background:bColor(detailB.type).bg,border:"1.5px solid "+bColor(detailB.type).br,borderLeft:"5px solid "+bColor(detailB.type).br,borderRadius:10,padding:"12px 14px",marginBottom:14}}>
        <div style={{color:"#fff",fontWeight:800,fontSize:15}}>{detailB.pilot}</div>
        <div style={{color:"#fff",fontSize:13,opacity:.85,marginTop:3}}>{detailB.ac} - {detailB.start}-{detailB.end} - {detailB.type}</div>
      </div>
      <Btn v="ol" onClick={()=>setDetailB(null)}>Close</Btn>
    </Modal>}
    {modal&&<Modal onClose={()=>setModal(false)}>
      {done?
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 0",gap:12}}>
          <div style={{fontSize:44}}>{"✅"}</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Reservation Confirmed!</div>
          <div style={{color:C.stone,fontSize:14,fontFamily:"sans-serif"}}>N36JR - {form.start}-{form.end}</div>
          <Btn onClick={()=>setModal(false)}>Done</Btn>
        </div>
      :
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700}}>New Reservation</div>
          <div style={{background:C.dark,borderRadius:12,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,"+C.amber+",#A0621A)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{"✈"}</div>
              <div>
                <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:800,color:"#fff"}}>N36JR</div>
                <div style={{color:C.stone,fontSize:11,fontFamily:"sans-serif"}}>Cessna 172 Skyhawk SP</div>
              </div>
            </div>
            <div style={{color:C.amberL,fontWeight:700,fontSize:13,fontFamily:"sans-serif"}}>{form.start} - {form.end}</div>
          </div>
          <Fld label="Activity Type">
            <div style={{display:"flex",gap:7}}>
              {[["solo","Solo"],["instruction","Dual"],["checkout","Checkout"]].map(([val,lbl])=>{
                const locked=((val==="solo"||val==="instruction"))?!checkoutComplete:checkoutComplete;
                return <button key={val} onClick={()=>!locked&&setForm(p=>({...p,type:val,instr:val==="solo"?"":p.instr}))} style={{flex:1,padding:"10px 4px",borderRadius:9,cursor:locked?"not-allowed":"pointer",fontWeight:700,fontSize:11,fontFamily:"sans-serif",border:"2px solid "+(form.type===val?C.blue:locked?"#e5e7eb":C.tan),background:form.type===val?C.blue:locked?"#f9fafb":C.white,color:form.type===val?"#fff":locked?"#d1d5db":C.stone,position:"relative",opacity:locked?.55:1}}>
                  {lbl}{locked&&<span style={{fontSize:9,position:"absolute",top:3,right:4}}>{"🔒"}</span>}
                </button>;
              })}
            </div>
            {!checkoutComplete&&(form.type==="solo"||form.type==="instruction")&&<div style={{background:C.amber+"18",border:"1.5px solid "+C.amber+"66",borderRadius:9,padding:"10px 13px",marginTop:4,display:"flex",gap:8}}>
              <div><div style={{fontWeight:700,fontSize:13,color:C.amber,fontFamily:"sans-serif"}}>Club Checkout Required</div><div style={{color:C.darkL,fontSize:12,lineHeight:1.5,fontFamily:"sans-serif",marginTop:2}}>Complete a checkout flight first.</div></div>
            </div>}
            {checkoutPending&&!checkoutComplete&&<div style={{background:C.amber+"12",border:"1.5px solid "+C.amber+"44",borderRadius:9,padding:"9px 13px",display:"flex",gap:8,alignItems:"center"}}>
              <div style={{fontSize:12,color:C.darkL,fontFamily:"sans-serif"}}><strong>Checkout submitted</strong> - awaiting instructor approval.</div>
            </div>}
          </Fld>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Fld label="Start Time"><input style={iSt} type="time" value={form.start} onChange={e=>setForm(p=>({...p,start:e.target.value}))}/></Fld>
            <Fld label="End Time"><input style={iSt} type="time" value={form.end} onChange={e=>setForm(p=>({...p,end:e.target.value}))}/></Fld>
          </div>
          {(form.type==="instruction"||form.type==="checkout")&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
            <Lbl>Instructor</Lbl>
            {INSTRUCTORS.filter(ins=>form.type!=="checkout"||ins.checkoutAuth).map(ins=>(
              <button key={ins.id} onClick={()=>ins.avail&&setForm(p=>({...p,instr:ins.name}))} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 13px",borderRadius:10,cursor:ins.avail?"pointer":"default",border:"2px solid "+(form.instr===ins.name?ins.col:C.tan),background:form.instr===ins.name?ins.col+"10":C.white,opacity:ins.avail?1:.45,width:"100%",textAlign:"left"}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:ins.col+"22",border:"2px solid "+ins.col,display:"flex",alignItems:"center",justifyContent:"center",color:ins.col,fontWeight:800,fontSize:14,flexShrink:0}}>{ins.init}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"Georgia,serif",fontSize:14,fontWeight:700,color:C.dark}}>{ins.name}</div>
                  <div style={{color:C.stone,fontSize:11,fontFamily:"sans-serif"}}>{ins.cert} - ${ins.rate}/hr</div>
                </div>
                <div style={{width:20,height:20,borderRadius:"50%",border:"2px solid "+(form.instr===ins.name?ins.col:C.tan),background:form.instr===ins.name?ins.col:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {form.instr===ins.name&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>{"✓"}</span>}
                </div>
              </button>
            ))}
          </div>}
          <Fld label="Comments (optional)">
            <textarea style={{...iSt,resize:"none"}} rows={2} placeholder="Notes for your instructor or club admin..." value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/>
          </Fld>
          <div style={{display:"flex",gap:10}}>
            <Btn v="ol" style={{flex:1}} onClick={()=>setModal(false)}>Cancel</Btn>
            <Btn style={{flex:2}} disabled={(((form.type==="instruction"||form.type==="checkout")&&!form.instr))||((form.type==="solo"||form.type==="instruction")&&!checkoutComplete)} onClick={submit}>Confirm</Btn>
          </div>
        </div>
      }
    </Modal>}
  </div>;
}

function InstructorsPage(){
  const[sel,setSel]=useState(null);
  return <div style={{display:"flex",flexDirection:"column",padding:"16px 16px 40px",gap:14}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Our Instructors</div>
    {INSTRUCTORS.map(ins=>(
      <Card key={ins.id} style={{padding:16,opacity:ins.avail?1:.6,cursor:"pointer"}} onClick={()=>setSel(ins)}>
        <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
          {ins.photo?<SafeImg src={ins.photo} alt={ins.name} style={{width:50,height:50,borderRadius:"50%",objectFit:"cover",border:"2px solid "+ins.col,flexShrink:0}}/>:<Avt init={ins.init} col={ins.col} sz={50}/>}
          <div style={{flex:1}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,marginBottom:3}}>{ins.name}</div>
            <div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",marginBottom:6}}>{ins.cert} - ${ins.rate}/hr</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {ins.id===4&&<Bdg col={C.gold}>Chief Instructor</Bdg>}{ins.checkoutAuth&&<Bdg col={C.blue}>Checkout Auth</Bdg>}
              {!ins.avail&&<Bdg col={C.stone}>On Leave</Bdg>}
              {ins.avail&&<Bdg col={C.green}>Available</Bdg>}
            </div>
          </div>
          <span style={{color:C.stone,fontSize:18}}>{">"}</span>
        </div>
      </Card>
    ))}
    {sel&&<Modal onClose={()=>setSel(null)}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"flex",gap:14,alignItems:"center"}}>{sel.photo?<SafeImg src={sel.photo} alt={sel.name} style={{width:56,height:56,borderRadius:"50%",objectFit:"cover",border:"2px solid "+sel.col,flexShrink:0}}/>:<Avt init={sel.init} col={sel.col} sz={56}/>}<div><div style={{fontFamily:"Georgia,serif",fontSize:19,fontWeight:700}}>{sel.name}</div><div style={{color:C.stone,fontSize:13,fontFamily:"sans-serif",marginTop:3}}>{sel.cert}</div></div></div>
        <div style={{color:"#555",fontSize:14,lineHeight:1.7,fontFamily:"sans-serif"}}>{sel.bio}</div>
        {[["Hourly Rate","$"+sel.rate+"/hr"],["Phone",sel.phone],["Checkout Auth",sel.checkoutAuth?"Yes":"No"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid "+C.tan}}>
            <span style={{color:C.stone,fontSize:13,fontFamily:"sans-serif"}}>{l}</span>
            <span style={{fontWeight:700,fontSize:13,fontFamily:"sans-serif"}}>{v}</span>
          </div>
        ))}
        <Btn v="ol" onClick={()=>setSel(null)}>Close</Btn>
      </div>
    </Modal>}
  </div>;
}

function AircraftPage(){
  const[ac,setAc]=useState("N36JR");
  const[pi,setPi]=useState(0);
  const[lb,setLb]=useState(false);
  const[tab,setTab]=useState("times");
  const[sqF,setSqF]=useState("open");
  const curPhotos=ac==="N119S"?[{id:"n1",src:"/photos/n119s-hangar.jpg",cap:"N119S in hangar"},{id:"n2",src:"/photos/n119s-front.jpg",cap:"N119S front"},{id:"n3",src:"/photos/n119s-outside.jpg",cap:"N119S outside"},{id:"n4",src:"/photos/n119s-cockpit.jpg",cap:"N119S cockpit"},{id:"n5",src:"/photos/n119s-interior.jpg",cap:"N119S cabin"}]:PHOTOS;
  const acReg=ac==="N119S"?"N119S":"N36JR";
  const acName=ac==="N119S"?"2000 Cessna 172S Skyhawk SP":"2012 Cessna 172 Skyhawk SP";
  const acRate=ac==="N119S"?155:165;
  const acHobbs=ac==="N119S"?"2187.3":"3241.6";
  const acYear=ac==="N119S"?"2000":"2012";
  const[sqs,setSqs]=useState(ac==="N119S"?SQUAWKS.filter(s=>s.ac==="N119S"||!s.ac):[SQUAWKS[0],SQUAWKS[1],SQUAWKS[2],SQUAWKS[3]]);
  const[newSq,setNewSq]=useState("");
  const[sqMod,setSqMod]=useState(false);
  const[sqDone,setSqDone]=useState(false);
  const oilLeft=ac==="N119S"?"TBD":(3260-3241.6).toFixed(1);
  const vis=sqs.filter(s=>(sqF==="all"||s.status===sqF)&&(ac==="N119S"?!s.ac||s.ac==="N119S":true));
  const submitSq=()=>{if(!newSq.trim())return;setSqs(p=>[{id:Date.now(),ac,date:new Date().toLocaleDateString(),desc:newSq,status:"open",res:"Pending A&P review."},...p]);setNewSq("");setSqDone(true);setTimeout(()=>{setSqDone(false);setSqMod(false);},1500);};
  const stCol=s=>s==="expired"?C.red:s==="ok"?C.green:C.amber;
  return <div style={{display:"flex",flexDirection:"column"}}>
    <div style={{display:"flex",background:C.dark,borderBottom:"2px solid "+C.amber+"44"}}>
      {[["N36JR","2012 C172 SP"],["N119S","2000 C172S"]].map(([id,label])=>(
        <button key={id} onClick={()=>{setAc(id);setPi(0);}} style={{flex:1,padding:"11px 8px",border:"none",background:"transparent",cursor:"pointer",borderBottom:"3px solid "+(ac===id?C.amber:"transparent"),display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <span style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,color:ac===id?C.amberL:"#fff"}}>{id}</span>
          <span style={{fontSize:10,color:ac===id?C.stone:"rgba(255,255,255,.4)",fontFamily:"sans-serif"}}>{label}</span>
        </button>
      ))}
    </div>
    <div style={{position:"relative",height:240,overflow:"hidden",flexShrink:0}}>
      <SafeImg src={curPhotos[pi].src} alt={curPhotos[pi].cap} style={{width:"100%",height:"100%",objectFit:"cover",cursor:"pointer"}} onClick={()=>setLb(true)}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(0,0,0,.1) 0%,rgba(0,0,0,0) 40%,rgba(0,0,0,.65) 100%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:12,left:12,background:"rgba(0,0,0,.55)",borderRadius:10,padding:"5px 12px"}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#fff",lineHeight:1}}>{acReg}</div>
        <div style={{color:"rgba(255,255,255,.65)",fontSize:9,letterSpacing:".06em",fontFamily:"sans-serif"}}>{acName.toUpperCase()}</div>
      </div>
      <div style={{position:"absolute",top:12,right:12,display:"flex",alignItems:"center",gap:5,background:"rgba(0,0,0,.5)",border:"1px solid "+C.green+"66",borderRadius:20,padding:"4px 10px"}}>
        <div style={{width:7,height:7,borderRadius:"50%",background:C.green,boxShadow:"0 0 6px "+C.green}}/>
        <span style={{color:C.green,fontSize:11,fontWeight:700,fontFamily:"sans-serif"}}>Available</span>
      </div>
      <button onClick={()=>setPi(i=>(i-1+curPhotos.length)%curPhotos.length)} style={{position:"absolute",top:"40%",left:8,width:30,height:30,borderRadius:"50%",background:"rgba(0,0,0,.4)",border:"1px solid rgba(255,255,255,.3)",color:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{"<"}</button>
      <button onClick={()=>setPi(i=>(i+1)%curPhotos.length)} style={{position:"absolute",top:"40%",right:8,width:30,height:30,borderRadius:"50%",background:"rgba(0,0,0,.4)",border:"1px solid rgba(255,255,255,.3)",color:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{">"}</button>
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"5px 8px",background:"rgba(0,0,0,.5)",display:"flex",gap:3,overflowX:"auto"}}>
        {curPhotos.map((p,i)=><div key={p.id} onClick={()=>setPi(i)} style={{width:42,height:28,flexShrink:0,borderRadius:4,overflow:"hidden",cursor:"pointer",border:"2px solid "+(i===pi?"#fff":"transparent")}}><SafeImg src={p.src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>)}
      </div>
    </div>
    <div style={{background:C.dark,display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderBottom:"2px solid "+C.amber+"44"}}>
      {[["Hobbs",acHobbs,"hrs"],["Year",acYear,""],["Engine","180 HP","IO-360"],["Rate","$"+acRate,"/ hr wet"]].map(([l,v,u],i)=>(
        <div key={l} style={{padding:"12px 6px",borderRight:i<3?"1px solid rgba(255,255,255,.08)":undefined,textAlign:"center"}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:800,color:C.amberL}}>{v}</div>
          <div style={{color:C.stone,fontSize:9,textTransform:"uppercase",letterSpacing:".06em",fontFamily:"sans-serif",marginTop:2}}>{l}</div>
          {u&&<div style={{color:"rgba(255,255,255,.3)",fontSize:8,fontFamily:"sans-serif"}}>{u}</div>}
        </div>
      ))}
    </div>
    <div style={{display:"flex",borderBottom:"1px solid "+C.tan,background:C.white,overflowX:"auto"}}>
      {[["times","Times"],["desc","Description"],["equip","Equipment"],["specs","Specs"]].map(t=><button key={t[0]} onClick={()=>setTab(t[0])} style={{padding:"10px 16px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"sans-serif",fontSize:13,fontWeight:tab===t[0]?700:400,color:tab===t[0]?C.blue:C.stone,borderBottom:"2px solid "+(tab===t[0]?C.blue:"transparent"),whiteSpace:"nowrap"}}>{t[1]}</button>)}
    </div>
    <div style={{padding:"16px 16px 40px",display:"flex",flexDirection:"column",gap:14}}>
      {tab==="times"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700}}>Aircraft Times</div>
        {[["Total Time",ac==="N119S"?"5421.8 hrs":"8241.6 hrs"],["Engine Time",ac==="N119S"?"2187.3 hrs":"1241.6 hrs"],["Hobbs",acHobbs+" hrs"],["Oil Due",ac==="N119S"?"TBD":"@ 3,260.0 hrs ("+oilLeft+" hrs remaining)"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid "+C.tan}}>
            <span style={{color:C.stone,fontSize:14,fontFamily:"sans-serif"}}>{l}</span>
            <span style={{fontWeight:700,fontFamily:"sans-serif"}}>{v}</span>
          </div>
        ))}
        <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,marginTop:6}}>Maintenance Reminders</div>
        {(ac==="N119S"?REMINDERS.filter((r,i)=>i<3):[REMINDERS[0],REMINDERS[1],REMINDERS[2],REMINDERS[3],REMINDERS[5]]).map(r=><div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",borderRadius:10,background:stCol(r.st)+"10",border:"1px solid "+stCol(r.st)+"44",marginBottom:6}}>
          <div><div style={{fontSize:13,fontWeight:700,fontFamily:"sans-serif"}}>{r.name}</div><div style={{color:C.stone,fontSize:11,fontFamily:"sans-serif",marginTop:2}}>Last: {r.last}</div></div>
          <Bdg col={stCol(r.st)}>{r.st==="ok"?"OK":r.st==="expired"?"EXPIRED":r.days+" days"}</Bdg>
        </div>)}
      </>}
      {tab==="desc"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700}}>About {acReg}</div>
        <div style={{color:"#555",fontSize:14,lineHeight:1.8,fontFamily:"sans-serif",marginBottom:14}}>{ac==="N119S"?"N119S is a 2000 Cessna 172S Skyhawk SP with a recently overhauled Lycoming IO-360. Steam gauge panel with traditional airspeed, altitude, and attitude instruments. Perfect for VFR training and local cross-country flights. Hangared at KCDW.":"N36JR is a 2012 Cessna 172 Skyhawk SP equipped with the Garmin G1000 NXi and GFC700 autopilot. Based at Essex County Airport (KCDW) in Caldwell, NJ. IFR certified and meticulously maintained."}</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700}}>Squawks</div>
        <div style={{display:"flex",gap:8,marginBottom:8}}>{["open","closed","all"].map(s=><button key={s} onClick={()=>setSqF(s)} style={{padding:"6px 14px",borderRadius:20,cursor:"pointer",fontWeight:600,fontSize:12,fontFamily:"sans-serif",border:"1.5px solid "+(sqF===s?C.blue:C.tan),background:sqF===s?C.blueP:C.white,color:sqF===s?C.blue:C.stone}}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>)}</div>
        {vis.map(sq=><div key={sq.id} style={{padding:"12px 14px",borderRadius:10,border:"1px solid "+C.tan,marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontWeight:700,fontSize:13,fontFamily:"sans-serif"}}>{sq.desc}</span>
            <Bdg col={sq.status==="open"?C.amber:C.green}>{sq.status}</Bdg>
          </div>
          <div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif"}}>{sq.date} - {sq.res}</div>
        </div>)}
        <button onClick={()=>setSqMod(true)} style={{background:C.blue,color:"#fff",border:"none",borderRadius:10,padding:"12px 0",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"sans-serif",width:"100%"}}>+ Report Squawk</button>
        {sqMod&&<Modal onClose={()=>setSqMod(false)}>
          {sqDone?<div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:44,marginBottom:10}}>{"✅"}</div><div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700}}>Squawk Reported</div></div>:<div style={{display:"flex",flexDirection:"column",gap:14}}><div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700}}>Report a Squawk</div><Fld label="Description"><textarea style={{...iSt,resize:"none"}} rows={3} value={newSq} onChange={e=>setNewSq(e.target.value)} placeholder="Describe the discrepancy..."/></Fld><div style={{display:"flex",gap:10}}><Btn v="ol" style={{flex:1}} onClick={()=>setSqMod(false)}>Cancel</Btn><Btn style={{flex:2}} disabled={!newSq.trim()} onClick={submitSq}>Submit</Btn></div></div>}
        </Modal>}
      </>}
      {tab==="equip"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700}}>Equipment</div>
        {(ac==="N119S"?[["Instruments","Six-pack steam gauges - airspeed, altitude, VSI, attitude, heading, turn coordinator"],["Engine","Lycoming IO-360-L2A, 180 HP - recently overhauled"],["Fuel","100LL Avgas - wet rate, fueled at KCDW"],["Seats","4 - dual yokes (front seats)"]]:[[1,"Avionics","Garmin G1000 NXi Integrated Flight Deck"],["Autopilot","Garmin GFC700 Digital Autopilot"],["GPS","Garmin GTN 650Xi"],["Engine","Lycoming IO-360-L2A, 180 HP"],["Fuel","100LL Avgas - wet rate, fueled at KCDW"],["ADS-B","ADS-B Out (1090ES)"]]).map(([_,l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid "+C.tan,gap:10}}>
            <span style={{color:C.stone,fontSize:13,fontFamily:"sans-serif",flexShrink:0}}>{l}</span>
            <span style={{fontWeight:600,fontSize:13,fontFamily:"sans-serif",textAlign:"right"}}>{v}</span>
          </div>
        ))}
      </>}
      {tab==="specs"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700}}>Specifications</div>
        {(ac==="N119S"?[["Make / Model","2000 Cessna 172S Skyhawk SP"],["Registration","N119S"],["Cruise Speed","122 ktas"],["Range","640 nm"],["Service Ceiling","14,100 ft"],["Useful Load","910 lbs"],["Fuel Capacity","53 gal"],["Seats","4"]]:[[1,"Make / Model","2012 Cessna 172 Skyhawk SP"],["Registration","N36JR"],["Cruise Speed","122 ktas"],["Range","640 nm"],["Service Ceiling","14,000 ft"],["Useful Load","878 lbs"],["Fuel Capacity","53 gal"],["Seats","4"]]).map(([_,l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid "+C.tan}}>
            <span style={{color:C.stone,fontSize:13,fontFamily:"sans-serif"}}>{l}</span>
            <span style={{fontWeight:600,fontSize:13,fontFamily:"sans-serif"}}>{v}</span>
          </div>
        ))}
      </>}
    </div>
    {lb&&<div onClick={()=>setLb(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:900,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <SafeImg src={curPhotos[pi].src} alt={curPhotos[pi].cap} style={{maxWidth:"100%",maxHeight:"90vh",borderRadius:10,objectFit:"contain"}}/>
    </div>}
  </div>;
}
function HobbsPage({geo,charge,setPage}){
  const[before,setBefore]=useState("");
  const[after,setAfter]=useState("");
  const[instrName,setInstrName]=useState("");
  const[instrHrs,setInstrHrs]=useState("");
  const[submitting,setSubmitting]=useState(false);
  const[receipt,setReceipt]=useState(null);
  const[bUp,setBUp]=useState(false);
  const[aUp,setAUp]=useState(false);
  const[bReading,setBReading]=useState(false);
  const[aReading,setAReading]=useState(false);
  const[bErr,setBErr]=useState("");
  const[aErr,setAErr]=useState("");
  const bRef=useRef();
  const aRef=useRef();
  const ft=before&&after&&parseFloat(after)>parseFloat(before)?(parseFloat(after)-parseFloat(before)).toFixed(1):null;
  const acCharge=ft?parseFloat(ft)*165:0;
  const instrR=INSTRUCTORS.find(i=>i.name===instrName);
  const instrCharge=instrHrs&&instrR?parseFloat(instrHrs)*instrR.rate:0;
  const total=acCharge+instrCharge;
  const readMeter=(file,b64,setVal,setReading,setErr,setUp)=>{
    setUp(true);setErr("");setReading(true);
    fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:100,
        messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:file.type,data:b64}},{type:"text",text:"This is an aircraft Hobbs meter. Extract only the numeric reading. Respond with ONLY the number (e.g. 3241.6). If unreadable, respond UNREADABLE."}]}]})})
    .then(r=>r.json()).then(d=>{
      const txt=(d.content&&d.content[0]&&d.content[0].text||"").trim();
      if(txt==="UNREADABLE"||!/^\d+\.?\d*$/.test(txt)){setErr("Could not read - please enter manually.");setReading(false);}
      else{setVal(txt);setReading(false);}
    }).catch(()=>{setErr("Reading failed - please enter manually.");setReading(false);});
  };
  const handleFile=(e,setVal,setReading,setErr,setUp)=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{const b64=ev.target.result.split(",")[1];readMeter(file,b64,setVal,setReading,setErr,setUp);};
    reader.readAsDataURL(file);
  };
  const submit=async()=>{
    if(!ft)return;
    setSubmitting(true);
    const items=[{d:"Aircraft time N36JR ("+ft+" hrs)",q:ft+" hrs",r:165,a:acCharge}];
    if(instrCharge>0)items.push({d:"Instruction - "+instrName+" ("+instrHrs+" hrs)",q:instrHrs+" hrs",r:instrR.rate,a:instrCharge});
    await sb("hobbs_logs","POST",{member_name:"Member",aircraft:"N36JR",hobbs_in:parseFloat(before),hobbs_out:parseFloat(after),instructor_name:instrName||null,instructor_hours:instrHrs?parseFloat(instrHrs):null,ac_charge:acCharge,instr_charge:instrCharge||0,total_charge:total,log_date:TODAY});
    await charge(items);
    setReceipt({items,total,hobbs:{before,after,ft}});
    setSubmitting(false);
  };
  if(receipt)return <div style={{padding:"24px 18px",display:"flex",flexDirection:"column",gap:16,alignItems:"center",textAlign:"center"}}>
    <div style={{fontSize:56}}>{"✅"}</div>
    <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700}}>Flight Logged!</div>
    <div style={{background:C.dark,borderRadius:16,padding:"18px 20px",width:"100%",textAlign:"left"}}>
      <div style={{color:C.stone,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",fontFamily:"sans-serif",marginBottom:10}}>Receipt</div>
      {receipt.items.map(it=><div key={it.d} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:C.stone,fontSize:13,fontFamily:"sans-serif"}}>{it.d}</span><span style={{color:C.amberL,fontWeight:700,fontSize:13,fontFamily:"sans-serif"}}>{$$(it.a)}</span></div>)}
      <div style={{borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:10,marginTop:4,display:"flex",justifyContent:"space-between"}}>
        <span style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,color:"#fff"}}>Total</span>
        <span style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:C.amberL}}>{$$(receipt.total)}</span>
      </div>
    </div>
    <div style={{color:C.stone,fontSize:13,fontFamily:"sans-serif"}}>Hobbs {receipt.hobbs.before} to {receipt.hobbs.after} - {receipt.hobbs.ft} hrs</div>
    <Btn onClick={()=>setPage("home")}>Back to Home</Btn>
  </div>;
  return <div style={{padding:"16px 16px 40px",display:"flex",flexDirection:"column",gap:16}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Log Hobbs Time</div>
    {geo.near&&<div style={{background:C.amber+"15",border:"1.5px solid "+C.amber+"55",borderRadius:12,padding:"12px 14px",display:"flex",gap:10,alignItems:"center"}}>
      <div className="rdot"/><div><div style={{fontWeight:700,fontSize:13,fontFamily:"sans-serif",color:C.amber}}>You are at KCDW!</div><div style={{color:C.darkL,fontSize:12,fontFamily:"sans-serif"}}>Photograph the Hobbs meter before and after your flight.</div></div>
    </div>}
    <Card style={{padding:16,display:"flex",flexDirection:"column",gap:14}}>
      <div style={{fontWeight:700,fontSize:14,fontFamily:"sans-serif"}}>N36JR - 2012 Cessna 172 Skyhawk SP</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {[{label:"Before Flight",up:bUp,setUp:setBUp,reading:bReading,err:bErr,ref:bRef,val:before,setVal:setBefore,onChange:e=>handleFile(e,setBefore,setBReading,setBErr,setBUp)},{label:"After Flight",up:aUp,setUp:setAUp,reading:aReading,err:aErr,ref:aRef,val:after,setVal:setAfter,onChange:e=>handleFile(e,setAfter,setAReading,setAErr,setAUp)}].map(item=>(
          <div key={item.label} style={{display:"flex",flexDirection:"column",gap:6}}>
            <Lbl>{item.label}</Lbl>
            <input type="file" accept="image/*" capture="environment" ref={item.ref} style={{display:"none"}} onChange={item.onChange}/>
            <div onClick={()=>!item.reading&&item.ref.current&&item.ref.current.click()} style={{border:"2px dashed "+(item.up?C.green:C.tan),borderRadius:10,padding:"14px 8px",textAlign:"center",cursor:item.reading?"wait":"pointer",background:item.up?C.green+"0a":"#fafafa",minHeight:80,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}>
              {item.reading?<><div style={{width:20,height:20,border:"2.5px solid "+C.amber,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite"}}/><span style={{color:C.amber,fontSize:11,fontWeight:700,fontFamily:"sans-serif"}}>Reading meter...</span></>
              :item.up?<><span style={{color:C.green,fontSize:11,fontWeight:700,fontFamily:"sans-serif"}}>{"✓"} Uploaded</span><span style={{color:C.stone,fontSize:10,fontFamily:"sans-serif"}}>Tap to replace</span></>
              :<><span style={{color:C.stone,fontSize:11,fontFamily:"sans-serif"}}>Tap to photograph</span><span style={{color:C.stoneL,fontSize:10,fontFamily:"sans-serif"}}>AI reads meter automatically</span></>}
            </div>
            {item.err&&<div style={{color:C.red,fontSize:11,fontFamily:"sans-serif"}}>{item.err}</div>}
            <input style={{...iSt,borderColor:item.val?C.green:C.tan}} type="number" step=".1" value={item.val} onChange={e=>item.setVal(e.target.value)} placeholder={item.label==="Before Flight"?"3241.6":"3243.4"}/>
          </div>
        ))}
      </div>
      {ft&&<div style={{background:C.blueP,border:"1px solid "+C.blue+"44",borderRadius:8,padding:"10px 12px",display:"flex",alignItems:"center",gap:8}}><span style={{color:C.blue,fontSize:13,fontWeight:700,fontFamily:"sans-serif"}}>{ft} Hobbs hours</span><span style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",marginLeft:"auto"}}>{$$(acCharge)} aircraft charge</span></div>}
    </Card>
    <Card style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
      <div style={{fontWeight:700,fontSize:14,fontFamily:"sans-serif"}}>Instruction Time (optional)</div>
      <Fld label="Instructor"><select style={iSt} value={instrName} onChange={e=>setInstrName(e.target.value)}><option value="">None - solo flight</option>{INSTRUCTORS.filter(i=>i.avail).map(i=><option key={i.id} value={i.name}>{i.name} (${i.rate}/hr)</option>)}</select></Fld>
      {instrName&&<Fld label="Instruction Hours"><input style={iSt} type="number" step=".1" value={instrHrs} onChange={e=>setInstrHrs(e.target.value)} placeholder="e.g. 1.5"/></Fld>}
    </Card>
    {ft&&<Card style={{padding:16}}>
      <div style={{color:C.stone,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",fontFamily:"sans-serif",marginBottom:10}}>Estimated Charge</div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{color:C.darkL,fontSize:13,fontFamily:"sans-serif"}}>N36JR - {ft} hrs @ $165/hr</span><span style={{fontWeight:700,fontFamily:"sans-serif"}}>{$$(acCharge)}</span></div>
      {instrCharge>0&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{color:C.darkL,fontSize:13,fontFamily:"sans-serif"}}>{instrName.split(" ").slice(-1)[0]} - {instrHrs} hrs @ ${instrR.rate}/hr</span><span style={{fontWeight:700,fontFamily:"sans-serif"}}>{$$(instrCharge)}</span></div>}
      <div style={{borderTop:"1px solid "+C.tan,paddingTop:10,marginTop:4,display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700}}>Total</span><span style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:C.green}}>{$$(total)}</span></div>
    </Card>}
    <Btn disabled={!ft||submitting} onClick={submit}>{submitting?<Spin/>:"Submit and Bill Account"}</Btn>
  </div>;
}

function AddFundsModal({onClose,deposit}){
  const[step,setStep]=useState(1);
  const[method,setMethod]=useState("card");
  const[amt,setAmt]=useState(1000);
  const[done,setDone]=useState(false);
  const[cardNum,setCardNum]=useState("");
  const[expiry,setExpiry]=useState("");
  const[cvv,setCvv]=useState("");
  const[routing,setRouting]=useState("");
  const[acct,setAcct]=useState("");
  const submit=()=>{const last4=method==="card"?cardNum.slice(-4):acct.slice(-4);deposit(amt,method,last4);setDone(true);};
  if(done)return <div style={{textAlign:"center",padding:"20px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
    <div style={{fontSize:52}}>{"✅"}</div>
    <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Funds Added!</div>
    <div style={{color:C.stone,fontSize:14,fontFamily:"sans-serif"}}>{$$(amt)} has been added to your account.</div>
    <Btn onClick={onClose}>Done</Btn>
  </div>;
  return <div style={{display:"flex",flexDirection:"column",gap:14}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700}}>Add Funds</div>
    {step===1&&<>
      <Fld label="Amount">
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {FUND_AMTS.slice(0,6).map(a=><button key={a} onClick={()=>setAmt(a)} style={{padding:"9px 14px",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"sans-serif",border:"2px solid "+(amt===a?C.blue:C.tan),background:amt===a?C.blueP:C.white,color:amt===a?C.blue:C.stone}}>{$$(a)}</button>)}
        </div>
      </Fld>
      <Fld label="Payment Method">
        <div style={{display:"flex",gap:8}}>
          {[["card","Credit Card"],["ach","Bank (ACH)"]].map(([m,l])=><button key={m} onClick={()=>setMethod(m)} style={{flex:1,padding:"10px 0",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"sans-serif",border:"2px solid "+(method===m?C.blue:C.tan),background:method===m?C.blueP:C.white,color:method===m?C.blue:C.stone}}>{l}</button>)}
        </div>
      </Fld>
      <Btn onClick={()=>setStep(2)}>Continue</Btn>
    </>}
    {step===2&&<>
      {method==="card"?<>
        <Fld label="Card Number"><input style={iSt} maxLength={19} value={cardNum} onChange={e=>setCardNum(e.target.value)} placeholder="4242 4242 4242 4242"/></Fld>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Fld label="Expiry"><input style={iSt} maxLength={5} value={expiry} onChange={e=>setExpiry(e.target.value)} placeholder="MM/YY"/></Fld>
          <Fld label="CVV"><input style={iSt} maxLength={4} type="password" value={cvv} onChange={e=>setCvv(e.target.value.replace(/[^0-9]/g,""))} placeholder="***"/></Fld>
        </div>
      </>:<>
        <Fld label="Routing Number"><input style={iSt} maxLength={9} value={routing} onChange={e=>setRouting(e.target.value.replace(/[^0-9]/g,""))} placeholder="021000021"/></Fld>
        <Fld label="Account Number"><input style={iSt} value={acct} onChange={e=>setAcct(e.target.value.replace(/[^0-9]/g,""))} type="password"/></Fld>
      </>}
      <div style={{background:C.parchment,borderRadius:10,padding:"11px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{color:C.stone,fontFamily:"sans-serif",fontSize:13}}>Amount to add</span>
        <span style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700}}>{$$(amt)}</span>
      </div>
      <div style={{display:"flex",gap:10}}>
        <Btn v="ol" style={{flex:1}} onClick={()=>setStep(1)}>Back</Btn>
        <Btn style={{flex:2}} disabled={method==="card"?cardNum.length<16||!expiry||!cvv:routing.length!==9||!acct} onClick={submit}>Add {$$(amt)}</Btn>
      </div>
    </>}
  </div>;
}

function BillingPage({bal,txns,invs,deposit}){
  const[tab,setTab]=useState("balance");
  const[addFunds,setAddFunds]=useState(false);
  const[openInv,setOpenInv]=useState(null);
  return <div style={{display:"flex",flexDirection:"column",paddingBottom:40}}>
    <div style={{background:"linear-gradient(135deg,#0d2137,#1a3a5c)",padding:"24px 20px 20px"}}>
      <div style={{fontSize:10,fontWeight:800,color:C.amberL,letterSpacing:".14em",textTransform:"uppercase",fontFamily:"sans-serif",marginBottom:6}}>Prepaid Balance</div>
      <div style={{fontFamily:"Georgia,serif",fontSize:42,fontWeight:700,color:"#fff",marginBottom:4}}>{$$(bal)}</div>
      <div style={{color:"rgba(255,255,255,.55)",fontSize:12,fontFamily:"sans-serif",marginBottom:16}}>Available for flight time and instruction</div>
      <button onClick={()=>setAddFunds(true)} style={{background:"linear-gradient(135deg,#C8852A,#A0621A)",color:"#fff",border:"none",borderRadius:12,padding:"13px 28px",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"sans-serif"}}>+ Add Funds</button>
    </div>
    <div style={{display:"flex",borderBottom:"1px solid "+C.tan,background:C.white}}>
      {[["balance","Transactions"],["invoices","Invoices"],["rates","Rates"]].map(([id,l])=><button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"11px 0",border:"none",background:"transparent",cursor:"pointer",fontFamily:"sans-serif",fontSize:13,fontWeight:tab===id?700:400,color:tab===id?C.blue:C.stone,borderBottom:"2px solid "+(tab===id?C.blue:"transparent")}}>{l}</button>)}
    </div>
    <div style={{padding:"14px 14px"}}>
      {tab==="balance"&&txns.map(t=>(
        <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid "+C.tan+"88"}}>
          <div><div style={{fontWeight:600,fontSize:13,fontFamily:"sans-serif",marginBottom:2}}>{t.desc}</div><div style={{color:C.stone,fontSize:11,fontFamily:"sans-serif"}}>{t.date}</div></div>
          <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:t.amt>0?C.green:C.dark}}>{t.amt>0?"+":""}{$$(t.amt)}</div>
        </div>
      ))}
      {tab==="invoices"&&invs.map(inv=>(
        <div key={inv.id}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid "+C.tan+"88",cursor:"pointer"}} onClick={()=>setOpenInv(openInv===inv.id?null:inv.id)}>
            <div><div style={{fontWeight:600,fontSize:14,fontFamily:"sans-serif"}}>Invoice #{inv.id}</div><div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",marginTop:2}}>{inv.date}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700}}>{$$(inv.total)}</div><Bdg col={C.green}>Paid</Bdg></div>
          </div>
          {openInv===inv.id&&<div style={{background:C.cream,borderRadius:10,padding:"12px 14px",marginBottom:8}}>
            {inv.items.map(it=><div key={it.d} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid "+C.tan+"55"}}><span style={{color:C.darkL,fontSize:12,fontFamily:"sans-serif"}}>{it.d}</span><span style={{fontWeight:700,fontSize:12,fontFamily:"sans-serif"}}>{$$(it.a)}</span></div>)}
          </div>}
        </div>
      ))}
      {tab==="rates"&&[["Aircraft Rental","$165/hr","Hobbs-based, fuel included"],["Membership Dues","$80/mo","Month-to-month"],["Capt. Mike Torres","$85/hr","CFI/CFII/MEI - Checkout auth"],["Lisa Chen","$75/hr","CFI/CFII - Primary and instrument"],["Ryan Brooks","$65/hr","CFI - On leave"]].map(([l,v,d])=>(
        <div key={l} style={{padding:"14px 0",borderBottom:"1px solid "+C.tan+"88"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}><span style={{fontWeight:700,fontSize:14,fontFamily:"sans-serif"}}>{l}</span><span style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:C.blue}}>{v}</span></div>
          <div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif"}}>{d}</div>
        </div>
      ))}
    </div>
    {addFunds&&<Modal onClose={()=>setAddFunds(false)}><AddFundsModal onClose={()=>setAddFunds(false)} deposit={deposit}/></Modal>}
  </div>;
}

function AccountPage({geo,user}){
  const docs=[["Rental Agreement","Current"],["Member Handbook","2026"],["Emergency Procedures","Rev. 3"],["Privacy Policy","2025"]];
  return <div style={{display:"flex",flexDirection:"column",padding:"16px 16px 40px",gap:16}}>
    <Card style={{padding:18}}>
      <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:14}}>
        <div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,"+C.blue+",#1044A0)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:"#fff",flexShrink:0}}>{user&&user.init||"?"}</div>
        <div>
          <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700}}>{user&&user.name||"Member"}</div>
          <div style={{color:C.stone,fontSize:13,fontFamily:"sans-serif",marginTop:2}}>{user&&user.email||""}</div>
          <Bdg col={C.green}>Active Member</Bdg>
        </div>
      </div>
      {[["Member Since","January 2026"],["Membership","Month-to-Month - $80/mo"],["Status","Active and Current"]].map(([l,v])=>(
        <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid "+C.tan+"66"}}>
          <span style={{color:C.stone,fontSize:13,fontFamily:"sans-serif"}}>{l}</span>
          <span style={{fontWeight:600,fontSize:13,fontFamily:"sans-serif"}}>{v}</span>
        </div>
      ))}
    </Card>
    <Card style={{padding:16}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,marginBottom:12}}>Location Services</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:13,fontFamily:"sans-serif",fontWeight:600}}>Location Access</div><div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",marginTop:2}}>{geo.ok?"Enabled":"Not enabled"}</div></div>
        <Bdg col={geo.ok?C.green:C.stone}>{geo.ok?"Active":"Off"}</Bdg>
      </div>
    </Card>
    <Card style={{padding:16}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,marginBottom:12}}>Club Documents</div>
      {docs.map(([name,ver])=>(
        <div key={name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid "+C.tan+"66"}}>
          <div><div style={{fontSize:13,fontWeight:600,fontFamily:"sans-serif"}}>{name}</div><div style={{color:C.stone,fontSize:11,fontFamily:"sans-serif"}}>{ver}</div></div>
          <button style={{background:C.blueP,color:C.blue,border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"sans-serif"}}>PDF</button>
        </div>
      ))}
    </Card>
  </div>;
}

function CheckoutTab({instructor,checkouts,setCheckouts}){
  const[sel,setSel]=useState(null);
  const[notes,setNotes]=useState("");
  const[declining,setDeclining]=useState(false);
  const[declineReason,setDeclineReason]=useState("");
  const[done,setDone]=useState(null);
  const mine=checkouts.filter(c=>c.instructorId===instructor.instructorId);
  const statusCol=s=>s==="approved"?C.green:s==="declined"?C.red:C.amber;
  const approve=id=>{
    setCheckouts(p=>p.map(c=>c.id===id?{...c,status:"approved",notes,approvedDate:TODAY}:c));
    setDone("approved");
    setTimeout(()=>{setSel(null);setDone(null);setNotes("");setDeclining(false);setDeclineReason("");},2200);
  };
  const decline=id=>{
    if(!declineReason.trim())return;
    setCheckouts(p=>p.map(c=>c.id===id?{...c,status:"declined",declineReason}:c));
    setDone("declined");
    setTimeout(()=>{setSel(null);setDone(null);setNotes("");setDeclining(false);setDeclineReason("");},2200);
  };
  return <div style={{padding:"16px 16px 40px",display:"flex",flexDirection:"column",gap:14}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Checkout Approvals</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
      {[["pending","Pending",C.amber],["approved","Approved",C.green],["declined","Declined",C.red]].map(([s,l,col])=>(
        <div key={s} style={{background:col+"10",border:"1px solid "+col+"44",borderRadius:10,padding:"12px 8px",textAlign:"center"}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:800,color:col}}>{mine.filter(c=>c.status===s).length}</div>
          <div style={{color:col,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",fontFamily:"sans-serif"}}>{l}</div>
        </div>
      ))}
    </div>
    {mine.length===0&&<div style={{color:C.stone,fontSize:14,fontFamily:"sans-serif",textAlign:"center",padding:24}}>No checkout flights assigned to you yet.</div>}
    {mine.map(co=>(
      <Card key={co.id} style={{padding:0,overflow:"hidden",cursor:co.status==="pending"?"pointer":"default"}} onClick={()=>{setSel(co);setNotes(co.notes||"");setDeclining(false);setDeclineReason(co.declineReason||"");}}>
        <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,marginBottom:3}}>{co.memberName}</div>
            <div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif"}}>{co.date} - N36JR</div>
            <div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",marginTop:2}}>Hobbs: {co.hobbsIn} to {co.hobbsOut}</div>
            {co.status==="approved"&&co.notes&&<div style={{color:C.green,fontSize:12,fontFamily:"sans-serif",marginTop:4,fontStyle:"italic"}}>"{co.notes}"</div>}
            {co.status==="declined"&&co.declineReason&&<div style={{color:C.red,fontSize:12,fontFamily:"sans-serif",marginTop:4}}>{co.declineReason}</div>}
          </div>
          <Bdg col={statusCol(co.status)}>{co.status==="pending"?"Pending":co.status==="approved"?"Approved":"Declined"}</Bdg>
        </div>
        {co.status==="pending"&&<div style={{background:C.amber+"10",padding:"8px 16px",borderTop:"1px solid "+C.amber+"33",fontSize:12,color:C.amber,fontWeight:700,fontFamily:"sans-serif"}}>Tap to review</div>}
      </Card>
    ))}
    {sel&&<Modal onClose={()=>{setSel(null);setDeclining(false);}}>
      {done==="approved"?(
        <div style={{textAlign:"center",padding:"20px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
          <div style={{fontSize:56}}>{"✅"}</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Checkout Approved!</div>
          <div style={{color:C.stone,fontSize:13,fontFamily:"sans-serif"}}>{sel.memberName} can now book solo and dual time.</div>
        </div>
      ):done==="declined"?(
        <div style={{textAlign:"center",padding:"20px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
          <div style={{fontSize:56}}>{"❌"}</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Checkout Declined</div>
          <div style={{color:C.stone,fontSize:13,fontFamily:"sans-serif"}}>{sel.memberName} has been notified.</div>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:19,fontWeight:700}}>Review Checkout Flight</div>
          <div style={{background:C.dark,borderRadius:12,padding:"14px 16px"}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:"#fff",marginBottom:8}}>{sel.memberName}</div>
            {[["Date",sel.date],["Aircraft","N36JR"],["Hobbs In",sel.hobbsIn],["Hobbs Out",sel.hobbsOut]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
                <span style={{color:C.stone,fontSize:12,fontFamily:"sans-serif"}}>{l}</span>
                <span style={{color:C.amberL,fontSize:12,fontWeight:700,fontFamily:"sans-serif"}}>{v}</span>
              </div>
            ))}
          </div>
          <Fld label="Instructor Notes (optional)">
            <textarea style={{...iSt,resize:"none"}} rows={3} placeholder="Performance observations, recommendations..." value={notes} onChange={e=>setNotes(e.target.value)}/>
          </Fld>
          {!declining&&sel.status==="pending"&&<div style={{display:"flex",gap:10}}>
            <Btn v="gr" style={{flex:2}} onClick={()=>approve(sel.id)}>Approve Checkout</Btn>
            <Btn v="rd" style={{flex:1}} onClick={()=>setDeclining(true)}>Decline</Btn>
          </div>}
          {declining&&<div style={{background:C.red+"08",border:"1.5px solid "+C.red+"33",borderRadius:12,padding:14,display:"flex",flexDirection:"column",gap:10}}>
            <div style={{fontWeight:700,fontSize:14,color:C.red,fontFamily:"sans-serif"}}>Reason for Decline (required)</div>
            <textarea style={{...iSt,borderColor:C.red+"88",resize:"none"}} rows={3} placeholder="Explain what needs improvement before another checkout..." value={declineReason} onChange={e=>setDeclineReason(e.target.value)}/>
            <div style={{display:"flex",gap:8}}>
              <Btn v="ol" style={{flex:1}} onClick={()=>setDeclining(false)}>Cancel</Btn>
              <Btn v="rd" style={{flex:2}} disabled={!declineReason.trim()} onClick={()=>decline(sel.id)}>Confirm Decline</Btn>
            </div>
          </div>}
          {sel.status!=="pending"&&<Btn v="ol" onClick={()=>setSel(null)}>Close</Btn>}
        </div>
      )}
    </Modal>}
  </div>;
}

function InstrScheduleTab({instructor}){
  const mine=INIT_BOOKINGS.filter(b=>b.instr===instructor.name);
  return <div style={{padding:"16px 16px 40px",display:"flex",flexDirection:"column",gap:12}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>My Schedule</div>
    {!instructor.checkoutAuth&&<div style={{background:C.parchment,borderRadius:12,padding:"14px 16px",border:"1px solid "+C.tan}}>
      <div style={{fontWeight:700,fontSize:13,fontFamily:"sans-serif",marginBottom:4}}>Checkout Authorization</div>
      <div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",lineHeight:1.6}}>You are not authorized to conduct club checkout flights. Only CFI/CFII/MEI instructors may perform checkouts.</div>
    </div>}
    {mine.length===0?<div style={{color:C.stone,fontSize:14,fontFamily:"sans-serif",textAlign:"center",padding:24}}>No flights scheduled.</div>:mine.map(b=>(
      <Card key={b.id} style={{padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,marginBottom:3}}>{b.pilot}</div><div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif"}}>{b.date} - {b.start}-{b.end} - {b.ac}</div></div>
          <Bdg col={b.type==="checkout"?C.gold:C.blue}>{b.type}</Bdg>
        </div>
      </Card>
    ))}
  </div>;
}

function MembersTab({checkouts}){
  const statusCol=s=>s==="approved"?C.green:s==="declined"?C.red:s==="pending"?C.amber:C.stone;
  const statusLabel=s=>s==="approved"?"Cleared":s==="declined"?"Declined":s==="pending"?"Pending":"No checkout";
  const members=[
    {id:"m1",name:"Sarah Mitchell",email:"sarah@kcdw.com",cert:"Private Pilot",hours:124,joined:"Jan 2026"},
    {id:"m2",name:"Priya Patel",email:"priya@kcdw.com",cert:"Student Pilot",hours:32,joined:"Feb 2026"},
    {id:"m3",name:"James Rodriguez",email:"james@kcdw.com",cert:"Private Pilot",hours:89,joined:"Mar 2026"},
    {id:"m4",name:"Tom Baker",email:"tom@kcdw.com",cert:"Student Pilot",hours:8,joined:"May 2026"},
  ];
  const getStatus=email=>{const co=checkouts.find(c=>c.memberId===email);return co?co.status:"none";};
  return <div style={{padding:"16px 16px 40px",display:"flex",flexDirection:"column",gap:12}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Club Members</div>
    {members.map(m=>{
      const st=getStatus(m.email);
      return <Card key={m.id} style={{padding:16}}>
        <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
          <div style={{width:42,height:42,borderRadius:"50%",background:C.blue+"22",border:"2px solid "+C.blue,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:C.blue,flexShrink:0}}>{m.name.split(" ").map(n=>n[0]).join("")}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,marginBottom:2}}>{m.name}</div>
            <div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",marginBottom:6}}>{m.cert} - {m.hours} hrs - Joined {m.joined}</div>
            <Bdg col={statusCol(st)}>{statusLabel(st)}</Bdg>
          </div>
        </div>
      </Card>;
    })}
  </div>;
}

function EmployeeTab({instructor}){
  const[activeTab,setActiveTab]=useState("w4");
  const[saved,setSaved]=useState({});
  const[f,setF]=useState({legalName:"",ssn:"",address:"",city:"",state:"NJ",zip:"",filingStatus:"Single",allowances:"0",extra:"",exempt:false,i9First:"",i9Last:"",i9DOB:"",i9SSN:"",i9Email:"",i9Phone:"",i9Citizen:"citizen",i9DocType:"passport",i9DocNum:"",i9Expiry:"",bankName:"",accountType:"checking",routing:"",account:"",accountConfirm:"",njAllow:"0",njExtra:"",njExempt:false,emName:"",emPhone:"",emRel:"",emName2:"",emPhone2:"",emRel2:""});
  const u=p=>setF(x=>({...x,...p}));
  const save=t=>setSaved(p=>({...p,[t]:true}));
  const done=["w4","i9","dd","njw4","em"].filter(t=>saved[t]).length;
  const allDone=done===5;
  const pct=Math.round(done/5*100);
  const SF=({label,field,type,max,ph,xform})=><Fld label={label}><input style={iSt} type={type||"text"} maxLength={max} value={f[field]} onChange={e=>u({[field]:xform?xform(e.target.value):e.target.value})} placeholder={ph}/></Fld>;
  return <div style={{display:"flex",flexDirection:"column",paddingBottom:40}}>
    <div style={{background:C.dark,padding:"16px 16px 14px"}}>
      <div style={{fontSize:10,fontWeight:800,color:C.amber,letterSpacing:".14em",textTransform:"uppercase",fontFamily:"sans-serif",marginBottom:6}}>Employee Onboarding</div>
      <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700,color:"#fff",marginBottom:8}}>HR Forms and QuickBooks</div>
      <div style={{height:5,background:"rgba(255,255,255,.12)",borderRadius:3,overflow:"hidden",marginBottom:5}}><div style={{height:"100%",width:pct+"%",background:"linear-gradient(90deg,"+C.amber+","+C.amberL+")",borderRadius:3,transition:"width .4s"}}/></div>
      <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.stone,fontSize:12,fontFamily:"sans-serif"}}>{pct}% - {done}/5 forms</span>{allDone&&<span style={{color:C.green,fontSize:12,fontWeight:700,fontFamily:"sans-serif"}}>Ready for QuickBooks</span>}</div>
    </div>
    <div style={{display:"flex",overflowX:"auto",borderBottom:"1px solid #e5e7eb",background:C.white}}>
      {[["w4","W-4"],["i9","I-9"],["dd","Direct Dep."],["njw4","NJ W-4"],["em","Emergency"],["qb","QuickBooks"]].map(([id,label])=>(
        <button key={id} onClick={()=>setActiveTab(id)} style={{padding:"10px 12px",border:"none",background:"transparent",cursor:"pointer",fontSize:12,fontFamily:"sans-serif",borderBottom:"2px solid "+(activeTab===id?C.blue:"transparent"),color:activeTab===id?C.blue:C.stone,fontWeight:activeTab===id?700:500,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4}}>
          {saved[id]&&id!=="qb"?"✓ ":""}{label}
        </button>
      ))}
    </div>
    <div style={{padding:"18px 16px",display:"flex",flexDirection:"column",gap:12}}>
      {activeTab==="w4"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>Federal W-4 - Employee Withholding</div>
        <div style={{background:C.blueP,border:"1px solid "+C.blue+"33",borderRadius:10,padding:"9px 12px",fontSize:12,color:C.blue,fontFamily:"sans-serif"}}>Submitted electronically to the IRS via QuickBooks Payroll.</div>
        <SF label="Legal Full Name" field="legalName" ph="Michael A. Torres"/>
        <SF label="Social Security Number" field="ssn" type="password" ph="XXX-XX-XXXX"/>
        <SF label="Home Address" field="address" ph="123 Runway Dr"/>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:10}}>
          <SF label="City" field="city" ph="Caldwell"/>
          <SF label="State" field="state" max={2} ph="NJ" xform={v=>v.toUpperCase()}/>
          <SF label="ZIP" field="zip" max={5} ph="07006" xform={v=>v.replace(/[^0-9]/g,"")}/>
        </div>
        <Fld label="Filing Status"><select style={iSt} value={f.filingStatus} onChange={e=>u({filingStatus:e.target.value})}><option>Single</option><option>Married filing jointly</option><option>Head of household</option></select></Fld>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <SF label="Allowances" field="allowances" type="number" ph="0"/>
          <SF label="Extra Withholding ($)" field="extra" type="number" ph="0.00"/>
        </div>
        <label style={{display:"flex",gap:10,alignItems:"flex-start",cursor:"pointer"}}><input type="checkbox" checked={f.exempt} onChange={e=>u({exempt:e.target.checked})} style={{width:18,height:18,marginTop:2,accentColor:C.blue}}/><span style={{fontSize:13,fontFamily:"sans-serif"}}>Claim Exemption from Withholding</span></label>
        <Btn v={saved.w4?"ol":"gr"} onClick={()=>save("w4")}>{saved.w4?"W-4 Submitted":"Submit W-4 to QuickBooks"}</Btn>
      </>}
      {activeTab==="i9"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>Form I-9 - Employment Eligibility</div>
        <div style={{background:C.amber+"12",border:"1px solid "+C.amber+"44",borderRadius:10,padding:"9px 12px",fontSize:12,color:C.darkL,fontFamily:"sans-serif"}}>Required by federal law within 3 days of hire.</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><SF label="First Name" field="i9First" ph="Michael"/><SF label="Last Name" field="i9Last" ph="Torres"/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><SF label="Date of Birth" field="i9DOB" type="date"/><SF label="SSN Last 4" field="i9SSN" max={4} ph="1234" xform={v=>v.replace(/[^0-9]/g,"")}/></div>
        <SF label="Email" field="i9Email" type="email" ph="torres@kcdw.com"/>
        <SF label="Phone" field="i9Phone" type="tel" ph="(973) 555-0811"/>
        <Fld label="Citizenship Status"><select style={iSt} value={f.i9Citizen} onChange={e=>u({i9Citizen:e.target.value})}><option value="citizen">U.S. Citizen</option><option value="noncitizen_national">Noncitizen National</option><option value="lawful_permanent_resident">Lawful Permanent Resident</option><option value="authorized_alien">Alien Authorized to Work</option></select></Fld>
        <Fld label="Document Type"><select style={iSt} value={f.i9DocType} onChange={e=>u({i9DocType:e.target.value})}><option value="passport">U.S. Passport (List A)</option><option value="dl_ss">Driver License + SS Card (List B+C)</option><option value="dl_birth">Driver License + Birth Cert (List B+C)</option><option value="green_card">Permanent Resident Card (List A)</option></select></Fld>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><SF label="Document Number" field="i9DocNum" ph="Doc #"/><SF label="Expiration Date" field="i9Expiry" type="date"/></div>
        <Btn v={saved.i9?"ol":"gr"} onClick={()=>save("i9")}>{saved.i9?"I-9 Submitted":"Submit I-9 to QuickBooks"}</Btn>
      </>}
      {activeTab==="dd"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>Direct Deposit Authorization</div>
        <div style={{background:C.blueP,border:"1px solid "+C.blue+"33",borderRadius:10,padding:"9px 12px",fontSize:12,color:C.blue,fontFamily:"sans-serif"}}>Pay deposited on the 1st and 15th. Bank details encrypted by Intuit.</div>
        <SF label="Bank Name" field="bankName" ph="Chase Bank"/>
        <Fld label="Account Type"><div style={{display:"flex",gap:8}}>{["checking","savings"].map(t=><button key={t} onClick={()=>u({accountType:t})} style={{flex:1,padding:"10px 0",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"sans-serif",border:"2px solid "+(f.accountType===t?C.blue:C.tan),background:f.accountType===t?C.blue:C.white,color:f.accountType===t?"#fff":C.stone}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}</div></Fld>
        <SF label="Routing Number (9 digits)" field="routing" max={9} ph="021000021" xform={v=>v.replace(/[^0-9]/g,"").slice(0,9)}/>
        <SF label="Account Number" field="account" type="password" xform={v=>v.replace(/[^0-9]/g,"")}/>
        <SF label="Confirm Account Number" field="accountConfirm" xform={v=>v.replace(/[^0-9]/g,"")}/>
        {f.account&&f.accountConfirm&&f.account!==f.accountConfirm&&<div style={{color:C.red,fontSize:12,fontFamily:"sans-serif"}}>Account numbers do not match.</div>}
        <Btn v={saved.dd?"ol":"gr"} disabled={!f.routing||f.routing.length!==9||!f.account||f.account!==f.accountConfirm} onClick={()=>save("dd")}>{saved.dd?"Direct Deposit Set Up":"Submit to QuickBooks"}</Btn>
      </>}
      {activeTab==="njw4"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>NJ-W4 - New Jersey Withholding</div>
        <div style={{background:C.blueP,border:"1px solid "+C.blue+"33",borderRadius:10,padding:"9px 12px",fontSize:12,color:C.blue,fontFamily:"sans-serif"}}>Required by NJ Division of Taxation. Filed alongside Federal W-4.</div>
        <SF label="NJ Withholding Allowances" field="njAllow" type="number" ph="0"/>
        <SF label="Additional NJ Withholding Per Period ($)" field="njExtra" type="number" ph="0.00"/>
        <label style={{display:"flex",gap:10,alignItems:"flex-start",cursor:"pointer"}}><input type="checkbox" checked={f.njExempt} onChange={e=>u({njExempt:e.target.checked})} style={{width:18,height:18,marginTop:2,accentColor:C.blue}}/><span style={{fontSize:13,fontFamily:"sans-serif"}}>Claim NJ Exemption from Withholding</span></label>
        <Btn v={saved.njw4?"ol":"gr"} onClick={()=>save("njw4")}>{saved.njw4?"NJ W-4 Submitted":"Submit NJ W-4 to QuickBooks"}</Btn>
      </>}
      {activeTab==="em"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>Emergency Contacts</div>
        <div style={{background:C.red+"10",border:"1px solid "+C.red+"33",borderRadius:10,padding:"9px 12px",fontSize:12,color:C.darkL,fontFamily:"sans-serif"}}>Required for all KCDW staff in case of an airport incident.</div>
        {[["Primary","emName","emPhone","emRel","Maria Torres"],["Secondary","emName2","emPhone2","emRel2","Carlos Torres"]].map(([lbl,n,p,r,ph])=>(
          <div key={lbl} style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{fontWeight:700,fontSize:13,fontFamily:"sans-serif"}}>{lbl} Contact</div>
            <SF label="Full Name" field={n} ph={ph}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><SF label="Phone" field={p} type="tel" ph="(973) 555-0900"/><SF label="Relationship" field={r} ph={lbl==="Primary"?"Spouse":"Brother"}/></div>
          </div>
        ))}
        <Btn v={saved.em?"ol":"gr"} disabled={!f.emName||!f.emPhone||!f.emRel} onClick={()=>save("em")}>{saved.em?"Contacts Saved":"Save Emergency Contacts"}</Btn>
      </>}
      {activeTab==="qb"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>QuickBooks Payroll</div>
        <div style={{background:"linear-gradient(135deg,#2CA01C,#1A7A12)",borderRadius:14,padding:"16px",display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:10,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{"📊"}</div>
            <div><div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,color:"#fff"}}>QuickBooks Online Payroll</div><div style={{color:"rgba(255,255,255,.75)",fontSize:12,fontFamily:"sans-serif"}}>{allDone?"Ready to sync":done+"/5 forms complete"}</div></div>
          </div>
          {allDone?<div style={{background:"rgba(255,255,255,.15)",borderRadius:10,padding:"10px 12px"}}>{["All HR forms submitted","Direct deposit configured","Federal + NJ withholding set","Emergency contacts on file"].map(item=><div key={item} style={{color:"#fff",fontSize:12,fontFamily:"sans-serif",marginBottom:2}}>{"✓ "}{item}</div>)}</div>:<div style={{color:"rgba(255,255,255,.8)",fontSize:13,fontFamily:"sans-serif"}}>{5-done} form(s) remaining.</div>}
        </div>
        {[["Automated Payroll","1st and 15th based on logged instruction hours."],["W-2 Filing","Year-end W-2s filed electronically with the IRS."],["NJ State Taxes","NJ income tax, SDI, and UI remitted automatically."],["Revenue Sync","Instruction revenue categorized in QuickBooks automatically."],["PCI Compliant","All payroll data encrypted by Intuit."]].map(([t,d])=>(
          <div key={t} style={{display:"flex",gap:12,padding:"10px 12px",background:C.cream,borderRadius:10,border:"1px solid "+C.tan+"88"}}>
            <div><div style={{fontWeight:700,fontSize:13,color:C.dark,fontFamily:"sans-serif",marginBottom:2}}>{t}</div><div style={{color:"#666",fontSize:12,lineHeight:1.5,fontFamily:"sans-serif"}}>{d}</div></div>
          </div>
        ))}
        <Btn disabled={!allDone}>{allDone?"Sync with QuickBooks":"Complete all forms to enable sync"}</Btn>
      </>}
    </div>
  </div>;
}

function NavDrawer({page,setPage,onClose,isInstructor}){
  const NAV_MEMBER=[{id:"about",l:"About the Club"},{id:"home",l:"Home"},{id:"schedule",l:"Schedule"},{id:"instructors",l:"Instructors"},{id:"aircraft",l:"Aircraft - N36JR"},{id:"hobbs",l:"Log Hobbs"},{id:"billing",l:"Billing"},{id:"account",l:"My Account"}];
  const NAV_INSTR=[{id:"instr_checkouts",l:"Checkouts"},{id:"instr_schedule",l:"My Schedule"},{id:"instr_members",l:"Members"},{id:"instr_employee",l:"HR and Payroll"},{id:"account",l:"My Account"}];
  const nav=isInstructor?NAV_INSTR:NAV_MEMBER;
  return <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:500,display:"flex"}}>
    <div onClick={e=>e.stopPropagation()} style={{width:280,background:C.white,height:"100%",overflowY:"auto",display:"flex",flexDirection:"column"}}>
      <div style={{background:C.dark,padding:"20px 24px 16px"}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#fff"}}>KCDW Flying Club</div>
        <div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",marginTop:4}}>Essex County Airport - KCDW</div>
        {isInstructor&&<div style={{marginTop:8,display:"inline-block",background:C.blue+"25",color:C.amberL,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,fontFamily:"sans-serif",letterSpacing:".06em"}}>INSTRUCTOR</div>}
      </div>
      <div style={{flex:1,paddingTop:8}}>
        {nav.map(n=><button key={n.id} className={"ni"+(page===n.id?" na":"")} onClick={()=>{setPage(n.id);onClose();}}>{n.l}</button>)}
      </div>
      <div style={{padding:"16px 24px",borderTop:"1px solid "+C.tan}}>
        <div style={{color:C.stone,fontSize:11,fontFamily:"sans-serif"}}>KCDW Flying Club - Caldwell, NJ 07006</div>
      </div>
    </div>
  </div>;
}

function requireAuth(Comp,props){
  return <Comp {...props}/>;
}

export default function App(){
  const[auth,setAuth]=useState("guest");
  const[user,setUser]=useState(null);
  const[page,setPage]=useState("about");
  const[drawer,setDrawer]=useState(false);
  const[showLogin,setShowLogin]=useState(false);
  const[checkouts,setCheckouts]=useState([]);
  const[dbInstructors,setDbInstructors]=useState(INSTRUCTORS);
  useEffect(()=>{
    sb("instructors","GET",null,"?order=id.asc").then(r=>{
      if(r&&r.length>0)setDbInstructors(r.map(i=>({id:i.id,name:i.name,cert:i.cert,rate:i.rate,avail:i.avail,init:i.init,col:i.col||"#1A6BB5",bio:i.bio,phone:i.phone,checkoutAuth:i.checkout_auth,photo:i.photo})));
    });
    sb("checkouts","GET",null,"?order=created_at.desc").then(r=>{
      if(r)setCheckouts(r.map(c=>({id:c.id,memberId:c.member_id,memberName:c.member_name,instructorId:c.instructor_id,instructorName:c.instructor_name,date:c.date,hobbsIn:c.hobbs_in,hobbsOut:c.hobbs_out,status:c.status,notes:c.notes||"",declineReason:c.decline_reason||""})));
    });
  },[]);
  const geo=useGeo();
  const{bal,txns,invs,charge,deposit}=useBilling(user?.id);
  const isGuest=auth==="guest";
  const isInstructor=user&&user.role==="instructor";
  const memberCheckout=user?checkouts.find(c=>c.memberId===user.email&&c.status==="approved"):null;
  const memberCheckoutPending=user?checkouts.find(c=>c.memberId===user.email&&c.status==="pending"):null;
  const name=user?user.name:"Guest";

  if(auth==="onboarding")return <><InjectCSS/><div style={{maxWidth:480,margin:"0 auto"}}><OnboardingFlow onDone={async f=>{
  const name=f.firstName+" "+f.lastName;
  const init=(f.firstName[0]||"")+(f.lastName[0]||"");
  const rows=await sb("members","POST",{name,email:f.email,init,role:"member",cert:f.cert,hours:parseFloat(f.hours)||0,phone:f.phone,city:f.city,state:f.state,zip:f.zip,balance:0,status:"active"});
  const id=rows&&rows[0]?rows[0].id:null;
  setUser({id,name,email:f.email,init,role:"member"});
  setAuth("portal");setPage("home");
}}/></div></>;

  const pages={
    about:<AboutPage onJoin={()=>setAuth("onboarding")} onSignIn={()=>setShowLogin(true)} setPage={setPage}/>,
    home:<HomePage setPage={setPage} geo={geo} invs={isGuest?[]:invs} bal={isGuest?null:bal} name={name}/>,
    schedule:isGuest?<ScheduleGate onJoin={()=>setAuth("onboarding")} onSignIn={()=>setShowLogin(true)}/>:<SchedulePage geo={geo} checkoutComplete={!!memberCheckout} checkoutPending={!!memberCheckoutPending}/>,
    instructors:<InstructorsPage/>,
    aircraft:<AircraftPage/>,
    hobbs:isGuest?<ScheduleGate onJoin={()=>setAuth("onboarding")} onSignIn={()=>setShowLogin(true)}/>:requireAuth(HobbsPage,{geo,charge,setPage}),
    billing:isGuest?<ScheduleGate onJoin={()=>setAuth("onboarding")} onSignIn={()=>setShowLogin(true)}/>:requireAuth(BillingPage,{bal,txns,invs,deposit}),
    account:isGuest?<ScheduleGate onJoin={()=>setAuth("onboarding")} onSignIn={()=>setShowLogin(true)}/>:requireAuth(AccountPage,{geo,user}),
    instr_checkouts:isInstructor?<CheckoutTab instructor={user} checkouts={checkouts} setCheckouts={setCheckouts}/>:<div/>,
    instr_schedule:isInstructor?<InstrScheduleTab instructor={user}/>:<div/>,
    instr_members:isInstructor?<MembersTab checkouts={checkouts}/>:<div/>,
    instr_employee:isInstructor?<EmployeeTab instructor={user}/>:<div/>,
  };

  const pendingBadge=isInstructor?checkouts.filter(c=>c.status==="pending"&&c.instructorId===user.instructorId).length:0;

  return <>
    <InjectCSS/>
    <div style={{maxWidth:480,margin:"0 auto",height:"100vh",display:"flex",flexDirection:"column",background:C.bg,overflow:"hidden"}}>
      <div style={{background:C.dark,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setDrawer(true)} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:8,padding:"7px 10px",cursor:"pointer",color:"#fff",fontSize:18,lineHeight:1}}>{"☰"}</button>
          <div>
            <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,color:"#fff"}}>KCDW Flying Club</div>
            {isInstructor&&<div style={{background:C.blue+"25",color:C.amberL,fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:10,fontFamily:"sans-serif",letterSpacing:".06em",display:"inline-block",marginTop:2}}>INSTRUCTOR</div>}
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {!isGuest&&!isInstructor&&<div style={{width:32,height:32,borderRadius:"50%",background:C.blue,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:13,fontFamily:"sans-serif"}}>{user.init}</div>}
          {isGuest&&<button onClick={()=>setShowLogin(true)} style={{background:C.amber,color:"#fff",border:"none",borderRadius:8,padding:"7px 14px",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"sans-serif"}}>Sign In</button>}
          {!isGuest&&<button onClick={()=>{setUser(null);setAuth("guest");setPage("about");}} style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.7)",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:11,fontFamily:"sans-serif"}}>Sign Out</button>}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto"}}>{pages[page]||pages.about}</div>
      <div style={{flexShrink:0,background:C.white,borderTop:"1px solid #e5e7eb",display:"flex",alignItems:"stretch",zIndex:90}}>
        {(isInstructor?[
          {id:"instr_checkouts",ic:"✅",l:"Checkouts",badge:pendingBadge},
          {id:"instr_schedule",ic:"📅",l:"Schedule",badge:0},
          {id:"instr_members",ic:"👥",l:"Members",badge:0},
          {id:"instr_employee",ic:"📋",l:"HR",badge:0},
          {id:"account",ic:"👤",l:"Account",badge:0},
        ]:[
          {id:"about",ic:"🏡",l:"Home",badge:0},
          {id:"schedule",ic:"📅",l:"Schedule",badge:0},
          {id:"aircraft",ic:"✈️",l:"Aircraft",badge:0},
          {id:"instructors",ic:"🎓",l:"Instructors",badge:0},
          {id:"account",ic:"👤",l:isGuest?"Join":"Account",badge:0},
        ]).map(t=>(
          <button key={t.id} onClick={()=>t.id==="account"&&isGuest?setAuth("onboarding"):setPage(t.id)}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,padding:"8px 0 10px",border:"none",background:"transparent",cursor:"pointer",borderTop:"2px solid "+(page===t.id?C.amber:"transparent"),position:"relative"}}>
            <span style={{fontSize:18,lineHeight:1}}>{t.ic}</span>
            <span style={{fontSize:9,fontWeight:page===t.id?700:500,color:page===t.id?C.amber:C.stone,fontFamily:"sans-serif"}}>{t.l}</span>
            {t.badge>0&&<div style={{position:"absolute",top:4,right:"calc(50% - 16px)",width:16,height:16,borderRadius:"50%",background:C.red,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:"#fff",fontSize:9,fontWeight:800}}>{t.badge}</span>
            </div>}
          </button>
        ))}
      </div>
    </div>
    {drawer&&<NavDrawer page={page} setPage={setPage} onClose={()=>setDrawer(false)} isInstructor={isInstructor}/>}
    {showLogin&&<Modal onClose={()=>setShowLogin(false)}>
      <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,marginBottom:16}}>Sign In</div>
      <SignInForm onLogin={u=>{setUser(u);setAuth("portal");setShowLogin(false);setPage(u.role==="instructor"?"instr_checkouts":"home");}} onJoin={()=>{setShowLogin(false);setAuth("onboarding");}}/>
      <button onClick={()=>setShowLogin(false)} style={{marginTop:12,background:"none",border:"none",color:C.stone,cursor:"pointer",fontFamily:"sans-serif",fontSize:13,width:"100%"}}>Cancel</button>
    </Modal>}
  </>;
}
