import { useState, useEffect, useRef, useCallback } from "react";

// ─── Palette & Constants ──────────────────────────────────────────────────────
const C={bg:"#F9FAFB",white:"#FFFFFF",cream:"#FAF7F2",parchment:"#F0EAE0",tan:"#E4D5BC",amber:"#C8852A",amberL:"#E09A40",dark:"#1C1A17",darkM:"#2E2B26",darkL:"#4A4640",stone:"#7A7468",stoneL:"#A89F93",blue:"#1A6BB5",blueP:"#E8F0FB",green:"#4A8C5C",red:"#B84A4A",teal:"#1A7A6B",gold:"#B8860B"};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const RATE_AC=165;
const FUND_AMTS=[500,1000,2000,3000,4000,5000,6000,7000,8000,9000,10000];
const KCDW_LAT=40.8752,KCDW_LNG=-74.2844;
const now=new Date();
const pad=n=>String(n).padStart(2,"0");
const fmtDate=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const addDays=(d,n)=>{const r=new Date(d);r.setDate(r.getDate()+n);return r;};
const t2m=t=>{const[h,m]=t.split(":").map(Number);return h*60+m;};
const fmtH=h=>h===12?"12pm":h>12?`${h-12}pm`:`${h}am`;
const $$=n=>"$"+parseFloat(n).toFixed(2);
const TODAY=fmtDate(now);
// Demo: set checkoutComplete:false to see the locked scheduling experience
const USER_PROFILE={name:"Sarah Mitchell",init:"SM",email:"sarah@kcdw.com",checkoutComplete:false,checkoutDate:null,checkoutInstructor:null,role:"member"};
const MEMBER_PROFILES={"sarah@kcdw.com":{name:"Sarah Mitchell",init:"SM",role:"member",instructorId:null},"torres@kcdw.com":{name:"Capt. Mike Torres",init:"MT",role:"instructor",instructorId:1},"chen@kcdw.com":{name:"Lisa Chen",init:"LC",role:"instructor",instructorId:2}};
const SEED_CHECKOUTS=[{id:"co1",memberId:"sarah@kcdw.com",memberName:"Sarah Mitchell",instructorId:1,instructorName:"Capt. Mike Torres",date:fmtDate(addDays(now,-2)),hobbsIn:"3241.6",hobbsOut:"3243.4",status:"pending",notes:"",declineReason:""}];
const N36JR="data:image/jpeg;base64,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";



