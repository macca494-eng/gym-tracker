
const APP_RELEASE = "6.1";
const DEFAULT_PROGRAM = [
  {id:"upper-a",name:"Upper A – Strength",day:"Mon",plannedMinutes:52,exercises:[
    ["Bench Press",3,5,8,180,"Chest",["Triceps","Front Delts"]],
    ["Lat Pulldown",3,6,10,150,"Back",["Biceps"]],
    ["Incline DB Press",2,8,10,120,"Chest",["Triceps","Front Delts"]],
    ["Chest Supported Row",2,8,10,120,"Back",["Biceps","Rear Delts"]],
    ["Overhead Press",2,6,10,150,"Front Delts",["Triceps","Side Delts"]],
    ["Lateral Raise",3,12,15,75,"Side Delts",[]],
    ["Barbell Curl",2,8,12,75,"Biceps",[]],
    ["Tricep Pushdown",2,10,15,75,"Triceps",[]]
  ]},
  {id:"lower-a",name:"Lower A – Strength",day:"Tue",plannedMinutes:50,exercises:[
    ["Back Squat",3,5,8,180,"Quads",["Glutes","Hamstrings"]],
    ["Romanian Deadlift",3,6,10,180,"Hamstrings",["Glutes"]],
    ["Leg Press",2,10,12,120,"Quads",["Glutes"]],
    ["Leg Curl",2,10,15,90,"Hamstrings",[]],
    ["Standing Calf Raise",3,10,15,75,"Calves",[]],
    ["Hanging Leg Raise",2,10,15,60,"Core",[]]
  ]},
  {id:"v-taper",name:"V-Taper / Arms",day:"Wed",plannedMinutes:48,exercises:[
    ["Assisted Pull-Ups",3,6,10,150,"Back",["Biceps"]],
    ["Single-Arm Lat Pulldown",2,8,12,105,"Back",["Biceps"]],
    ["Cable Lateral Raise",3,12,20,75,"Side Delts",[]],
    ["Rear Delt Fly",3,12,20,75,"Rear Delts",[]],
    ["Incline DB Curl",2,8,12,75,"Biceps",[]],
    ["Hammer Curl",2,10,12,75,"Biceps",[]],
    ["Overhead Tricep Extension",2,10,15,75,"Triceps",[]],
    ["Assisted Dips",2,6,10,120,"Chest",["Triceps","Front Delts"]]
  ]},
  {id:"upper-b",name:"Upper B – Hypertrophy",day:"Fri",plannedMinutes:50,exercises:[
    ["Incline Bench Press",3,8,12,150,"Chest",["Triceps","Front Delts"]],
    ["Seated Cable Row",3,8,12,120,"Back",["Biceps","Rear Delts"]],
    ["Seated Chest Press",2,10,15,105,"Chest",["Triceps","Front Delts"]],
    ["Lat Pulldown",2,10,15,105,"Back",["Biceps"]],
    ["DB Shoulder Press",2,8,12,120,"Front Delts",["Triceps","Side Delts"]],
    ["Face Pull",3,12,20,75,"Rear Delts",["Back"]],
    ["Lateral Raise",2,12,20,75,"Side Delts",[]],
    ["Cable Curl",2,10,15,75,"Biceps",[]]
  ]},
  {id:"lower-b",name:"Lower B – Hypertrophy",day:"Sat",plannedMinutes:50,exercises:[
    ["Deadlift",2,4,6,180,"Hamstrings",["Glutes","Back"]],
    ["Front Squat",3,6,10,150,"Quads",["Glutes"]],
    ["Bulgarian Split Squat",2,8,12,120,"Quads",["Glutes"]],
    ["Seated Hamstring Curl",3,10,15,90,"Hamstrings",[]],
    ["Leg Extension",2,12,15,75,"Quads",[]],
    ["Seated Calf Raise",3,12,20,75,"Calves",[]],
    ["Cable Crunch",2,10,15,60,"Core",[]]
  ]}
].map(w=>({...w,exercises:w.exercises.map((e,i)=>({
  id:w.id+"-"+i,name:e[0],sets:e[1],repMin:e[2],repMax:e[3],rest:e[4],primary:e[5],secondary:e[6]
}))}));

const TARGETS = {
  Chest:[10,14], Back:[12,18], "Front Delts":[6,10], "Side Delts":[8,12], "Rear Delts":[6,10],
  Biceps:[8,12], Triceps:[8,12], Quads:[10,14], Hamstrings:[8,12], Glutes:[6,10], Calves:[6,10], Core:[4,8]
};

