
const APP_RELEASE = "6.1";
const DEFAULT_PROGRAM = [
  {
    id:"upper-a", name:"Upper A – Strength", day:"Mon",
    exercises:[
      ["Bench Press",4,5,8,180,"Chest",["Triceps","Front Delts"]],
      ["Pull-Ups / Lat Pulldown",4,6,10,180,"Back",["Biceps"]],
      ["Incline DB Press",3,8,10,120,"Chest",["Triceps","Front Delts"]],
      ["Barbell Row",3,8,10,120,"Back",["Biceps"]],
      ["Overhead Press",3,8,10,120,"Shoulders",["Triceps"]],
      ["Lateral Raise",3,12,15,75,"Side Delts",[]],
      ["Tricep Pushdown",2,10,15,75,"Triceps",[]],
      ["Barbell Curl",2,10,12,90,"Biceps",[]]
    ]
  },
  {
    id:"lower-a", name:"Lower A", day:"Tue",
    exercises:[
      ["Back Squat",4,6,8,180,"Quads",["Glutes","Hamstrings"]],
      ["Romanian Deadlift",4,8,10,180,"Hamstrings",["Glutes"]],
      ["Leg Press",3,10,12,120,"Quads",["Glutes"]],
      ["Leg Curl",3,10,15,90,"Hamstrings",[]],
      ["Standing Calf Raise",4,12,20,75,"Calves",[]],
      ["Hanging Leg Raise",3,10,15,60,"Core",[]]
    ]
  },
  {
    id:"v-taper", name:"V-Taper / Arms", day:"Wed",
    exercises:[
      ["Weighted Pull-Ups",3,6,10,180,"Back",["Biceps"]],
      ["Single-Arm Lat Pulldown",3,8,12,120,"Back",["Biceps"]],
      ["Cable Lateral Raise",4,12,20,75,"Side Delts",[]],
      ["Rear Delt Fly",4,12,20,75,"Rear Delts",[]],
      ["Incline DB Curl",3,8,12,90,"Biceps",[]],
      ["Hammer Curl",3,10,12,90,"Biceps",[]],
      ["Overhead Tricep Extension",3,10,15,90,"Triceps",[]],
      ["Rope Pushdown",3,10,15,75,"Triceps",[]]
    ]
  },
  {
    id:"upper-b", name:"Upper B – Hypertrophy", day:"Fri",
    exercises:[
      ["Incline Bench Press",4,8,12,150,"Chest",["Triceps","Front Delts"]],
      ["Chest Supported Row",4,8,12,150,"Back",["Biceps"]],
      ["Machine Chest Press",3,10,15,120,"Chest",["Triceps"]],
      ["Seated Cable Row",3,10,15,120,"Back",["Biceps"]],
      ["DB Shoulder Press",3,8,12,120,"Shoulders",["Triceps"]],
      ["Face Pull",3,12,20,75,"Rear Delts",["Back"]],
      ["Pec Deck",2,12,15,75,"Chest",[]],
      ["Cable Curl",2,10,15,75,"Biceps",[]],
      ["Tricep Pushdown",2,10,15,75,"Triceps",[]]
    ]
  },
  {
    id:"lower-b", name:"Lower B", day:"Sat",
    exercises:[
      ["Deadlift",3,4,6,180,"Hamstrings",["Glutes","Back"]],
      ["Front Squat",3,6,10,180,"Quads",["Glutes"]],
      ["Bulgarian Split Squat",3,8,12,120,"Quads",["Glutes"]],
      ["Seated Hamstring Curl",3,10,15,90,"Hamstrings",[]],
      ["Leg Extension",3,12,15,75,"Quads",[]],
      ["Seated Calf Raise",4,12,20,75,"Calves",[]],
      ["Cable Crunch",3,10,15,60,"Core",[]]
    ]
  }
].map(w=>({...w,exercises:w.exercises.map((e,i)=>({
  id:w.id+"-"+i,name:e[0],sets:e[1],repMin:e[2],repMax:e[3],rest:e[4],primary:e[5],secondary:e[6]
}))}));

const TARGETS = {
  Chest:[12,16], Back:[16,20], Shoulders:[10,14], "Side Delts":[8,12], "Rear Delts":[6,10],
  Biceps:[8,12], Triceps:[8,12], Quads:[12,16], Hamstrings:[10,14], Glutes:[8,12], Calves:[6,10], Core:[6,10]
};