function hav(la,lo,la2,lo2){const R=3958.8,dLa=((la2-la)*Math.PI)/180,dLo=((lo2-lo)*Math.PI)/180,a=Math.sin(dLa/2)**2+Math.cos(la*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dLo/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
function useGeo(){
  const[g,setG]=useState({ok:false,dist:null,near:false});
  useEffect(()=>{
    if(!navigator.geolocation)return;
    const cb=p=>{const d=hav(p.coords.latitude,p.coords.longitude,KCDW_LAT,KCDW_LNG);setG({ok:true,dist:d,near:d<=1});};
    navigator.geolocation.getCurrentPosition(cb,()=>{});
  },[]);
  return g;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const INSTRUCTORS=[
  {id:1,name:"Capt. Mike Torres",cert:"CFI/CFII/MEI",rate:85,avail:true,init:"MT",col:C.blue,bio:"15,000+ hrs. Instrument and commercial checkride prep.",phone:"973-555-0811",checkoutAuth:true},
  {id:2,name:"Lisa Chen",cert:"CFI/CFII",rate:75,avail:true,init:"LC",col:C.teal,bio:"Former regional FO. Primary and instrument instruction.",phone:"973-555-0822",checkoutAuth:false},
  {id:3,name:"Ryan Brooks",cert:"CFI",rate:65,avail:false,init:"RB",col:C.stone,bio:"Primary training. On leave.",phone:"973-555-0833",checkoutAuth:false},
];
const INIT_BOOKINGS=[
  {id:1,pilot:"Sarah Mitchell",ac:"N36JR",date:TODAY,start:"08:00",end:"10:30",type:"solo",instr:null},
  {id:2,pilot:"Priya Patel",ac:"N36JR",date:TODAY,start:"13:00",end:"15:00",type:"instruction",instr:"Lisa Chen"},
  {id:3,pilot:"James R.",ac:"N36JR",date:TODAY,start:"16:00",end:"17:30",type:"checkout",instr:"Capt. Mike Torres"},
  {id:4,pilot:"Sarah Mitchell",ac:"N36JR",date:fmtDate(addDays(now,1)),start:"09:00",end:"11:00",type:"solo",instr:null},
];
const SQUAWKS=[
  {id:1,date:"4/24/26",desc:"Right landing light inop.",status:"open",res:"Safe to fly."},
  {id:2,date:"8/15/25",desc:"AMSAFE restraint INOP.",status:"open",res:"Deferred."},
  {id:3,date:"4/27/25",desc:"Pedestal lights inop.",status:"open",res:"Safe to fly."},
  {id:4,date:"1/10/25",desc:"Left tire worn.",status:"closed",res:"Tire replaced."},
];
const REMINDERS=[
  {id:1,name:"Annual Inspection",st:"warning",days:138,last:"10/8/2025"},
  {id:2,name:"AD 2001-06-17",st:"warning",days:138,last:"5/2/2025"},
  {id:3,name:"GFC700 Check",st:"warning",days:138,last:"5/2/2025"},
  {id:4,name:"ELT Inspection",st:"warning",days:138,last:"5/2/2025"},
  {id:5,name:"Oil Change (50-hr)",st:"ok",days:null,hrs:18.4,last:"4/22/2026"},
  {id:6,name:"Pitot-Static 91.411",st:"ok",days:480,last:"9/14/2025"},
  {id:7,name:"VOR Check 91.171",st:"expired",days:-12,last:"5/11/2026"},
];
const PHOTOS=[
  {id:"a",src:N36JR,cap:"N36JR on the ramp at golden hour"},
  {id:"b",src:N36JR,cap:"N36JR — Cessna 172 Skyhawk SP"},
  {id:"c",src:"https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",cap:"Golden hour flight"},
  {id:"d",src:"https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&q=80",cap:"Cockpit — G1000 NXi"},
  {id:"e",src:"https://images.unsplash.com/photo-1553775282-20af80779df7?w=800&q=80",cap:"Switch panel"},
];
const SEED_TXN=[
  {id:"t1",type:"deposit",date:fmtDate(addDays(now,-18)),desc:"Added funds — Credit Card 4242",amt:1000},
  {id:"t2",type:"charge",date:fmtDate(addDays(now,-12)),desc:"Aircraft time N36JR (2.1 hrs)",amt:-346.50},
  {id:"t3",type:"charge",date:fmtDate(addDays(now,-12)),desc:"Instruction — Lisa Chen (2.1 hrs)",amt:-157.50},
  {id:"t4",type:"charge",date:fmtDate(addDays(now,-5)),desc:"Aircraft time N36JR (1.9 hrs)",amt:-313.50},
  {id:"t5",type:"charge",date:fmtDate(addDays(now,-5)),desc:"Monthly membership May 2026",amt:-80},
  {id:"t6",type:"deposit",date:fmtDate(addDays(now,-1)),desc:"Added funds — Bank Account 6789",amt:442.50},
];
const SEED_INV=[
  {id:101,date:fmtDate(addDays(now,-5)),total:393.50,items:[{d:"Aircraft time N36JR",q:"1.9 hrs",r:165,a:313.50},{d:"Monthly membership",q:"May 2026",r:80,a:80}]},
  {id:102,date:fmtDate(addDays(now,-12)),total:504,items:[{d:"Aircraft time N36JR",q:"2.1 hrs",r:165,a:346.50},{d:"Instruction — Lisa Chen",q:"2.1 hrs",r:75,a:157.50}]},
];

// ─── CSS inject ───────────────────────────────────────────────────────────────
function InjectCSS(){
  useEffect(()=>{
    if(document.getElementById("kcdw-css"))return;
    const el=document.createElement("style");
    el.id="kcdw-css";
    el.textContent="*{box-sizing:border-box;margin:0;padding:0}"
      +"@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}"
      +"@keyframes ring{0%{transform:scale(.8);opacity:1}100%{transform:scale(2.2);opacity:0}}"
      +"@keyframes fly{0%{transform:translateX(-140px)}100%{transform:translateX(530px)}}"
      +"@keyframes drift{from{transform:translateX(0)}to{transform:translateX(-80px)}}"
      +".plane{animation:fly 13s linear infinite}"
      +".c1{animation:drift 26s linear infinite}"
      +".c2{animation:drift 36s linear 5s infinite}"
      +".rdot{width:9px;height:9px;border-radius:50%;background:#C8852A;position:relative;flex-shrink:0}"
      +".rdot::after{content:'';position:absolute;inset:0;border-radius:50%;background:#C8852A;animation:ring 1.4s ease-out infinite}"
      +".ni{display:flex;align-items:center;gap:14px;padding:14px 24px;font-size:15px;font-weight:500;color:#444;cursor:pointer;border:none;background:transparent;width:100%;text-align:left;font-family:sans-serif}"
      +".ni:hover{background:#f5f5f5}"
      +".na{color:#1A6BB5!important;font-weight:700!important;background:#E8F0FB!important}"
      +".bb{position:absolute;left:3px;right:3px;border-radius:5px;padding:4px 7px;cursor:pointer;overflow:hidden;z-index:5}"
      +".bb:hover{filter:brightness(1.1)}"
      +"::-webkit-scrollbar{width:4px;height:4px}"
      +"::-webkit-scrollbar-thumb{background:#E4D5BC;border-radius:2px}";
    document.head.appendChild(el);
    return()=>{const s=document.getElementById("kcdw-css");if(s)s.remove();};
  },[]);
  return null;
}

// ─── Atoms ────────────────────────────────────────────────────────────────────
const iSt={width:"100%",border:"1.5px solid #E4D5BC",borderRadius:8,padding:"10px 12px",fontFamily:"sans-serif",fontSize:14,color:"#1C1A17",background:"#fafafa",outline:"none",boxSizing:"border-box"};
function Lbl({children}){return <div style={{color:C.stone,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",fontFamily:"sans-serif",marginBottom:5}}>{children}</div>;}
function Fld({label,children}){return <div style={{display:"flex",flexDirection:"column",gap:4}}><Lbl>{label}</Lbl>{children}</div>;}
function Card({children,style}){return <div style={{background:C.white,borderRadius:14,border:"1px solid #E4D5BC88",boxShadow:"0 1px 8px #0000000a",...style}}>{children}</div>;}
function Bdg({col,children}){return <span style={{display:"inline-flex",alignItems:"center",padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:700,textTransform:"uppercase",background:col+"22",color:col,fontFamily:"sans-serif"}}>{children}</span>;}
function Avt({init,col,sz=38}){return <div style={{width:sz,height:sz,borderRadius:"50%",background:col+"22",border:"2px solid "+col,display:"flex",alignItems:"center",justifyContent:"center",color:col,fontWeight:800,fontSize:sz*.35,flexShrink:0}}>{init}</div>;}
function Btn({onClick,disabled,children,v,style}){
  const s=v==="outline"?{background:C.white,color:C.blue,border:"2px solid "+C.blue}:v==="green"?{background:C.green,color:"#fff",border:"none"}:v==="amber"?{background:C.amber,color:"#fff",border:"none"}:{background:C.blue,color:"#fff",border:"none"};
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

// ─── Billing hook ─────────────────────────────────────────────────────────────
function useBilling(){
  const[bal,setBal]=useState(412.50);
  const[txns,setTxns]=useState(SEED_TXN);
  const[invs,setInvs]=useState(SEED_INV);
  const charge=useCallback((items)=>{
    const total=items.reduce((s,i)=>s+i.a,0);
    const inv={id:Date.now(),date:TODAY,total,items};
    setInvs(p=>[inv,...p]);
    setBal(b=>+(b-total).toFixed(2));
    setTxns(p=>[...items.map(it=>({id:"t"+Date.now()+Math.random(),type:"charge",date:TODAY,desc:it.d,amt:-it.a})),...p]);
    return inv;
  },[]);
  const deposit=useCallback((amt,m,last4)=>{
    setBal(b=>+(b+amt).toFixed(2));
    setTxns(p=>[{id:"t"+Date.now(),type:"deposit",date:TODAY,desc:"Added funds — "+(m==="ach"?"Bank Account":"Credit Card")+" "+last4,amt},...p]);
  },[]);
  return{bal,txns,invs,charge,deposit};
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREENS
// ─────────────────────────────────────────────────────────────────────────────


// ─── SignInForm ───────────────────────────────────────────────────────────────
function SignInForm({onLogin,onJoin}){
  const[email,setEmail]=useState("");
  const[pw,setPw]=useState("");
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState("");
  const go=()=>{
    if(!email||!pw){setErr("Enter email and password.");return;}
    setLoading(true);setErr("");
    setTimeout(()=>{
      if(email.toLowerCase().includes("new")){onJoin();setLoading(false);return;}
      const p=MEMBER_PROFILES[email.toLowerCase()];
      onLogin(p||{name:"Sarah Mitchell",email,init:"SM",role:"member"});
      setLoading(false);
    },1000);
  };
  return <div style={{display:"flex",flexDirection:"column",gap:14}}>
    {err&&<div style={{background:C.red+"12",border:"1px solid "+C.red+"44",borderRadius:10,padding:"10px 14px",color:C.red,fontSize:13,fontFamily:"sans-serif"}}>{err}</div>}
    <Fld label="Email Address"><input style={iSt} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/></Fld>
    <Fld label="Password"><input style={iSt} type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/></Fld>
    <Btn onClick={go} disabled={loading}>{loading?<Spin/>:"Sign In →"}</Btn>
    <div style={{display:"flex",alignItems:"center",gap:12}}><div style={{flex:1,height:1,background:C.tan}}/><span style={{color:C.stone,fontSize:13}}>or</span><div style={{flex:1,height:1,background:C.tan}}/></div>
    <Btn v="outline" onClick={onJoin}>Join the Club — Create Account</Btn>
    <div style={{background:C.parchment,borderRadius:8,padding:"10px 12px",display:"flex",flexDirection:"column",gap:6}}>
      <div style={{color:C.stone,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",fontFamily:"sans-serif"}}>Demo Accounts</div>
      {[["sarah@example.com","Member — checkout pending"],["torres@kcdw.com","Instructor — Capt. Torres"],["chen@kcdw.com","Instructor — Lisa Chen"]].map(([e,l])=>(
        <button key={e} onClick={()=>{setEmail(e);setPw("demo");}} style={{background:"none",border:"none",cursor:"pointer",textAlign:"left",padding:"2px 0",display:"flex",justifyContent:"space-between",gap:8}}>
          <span style={{color:C.blue,fontSize:11,fontFamily:"sans-serif",textDecoration:"underline"}}>{e}</span>
          <span style={{color:C.stone,fontSize:10,fontFamily:"sans-serif"}}>{l}</span>
        </button>
      ))}
    </div>
  </div>;
}

function LoginScreen({onLogin,onJoin}){
  return <div style={{minHeight:"100vh",background:C.dark,fontFamily:"sans-serif"}}>
    <div style={{position:"relative",height:240,overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,#0a1628,#1a2d4a 45%,#c77f3a 88%,#e8995a)"}}/>
      <svg style={{position:"absolute",bottom:0,width:"100%"}} viewBox="0 0 480 70" preserveAspectRatio="none"><path d="M0 70L0 45Q80 30 160 38Q240 46 320 25Q400 4 480 18L480 70Z" fill="#0a1420"/></svg>
      <div style={{position:"absolute",top:"38%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
        <div style={{width:52,height:52,borderRadius:12,background:"linear-gradient(135deg,#C8852A,#8B1A2F)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>✈</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#fff",whiteSpace:"nowrap"}}>KCDW Flying Club</div>
        <div style={{color:"rgba(255,255,255,.6)",fontSize:11,letterSpacing:".1em"}}>CALDWELL, NEW JERSEY</div>
      </div>
    </div>
    <div style={{background:C.cream,borderRadius:"24px 24px 0 0",marginTop:-16,padding:"28px 24px 40px"}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:C.dark,marginBottom:18}}>Member Sign In</div>
      <SignInForm onLogin={onLogin} onJoin={onJoin}/>
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
  const CERTS=["Student Pilot","Private Pilot","Instrument Rating","Commercial","ATP","None — I want to learn!"];
  const RATS=["Instrument (IFR)","Multi-Engine","Commercial","CFI","CFII","G1000 NXi"];
  const STEPS=["Personal Info","Address","Aviation Background","Create Password","Rental Agreement","Documents","Membership & Terms"];
  const RA_ITEMS=[
    ["1. ELIGIBILITY","Valid FAA certificate and medical required. Club checkout with CFI required before solo rental. 3 T&Gs within 90 days for passengers. IFR currency per FAR 61.57 for IFR ops."],
    ["2. PRE-FLIGHT","Thorough pre-flight per POH required. Do not fly with any airworthiness concern. Report all discrepancies immediately."],
    ["3. HOBBS & BILLING","Hobbs recorded before/after every flight. Photos submitted within 24 hrs via portal. Rate: $165.00/hr wet. Rates subject to 30 days notice."],
    ["4. INSURANCE","Hull and liability coverage provided. Renter responsible for $5,000 deductible for damage. Personal renter insurance strongly recommended."],
    ["5. GEOGRAPHIC LIMITS","Contiguous 48 states unless written approval. Class B requires endorsement or IR. Aerobatics, compensation, and instruction to non-members prohibited."],
    ["6. FUEL","Wet rate includes fuel at KCDW FBO. Away-field receipts required for reimbursement. 100LL only."],
    ["7. ACCIDENTS","Any accident or incident reported to club within 2 hours. Full cooperation with FAA/NTSB/insurance required."],
    ["8. CANCELLATIONS","Less than 2 hours notice may incur 1-hour minimum charge. No-show billed 1-hour minimum. Weather cancellations with notice not subject to fees."],
    ["9. RENTER DUTIES","Operate safely and lawfully. Return with minimum fuel. Secure with control lock, chocks, and tie-downs. Leave cockpit clean."],
    ["10. GOVERNING LAW","Governed by laws of New Jersey. Disputes in Essex County courts. This is the entire agreement between renter and KCDW Flying Club."],
  ];
  const pwStr=p=>{if(!p)return 0;let s=0;if(p.length>=8)s++;if(/[A-Z]/.test(p))s++;if(/[0-9]/.test(p))s++;if(/[^A-Za-z0-9]/.test(p))s++;return s;};
  const pw=pwStr(f.password);
  const pwCol=pw<=1?C.rd:pw===2?C.amb:pw===3?C.bl:C.gr;
  const pwLbl=["","Weak","Fair","Good","Strong"][pw];

  const DocUpload=({label,required,uploadedKey,imgKey,htmlId})=>{
    const uploaded=f[uploadedKey],img=f[imgKey];
    return <div style={{display:"flex",flexDirection:"column",gap:8}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontWeight:700,fontSize:14,fontFamily:"sans-serif"}}>{label}</div><div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",marginTop:2}}>{required?"Required":"Optional"}</div></div>
        {uploaded&&<Bdg col={C.green}>Uploaded ✓</Bdg>}
      </div>
      <input type="file" accept="image/*,application/pdf" id={htmlId} style={{display:"none"}} onChange={e=>{
        const file=e.target.files[0];if(!file)return;
        const reader=new FileReader();
        reader.onload=ev=>u({[uploadedKey]:true,[imgKey]:ev.target.result});
        reader.readAsDataURL(file);
      }}/>
      {img&&<img src={img} alt={label} style={{width:"100%",borderRadius:10,maxHeight:140,objectFit:"cover",border:"2px solid "+C.green}}/>}
      <label htmlFor={htmlId} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,border:"2px dashed "+(uploaded?C.green:C.tan),borderRadius:10,padding:"16px",cursor:"pointer",background:uploaded?C.green+"0a":"#fafafa"}}>
        <span style={{fontSize:20}}>{uploaded?"✅":required?"🪪":"✈️"}</span>
        <span style={{fontSize:13,fontWeight:600,color:uploaded?C.green:C.stone,fontFamily:"sans-serif"}}>{uploaded?"Tap to replace":"Tap to upload "+label}</span>
      </label>
    </div>;
  };

  return <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",fontFamily:"sans-serif"}}>
    <div style={{background:C.dark,padding:"14px 18px 12px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:"#fff"}}>Join KCDW Flying Club</div>
        <span style={{color:C.stone,fontSize:12,fontFamily:"sans-serif"}}>Step {step} of {T}</span>
      </div>
      <div style={{height:4,background:"rgba(255,255,255,.12)",borderRadius:2}}><div style={{height:"100%",width:pct+"%",background:C.amb,borderRadius:2,transition:"width .3s"}}/></div>
      <div style={{display:"flex",overflowX:"auto",gap:0,marginTop:8}}>
        {STEPS.map((s,i)=><div key={i} style={{fontSize:9,color:i+1===step?C.amberL:i+1<step?C.gr:C.stone,fontFamily:"sans-serif",fontWeight:i+1===step?700:400,whiteSpace:"nowrap",padding:"2px 6px",borderBottom:"2px solid "+(i+1===step?C.amb:i+1<step?C.gr:"transparent")}}>{i+1<step?"✓ ":""}{s}</div>)}
      </div>
    </div>
    <div style={{flex:1,padding:"20px 18px 100px",display:"flex",flexDirection:"column",gap:14,maxWidth:480,margin:"0 auto",width:"100%"}}>
      {step===1&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Personal Information</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Fld label="First Name"><input style={iSt} value={f.firstName} onChange={e=>u({firstName:e.target.value})} placeholder="Jane"/></Fld>
          <Fld label="Last Name"><input style={iSt} value={f.lastName} onChange={e=>u({lastName:e.target.value})} placeholder="Smith"/></Fld>
        </div>
        <Fld label="Email Address"><input style={iSt} type="email" value={f.email} onChange={e=>u({email:e.target.value})} placeholder="jane@example.com"/></Fld>
        <Fld label="Phone Number"><input style={iSt} type="tel" value={f.phone} onChange={e=>u({phone:e.target.value})} placeholder="(973) 555-0100"/></Fld>
        <Fld label="Instagram (optional)"><input style={iSt} value={f.instagram} onChange={e=>u({instagram:e.target.value})} placeholder="@username"/></Fld>
        <Fld label="How did you hear about us?"><input style={iSt} value={f.referral} onChange={e=>u({referral:e.target.value})} placeholder="Friend, Instagram, Google…"/></Fld>
      </>}
      {step===2&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Home Address</div>
        <Fld label="Street Address"><input style={iSt} value={f.addr1} onChange={e=>u({addr1:e.target.value})} placeholder="123 Main St"/></Fld>
        <Fld label="Apt / Suite (optional)"><input style={iSt} value={f.addr2} onChange={e=>u({addr2:e.target.value})} placeholder="Apt 4B"/></Fld>
        <Fld label="City"><input style={iSt} value={f.city} onChange={e=>u({city:e.target.value})} placeholder="Caldwell"/></Fld>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Fld label="State"><input style={iSt} maxLength={2} value={f.state} onChange={e=>u({state:e.target.value.toUpperCase()})} placeholder="NJ"/></Fld>
          <Fld label="ZIP Code"><input style={iSt} maxLength={5} value={f.zip} onChange={e=>u({zip:e.target.value.replace(/[^0-9]/g,"")})} placeholder="07006"/></Fld>
        </div>
      </>}
      {step===3&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Aviation Background</div>
        <Fld label="Pilot Certificate">
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {CERTS.map(c=><button key={c} onClick={()=>u({cert:c})} style={{padding:"8px 14px",borderRadius:20,cursor:"pointer",fontWeight:600,fontSize:12,fontFamily:"sans-serif",border:"1.5px solid "+(f.cert===c?C.blue:C.tan),background:f.cert===c?C.blueP:C.white,color:f.cert===c?C.blue:C.stone}}>{c}</button>)}
          </div>
        </Fld>
        <Fld label="Ratings / Endorsements">
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {RATS.map(r=>{const on=f.ratings.includes(r);return <button key={r} onClick={()=>u({ratings:on?f.ratings.filter(x=>x!==r):[...f.ratings,r]})} style={{padding:"8px 14px",borderRadius:20,cursor:"pointer",fontWeight:600,fontSize:12,fontFamily:"sans-serif",border:"1.5px solid "+(on?C.teal:C.tan),background:on?C.teal+"12":C.white,color:on?C.teal:C.stone}}>{r}</button>;})}
          </div>
        </Fld>
        <Fld label="Total Flight Hours"><input style={iSt} type="number" min="0" value={f.hours} onChange={e=>u({hours:e.target.value})} placeholder="0"/></Fld>
        <label style={{display:"flex",gap:10,alignItems:"center",cursor:"pointer"}}><input type="checkbox" checked={f.marketing} onChange={e=>u({marketing:e.target.checked})} style={{width:18,height:18,accentColor:C.blue}}/><span style={{fontSize:13,fontFamily:"sans-serif"}}>Send me club news, flight tips, and event updates.</span></label>
      </>}
      {step===4&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Create Your Password</div>
        <Fld label="Password"><input style={iSt} type="password" value={f.password} onChange={e=>u({password:e.target.value})} placeholder="At least 8 characters"/></Fld>
        {f.password&&<div>
          <div style={{height:5,background:"#f3f4f6",borderRadius:3,overflow:"hidden",marginBottom:5}}><div style={{height:"100%",width:(pw/4*100)+"%",background:pwCol,borderRadius:3,transition:"width .3s"}}/></div>
          <div style={{fontSize:12,color:pwCol,fontWeight:700,fontFamily:"sans-serif"}}>{pwLbl}</div>
        </div>}
        <Fld label="Confirm Password"><input style={iSt} type="password" value={f.confirm} onChange={e=>u({confirm:e.target.value})} placeholder="Re-enter password"/></Fld>
        {f.confirm&&f.password!==f.confirm&&<div style={{color:C.red,fontSize:12,fontFamily:"sans-serif"}}>Passwords do not match.</div>}
      </>}
      {step===5&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Rental Agreement</div>
        <div style={{background:C.blueP,border:"1px solid "+C.blue+"33",borderRadius:10,padding:"10px 14px",fontSize:12,color:C.blue,fontFamily:"sans-serif",lineHeight:1.5}}>Please read the full rental agreement and acknowledge each section below. This is a legal agreement between you and KCDW Flying Club.</div>
        <div style={{background:C.white,border:"1px solid "+C.tan,borderRadius:12,padding:"14px",maxHeight:260,overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
          {RA_ITEMS.map(([title,text])=><div key={title}><div style={{fontWeight:700,fontSize:12,fontFamily:"sans-serif",marginBottom:3}}>{title}</div><div style={{color:C.darkL,fontSize:12,lineHeight:1.7,fontFamily:"sans-serif"}}>{text}</div></div>)}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[["rental1","I confirm I hold the required pilot certificate and medical, or I am a student under CFI supervision."],["rental2","I agree to conduct pre-flight inspections per the POH and will not fly with any airworthiness concern."],["rental3","I agree to record Hobbs times and submit photos within 24 hours of each flight at $165/hr wet."],["rental4","I understand I am liable for the $5,000 insurance deductible for any damage during my operation."],["rental5","I agree to all geographic restrictions and will report any accident or incident within 2 hours."]].map(([key,text])=>(
            <label key={key} style={{display:"flex",gap:10,alignItems:"flex-start",cursor:"pointer",padding:"10px 12px",background:f[key]?C.green+"0a":C.parch,borderRadius:10,border:"1.5px solid "+(f[key]?C.green:C.tan)}}>
              <input type="checkbox" checked={f[key]} onChange={e=>u({[key]:e.target.checked})} style={{width:18,height:18,marginTop:2,accentColor:C.green,flexShrink:0}}/>
              <span style={{fontSize:12,lineHeight:1.5,fontFamily:"sans-serif",color:C.darkL}}>{text}</span>
            </label>
          ))}
        </div>
      </>}
      {step===6&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Upload Your Documents</div>
        <div style={{background:C.blueP,border:"1px solid "+C.blue+"33",borderRadius:10,padding:"10px 14px",fontSize:12,color:C.blue,fontFamily:"sans-serif",lineHeight:1.5}}>We collect these to verify your identity and qualifications. Files are encrypted and stored securely.</div>
        <DocUpload label="Driver's License" required={true} uploadedKey="dlUploaded" imgKey="dlImg" htmlId="dl-up"/>
        <DocUpload label="Pilot Certificate" required={false} uploadedKey="pilotCertUploaded" imgKey="pilotCertImg" htmlId="cert-up"/>
        {(f.cert==="Student Pilot"||f.cert==="None — I want to learn!")&&<div style={{background:C.amb+"12",border:"1px solid "+C.amb+"33",borderRadius:8,padding:"8px 12px",fontSize:12,color:C.darkL,fontFamily:"sans-serif",lineHeight:1.5}}>No pilot certificate yet? Skip this — our instructors will help you earn yours!</div>}
        <div style={{background:C.parch,borderRadius:10,padding:"11px 14px",fontSize:12,color:C.stone,lineHeight:1.6,fontFamily:"sans-serif"}}>🔒 Documents are encrypted and accessible only to authorized club administrators.</div>
      </>}
      {step===7&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Almost there! ✈️</div>
        <div style={{background:C.dark,borderRadius:16,padding:"18px 18px 16px",display:"flex",flexDirection:"column",gap:8}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:"#fff",marginBottom:4}}>KCDW Flying Club Membership</div>
          {[["Monthly Dues","$80/month",C.amberL],["Aircraft Rate","$165/hr wet",C.amberL],["Initiation Fee","$0",C.green],["Membership Commitment","Month-to-month",C.green]].map(([l,v,vc])=><div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,.07)"}}><span style={{color:C.stone,fontSize:13,fontFamily:"sans-serif"}}>{l}</span><span style={{color:vc,fontWeight:700,fontSize:13,fontFamily:"sans-serif"}}>{v}</span></div>)}
        </div>
        <Card style={{padding:16}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,marginBottom:10}}>Membership Summary</div>
          <div style={{color:"#555",fontSize:13,lineHeight:1.8,fontFamily:"sans-serif"}}><strong>{f.firstName} {f.lastName}</strong> · {f.cert}{f.ratings.length>0?" · "+f.ratings.join(", "):""}<br/>{f.hours?f.hours+" total hours · ":""}{f.email}</div>
        </Card>
        <label style={{display:"flex",gap:10,alignItems:"flex-start",cursor:"pointer",padding:"12px 14px",background:f.waiver?C.green+"0a":C.parch,borderRadius:10,border:"1.5px solid "+(f.waiver?C.green:C.tan)}}>
          <input type="checkbox" checked={f.waiver} onChange={e=>u({waiver:e.target.checked})} style={{width:18,height:18,marginTop:2,accentColor:C.green,flexShrink:0}}/>
          <span style={{fontSize:12,lineHeight:1.5,fontFamily:"sans-serif",color:C.darkL}}>I have read and agree to the KCDW Flying Club Rental Agreement, Release of Liability, and Member Handbook. I understand the risks of general aviation.</span>
        </label>
        <label style={{display:"flex",gap:10,alignItems:"flex-start",cursor:"pointer",padding:"12px 14px",background:f.terms?C.blue+"0a":C.parch,borderRadius:10,border:"1.5px solid "+(f.terms?C.blue:C.tan)}}>
          <input type="checkbox" checked={f.terms} onChange={e=>u({terms:e.target.checked})} style={{width:18,height:18,marginTop:2,accentColor:C.blue,flexShrink:0}}/>
          <span style={{fontSize:12,lineHeight:1.5,fontFamily:"sans-serif",color:C.darkL}}>I authorize KCDW Flying Club to charge my payment method on file for monthly dues ($80) and flight time at the current Hobbs rate via Stripe.</span>
        </label>
      </>}
    </div>
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.white,borderTop:"1px solid "+C.tan,padding:"14px 18px",display:"flex",gap:10,zIndex:100}}>
      {step>1&&<Btn v="ol" style={{flex:1}} onClick={()=>setStep(s=>s-1)}>← Back</Btn>}
      {step<T?<Btn style={{flex:2}} disabled={!ok()} onClick={()=>setStep(s=>s+1)}>Continue →</Btn>:<Btn style={{flex:2}} disabled={!ok()} onClick={()=>onDone(f)}>Submit Application ✓</Btn>}
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
    <div style={{position:"relative",height:320,overflow:"hidden",flexShrink:0}}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,#0a1628 0%,#1a2d4a 30%,#2d4a6b 55%,#c77f3a 80%,#e8995a 100%)"}}/>
      <img src={N36JR} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 55%",opacity:.25}}/>
      <div className="c1" style={{position:"absolute",top:"15%",display:"flex",gap:40,opacity:.4}}>{[90,130,70,110].map((w,i)=><div key={i} style={{width:w,height:24,background:"rgba(255,255,255,.15)",borderRadius:30,flexShrink:0,filter:"blur(3px)"}}/>)}</div>
      <div className="plane" style={{position:"absolute",top:"32%",left:0}}>
        <svg viewBox="0 0 155 45" width="145" height="43"><ellipse cx="77" cy="27" rx="56" ry="6.5" fill="#e8e4dc"/><path d="M133 25Q150 27 133 29Z" fill="#d4cfc7"/><path d="M58 25Q63 9 92 11Q102 12 92 25Z" fill="#ddd8d0"/><path d="M58 29Q63 45 88 43Q98 42 88 29Z" fill="#d0cbc3"/><path d="M22 24Q26 18 40 19Q44 20 38 25Z" fill="#d4cfc7"/><path d="M22 30Q26 37 40 35Q44 34 38 29Z" fill="#cac5bd"/><ellipse cx="97" cy="25" rx="5" ry="3" fill="#7bb8d4" opacity=".9"/><ellipse cx="107" cy="25" rx="5" ry="3" fill="#7bb8d4" opacity=".9"/><path d="M34 26Q78 25.5 133 26.5" stroke="#8B1A2F" strokeWidth="2" fill="none" opacity=".7"/></svg>
      </div>
      <div style={{position:"absolute",top:14,right:14,background:"rgba(0,0,0,.5)",border:"1px solid rgba(255,255,255,.2)",borderRadius:20,padding:"5px 12px",display:"flex",alignItems:"center",gap:6}}><div style={{width:7,height:7,borderRadius:"50%",background:C.green,boxShadow:"0 0 6px "+C.green}}/><span style={{color:"#fff",fontSize:11,fontWeight:700,letterSpacing:".08em",fontFamily:"sans-serif"}}>KCDW VFR</span></div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0 22px 22px",display:"flex",flexDirection:"column",gap:8}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:"#fff",lineHeight:1.2,textShadow:"0 2px 20px rgba(0,0,0,.4)"}}>{greet},<br/><em style={{color:C.amberL}}>{name}.</em></div>
        <div style={{color:"rgba(255,255,255,.65)",fontSize:13,fontFamily:"sans-serif",marginBottom:10}}>{now.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})} · Essex County Airport</div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setPage("schedule")} style={{background:"linear-gradient(135deg,#1A6BB5,#1044A0)",color:"#fff",border:"none",borderRadius:12,padding:"11px 18px",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"sans-serif"}}>📅 Book a Flight</button>
          <button onClick={()=>setPage("hobbs")} style={{background:"rgba(255,255,255,.15)",color:"#fff",border:"1px solid rgba(255,255,255,.3)",borderRadius:12,padding:"11px 18px",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"sans-serif"}}>📷 Log Hobbs</button>
        </div>
      </div>
    </div>
    <div style={{background:C.dark,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",borderBottom:"2px solid "+C.amber+"44"}}>
      {[["Hours (90d)","8.4 hrs","🕐"],["Total Hours","124.5 hrs","✈️"],["Balance",bal!==null?$$(bal):"--","💳"]].map(([l,v,ic],i)=>(
        <div key={l} style={{padding:"12px 8px",borderRight:i<2?"1px solid rgba(255,255,255,.07)":undefined,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <span style={{fontSize:15}}>{ic}</span>
          <span style={{color:C.amberL,fontSize:15,fontWeight:700,fontFamily:"Georgia,serif"}}>{v}</span>
          <span style={{color:C.stone,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",fontFamily:"sans-serif"}}>{l}</span>
        </div>
      ))}
    </div>
    <div style={{padding:"14px 14px 0",display:"flex",flexDirection:"column",gap:12}}>
      {geo.near&&<div style={{background:C.amber+"15",border:"1.5px solid "+C.amber+"55",borderRadius:14,padding:"12px 14px",display:"flex",gap:12,alignItems:"center"}}><div className="rdot"/><div style={{flex:1}}><div style={{color:C.amber,fontWeight:700,fontSize:14,fontFamily:"sans-serif"}}>You are at KCDW!</div><div style={{color:C.darkL,fontSize:12,marginTop:2,fontFamily:"sans-serif"}}>Log your Hobbs before and after your flight.</div></div><button onClick={()=>setPage("hobbs")} style={{background:C.amber,color:"#fff",border:"none",borderRadius:8,padding:"7px 11px",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"sans-serif",flexShrink:0}}>Log Now</button></div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <button onClick={()=>setPage("schedule")} style={{background:C.blue,color:"#fff",border:"none",borderRadius:10,padding:"14px 12px",textAlign:"left",cursor:"pointer",display:"flex",flexDirection:"column",gap:3,fontFamily:"sans-serif"}}><span style={{fontSize:20}}>📅</span><span style={{fontSize:14,fontWeight:700}}>Schedule</span><span style={{fontSize:11,opacity:.8}}>Book flights</span></button>
        <button onClick={()=>setPage("hobbs")} style={{background:C.green,color:"#fff",border:"none",borderRadius:10,padding:"14px 12px",textAlign:"left",cursor:"pointer",display:"flex",flexDirection:"column",gap:3,fontFamily:"sans-serif"}}><span style={{fontSize:20}}>📷</span><span style={{fontSize:14,fontWeight:700}}>Log Hobbs</span><span style={{fontSize:11,opacity:.8}}>{geo.near?"At airport!":"Submit & bill"}</span></button>
      </div>
      <Card style={{padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:600}}>Proficiency Status</div><Bdg col={C.green}>✓ Current</Bdg></div>
        <div style={{height:7,background:"#f3f4f6",borderRadius:4,overflow:"hidden",marginBottom:7}}><div style={{height:"100%",width:pct+"%",borderRadius:4,background:pct>75?"linear-gradient(90deg,"+C.amber+","+C.red+")":"linear-gradient(90deg,"+C.green+","+C.amberL+")"}}/></div>
        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.stone,fontSize:12,fontFamily:"sans-serif"}}>Day {days} of 90</span><span style={{color:pct>75?C.red:C.green,fontSize:12,fontWeight:700,fontFamily:"sans-serif"}}>{90-days} days left</span></div>
      </Card>
      <Card style={{padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:600}}>Upcoming Flights</div><button onClick={()=>setPage("schedule")} style={{background:"none",border:"none",color:C.blue,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif"}}>View all →</button></div>
        {upcoming.length===0?<span style={{color:C.stone,fontFamily:"sans-serif",fontSize:13}}>No upcoming flights.</span>:upcoming.map(b=>(
          <div key={b.id} style={{display:"flex",gap:12,alignItems:"center",padding:"9px 0",borderBottom:"1px solid "+C.tan+"55"}}>
            <div style={{width:42,height:42,borderRadius:10,background:C.blue+"15",border:"1px solid "+C.blue+"33",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:C.blue,fontSize:9,fontWeight:700,fontFamily:"sans-serif"}}>{new Date(b.date+"T12:00").toLocaleDateString("en-US",{month:"short"}).toUpperCase()}</span><span style={{fontSize:18,fontWeight:700,fontFamily:"Georgia,serif",lineHeight:1}}>{new Date(b.date+"T12:00").getDate()}</span></div>
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,fontFamily:"sans-serif"}}>{b.ac} · {b.type}</div><div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",marginTop:1}}>{b.start}–{b.end}</div></div>
            <Bdg col={C.green}>Confirmed</Bdg>
          </div>
        ))}
      </Card>
      {recent&&<Card style={{padding:16,marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:600}}>Recent Charge</div><button onClick={()=>setPage("billing")} style={{background:"none",border:"none",color:C.blue,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif"}}>View All →</button></div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:600,fontSize:14,fontFamily:"sans-serif"}}>Invoice #{recent.id}</div><div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif"}}>{recent.date}</div></div><div style={{textAlign:"right"}}><div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>{$$(recent.total)}</div><Bdg col={C.green}>Paid</Bdg></div></div>
      </Card>}
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
  useEffect(()=>{const upd=()=>{const n=new Date(),m=n.getHours()*60+n.getMinutes();setNowTop(m<DAY_START*60||m>DAY_END*60?null:((m-DAY_START*60)/((DAY_END-DAY_START)*60))*100);};upd();const id=setInterval(upd,60000);return()=>clearInterval(id);},[]);
  const submit=()=>{setBookings(p=>[...p,{id:Date.now(),pilot:"Sarah Mitchell",ac:"N36JR",date,...form}]);setDone(true);};
  return <div style={{display:"flex",flexDirection:"column",height:"100%",background:"#f9fafb"}}>
    <div style={{padding:"12px 14px 8px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span style={{fontSize:20,fontWeight:700,fontFamily:"Georgia,serif"}}>Schedule</span><button onClick={()=>{setForm({start:"09:00",end:"11:00",type:"solo",instr:"",notes:""});setDone(false);setModal(true);}} style={{background:C.blue,color:"#fff",border:"none",borderRadius:7,padding:"8px 14px",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"sans-serif"}}>+ New</button></div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",border:"1.5px solid #d1d5db",borderRadius:8,background:C.white,padding:"8px 12px",marginBottom:8}}><button onClick={()=>nav(-1)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:C.blue,padding:"0 4px"}}>‹</button><span style={{fontSize:14,fontWeight:600,fontFamily:"sans-serif"}}>{isToday?"Today — ":""}{new Date(date+"T12:00").toLocaleDateString("en-US",{month:"long",day:"numeric"})}</span><button onClick={()=>nav(1)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:C.blue,padding:"0 4px"}}>›</button></div>
      <div style={{background:C.white,border:"1px solid #e5e7eb",borderRadius:7,padding:"6px 12px",display:"flex",gap:8,marginBottom:8}}><span style={{color:C.green,fontSize:11,fontWeight:800,flexShrink:0,fontFamily:"sans-serif"}}>KCDW VFR</span><span style={{fontSize:10,fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>AUTO 00000KT 10SM CLR 24/M03 A3012</span></div>
    </div>
    <div style={{flex:1,overflow:"auto",borderTop:"1px solid #e5e7eb"}}>
      <div style={{display:"flex",minWidth:200}}>
        <div style={{width:46,flexShrink:0,borderRight:"1px solid #e5e7eb",position:"sticky",left:0,background:"#f9fafb",zIndex:10}}><div style={{height:52,borderBottom:"2px solid #e5e7eb"}}/>{hrs.map(h=><div key={h} style={{height:HR_H,display:"flex",alignItems:"flex-start",justifyContent:"flex-end",paddingRight:6,paddingTop:2,color:"#9ca3af",fontSize:9,fontFamily:"sans-serif",borderBottom:"1px solid #f3f4f6"}}>{fmtH(h)}</div>)}</div>
        <div style={{flex:1,minWidth:150}}>
          <div style={{height:52,borderBottom:"2px solid #e5e7eb",padding:"8px",background:C.white,position:"sticky",top:0,zIndex:9}}><div style={{height:3,borderRadius:2,background:C.green,marginBottom:4}}/><span style={{fontSize:14,fontWeight:800,fontFamily:"sans-serif",display:"block"}}>N36JR</span><span style={{color:"#6b7280",fontSize:10,fontFamily:"sans-serif"}}>Cessna 172 SP</span></div>
          <div style={{position:"relative",height:(DAY_END-DAY_START)*HR_H}} onClick={e=>{if(e.target.closest(".bb"))return;const rect=e.currentTarget.getBoundingClientRect();const relY=e.clientY-rect.top;const mins=DAY_START*60+(relY/HR_H)*60;const hr=Math.floor(mins/60),mn=mins%60<30?0:30;const s=`${pad(hr)}:${pad(mn)}`;const eH=hr+(mn===30?1:1),eMn=mn===30?0:30;setForm(p=>({...p,start:s,end:`${pad(eH)}:${pad(eMn)}`,instr:"",notes:""}));setDone(false);setModal(true);}}>
            {hrs.map(h=><div key={h} style={{position:"absolute",top:(h-DAY_START)*HR_H,left:0,right:0,height:HR_H,borderBottom:"1px solid #f3f4f6",cursor:"crosshair"}}><div style={{position:"absolute",left:0,right:0,top:30,borderTop:"1px dashed #f3f4f6"}}/></div>)}
            {isToday&&nowTop!==null&&<div style={{position:"absolute",left:0,right:0,top:nowTop+"%",zIndex:8,display:"flex",alignItems:"center",pointerEvents:"none"}}><div style={{width:7,height:7,borderRadius:"50%",background:"#EF4444",marginLeft:-3}}/><div style={{flex:1,height:1.5,background:"#EF4444",opacity:.8}}/></div>}
            {shown.filter(b=>b.ac==="N36JR").map(b=>{const{top,height}=geo2(b);const{bg,br}=bColor(b.type);const mine=b.pilot==="Sarah Mitchell";return <div key={b.id} className="bb" onClick={e=>{e.stopPropagation();setDetailB(b);}} style={{top,height,background:bg,border:"1.5px solid "+br,borderLeft:"4px solid "+br,outline:mine?"2px solid "+C.amberL:"none",outlineOffset:1}}><span style={{color:"#fff",fontSize:11,fontWeight:700,display:"block",lineHeight:1.2}}>{b.start} {b.pilot.split(" ")[0]}</span>{height>44&&<span style={{color:"#fff",fontSize:10,opacity:.8}}>{b.type}</span>}</div>;})}
          </div>
        </div>
      </div>
    </div>
    <div style={{padding:"7px 14px",borderTop:"1px solid #e5e7eb",background:C.white,display:"flex",gap:12}}>{[["Solo",C.blue],["Instruction","#1A4A8A"],["Checkout",C.gold]].map(([l,c])=><div key={l} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:3,height:11,borderRadius:2,background:c}}/><span style={{color:"#6b7280",fontSize:11,fontFamily:"sans-serif"}}>{l}</span></div>)}</div>
    {detailB&&<Modal onClose={()=>setDetailB(null)}>
      <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,marginBottom:14}}>Reservation</div>
      <div style={{background:bColor(detailB.type).bg,border:"1.5px solid "+bColor(detailB.type).br,borderLeft:"5px solid "+bColor(detailB.type).br,borderRadius:10,padding:"12px 14px",marginBottom:14}}><div style={{color:"#fff",fontWeight:800,fontSize:15}}>{detailB.pilot}</div><div style={{color:"#fff",fontSize:13,opacity:.85,marginTop:3}}>{detailB.ac} · {detailB.start}–{detailB.end} · {detailB.type}</div></div>
      <Btn v="outline" onClick={()=>setDetailB(null)}>Close</Btn>
    </Modal>}
    {modal&&<Modal onClose={()=>setModal(false)}>
      {done?<div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 0",gap:12}}><div style={{fontSize:44}}>✅</div><div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Reservation Confirmed!</div><div style={{color:C.stone,fontSize:14,fontFamily:"sans-serif"}}>N36JR · {form.start}–{form.end}</div><Btn onClick={()=>setModal(false)}>Done</Btn></div>:<div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700}}>New Reservation</div>
        <div style={{background:C.dark,borderRadius:12,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,"+C.amber+",#A0621A)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>✈</div><div><div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:800,color:"#fff"}}>N36JR</div><div style={{color:C.stone,fontSize:11,fontFamily:"sans-serif"}}>Cessna 172 Skyhawk SP</div></div></div><div style={{textAlign:"right"}}><div style={{color:C.amberL,fontWeight:700,fontSize:13,fontFamily:"sans-serif"}}>{form.start} – {form.end}</div></div></div>
        <Fld label="* Activity Type"><div style={{display:"flex",gap:7}}>{[["solo","✈️","Solo"],["instruction","🎓","Dual"],["checkout","📋","Checkout"]].map(([val,ic,lbl])=>{const locked=(val==="solo"||val==="instruction")?!checkoutComplete:checkoutComplete;return <button key={val} onClick={()=>!locked&&setForm(p=>({...p,type:val,instr:val==="solo"?"":p.instr}))} style={{flex:1,padding:"10px 4px",borderRadius:9,cursor:locked?"not-allowed":"pointer",fontWeight:700,fontSize:11,fontFamily:"sans-serif",border:"2px solid "+(form.type===val?C.blue:locked?"#e5e7eb":C.tan),background:form.type===val?C.blue:locked?"#f9fafb":C.white,color:form.type===val?"#fff":locked?"#d1d5db":C.stone,display:"flex",flexDirection:"column",alignItems:"center",gap:3,position:"relative",opacity:locked?.55:1}}><span style={{fontSize:16}}>{ic}</span>{lbl}{locked&&<span style={{fontSize:9,position:"absolute",top:4,right:4}}>🔒</span>}</button>;})}
        </div>
        {!checkoutComplete&&(form.type==="solo"||form.type==="instruction")&&<div style={{background:C.amber+"18",border:"1.5px solid "+C.amber+"66",borderRadius:9,padding:"10px 13px",marginTop:4,display:"flex",gap:8,alignItems:"flex-start"}}><span style={{fontSize:16,flexShrink:0}}>⚠️</span><div><div style={{fontWeight:700,fontSize:13,color:C.amber,fontFamily:"sans-serif"}}>Club Checkout Required</div><div style={{color:C.darkL,fontSize:12,lineHeight:1.5,fontFamily:"sans-serif",marginTop:2}}>Complete a checkout flight before booking solo or dual time.</div></div></div>}
        {checkoutPending&&!checkoutComplete&&<div style={{background:C.amber+"12",border:"1.5px solid "+C.amber+"44",borderRadius:9,padding:"9px 13px",display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:14}}>⏳</span><div style={{fontSize:12,color:C.darkL,fontFamily:"sans-serif",lineHeight:1.5}}><strong>Checkout submitted</strong> — awaiting instructor approval.</div></div>}
        </Fld>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Fld label="Start Time"><input style={iSt} type="time" value={form.start} onChange={e=>setForm(p=>({...p,start:e.target.value}))}/></Fld>
          <Fld label="End Time"><input style={iSt} type="time" value={form.end} onChange={e=>setForm(p=>({...p,end:e.target.value}))}/></Fld>
        </div>
        {(form.type==="instruction"||form.type==="checkout")&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
          <Lbl>* {form.type==="checkout"?"Checkout-Authorized ":""}Instructor</Lbl>
          {INSTRUCTORS.filter(ins=>form.type!=="checkout"||ins.checkoutAuth).map(ins=><button key={ins.id} onClick={()=>ins.avail&&setForm(p=>({...p,instr:ins.name}))} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 13px",borderRadius:10,cursor:ins.avail?"pointer":"default",border:"2px solid "+(form.instr===ins.name?ins.col:C.tan),background:form.instr===ins.name?ins.col+"10":C.white,opacity:ins.avail?1:.45,width:"100%",textAlign:"left"}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:ins.col+"22",border:"2px solid "+ins.col,display:"flex",alignItems:"center",justifyContent:"center",color:ins.col,fontWeight:800,fontSize:14,flexShrink:0}}>{ins.init}</div>
            <div style={{flex:1}}><div style={{fontFamily:"Georgia,serif",fontSize:14,fontWeight:700,color:C.dark}}>{ins.name}</div><div style={{color:C.stone,fontSize:11,fontFamily:"sans-serif",display:"flex",alignItems:"center",gap:6}}>{ins.cert} · ${ins.rate}/hr{ins.checkoutAuth&&form.type==="checkout"&&<span style={{background:C.blue+"18",color:C.blue,fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:10}}>CHECKOUT AUTH</span>}</div>{!ins.avail&&<div style={{color:C.red,fontSize:10,fontFamily:"sans-serif"}}>On Leave</div>}</div>
            <div style={{width:20,height:20,borderRadius:"50%",border:"2px solid "+(form.instr===ins.name?ins.col:C.tan),background:form.instr===ins.name?ins.col:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{form.instr===ins.name&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}</div>
          </button>)}
          {!form.instr&&<div style={{color:C.red,fontSize:12,fontFamily:"sans-serif"}}>Please select an instructor.</div>}
        </div>}
        <Fld label="Comments (optional)"><textarea style={{...iSt,resize:"none"}} rows={2} placeholder="Notes for your instructor or club admin…" value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></Fld>
        {(()=>{const mins=t2m(form.end)-t2m(form.start);if(mins<=0)return null;const hrs=mins/60;const acCost=hrs*RATE_AC;const instrR=INSTRUCTORS.find(i=>i.name===form.instr);const instrCost=instrR?hrs*instrR.rate:0;return <div style={{background:C.parchment,borderRadius:10,padding:"11px 14px",border:"1px solid "+C.tan}}><div style={{color:C.stone,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",fontFamily:"sans-serif",marginBottom:8}}>Estimated Cost</div><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:C.darkL,fontSize:12,fontFamily:"sans-serif"}}>N36JR · {hrs.toFixed(1)} hrs @ ${RATE_AC}/hr</span><span style={{fontWeight:700,fontSize:12,fontFamily:"sans-serif"}}>{$$(acCost)}</span></div>{instrCost>0&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:C.darkL,fontSize:12,fontFamily:"sans-serif"}}>{form.instr.split(" ").slice(-1)[0]} · {hrs.toFixed(1)} hrs @ ${instrR.rate}/hr</span><span style={{fontWeight:700,fontSize:12,fontFamily:"sans-serif"}}>{$$(instrCost)}</span></div>}<div style={{borderTop:"1px solid "+C.tan,paddingTop:7,marginTop:4,display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:"Georgia,serif",fontSize:13,fontWeight:700}}>Est. Total</span><span style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:C.green}}>{$$(acCost+instrCost)}</span></div></div>;})()}
        <div style={{display:"flex",gap:10}}><Btn v="outline" style={{flex:1}} onClick={()=>setModal(false)}>Cancel</Btn><Btn style={{flex:2}} disabled={((form.type==="instruction"||form.type==="checkout")&&!form.instr)||((form.type==="solo"||form.type==="instruction")&&!checkoutComplete)} onClick={submit}>✓ Confirm</Btn></div>
      </div>}
    </Modal>}
  </div>;
}



function AboutPage({onJoin,onSignIn,setPage}){
  const[faq,setFaq]=useState(null);
  const FAQS=[["Do I need a pilot certificate?","No! Student pilots welcome. Our CFIs can take you from zero to private pilot certificate."],["What does $165/hr wet mean?","Fuel included. You pay Hobbs time only — no hidden fees."],["How do I schedule the aircraft?","Through this portal. Real-time availability, book from your phone."],["Are there hidden fees?","$80/month + $165/hr flight time. Instruction billed separately."],["What if I haven't flown recently?","Our CFIs will do a quick currency flight to get you back up to speed."]];
  const WHY=[["✈️","One aircraft, always maintained","N36JR is meticulously kept — you know exactly what you're getting."],["💰","Transparent pricing","$80/month + $165/hr wet. No initiation fees, no surprises."],["📱","Modern scheduling","Book from your phone, log Hobbs digitally, view your balance live."],["🤝","Real community","Pilots helping pilots — checkride prep to cross-country planning."],["📍","Prime NJ location","Minutes from NYC Class Bravo — ideal for IFR and cross-countries."]];
  const STEPS=[{n:"01",t:"Become a Member",b:"Quick online application. $80/month gets you access to N36JR — no initiation fee."},{n:"02",t:"Complete Your Checkout",b:"Fly with a CFI for a one-time checkout. Once cleared, the aircraft is yours anytime."},{n:"03",t:"Book & Fly",b:"Reserve N36JR in seconds. Pay only hours you fly — $165/hr wet, Hobbs-based."}];
  return <div style={{fontFamily:"sans-serif",color:C.dark,background:C.white}}>
    <div style={{position:"relative",minHeight:500,overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <img src={N36JR} alt="N36JR" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 55%"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(175deg,rgba(6,13,26,.95) 0%,rgba(13,31,60,.88) 30%,rgba(26,53,96,.75) 55%,rgba(139,74,26,.65) 78%,rgba(200,112,48,.5) 100%)"}}/>
      <div className="c1" style={{position:"absolute",top:"18%",display:"flex",gap:50,opacity:.3}}>{[100,150,80,120].map((w,i)=><div key={i} style={{width:w,height:26,background:"rgba(255,255,255,.1)",borderRadius:30,flexShrink:0,filter:"blur(4px)"}}/>)}</div>
      <div className="plane" style={{position:"absolute",top:"36%",left:0}}><svg viewBox="0 0 155 45" width="145" height="43"><ellipse cx="77" cy="27" rx="56" ry="6.5" fill="#e8e4dc"/><path d="M133 25Q150 27 133 29Z" fill="#d4cfc7"/><path d="M58 25Q63 9 92 11Q102 12 92 25Z" fill="#ddd8d0"/><path d="M58 29Q63 45 88 43Q98 42 88 29Z" fill="#d0cbc3"/><path d="M22 24Q26 18 40 19Q44 20 38 25Z" fill="#d4cfc7"/><path d="M22 30Q26 37 40 35Q44 34 38 29Z" fill="#cac5bd"/><ellipse cx="97" cy="25" rx="5" ry="3" fill="#7bb8d4" opacity=".9"/><ellipse cx="107" cy="25" rx="5" ry="3" fill="#7bb8d4" opacity=".9"/><path d="M34 26Q78 25.5 133 26.5" stroke="#8B1A2F" strokeWidth="2" fill="none" opacity=".7"/></svg></div>
      <div style={{position:"absolute",top:16,right:16,background:"rgba(0,0,0,.5)",border:"1px solid rgba(255,255,255,.18)",borderRadius:20,padding:"5px 13px",display:"flex",alignItems:"center",gap:7}}><div style={{width:7,height:7,borderRadius:"50%",background:C.green,boxShadow:"0 0 7px "+C.green}}/><span style={{color:"#fff",fontSize:11,fontWeight:700,fontFamily:"sans-serif"}}>KCDW VFR</span></div>
      <div style={{position:"relative",padding:"0 22px 36px",display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:2}}><div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#C8852A,#8B1A2F)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>✈</div><div><div style={{fontFamily:"Georgia,serif",fontSize:13,fontWeight:700,color:"rgba(255,255,255,.9)",letterSpacing:".05em"}}>KCDW FLYING CLUB</div><div style={{fontSize:10,color:"rgba(255,255,255,.5)",letterSpacing:".12em",fontFamily:"sans-serif"}}>CALDWELL, NEW JERSEY</div></div></div>
        <div style={{fontFamily:"Georgia,serif",fontSize:34,fontWeight:700,color:"#fff",lineHeight:1.15,textShadow:"0 3px 24px rgba(0,0,0,.5)"}}>Your Pilot<br/>Community<br/><em style={{color:C.amberL}}>Awaits.</em></div>
        <div style={{color:"rgba(255,255,255,.75)",fontSize:15,lineHeight:1.6,maxWidth:340,fontFamily:"sans-serif"}}>Affordable aircraft rental, experienced instructors, and a welcoming community at Essex County Airport.</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:4}}>
          <button onClick={onJoin} style={{background:"linear-gradient(135deg,#C8852A,#A0621A)",color:"#fff",border:"none",borderRadius:12,padding:"14px 24px",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"sans-serif",flexShrink:0}}>Join the Club →</button>
          <button onClick={()=>setPage("schedule")} style={{background:"rgba(255,255,255,.12)",color:"#fff",border:"1px solid rgba(255,255,255,.28)",borderRadius:12,padding:"14px 20px",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"sans-serif",flexShrink:0}}>View Schedule</button>
        </div>
        <button onClick={onSignIn} style={{background:"none",border:"none",color:"rgba(255,255,255,.55)",cursor:"pointer",fontSize:13,fontFamily:"sans-serif",padding:0,textDecoration:"underline",textAlign:"left"}}>Already a member? Sign in</button>
      </div>
    </div>
    <div style={{background:C.dark,display:"grid",gridTemplateColumns:"repeat(4,1fr)"}}>
      {[["1","Aircraft"],["3","Instructors"],["$165","Per Hr Wet"],["KCDW","Caldwell NJ"]].map(([v,l],i)=>(
        <div key={l} style={{padding:"16px 6px",borderRight:i<3?"1px solid rgba(255,255,255,.08)":undefined,textAlign:"center"}}><div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:800,color:C.amberL}}>{v}</div><div style={{color:C.stone,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",fontFamily:"sans-serif",marginTop:3}}>{l}</div></div>
      ))}
    </div>
    <div style={{background:C.dark,padding:"24px 20px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#fff",marginBottom:6}}>Meet N36JR</div>
      <div style={{color:C.stone,fontSize:13,lineHeight:1.6,marginBottom:14,fontFamily:"sans-serif"}}>2012 Cessna 172 Skyhawk SP · Garmin G1000 NXi · GFC700 autopilot · IFR capable</div>
      <div style={{position:"relative",borderRadius:14,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,.5)"}}>
        <img src={N36JR} alt="N36JR" style={{width:"100%",display:"block",height:200,objectFit:"cover",objectPosition:"center 58%"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 45%,rgba(0,0,0,.8) 100%)"}}/>
        <div style={{position:"absolute",bottom:14,left:16,right:16,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div><div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:800,color:"#fff"}}>N36JR</div><div style={{color:"rgba(255,255,255,.65)",fontSize:10,letterSpacing:".08em",fontFamily:"sans-serif"}}>2012 CESSNA 172 SKYHAWK SP</div></div>
          <div style={{display:"flex",alignItems:"center",gap:5,background:"rgba(0,0,0,.55)",border:"1px solid "+C.green+"66",borderRadius:20,padding:"5px 11px"}}><div style={{width:7,height:7,borderRadius:"50%",background:C.green,boxShadow:"0 0 6px "+C.green}}/><span style={{color:C.green,fontSize:11,fontWeight:700,fontFamily:"sans-serif"}}>Available</span></div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:12}}>
        {[["180 HP","IO-360"],["G1000 NXi","Glass Panel"],["$165/hr","Wet Rate"]].map(([v,l])=>(
          <div key={l} style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.1)",borderRadius:10,padding:"11px 6px",textAlign:"center"}}><div style={{fontFamily:"Georgia,serif",fontSize:14,fontWeight:800,color:C.amberL}}>{v}</div><div style={{color:C.stone,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginTop:3,fontFamily:"sans-serif"}}>{l}</div></div>
        ))}
      </div>
    </div>
    <div style={{padding:"28px 20px",borderBottom:"1px solid "+C.tan}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,marginBottom:10}}>About the Club</div>
      <div style={{color:"#555",fontSize:14,lineHeight:1.8,marginBottom:14,fontFamily:"sans-serif"}}>KCDW Flying Club is a member-owned club at Essex County Airport (KCDW) in Caldwell, NJ. We operate N36JR — a 2012 Cessna 172 Skyhawk SP with Garmin G1000 NXi and GFC700 autopilot.</div>
      <button onClick={onJoin} style={{background:C.blue,color:"#fff",border:"none",borderRadius:10,padding:"13px 0",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"sans-serif",width:"100%"}}>Become a Member — $80/month</button>
    </div>
    <div style={{padding:"28px 20px",borderBottom:"1px solid "+C.tan,background:C.cream}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,marginBottom:18}}>How It Works</div>
      {STEPS.map((s,i)=><div key={s.n} style={{display:"flex",gap:16,paddingBottom:i<STEPS.length-1?18:0,position:"relative"}}>
        {i<STEPS.length-1&&<div style={{position:"absolute",left:20,top:44,bottom:0,width:1.5,background:"linear-gradient(180deg,"+C.amber+","+C.tan+")"}}/>}
        <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,"+C.amber+",#A0621A)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:"#fff",fontSize:13,fontWeight:800,fontFamily:"sans-serif"}}>{s.n}</span></div>
        <div style={{flex:1,paddingTop:4}}><div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,marginBottom:4}}>{s.t}</div><div style={{color:"#666",fontSize:13,lineHeight:1.7,fontFamily:"sans-serif"}}>{s.b}</div></div>
      </div>)}
      <button onClick={onJoin} style={{marginTop:20,background:"linear-gradient(135deg,#C8852A,#A0621A)",color:"#fff",border:"none",borderRadius:12,padding:"14px 0",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"sans-serif",width:"100%"}}>Start Your Application</button>
    </div>
    <div style={{padding:"28px 20px",borderBottom:"1px solid "+C.tan}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,marginBottom:14}}>Why KCDW Flying Club</div>
      {WHY.map(([ic,t,b])=><div key={t} style={{display:"flex",gap:14,padding:"12px 14px",background:C.cream,borderRadius:12,border:"1px solid "+C.tan+"88",marginBottom:10}}><span style={{fontSize:22,flexShrink:0}}>{ic}</span><div><div style={{fontWeight:700,fontSize:14,marginBottom:3,fontFamily:"sans-serif"}}>{t}</div><div style={{color:"#666",fontSize:13,lineHeight:1.6,fontFamily:"sans-serif"}}>{b}</div></div></div>)}
    </div>
    <div style={{padding:"28px 20px",borderBottom:"1px solid "+C.tan,background:C.cream}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,marginBottom:14}}>Common Questions</div>
      {FAQS.map(([q,a],i)=><div key={i} style={{borderBottom:"1px solid "+C.tan}}>
        <button onClick={()=>setFaq(faq===i?null:i)} style={{background:"none",border:"none",cursor:"pointer",width:"100%",textAlign:"left",padding:"14px 0",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,fontFamily:"sans-serif"}}><span style={{fontSize:14,fontWeight:700,lineHeight:1.4}}>{q}</span><span style={{fontSize:20,color:C.stone,flexShrink:0,lineHeight:1}}>{faq===i?"−":"+"}</span></button>
        {faq===i&&<div style={{color:"#666",fontSize:13,lineHeight:1.75,paddingBottom:14,fontFamily:"sans-serif"}}>{a}</div>}
      </div>)}
    </div>
    <div style={{background:"linear-gradient(135deg,#0d1b2a,#1a3560)",padding:"44px 22px 60px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
      <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#C8852A,#8B1A2F)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginBottom:4}}>✈</div>
      <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:"#fff",lineHeight:1.25}}>Ready to Fly?</div>
      <div style={{color:"rgba(255,255,255,.65)",fontSize:14,lineHeight:1.7,maxWidth:300,fontFamily:"sans-serif"}}>$80/month gets you access to N36JR and a community of pilots who love to fly.</div>
      <button onClick={onJoin} style={{background:"linear-gradient(135deg,#C8852A,#A0621A)",color:"#fff",border:"none",borderRadius:14,padding:"16px 0",fontWeight:800,fontSize:16,cursor:"pointer",fontFamily:"sans-serif",width:"100%",maxWidth:320}}>Apply Now — Join the Club</button>
      <button onClick={onSignIn} style={{background:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.7)",border:"1px solid rgba(255,255,255,.2)",borderRadius:10,padding:"12px 0",fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:"sans-serif",width:"100%",maxWidth:320}}>Already a Member? Sign In</button>
      <div style={{color:"rgba(255,255,255,.35)",fontSize:11,marginTop:6,fontFamily:"sans-serif"}}>Essex County Airport · KCDW · Caldwell, NJ 07006</div>
    </div>
  </div>;
}

function ScheduleGate({onJoin,onSignIn}){
  const DAY_START=6,DAY_END=21,HR_H=60;
  const hrs=Array.from({length:DAY_END-DAY_START},(_,i)=>DAY_START+i);
  const fakeBlocks=[
    {top:2*HR_H,height:2.5*HR_H,color:"#1A6BB5"},
    {top:7*HR_H,height:2*HR_H,color:"#1A4A8A"},
    {top:5*HR_H,height:1.5*HR_H,color:"#B8860B"},
    {top:10*HR_H,height:2*HR_H,color:"#1A6BB5"},
    {top:12.5*HR_H,height:1*HR_H,color:"#1A4A8A"},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",position:"relative"}}>
      {/* Blurred schedule underneath */}
      <div style={{filter:"blur(3px)",opacity:.45,pointerEvents:"none",userSelect:"none",display:"flex",flexDirection:"column",flex:1}}>
        <div style={{padding:"12px 14px 8px",background:"#f9fafb"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:20,fontWeight:700,fontFamily:"Georgia,serif"}}>Schedule</span>
            <div style={{background:C.blue,color:"#fff",border:"none",borderRadius:7,padding:"8px 14px",fontWeight:700,fontSize:13,fontFamily:"sans-serif"}}>+ New</div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",border:"1.5px solid #d1d5db",borderRadius:8,background:"#fff",padding:"8px 12px",marginBottom:8}}>
            <div style={{fontSize:20,color:C.blue}}>‹</div>
            <span style={{fontSize:14,fontWeight:600,fontFamily:"sans-serif"}}>Today — {new Date().toLocaleDateString("en-US",{month:"long",day:"numeric"})}</span>
            <div style={{fontSize:20,color:C.blue}}>›</div>
          </div>
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:7,padding:"6px 12px",display:"flex",gap:8,marginBottom:8}}>
            <span style={{color:C.green,fontSize:11,fontWeight:800,fontFamily:"sans-serif"}}>KCDW VFR</span>
            <span style={{fontSize:10,fontFamily:"monospace"}}>AUTO 00000KT 10SM CLR 24/M03 A3012</span>
          </div>
        </div>
        <div style={{flex:1,overflow:"hidden",borderTop:"1px solid #e5e7eb"}}>
          <div style={{display:"flex",minWidth:200}}>
            <div style={{width:46,flexShrink:0,borderRight:"1px solid #e5e7eb",background:"#f9fafb"}}>
              <div style={{height:52,borderBottom:"2px solid #e5e7eb"}}/>
              {hrs.map(h=><div key={h} style={{height:HR_H,display:"flex",alignItems:"flex-start",justifyContent:"flex-end",paddingRight:6,paddingTop:2,color:"#9ca3af",fontSize:9,fontFamily:"sans-serif",borderBottom:"1px solid #f3f4f6"}}>{h===12?"12pm":h>12?(h-12)+"pm":h+"am"}</div>)}
            </div>
            <div style={{flex:1,position:"relative"}}>
              <div style={{height:52,borderBottom:"2px solid #e5e7eb",padding:"8px",background:"#fff"}}>
                <div style={{height:3,borderRadius:2,background:C.green,marginBottom:4}}/>
                <span style={{fontSize:14,fontWeight:800,fontFamily:"sans-serif",display:"block"}}>N36JR</span>
              </div>
              <div style={{position:"relative",height:(DAY_END-DAY_START)*HR_H}}>
                {hrs.map(h=><div key={h} style={{position:"absolute",top:(h-DAY_START)*HR_H,left:0,right:0,height:HR_H,borderBottom:"1px solid #f3f4f6"}}/>)}
                {fakeBlocks.map((b,i)=>(
                  <div key={i} style={{position:"absolute",left:3,right:3,top:b.top,height:b.height,borderRadius:5,background:b.color,borderLeft:"4px solid "+b.color+"cc",padding:"4px 7px"}}>
                    <div style={{color:"#fff",fontSize:11,fontWeight:700}}>██████ ██</div>
                    {b.height>50&&<div style={{color:"rgba(255,255,255,.7)",fontSize:10}}>████████</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Lock overlay */}
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:"0 32px",background:"rgba(249,250,251,.15)"}}>
        <div style={{background:C.white,borderRadius:20,padding:"28px 24px",width:"100%",maxWidth:320,boxShadow:"0 20px 60px rgba(0,0,0,.18)",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:14,border:"1px solid "+C.tan}}>
          <div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,"+C.dark+","+C.darkM+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🔒</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:C.dark}}>Members Only</div>
          <div style={{color:C.stone,fontSize:13,lineHeight:1.6,fontFamily:"sans-serif"}}>Sign in or join the club to view the schedule, check aircraft availability, and book your next flight.</div>
          <button onClick={onJoin} style={{background:"linear-gradient(135deg,#C8852A,#A0621A)",color:"#fff",border:"none",borderRadius:10,padding:"13px 0",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"sans-serif",width:"100%"}}>Join the Club — $80/month</button>
          <button onClick={onSignIn} style={{background:C.white,color:C.blue,border:"2px solid "+C.blue,borderRadius:10,padding:"11px 0",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"sans-serif",width:"100%"}}>Sign In</button>
          <div style={{color:C.stoneL,fontSize:11,fontFamily:"sans-serif"}}>Real bookings · Live availability · Mobile scheduling</div>
        </div>
      </div>
    </div>
  );
}


// ─── Instructor Components ────────────────────────────────────────────────────
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
            <div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif"}}>{co.date} · N36JR · {co.hobbsOut-co.hobbsIn||"1.8"} hrs</div>
            <div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",marginTop:2}}>Hobbs: {co.hobbsIn} → {co.hobbsOut}</div>
            {co.status==="approved"&&co.notes&&<div style={{color:C.green,fontSize:12,fontFamily:"sans-serif",marginTop:4,lineHeight:1.4,fontStyle:"italic"}}>"{co.notes}"</div>}
            {co.status==="declined"&&co.declineReason&&<div style={{color:C.red,fontSize:12,fontFamily:"sans-serif",marginTop:4,lineHeight:1.4}}>{co.declineReason}</div>}
          </div>
          <Bdg col={statusCol(co.status)}>{co.status==="pending"?"⏳ Pending":co.status==="approved"?"✅ Approved":"❌ Declined"}</Bdg>
        </div>
        {co.status==="pending"&&<div style={{background:C.amber+"10",padding:"8px 16px",borderTop:"1px solid "+C.amber+"33",fontSize:12,color:C.amber,fontWeight:700,fontFamily:"sans-serif"}}>Tap to review →</div>}
      </Card>
    ))}
    {sel&&<Modal onClose={()=>{setSel(null);setDeclining(false);}}>
      {done==="approved"?(
        <div style={{textAlign:"center",padding:"20px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
          <div style={{fontSize:56}}>✅</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Checkout Approved!</div>
          <div style={{color:C.stone,fontSize:13,fontFamily:"sans-serif",lineHeight:1.6}}>{sel.memberName} can now book solo and dual instruction time.</div>
        </div>
      ):done==="declined"?(
        <div style={{textAlign:"center",padding:"20px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
          <div style={{fontSize:56}}>❌</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Checkout Declined</div>
          <div style={{color:C.stone,fontSize:13,fontFamily:"sans-serif"}}>{sel.memberName} has been notified with your feedback.</div>
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
            <textarea style={{...iSt,resize:"none"}} rows={3} placeholder="Performance observations, areas of strength, recommendations…" value={notes} onChange={e=>setNotes(e.target.value)}/>
          </Fld>
          {!declining&&sel.status==="pending"&&<div style={{display:"flex",gap:10}}>
            <Btn v="green" style={{flex:2}} onClick={()=>approve(sel.id)}>✓ Approve Checkout</Btn>
            <Btn v="red" style={{flex:1}} onClick={()=>setDeclining(true)}>✗ Decline</Btn>
          </div>}
          {declining&&<div style={{background:C.red+"08",border:"1.5px solid "+C.red+"33",borderRadius:12,padding:14,display:"flex",flexDirection:"column",gap:10}}>
            <div style={{fontWeight:700,fontSize:14,color:C.red,fontFamily:"sans-serif"}}>Reason for Decline (required)</div>
            <div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",lineHeight:1.5}}>This message will be sent to {sel.memberName}. Be specific about what needs improvement before another checkout can be attempted.</div>
            <textarea style={{...iSt,borderColor:C.red+"88",resize:"none"}} rows={3} placeholder="e.g. Needs more crosswind landing practice. Recommend 2-3 more dual sessions." value={declineReason} onChange={e=>setDeclineReason(e.target.value)}/>
            <div style={{display:"flex",gap:8}}>
              <Btn v="outline" style={{flex:1,fontSize:12}} onClick={()=>setDeclining(false)}>Cancel</Btn>
              <Btn v="red" style={{flex:2}} disabled={!declineReason.trim()} onClick={()=>decline(sel.id)}>Confirm Decline</Btn>
            </div>
          </div>}
          {sel.status!=="pending"&&<Btn v="outline" onClick={()=>setSel(null)}>Close</Btn>}
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
      <div style={{fontWeight:700,fontSize:13,fontFamily:"sans-serif",marginBottom:4}}>ℹ️ Checkout Authorization</div>
      <div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",lineHeight:1.6}}>You are not currently authorized to conduct club checkout flights. Only CFI/CFII/MEI-rated instructors may perform checkouts. Contact club admin to update your status.</div>
    </div>}
    {mine.length===0?<div style={{color:C.stone,fontSize:14,fontFamily:"sans-serif",textAlign:"center",padding:24}}>No flights scheduled.</div>:mine.map(b=>(
      <Card key={b.id} style={{padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,marginBottom:3}}>{b.pilot}</div>
            <div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif"}}>{b.date} · {b.start}–{b.end} · {b.ac}</div>
          </div>
          <Bdg col={b.type==="checkout"?C.gold:C.blue}>{b.type}</Bdg>
        </div>
      </Card>
    ))}
  </div>;
}

function MembersTab({checkouts}){
  const statusCol=s=>s==="approved"?C.green:s==="declined"?C.red:s==="pending"?C.amber:C.stone;
  const statusLabel=s=>s==="approved"?"✅ Cleared":s==="declined"?"❌ Declined":s==="pending"?"⏳ Pending":"○ No checkout";
  const members=[
    {id:"m1",name:"Sarah Mitchell",email:"sarah@kcdw.com",cert:"Private Pilot",hours:124,joined:"Jan 2026"},
    {id:"m2",name:"Priya Patel",email:"priya@kcdw.com",cert:"Student Pilot",hours:32,joined:"Feb 2026"},
    {id:"m3",name:"James Rodriguez",email:"james@kcdw.com",cert:"Private Pilot",hours:89,joined:"Mar 2026"},
    {id:"m4",name:"Tom Baker",email:"tom@kcdw.com",cert:"Student Pilot",hours:8,joined:"May 2026"},
  ];
  const getStatus=email=>{
    const co=checkouts.find(c=>c.memberId===email);
    return co?co.status:"none";
  };
  return <div style={{padding:"16px 16px 40px",display:"flex",flexDirection:"column",gap:12}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Club Members</div>
    {members.map(m=>{
      const st=getStatus(m.email);
      return <Card key={m.id} style={{padding:16}}>
        <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
          <div style={{width:42,height:42,borderRadius:"50%",background:C.blue+"22",border:"2px solid "+C.blue,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:C.blue,flexShrink:0}}>{m.name.split(" ").map(n=>n[0]).join("")}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,marginBottom:2}}>{m.name}</div>
            <div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",marginBottom:6}}>{m.cert} · {m.hours} hrs · Joined {m.joined}</div>
            <Bdg col={statusCol(st)}>{statusLabel(st)}</Bdg>
          </div>
        </div>
      </Card>;
    })}
  </div>;
}

function EmployeeTab({instructor}){
  const[tab,setTab]=useState("w4");
  const[saved,setSaved]=useState({});
  const[f,setF]=useState({legalName:"",ssn:"",address:"",city:"",state:"NJ",zip:"",filingStatus:"Single",allowances:"0",extra:"",exempt:false,i9First:"",i9Last:"",i9DOB:"",i9SSN:"",i9Email:"",i9Phone:"",i9Citizen:"citizen",i9DocType:"passport",i9DocNum:"",i9Expiry:"",bankName:"",accountType:"checking",routing:"",account:"",accountConfirm:"",njAllow:"0",njExtra:"",njExempt:false,emName:"",emPhone:"",emRel:"",emName2:"",emPhone2:"",emRel2:""});
  const u=p=>setF(x=>({...x,...p}));
  const save=t=>setSaved(p=>({...p,[t]:true}));
  const done=["w4","i9","dd","njw4","em"].filter(t=>saved[t]).length;
  const allDone=done===5;
  const pct=Math.round(done/5*100);
  const TabBtn=({id,ic,lbl})=><button onClick={()=>setTab(id)} style={{padding:"9px 10px",border:"none",background:"transparent",cursor:"pointer",fontSize:11,fontFamily:"sans-serif",borderBottom:"2px solid "+(tab===id?C.blue:"transparent"),color:tab===id?C.blue:C.stone,fontWeight:tab===id?700:500,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:3}}><span style={{fontSize:12}}>{saved[id]&&id!=="qb"?"✅":ic}</span>{lbl}</button>;
  const SField=({label,field,type="text",max,ph,transform})=><Fld label={label}><input style={iSt} type={type||"text"} maxLength={max} value={f[field]} onChange={e=>u({[field]:transform?transform(e.target.value):e.target.value})} placeholder={ph}/></Fld>;
  return <div style={{display:"flex",flexDirection:"column",paddingBottom:40}}>
    <div style={{background:C.dark,padding:"16px 16px 14px"}}>
      <div style={{fontSize:10,fontWeight:800,color:C.amber,letterSpacing:".14em",textTransform:"uppercase",fontFamily:"sans-serif",marginBottom:6}}>Employee Onboarding</div>
      <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700,color:"#fff",marginBottom:8}}>HR Forms & QuickBooks</div>
      <div style={{height:5,background:"rgba(255,255,255,.12)",borderRadius:3,overflow:"hidden",marginBottom:5}}><div style={{height:"100%",width:pct+"%",background:"linear-gradient(90deg,"+C.amber+","+C.amberL+")",borderRadius:3,transition:"width .4s"}}/></div>
      <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.stone,fontSize:12,fontFamily:"sans-serif"}}>{pct}% — {done}/5 forms</span>{allDone&&<span style={{color:C.green,fontSize:12,fontWeight:700,fontFamily:"sans-serif"}}>✓ Ready for QuickBooks</span>}</div>
    </div>
    <div style={{display:"flex",overflowX:"auto",borderBottom:"1px solid #e5e7eb",background:C.white}}>
      <TabBtn id="w4" ic="📋" lbl="W-4"/><TabBtn id="i9" ic="🪪" lbl="I-9"/><TabBtn id="dd" ic="🏦" lbl="Direct Dep."/><TabBtn id="njw4" ic="🏛️" lbl="NJ W-4"/><TabBtn id="em" ic="🚨" lbl="Emergency"/><TabBtn id="qb" ic="📊" lbl="QuickBooks"/>
    </div>
    <div style={{padding:"18px 16px",display:"flex",flexDirection:"column",gap:12}}>
      {tab==="w4"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>Federal W-4</div>
        <div style={{background:C.blueP,border:"1px solid "+C.blue+"33",borderRadius:10,padding:"9px 12px",fontSize:12,color:C.blue,fontFamily:"sans-serif"}}>Submitted electronically to the IRS via QuickBooks Payroll.</div>
        <SField label="Legal Full Name" field="legalName" ph="Michael A. Torres"/>
        <SField label="Social Security Number" field="ssn" type="password" ph="XXX-XX-XXXX"/>
        <SField label="Home Address" field="address" ph="123 Runway Dr"/>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:10}}>
          <SField label="City" field="city" ph="Caldwell"/>
          <SField label="State" field="state" max={2} ph="NJ" transform={v=>v.toUpperCase()}/>
          <SField label="ZIP" field="zip" max={5} ph="07006" transform={v=>v.replace(/[^0-9]/g,"")}/>
        </div>
        <Fld label="Filing Status"><select style={iSt} value={f.filingStatus} onChange={e=>u({filingStatus:e.target.value})}><option>Single</option><option>Married filing jointly</option><option>Head of household</option></select></Fld>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <SField label="Allowances" field="allowances" type="number" ph="0"/>
          <SField label="Extra Withholding ($)" field="extra" type="number" ph="0.00"/>
        </div>
        <label style={{display:"flex",gap:10,alignItems:"flex-start",cursor:"pointer"}}><input type="checkbox" checked={f.exempt} onChange={e=>u({exempt:e.target.checked})} style={{width:18,height:18,marginTop:2,accentColor:C.blue}}/><span style={{fontSize:13,fontFamily:"sans-serif"}}>Claim Exemption from Withholding</span></label>
        <div style={{background:C.parchment,borderRadius:10,padding:"10px 12px",fontSize:12,color:C.darkL,lineHeight:1.6,fontFamily:"sans-serif"}}>Under penalty of perjury, I certify this certificate is correct and authorize KCDW Flying Club to deduct the indicated amounts from my paychecks.</div>
        <Btn v={saved.w4?"outline":"green"} onClick={()=>save("w4")}>{saved.w4?"✅ W-4 Submitted":"Submit W-4 to QuickBooks"}</Btn>
      </>}
      {tab==="i9"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>Form I-9 — Employment Eligibility</div>
        <div style={{background:C.amber+"12",border:"1px solid "+C.amber+"44",borderRadius:10,padding:"9px 12px",fontSize:12,color:C.darkL,fontFamily:"sans-serif"}}>⚠️ Required by federal law within 3 days of hire.</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><SField label="First Name" field="i9First" ph="Michael"/><SField label="Last Name" field="i9Last" ph="Torres"/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><SField label="Date of Birth" field="i9DOB" type="date"/><SField label="SSN Last 4" field="i9SSN" max={4} ph="1234" transform={v=>v.replace(/[^0-9]/g,"")}/></div>
        <SField label="Email" field="i9Email" type="email" ph="torres@kcdw.com"/>
        <SField label="Phone" field="i9Phone" type="tel" ph="(973) 555-0811"/>
        <Fld label="Citizenship Status"><select style={iSt} value={f.i9Citizen} onChange={e=>u({i9Citizen:e.target.value})}><option value="citizen">U.S. Citizen</option><option value="noncitizen_national">Noncitizen National</option><option value="lawful_permanent_resident">Lawful Permanent Resident</option><option value="authorized_alien">Alien Authorized to Work</option></select></Fld>
        <Fld label="Document Type"><select style={iSt} value={f.i9DocType} onChange={e=>u({i9DocType:e.target.value})}><option value="passport">U.S. Passport (List A)</option><option value="dl_ss">Driver's License + SS Card (List B+C)</option><option value="dl_birth">Driver's License + Birth Cert (List B+C)</option><option value="green_card">Permanent Resident Card (List A)</option></select></Fld>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><SField label="Document Number" field="i9DocNum" ph="Doc #"/><SField label="Expiration Date" field="i9Expiry" type="date"/></div>
        <div style={{background:C.parchment,borderRadius:10,padding:"10px 12px",fontSize:12,color:C.darkL,lineHeight:1.6,fontFamily:"sans-serif"}}>I attest under penalty of perjury that I am authorized to work in the United States and the documents provided are genuine.</div>
        <Btn v={saved.i9?"outline":"green"} onClick={()=>save("i9")}>{saved.i9?"✅ I-9 Submitted":"Submit I-9 to QuickBooks"}</Btn>
      </>}
      {tab==="dd"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>Direct Deposit Authorization</div>
        <div style={{background:C.blueP,border:"1px solid "+C.blue+"33",borderRadius:10,padding:"9px 12px",fontSize:12,color:C.blue,fontFamily:"sans-serif"}}>Pay deposited on the 1st and 15th. Bank details encrypted by Intuit.</div>
        <SField label="Bank Name" field="bankName" ph="Chase Bank"/>
        <Fld label="Account Type"><div style={{display:"flex",gap:8}}>{["checking","savings"].map(t=><button key={t} onClick={()=>u({accountType:t})} style={{flex:1,padding:"10px 0",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"sans-serif",border:"2px solid "+(f.accountType===t?C.blue:C.tan),background:f.accountType===t?C.blue:C.white,color:f.accountType===t?"#fff":C.stone}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}</div></Fld>
        <SField label="Routing Number (9 digits)" field="routing" max={9} ph="021000021" transform={v=>v.replace(/[^0-9]/g,"").slice(0,9)}/>
        <SField label="Account Number" field="account" type="password" transform={v=>v.replace(/[^0-9]/g,"")}/>
        <SField label="Confirm Account Number" field="accountConfirm" transform={v=>v.replace(/[^0-9]/g,"")}/>
        {f.account&&f.accountConfirm&&f.account!==f.accountConfirm&&<div style={{color:C.red,fontSize:12,fontFamily:"sans-serif"}}>Account numbers do not match.</div>}
        <div style={{background:C.parchment,borderRadius:10,padding:"10px 12px",fontSize:12,color:C.darkL,lineHeight:1.6,fontFamily:"sans-serif"}}>I authorize KCDW Flying Club to initiate ACH credits to my account until I notify the club otherwise in writing.</div>
        <Btn v={saved.dd?"outline":"green"} disabled={!f.routing||f.routing.length!==9||!f.account||f.account!==f.accountConfirm} onClick={()=>save("dd")}>{saved.dd?"✅ Direct Deposit Set Up":"Submit to QuickBooks"}</Btn>
      </>}
      {tab==="njw4"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>NJ-W4 — New Jersey Withholding</div>
        <div style={{background:C.blueP,border:"1px solid "+C.blue+"33",borderRadius:10,padding:"9px 12px",fontSize:12,color:C.blue,fontFamily:"sans-serif"}}>Required by NJ Division of Taxation. Filed alongside your Federal W-4.</div>
        <SField label="NJ Withholding Allowances" field="njAllow" type="number" ph="0"/>
        <SField label="Additional NJ Withholding Per Period ($)" field="njExtra" type="number" ph="0.00"/>
        <label style={{display:"flex",gap:10,alignItems:"flex-start",cursor:"pointer"}}><input type="checkbox" checked={f.njExempt} onChange={e=>u({njExempt:e.target.checked})} style={{width:18,height:18,marginTop:2,accentColor:C.blue}}/><span style={{fontSize:13,fontFamily:"sans-serif"}}>Claim NJ Exemption from Withholding</span></label>
        <div style={{background:C.parchment,borderRadius:10,padding:"10px 12px",fontSize:12,color:C.darkL,lineHeight:1.6,fontFamily:"sans-serif"}}>I certify the allowances claimed do not exceed those to which I am entitled.</div>
        <Btn v={saved.njw4?"outline":"green"} onClick={()=>save("njw4")}>{saved.njw4?"✅ NJ W-4 Submitted":"Submit NJ W-4 to QuickBooks"}</Btn>
      </>}
      {tab==="em"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>Emergency Contacts</div>
        <div style={{background:C.red+"10",border:"1px solid "+C.red+"33",borderRadius:10,padding:"9px 12px",fontSize:12,color:C.darkL,fontFamily:"sans-serif"}}>🚨 Required for all KCDW staff in case of an airport incident.</div>
        {[["Primary","emName","emPhone","emRel","Maria Torres"],["Secondary","emName2","emPhone2","emRel2","Carlos Torres"]].map(([lbl,n,p,r,ph])=><div key={lbl} style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{fontWeight:700,fontSize:13,fontFamily:"sans-serif"}}>{lbl} Contact</div>
          <SField label="Full Name" field={n} ph={ph}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><SField label="Phone" field={p} type="tel" ph="(973) 555-0900"/><SField label="Relationship" field={r} ph={lbl==="Primary"?"Spouse":"Brother"}/></div>
        </div>)}
        <Btn v={saved.em?"outline":"green"} disabled={!f.emName||!f.emPhone||!f.emRel} onClick={()=>save("em")}>{saved.em?"✅ Contacts Saved":"Save Emergency Contacts"}</Btn>
      </>}
      {tab==="qb"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>QuickBooks Payroll</div>
        <div style={{background:"linear-gradient(135deg,#2CA01C,#1A7A12)",borderRadius:14,padding:"16px",display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:40,height:40,borderRadius:10,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>📊</div><div><div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,color:"#fff"}}>QuickBooks Online Payroll</div><div style={{color:"rgba(255,255,255,.75)",fontSize:12,fontFamily:"sans-serif"}}>{allDone?"Ready to sync":done+"/5 forms complete"}</div></div></div>
          {allDone?<div style={{background:"rgba(255,255,255,.15)",borderRadius:10,padding:"10px 12px"}}>{["All HR forms submitted","Direct deposit configured","Federal + NJ withholding set","Emergency contacts on file"].map(item=><div key={item} style={{color:"#fff",fontSize:12,fontFamily:"sans-serif",marginBottom:2}}>✅ {item}</div>)}</div>:<div style={{color:"rgba(255,255,255,.8)",fontSize:13,fontFamily:"sans-serif"}}>{5-done} form(s) remaining.</div>}
        </div>
        {[["💰","Automated Payroll","1st and 15th based on logged instruction hours."],["📄","W-2 Filing","Year-end W-2s filed electronically with the IRS."],["🏛️","NJ State Taxes","NJ income tax, SDI, and UI remitted automatically."],["📊","Revenue Sync","Instruction revenue categorized in QuickBooks."],["🔒","PCI Compliant","All payroll data encrypted by Intuit."]].map(([ic,t,d])=><div key={t} style={{display:"flex",gap:12,padding:"10px 12px",background:C.cream,borderRadius:10,border:"1px solid "+C.tan+"88"}}><span style={{fontSize:18,flexShrink:0}}>{ic}</span><div><div style={{fontWeight:700,fontSize:13,color:C.dark,fontFamily:"sans-serif",marginBottom:2}}>{t}</div><div style={{color:"#666",fontSize:12,lineHeight:1.5,fontFamily:"sans-serif"}}>{d}</div></div></div>)}
        <Btn disabled={!allDone}>{allDone?"Sync with QuickBooks →":"Complete all forms to enable sync"}</Btn>
      </>}
    </div>
  </div>;
}


function InstructorsPage(){
  const[sel,setSel]=useState(null);
  return <div style={{display:"flex",flexDirection:"column",padding:"16px 16px 40px",gap:14}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Our Instructors</div>
    {INSTRUCTORS.map(ins=>(
      <Card key={ins.id} style={{padding:16,opacity:ins.avail?1:.6}}>
        <div style={{display:"flex",gap:14,alignItems:"flex-start"}} onClick={()=>setSel(ins)}>
          <Avt init={ins.init} col={ins.col} sz={50}/>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,marginBottom:3}}>{ins.name}</div>
            <div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",marginBottom:6}}>{ins.cert} · ${ins.rate}/hr</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {ins.coAuth&&<Bdg col={C.blue}>Checkout Auth</Bdg>}
              {!ins.avail&&<Bdg col={C.stone}>On Leave</Bdg>}
              {ins.avail&&<Bdg col={C.green}>Available</Bdg>}
            </div>
          </div>
          <span style={{color:C.stone,fontSize:20}}>›</span>
        </div>
      </Card>
    ))}
    {sel&&<Modal onClose={()=>setSel(null)}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"flex",gap:14,alignItems:"center"}}><Avt init={sel.init} col={sel.col} sz={56}/><div><div style={{fontFamily:"Georgia,serif",fontSize:19,fontWeight:700}}>{sel.name}</div><div style={{color:C.stone,fontSize:13,fontFamily:"sans-serif",marginTop:3}}>{sel.cert}</div></div></div>
        <div style={{color:"#555",fontSize:14,lineHeight:1.7,fontFamily:"sans-serif"}}>{sel.bio}</div>
        {[["Hourly Rate","$"+sel.rate+"/hr"],["Phone",sel.phone],["Checkout Auth",sel.coAuth?"Yes — authorized to perform club checkouts":"No"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid "+C.tan}}><span style={{color:C.stone,fontSize:13,fontFamily:"sans-serif"}}>{l}</span><span style={{fontWeight:700,fontSize:13,fontFamily:"sans-serif"}}>{v}</span></div>
        ))}
        <Btn v="ol" onClick={()=>setSel(null)}>Close</Btn>
      </div>
    </Modal>}
  </div>;
}

function AircraftPage(){
  const[pi,setPi]=useState(0);const[lb,setLb]=useState(false);const[tab,setTab]=useState("times");
  const[sqF,setSqF]=useState("open");const[sqs,setSqs]=useState(SQUAWKS);const[newSq,setNewSq]=useState("");const[sqMod,setSqMod]=useState(false);const[sqDone,setSqDone]=useState(false);
  const oilLeft=(3260-3241.6).toFixed(1);
  const vis=sqs.filter(s=>sqF==="all"||s.status===sqF);
  const TABS=[{id:"times",l:"Times"},{id:"desc",l:"Description"},{id:"equip",l:"Equipment"},{id:"specs",l:"Specs"}];
  const submitSq=()=>{if(!newSq.trim())return;setSqs(p=>[{id:Date.now(),date:new Date().toLocaleDateString(),desc:newSq,status:"open",res:"Pending A&P review."},...p]);setNewSq("");setSqDone(true);setTimeout(()=>{setSqDone(false);setSqMod(false);},1500);};
  const stCol=s=>s==="expired"||s==="x"?C.red:s==="ok"?C.green:C.amb;
  return <div style={{display:"flex",flexDirection:"column"}}>
    <div style={{position:"relative",height:240,overflow:"hidden",flexShrink:0}}>
      <img src={PHOTOS[pi].src} alt={PHOTOS[pi].cap} style={{width:"100%",height:"100%",objectFit:"cover",cursor:"pointer"}} onClick={()=>setLb(true)}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(0,0,0,.1) 0%,rgba(0,0,0,0) 40%,rgba(0,0,0,.65) 100%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:12,left:12,background:"rgba(0,0,0,.55)",borderRadius:10,padding:"5px 12px"}}><div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#fff",lineHeight:1}}>N36JR</div><div style={{color:"rgba(255,255,255,.65)",fontSize:9,letterSpacing:".06em",fontFamily:"sans-serif"}}>2012 CESSNA 172 SKYHAWK SP</div></div>
      <div style={{position:"absolute",top:12,right:12,display:"flex",alignItems:"center",gap:5,background:"rgba(0,0,0,.5)",border:"1px solid "+C.green+"66",borderRadius:20,padding:"4px 10px"}}><div style={{width:7,height:7,borderRadius:"50%",background:C.green,boxShadow:"0 0 6px "+C.green}}/><span style={{color:C.green,fontSize:11,fontWeight:700,fontFamily:"sans-serif"}}>Available</span></div>
      <button onClick={()=>setPi(i=>(i-1+PHOTOS.length)%PHOTOS.length)} style={{position:"absolute",top:"40%",left:8,width:30,height:30,borderRadius:"50%",background:"rgba(0,0,0,.4)",border:"1px solid rgba(255,255,255,.3)",color:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
      <button onClick={()=>setPi(i=>(i+1)%PHOTOS.length)} style={{position:"absolute",top:"40%",right:8,width:30,height:30,borderRadius:"50%",background:"rgba(0,0,0,.4)",border:"1px solid rgba(255,255,255,.3)",color:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"5px 8px",background:"rgba(0,0,0,.5)",display:"flex",gap:3,overflowX:"auto"}}>
        {PHOTOS.map((p,i)=><div key={p.id} onClick={()=>setPi(i)} style={{width:42,height:28,flexShrink:0,borderRadius:4,overflow:"hidden",cursor:"pointer",border:"2px solid "+(i===pi?"#fff":"transparent")}}><img src={p.src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>)}
      </div>
    </div>
    <div style={{background:C.dark,display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderBottom:"2px solid "+C.amber+"44"}}>
      {[["Hobbs","3241.6","hrs"],["Year","2012",""],["Engine","180 HP","IO-360"],["Rate","$165","/ hr wet"]].map(([l,v,u],i)=>(
        <div key={l} style={{padding:"12px 6px",borderRight:i<3?"1px solid rgba(255,255,255,.08)":undefined,textAlign:"center"}}><div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:800,color:C.amberL}}>{v}</div><div style={{color:C.stone,fontSize:9,textTransform:"uppercase",letterSpacing:".06em",fontFamily:"sans-serif",marginTop:2}}>{l}</div>{u&&<div style={{color:"rgba(255,255,255,.3)",fontSize:8,fontFamily:"sans-serif"}}>{u}</div>}</div>
      ))}
    </div>
    <div style={{display:"flex",borderBottom:"1px solid "+C.tan,background:C.white,overflowX:"auto"}}>
      {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 16px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"sans-serif",fontSize:13,fontWeight:tab===t.id?700:400,color:tab===t.id?C.blue:C.stone,borderBottom:"2px solid "+(tab===t.id?C.blue:"transparent"),whiteSpace:"nowrap"}}>{t.l}</button>)}
    </div>
    <div style={{padding:"16px 16px 40px",display:"flex",flexDirection:"column",gap:14}}>
      {tab==="times"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700}}>Aircraft Times</div>
        {[["Total Time","8,241.6 hrs"],["Engine Time","1,241.6 hrs"],["Hobbs","3,241.6 hrs"],["Oil Due","@ 3,260.0 hrs ("+oilLeft+" hrs remaining)"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid "+C.tan}}><span style={{color:C.stone,fontSize:14,fontFamily:"sans-serif"}}>{l}</span><span style={{fontWeight:700,fontFamily:"sans-serif"}}>{v}</span></div>
        ))}
        <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,marginTop:6}}>Maintenance Reminders</div>
        {REMINDERS.map(r=><div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",borderRadius:10,background:stCol(r.st)+"10",border:"1px solid "+stCol(r.st)+"44"}}>
          <div><div style={{fontSize:13,fontWeight:700,fontFamily:"sans-serif"}}>{r.name}</div><div style={{color:C.stone,fontSize:11,fontFamily:"sans-serif",marginTop:2}}>Last: {r.last}</div></div>
          <Bdg col={stCol(r.st)}>{r.st==="ok"?"✓ OK":r.st==="x"?"EXPIRED":r.days+" days"}</Bdg>
        </div>)}
      </>}
      {tab==="desc"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700}}>About N36JR</div>
        <div style={{color:"#555",fontSize:14,lineHeight:1.8,fontFamily:"sans-serif"}}>N36JR is a 2012 Cessna 172 Skyhawk SP equipped with the Garmin G1000 NXi integrated flight deck and GFC700 autopilot. Based at Essex County Airport (KCDW) in Caldwell, New Jersey, she is maintained to the highest standards and is IFR certified.</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700}}>Squawks</div>
        <div style={{display:"flex",gap:8,marginBottom:8}}>{["open","closed","all"].map(s=><button key={s} onClick={()=>setSqF(s)} style={{padding:"6px 14px",borderRadius:20,cursor:"pointer",fontWeight:600,fontSize:12,fontFamily:"sans-serif",border:"1.5px solid "+(sqF===s?C.blue:C.tan),background:sqF===s?C.blueP:C.white,color:sqF===s?C.blue:C.stone}}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>)}</div>
        {vis.map(sq=><div key={sq.id} style={{padding:"12px 14px",borderRadius:10,border:"1px solid "+C.tan,marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontWeight:700,fontSize:13,fontFamily:"sans-serif"}}>{sq.desc}</span><Bdg col={sq.status==="open"?C.amb:C.green}>{sq.status}</Bdg></div><div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif"}}>{sq.date} · {sq.res}</div></div>)}
        <button onClick={()=>setSqMod(true)} style={{background:C.blue,color:"#fff",border:"none",borderRadius:10,padding:"12px 0",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"sans-serif"}}>+ Report Squawk</button>
        {sqMod&&<Modal onClose={()=>setSqMod(false)}>
          {sqDone?<div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:44,marginBottom:10}}>✅</div><div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700}}>Squawk Reported</div></div>:<div style={{display:"flex",flexDirection:"column",gap:14}}><div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700}}>Report a Squawk</div><Fld label="Description"><textarea style={{...iSt,resize:"none"}} rows={3} value={newSq} onChange={e=>setNewSq(e.target.value)} placeholder="Describe the discrepancy…"/></Fld><div style={{display:"flex",gap:10}}><Btn v="ol" style={{flex:1}} onClick={()=>setSqMod(false)}>Cancel</Btn><Btn style={{flex:2}} disabled={!newSq.trim()} onClick={submitSq}>Submit</Btn></div></div>}
        </Modal>}
      </>}
      {tab==="equip"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700}}>Equipment</div>
        {[["Avionics","Garmin G1000 NXi Integrated Flight Deck"],["Autopilot","Garmin GFC700 Digital Autopilot"],["GPS","Garmin GTN 650Xi Nav/Comm/GPS"],["Engine","Lycoming IO-360-L2A, 180 HP"],["Propeller","McCauley 3-blade constant speed"],["Fuel","100LL Avgas — wet rate, fueled at KCDW"],["ADS-B","ADS-B Out (1090ES) — ADS-B In capable"],["ELT","ACK E-04 406 MHz ELT"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid "+C.tan,gap:10}}><span style={{color:C.stone,fontSize:13,fontFamily:"sans-serif",flexShrink:0}}>{l}</span><span style={{fontWeight:600,fontSize:13,fontFamily:"sans-serif",textAlign:"right"}}>{v}</span></div>
        ))}
      </>}
      {tab==="specs"&&<>
        <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700}}>Specifications</div>
        {[["Make / Model","2012 Cessna 172 Skyhawk SP"],["Registration","N36JR"],["Cruise Speed","122 ktas"],["Range","640 nm"],["Service Ceiling","14,000 ft"],["Useful Load","878 lbs"],["Fuel Capacity","53 gal"],["Seats","4"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid "+C.tan}}><span style={{color:C.stone,fontSize:13,fontFamily:"sans-serif"}}>{l}</span><span style={{fontWeight:600,fontSize:13,fontFamily:"sans-serif"}}>{v}</span></div>
        ))}
      </>}
    </div>
    {lb&&<div onClick={()=>setLb(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:900,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}><img src={PHOTOS[pi].src} alt={PHOTOS[pi].cap} style={{maxWidth:"100%",maxHeight:"90vh",borderRadius:10,objectFit:"contain"}}/></div>}
  </div>;
}