const MUSCLE_WEIGHTS = {
  "Bench Press":{"Chest":1,"Triceps":0.5,"Front Delts":0.5},
  "Incline Bench Press":{"Chest":1,"Triceps":0.5,"Front Delts":0.5},
  "Incline DB Press":{"Chest":1,"Triceps":0.5,"Front Delts":0.5},
  "Dumbbell Bench Press":{"Chest":1,"Triceps":0.5,"Front Delts":0.5},
  "Smith Machine Bench Press":{"Chest":1,"Triceps":0.5,"Front Delts":0.5},
  "Seated Chest Press":{"Chest":1,"Triceps":0.5,"Front Delts":0.5},
  "Machine Chest Press":{"Chest":1,"Triceps":0.5,"Front Delts":0.5},
  "Assisted Dips":{"Chest":1,"Triceps":0.5,"Front Delts":0.5},
  "Dips":{"Chest":1,"Triceps":0.5,"Front Delts":0.5},
  "Overhead Press":{"Front Delts":1,"Triceps":0.5,"Side Delts":0.5},
  "DB Shoulder Press":{"Front Delts":1,"Triceps":0.5,"Side Delts":0.5},
  "Barbell Row":{"Back":1,"Biceps":0.5,"Rear Delts":0.5},
  "Chest Supported Row":{"Back":1,"Biceps":0.5,"Rear Delts":0.5},
  "Seated Cable Row":{"Back":1,"Biceps":0.5,"Rear Delts":0.5},
  "Face Pull":{"Rear Delts":1,"Back":0.5},
  "Rear Delt Fly":{"Rear Delts":1},
  "Lateral Raise":{"Side Delts":1},
  "Cable Lateral Raise":{"Side Delts":1},
  "Lat Pulldown":{"Back":1,"Biceps":0.5},
  "Weighted Pull-Ups":{"Back":1,"Biceps":0.5},
  "Assisted Pull-Ups":{"Back":1,"Biceps":0.5},
  "Single-Arm Lat Pulldown":{"Back":1,"Biceps":0.5}
};
function muscleCredits(log,workingCount){
  const explicit=MUSCLE_WEIGHTS[log.name];
  if(explicit) return Object.fromEntries(Object.entries(explicit).map(([m,w])=>[m,workingCount*w]));
  const out={}; if(log.primary) out[log.primary]=workingCount;
  (log.secondary||[]).forEach(m=>out[m]=(out[m]||0)+workingCount*0.5);
  return out;
}


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
  checkins:[],
  macroTargets:{protein:190,carbs:250,fat:80},
  appVersion:7
};
if(!state.customExercises) state.customExercises=[];
if(!state.exercisePrefs) state.exercisePrefs={};
if(!state.checkins) state.checkins=[];
if(!state.macroTargets) state.macroTargets={protein:190,carbs:250,fat:80};
if(!state.appVersion || state.appVersion<7){
  state.program=DEFAULT_PROGRAM;
  state.appVersion=7;
}

function save(){ localStorage.setItem("gymState",JSON.stringify(state)); }

function isoDate(d=new Date()){
  const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}