const EXERCISE_LIBRARY = [
  {name:"Bench Press",primary:"Chest",secondary:["Triceps","Front Delts"],type:"Compound",equipment:"Barbell",rest:180,repMin:5,repMax:8},
  {name:"Seated Chest Press",primary:"Chest",secondary:["Triceps","Front Delts"],type:"Compound",equipment:"Machine",rest:120,repMin:8,repMax:12},
  {name:"Machine Chest Press",primary:"Chest",secondary:["Triceps"],type:"Compound",equipment:"Machine",rest:120,repMin:10,repMax:15},
  {name:"Incline Bench Press",primary:"Chest",secondary:["Triceps","Front Delts"],type:"Compound",equipment:"Barbell",rest:150,repMin:8,repMax:12},
  {name:"Incline DB Press",primary:"Chest",secondary:["Triceps","Front Delts"],type:"Compound",equipment:"Dumbbell",rest:120,repMin:8,repMax:10},
  {name:"Dumbbell Bench Press",primary:"Chest",secondary:["Triceps","Front Delts"],type:"Compound",equipment:"Dumbbell",rest:120,repMin:8,repMax:12},
  {name:"Smith Machine Bench Press",primary:"Chest",secondary:["Triceps","Front Delts"],type:"Compound",equipment:"Smith Machine",rest:120,repMin:8,repMax:12},
  {name:"Cable Press",primary:"Chest",secondary:["Triceps"],type:"Compound",equipment:"Cable",rest:90,repMin:10,repMax:15},
  {name:"Pec Deck",primary:"Chest",secondary:[],type:"Isolation",equipment:"Machine",rest:75,repMin:12,repMax:15},
  {name:"Pull-Ups / Lat Pulldown",primary:"Back",secondary:["Biceps"],type:"Compound",equipment:"Bodyweight/Machine",rest:180,repMin:6,repMax:10},
  {name:"Assisted Pull-Ups",primary:"Back",secondary:["Biceps"],type:"Compound",equipment:"Assisted Machine",rest:180,repMin:6,repMax:10},
  {name:"Weighted Pull-Ups",primary:"Back",secondary:["Biceps"],type:"Compound",equipment:"Bodyweight",rest:180,repMin:6,repMax:10},
  {name:"Assisted Dips",primary:"Chest",secondary:["Triceps","Front Delts"],type:"Compound",equipment:"Assisted Machine",rest:150,repMin:6,repMax:10},
  {name:"Dips",primary:"Chest",secondary:["Triceps","Front Delts"],type:"Compound",equipment:"Bodyweight",rest:150,repMin:6,repMax:10},
  {name:"Lat Pulldown",primary:"Back",secondary:["Biceps"],type:"Compound",equipment:"Cable",rest:150,repMin:8,repMax:12},
  {name:"Single-Arm Lat Pulldown",primary:"Back",secondary:["Biceps"],type:"Compound",equipment:"Cable",rest:120,repMin:8,repMax:12},
  {name:"Barbell Row",primary:"Back",secondary:["Biceps"],type:"Compound",equipment:"Barbell",rest:120,repMin:8,repMax:10},
  {name:"Chest Supported Row",primary:"Back",secondary:["Biceps"],type:"Compound",equipment:"Machine",rest:150,repMin:8,repMax:12},
  {name:"Seated Cable Row",primary:"Back",secondary:["Biceps"],type:"Compound",equipment:"Cable",rest:120,repMin:10,repMax:15},
  {name:"Overhead Press",primary:"Shoulders",secondary:["Triceps"],type:"Compound",equipment:"Barbell",rest:120,repMin:8,repMax:10},
  {name:"DB Shoulder Press",primary:"Shoulders",secondary:["Triceps"],type:"Compound",equipment:"Dumbbell",rest:120,repMin:8,repMax:12},
  {name:"Lateral Raise",primary:"Side Delts",secondary:[],type:"Isolation",equipment:"Dumbbell",rest:75,repMin:12,repMax:15},
  {name:"Cable Lateral Raise",primary:"Side Delts",secondary:[],type:"Isolation",equipment:"Cable",rest:75,repMin:12,repMax:20},
  {name:"Rear Delt Fly",primary:"Rear Delts",secondary:[],type:"Isolation",equipment:"Machine/Dumbbell",rest:75,repMin:12,repMax:20},
  {name:"Face Pull",primary:"Rear Delts",secondary:["Back"],type:"Isolation",equipment:"Cable",rest:75,repMin:12,repMax:20},
  {name:"Tricep Pushdown",primary:"Triceps",secondary:[],type:"Isolation",equipment:"Cable",rest:75,repMin:10,repMax:15},
  {name:"Overhead Tricep Extension",primary:"Triceps",secondary:[],type:"Isolation",equipment:"Cable/Dumbbell",rest:90,repMin:10,repMax:15},
  {name:"Rope Pushdown",primary:"Triceps",secondary:[],type:"Isolation",equipment:"Cable",rest:75,repMin:10,repMax:15},
  {name:"Barbell Curl",primary:"Biceps",secondary:[],type:"Isolation",equipment:"Barbell",rest:90,repMin:10,repMax:12},
  {name:"Incline DB Curl",primary:"Biceps",secondary:[],type:"Isolation",equipment:"Dumbbell",rest:90,repMin:8,repMax:12},
  {name:"Hammer Curl",primary:"Biceps",secondary:[],type:"Isolation",equipment:"Dumbbell",rest:90,repMin:10,repMax:12},
  {name:"Cable Curl",primary:"Biceps",secondary:[],type:"Isolation",equipment:"Cable",rest:75,repMin:10,repMax:15},
  {name:"Back Squat",primary:"Quads",secondary:["Glutes","Hamstrings"],type:"Compound",equipment:"Barbell",rest:180,repMin:6,repMax:8},
  {name:"Front Squat",primary:"Quads",secondary:["Glutes"],type:"Compound",equipment:"Barbell",rest:180,repMin:6,repMax:10},
  {name:"Leg Press",primary:"Quads",secondary:["Glutes"],type:"Compound",equipment:"Machine",rest:120,repMin:10,repMax:12},
  {name:"Bulgarian Split Squat",primary:"Quads",secondary:["Glutes"],type:"Compound",equipment:"Dumbbell",rest:120,repMin:8,repMax:12},
  {name:"Leg Extension",primary:"Quads",secondary:[],type:"Isolation",equipment:"Machine",rest:75,repMin:12,repMax:15},
  {name:"Romanian Deadlift",primary:"Hamstrings",secondary:["Glutes"],type:"Compound",equipment:"Barbell",rest:180,repMin:8,repMax:10},
  {name:"Deadlift",primary:"Hamstrings",secondary:["Glutes","Back"],type:"Compound",equipment:"Barbell",rest:180,repMin:4,repMax:6},
  {name:"Leg Curl",primary:"Hamstrings",secondary:[],type:"Isolation",equipment:"Machine",rest:90,repMin:10,repMax:15},
  {name:"Seated Hamstring Curl",primary:"Hamstrings",secondary:[],type:"Isolation",equipment:"Machine",rest:90,repMin:10,repMax:15},
  {name:"Standing Calf Raise",primary:"Calves",secondary:[],type:"Isolation",equipment:"Machine",rest:75,repMin:12,repMax:20},
  {name:"Seated Calf Raise",primary:"Calves",secondary:[],type:"Isolation",equipment:"Machine",rest:75,repMin:12,repMax:20},
  {name:"Hanging Leg Raise",primary:"Core",secondary:[],type:"Isolation",equipment:"Bodyweight",rest:60,repMin:10,repMax:15},
  {name:"Cable Crunch",primary:"Core",secondary:[],type:"Isolation",equipment:"Cable",rest:60,repMin:10,repMax:15}
];

let state = JSON.parse(localStorage.getItem("gymState") || "null") || {
  program: DEFAULT_PROGRAM,
  history: [],
  current: null,
  route:"home",
  selectedProgram:"upper-a",
  customExercises:[],
  exercisePrefs:{},
  appVersion:6
};
if(!state.customExercises) state.customExercises=[];
if(!state.exercisePrefs) state.exercisePrefs={};
if(!state.appVersion || state.appVersion<6) state.appVersion=6;