// ─── Billing ──────────────────────────────────────────────────────────────────
function AddFundsModal({onClose,deposit}){
  const[step,setStep]=useState(1);const[method,setMethod]=useState("card");const[amt,setAmt]=useState(1000);const[done,setDone]=useState(false);
  const[cardNum,setCardNum]=useState("");const[expiry,setExpiry]=useState("");const[cvv,setCvv]=useState("");
  const[routing,setRouting]=useState("");const[acct,setAcct]=useState("");
  const submit=()=>{const last4=method==="card"?cardNum.slice(-4):acct.slice(-4);deposit(amt,method,last4);setDone(true);};
  if(done)return <div style={{textAlign:"center",padding:"20px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
    <div style={{fontSize:52}}>✅</div>
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
          {[["card","💳 Credit Card"],["ach","🏦 Bank (ACH)"]].map(([m,l])=><button key={m} onClick={()=>setMethod(m)} style={{flex:1,padding:"10px 0",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"sans-serif",border:"2px solid "+(method===m?C.blue:C.tan),background:method===m?C.blueP:C.white,color:method===m?C.blue:C.stone}}>{l}</button>)}
        </div>
      </Fld>
      <Btn onClick={()=>setStep(2)}>Continue →</Btn>
    </>}
    {step===2&&<>
      {method==="card"?<>
        <Fld label="Card Number"><input style={iSt} maxLength={19} value={cardNum} onChange={e=>setCardNum(e.target.value.replace(/[^0-9]/g,"").replace(/(.{4})/g,"$1 ").trim())} placeholder="4242 4242 4242 4242"/></Fld>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Fld label="Expiry"><input style={iSt} maxLength={5} value={expiry} onChange={e=>setExpiry(e.target.value)} placeholder="MM/YY"/></Fld>
          <Fld label="CVV"><input style={iSt} maxLength={4} type="password" value={cvv} onChange={e=>setCvv(e.target.value.replace(/[^0-9]/g,""))} placeholder="•••"/></Fld>
        </div>
      </>:<>
        <Fld label="Routing Number"><input style={iSt} maxLength={9} value={routing} onChange={e=>setRouting(e.target.value.replace(/[^0-9]/g,""))} placeholder="021000021"/></Fld>
        <Fld label="Account Number"><input style={iSt} value={acct} onChange={e=>setAcct(e.target.value.replace(/[^0-9]/g,""))} type="password"/></Fld>
      </>}
      <div style={{background:C.parch,borderRadius:10,padding:"11px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:C.stone,fontFamily:"sans-serif",fontSize:13}}>Amount to add</span><span style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700}}>{$$(amt)}</span></div>
      <div style={{display:"flex",gap:10}}><Btn v="ol" style={{flex:1}} onClick={()=>setStep(1)}>← Back</Btn><Btn style={{flex:2}} disabled={method==="card"?cardNum.length<16||!expiry||!cvv:routing.length!==9||!acct} onClick={submit}>Add {$$(amt)}</Btn></div>
    </>}
  </div>;
}

function BillingPage({bal,txns,invs,deposit}){
  const[tab,setTab]=useState("balance");const[addFunds,setAddFunds]=useState(false);const[openInv,setOpenInv]=useState(null);
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
      {tab==="balance"&&<>{txns.map(t=><div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid "+C.tan+"88"}}>
        <div><div style={{fontWeight:600,fontSize:13,fontFamily:"sans-serif",marginBottom:2}}>{t.desc}</div><div style={{color:C.stone,fontSize:11,fontFamily:"sans-serif"}}>{t.date}</div></div>
        <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:t.amt>0?C.green:C.dark}}>{t.amt>0?"+":""}{$$(t.amt)}</div>
      </div>)}</>}
      {tab==="invoices"&&<>{invs.map(inv=><div key={inv.id}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid "+C.tan+"88",cursor:"pointer"}} onClick={()=>setOpenInv(openInv===inv.id?null:inv.id)}>
        <div><div style={{fontWeight:600,fontSize:14,fontFamily:"sans-serif"}}>Invoice #{inv.id}</div><div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",marginTop:2}}>{inv.date}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700}}>{$$(inv.total)}</div><Bdg col={C.green}>Paid</Bdg></div>
      </div>{openInv===inv.id&&<div style={{background:C.cream,borderRadius:10,padding:"12px 14px",marginBottom:8}}>
        {inv.items.map(it=><div key={it.d} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid "+C.tan+"55"}}><span style={{color:C.darkL,fontSize:12,fontFamily:"sans-serif"}}>{it.d}</span><span style={{fontWeight:700,fontSize:12,fontFamily:"sans-serif"}}>{$$(it.a)}</span></div>)}
      </div>}</div>)}</>}
      {tab==="rates"&&<>{[["Aircraft Rental","$165/hr","Hobbs-based, fuel included"],["Membership Dues","$80/mo","Month-to-month"],["Capt. Mike Torres","$85/hr","CFI/CFII/MEI · Checkout auth"],["Lisa Chen","$75/hr","CFI/CFII"],["Ryan Brooks","$65/hr","CFI · On leave"]].map(([l,v,d])=><div key={l} style={{padding:"14px 0",borderBottom:"1px solid "+C.tan+"88"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}><span style={{fontWeight:700,fontSize:14,fontFamily:"sans-serif"}}>{l}</span><span style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:C.blue}}>{v}</span></div>
        <div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif"}}>{d}</div>
      </div>)}</>}
    </div>
    {addFunds&&<Modal onClose={()=>setAddFunds(false)}><AddFundsModal onClose={()=>setAddFunds(false)} deposit={deposit}/></Modal>}
  </div>;
}

function AccountPage({geo,user}){
  const docs=[["Rental Agreement","Current"],["Member Handbook","2026"],["Emergency Procedures","Rev. 3"],["Privacy Policy","2025"]];
  return <div style={{display:"flex",flexDirection:"column",padding:"16px 16px 40px",gap:16}}>
    <Card style={{padding:18}}>
      <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:14}}>
        <div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,"+C.blue+",#1044A0)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:"#fff",flexShrink:0}}>{user?.init||"?"}</div>
        <div><div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700}}>{user?.name||"Member"}</div><div style={{color:C.stone,fontSize:13,fontFamily:"sans-serif",marginTop:2}}>{user?.email||""}</div><Bdg col={C.green}>Active Member</Bdg></div>
      </div>
      {[["Member Since","January 2026"],["Membership","Month-to-Month · $80/mo"],["Status","Active & Current"]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid "+C.tan+"66"}}><span style={{color:C.stone,fontSize:13,fontFamily:"sans-serif"}}>{l}</span><span style={{fontWeight:600,fontSize:13,fontFamily:"sans-serif"}}>{v}</span></div>)}
    </Card>
    <Card style={{padding:16}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,marginBottom:12}}>Location Services</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:13,fontFamily:"sans-serif",fontWeight:600}}>Location Access</div><div style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",marginTop:2}}>{geo.ok?`${geo.dist?geo.dist.toFixed(1)+" mi from KCDW":"Enabled"}`:"Not enabled"}</div></div>
        <Bdg col={geo.ok?C.green:C.stone}>{geo.ok?"Active":"Off"}</Bdg>
      </div>
    </Card>
    <Card style={{padding:16}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,marginBottom:12}}>Club Documents</div>
      {docs.map(([name,ver,type])=><div key={name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid "+C.tan+"66"}}>
        <div><div style={{fontSize:13,fontWeight:600,fontFamily:"sans-serif"}}>{name}</div><div style={{color:C.stone,fontSize:11,fontFamily:"sans-serif"}}>{ver}</div></div>
        <button style={{background:C.blueP,color:C.blue,border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"sans-serif"}}>↓</button>
      </div>)}
    </Card>
  </div>;
}


// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV_MEMBER=[
  {id:"about",ic:"🏡",l:"About the Club"},{id:"home",ic:"🏠",l:"Home"},{id:"schedule",ic:"📅",l:"Schedule"},
  {id:"instructors",ic:"🎓",l:"Instructors"},{id:"aircraft",ic:"✈️",l:"Aircraft — N36JR"},
  {id:"hobbs",ic:"📷",l:"Log Hobbs"},{id:"billing",ic:"💳",l:"Billing"},{id:"account",ic:"👤",l:"My Account"},
];
const NAV_INSTRUCTOR=[
  {id:"about",ic:"🏡",l:"About the Club"},{id:"instr_checkouts",ic:"✅",l:"Checkouts"},
  {id:"instr_schedule",ic:"📅",l:"My Schedule"},{id:"instr_members",ic:"👥",l:"Members"},
  {id:"instr_employee",ic:"📋",l:"HR & Payroll"},{id:"account",ic:"👤",l:"My Account"},
];
function NavDrawer({page,setPage,onClose,nav=NAV_MEMBER}){
  return <>
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",zIndex:499}}/>
    <div style={{position:"fixed",top:0,left:0,bottom:0,width:275,background:C.white,zIndex:500,boxShadow:"4px 0 24px rgba(0,0,0,.15)",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"18px 22px 14px",borderBottom:"1px solid #f0f0f0"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,borderRadius:7,background:"linear-gradient(135deg,#C8852A,#1C1A17)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:15}}>✈</div>
          <div><div style={{fontFamily:"Georgia,serif",fontSize:14,fontWeight:700}}>KCDW Flying Club</div><div style={{color:C.amber,fontSize:9,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",fontFamily:"sans-serif"}}>MEMBER PORTAL</div></div>
        </div>
      </div>
      <nav style={{flex:1,padding:"6px 0"}}>
        {nav.map(n=>(
          <button key={n.id} className={"ni"+(page===n.id?" na":"")} onClick={()=>{setPage(n.id);onClose();}}>
            <span style={{fontSize:17,width:22}}>{n.ic}</span>{n.l}
          </button>
        ))}
      </nav>
      <div style={{padding:"14px 22px",color:"#9ca3af",fontSize:12,fontFamily:"sans-serif"}}>© 2026 KCDW Flying Club</div>
    </div>
  </>;
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App(){
  // "landing" = marketing page | "guest" = portal browsing | "onboarding" = join flow | "portal" = signed in
  const[auth,setAuth]=useState("guest");
  const[user,setUser]=useState(null);
  const[page,setPage]=useState("about");
  const[drawer,setDrawer]=useState(false);
  const[showLoginModal,setShowLoginModal]=useState(false);
  const[checkouts,setCheckouts]=useState(SEED_CHECKOUTS);
  const geo=useGeo();
  const{bal,txns,invs,charge,deposit}=useBilling();
  const isInstructor=user&&user.role==="instructor";
  const memberCheckout=user?checkouts.find(c=>c.memberId===user.email&&c.status==="approved"):null;
  const memberCheckoutPending=user?checkouts.find(c=>c.memberId===user.email&&c.status==="pending"):null;
  // Full-screen flows
  // "landing" is now just "guest" viewing the about page - no separate full-screen return
  if(auth==="onboarding")return <><InjectCSS/><div style={{maxWidth:480,margin:"0 auto"}}><OnboardingFlow onDone={f=>{setUser({name:f.firstName+" "+f.lastName,email:f.email,init:(f.firstName[0]||"")+(f.lastName[0]||""),role:"member"});setAuth("portal");}}/></div></>;
    // Instructors use the main portal shell with extra pages

  const isGuest=auth==="guest";
  const name=user&&user.name&&user.name.split(" ")[0]||"Guest";
  const init=user&&user.init||"✈";
  const requireAuth=(Comp,props)=>{
    if(!isGuest)return <Comp {...props}/>;
    return <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 32px",gap:18,textAlign:"center"}}>
      <div style={{fontSize:52}}>✈️</div>
      <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:C.dark}}>Members Only</div>
      <div style={{color:C.stone,fontSize:14,lineHeight:1.6,maxWidth:280,fontFamily:"sans-serif"}}>Sign up for a KCDW Flying Club account to access this page.</div>
      <Btn onClick={()=>setAuth("onboarding")} style={{maxWidth:260}}>Join the Club — Free to Sign Up</Btn>
      <button onClick={()=>setAuth("login")} style={{background:"none",border:"none",color:C.blue,cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:"sans-serif"}}>Already a member? Sign In</button>
    </div>;
  };
  const pages={
    about:<AboutPage onJoin={()=>setAuth("onboarding")} onSignIn={()=>setShowLoginModal(true)} setPage={setPage}/>,
    home:<HomePage setPage={setPage} geo={geo} invs={isGuest?[]:invs} bal={isGuest?null:bal} name={isGuest?"Guest":name}/>,
    schedule:isGuest?<ScheduleGate onJoin={()=>setAuth("onboarding")} onSignIn={()=>setShowLoginModal(true)}/>:<SchedulePage geo={geo} checkoutComplete={!!memberCheckout} checkoutPending={!!memberCheckoutPending}/>,
    instructors:<InstructorsPage/>,
    aircraft:<AircraftPage/>,
    hobbs:requireAuth(HobbsPage,{geo,charge,setPage}),
    billing:requireAuth(BillingPage,{bal,txns,invs,deposit}),
    account:requireAuth(AccountPage,{geo,user}),
    instr_checkouts:isInstructor?<CheckoutTab instructor={user} checkouts={checkouts} setCheckouts={setCheckouts}/>:<div/>,
    instr_schedule:isInstructor?<InstrScheduleTab instructor={user}/>:<div/>,
    instr_members:isInstructor?<MembersTab checkouts={checkouts}/>:<div/>,
    instr_employee:isInstructor?<EmployeeTab instructor={user}/>:<div/>,
    };
  return <>
    <InjectCSS/>
    <div style={{maxWidth:480,margin:"0 auto",height:"100vh",display:"flex",flexDirection:"column",background:C.bg,position:"relative",overflow:"hidden"}}>
      {/* Guest sign-up banner */}
      {isGuest&&<div style={{background:"linear-gradient(90deg,#1C1A17,#2E2B26)",padding:"7px 14px",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <button onClick={()=>setAuth("landing")} style={{background:"none",border:"1px solid rgba(255,255,255,.2)",borderRadius:7,padding:"5px 10px",fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:"sans-serif",color:"rgba(255,255,255,.6)",flexShrink:0,whiteSpace:"nowrap"}}>← Site</button>
        <span style={{color:C.amberL,fontSize:12,fontFamily:"sans-serif",flex:1,lineHeight:1.4}}><strong style={{color:"#fff"}}>Join KCDW Flying Club</strong> to book flights, log Hobbs & more.</span>
        <button onClick={()=>setAuth("onboarding")} style={{background:C.amber,color:"#fff",border:"none",borderRadius:7,padding:"6px 12px",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"sans-serif",flexShrink:0}}>Sign Up</button>
      </div>}
      {/* Top nav */}
      <div style={{background:C.white,borderBottom:"1px solid #e5e7eb",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setDrawer(true)} style={{background:"none",border:"none",cursor:"pointer",padding:4,display:"flex",flexDirection:"column",gap:4}}>
            {[0,1,2].map(i=><div key={i} style={{width:20,height:2,background:C.dark,borderRadius:1}}/>)}
          </button>
          <span style={{fontSize:15,fontWeight:700,fontFamily:"sans-serif",cursor:"pointer"}} onClick={()=>isGuest&&setAuth("landing")}>KCDW Flying Club</span>
          {isInstructor&&<span style={{background:C.blue+"15",color:C.blue,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,fontFamily:"sans-serif",marginLeft:8}}>INSTRUCTOR</span>}
          {isInstructor&&<span style={{background:C.blue+"15",color:C.blue,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,fontFamily:"sans-serif"}}>INSTRUCTOR</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {isGuest?(
            <button onClick={()=>setShowLoginModal(true)} style={{background:C.blue,color:"#fff",border:"none",borderRadius:20,padding:"5px 14px",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"sans-serif"}}>Sign In</button>
          ):(
            <>
              <button onClick={()=>setPage("billing")} style={{background:bal>0?C.green+"15":C.red+"15",border:"1px solid "+(bal>0?C.green+"44":C.red+"44"),borderRadius:20,padding:"3px 10px",cursor:"pointer"}}>
                <span style={{fontSize:11,fontWeight:700,color:bal>0?C.green:C.red,fontFamily:"sans-serif"}}>💳 {$$(bal)}</span>
              </button>
              <div style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer"}} onClick={()=>setPage("account")}>
                <div style={{width:26,height:26,borderRadius:"50%",background:"linear-gradient(135deg,#C8852A,#E09A40)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10,fontWeight:800}}>{init}</div>
                <span style={{color:C.stone,fontSize:13,fontWeight:600,fontFamily:"sans-serif"}}>{name} ▾</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto"}}>{pages[page]||pages.about}</div>
      {/* Bottom tab bar - always visible */}
      <div style={{flexShrink:0,background:C.white,borderTop:"1px solid #e5e7eb",display:"flex",alignItems:"stretch",zIndex:90}}>
        {(isInstructor?[
          {id:"instr_checkouts",ic:"✅",l:"Checkouts",badge:checkouts.filter(c=>c.status==="pending"&&c.instructorId===user.instructorId).length},
          {id:"instr_schedule",ic:"📅",l:"Schedule",badge:0},
          {id:"instr_members",ic:"👥",l:"Members",badge:0},
          {id:"instr_employee",ic:"📋",l:"HR & Pay",badge:0},
          {id:"account",ic:"👤",l:"Account",badge:0},
        ]:[
          {id:"about",ic:"🏡",l:"Home",badge:0},
          {id:"schedule",ic:"📅",l:"Schedule",badge:0},
          {id:"aircraft",ic:"✈️",l:"Aircraft",badge:0},
          {id:"instructors",ic:"🎓",l:"Instructors",badge:0},
          {id:"apply_instructor",ic:"🛩️",l:"Teach",badge:0},
          {id:"account",ic:"👤",l:isGuest?"Join":"Account",badge:0},
        ]).map(t=>(
          <button key={t.id} onClick={()=>t.id==="account"&&isGuest?setAuth("onboarding"):setPage(t.id)}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,padding:"8px 0 10px",border:"none",background:"transparent",cursor:"pointer",borderTop:"2px solid "+(page===t.id?C.amber:"transparent"),position:"relative"}}>
            <span style={{fontSize:18,lineHeight:1}}>{t.ic}</span>
            <span style={{fontSize:9,fontWeight:page===t.id?700:500,color:page===t.id?C.amber:C.stone,fontFamily:"sans-serif",letterSpacing:".02em"}}>{t.l}</span>
            {t.badge>0&&<div style={{position:"absolute",top:4,right:"calc(50% - 16px)",width:15,height:15,borderRadius:"50%",background:C.red,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:"#fff",fontSize:9,fontWeight:800}}>{t.badge}</span>
            </div>}
          </button>
        ))}
      </div>
      {drawer&&<NavDrawer page={page} setPage={setPage} onClose={()=>setDrawer(false)} nav={isInstructor?NAV_INSTRUCTOR:NAV_MEMBER}/>}
      {/* Login modal */}
      {showLoginModal&&<div onClick={()=>setShowLoginModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:800,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
        <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,padding:"24px 20px 40px"}}>
          <div style={{width:40,height:4,borderRadius:2,background:C.tan,margin:"0 auto 20px"}}/>
          <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,marginBottom:18}}>Member Sign In</div>
          <SignInForm onLogin={u=>{setUser(u);setAuth("portal");setShowLoginModal(false);setPage(u.role==="instructor"?"instr_checkouts":"home");}} onJoin={()=>{setShowLoginModal(false);setAuth("onboarding");}}/>
        </div>
      </div>}
    </div>
  </>;
}
function HobbsPage({geo,charge,setPage}){
  const[before,setBefore]=useState("");const[after,setAfter]=useState("");
  const[instrName,setInstrName]=useState("");const[instrHrs,setInstrHrs]=useState("");
  const[submitting,setSubmitting]=useState(false);const[receipt,setReceipt]=useState(null);
  const[bUp,setBUp]=useState(false);const[aUp,setAUp]=useState(false);
  const[bReading,setBReading]=useState(false);const[aReading,setAReading]=useState(false);
  const[bErr,setBErr]=useState("");const[aErr,setAErr]=useState("");
  const[bImg,setBImg]=useState(null);const[aImg,setAImg]=useState(null);
  const bRef=useRef();const aRef=useRef();
  const ft=before&&after&&parseFloat(after)>parseFloat(before)?(parseFloat(after)-parseFloat(before)).toFixed(1):null;
  const acCharge=ft?parseFloat(ft)*165:0;
  const instrR=INSTRUCTORS.find(i=>i.name===instrName);
  const instrCharge=instrHrs&&instrR?parseFloat(instrHrs)*instrR.rate:0;
  const total=acCharge+instrCharge;

  const readMeter=(file,b64,setBVal,setReading,setErr,setUp,setImg)=>{
    setUp(true);setImg(b64);setErr("");setReading(true);
    fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:100,
        messages:[{role:"user",content:[
          {type:"image",source:{type:"base64",media_type:file.type,data:b64.split(",")[1]}},
          {type:"text",text:"This is an aircraft Hobbs meter photo. Extract only the numeric reading shown. Respond with ONLY the number (e.g. 3241.6). If unreadable, respond with UNREADABLE."}
        ]}]})})
    .then(r=>r.json()).then(d=>{
      const txt=(d.content&&d.content[0]&&d.content[0].text||"").trim();
      if(txt==="UNREADABLE"||!/^\d+\.?\d*$/.test(txt)){setErr("Could not read meter — please enter manually.");setReading(false);}
      else{setBVal(txt);setReading(false);}
    }).catch(()=>{setErr("Reading failed — please enter manually.");setReading(false);});
  };

  const handleFile=(e,setBVal,setReading,setErr,setUp,setImg)=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>readMeter(file,ev.target.result,setBVal,setReading,setErr,setUp,setImg);
    reader.readAsDataURL(file);
  };

  const submit=()=>{
    if(!ft||!before||!after)return;
    setSubmitting(true);
    setTimeout(()=>{
      const items=[{d:`Aircraft time N36JR (${ft} hrs)`,q:`${ft} hrs`,r:165,a:acCharge}];
      if(instrCharge>0)items.push({d:`Instruction — ${instrName} (${instrHrs} hrs)`,q:`${instrHrs} hrs`,r:instrR.rate,a:instrCharge});
      setReceipt({items,total,hobbs:{before,after,ft}});
      setSubmitting(false);
    },1200);
  };

  const UploadZone=({label,icon,reading,err,img,ref,uploaded,val,setVal,onFile})=>(
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <Lbl>{label}</Lbl>
        {uploaded&&!reading&&<span style={{fontSize:9,color:err?C.stone:C.green,fontFamily:"sans-serif",fontWeight:600}}>{err?"manual entry":"✦ AI read"}</span>}
      </div>
      <input type="file" accept="image/*" capture="environment" ref={ref} style={{display:"none"}} onChange={onFile}/>
      <div onClick={()=>!reading&&ref.current&&ref.current.click()}
        style={{border:"2px dashed "+(uploaded?C.green:C.tan),borderRadius:10,padding:"14px 8px",textAlign:"center",cursor:reading?"wait":"pointer",background:uploaded?C.green+"0a":"#fafafa",position:"relative",overflow:"hidden",minHeight:80,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}>
        {img&&<img src={img} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.15,borderRadius:8}}/>}
        {reading?<><div style={{width:20,height:20,border:"2.5px solid "+C.amber,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite"}}/><span style={{color:C.amber,fontSize:11,fontWeight:700,fontFamily:"sans-serif",position:"relative"}}>Reading meter…</span></>
        :uploaded?<><span style={{fontSize:18,position:"relative"}}>✅</span><span style={{color:C.green,fontSize:11,fontWeight:700,fontFamily:"sans-serif",position:"relative"}}>Photo uploaded · tap to replace</span></>
        :<><span style={{fontSize:22}}>{icon}</span><span style={{color:C.stone,fontSize:11,fontFamily:"sans-serif"}}>Tap to photograph Hobbs meter</span><span style={{color:C.stoneL,fontSize:10,fontFamily:"sans-serif"}}>AI reads the number automatically</span></>}
      </div>
      {err&&<div style={{color:C.red,fontSize:11,fontFamily:"sans-serif"}}>{err}</div>}
      <input style={{...iSt,borderColor:val&&!reading?C.green:C.tan,background:val&&!reading?C.green+"08":"#fafafa"}}
        type="number" step=".1" value={val} onChange={e=>setVal(e.target.value)} placeholder={label==="Before Flight"?"3241.6":"3243.4"}/>
    </div>
  );

  if(receipt)return <div style={{padding:"24px 18px",display:"flex",flexDirection:"column",gap:16,alignItems:"center",textAlign:"center"}}>
    <div style={{fontSize:56}}>✅</div>
    <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700}}>Flight Logged!</div>
    <div style={{background:C.dark,borderRadius:16,padding:"18px 20px",width:"100%",textAlign:"left"}}>
      <div style={{color:C.stone,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",fontFamily:"sans-serif",marginBottom:10}}>Receipt</div>
      {receipt.items.map(it=><div key={it.d} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:C.stone,fontSize:13,fontFamily:"sans-serif"}}>{it.d}</span><span style={{color:C.amberL,fontWeight:700,fontSize:13,fontFamily:"sans-serif"}}>{$$(it.a)}</span></div>)}
      <div style={{borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:10,marginTop:4,display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,color:"#fff"}}>Total</span><span style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:C.amberL}}>{$$(receipt.total)}</span></div>
    </div>
    <div style={{color:C.stone,fontSize:13,fontFamily:"sans-serif"}}>Hobbs {receipt.hobbs.before} → {receipt.hobbs.after} · {receipt.hobbs.ft} hrs · Charged to account</div>
    <Btn onClick={()=>setPage("home")}>Back to Home</Btn>
  </div>;

  return <div style={{padding:"16px 16px 40px",display:"flex",flexDirection:"column",gap:16}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>Log Hobbs Time</div>
    {geo.near&&<div style={{background:C.amber+"15",border:"1.5px solid "+C.amber+"55",borderRadius:12,padding:"12px 14px",display:"flex",gap:10,alignItems:"center"}}>
      <div className="rdot"/><div><div style={{fontWeight:700,fontSize:13,fontFamily:"sans-serif",color:C.amber}}>You are at KCDW!</div><div style={{color:C.darkL,fontSize:12,fontFamily:"sans-serif"}}>Photograph the Hobbs meter before and after your flight.</div></div>
    </div>}
    <Card style={{padding:16,display:"flex",flexDirection:"column",gap:14}}>
      <div style={{fontWeight:700,fontSize:14,fontFamily:"sans-serif",display:"flex",gap:8,alignItems:"center"}}><span>✈️</span>N36JR — 2012 Cessna 172 Skyhawk SP</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <UploadZone label="Before Flight" icon="🛫" reading={bReading} err={bErr} img={bImg} ref={bRef} uploaded={bUp} val={before} setVal={setBefore}
          onFile={e=>handleFile(e,setBefore,setBReading,setBErr,setBUp,setBImg)}/>
        <UploadZone label="After Flight" icon="🛬" reading={aReading} err={aErr} img={aImg} ref={aRef} uploaded={aUp} val={after} setVal={setAfter}
          onFile={e=>handleFile(e,setAfter,setAReading,setAErr,setAUp,setAImg)}/>
      </div>
      {ft&&<div style={{background:C.blueP,border:"1px solid "+C.blue+"44",borderRadius:8,padding:"10px 12px",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:16}}>⏱</span>
        <span style={{color:C.blue,fontSize:13,fontWeight:700,fontFamily:"sans-serif"}}>{ft} Hobbs hours</span>
        <span style={{color:C.stone,fontSize:12,fontFamily:"sans-serif",marginLeft:"auto"}}>{$$(acCharge)} aircraft charge</span>
      </div>}
    </Card>
    <Card style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
      <div style={{fontWeight:700,fontSize:14,fontFamily:"sans-serif"}}>Instruction Time (optional)</div>
      <Fld label="Instructor">
        <select style={iSt} value={instrName} onChange={e=>setInstrName(e.target.value)}>
          <option value="">None — solo flight</option>
          {INSTRUCTORS.filter(i=>i.avail).map(i=><option key={i.id} value={i.name}>{i.name} (${i.rate}/hr)</option>)}
        </select>
      </Fld>
      {instrName&&<Fld label="Instruction Hours"><input style={iSt} type="number" step=".1" value={instrHrs} onChange={e=>setInstrHrs(e.target.value)} placeholder="e.g. 1.5"/></Fld>}
    </Card>
    {ft&&<Card style={{padding:16}}>
      <div style={{color:C.stone,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",fontFamily:"sans-serif",marginBottom:10}}>Estimated Charge</div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{color:C.darkL,fontSize:13,fontFamily:"sans-serif"}}>N36JR · {ft} hrs @ $165/hr</span><span style={{fontWeight:700,fontFamily:"sans-serif"}}>{$$(acCharge)}</span></div>
      {instrCharge>0&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{color:C.darkL,fontSize:13,fontFamily:"sans-serif"}}>{instrName.split(" ").slice(-1)[0]} · {instrHrs} hrs @ ${instrR.rate}/hr</span><span style={{fontWeight:700,fontFamily:"sans-serif"}}>{$$(instrCharge)}</span></div>}
      <div style={{borderTop:"1px solid "+C.tan,paddingTop:10,marginTop:4,display:"flex",justifyContent:"space-between"}}>
        <span style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700}}>Total</span>
        <span style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:C.green}}>{$$(total)}</span>
      </div>
    </Card>}
    <Btn disabled={!ft||submitting} onClick={submit}>{submitting?<Spin/>:"Submit & Bill Account"}</Btn>
    <div style={{color:C.stoneL,fontSize:12,textAlign:"center",lineHeight:1.6,fontFamily:"sans-serif"}}>Charges will be deducted from your prepaid account balance. Hobbs photos are stored for club records.</div>
  </div>;
}