function greeting(){
  const h=new Date().getHours();
  return h<12?"Good morning":h<17?"Good afternoon":"Good evening";
}
function todayCheckin(){
  return state.checkins.find(x=>x.date===isoDate())||{date:isoDate(),weight:null,protein:null,carbs:null,fat:null};
}
function upsertCheckin(values){
  const d=isoDate(); let c=state.checkins.find(x=>x.date===d);
  if(!c){c={date:d,weight:null,protein:null,carbs:null,fat:null};state.checkins.push(c);}
  Object.assign(c,values); save();
}
function macroCalories(c){return Math.round((Number(c.protein)||0)*4+(Number(c.carbs)||0)*4+(Number(c.fat)||0)*9);}
function last7Checkins(){
  const out=[]; for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const key=isoDate(d);out.push(state.checkins.find(x=>x.date===key)||{date:key,protein:null,carbs:null,fat:null,weight:null});}
  return out;
}
function avg(arr,key){
  const vals=arr.map(x=>Number(x[key])).filter(v=>Number.isFinite(v)&&v>0);
  return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0;
}
function roundToIncrement(v,inc){return Math.round(v/inc)*inc;}
function loadIncrement(name){
  const n=name.toLowerCase();
  if(n.includes("leg press")||n.includes("deadlift")||n.includes("squat")) return 5;
  if(n.includes("machine")||n.includes("seated chest press")) return 5;
  if(n.includes("dumbbell")||n.includes("db ")) return 2;
  return 2.5;
}
function suggestedDelta(rir,name){
  if(rir==null||!Number.isFinite(Number(rir))) return 0;
  rir=Number(rir); const inc=loadIncrement(name);
  if(rir>=5) return Math.max(inc*2,name.toLowerCase().includes("leg press")?10:5);
  if(rir===4) return Math.max(inc,5);
  if(rir===3) return 2.5;
  return 0;
}
function nextSetSuggestion(ex,log){
  const working=(log.sets||[]).filter(s=>s.setType!=="warmup"); if(!working.length)return null;
  const s=working[working.length-1],rir=s.rir==null?null:Number(s.rir);
  if(s.assistWeight!=null){
    let next=Number(s.assistWeight);
    if(rir>=5)next=Math.max(0,next-5); else if(rir===4)next=Math.max(0,next-5); else if(rir===3)next=Math.max(0,next-2.5); else if(rir===0&&s.reps<ex.repMin)next+=2.5;
    return {mode:"assist",value:roundToIncrement(next,2.5),reason:rir>=3?`${rir} RIR — reduce assistance`:(rir===0&&s.reps<ex.repMin?"Below rep target — add assistance":"Keep assistance")};
  }
  if(s.addedWeight!=null){
    let next=Number(s.addedWeight); const d=suggestedDelta(rir,ex.name);
    if(rir>=3)next+=d; else if(rir===0&&s.reps<ex.repMin)next=Math.max(0,next-2.5);
    return {mode:"added",value:roundToIncrement(next,2.5),reason:rir>=3?`${rir} RIR — increase added load`:(rir===0&&s.reps<ex.repMin?"Below rep target — reduce load":"Keep load")};
  }
  if(s.weight!=null){
    let next=Number(s.weight); const d=suggestedDelta(rir,ex.name);
    if(rir>=3)next+=d; else if(rir===0&&s.reps<ex.repMin)next=Math.max(0,next-loadIncrement(ex.name)); else if(s.reps>=ex.repMax&&rir>=2)next+=loadIncrement(ex.name);
    const reason=rir>=5?`${rir} RIR — load was very comfortable`:rir===4?"4 RIR — increase load":rir===3?"3 RIR — small increase":(s.reps>=ex.repMax&&rir>=2?"Top of rep range — increase":(rir===0&&s.reps<ex.repMin?"Below rep target at 0 RIR — reduce":"Keep current load"));
    return {mode:"weight",value:roundToIncrement(next,loadIncrement(ex.name)),reason};
  }
  return null;
}
function sessionStartSuggestion(name){
  for(let i=state.history.length-1;i>=0;i--){
    const l=(state.history[i].logs||[]).find(x=>x.name===name); if(!l)continue;
    const working=(l.sets||[]).filter(s=>s.setType!=="warmup"); if(!working.length)continue;
    const ex=fullExerciseLibrary().find(x=>x.name===name)||{name,repMin:6,repMax:12};
    return {lastLog:l,suggestion:nextSetSuggestion(ex,{sets:working})};
  }
  return null;
}