function save(){ localStorage.setItem("gymState",JSON.stringify(state)); }
function qs(sel){return document.querySelector(sel)}
function fmtSec(s){ const m=Math.floor(s/60), sec=s%60; return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`; }
function e1rm(w,r){ if(!(w>0) || !(r>0)) return 0; return +(w*(1+r/30)).toFixed(1); }
function totalSets(w){return w.exercises.reduce((a,e)=>a+e.sets,0)}


function fullExerciseLibrary(){
  const map=new Map();
  [...EXERCISE_LIBRARY,...(state.customExercises||[])].forEach(x=>map.set(x.name.toLowerCase(),x));
  return [...map.values()];
}
function exercisePref(name){
  return state.exercisePrefs?.[name] || {};
}
function exerciseRest(ex){
  return exercisePref(ex.name).rest || ex.rest;
}
function exerciseNotes(name){
  return exercisePref(name).notes || "";
}
function saveExercisePref(name,pref){
  state.exercisePrefs[name]={...(state.exercisePrefs[name]||{}),...pref};
  save();
}
function assistModeFor(name){
  const n=name.toLowerCase();
  if(n.includes("pull-up") || n.includes("pull up") || n.includes("dip")) return true;
  return false;
}
function workoutOrder(){
  return state.program.map(w=>w.id);
}
function workoutById(id){
  return state.program.find(w=>w.id===id);
}
function lastCompletedWorkout(){
  return state.history.length ? state.history[state.history.length-1] : null;
}
function lastCompletedWorkoutId(){
  return lastCompletedWorkout()?.workoutId || null;
}
function recommendedWorkoutId(){
  if(!state.history.length) return state.program[0]?.id || null;
  const order=workoutOrder();
  const lastId=lastCompletedWorkoutId();
  const idx=order.indexOf(lastId);
  if(idx===-1) return state.program[0]?.id || null;
  return order[(idx+1)%order.length];
}
function recentMuscleDays(){
  const muscleLast={};
  const now=Date.now();
  state.history.forEach(h=>{
    h.logs.forEach(l=>{
      if(!l.sets?.length) return;
      [l.primary,...(l.secondary||[])].forEach(m=>{
        muscleLast[m]=Math.max(muscleLast[m]||0,h.end||h.start||0);
      });
    });
  });
  const days={};
  Object.entries(muscleLast).forEach(([m,t])=>days[m]=Math.floor((now-t)/86400000));
  return days;
}
function recommendationReason(workout){
  const last=lastCompletedWorkout();
  const days=recentMuscleDays();
  if(!last) return "Start your programme sequence";
  const muscles=[...new Set(workout.exercises.map(e=>e.primary))];
  const known=muscles.map(m=>days[m]).filter(v=>Number.isFinite(v));
  if(known.length){
    const max=Math.max(...known);
    if(max>=4) return `${muscles[0]} / ${muscles[1]||"related muscles"} last trained ${max} days ago`;
  }
  return `Next in programme after ${last.name}`;
}
function todayLabel(){
  return new Intl.DateTimeFormat(undefined,{weekday:"long",day:"numeric",month:"short"}).format(new Date());
}
function go(route){state.route=route;save();render()}
function toast(msg){ const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}

function nav(active){
  return `<nav class="nav">
    <button class="${active==="home"?"active":""}" onclick="go('home')"><span class="nav-ico">⌂</span>Home</button>
    <button class="${active==="history"?"active":""}" onclick="go('history')"><span class="nav-ico">◴</span>History</button>
    <button class="${active==="stats"?"active":""}" onclick="go('stats')"><span class="nav-ico">⌁</span>Progress</button>
    <button class="${active==="program"?"active":""}" onclick="go('program')"><span class="nav-ico">☷</span>Plan</button>
  </nav>`;
}
function shell(title,subtitle,body,active="home"){
  return `<div class="app-shell">
    <header class="topbar"><div class="title">${title}</div>${subtitle?`<div class="subtitle">${subtitle}</div>`:""}</header>
    <main class="content">${body}</main>${nav(active)}
  </div>`;
}

function home(){
  const recId=recommendedWorkoutId();
  const recommended=workoutById(recId) || state.program[0];
  const selected = workoutById(state.selectedProgram) || recommended;
  const completedThisWeek = state.history.slice(-30).filter(h=>Date.now()-h.end<7*86400000);
  const recent=lastCompletedWorkout();
  const weekSets=completedThisWeek.reduce((a,h)=>a+h.logs.reduce((x,l)=>x+l.sets.length,0),0);
  const isOverride=selected.id!==recommended.id;
  return shell("Gym Tracker",todayLabel(),
  `<section class="card hero">
      <div class="hero-orb"></div>
      <span class="tag">${isOverride?"SELECTED":"RECOMMENDED"}</span>
      <div class="big">${selected.name}</div>
      <div class="meta">${isOverride?"Manual choice":recommendationReason(recommended)} · ${selected.exercises.length} exercises · ${totalSets(selected)} planned sets</div>
      <button class="primary" onclick="startWorkout('${selected.id}')">START ${selected.name.toUpperCase()}</button>
      ${isOverride?`<button class="secondary" style="width:100%;margin-top:8px" onclick="state.selectedProgram='${recommended.id}';save();render()">Use recommended: ${recommended.name}</button>`:""}
    </section>
    <section class="metric-grid" style="margin-bottom:14px">
      <div class="metric"><strong>${completedThisWeek.length}</strong><span>Workouts last 7 days</span></div>
      <div class="metric"><strong>${weekSets}</strong><span>Working sets logged</span></div>
    </section>
    ${recent?`<section class="card">
      <div class="between"><div><div class="section-kicker">Last session</div><h3 style="margin:0">${recent.name}</h3></div><button class="secondary" onclick="state.lastCompleted='${recent.id}';save();go('summary')">View</button></div>
      <div class="small" style="margin-top:6px">${new Date(recent.end).toLocaleDateString()} · ${recent.logs.reduce((a,l)=>a+l.sets.length,0)} sets completed</div>
    </section>`:""}
    <section class="card">
      <div class="between"><h3>Choose today's workout</h3><span class="badge">Flexible plan</span></div>
      <div class="small" style="margin-bottom:6px">The plan rolls forward from the last workout you actually completed. Missed days are simply skipped. You can override the recommendation anytime.</div>
      ${state.program.map(w=>`<div class="workout-row between">
        <div class="row"><div class="day">${w.day[0]}</div><div><strong>${w.name}</strong><div class="small">${w.id===recommended.id?"Recommended next · ":""}${totalSets(w)} planned sets</div></div></div>
        <button class="secondary" onclick="state.selectedProgram='${w.id}';save();render()">${w.id===selected.id?"Selected":"Choose"}</button>
      </div>`).join("")}
    </section>`,
  "home");
}
function startWorkout(id){
  const w = state.program.find(x=>x.id===id);
  const sessionExercises = w.exercises.map(e=>({...e, plannedName:e.name, skipped:false}));
  state.current = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    workoutId:id, name:w.name, start:Date.now(), exerciseIndex:0, restUntil:null,
    exercises: sessionExercises,
    logs:sessionExercises.map(e=>({
      exerciseId:e.id,name:e.name,plannedName:e.plannedName,primary:e.primary,secondary:e.secondary,
      rest:exerciseRest(e),sets:[],skipped:false,wasSwapped:false,notes:exerciseNotes(e.name)
    }))
  };
  save();go("live");
}

function live(){
  if(!state.current) return home();
  const sessionExercises = state.current.exercises || state.program.find(x=>x.id===state.current.workoutId).exercises;
  const ex=sessionExercises[state.current.exerciseIndex];
  const log=state.current.logs[state.current.exerciseIndex];
  if(!ex) { finishWorkout(); return ""; }
  ex.rest=exerciseRest(ex);
  log.rest=ex.rest;
  if(state.current.restUntil && state.current.restUntil>Date.now()) return restScreen();

  const prev = lastExerciseSession(ex.name);
  const setNo = log.sets.length+1;
  const prevSet = prev?.sets?.[Math.min(setNo-1,(prev.sets||[]).length-1)];
  const defaultWeight = prevSet?.weight ?? "";
  const defaultReps = prevSet?.reps ?? "";
  const defaultRir = prevSet?.rir ?? "";
  const defaultAssist = prevSet?.assistWeight ?? "";
  const defaultAdded = prevSet?.addedWeight ?? "";

  const assisted=assistModeFor(ex.name);

  return shell(state.current.name,`Exercise ${state.current.exerciseIndex+1} of ${sessionExercises.length}`,
    `<section class="card">
      <div class="between">
        <div>
          <div class="counter">SET ${setNo} OF ${ex.sets}</div>
          <div class="exercise-title">${ex.name}</div>
        </div>
        <button class="secondary" onclick="openExerciseMenu()">⋯</button>
      </div>
      ${log.wasSwapped?`<div class="badge" style="margin-top:10px">Swapped from ${log.plannedName}</div>`:""}
      <div class="meta">Target ${ex.repMin}–${ex.repMax} reps · ${Math.floor(ex.rest/60)}:${String(ex.rest%60).padStart(2,"0")} rest · ${ex.primary}</div>
      ${prev?`<div class="card" style="margin-top:14px"><div class="small">Previous ${ex.name}</div><strong>${prev.sets.map(s=>formatSet(s,ex.name)).join(" · ")}</strong></div>`:""}
      ${assisted?`
        <div class="tabs" style="margin-top:14px">
          <button class="${log.loadMode!=="added"?"active":""}" onclick="setLoadMode('assisted')">Assisted</button>
          <button class="${log.loadMode==="added"?"active":""}" onclick="setLoadMode('added')">Bodyweight / Added</button>
        </div>
        ${log.loadMode==="added" ? `
          <div class="input-grid">
            <div class="field"><label>Added weight (kg)</label><input id="addedWeight" type="number" step="0.5" value="${defaultAdded}"></div>
            <div class="field"><label>Reps</label><input id="reps" type="number" step="1" value="${defaultReps}"></div>
          </div>` : `
          <div class="input-grid">
            <div class="field"><label>Assistance (kg)</label><input id="assistWeight" type="number" step="0.5" value="${defaultAssist}"></div>
            <div class="field"><label>Reps</label><input id="reps" type="number" step="1" value="${defaultReps}"></div>
          </div>`}
      `:`
      <div class="input-grid">
        <div class="field"><label>Weight (kg)</label><input id="weight" type="number" step="0.5" value="${defaultWeight}"></div>
        <div class="field"><label>Reps</label><input id="reps" type="number" step="1" value="${defaultReps}"></div>
      </div>`}
      <div class="input-grid">
        <div class="field"><label>RIR</label><input id="rir" type="number" min="0" max="10" step="1" value="${defaultRir}"></div>
        <div class="field"><label>Set type</label>
          <select id="setType" style="width:100%;background:transparent;color:white;border:none;font-size:18px;font-weight:800;outline:none">
            <option value="working">Working</option>
            <option value="warmup">Warm-up</option>
          </select>
        </div>
      </div>
      <div class="field" style="margin-top:10px">
        <label>Exercise note</label>
        <input id="exerciseNote" type="text" value="${log.notes||""}" placeholder="e.g. seat 4, neutral grip">
      </div>
      <button class="primary" onclick="completeSet()">✓ COMPLETE SET</button>
    </section>
    <section class="card"><div class="between"><h3>Completed sets</h3><button class="secondary" onclick="finishWorkoutEarly()">Finish early</button></div>
      ${log.sets.length?log.sets.map((s,i)=>`<div class="set-row" style="grid-template-columns:32px 1fr 56px 56px">
        <b>${i+1}</b><span>${formatSet(s,ex.name)}</span>
        <button class="secondary" onclick="editSet(${i})">Edit</button>
        <button class="secondary danger" onclick="deleteSet(${i})">Del</button>
      </div>`).join(""):`<div class="empty">No sets logged yet.</div>`}
    </section>
    <section class="card">
      <div class="between"><h3>Workout queue</h3><span class="small">${sessionExercises.length} exercises</span></div>
      ${sessionExercises.map((e,i)=>`<div class="workout-row between">
        <div><strong>${i+1}. ${e.name}</strong><div class="small">${e.skipped?"Skipped":`${e.sets} sets · ${e.primary}`}</div></div>
        <span class="${i===state.current.exerciseIndex?"good":"small"}">${i===state.current.exerciseIndex?"Current":(i<state.current.exerciseIndex?"Done":"")}</span>
      </div>`).join("")}
    </section>
    <button class="secondary danger" style="width:100%" onclick="cancelWorkout()">Cancel workout</button>`,
  "home");
}

function setLoadMode(mode){
  state.current.logs[state.current.exerciseIndex].loadMode=mode;
  save();render();
}

function formatSet(s,name){
  const extras=[];
  if(s.setType==="warmup") extras.push("WU");
  if(Number.isFinite(s.rir)) extras.push(`RIR ${s.rir}`);
  if(s.assistWeight!=null) return `${s.assistWeight}kg assist × ${s.reps}${extras.length?" · "+extras.join(" · "):""}`;
  if(s.addedWeight!=null) return `${s.addedWeight>0?"+":""}${s.addedWeight}kg × ${s.reps}${extras.length?" · "+extras.join(" · "):""}`;
  return `${s.weight}kg × ${s.reps}${extras.length?" · "+extras.join(" · "):""}`;
}

function editSet(index){
  const log=state.current.logs[state.current.exerciseIndex];
  const s=log.sets[index];
  if(!s) return;
  if(s.assistWeight!=null){
    const a=parseFloat(prompt("Assistance kg:",s.assistWeight)); if(!(a>=0)) return; s.assistWeight=a;
  } else if(s.addedWeight!=null){
    const a=parseFloat(prompt("Added weight kg:",s.addedWeight)); if(!(a>=0)) return; s.addedWeight=a;
  } else {
    const w=parseFloat(prompt("Weight kg:",s.weight)); if(!(w>=0)) return; s.weight=w;
  }
  const r=parseInt(prompt("Reps:",s.reps)); if(!(r>0)) return; s.reps=r;
  const rirRaw=prompt("RIR (blank if not used):",s.rir??"");
  s.rir=rirRaw===""?null:parseInt(rirRaw);
  save();render();
}

function deleteSet(index){
  const log=state.current.logs[state.current.exerciseIndex];
  if(!confirm("Delete this set?")) return;
  log.sets.splice(index,1);
  save();render();
}

function finishWorkoutEarly(){
  if(confirm("Finish and save this workout now? Remaining exercises will be left incomplete, not failed.")) finishWorkout();
}

function openExerciseMenu(){
  const ex=state.current.exercises[state.current.exerciseIndex];
  const same=fullExerciseLibrary().filter(x=>x.primary===ex.primary && x.name!==ex.name).slice(0,8);
  const options=same.map(x=>`<button class="secondary" style="width:100%;margin-bottom:8px;text-align:left" onclick='swapExercise(${JSON.stringify(x.name)})'>
    <strong>${x.name}</strong><div class="small">${x.equipment} · ${x.type} · ${x.primary}</div>
  </button>`).join("");
  document.getElementById("app").innerHTML = shell("Change Exercise",ex.name,
    `<section class="card"><h3>Swap for a similar exercise</h3>${options||`<div class="empty">No similar exercises found.</div>`}
      <button class="secondary" style="width:100%;margin-top:6px" onclick="openAllExercises()">Choose any exercise</button>
    </section>
    <section class="card">
      <button class="secondary" style="width:100%;margin-bottom:8px" onclick="addExercise()">+ Add exercise to workout</button>
      <button class="secondary" style="width:100%;margin-bottom:8px" onclick="moveExercise(1)">Move current exercise down</button>
      <button class="secondary" style="width:100%;margin-bottom:8px" onclick="moveExercise(-1)">Move current exercise up</button>
      <button class="secondary" style="width:100%;margin-bottom:8px" onclick="setDefaultRest()">Set default rest</button>
      <button class="secondary danger" style="width:100%" onclick="skipExercise()">Skip current exercise</button>
    </section>
    <button class="primary" onclick="go('live')">Back to workout</button>`,
  "home");
}

function openAllExercises(){
  const buttons=fullExerciseLibrary().map(x=>`<button class="secondary" style="width:100%;margin-bottom:8px;text-align:left" onclick='swapExercise(${JSON.stringify(x.name)})'>
    <strong>${x.name}</strong><div class="small">${x.primary} · ${x.equipment}</div>
  </button>`).join("");
  document.getElementById("app").innerHTML = shell("Exercise Library","Choose a replacement",
    `<section class="card">${buttons}</section><button class="primary" onclick="openExerciseMenu()">Back</button>`,"home");
}

function swapExercise(name){
  const item=fullExerciseLibrary().find(x=>x.name===name);
  if(!item) return;
  const idx=state.current.exerciseIndex;
  const old=state.current.exercises[idx];
  state.current.exercises[idx]={
    ...old,
    name:item.name, primary:item.primary, secondary:item.secondary, rest:item.rest,
    repMin:item.repMin, repMax:item.repMax, equipment:item.equipment, type:item.type
  };
  state.current.logs[idx]={
    ...state.current.logs[idx],
    name:item.name, primary:item.primary, secondary:item.secondary, rest:item.rest,
    wasSwapped:item.name!==state.current.logs[idx].plannedName
  };
  save();toast(`Swapped to ${item.name}`);go("live");
}

function setDefaultRest(){
  const ex=state.current.exercises[state.current.exerciseIndex];
  const sec=parseInt(prompt("Default rest in seconds:",exerciseRest(ex)));
  if(!(sec>=15)) return;
  saveExercisePref(ex.name,{rest:sec});
  ex.rest=sec;
  state.current.logs[state.current.exerciseIndex].rest=sec;
  toast(`Default rest saved: ${sec}s`);
  go("live");
}

function addExercise(){
  const name=prompt("Enter an exercise name exactly as it appears in the library, or type a new one:");
  if(!name) return;
  let item=fullExerciseLibrary().find(x=>x.name.toLowerCase()===name.trim().toLowerCase());
  if(!item){
    const primary=prompt("Primary muscle group (e.g. Chest, Back, Biceps):","Chest") || "Other";
    const sets=parseInt(prompt("Working sets:","3"))||3;
    const repMin=parseInt(prompt("Minimum reps:","8"))||8;
    const repMax=parseInt(prompt("Maximum reps:","12"))||12;
    const rest=parseInt(prompt("Rest seconds:","90"))||90;
    item={name:name.trim(),primary,secondary:[],type:"Custom",equipment:"Other",rest,repMin,repMax,sets};
    state.customExercises.push(item);
  }
  const ex={
    id:"custom-"+Date.now(),name:item.name,plannedName:item.name,sets:item.sets||3,
    repMin:item.repMin,repMax:item.repMax,rest:item.rest,primary:item.primary,
    secondary:item.secondary||[],equipment:item.equipment||"Other",type:item.type||"Custom",skipped:false
  };
  state.current.exercises.push(ex);
  state.current.logs.push({exerciseId:ex.id,name:ex.name,plannedName:ex.name,primary:ex.primary,secondary:ex.secondary,rest:ex.rest,sets:[],skipped:false,wasSwapped:false});
  save();toast(`${ex.name} added`);go("live");
}

function skipExercise(){
  const idx=state.current.exerciseIndex;
  state.current.exercises[idx].skipped=true;
  state.current.logs[idx].skipped=true;
  if(idx < state.current.exercises.length-1){
    state.current.exerciseIndex++;
    state.current.restUntil=null;
    save();go("live");
  } else {
    finishWorkout();
  }
}

function moveExercise(direction){
  const idx=state.current.exerciseIndex;
  const ni=idx+direction;
  if(ni<0 || ni>=state.current.exercises.length){toast("Cannot move further");return;}
  [state.current.exercises[idx],state.current.exercises[ni]]=[state.current.exercises[ni],state.current.exercises[idx]];
  [state.current.logs[idx],state.current.logs[ni]]=[state.current.logs[ni],state.current.logs[idx]];
  state.current.exerciseIndex=ni;
  save();go("live");
}

function completeSet(){
  const exercises=state.current.exercises || state.program.find(x=>x.id===state.current.workoutId).exercises;
  const ex=exercises[state.current.exerciseIndex];
  const log=state.current.logs[state.current.exerciseIndex];
  const reps=parseInt(qs("#reps")?.value);
  if(!(reps>0)){toast("Enter reps");return}

  const rirRaw=qs("#rir")?.value ?? "";
  const rir=rirRaw===""?null:parseInt(rirRaw);
  const setType=qs("#setType")?.value || "working";
  const notes=qs("#exerciseNote")?.value || "";
  log.notes=notes;
  saveExercisePref(ex.name,{notes});

  const set={reps,rir,setType,time:Date.now()};
  if(assistModeFor(ex.name)){
    const mode=log.loadMode || "assisted";
    if(mode==="added"){
      const added=parseFloat(qs("#addedWeight")?.value || "0");
      if(!(added>=0)){toast("Enter added weight");return}
      set.addedWeight=added;
    }else{
      const assist=parseFloat(qs("#assistWeight")?.value);
      if(!(assist>=0)){toast("Enter assistance weight");return}
      set.assistWeight=assist;
    }
  }else{
    const weight=parseFloat(qs("#weight")?.value);
    if(!(weight>=0)){toast("Enter weight");return}
    set.weight=weight;
  }

  log.sets.push(set);

  const workingCount=log.sets.filter(s=>s.setType!=="warmup").length;
  if(workingCount>=ex.sets){
    let next=state.current.exerciseIndex+1;
    while(next<exercises.length && exercises[next].skipped) next++;
    if(next < exercises.length){
      state.current.exerciseIndex=next;
      state.current.restUntil=Date.now()+ex.rest*1000;
    } else {
      finishWorkout(); return;
    }
  } else {
    state.current.restUntil=Date.now()+ex.rest*1000;
  }
  save();
  render();
}
function restScreen(){
  const idx=state.current.exerciseIndex;
  const exercises=state.current.exercises || state.program.find(x=>x.id===state.current.workoutId).exercises;
  const ex=exercises[idx];
  const remaining=Math.max(0,Math.ceil((state.current.restUntil-Date.now())/1000));
  const total = state.current.logs[Math.max(0,idx-(state.current.logs[idx].sets.length?0:1))]?.rest || ex.rest;
  const pct=Math.max(0,Math.min(100,remaining/Math.max(total,1)*100));
  setTimeout(()=>{ if(state.current && state.current.restUntil && state.current.restUntil<=Date.now()){ state.current.restUntil=null;save();notify("Rest complete",`Next set: ${ex.name}`);render(); } else render(); },1000);
  return shell(state.current.name,"Rest timer",
    `<section class="card timer-wrap">
      <div class="counter">REST</div>
      <div class="timer-ring" style="--pct:${pct}%"><div class="timer-value">${fmtSec(remaining)}</div></div>
      <h3>Up next: ${ex.name}</h3>
      <div class="meta">Set ${state.current.logs[idx].sets.length+1} of ${ex.sets} · ${ex.repMin}–${ex.repMax} reps</div>
      <div class="row" style="margin-top:18px">
        <button class="secondary" style="flex:1" onclick="skipRest()">Skip rest</button>
        <button class="primary" style="flex:1;margin-top:0" onclick="addRest(30)">+30 sec</button>
      </div>
    </section>`,
  "home");
}

function skipRest(){state.current.restUntil=null;save();render()}
function addRest(s){state.current.restUntil+=s*1000;save();render()}
function cancelWorkout(){ if(confirm("Cancel this workout?")){state.current=null;save();go("home")} }

function finishWorkout(){
  const c=state.current;
  c.end=Date.now();
  state.history.push(c);
  state.current=null;
  state.lastCompleted=c.id;
  const nextId=recommendedWorkoutId();
  if(nextId) state.selectedProgram=nextId;
  save();
  go("summary");
}

function notify(title,body){
  if(navigator.vibrate) navigator.vibrate([180,90,180]);
  try{
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(Ctx){
      const ctx=new Ctx(), osc=ctx.createOscillator(), gain=ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value=880; gain.gain.value=.08; osc.start();
      setTimeout(()=>{osc.stop();ctx.close()},220);
    }
  }catch(e){}
  toast(`${title}: ${body}`);
}

function findHistory(id){return state.history.find(h=>h.id===id)}
function summary(){
  const h=findHistory(state.lastCompleted) || state.history[state.history.length-1];
  if(!h) return shell("Workout Summary","No completed workout",`<div class="card empty">Complete a workout to see your analysis.</div>`,"history");
  const duration=Math.round((h.end-h.start)/60000);
  const sets=h.logs.reduce((a,e)=>a+e.sets.filter(s=>s.setType!=="warmup").length,0);
  const volume=h.logs.reduce((a,e)=>a+e.sets.filter(s=>s.setType!=="warmup").reduce((x,s)=>x+(s.weight||0)*s.reps,0),0);
  const pbs=findPBs(h);
  return shell("Workout Complete",h.name,
    `<section class="card hero"><span class="tag">SESSION COMPLETE</span><div class="big">Session complete.</div>
      <div class="metric-grid" style="margin-top:14px">
        <div class="metric"><strong>${duration}m</strong><span>Duration</span></div>
        <div class="metric"><strong>${sets}</strong><span>Working sets</span></div>
        <div class="metric"><strong>${Math.round(volume).toLocaleString()}</strong><span>kg volume</span></div>
        <div class="metric"><strong>${pbs.length}</strong><span>PBs</span></div>
      </div>
      <button class="primary" onclick="go('analysis')">VIEW ANALYSIS</button>
    </section>
    ${pbs.length?`<section class="card"><h3>PBs</h3>${pbs.map(p=>`<div class="workout-row between"><strong>${p.name}</strong><span class="good">${p.label}</span></div>`).join("")}</section>`:""}`,
  "history");
}

function findPBs(h){
  const out=[];
  h.logs.forEach(l=>{
    const working=(l.sets||[]).filter(s=>s.setType!=="warmup");
    if(!working.length)return;
    const prev=state.history.filter(x=>x.id!==h.id && x.end<h.end).flatMap(x=>x.logs).filter(x=>x.name===l.name);
    const prevSets=prev.flatMap(x=>(x.sets||[]).filter(s=>s.setType!=="warmup"));

    // The first logged session establishes a baseline. PBs begin from session two.
    if(!prevSets.length) return;

    if(working.some(s=>s.assistWeight!=null)){
      const best=Math.min(...working.filter(s=>s.assistWeight!=null).map(s=>s.assistWeight));
      const prevBest=prevSets.some(s=>s.assistWeight!=null)?Math.min(...prevSets.filter(s=>s.assistWeight!=null).map(s=>s.assistWeight)):Infinity;
      if(best<prevBest) out.push({name:l.name,label:`Lowest assistance ${best} kg`});
      return;
    }
    if(working.some(s=>s.addedWeight!=null)){
      const best=Math.max(...working.filter(s=>s.addedWeight!=null).map(s=>s.addedWeight));
      const prevBest=prevSets.some(s=>s.addedWeight!=null)?Math.max(...prevSets.filter(s=>s.addedWeight!=null).map(s=>s.addedWeight)):-Infinity;
      if(best>prevBest) out.push({name:l.name,label:`Added-weight PB +${best} kg`});
      return;
    }

    const weightPB=Math.max(...working.map(s=>s.weight||0));
    const prevWeight=prevSets.length?Math.max(...prevSets.map(s=>s.weight||0)):0;
    if(weightPB>prevWeight) out.push({name:l.name,label:`Weight PB ${weightPB} kg`});

    const bestE=Math.max(...working.map(s=>e1rm(s.weight,s.reps)));
    const prevE=prevSets.length?Math.max(...prevSets.map(s=>e1rm(s.weight,s.reps))):0;
    if(bestE>prevE) out.push({name:l.name,label:`e1RM PB ${bestE} kg`});

    const volume=working.reduce((a,s)=>a+(s.weight||0)*s.reps,0);
    const prevVolumes=prev.map(x=>(x.sets||[]).filter(s=>s.setType!=="warmup").reduce((a,s)=>a+(s.weight||0)*s.reps,0));
    if(volume>Math.max(0,...prevVolumes)) out.push({name:l.name,label:`Volume PB ${Math.round(volume)} kg`});

    working.forEach(s=>{
      const prevRepsAtWeight=Math.max(0,...prevSets.filter(p=>p.weight===s.weight).map(p=>p.reps||0));
      if((s.weight||0)>0 && s.reps>prevRepsAtWeight) out.push({name:l.name,label:`Rep PB ${s.weight} kg × ${s.reps}`});
    });
  });
  const seen=new Set();
  return out.filter(p=>{const k=p.name+"|"+p.label;if(seen.has(k))return false;seen.add(k);return true});
}

function analysis(){
  const h=findHistory(state.lastCompleted) || state.history[state.history.length-1];
  if(!h) return summary();
  const muscle={};
  h.logs.forEach(l=>{
    if(l.skipped) return;
    const n=l.sets.filter(s=>s.setType!=="warmup").length;
    muscle[l.primary]=(muscle[l.primary]||0)+n;
    (l.secondary||[]).forEach(m=>muscle[m]=(muscle[m]||0)+n*0.5);
  });
  const week=weeklyMuscleTotals();
  return shell("Workout Analysis",h.name,
    `<section class="card"><h3>Muscle groups</h3>
      ${Object.entries(muscle).sort((a,b)=>b[1]-a[1]).map(([m,n])=>{
        const t=TARGETS[m]||[0,Math.max(1,Math.ceil(n))], current=week[m]||0, pct=Math.min(100,current/t[1]*100);
        return `<div class="muscle-row"><strong>${m}</strong><div class="progress"><span style="width:${pct}%"></span></div><span class="small">${n.toFixed(n%1?1:0)} today</span></div>`
      }).join("")}
    </section>
    <section class="card"><h3>Exercise performance</h3>
      ${h.logs.filter(x=>x.sets.length).map(l=>performanceLine(l,h)).join("")}
    </section>`,
  "stats");
}

function performanceLine(l,h){
  const metric=bestPerformanceMetric(l);
  if(!metric) return "";
  const prevSessions=state.history.filter(x=>x.end<h.end).flatMap(x=>x.logs).filter(x=>x.name===l.name && x.sets.length);
  const prev=prevSessions[prevSessions.length-1];
  const pm=prev?bestPerformanceMetric(prev):null;
  let cls="small", txt="First logged session";
  if(pm && pm.type===metric.type){
    if(metric.type==="assist"){
      const d=pm.value-metric.value;
      cls=d>=0?"good":"bad";
      txt=d===0?`Same assistance as previous`:`${d>0?"↓":"↑"} ${Math.abs(d).toFixed(1)} kg assistance vs previous`;
    }else if(metric.type==="added"){
      const d=metric.value-pm.value;
      cls=d>=0?"good":"bad";
      txt=d===0?`Same added weight as previous`:`${d>=0?"↑":"↓"} ${Math.abs(d).toFixed(1)} kg vs previous`;
    }else{
      const d=((metric.value-pm.value)/pm.value*100);
      cls=d>=0?"good":"bad";
      txt=`${d>=0?"↑":"↓"} ${Math.abs(d).toFixed(1)}% vs previous`;
    }
  }
  return `<div class="workout-row between"><div><strong>${l.name}</strong><div class="${cls}">${txt}</div></div><div><strong>${metric.label}</strong></div></div>`;
}


function bestPerformanceMetric(log){
  const sets=(log?.sets||[]).filter(s=>s.setType!=="warmup");
  if(!sets.length) return null;

  const assisted=sets.filter(s=>s.assistWeight!=null && Number.isFinite(Number(s.assistWeight)));
  if(assisted.length){
    const best=[...assisted].sort((a,b)=>
      Number(a.assistWeight)-Number(b.assistWeight) || Number(b.reps)-Number(a.reps)
    )[0];
    return {
      type:"assist",
      value:Number(best.assistWeight),
      reps:Number(best.reps),
      label:`${Number(best.assistWeight)} kg assistance`
    };
  }

  const added=sets.filter(s=>s.addedWeight!=null && Number.isFinite(Number(s.addedWeight)));
  if(added.length){
    const best=[...added].sort((a,b)=>
      Number(b.addedWeight)-Number(a.addedWeight) || Number(b.reps)-Number(a.reps)
    )[0];
    return {
      type:"added",
      value:Number(best.addedWeight),
      reps:Number(best.reps),
      label:`${Number(best.addedWeight)>0?"+":""}${Number(best.addedWeight)} kg added`
    };
  }

  const weighted=sets.filter(s=>Number.isFinite(Number(s.weight)) && Number(s.weight)>0 && Number(s.reps)>0);
  if(!weighted.length) return null;

  const best=Math.max(...weighted.map(s=>e1rm(Number(s.weight),Number(s.reps))));
  return {type:"e1rm",value:best,label:`${best} kg e1RM`};
}

function lastExerciseSession(name){
  for(let i=state.history.length-1;i>=0;i--){
    const l=state.history[i].logs.find(x=>x.name===name && x.sets.length);
    if(l)return l;
  }
  return null;
}

function weeklyMuscleTotals(){
  const cutoff=Date.now()-7*86400000, muscle={};
  state.history.filter(h=>h.end>=cutoff).forEach(h=>h.logs.forEach(l=>{
    const n=l.sets.filter(s=>s.setType!=="warmup").length;
    muscle[l.primary]=(muscle[l.primary]||0)+n;
    (l.secondary||[]).forEach(m=>muscle[m]=(muscle[m]||0)+n*0.5);
  }));
  return muscle;
}


function sparklineSVG(points){
  if(!points || !points.length) return "";
  const vals=points.map(p=>p.v);
  const min=Math.min(...vals), max=Math.max(...vals), range=Math.max(1,max-min);
  const w=300,h=70,pad=6;
  const coords=points.map((p,i)=>{
    const x=pad+(i/(Math.max(1,points.length-1)))*(w-pad*2);
    const y=h-pad-((p.v-min)/range)*(h-pad*2);
    return [x,y];
  });
  const line=coords.map((c,i)=>(i?"L":"M")+c[0].toFixed(1)+","+c[1].toFixed(1)).join(" ");
  const dots=coords.map(c=>`<circle cx="${c[0]}" cy="${c[1]}" r="2.8" fill="#caff3a"/>`).join("");
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#caff3a" stop-opacity=".22"/><stop offset="1" stop-color="#caff3a" stop-opacity="0"/></linearGradient></defs>
    <path d="${line} L ${coords[coords.length-1][0]},${h} L ${coords[0][0]},${h} Z" fill="url(#g)"/>
    <path d="${line}" fill="none" stroke="#caff3a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
  </svg>`;
}
function stats(){
  const lifts=["Bench Press","Back Squat","Deadlift","Overhead Press","Weighted Pull-Ups","Assisted Pull-Ups","Assisted Dips","Dips","Barbell Row","Seated Chest Press"];
  const cards=lifts.map(name=>{
    const pts=state.history.map(h=>{
      const l=(h.logs||[]).find(x=>x.name===name && (x.sets||[]).length);
      const m=l?bestPerformanceMetric(l):null;
      return m?{t:h.end,v:m.value,type:m.type,label:m.label}:null;
    }).filter(Boolean);
    if(!pts.length)return "";
    const latest=pts[pts.length-1], first=pts[0];
    let trendText="", trendClass="good";
    if(latest.type==="assist"){
      const d=first.v-latest.v; trendClass=d>=0?"good":"bad";
      trendText=`${d>=0?"↓":"↑"} ${Math.abs(d).toFixed(1)} kg assistance`;
    }else if(latest.type==="added"){
      const d=latest.v-first.v; trendClass=d>=0?"good":"bad";
      trendText=`${d>=0?"↑":"↓"} ${Math.abs(d).toFixed(1)} kg added`;
    }else{
      const d=first.v?((latest.v-first.v)/first.v*100):0; trendClass=d>=0?"good":"bad";
      trendText=`${d>=0?"↑":"↓"} ${Math.abs(d).toFixed(1)}%`;
    }
    return `<section class="card">
      <div class="chart-title"><div><div class="section-kicker">Strength trend</div><h3 style="margin:0">${name}</h3></div>
      <div class="pill-score"><strong>${latest.label}</strong></div></div>
      <div class="chart">${sparklineSVG(pts)}<div class="${trendClass}" style="font-weight:800;font-size:12px">${trendText} from first log</div></div>
    </section>`;
  }).join("");
  const m=weeklyMuscleTotals();
  return shell("Progress","Strength & weekly training volume",
    `${cards||`<section class="card empty">Log a few workouts to build strength charts.</section>`}
     <section class="card"><div class="between"><h3>Weekly muscle volume</h3><span class="badge">Working sets only</span></div>
      ${Object.entries(TARGETS).map(([name,t])=>{
        const n=m[name]||0,p=Math.min(100,n/t[1]*100);
        return `<div class="muscle-row"><strong>${name}</strong><div class="progress"><span style="width:${p}%"></span></div><span class="small">${n.toFixed(n%1?1:0)} / ${t[1]}</span></div>`
      }).join("")}
     </section>`,
  "stats");
}
function history(){
  return shell("History","Your completed training sessions",
    `<section class="card">
    ${state.history.length?state.history.slice().reverse().map(h=>{
      const sets=h.logs.reduce((a,e)=>a+e.sets.filter(s=>s.setType!=="warmup").length,0);
      const vol=h.logs.reduce((a,e)=>a+e.sets.filter(s=>s.setType!=="warmup").reduce((x,s)=>x+(s.weight||0)*s.reps,0),0);
      return `<div class="workout-row between" onclick="state.lastCompleted='${h.id}';save();go('summary')">
        <div><strong>${h.name}</strong><div class="small">${new Date(h.end).toLocaleDateString()} · ${sets} sets</div></div>
        <div style="text-align:right"><strong>${Math.round(vol).toLocaleString()} kg</strong><div class="small">volume</div></div>
      </div>`
    }).join(""):`<div class="empty">Your completed workouts will appear here.</div>`}
    </section>`,
  "history");
}

function program(){
  return shell("Programme","Your 5-day split",
    `<section class="card">${state.program.map(w=>`<div class="workout-row">
      <div class="between"><div><strong>${w.day} · ${w.name}</strong><div class="small">${w.exercises.length} exercises · ${totalSets(w)} sets</div></div><button class="secondary" onclick="state.selectedProgram='${w.id}';save();go('home')">Use</button></div>
      <div style="margin-top:10px">${w.exercises.map(e=>`<div class="small" style="padding:4px 0">${e.name} · ${e.sets} × ${e.repMin}–${e.repMax} · ${e.rest}s rest</div>`).join("")}</div>
    </div>`).join("")}</section>
    <section class="card">
      <h3>Flexible schedule</h3>
      <div class="notice">The weekday labels are guides only. The app recommends the next workout in the rolling sequence based on the last workout you actually completed. Missed days are not recorded as failures, and you can choose any workout from Home whenever you want.</div>
    </section>
    <section class="card"><h3>Data & backup</h3>
      <div class="notice" style="margin-bottom:10px">Your workout history is stored on this device. Export a backup occasionally so you can restore it if Safari data is cleared or you change phones.</div>
      <button class="secondary" style="width:100%;margin-bottom:8px" onclick="exportData()">Export backup</button>
      <label class="file-label">Import backup<input id="backupFile" type="file" accept="application/json,.json" onchange="importData(event)"></label>
      <button class="secondary danger" style="width:100%" onclick="resetAll()">Reset all data</button>
    </section>
    <section class="card"><h3>iPhone setup</h3>
      <div class="small" style="line-height:1.6">
        Open the deployed site in Safari → Share → Add to Home Screen. Launch it from the Home Screen for the best app-like experience. When you first complete a set, allow notifications if prompted.
      </div>
    </section>`,
  "program");
}