function checkinForDate(date){
  return state.checkins.find(x=>x.date===date)||{date,weight:null,protein:null,carbs:null,fat:null};
}
function saveCheckinForDate(date){
  const values={
    weight:qs("#dateWeight")?.value===""?null:Number(qs("#dateWeight")?.value),
    protein:qs("#dateProtein")?.value===""?null:Number(qs("#dateProtein")?.value),
    carbs:qs("#dateCarbs")?.value===""?null:Number(qs("#dateCarbs")?.value),
    fat:qs("#dateFat")?.value===""?null:Number(qs("#dateFat")?.value)
  };
  let c=state.checkins.find(x=>x.date===date);
  if(!c){c={date,weight:null,protein:null,carbs:null,fat:null};state.checkins.push(c);}
  Object.assign(c,values);save();toast(`Saved ${date}`);openCalendarDate(date);
}
function workoutsForDate(date){
  return state.history.filter(h=>isoDate(new Date(h.end||h.start))===date);
}
function openCalendarDate(date){
  const c=checkinForDate(date),workouts=workoutsForDate(date);
  const pretty=new Date(date+"T12:00:00").toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  document.getElementById("app").innerHTML=shell(pretty,"Training diary",
    `<section class="card">
      <div class="between"><h3>Check-in</h3><span class="badge">${macroCalories(c)} kcal</span></div>
      <div class="input-grid">
        <div class="field"><label>Bodyweight kg</label><input id="dateWeight" type="number" step="0.1" value="${c.weight??""}"></div>
        <div class="field"><label>Protein g</label><input id="dateProtein" type="number" step="1" value="${c.protein??""}"></div>
        <div class="field"><label>Carbs g</label><input id="dateCarbs" type="number" step="1" value="${c.carbs??""}"></div>
        <div class="field"><label>Fat g</label><input id="dateFat" type="number" step="1" value="${c.fat??""}"></div>
      </div>
      <button class="primary" onclick="saveCheckinForDate('${date}')">SAVE CHECK-IN</button>
    </section>
    <section class="card">
      <div class="between"><h3>Workouts</h3><span class="badge">${workouts.length}</span></div>
      ${workouts.length?workouts.map(h=>`<div class="workout-row between"><div><strong>${h.name}</strong><div class="small">${(h.logs||[]).reduce((a,l)=>a+(l.sets||[]).filter(s=>s.setType!=="warmup").length,0)} working sets</div></div><button class="secondary" onclick="state.lastCompleted='${h.id}';save();go('summary')">View</button></div>`).join(""):`<div class="empty">No workout recorded for this date.</div>`}
      <button class="primary" onclick="chooseBackdatedWorkout('${date}')">ADD WORKOUT TO THIS DATE</button>
    </section>
    <button class="secondary" style="width:100%" onclick="go('home')">Back to Home</button>`,
  "home");
}
function chooseBackdatedWorkout(date){
  document.getElementById("app").innerHTML=shell("Add Workout",date,
    `<section class="card">
      ${state.program.map(w=>`<div class="workout-row between"><div><strong>${w.name}</strong><div class="small">${w.exercises.length} exercises</div></div><button class="secondary" onclick="createBackdatedWorkout('${date}','${w.id}')">Use</button></div>`).join("")}
      <button class="secondary" style="width:100%;margin-top:10px" onclick="createBackdatedCustomWorkout('${date}')">Blank custom workout</button>
    </section>
    <button class="primary" onclick="openCalendarDate('${date}')">Back</button>`,
  "home");
}
function createBackdatedWorkout(date,workoutId){
  const w=workoutById(workoutId);if(!w)return;
  const exercises=w.exercises.map(e=>({...e,plannedName:e.name,skipped:false}));
  state.current={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),workoutId,name:w.name,start:new Date(date+"T18:00:00").getTime(),exerciseIndex:0,restUntil:null,backdatedDate:date,backdated:true,exercises,logs:exercises.map(e=>({exerciseId:e.id,name:e.name,plannedName:e.name,primary:e.primary,secondary:e.secondary,rest:exerciseRest(e),sets:[],skipped:false,wasSwapped:false,notes:exerciseNotes(e.name)}))};
  save();go("live");
}
function createBackdatedCustomWorkout(date){
  state.backdatedCustomDate=date;
  startBlankCustom();
}
function monthCalendarHTML(){
  const now=new Date(),y=now.getFullYear(),m=now.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0);
  const completed=new Map(); state.history.forEach(h=>{const d=new Date(h.end||h.start);if(d.getFullYear()===y&&d.getMonth()===m)completed.set(d.getDate(),h.id);});
  const mondayIndex=(first.getDay()+6)%7,cells=[]; for(let i=0;i<mondayIndex;i++)cells.push("<div></div>");
  for(let day=1;day<=last.getDate();day++){const isToday=day===now.getDate(),id=completed.get(day),cls=`cal-day ${id?"trained":""} ${isToday?"today":""}`,date=`${y}-${String(m+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;cells.push(`<button class="${cls}" onclick="openCalendarDate('${date}')">${day}</button>`);}
  return `<div class="between"><h3>${now.toLocaleDateString(undefined,{month:"long",year:"numeric"})}</h3><span class="badge">${completed.size} sessions</span></div><div class="cal-head">${["M","T","W","T","F","S","S"].map(x=>`<span>${x}</span>`).join("")}</div><div class="calendar-grid">${cells.join("")}</div>`;
}
function startOfTrainingWeek(){
  const d=new Date(),day=(d.getDay()+6)%7;
  d.setHours(0,0,0,0); d.setDate(d.getDate()-day);
  return d.getTime();
}
function weeklyGapRows(){
  const totals=weeklyMuscleTotals();
  return Object.entries(TARGETS).map(([name,t])=>{const n=totals[name]||0,min=t[0],short=Math.max(0,min-n);return {name,n,min,max:t[1],short,pct:Math.min(100,n/min*100)};}).sort((a,b)=>b.short-a.short);
}
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
  const order=workoutOrder();
  if(!state.history.length) return state.program[0]?.id || null;
  let lastId=null;
  for(let i=state.history.length-1;i>=0;i--){
    if(order.includes(state.history[i].workoutId)){lastId=state.history[i].workoutId;break;}
  }
  if(!lastId) return state.program[0]?.id || null;
  const idx=order.indexOf(lastId);
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
  const recId=recommendedWorkoutId(),recommended=workoutById(recId)||state.program[0],selected=workoutById(state.selectedProgram)||recommended;
  const completedThisWeek=state.history.slice(-30).filter(h=>(h.end||0)>=startOfTrainingWeek()),recent=lastCompletedWorkout();
  const weekSets=completedThisWeek.reduce((a,h)=>a+(h.logs||[]).reduce((x,l)=>x+(l.sets||[]).filter(s=>s.setType!=="warmup").length,0),0);
  const isOverride=selected.id!==recommended.id,c=todayCheckin(),t=state.macroTargets,gaps=weeklyGapRows(),biggest=gaps.filter(x=>x.short>0).slice(0,3),kcalTarget=Math.round(t.protein*4+t.carbs*4+t.fat*9);
  return shell(`${greeting()}, Michael`,todayLabel(),
  `<section class="card hero">
      <div class="hero-orb"></div><span class="tag">${isOverride?"SELECTED":"RECOMMENDED"}</span>
      <div class="big">${selected.name}</div>
      <div class="meta">${isOverride?"Manual choice":recommendationReason(recommended)} · ${selected.exercises.length} exercises · ${totalSets(selected)} planned sets · ~${selected.plannedMinutes||50} min incl. warm-up</div>
      <button class="primary" onclick="startWorkout('${selected.id}')">START ${selected.name.toUpperCase()}</button>
      ${isOverride?`<button class="secondary" style="width:100%;margin-top:8px" onclick="state.selectedProgram='${recommended.id}';save();render()">Use recommended: ${recommended.name}</button>`:""}
    </section>
    <section class="card">${monthCalendarHTML()}</section>
    <section class="card">
      <div class="between"><h3>Today's check-in</h3><span class="badge">${macroCalories(c)} / ${kcalTarget} kcal</span></div>
      <div class="input-grid">
        <div class="field"><label>Bodyweight kg</label><input id="dailyWeight" type="number" step="0.1" value="${c.weight??""}" placeholder="e.g. 89.8"></div>
        <div class="field"><label>Protein g</label><input id="dailyProtein" type="number" step="1" value="${c.protein??""}" placeholder="${t.protein}"></div>
        <div class="field"><label>Carbs g</label><input id="dailyCarbs" type="number" step="1" value="${c.carbs??""}" placeholder="${t.carbs}"></div>
        <div class="field"><label>Fat g</label><input id="dailyFat" type="number" step="1" value="${c.fat??""}" placeholder="${t.fat}"></div>
      </div>
      <div style="margin-top:12px">${macroBar("Protein",c.protein,t.protein)}${macroBar("Carbs",c.carbs,t.carbs)}${macroBar("Fat",c.fat,t.fat)}</div>
      <button class="primary" onclick="saveCheckin()">SAVE TODAY</button>
    </section>
    <section class="card">
      <div class="between"><h3>Weekly training balance</h3><span class="badge">${weekSets} working sets</span></div>
      ${gaps.map(g=>`<div class="muscle-row"><strong>${g.name}</strong><div class="progress"><span style="width:${g.pct}%"></span></div><span class="${g.short>0?"warn":"good"} small">${g.short>0?`${g.short.toFixed(g.short%1?1:0)} short`:"Target ✓"}</span></div>`).join("")}
      ${biggest.length?`<div class="notice" style="margin-top:12px"><strong>Biggest gaps:</strong> ${biggest.map(x=>`${x.name} ${x.short.toFixed(x.short%1?1:0)} sets`).join(" · ")}</div><button class="primary" onclick="buildTopUp()">BUILD TOP-UP WORKOUT</button>`:`<div class="notice" style="margin-top:12px">All minimum weekly set targets reached.</div>`}
      <button class="secondary" style="width:100%;margin-top:8px" onclick="startBlankCustom()">CREATE BLANK CUSTOM WORKOUT</button>
    </section>
    ${recent?`<section class="card"><div class="between"><div><div class="section-kicker">Last session</div><h3 style="margin:0">${recent.name}</h3></div><button class="secondary" onclick="state.lastCompleted='${recent.id}';save();go('summary')">View</button></div><div class="small" style="margin-top:6px">${new Date(recent.end).toLocaleDateString()} · ${(recent.logs||[]).reduce((a,l)=>a+(l.sets||[]).filter(s=>s.setType!=="warmup").length,0)} working sets</div></section>`:""}
    <section class="card">
      <div class="between"><h3>Choose today's workout</h3><span class="badge">Flexible plan</span></div>
      ${state.program.map(w=>`<div class="workout-row between"><div class="row"><div class="day">${w.day[0]}</div><div><strong>${w.name}</strong><div class="small">${w.id===recommended.id?"Recommended next · ":""}${totalSets(w)} sets · ~${w.plannedMinutes||50} min</div></div></div><button class="secondary" onclick="state.selectedProgram='${w.id}';save();render()">${w.id===selected.id?"Selected":"Choose"}</button></div>`).join("")}
    </section>`,
  "home");
}
function macroBar(label,value,target){
  const v=Number(value)||0,pct=Math.min(100,v/target*100);
  return `<div style="margin:9px 0"><div class="between"><span class="small">${label}</span><span class="small">${v||0} / ${target} g</span></div><div class="progress"><span style="width:${pct}%"></span></div></div>`;
}
function saveCheckin(){
  upsertCheckin({weight:qs("#dailyWeight").value===""?null:Number(qs("#dailyWeight").value),protein:qs("#dailyProtein").value===""?null:Number(qs("#dailyProtein").value),carbs:qs("#dailyCarbs").value===""?null:Number(qs("#dailyCarbs").value),fat:qs("#dailyFat").value===""?null:Number(qs("#dailyFat").value)});
  toast("Today's check-in saved");render();
}


function suggestedExerciseForMuscle(muscle){
  const p={"Rear Delts":["Rear Delt Fly","Face Pull"],"Side Delts":["Cable Lateral Raise","Lateral Raise"],"Front Delts":["DB Shoulder Press","Overhead Press"],"Chest":["Seated Chest Press","Incline DB Press"],"Back":["Lat Pulldown","Seated Cable Row"],"Biceps":["Cable Curl","Hammer Curl"],"Triceps":["Tricep Pushdown","Overhead Tricep Extension"],"Quads":["Leg Extension","Leg Press"],"Hamstrings":["Leg Curl","Seated Hamstring Curl"],"Glutes":["Bulgarian Split Squat","Romanian Deadlift"],"Calves":["Standing Calf Raise","Seated Calf Raise"],"Core":["Cable Crunch","Hanging Leg Raise"]};
  return (p[muscle]||[]).map(n=>fullExerciseLibrary().find(x=>x.name===n)).filter(Boolean);
}
function makeSessionExercise(item,sets=3){
  return {id:"custom-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),name:item.name,plannedName:item.name,sets,repMin:item.repMin||8,repMax:item.repMax||12,rest:exerciseRest(item),primary:item.primary,secondary:item.secondary||[],equipment:item.equipment||"Other",type:item.type||"Custom",skipped:false};
}
function launchCustom(name,exercises){
  state.current={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),workoutId:"custom",name,start:Date.now(),exerciseIndex:0,restUntil:null,exercises,logs:exercises.map(e=>({exerciseId:e.id,name:e.name,plannedName:e.name,primary:e.primary,secondary:e.secondary,rest:e.rest,sets:[],skipped:false,wasSwapped:false,notes:exerciseNotes(e.name)}))};
  save();go("live");
}
function buildTopUp(){
  const gaps=weeklyGapRows().filter(x=>x.short>0).slice(0,3);if(!gaps.length){toast("No weekly gaps to top up");return}
  const exercises=[];gaps.forEach(g=>{const c=suggestedExerciseForMuscle(g.name);if(c.length)exercises.push(makeSessionExercise(c[0],Math.min(4,Math.max(1,Math.ceil(g.short)))));});
  launchCustom("Weekly Top-Up",exercises);
}
function startBlankCustom(){
  window.__blankCustom=[]; if(!state.backdatedCustomDate) state.backdatedCustomDate=null;
  document.getElementById("app").innerHTML=shell("Custom Workout","Choose exercises",
    `<section class="card"><div class="notice" style="margin-bottom:12px">Pick exercises from the library. Use your weekly set balance to guide what you need most.</div>${fullExerciseLibrary().map(x=>`<div class="workout-row between"><div><strong>${x.name}</strong><div class="small">${x.primary} · ${x.equipment||""}</div></div><button class="secondary" onclick='addToBlankCustom(${JSON.stringify(x.name)})'>Add</button></div>`).join("")}</section>
     <section class="card"><h3>Selected</h3><div id="customSelected" class="small">No exercises selected yet.</div><button class="primary" onclick="launchBlankCustom()">START CUSTOM WORKOUT</button></section>`,"home");
}
function addToBlankCustom(name){
  const item=fullExerciseLibrary().find(x=>x.name===name);if(!item)return;window.__blankCustom.push(makeSessionExercise(item,3));
  const el=document.getElementById("customSelected");if(el)el.innerHTML=window.__blankCustom.map((x,i)=>`${i+1}. ${x.name} · ${x.sets} sets`).join("<br>");
}
function launchBlankCustom(){
  if(!window.__blankCustom?.length){toast("Add at least one exercise");return}
  if(state.backdatedCustomDate){
    const date=state.backdatedCustomDate,exercises=window.__blankCustom;
    state.current={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),workoutId:"custom",name:"Custom Workout",start:new Date(date+"T18:00:00").getTime(),exerciseIndex:0,restUntil:null,backdatedDate:date,backdated:true,exercises,logs:exercises.map(e=>({exerciseId:e.id,name:e.name,plannedName:e.name,primary:e.primary,secondary:e.secondary,rest:e.rest,sets:[],skipped:false,wasSwapped:false,notes:exerciseNotes(e.name)}))};
    state.backdatedCustomDate=null;save();go("live");
  }else{
    launchCustom("Custom Workout",window.__blankCustom);
  }
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
  const sessionExercises = state.current.exercises || (state.program.find(x=>x.id===state.current.workoutId)?.exercises||[]);
  const ex=sessionExercises[state.current.exerciseIndex];
  const log=state.current.logs[state.current.exerciseIndex];
  if(!ex) { finishWorkout(); return ""; }
  ex.rest=exerciseRest(ex);
  log.rest=ex.rest;
  if(state.current.restUntil && state.current.restUntil>Date.now()) return restScreen();

  const prev = lastExerciseSession(ex.name);
  const startInfo=sessionStartSuggestion(ex.name);
  const nextSug=nextSetSuggestion(ex,log);
  const setNo = log.sets.length+1;
  const prevSet = prev?.sets?.[Math.min(setNo-1,(prev.sets||[]).length-1)];
  const defaultWeight = nextSug?.mode==="weight"?nextSug.value:(setNo===1&&startInfo?.suggestion?.mode==="weight"?startInfo.suggestion.value:(prevSet?.weight ?? ""));
  const defaultReps = prevSet?.reps ?? "";
  const defaultRir = "";
  const defaultAssist = nextSug?.mode==="assist"?nextSug.value:(setNo===1&&startInfo?.suggestion?.mode==="assist"?startInfo.suggestion.value:(prevSet?.assistWeight ?? ""));
  const defaultAdded = nextSug?.mode==="added"?nextSug.value:(setNo===1&&startInfo?.suggestion?.mode==="added"?startInfo.suggestion.value:(prevSet?.addedWeight ?? ""));

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
      ${state.current.backdated?`<div class="notice" style="margin-top:10px">Backdated workout for ${state.current.backdatedDate}. This session will save to that historical date.</div>`:""}
      ${prev?`<div class="card" style="margin-top:14px"><div class="small">Previous ${ex.name}</div><strong>${prev.sets.filter(s=>s.setType!=="warmup").map(s=>formatSet(s,ex.name)).join(" · ")}</strong></div>`:""}
      ${(nextSug||startInfo?.suggestion)?`<div class="notice" style="margin-top:10px"><strong>Suggested load:</strong> ${formatSuggestion(nextSug||startInfo.suggestion)}<br><span class="small">${(nextSug||startInfo.suggestion).reason||"Based on your last logged performance"}</span></div>`:""}
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

function formatSuggestion(s){
  if(!s)return "—";
  if(s.mode==="assist")return `${s.value} kg assistance`;
  if(s.mode==="added")return `${s.value>0?"+":""}${s.value} kg added`;
  return `${s.value} kg`;
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
  const exercises=state.current.exercises || (state.program.find(x=>x.id===state.current.workoutId)?.exercises||[]);
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
  const exercises=state.current.exercises || (state.program.find(x=>x.id===state.current.workoutId)?.exercises||[]);
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
  c.end=(c.backdated&&c.backdatedDate)?new Date(c.backdatedDate+"T19:00:00").getTime():Date.now();
  state.history.push(c);
  state.current=null;
  state.lastCompleted=c.id;
  if(!c.backdated){
    const nextId=recommendedWorkoutId();
    if(nextId) state.selectedProgram=nextId;
  }
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
  const h=findHistory(state.lastCompleted)||state.history[state.history.length-1]; if(!h)return summary();
  const muscle={};
  (h.logs||[]).forEach(l=>{
    if(l.skipped)return;
    const n=(l.sets||[]).filter(s=>s.setType!=="warmup").length; if(!n)return;
    const credits=muscleCredits(l,n); Object.entries(credits).forEach(([m,v])=>muscle[m]=(muscle[m]||0)+v);
  });
  const week=weeklyMuscleTotals();
  return shell("Workout Analysis",h.name,
    `<section class="card"><h3>Effective muscle sets</h3>
      <div class="small" style="margin-bottom:12px">Primary muscles count as full sets; meaningful secondary involvement receives fractional credit.</div>
      ${Object.entries(muscle).sort((a,b)=>b[1]-a[1]).map(([m,n])=>{const t=TARGETS[m]||[0,Math.max(1,Math.ceil(n))],current=week[m]||0,pct=Math.min(100,current/Math.max(1,t[0])*100);return `<div class="muscle-row"><strong>${m}</strong><div class="progress"><span style="width:${pct}%"></span></div><span class="small">${n.toFixed(n%1?1:0)} today</span></div>`}).join("")}
    </section>
    <section class="card"><h3>Exercise performance</h3>${(h.logs||[]).filter(x=>(x.sets||[]).length).map(l=>performanceLine(l,h)).join("")}</section>`,
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
  const cutoff=startOfTrainingWeek(),muscle={};
  state.history.filter(h=>(h.end||0)>=cutoff).forEach(h=>(h.logs||[]).forEach(l=>{
    const n=(l.sets||[]).filter(s=>s.setType!=="warmup").length; if(!n)return;
    const credits=muscleCredits(l,n);
    Object.entries(credits).forEach(([m,v])=>muscle[m]=(muscle[m]||0)+v);
  }));
  return muscle;
}
function stats(){
  const lifts=["Bench Press","Back Squat","Deadlift","Overhead Press","Assisted Pull-Ups","Weighted Pull-Ups","Assisted Dips","Dips","Barbell Row","Seated Chest Press"];
  const cards=lifts.map(name=>{
    const pts=state.history.map(h=>{
      const l=(h.logs||[]).find(x=>x.name===name&&(x.sets||[]).length),m=l?bestPerformanceMetric(l):null;
      return m?{t:h.end,v:m.value,type:m.type,label:m.label}:null;
    }).filter(Boolean);
    if(!pts.length)return "";
    const latest=pts[pts.length-1],first=pts[0];let trendText="",trendClass="good";
    if(latest.type==="assist"){const d=first.v-latest.v;trendClass=d>=0?"good":"bad";trendText=`${d>=0?"↓":"↑"} ${Math.abs(d).toFixed(1)} kg assistance`;}
    else if(latest.type==="added"){const d=latest.v-first.v;trendClass=d>=0?"good":"bad";trendText=`${d>=0?"↑":"↓"} ${Math.abs(d).toFixed(1)} kg added`;}
    else{const d=first.v?((latest.v-first.v)/first.v*100):0;trendClass=d>=0?"good":"bad";trendText=`${d>=0?"↑":"↓"} ${Math.abs(d).toFixed(1)}%`;}
    return `<section class="card"><div class="chart-title"><div><div class="section-kicker">Strength trend</div><h3 style="margin:0">${name}</h3></div><div class="pill-score"><strong>${latest.label}</strong></div></div><div class="chart">${sparklineSVG(pts)}<div class="${trendClass}" style="font-weight:800;font-size:12px">${trendText} from first log</div></div></section>`;
  }).join("");
  const m=weeklyMuscleTotals(),week=last7Checkins(),t=state.macroTargets;
  const proteinAvg=avg(week,"protein"),carbAvg=avg(week,"carbs"),fatAvg=avg(week,"fat"),wtAvg=avg(week,"weight");
  return shell("Progress","Strength, volume, bodyweight & nutrition",
    `<section class="card">
      <div class="between"><h3>7-day nutrition</h3><button class="secondary" onclick="editMacroTargets()">Targets</button></div>
      <div class="metric-grid">
        <div class="metric"><strong>${proteinAvg?proteinAvg.toFixed(0):"—"}g</strong><span>Protein avg / ${t.protein}g</span></div>
        <div class="metric"><strong>${carbAvg?carbAvg.toFixed(0):"—"}g</strong><span>Carbs avg / ${t.carbs}g</span></div>
        <div class="metric"><strong>${fatAvg?fatAvg.toFixed(0):"—"}g</strong><span>Fat avg / ${t.fat}g</span></div>
        <div class="metric"><strong>${wtAvg?wtAvg.toFixed(1):"—"}kg</strong><span>7-day weight average</span></div>
      </div>
      <div style="margin-top:16px">${nutritionWeekHTML(week,t)}</div>
    </section>
    ${cards||`<section class="card empty">Log a few workouts to build strength charts.</section>`}
    <section class="card"><div class="between"><h3>Weekly muscle volume</h3><span class="badge">Effective sets</span></div>
      ${Object.entries(TARGETS).map(([name,tg])=>{const n=m[name]||0,p=Math.min(100,n/tg[0]*100);return `<div class="muscle-row"><strong>${name}</strong><div class="progress"><span style="width:${p}%"></span></div><span class="small">${n.toFixed(n%1?1:0)} / ${tg[0]} min</span></div>`}).join("")}
    </section>`,
  "stats");
}
function nutritionWeekHTML(week,t){
  const rows=[["Protein","protein",t.protein],["Carbs","carbs",t.carbs],["Fat","fat",t.fat]];
  return rows.map(([label,key,target])=>`<div style="margin:14px 0"><div class="between"><strong>${label}</strong><span class="small">Target ${target}g</span></div><div class="week-bars">${week.map(c=>{const d=new Date(c.date+"T12:00:00"),day=d.toLocaleDateString(undefined,{weekday:"narrow"}),v=Number(c[key])||0,pct=Math.min(120,v/target*100);return `<div class="week-bar"><div class="week-bar-fill" style="height:${Math.max(4,pct)}%"></div><span>${day}</span><small>${v||"—"}</small></div>`}).join("")}</div></div>`).join("");
}
function editMacroTargets(){
  const p=parseInt(prompt("Protein target (g):",state.macroTargets.protein));if(!(p>0))return;
  const c=parseInt(prompt("Carb target (g):",state.macroTargets.carbs));if(!(c>0))return;
  const f=parseInt(prompt("Fat target (g):",state.macroTargets.fat));if(!(f>0))return;
  state.macroTargets={protein:p,carbs:c,fat:f};save();render();
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
      <h3>60-minute session design</h3>
      <div class="notice">The default programme is planned for roughly 48–52 minutes including an 8–10 minute warm-up and dynamic preparation. Keep rests near the defaults to stay within the hour.</div>
    </section>
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
window.saveCheckin=saveCheckin;window.buildTopUp=buildTopUp;window.startBlankCustom=startBlankCustom;
window.addToBlankCustom=addToBlankCustom;window.launchBlankCustom=launchBlankCustom;window.editMacroTargets=editMacroTargets;
window.openCalendarDate=openCalendarDate;window.saveCheckinForDate=saveCheckinForDate;
window.chooseBackdatedWorkout=chooseBackdatedWorkout;window.createBackdatedWorkout=createBackdatedWorkout;
window.createBackdatedCustomWorkout=createBackdatedCustomWorkout;
render();

if("serviceWorker" in navigator){ window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{})); }