function exportData(){
  const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="gym-tracker-backup.json";a.click();
}

function importData(event){
  const file=event.target.files && event.target.files[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const incoming=JSON.parse(reader.result);
      if(!incoming || !Array.isArray(incoming.program) || !Array.isArray(incoming.history)){
        throw new Error("Invalid backup");
      }
      if(confirm("Import this backup? It will replace the workout data currently stored on this device.")){
        state=incoming;
        if(!state.route) state.route="home";
        if(!state.selectedProgram && state.program[0]) state.selectedProgram=state.program[0].id;
        save();
        toast("Backup restored");
        setTimeout(()=>go("home"),500);
      }
    }catch(err){
      alert("That file does not look like a valid Gym Tracker backup.");
    }finally{
      event.target.value="";
    }
  };
  reader.readAsText(file);
}
function resetAll(){ if(confirm("Delete all workout history and reset the app?")){localStorage.removeItem("gymState");location.reload()} }

function render(){
  let html="";
  if(state.route==="home")html=home();
  else if(state.route==="live")html=live();
  else if(state.route==="summary")html=summary();
  else if(state.route==="analysis")html=analysis();
  else if(state.route==="stats")html=stats();
  else if(state.route==="history")html=history();
  else if(state.route==="program")html=program();
  document.getElementById("app").innerHTML=html;
}
window.go=go; window.startWorkout=startWorkout; window.completeSet=completeSet; window.skipRest=skipRest; window.addRest=addRest;
window.cancelWorkout=cancelWorkout; window.exportData=exportData; window.importData=importData; window.resetAll=resetAll;
window.openExerciseMenu=openExerciseMenu; window.openAllExercises=openAllExercises; window.swapExercise=swapExercise;
window.addExercise=addExercise; window.skipExercise=skipExercise; window.moveExercise=moveExercise;
window.setLoadMode=setLoadMode; window.editSet=editSet; window.deleteSet=deleteSet; window.finishWorkoutEarly=finishWorkoutEarly; window.setDefaultRest=setDefaultRest;
render();

if("serviceWorker" in navigator){ window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{})); }
