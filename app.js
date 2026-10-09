
const APP_RELEASE = "8.6";
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
if(!state.progressMetric) state.progressMetric="weight";
if(!state.progressRange) state.progressRange="7D";
if(!Number.isInteger(state.progressPoint)) state.progressPoint=-1;
if(!state.grit) state.grit={days:[],nextDate:null};
if(!Array.isArray(state.grit.days)) state.grit.days=[];
if(!Array.isArray(state.trainingBlocks)){
  const recent=(state.history||[]).map(h=>h.end||h.start).filter(Number.isFinite).filter(t=>t>=Date.now()-42*86400000).sort((a,b)=>a-b)[0];
  state.trainingBlocks=[{id:`block-${Date.now()}`,name:"Training Block 1",startDate:recent?isoDate(new Date(recent)):isoDate(),weeks:6,status:"active"}];
}
if(!state.activeBlockId)state.activeBlockId=state.trainingBlocks.find(b=>b.status==="active")?.id||state.trainingBlocks.at(-1)?.id;
if(!state.exerciseFilters)state.exerciseFilters={search:"",muscle:"All"};
if(!/^\d{4}-\d{2}$/.test(state.calendarMonth||"")) state.calendarMonth=isoDate().slice(0,7);
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
  return state.checkins.find(x=>x.date===isoDate())||{date:isoDate(),weight:null,protein:null,carbs:null,fat:null,waist:null};
}
function upsertCheckin(values){
  const d=isoDate(); let c=state.checkins.find(x=>x.date===d);
  if(!c){c={date:d,weight:null,protein:null,carbs:null,fat:null,waist:null};state.checkins.push(c);}
  Object.assign(c,values); save();
}
function macroCalories(c){return Math.round((Number(c.protein)||0)*4+(Number(c.carbs)||0)*4+(Number(c.fat)||0)*9);}
function calorieTarget(){
  const t=state.macroTargets||{protein:190,carbs:250,fat:80};
  return Math.round(Number(t.protein)*4+Number(t.carbs)*4+Number(t.fat)*9);
}
function updateAutoCalories(prefix){
  const protein=Number(qs(`#${prefix}Protein`)?.value)||0;
  const carbs=Number(qs(`#${prefix}Carbs`)?.value)||0;
  const fat=Number(qs(`#${prefix}Fat`)?.value)||0;
  const calories=Math.round(protein*4+carbs*4+fat*9);
  const value=qs(`#${prefix}CaloriesValue`);
  const badge=qs(`#${prefix}CaloriesBadge`);
  if(value)value.textContent=`${calories.toLocaleString()} kcal`;
  if(badge)badge.textContent=prefix==="daily"?`${calories.toLocaleString()} / ${calorieTarget().toLocaleString()} kcal`:`${calories.toLocaleString()} kcal`;
}
function last7Checkins(){
  const out=[]; for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const key=isoDate(d);out.push(state.checkins.find(x=>x.date===key)||{date:key,protein:null,carbs:null,fat:null,weight:null,waist:null});}
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
  return state.checkins.find(x=>x.date===date)||{date,weight:null,protein:null,carbs:null,fat:null,waist:null};
}
function saveCheckinForDate(date){
  const values={
    weight:qs("#dateWeight")?.value===""?null:Number(qs("#dateWeight")?.value),
    protein:qs("#dateProtein")?.value===""?null:Number(qs("#dateProtein")?.value),
    carbs:qs("#dateCarbs")?.value===""?null:Number(qs("#dateCarbs")?.value),
    fat:qs("#dateFat")?.value===""?null:Number(qs("#dateFat")?.value),
    waist:qs("#dateWaist")?.value===""?null:Number(qs("#dateWaist")?.value)
  };
  let c=state.checkins.find(x=>x.date===date);
  if(!c){c={date,weight:null,protein:null,carbs:null,fat:null,waist:null};state.checkins.push(c);}
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
      <div class="between"><h3>Check-in</h3><span class="badge" id="dateCaloriesBadge">${macroCalories(c)} kcal</span></div>
      <div class="input-grid">
        <div class="field"><label>Bodyweight kg</label><input id="dateWeight" type="number" step="0.1" value="${c.weight??""}"></div>
        <div class="field"><label>Protein g</label><input id="dateProtein" type="number" step="1" value="${c.protein??""}" oninput="updateAutoCalories('date')"></div>
        <div class="field"><label>Carbs g</label><input id="dateCarbs" type="number" step="1" value="${c.carbs??""}" oninput="updateAutoCalories('date')"></div>
        <div class="field"><label>Fat g</label><input id="dateFat" type="number" step="1" value="${c.fat??""}" oninput="updateAutoCalories('date')"></div>
        <div class="field readonly-field"><label>Calories · auto 4/4/9</label><div id="dateCaloriesValue" class="readonly-value">${macroCalories(c).toLocaleString()} kcal</div></div>
        <div class="field"><label>Waist cm (weekly)</label><input id="dateWaist" type="number" step="0.1" value="${c.waist??""}"></div>
      </div>
      <div class="small" style="margin-top:8px">Waist: measure around the belly button, relaxed. Normally record once per week.</div>
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
  const exercises=w.exercises.map(e=>{
    const pref=exercisePref(e.name);
    return {...e,...pref,name:e.name,plannedName:e.name,skipped:false,rest:pref.rest||e.rest};
  });
  state.current={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),workoutId,name:w.name,start:new Date(date+"T18:00:00").getTime(),exerciseIndex:0,restUntil:null,backdatedDate:date,backdated:true,exercises,logs:exercises.map(e=>({exerciseId:e.id,name:e.name,plannedName:e.name,primary:e.primary,secondary:e.secondary,rest:exerciseRest(e),sets:[],skipped:false,wasSwapped:false,notes:exerciseNotes(e.name)}))};
  save();go("live");
}
function createBackdatedCustomWorkout(date){
  state.backdatedCustomDate=date;
  startBlankCustom();
}
function calendarViewDate(){
  const now=new Date(),parts=String(state.calendarMonth||"").split("-").map(Number);
  const view=parts.length===2&&parts.every(Number.isFinite)?new Date(parts[0],parts[1]-1,1):new Date(now.getFullYear(),now.getMonth(),1);
  const current=new Date(now.getFullYear(),now.getMonth(),1);
  if(view>current){state.calendarMonth=isoDate(now).slice(0,7);return current;}
  return view;
}
function changeCalendarMonth(delta){
  const view=calendarViewDate(),next=new Date(view.getFullYear(),view.getMonth()+delta,1),now=new Date(),current=new Date(now.getFullYear(),now.getMonth(),1);
  if(next>current)return;
  state.calendarMonth=`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,"0")}`;
  save();render();
}
function monthCalendarHTML(){
  const now=new Date(),view=calendarViewDate(),y=view.getFullYear(),m=view.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0);
  const monthSessions=state.history.filter(h=>{const d=new Date(h.end||h.start);return d.getFullYear()===y&&d.getMonth()===m;});
  const completed=new Set(); monthSessions.forEach(h=>{const d=new Date(h.end||h.start);completed.add(d.getDate());});
  const mondayIndex=(first.getDay()+6)%7,cells=[]; for(let i=0;i<mondayIndex;i++)cells.push("<div></div>");
  for(let day=1;day<=last.getDate();day++){const isToday=y===now.getFullYear()&&m===now.getMonth()&&day===now.getDate(),trained=completed.has(day),cls=`cal-day ${trained?"trained":""} ${isToday?"today":""}`,date=`${y}-${String(m+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;cells.push(`<button class="${cls}" onclick="openCalendarDate('${date}')" aria-label="${date}${trained?", trained":""}">${day}</button>`);}
  const isCurrent=y===now.getFullYear()&&m===now.getMonth(),count=monthSessions.length;
  return `<div class="calendar-title-row"><button class="calendar-nav" onclick="changeCalendarMonth(-1)" aria-label="Previous month">‹</button><h3>${view.toLocaleDateString(undefined,{month:"long",year:"numeric"})}</h3><button class="calendar-nav" onclick="changeCalendarMonth(1)" aria-label="Next month" ${isCurrent?"disabled":""}>›</button><span class="badge">${count} session${count===1?"":"s"}</span></div><div class="cal-head">${["M","T","W","T","F","S","S"].map(x=>`<span>${x}</span>`).join("")}</div><div class="calendar-grid">${cells.join("")}</div>`;
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
function htmlSafe(value){return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
const GRIT_DAYS=[{n:1,label:"Mon"},{n:2,label:"Tue"},{n:3,label:"Wed"},{n:4,label:"Thu"},{n:5,label:"Fri"},{n:6,label:"Sat"},{n:0,label:"Sun"}];
function localDateFromISO(value){return new Date(`${value}T12:00:00`)}
function dateDiffDays(a,b){return Math.round((localDateFromISO(a)-localDateFromISO(b))/86400000)}
function gritScoreFor(planned,completed){
  if(!planned||!completed)return null;
  const daysOutside=Math.max(0,Math.abs(dateDiffDays(completed,planned))-1);
  return Math.max(0,100-daysOutside*13);
}
function nextScheduledGritDate(afterDate=isoDate(),includeToday=true){
  const days=state.grit?.days||[];if(!days.length)return null;
  const d=localDateFromISO(afterDate);
  for(let i=includeToday?0:1;i<=14;i++){const x=new Date(d);x.setDate(x.getDate()+i);if(days.includes(x.getDay()))return isoDate(x)}
  return null;
}
function gritScores(){return state.history.map(h=>Number(h.gritScore)).filter(Number.isFinite)}
function overallGrit(){const scores=gritScores();return scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):100}
function gritWindowText(date){
  if(!date)return "Set your next workout";
  const d=localDateFromISO(date),from=new Date(d),to=new Date(d);from.setDate(from.getDate()-1);to.setDate(to.getDate()+1);
  const f=x=>x.toLocaleDateString(undefined,{weekday:"short",day:"numeric",month:"short"});
  return `${f(from)} – ${f(to)}`;
}
function toggleGritDay(day){const el=document.querySelector(`.grit-day[data-day="${day}"]`);if(el)el.classList.toggle("active")}
function openGritSettings(){
  const selected=new Set(state.grit.days||[]);
  document.getElementById("app").innerHTML=shell("Grit Schedule","Choose the days you intend to train",
    `<section class="card grit-settings-card"><div class="notice">Choose your normal training days. Each planned workout has a 100% window covering the planned day and one day either side.</div>
      <div class="grit-day-grid">${GRIT_DAYS.map(d=>`<button class="grit-day ${selected.has(d.n)?"active":""}" data-day="${d.n}" onclick="toggleGritDay(${d.n})">${d.label}</button>`).join("")}</div>
      <div class="small">The number selected becomes your intended weekly frequency. You can still choose a different next date after any completed workout.</div>
      <button class="primary" onclick="saveGritSettings()">SAVE GRIT SCHEDULE</button>
    </section><button class="secondary" style="width:100%" onclick="go('home')">Cancel</button>`,"home");
}
function saveGritSettings(){
  const days=[...document.querySelectorAll(".grit-day.active")].map(x=>Number(x.dataset.day));
  if(!days.length){toast("Choose at least one training day");return}
  state.grit.days=days;
  if(!state.grit.nextDate||dateDiffDays(state.grit.nextDate,isoDate())<0)state.grit.nextDate=nextScheduledGritDate(isoDate(),true);
  save();go("home");toast(`Grit set for ${days.length} workout${days.length===1?"":"s"} per week`);
}
function saveNextWorkoutDate(){
  const date=qs("#nextWorkoutDate")?.value;if(!date){toast("Choose your next workout date");return}
  state.grit.nextDate=date;save();render();toast("Next workout planned");
}
function gritCardHTML(){
  const configured=state.grit.days.length>0,score=overallGrit(),scores=gritScores(),next=state.grit.nextDate;
  if(!configured)return `<section class="card grit-card"><div class="between"><div><div class="section-kicker">Consistency</div><h3 style="margin:0">Build your Grit score</h3></div><div class="grit-ring grit-empty"><strong>—</strong></div></div><div class="small" style="margin-top:10px">Set the days you intend to train. Complete workouts inside each three-day window to maintain 100% Grit.</div><button class="primary" onclick="openGritSettings()">SET TRAINING FREQUENCY</button></section>`;
  return `<section class="card grit-card"><div class="between"><div><div class="section-kicker">Your consistency</div><h3 style="margin:0">Grit score</h3><div class="small" style="margin-top:6px">Average of ${scores.length} scored workout${scores.length===1?"":"s"}</div></div><div class="grit-ring" style="--grit:${score*3.6}deg"><strong>${score}%</strong></div></div>
    <div class="grit-next"><span>Next 100% window</span><strong>${gritWindowText(next)}</strong>${next?`<small>Planned for ${localDateFromISO(next).toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"short"})}</small>`:""}</div>
    <button class="secondary" style="width:100%;margin-top:10px" onclick="openGritSettings()">Edit workout days</button></section>`;
}
function workoutFocusLabel(workout){
  const name=String(workout?.name||"").toLowerCase();
  if(name.includes("push"))return "Push";
  if(name.includes("pull"))return "Pull";
  if(name.includes("upper"))return "Upper";
  if(name.includes("lower")||name.includes("leg"))return "Lower";
  const groups=[...new Set((workout?.exercises||[]).map(e=>e.primary).filter(Boolean))];
  const upper=groups.filter(m=>!["Quads","Hamstrings","Glutes","Calves"].includes(m)).length;
  const lower=groups.length-upper;
  if(lower&&!upper)return "Lower";
  if(upper&&!lower)return "Upper";
  return workout?.name||"Workout";
}
function compactGritHTML(){
  const configured=state.grit.days.length>0,score=overallGrit(),next=state.grit.nextDate;
  return `<button class="dashboard-mini grit-mini" onclick="openGritSettings()">
    <span class="dashboard-label">GRIT SCORE</span>
    <span class="dashboard-value">${configured?`${score}%`:"SET UP"}</span>
    <span class="grit-mini-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
    <small>${configured?(next?gritWindowText(next):"Plan next workout"):"Choose workout days"}</small>
    <b aria-hidden="true">›</b>
  </button>`;
}
function weeklyDashboardCard(weekSets,totals){
  const trained=Object.values(totals).filter(v=>Number(v)>0).length;
  return `<section class="card weekly-anatomy-card">
    <div class="weekly-anatomy-copy">
      <span class="dashboard-label">SETS THIS WEEK</span>
      <strong>${weekSets} <em>SETS</em></strong>
      <span>${trained?`${trained} muscle group${trained===1?"":"s"} trained`:"Your muscle map builds as you train"}</span>
      <button class="weekly-detail-link" onclick="go('stats')">View progress <b>›</b></button>
    </div>
    <div class="weekly-anatomy-figure">${muscleBodySVG(totals)}</div>
  </section>`;
}
function fmtSec(s){ const m=Math.floor(s/60), sec=s%60; return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`; }
function e1rm(w,r){ if(!(w>0) || !(r>0)) return 0; return +(w*(1+r/30)).toFixed(1); }
function totalSets(w){return w.exercises.reduce((a,e)=>a+e.sets,0)}


function fullExerciseLibrary(){
  const map=new Map();
  [...EXERCISE_LIBRARY,...(state.customExercises||[])].forEach(x=>{
    const pref=state.exercisePrefs?.[x.name]||{};
    map.set(x.name.toLowerCase(),{...x,...pref,name:x.name});
  });
  return [...map.values()];
}
function exercisePref(name){
  return state.exercisePrefs?.[name] || {};
}
function exerciseDefinition(name){
  return fullExerciseLibrary().find(x=>x.name.toLowerCase()===String(name).toLowerCase())||null;
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

function reptraceMark(){
  return `<svg class="reptrace-mark" viewBox="0 0 64 54" aria-hidden="true">
    <path class="reptrace-mark-lime" d="M3 3h34.2C51.8 3 61 11.4 61 24.6c0 8.6-3.7 15.2-10.8 19.8l-7.4-10.2c4.1-2.5 5.9-5.6 5.9-9.8 0-5.7-4.3-9.2-11.4-9.2H3z"/>
    <path class="reptrace-mark-white" d="M3 18.7h28.8c4.8 0 8.5 1.8 11.3 5.6L62 51H46.6L32.9 32.4c-1-1.3-2.3-1.8-4.1-1.8H3z"/>
    <path class="reptrace-mark-white" d="M20.8 35.1h12L44 51H31.8z"/>
  </svg>`;
}
function reptraceLockup(){
  return `<div class="reptrace-lockup">${reptraceMark()}<span>REPTRACE</span></div>`;
}

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
    <header class="topbar"><div class="brand-row">${reptraceLockup()}<span class="brand-tagline">STRENGTH, MADE VISIBLE.</span></div><div class="title">${title}</div>${subtitle?`<div class="subtitle">${subtitle}</div>`:""}</header>
    <main class="content">${body}</main>${nav(active)}
  </div>`;
}


const EXERCISE_GROUPS = [
  "Chest","Back","Front Delts","Side Delts","Rear Delts","Biceps","Triceps",
  "Quads","Hamstrings","Glutes","Calves","Core"
];


let workoutClockHandle=null;
function workoutElapsedSeconds(){
  if(!state.current || state.current.backdated) return 0;
  return Math.max(0,Math.floor((Date.now()-(state.current.start||Date.now()))/1000));
}
function workoutElapsedText(){
  const s=workoutElapsedSeconds(),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;
  return h>0?`${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`:`${m}:${String(sec).padStart(2,"0")}`;
}
function startWorkoutTicker(){
  if(workoutClockHandle) clearInterval(workoutClockHandle);
  const tick=()=>{
    const el=document.getElementById("workoutElapsed");
    if(el && state.current && !state.current.backdated) el.textContent=workoutElapsedText();
  };
  tick();
  workoutClockHandle=setInterval(tick,1000);
}
function latestWaist(){
  return state.checkins.filter(x=>Number(x.waist)>0).sort((a,b)=>a.date.localeCompare(b.date)).pop()||null;
}
function waistThisWeek(){
  const cutoff=startOfTrainingWeek();
  return state.checkins.filter(x=>Number(x.waist)>0 && new Date(x.date+"T12:00:00").getTime()>=cutoff).sort((a,b)=>a.date.localeCompare(b.date)).pop()||null;
}
function saveWeeklyWaist(){
  const v=parseFloat(qs("#weeklyWaist")?.value);
  if(!(v>0)){toast("Enter waist measurement");return}
  upsertCheckin({waist:v});
  toast("Weekly waist measurement saved");
  render();
}
function muscleIcon(muscle){
  const m=muscle||"";
  if(["Quads","Hamstrings","Glutes","Calves"].includes(m)) return "🦵";
  if(["Biceps","Triceps"].includes(m)) return "💪";
  if(["Front Delts","Side Delts","Rear Delts"].includes(m)) return "◉";
  if(m==="Chest") return "◆";
  if(m==="Back") return "⬟";
  if(m==="Core") return "◎";
  return "🏆";
}
let muscleSvgCounter=0;
function legacyMuscleBodySVG(values={}){
  const max=Math.max(1,...Object.values(values).map(Number).filter(Number.isFinite));
  const op=m=>values[m]?Math.max(.42,Math.min(1,Number(values[m])/max)):.035;
  const fill=(m)=>`data-muscle="${m}" style="opacity:${op(m)}"`;
  const id=`anatomy-${++muscleSvgCounter}`;
  return `<svg class="muscle-body" viewBox="0 0 460 264" role="img" aria-label="Front and back anatomical muscle map">
    <defs>
      <linearGradient id="${id}-skin" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#48515a"/><stop offset=".48" stop-color="#252c32"/><stop offset="1" stop-color="#151a1f"/></linearGradient>
      <linearGradient id="${id}-limb" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#1b2126"/><stop offset=".48" stop-color="#3d464e"/><stop offset="1" stop-color="#171c21"/></linearGradient>
      <linearGradient id="${id}-active" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e5ff79" stop-opacity=".80"/><stop offset=".5" stop-color="#caff3a" stop-opacity=".74"/><stop offset="1" stop-color="#8fc900" stop-opacity=".68"/></linearGradient>
      <radialGradient id="${id}-head" cx="40%" cy="28%"><stop stop-color="#515b64"/><stop offset=".65" stop-color="#293137"/><stop offset="1" stop-color="#171c21"/></radialGradient>
      <filter id="${id}-glow" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="1.15" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <image class="anatomy-render" href="anatomy-premium.png" x="0" y="0" width="460" height="264" preserveAspectRatio="xMidYMid meet"/>
    <g class="muscle-hi" fill="url(#${id}-active)" filter="url(#${id}-glow)">
      <path d="M148 58 C140 55 126 55 119 60 C117 65 119 72 124 75 C133 78 142 76 148 71 Z" ${fill("Chest")}/><path d="M153 58 C161 55 175 55 182 60 C184 65 182 72 177 75 C168 78 159 76 153 71 Z" ${fill("Chest")}/>
      <path d="M119 55 C114 54 111 57 110 62 C110 66 113 69 118 70 L124 63 C124 59 122 56 119 55 Z" ${fill("Front Delts")}/><path d="M182 55 C187 54 190 57 191 62 C191 66 188 69 183 70 L177 63 C177 59 179 56 182 55 Z" ${fill("Front Delts")}/>
      <path d="M113 56 C108 58 106 63 108 68 C111 71 115 69 118 66 L121 58 C119 56 116 55 113 56 Z" ${fill("Side Delts")}/><path d="M188 56 C193 58 195 63 193 68 C190 71 186 69 183 66 L180 58 C182 56 185 55 188 56 Z" ${fill("Side Delts")}/>
      <path d="M113 70 C109 75 109 85 112 91 C116 93 120 89 120 84 L122 73 C120 69 116 68 113 70 Z" ${fill("Biceps")}/><path d="M188 70 C192 75 192 85 189 91 C185 93 181 89 181 84 L179 73 C181 69 185 68 188 70 Z" ${fill("Biceps")}/>
      <path d="M139 77 C143 75 147 76 149 79 L149 88 C146 91 142 91 139 88 Z M152 79 C154 76 158 75 162 77 L162 88 C159 91 155 91 152 88 Z M139 91 C143 89 147 90 149 93 L149 102 C146 105 142 105 139 102 Z M152 93 C154 90 158 89 162 91 L162 102 C159 105 155 105 152 102 Z M140 105 C144 103 147 104 149 107 L149 116 C146 119 143 119 140 116 Z M152 107 C154 104 157 103 161 105 L161 116 C158 119 155 119 152 116 Z" ${fill("Core")}/>
      <path d="M132 77 C136 76 138 80 138 85 L137 111 C134 117 130 116 128 111 L124 91 Z M169 77 C165 76 163 80 163 85 L164 111 C167 117 171 116 173 111 L177 91 Z" ${fill("Core")}/>
      <path d="M127 124 C122 136 123 159 129 172 C134 176 141 169 142 160 L146 132 C142 124 133 120 127 124 Z" ${fill("Quads")}/><path d="M174 124 C179 136 178 159 172 172 C167 176 160 169 159 160 L155 132 C159 124 168 120 174 124 Z" ${fill("Quads")}/>
      <path d="M130 175 C125 186 127 210 132 222 C137 225 142 219 142 211 L144 182 C140 176 135 172 130 175 Z" ${fill("Calves")}/><path d="M171 175 C176 186 174 210 169 222 C164 225 159 219 159 211 L157 182 C161 176 166 172 171 175 Z" ${fill("Calves")}/>

      <path d="M309 42 C299 44 288 49 280 56 L286 67 C293 74 301 82 309 91 Z" ${fill("Back")}/><path d="M312 42 C322 44 333 49 341 56 L335 67 C328 74 320 82 312 91 Z" ${fill("Back")}/>
      <path d="M286 67 C281 78 282 97 290 111 C296 116 304 115 309 110 L309 90 C300 80 293 72 286 67 Z" ${fill("Back")}/><path d="M335 67 C340 78 339 97 331 111 C325 116 317 115 312 110 L312 90 C321 80 328 72 335 67 Z" ${fill("Back")}/>
      <path d="M277 55 C272 57 269 62 271 68 C274 72 280 71 285 67 L289 59 C286 55 282 54 277 55 Z" ${fill("Rear Delts")}/><path d="M344 55 C349 57 352 62 350 68 C347 72 341 71 336 67 L332 59 C335 55 339 54 344 55 Z" ${fill("Rear Delts")}/>
      <path d="M271 69 C267 76 268 88 272 94 C276 96 280 92 280 86 L282 73 C280 69 275 67 271 69 Z" ${fill("Triceps")}/><path d="M350 69 C354 76 353 88 349 94 C345 96 341 92 341 86 L339 73 C341 69 346 67 350 69 Z" ${fill("Triceps")}/>
      <path d="M291 111 C286 118 287 137 293 144 C300 147 306 141 309 134 L309 116 C303 111 297 109 291 111 Z" ${fill("Glutes")}/><path d="M330 111 C335 118 334 137 328 144 C321 147 315 141 312 134 L312 116 C318 111 324 109 330 111 Z" ${fill("Glutes")}/>
      <path d="M291 145 C286 153 287 168 293 174 C299 176 304 171 304 164 L307 149 C303 145 297 142 291 145 Z" ${fill("Hamstrings")}/><path d="M330 145 C335 153 334 168 328 174 C322 176 317 171 317 164 L314 149 C318 145 324 142 330 145 Z" ${fill("Hamstrings")}/>
      <path d="M292 176 C287 185 288 202 293 209 C298 211 303 206 303 199 L306 181 C302 176 297 173 292 176 Z" ${fill("Calves")}/><path d="M329 176 C334 185 333 202 328 209 C323 211 318 206 318 199 L315 181 C319 176 324 173 329 176 Z" ${fill("Calves")}/>

      <path d="M274 56 C269 58 267 63 269 68 C272 71 276 70 280 67 L283 58 C281 56 278 55 274 56 Z" ${fill("Side Delts")}/><path d="M347 56 C352 58 354 63 352 68 C349 71 345 70 341 67 L338 58 C340 56 343 55 347 56 Z" ${fill("Side Delts")}/>
    </g>
    <text x="151" y="262" text-anchor="middle">FRONT</text><text x="308" y="262" text-anchor="middle">BACK</text>
  </svg>`;
}
function muscleBodySVG(values={}){
  const registry=window.ANATOMY_MUSCLES||[];
  const vb=window.ANATOMY_VIEWBOX||{width:361.15625,height:541.86667};
  const max=Math.max(1,...Object.values(values).map(Number).filter(Number.isFinite));
  const opacityFor=name=>values[name]?Math.max(.54,Math.min(.94,Number(values[name])/max)):.035;
  const id=`anatomy-v82-${++muscleSvgCounter}`;
  const groupMap={
    "Chest":{front:["pectoralis"]},
    "Back":{back:["upper_back","lats","lower_back"]},
    "Front Delts":{front:["deltoids"],clip:"front-delt"},
    "Side Delts":{front:["deltoids"],clip:"side-delt"},
    "Rear Delts":{back:["deltoids_back"]},
    "Biceps":{front:["biceps"]},
    "Triceps":{back:["triceps"]},
    "Core":{front:["rectus_abdominis","obliques"]},
    "Quads":{front:["quadriceps"]},
    "Hamstrings":{back:["hamstrings"]},
    "Glutes":{back:["glutes"]},
    "Calves":{front:["calves"],back:["calves_back"]}
  };
  const transformFor=m=>m.offset&&(+m.offset.x||+m.offset.y)
    ?`translate(${(+m.offset.x||0)*.2645833333} ${(+m.offset.y||0)*.2645833333})`:"";
  const pathsFor=view=>Object.keys(values).flatMap(name=>{
    const config=groupMap[name];
    if(!config||!values[name]) return [];
    const wanted=config[view]||[];
    return registry.filter(m=>m.view===view&&wanted.includes(m.id)).map(m=>{
      const clip=config.clip?` clip-path="url(#${id}-${config.clip})"`:"";
      return `<path class="anatomy-highlight" data-muscle="${name}" d="${m.d}" transform="${transformFor(m)}" opacity="${opacityFor(name)}"${clip}/>`;
    });
  }).join("");
  const panel=(view,x)=>`<svg class="anatomy-person anatomy-person-${view}" x="${x}" y="0" width="360" height="542" viewBox="0 0 ${vb.width} ${vb.height}" aria-hidden="true">
    <defs>
      <clipPath id="${id}-front-delt"><rect x="52" y="0" width="18" height="542"/><rect x="142" y="0" width="18" height="542"/></clipPath>
      <clipPath id="${id}-side-delt"><rect x="25" y="0" width="31" height="542"/><rect x="156" y="0" width="31" height="542"/></clipPath>
    </defs>
    <image href="anatomy-${view}.webp" x="0" y="0" width="${vb.width}" height="${vb.height}" preserveAspectRatio="xMidYMid meet"/>
    <g class="anatomy-highlights">${pathsFor(view)}</g>
  </svg>`;
  return `<svg class="muscle-body muscle-body-v82" viewBox="0 0 760 574" role="img" aria-label="Front and back anatomical muscle map">
    ${panel("front",10)}${panel("back",390)}
    <text x="190" y="571" text-anchor="middle">FRONT</text><text x="570" y="571" text-anchor="middle">BACK</text>
  </svg>`;
}
function exerciseMuscleMap(ex){
  const out={}; if(ex?.primary) out[ex.primary]=1;
  (ex?.secondary||[]).forEach(m=>out[m]=Math.max(out[m]||0,.5));
  return out;
}
function activeWorkoutSummary(){
  if(!state.current) return null;
  const exercises=state.current.exercises||[];
  const idx=Math.min(state.current.exerciseIndex||0,Math.max(0,exercises.length-1));
  const ex=exercises[idx];
  const completed=(state.current.logs||[]).reduce((a,l)=>a+(l.sets||[]).filter(s=>s.setType!=="warmup").length,0);
  const elapsed=state.current.backdated?null:Math.max(0,Math.floor((Date.now()-(state.current.start||Date.now()))/60000));
  return {exercises,idx,ex,completed,elapsed};
}

function groupStatus(muscle){
  const row=weeklyGapRows().find(x=>x.name===muscle);
  if(!row) return "";
  return row.short>0?`${row.n.toFixed(row.n%1?1:0)} / ${row.min} · ${row.short.toFixed(row.short%1?1:0)} short`:`${row.n.toFixed(row.n%1?1:0)} / ${row.min} · target reached`;
}

function openExercisePicker(mode="add",targetIndex=null){
  const title=mode==="replace"?"Change Exercise":"Add Exercise";
  const subtitle=mode==="replace"?"Choose a muscle group, then select a replacement":"Choose a muscle group, then add an exercise to the end of this workout";
  document.getElementById("app").innerHTML=shell(title,subtitle,
    `<section class="card">
      <div class="section-kicker">Choose muscle group</div>
      <div class="muscle-card-grid">
        ${EXERCISE_GROUPS.map(m=>`<button class="muscle-pick-card" onclick='openExerciseGroup(${JSON.stringify(m)},${JSON.stringify(mode)},${targetIndex===null?"null":targetIndex})'>
          <strong>${m}</strong>
          <span>${groupStatus(m)}</span>
        </button>`).join("")}
      </div>
    </section>
    <section class="card">
      <div class="between"><div><h3 style="margin:0">Can't find it?</h3><div class="small">Create a new exercise and save it permanently.</div></div></div>
      <button class="primary" onclick='openCustomExerciseForm(${JSON.stringify(mode)},${targetIndex===null?"null":targetIndex},null)'>+ CREATE CUSTOM EXERCISE</button>
    </section>
    <button class="secondary" style="width:100%" onclick="go('live')">Back to workout</button>`,
  "home");
}

function openExerciseGroup(muscle,mode="add",targetIndex=null){
  const items=fullExerciseLibrary().filter(x=>x.primary===muscle);
  document.getElementById("app").innerHTML=shell(muscle,mode==="replace"?"Select replacement exercise":"Select exercise to add",
    `<section class="card muscle-picker-visual">
      <div class="between"><div><div class="section-kicker">Target muscle</div><h3 style="margin:0">${muscle}</h3></div><span class="badge">${groupStatus(muscle)}</span></div>
      ${muscleBodySVG({[muscle]:1})}
    </section>
    <section class="card">
      ${items.length?items.map(x=>`<div class="exercise-library-row">
        <button class="exercise-pick-card" onclick='chooseExerciseFromPicker(${JSON.stringify(x.name)},${JSON.stringify(mode)},${targetIndex===null?"null":targetIndex})'>
          <div><strong>${x.name}</strong><div class="small">${x.sets??3} sets · ${x.repMin||8}–${x.repMax||12} reps · ${exerciseRest(x)}s · ${x.equipment||"Other"}</div></div><span>›</span>
        </button>
        <button class="mini-edit" onclick='openEditExerciseDefaults(${JSON.stringify(x.name)},${JSON.stringify(mode)},${targetIndex===null?"null":targetIndex})'>Edit</button>
      </div>`).join(""):`<div class="empty">No saved exercises in this muscle group yet.</div>`}
    </section>
    <section class="card">
      <button class="primary" onclick='openCustomExerciseForm(${JSON.stringify(mode)},${targetIndex===null?"null":targetIndex},${JSON.stringify(muscle)})'>+ CREATE CUSTOM ${muscle.toUpperCase()} EXERCISE</button>
    </section>
    <button class="secondary" style="width:100%" onclick='openExercisePicker(${JSON.stringify(mode)},${targetIndex===null?"null":targetIndex})'>Back to muscle groups</button>`,
  "home");
}

function chooseExerciseFromPicker(name,mode="add",targetIndex=null){
  if(mode==="replace"){
    replaceExerciseAtIndex(targetIndex,name);
  }else{
    addExerciseByName(name);
  }
}

function addExerciseByName(name){
  const item=fullExerciseLibrary().find(x=>x.name===name);
  if(!item||!state.current) return;
  const ex={
    id:"custom-"+Date.now()+"-"+Math.random().toString(36).slice(2,6),
    name:item.name,plannedName:item.name,sets:item.sets??3,
    repMin:item.repMin||8,repMax:item.repMax||12,rest:exerciseRest(item),
    primary:item.primary,secondary:item.secondary||[],equipment:item.equipment||"Other",
    type:item.type||"Exercise",skipped:false
  };
  state.current.exercises.push(ex);
  state.current.logs.push({
    exerciseId:ex.id,name:ex.name,plannedName:ex.name,primary:ex.primary,secondary:ex.secondary,
    rest:ex.rest,sets:[],skipped:false,wasSwapped:false,notes:exerciseNotes(ex.name)
  });
  save();
  toast(`${ex.name} added to end of workout`);
  go("live");
}

function replaceExerciseAtIndex(targetIndex,name){
  if(!state.current) return;
  const idx=Number(targetIndex);
  const item=fullExerciseLibrary().find(x=>x.name===name);
  const old=state.current.exercises?.[idx];
  const log=state.current.logs?.[idx];
  if(!item||!old||!log) return;
  if((log.sets||[]).length){
    alert("This exercise already has logged sets. Add a new exercise instead so those sets stay attached to the correct exercise.");
    go("live");
    return;
  }
  state.current.exercises[idx]={
    ...old,name:item.name,primary:item.primary,secondary:item.secondary||[],
    sets:item.sets??old.sets??3,rest:exerciseRest(item),repMin:item.repMin||8,repMax:item.repMax||12,
    equipment:item.equipment||"Other",type:item.type||"Exercise"
  };
  state.current.logs[idx]={
    ...log,name:item.name,primary:item.primary,secondary:item.secondary||[],
    rest:exerciseRest(item),wasSwapped:item.name!==log.plannedName,notes:exerciseNotes(item.name)
  };
  save();
  toast(`${old.name} changed to ${item.name}`);
  go("live");
}

function openCustomExerciseForm(mode="add",targetIndex=null,preselectedMuscle=null){
  const builderMode=mode==="custom-builder";
  const programmeBuilderMode=mode==="programme-builder";
  const cancelAction=programmeBuilderMode
    ? (preselectedMuscle?`openProgrammeExerciseGroup(${JSON.stringify(preselectedMuscle)})`:`openProgrammeExercisePicker()`)
    : builderMode
    ? (preselectedMuscle?`openCustomWorkoutGroup(${JSON.stringify(preselectedMuscle)})`:`renderCustomWorkoutBuilder()`)
    : `openExercisePicker(${JSON.stringify(mode)},${targetIndex===null?"null":targetIndex})`;
  document.getElementById("app").innerHTML=shell("Create Custom Exercise","Save it to your exercise library",
    `<section class="card">
      <div class="field"><label>Exercise name</label><input id="customName" type="text" placeholder="e.g. Hammer Strength High Row"></div>
      <div class="input-grid">
        <div class="field"><label>Primary muscle</label>
          <select id="customPrimary" style="width:100%;background:transparent;color:white;border:none;font-size:17px;font-weight:800;outline:none">
            ${EXERCISE_GROUPS.map(m=>`<option value="${m}" ${preselectedMuscle===m?"selected":""}>${m}</option>`).join("")}
          </select>
        </div>
        <div class="field"><label>Equipment</label><input id="customEquipment" type="text" placeholder="Machine / Cable"></div>
      </div>
      <div class="field" style="margin-top:10px"><label>Secondary muscles (optional, comma separated)</label><input id="customSecondary" type="text" placeholder="e.g. Biceps, Rear Delts"></div>
      <div class="input-grid">
        <div class="field"><label>Working sets</label><input id="customSets" type="number" min="1" step="1" value="3"></div>
        <div class="field"><label>Rest seconds</label><input id="customRest" type="number" min="15" step="15" value="90"></div>
        <div class="field"><label>Min reps</label><input id="customRepMin" type="number" min="1" step="1" value="8"></div>
        <div class="field"><label>Max reps</label><input id="customRepMax" type="number" min="1" step="1" value="12"></div>
      </div>
      <button class="primary" onclick='saveCustomExerciseFromForm(${JSON.stringify(mode)},${targetIndex===null?"null":targetIndex},${JSON.stringify(preselectedMuscle)})'>SAVE & ${mode==="replace"?"USE AS REPLACEMENT":programmeBuilderMode?"ADD TO PROGRAMME WORKOUT":builderMode?"ADD TO CUSTOM WORKOUT":"ADD TO WORKOUT"}</button>
    </section>
    <button class="secondary" style="width:100%" onclick='${cancelAction}'>Cancel</button>`,
  "home");
}

function saveCustomExerciseFromForm(mode="add",targetIndex=null,returnMuscle=null){
  const name=(qs("#customName")?.value||"").trim();
  const primary=qs("#customPrimary")?.value||"Chest";
  const equipment=(qs("#customEquipment")?.value||"Other").trim()||"Other";
  const secondary=(qs("#customSecondary")?.value||"").split(",").map(x=>x.trim()).filter(Boolean);
  const sets=parseInt(qs("#customSets")?.value)||3;
  const rest=parseInt(qs("#customRest")?.value)||90;
  const repMin=parseInt(qs("#customRepMin")?.value)||8;
  const repMax=parseInt(qs("#customRepMax")?.value)||12;
  if(!name){toast("Enter an exercise name");return}
  let item=fullExerciseLibrary().find(x=>x.name.toLowerCase()===name.toLowerCase());
  if(!item){
    item={name,primary,secondary,type:"Custom",equipment,rest,repMin,repMax,sets};
    state.customExercises.push(item);
    save();
  }
  if(mode==="programme-builder") addProgrammeDraftExercise(item.name);
  else if(mode==="custom-builder") addToBlankCustom(item.name);
  else chooseExerciseFromPicker(item.name,mode,targetIndex);
}

function openEditExerciseDefaults(name,returnMode="add",targetIndex=null){
  const item=exerciseDefinition(name); if(!item)return;
  document.getElementById("app").innerHTML=shell("Edit Exercise Defaults",name,
    `<section class="card">
      <div class="notice" style="margin-bottom:12px">Changes apply to future uses of this exercise. Previous workout history is never rewritten.</div>
      <div class="input-grid">
        <div class="field"><label>Working sets</label><input id="editDefSets" type="number" min="1" step="1" value="${item.sets??3}"></div>
        <div class="field"><label>Rest seconds</label><input id="editDefRest" type="number" min="15" step="15" value="${exerciseRest(item)}"></div>
        <div class="field"><label>Min reps</label><input id="editDefMin" type="number" min="1" step="1" value="${item.repMin||8}"></div>
        <div class="field"><label>Max reps</label><input id="editDefMax" type="number" min="1" step="1" value="${item.repMax||12}"></div>
      </div>
      <div class="input-grid">
        <div class="field"><label>Primary muscle</label>
          <select id="editDefPrimary" style="width:100%;background:transparent;color:white;border:none;font-size:16px;font-weight:800">
            ${EXERCISE_GROUPS.map(m=>`<option value="${m}" ${item.primary===m?"selected":""}>${m}</option>`).join("")}
          </select>
        </div>
        <div class="field"><label>Equipment</label><input id="editDefEquipment" type="text" value="${item.equipment||"Other"}"></div>
      </div>
      <div class="field" style="margin-top:10px"><label>Secondary muscles</label><input id="editDefSecondary" type="text" value="${(item.secondary||[]).join(", ")}"></div>
      <button class="primary" onclick='saveExerciseDefaults(${JSON.stringify(name)},${JSON.stringify(returnMode)},${targetIndex===null?"null":targetIndex})'>SAVE DEFAULTS</button>
    </section>
    <button class="secondary" style="width:100%" onclick='openExercisePicker(${JSON.stringify(returnMode)},${targetIndex===null?"null":targetIndex})'>Cancel</button>`,
  "home");
}
function saveExerciseDefaults(name,returnMode="add",targetIndex=null){
  const sets=parseInt(qs("#editDefSets")?.value)||3,rest=parseInt(qs("#editDefRest")?.value)||90;
  const repMin=parseInt(qs("#editDefMin")?.value)||8,repMax=parseInt(qs("#editDefMax")?.value)||12;
  const primary=qs("#editDefPrimary")?.value||"Chest",equipment=(qs("#editDefEquipment")?.value||"Other").trim()||"Other";
  const secondary=(qs("#editDefSecondary")?.value||"").split(",").map(x=>x.trim()).filter(Boolean);
  saveExercisePref(name,{sets,rest,repMin,repMax,primary,secondary,equipment});
  toast(`${name} defaults updated`);
  openExerciseGroup(primary,returnMode,targetIndex);
}
function openEditCurrentExercise(){
  if(!state.current)return;
  const idx=state.current.exerciseIndex,ex=state.current.exercises[idx];
  document.getElementById("app").innerHTML=shell("Edit For Today",ex.name,
    `<section class="card">
      <div class="notice" style="margin-bottom:12px">This changes only the current workout. Exercise-library defaults stay unchanged.</div>
      <div class="input-grid">
        <div class="field"><label>Working sets</label><input id="todaySets" type="number" min="1" step="1" value="${ex.sets??3}"></div>
        <div class="field"><label>Rest seconds</label><input id="todayRest" type="number" min="15" step="15" value="${ex.rest||90}"></div>
        <div class="field"><label>Min reps</label><input id="todayMin" type="number" min="1" step="1" value="${ex.repMin||8}"></div>
        <div class="field"><label>Max reps</label><input id="todayMax" type="number" min="1" step="1" value="${ex.repMax||12}"></div>
      </div>
      <button class="primary" onclick="saveCurrentExercisePlan()">SAVE FOR TODAY</button>
    </section>
    <button class="secondary" style="width:100%" onclick="openExerciseMenu()">Cancel</button>`,
  "home");
}
function saveCurrentExercisePlan(){
  const idx=state.current.exerciseIndex,ex=state.current.exercises[idx],log=state.current.logs[idx];
  ex.sets=parseInt(qs("#todaySets")?.value)||ex.sets||3;
  ex.rest=parseInt(qs("#todayRest")?.value)||ex.rest||90;
  ex.repMin=parseInt(qs("#todayMin")?.value)||ex.repMin||8;
  ex.repMax=parseInt(qs("#todayMax")?.value)||ex.repMax||12;
  log.rest=ex.rest;
  save();toast("Today's exercise plan updated");go("live");
}
function home(){
  const recId=recommendedWorkoutId(),recommended=workoutById(recId)||state.program[0],selected=workoutById(state.selectedProgram)||recommended;
  const completedThisWeek=state.history.slice(-30).filter(h=>(h.end||0)>=startOfTrainingWeek()),recent=lastCompletedWorkout();
  const weekSets=completedThisWeek.reduce((a,h)=>a+(h.logs||[]).reduce((x,l)=>x+(l.sets||[]).filter(s=>s.setType!=="warmup").length,0),0);
  const isOverride=selected.id!==recommended.id,c=todayCheckin(),t=state.macroTargets,gaps=weeklyGapRows(),biggest=gaps.filter(x=>x.short>0).slice(0,3),kcalTarget=Math.round(t.protein*4+t.carbs*4+t.fat*9),weeklyTotals=weeklyMuscleTotals();
  const active=activeWorkoutSummary();
  return shell("Ready to train?",`${greeting()}, Michael · ${todayLabel()}`,
  `${active?`<section class="card active-workout-card">
      <div class="between"><span class="tag" style="margin-bottom:0">WORKOUT IN PROGRESS</span><span class="badge">${active.elapsed===null?"Backdated":`${active.elapsed} min`}</span></div>
      <div class="big" style="font-size:28px;margin-top:14px">${state.current.name}</div>
      <div class="meta">${active.ex?`Exercise ${active.idx+1} of ${active.exercises.length} · ${active.ex.name}`:""} · ${active.completed} working sets logged</div>
      <button class="primary" onclick="go('live')">CONTINUE WORKOUT</button>
      <button class="secondary danger" style="width:100%;margin-top:8px" onclick="cancelWorkout()">Discard workout</button>
    </section>`:""}
    <button class="home-start" onclick="${active?"go('live')":`startWorkout('${selected.id}')`}"><span>${active?"CONTINUE WORKOUT":"START WORKOUT"}</span><b>›</b></button>
    <div class="dashboard-pair">
      <button class="dashboard-mini next-workout-mini" onclick="document.getElementById('workout-picker').scrollIntoView({behavior:'smooth'})">
        <span class="dashboard-label">NEXT WORKOUT</span>
        <span class="dashboard-value">${htmlSafe(workoutFocusLabel(selected))}</span>
        <small>${htmlSafe(selected.name)} · ${totalSets(selected)} sets</small>
        <b aria-hidden="true">›</b>
      </button>
      ${compactGritHTML()}
    </div>
    ${weeklyDashboardCard(weekSets,weeklyTotals)}
    ${blockStatusCardHTML()}
    <section class="card">${monthCalendarHTML()}</section>
    <section class="card">
      <div class="between"><h3>Today's check-in</h3><span class="badge" id="dailyCaloriesBadge">${macroCalories(c)} / ${kcalTarget} kcal</span></div>
      <div class="input-grid">
        <div class="field"><label>Bodyweight kg</label><input id="dailyWeight" type="number" step="0.1" value="${c.weight??""}" placeholder="e.g. 89.8"></div>
        <div class="field"><label>Protein g</label><input id="dailyProtein" type="number" step="1" value="${c.protein??""}" placeholder="${t.protein}" oninput="updateAutoCalories('daily')"></div>
        <div class="field"><label>Carbs g</label><input id="dailyCarbs" type="number" step="1" value="${c.carbs??""}" placeholder="${t.carbs}" oninput="updateAutoCalories('daily')"></div>
        <div class="field"><label>Fat g</label><input id="dailyFat" type="number" step="1" value="${c.fat??""}" placeholder="${t.fat}" oninput="updateAutoCalories('daily')"></div>
        <div class="field readonly-field"><label>Calories · auto 4/4/9</label><div id="dailyCaloriesValue" class="readonly-value">${macroCalories(c).toLocaleString()} kcal</div></div>
      </div>
      <div style="margin-top:12px">${macroBar("Protein",c.protein,t.protein)}${macroBar("Carbs",c.carbs,t.carbs)}${macroBar("Fat",c.fat,t.fat)}</div>
      <button class="primary" onclick="saveCheckin()">SAVE TODAY</button>
    </section>
    <section class="card">
      ${waistThisWeek()?`
        <div class="between"><div><div class="section-kicker">Weekly waist</div><h3 style="margin:0">${waistThisWeek().waist} cm</h3></div><span class="good">Measured ✓</span></div>
        <div class="small" style="margin-top:8px">Measured around the belly button · ${new Date(waistThisWeek().date+"T12:00:00").toLocaleDateString()}</div>
      `:`
        <div class="between"><div><div class="section-kicker">Weekly waist</div><h3 style="margin:0">Measurement due</h3></div><span class="warn">This week</span></div>
        <div class="small" style="margin:8px 0 12px">Measure around the belly button, relaxed, under similar conditions each week.</div>
        <div class="field"><label>Waist circumference (cm)</label><input id="weeklyWaist" type="number" step="0.1" placeholder="${latestWaist()?.waist??"e.g. 99.0"}"></div>
        <button class="primary" onclick="saveWeeklyWaist()">SAVE WAIST</button>
      `}
    </section>
    <section class="card weekly-balance-card">
      <div class="between"><h3>Weekly training balance</h3><span class="badge">${weekSets} working sets</span></div>
      ${gaps.map(g=>`<div class="muscle-row"><strong>${g.name}</strong><div class="progress"><span style="width:${g.pct}%"></span></div><span class="${g.short>0?"warn":"good"} small">${g.short>0?`${g.short.toFixed(g.short%1?1:0)} short`:"Target ✓"}</span></div>`).join("")}
      ${biggest.length?`<div class="notice" style="margin-top:12px"><strong>Biggest gaps:</strong> ${biggest.map(x=>`${x.name} ${x.short.toFixed(x.short%1?1:0)} sets`).join(" · ")}</div><button class="primary" onclick="buildTopUp()">BUILD TOP-UP WORKOUT</button>`:`<div class="notice" style="margin-top:12px">All minimum weekly set targets reached.</div>`}
      <button class="secondary" style="width:100%;margin-top:8px" onclick="startBlankCustom()">CREATE BLANK CUSTOM WORKOUT</button>
    </section>
    ${recent?`<section class="card"><div class="between"><div><div class="section-kicker">Last session</div><h3 style="margin:0">${recent.name}</h3></div><button class="secondary" onclick="state.lastCompleted='${recent.id}';save();go('summary')">View</button></div><div class="small" style="margin-top:6px">${new Date(recent.end).toLocaleDateString()} · ${(recent.logs||[]).reduce((a,l)=>a+(l.sets||[]).filter(s=>s.setType!=="warmup").length,0)} working sets</div></section>`:""}
    <section class="card" id="workout-picker">
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
function makeSessionExercise(item,sets=null){
  sets=sets??item.sets??3;
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
  window.__blankCustom=[];
  if(!state.backdatedCustomDate) state.backdatedCustomDate=null;
  renderCustomWorkoutBuilder();
}
function renderCustomWorkoutBuilder(){
  if(!Array.isArray(window.__blankCustom)) window.__blankCustom=[];
  const selected=window.__blankCustom;
  const totalSets=selected.reduce((sum,x)=>sum+(Number(x.sets)||0),0);
  document.getElementById("app").innerHTML=shell("Custom Workout","Choose a muscle group, then an exercise",
    `<section class="card custom-builder-summary">
      <div class="between"><div><div class="section-kicker">Your workout</div><h3 style="margin:2px 0 0">${selected.length} exercise${selected.length===1?"":"s"}</h3></div><span class="badge">${totalSets} working sets</span></div>
      <div class="custom-selected-list">
        ${selected.length?selected.map((x,i)=>`<div class="custom-selected-row"><div class="custom-selected-number">${i+1}</div><div><strong>${x.name}</strong><div class="small">${x.primary} · ${x.sets} sets · ${x.repMin}–${x.repMax} reps</div></div><button class="mini-edit custom-remove" aria-label="Remove ${x.name}" onclick="removeFromBlankCustom(${i})">Remove</button></div>`).join(""):`<div class="empty">No exercises selected yet. Start with a muscle group below.</div>`}
      </div>
      <button class="primary" onclick="launchBlankCustom()">BEGIN WORKOUT${selected.length?` · ${selected.length} EXERCISE${selected.length===1?"":"S"}`:""}</button>
    </section>
    <section class="card">
      <div class="section-kicker">Choose muscle group</div>
      <div class="muscle-card-grid">
        ${EXERCISE_GROUPS.map(m=>`<button class="muscle-pick-card" onclick='openCustomWorkoutGroup(${JSON.stringify(m)})'><strong>${m}</strong><span>${groupStatus(m)}</span></button>`).join("")}
      </div>
    </section>
    <section class="card"><div class="between"><div><h3 style="margin:0">Can't find it?</h3><div class="small">Create an exercise and add it to this workout.</div></div></div><button class="primary" onclick="openCustomExerciseForm('custom-builder',null,null)">+ CREATE CUSTOM EXERCISE</button></section>
    <button class="secondary" style="width:100%" onclick="go('home')">Cancel custom workout</button>`,"home");
}
function openCustomWorkoutGroup(muscle){
  if(!Array.isArray(window.__blankCustom)) window.__blankCustom=[];
  const selectedNames=new Set(window.__blankCustom.map(x=>x.name));
  const items=fullExerciseLibrary().filter(x=>x.primary===muscle);
  document.getElementById("app").innerHTML=shell(muscle,"Choose one exercise",
    `<section class="card muscle-picker-visual">
      <div class="between"><div><div class="section-kicker">Target muscle</div><h3 style="margin:0">${muscle}</h3></div><span class="badge">${window.__blankCustom.length} selected</span></div>
      ${muscleBodySVG({[muscle]:1})}
    </section>
    <section class="card">
      ${items.length?items.map(x=>{const added=selectedNames.has(x.name);return `<div class="exercise-library-row"><button class="exercise-pick-card ${added?"is-selected":""}" ${added?"disabled":""} onclick='addToBlankCustom(${JSON.stringify(x.name)})'><div><strong>${x.name}</strong><div class="small">${x.sets??3} sets · ${x.repMin||8}–${x.repMax||12} reps · ${exerciseRest(x)}s · ${x.equipment||"Other"}</div></div><span>${added?"Added":"Add"}</span></button></div>`}).join(""):`<div class="empty">No saved exercises in this muscle group yet.</div>`}
    </section>
    <section class="card"><button class="primary" onclick='openCustomExerciseForm("custom-builder",null,${JSON.stringify(muscle)})'>+ CREATE CUSTOM ${muscle.toUpperCase()} EXERCISE</button></section>
    <button class="secondary" style="width:100%" onclick="renderCustomWorkoutBuilder()">Back to muscle groups</button>`,"home");
}
function addToBlankCustom(name){
  const item=fullExerciseLibrary().find(x=>x.name===name);if(!item)return;
  if(!Array.isArray(window.__blankCustom)) window.__blankCustom=[];
  if(window.__blankCustom.some(x=>x.name===name)){
    toast(`${name} is already selected`);
    renderCustomWorkoutBuilder();
    return;
  }
  window.__blankCustom.push(makeSessionExercise(item));
  toast(`${name} added`);
  renderCustomWorkoutBuilder();
}
function removeFromBlankCustom(index){
  if(!Array.isArray(window.__blankCustom)) return;
  const removed=window.__blankCustom.splice(Number(index),1)[0];
  if(removed) toast(`${removed.name} removed`);
  renderCustomWorkoutBuilder();
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
  const sessionExercises = w.exercises.map(e=>{
    const pref=exercisePref(e.name);
    return {...e,...pref,name:e.name,plannedName:e.name,skipped:false,rest:pref.rest||e.rest};
  });
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
  setTimeout(startWorkoutTicker,0);

  return shell(state.current.name,`Exercise ${state.current.exerciseIndex+1} of ${sessionExercises.length}`,
    `<section class="workout-clock-strip"><span>SESSION</span><strong id="workoutElapsed">${state.current.backdated?"Backdated":workoutElapsedText()}</strong></section>
    <section class="card">
      <div class="between">
        <div>
          <div class="counter">SET ${setNo} OF ${ex.sets}</div>
          <div class="exercise-title">${ex.name}</div>
        </div>
        <button class="secondary" onclick="openExerciseMenu()">⋯</button>
      </div>
      ${log.wasSwapped?`<div class="badge" style="margin-top:10px">Swapped from ${log.plannedName}</div>`:""}
      <div class="meta">Target ${ex.repMin}–${ex.repMax} reps · ${Math.floor(ex.rest/60)}:${String(ex.rest%60).padStart(2,"0")} rest · ${ex.primary}</div>
      <div class="exercise-muscle-visual">${muscleBodySVG(exerciseMuscleMap(ex))}</div>
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
      ${sessionExercises.map((e,i)=>`<div class="workout-row between queue-row">
        <div><strong>${i+1}. ${e.name}</strong><div class="small">${e.skipped?"Skipped":`${e.sets} sets · ${e.primary}`}</div></div>
        <div class="queue-actions">
          <button class="queue-move" aria-label="Move ${e.name} up" ${i===0?"disabled":""} onclick="moveExerciseAt(${i},-1)">↑</button>
          <button class="queue-move" aria-label="Move ${e.name} down" ${i===sessionExercises.length-1?"disabled":""} onclick="moveExerciseAt(${i},1)">↓</button>
          ${i!==state.current.exerciseIndex && !(state.current.logs[i]?.sets||[]).length && !e.skipped?`<button class="secondary" onclick="openExercisePicker('replace',${i})">Change</button>`:""}
          <span class="${i===state.current.exerciseIndex?"good":"small"}">${queueStatusAt(i)}</span>
        </div>
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
  const idx=state.current.exerciseIndex;
  const ex=state.current.exercises[idx];
  const log=state.current.logs[idx];
  document.getElementById("app").innerHTML=shell("Exercise Options",ex.name,
    `<section class="card">
      <button class="secondary" style="width:100%;margin-bottom:8px;text-align:left" onclick="openExercisePicker('replace',${idx})">
        <strong>Change this exercise</strong><div class="small">${(log.sets||[]).length?"Logged sets must stay with the current exercise":"Choose by muscle group from your exercise library"}</div>
      </button>
      <button class="secondary" style="width:100%;margin-bottom:8px;text-align:left" onclick="openExercisePicker('add',null)">
        <strong>+ Add exercise to end of workout</strong><div class="small">Choose a muscle group, then an exercise</div>
      </button>
      <button class="secondary" style="width:100%;margin-bottom:8px;text-align:left" onclick="openEditCurrentExercise()">
        <strong>Edit sets / reps for today</strong><div class="small">Change this workout only</div>
      </button>
      <button class="secondary" style="width:100%;margin-bottom:8px;text-align:left" onclick='openEditExerciseDefaults(${JSON.stringify(ex.name)},"replace",${idx})'>
        <strong>Edit exercise defaults</strong><div class="small">Change future sets, reps, rest or muscle assignment</div>
      </button>
      <button class="secondary" style="width:100%;margin-bottom:8px" onclick="moveExercise(1)">Move current exercise down</button>
      <button class="secondary" style="width:100%;margin-bottom:8px" onclick="moveExercise(-1)">Move current exercise up</button>
      <button class="secondary" style="width:100%;margin-bottom:8px" onclick="setDefaultRest()">Set default rest</button>
      <button class="secondary danger" style="width:100%" onclick="skipExercise()">Skip current exercise</button>
    </section>
    <button class="primary" onclick="go('live')">Back to workout</button>`,
  "home");
}

function openAllExercises(){
  openExercisePicker("replace",state.current?.exerciseIndex??0);
}

function swapExercise(name){
  replaceExerciseAtIndex(state.current?.exerciseIndex??0,name);
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
  openExercisePicker("add",null);
}

function skipExercise(){
  const idx=state.current.exerciseIndex;
  state.current.exercises[idx].skipped=true;
  state.current.logs[idx].skipped=true;
  const next=nextPendingExerciseIndex(idx);
  if(next!==-1){
    state.current.exerciseIndex=next;
    state.current.restUntil=null;
    save();go("live");
  } else {
    finishWorkout();
  }
}

function moveExercise(direction){
  moveExerciseAt(state.current.exerciseIndex,direction);
}

function moveExerciseAt(idx,direction){
  const ni=idx+direction;
  if(ni<0 || ni>=state.current.exercises.length){toast("Cannot move further");return;}
  const movingCurrent=idx===state.current.exerciseIndex;
  const currentLog=state.current.logs[state.current.exerciseIndex];
  [state.current.exercises[idx],state.current.exercises[ni]]=[state.current.exercises[ni],state.current.exercises[idx]];
  [state.current.logs[idx],state.current.logs[ni]]=[state.current.logs[ni],state.current.logs[idx]];
  if(movingCurrent && direction>0){
    // Moving an unavailable current exercise down should immediately open the
    // exercise that has taken its place, while keeping any logged sets intact.
    state.current.exerciseIndex=idx;
    state.current.restUntil=null;
  }else{
    state.current.exerciseIndex=state.current.logs.indexOf(currentLog);
  }
  save();go("live");
}

function workingSetsAt(index){
  return (state.current?.logs?.[index]?.sets||[]).filter(s=>s.setType!=="warmup").length;
}
function exerciseCompleteAt(index){
  const ex=state.current?.exercises?.[index];
  const log=state.current?.logs?.[index];
  return !!(ex && (ex.skipped || log?.skipped || workingSetsAt(index)>=Number(ex.sets||0)));
}
function queueStatusAt(index){
  const ex=state.current?.exercises?.[index];
  if(!ex)return "";
  if(ex.skipped || state.current.logs?.[index]?.skipped)return "Skipped";
  if(index===state.current.exerciseIndex)return "Current";
  if(exerciseCompleteAt(index))return "Done";
  const n=workingSetsAt(index);
  return n?`${n}/${ex.sets} sets`:"";
}
function nextPendingExerciseIndex(fromIndex){
  const total=state.current?.exercises?.length||0;
  for(let step=1;step<total;step++){
    const i=(fromIndex+step)%total;
    if(!exerciseCompleteAt(i))return i;
  }
  return -1;
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
    const next=nextPendingExerciseIndex(state.current.exerciseIndex);
    if(next!==-1){
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
  const log=state.current.logs[idx];
  const remaining=Math.max(0,Math.ceil((state.current.restUntil-Date.now())/1000));
  const total = state.current.logs[Math.max(0,idx-(state.current.logs[idx].sets.length?0:1))]?.rest || ex.rest;
  const pct=Math.max(0,Math.min(100,remaining/Math.max(total,1)*100));
  const working=(log.sets||[]).filter(s=>s.setType!=="warmup");
  const setNo=working.length+1;
  const suggestion=nextSetSuggestion(ex,log)||sessionStartSuggestion(ex.name)?.suggestion;
  const lastSet=working[working.length-1];
  setTimeout(startWorkoutTicker,0);
  setTimeout(()=>{ if(state.current && state.current.restUntil && state.current.restUntil<=Date.now()){ state.current.restUntil=null;save();notify("Rest complete",`Next set: ${ex.name}`);render(); } else render(); },1000);
  return shell(state.current.name,"Rest timer",
    `<section class="workout-clock-strip"><span>SESSION</span><strong id="workoutElapsed">${state.current.backdated?"Backdated":workoutElapsedText()}</strong></section>
    <section class="card timer-wrap">
      <div class="counter">REST</div>
      <div class="timer-ring" style="--pct:${pct}%"><div class="timer-value">${fmtSec(remaining)}</div></div>
      <div class="section-kicker" style="margin-bottom:5px">UP NEXT · SET ${setNo} OF ${ex.sets}</div>
      <h3 style="font-size:23px;margin-bottom:6px">${ex.name}</h3>
      <div class="meta">${ex.repMin}–${ex.repMax} reps</div>
      ${suggestion?`<div class="next-load-card">
        <span>Suggested next load</span>
        <strong>${formatSuggestion(suggestion)}</strong>
        <small>${suggestion.reason||"Based on your previous performance"}</small>
        ${lastSet?`<small>Last set: ${formatSet(lastSet,ex.name)}</small>`:""}
      </div>`:""}
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
  c.blockId=state.activeBlockId||null;
  if(!c.backdated&&state.grit?.days?.length&&state.grit.nextDate){
    c.gritPlannedDate=state.grit.nextDate;
    c.gritScore=gritScoreFor(c.gritPlannedDate,isoDate(new Date(c.end)));
    state.grit.nextDate=nextScheduledGritDate(c.gritPlannedDate,false);
  }
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
    ${!h.backdated&&state.grit?.days?.length?`<section class="card grit-plan-card"><div class="between"><div><div class="section-kicker">Grit</div><h3 style="margin:0">${Number.isFinite(Number(h.gritScore))?`${h.gritScore}% for this workout`:"Plan your next workout"}</h3></div>${Number.isFinite(Number(h.gritScore))?`<span class="badge">${h.gritScore===100?"Inside window":"Outside window"}</span>`:""}</div>
      ${h.gritPlannedDate?`<div class="small" style="margin-top:8px">Planned ${localDateFromISO(h.gritPlannedDate).toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"short"})} · completed ${new Date(h.end).toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"short"})}</div>`:""}
      <div class="field programme-field" style="margin-top:13px"><label>When will your next workout take place?</label><input id="nextWorkoutDate" type="date" value="${state.grit.nextDate||nextScheduledGritDate(isoDate(),true)||""}"></div>
      <button class="primary" onclick="saveNextWorkoutDate()">SAVE NEXT WORKOUT</button></section>`:""}
    ${pbs.length?`<section class="card"><div class="between"><h3>Personal bests</h3><span class="badge">${pbs.length} new</span></div><div class="pb-grid">${pbs.map(pbCard).join("")}</div></section>`:""}`,
  "history");
}

function findPBs(h){
  const out=[];
  (h.logs||[]).forEach(l=>{
    const working=(l.sets||[]).filter(s=>s.setType!=="warmup");
    if(!working.length)return;
    const prev=state.history.filter(x=>x.id!==h.id && x.end<h.end).flatMap(x=>x.logs||[]).filter(x=>x.name===l.name);
    const prevSets=prev.flatMap(x=>(x.sets||[]).filter(s=>s.setType!=="warmup"));
    if(!prevSets.length) return;

    if(working.some(s=>s.assistWeight!=null)){
      const best=Math.min(...working.filter(s=>s.assistWeight!=null).map(s=>Number(s.assistWeight)));
      const old=prevSets.some(s=>s.assistWeight!=null)?Math.min(...prevSets.filter(s=>s.assistWeight!=null).map(s=>Number(s.assistWeight))):Infinity;
      if(best<old) out.push({name:l.name,primary:l.primary,type:"assistance",title:"ASSISTANCE PB",value:`${best} kg assistance`,previous:`Previous ${old} kg`,change:`↓ ${(old-best).toFixed(1)} kg assistance`});
      return;
    }

    if(working.some(s=>s.addedWeight!=null)){
      const best=Math.max(...working.filter(s=>s.addedWeight!=null).map(s=>Number(s.addedWeight)));
      const old=prevSets.some(s=>s.addedWeight!=null)?Math.max(...prevSets.filter(s=>s.addedWeight!=null).map(s=>Number(s.addedWeight))):-Infinity;
      if(best>old) out.push({name:l.name,primary:l.primary,type:"weight",title:"WEIGHT PB",value:`+${best} kg`,previous:`Previous +${old} kg`,change:`+${(best-old).toFixed(1)} kg`});
      return;
    }

    const weighted=working.filter(s=>Number(s.weight)>0 && Number(s.reps)>0);
    const prevWeighted=prevSets.filter(s=>Number(s.weight)>0 && Number(s.reps)>0);
    if(!weighted.length || !prevWeighted.length) return;

    const weightPB=Math.max(...weighted.map(s=>Number(s.weight)));
    const prevWeight=Math.max(...prevWeighted.map(s=>Number(s.weight)));
    if(weightPB>prevWeight){
      out.push({name:l.name,primary:l.primary,type:"weight",title:"WEIGHT PB",value:`${weightPB} kg`,previous:`Previous ${prevWeight} kg`,change:`+${(weightPB-prevWeight).toFixed(1)} kg`});
    }

    const bestE=Math.max(...weighted.map(s=>e1rm(Number(s.weight),Number(s.reps))));
    const prevE=Math.max(...prevWeighted.map(s=>e1rm(Number(s.weight),Number(s.reps))));
    if(bestE>prevE){
      const pct=prevE?((bestE-prevE)/prevE*100):0;
      out.push({name:l.name,primary:l.primary,type:"e1rm",title:"1RM PB",value:`${bestE} kg`,previous:`Previous ${prevE} kg`,change:`+${pct.toFixed(1)}%`});
    }
  });
  return out;
}
function pbCard(p){
  return `<div class="pb-card">
    <div class="pb-icon">${muscleIcon(p.primary)}</div>
    <div class="pb-main"><span>${p.title}</span><strong>${p.name}</strong><div class="pb-value">${p.value}</div><small>${p.previous}</small></div>
    <div class="pb-change">${p.change}</div>
  </div>`;
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
    `<section class="card">
      <div class="between"><div><div class="section-kicker">Session heat map</div><h3 style="margin:0">Muscles trained</h3></div><span class="badge">${Object.keys(muscle).length} groups</span></div>
      ${muscleBodySVG(muscle)}
    </section>
    <section class="card"><h3>Effective muscle sets</h3>
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

function activeTrainingBlock(){
  return state.trainingBlocks.find(b=>b.id===state.activeBlockId)||state.trainingBlocks.find(b=>b.status==="active")||state.trainingBlocks.at(-1);
}
function blockDateAt(block,days=0){
  const d=localDateFromISO(block?.startDate||isoDate());d.setDate(d.getDate()+days);return d;
}
function blockEndDate(block=activeTrainingBlock()){return blockDateAt(block,(Number(block?.weeks)||6)*7-1)}
function blockSessions(block=activeTrainingBlock()){
  if(!block)return [];
  const from=blockDateAt(block).setHours(0,0,0,0),to=blockEndDate(block).setHours(23,59,59,999);
  return (state.history||[]).filter(h=>{const t=h.end||h.start||0;return (h.blockId===block.id)||(t>=from&&t<=to)});
}
function blockWeek(block=activeTrainingBlock()){
  if(!block)return 1;
  return Math.max(1,Math.min(Number(block.weeks)||6,Math.floor((Date.now()-blockDateAt(block).getTime())/(7*86400000))+1));
}
function blockReviewDue(block=activeTrainingBlock()){return !!block&&Date.now()>blockEndDate(block).setHours(23,59,59,999)}
function blockStatusCardHTML(){
  const b=activeTrainingBlock();if(!b)return "";
  const sessions=blockSessions(b),due=blockReviewDue(b),week=blockWeek(b),weeks=Number(b.weeks)||6;
  const recovery=state.recoveryUntil&&dateDiffDays(state.recoveryUntil,isoDate())>=0;
  return `<section class="card block-card ${due?"review-due":""}"><div class="between"><div><div class="section-kicker">${due?"Review ready":"Training block"}</div><h3 style="margin:0">${htmlSafe(b.name||"Training Block")}</h3></div><span class="badge">${due?"Complete":`Week ${week} / ${weeks}`}</span></div>
    <div class="block-progress"><span style="width:${due?100:Math.min(100,week/weeks*100)}%"></span></div>
    <div class="small">${sessions.length} workout${sessions.length===1?"":"s"} logged · ${blockDateAt(b).toLocaleDateString(undefined,{day:"numeric",month:"short"})} – ${blockEndDate(b).toLocaleDateString(undefined,{day:"numeric",month:"short"})}</div>
    ${recovery?`<div class="notice" style="margin-top:10px">Recovery week recorded until ${localDateFromISO(state.recoveryUntil).toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"short"})}.</div>`:""}
    <button class="${due?"primary":"secondary"}" style="width:100%;margin-top:11px" onclick="openBlockReview()">${due?"REVIEW SIX-WEEK PROGRESS":"VIEW BLOCK PROGRESS"}</button></section>`;
}

function exerciseHistoryEntries(name){
  const out=[];
  [...(state.history||[])].sort((a,b)=>(a.end||a.start||0)-(b.end||b.start||0)).forEach(h=>(h.logs||[]).forEach(log=>{
    if(log.name!==name)return;
    const metric=bestPerformanceMetric(log);if(!metric)return;
    out.push({history:h,log,metric,time:h.end||h.start||0,primary:log.primary||exerciseDefinition(name)?.primary||""});
  }));
  return out;
}
function comparableEntries(entries,type){return entries.filter(x=>x.metric.type===type)}
function exerciseBaseline(name,type){
  const b=activeTrainingBlock(),entries=comparableEntries(exerciseHistoryEntries(name),type).filter(x=>{
    const start=blockDateAt(b).setHours(0,0,0,0);return x.history.blockId===b?.id||x.time>=start;
  });
  if(!entries.length)return null;
  const first=entries.slice(0,2),value=first.reduce((a,x)=>a+x.metric.value,0)/first.length;
  return {value,type,status:first.length>=2?"Confirmed":"Provisional",count:first.length};
}
function lifetimeBest(entries,type){
  const list=comparableEntries(entries,type);if(!list.length)return null;
  return type==="assist"?list.reduce((a,x)=>x.metric.value<a.metric.value?x:a):list.reduce((a,x)=>x.metric.value>a.metric.value?x:a);
}
function metricProgress(current,reference,type){
  if(!current||reference==null||!Number.isFinite(Number(reference)))return null;
  const raw=type==="assist"?Number(reference)-Number(current):Number(current)-Number(reference);
  const pct=Number(reference)?raw/Math.abs(Number(reference))*100:0;
  return {raw,pct};
}
function compactMetric(value,type){
  if(value==null||!Number.isFinite(Number(value)))return "—";
  const n=Number(value).toFixed(1).replace(/\.0$/,"");
  return type==="assist"?`${n}kg assist`:type==="added"?`${Number(value)>0?"+":""}${n}kg`:`${n}kg e1RM`;
}
function progressText(change){
  if(!change)return "—";if(Math.abs(change.pct)<.05)return "No change";
  return `${change.raw>0?"↑":"↓"} ${Math.abs(change.pct).toFixed(1)}%`;
}
function exerciseProgressSummary(name){
  const entries=exerciseHistoryEntries(name);if(!entries.length)return null;
  const current=entries.at(-1),same=comparableEntries(entries,current.metric.type),previous=same.at(-2)||null;
  const baseline=exerciseBaseline(name,current.metric.type),pb=lifetimeBest(entries,current.metric.type);
  return {name,entries,current,previous,baseline,pb,primary:current.primary,
    vsPrevious:previous?metricProgress(current.metric.value,previous.metric.value,current.metric.type):null,
    vsBaseline:baseline?metricProgress(current.metric.value,baseline.value,current.metric.type):null};
}
function allTrackedExercises(){
  const map=new Map();
  (state.history||[]).forEach(h=>(h.logs||[]).forEach(l=>{if(bestPerformanceMetric(l))map.set(l.name,l.primary||exerciseDefinition(l.name)?.primary||"Other")}));
  return [...map].map(([name,muscle])=>({name,muscle,summary:exerciseProgressSummary(name)})).sort((a,b)=>(b.summary?.current.time||0)-(a.summary?.current.time||0));
}
function exerciseHistoryListHTML(limit=4){
  const rows=allTrackedExercises().slice(0,limit);
  if(!rows.length)return `<div class="trend-empty compact"><strong>No exercise history yet</strong><span>Complete a workout to start your exercise trends.</span></div>`;
  return `<div class="recent-exercise-heading">RECENT EXERCISES</div><div class="exercise-history-list">${rows.map(x=>`<button class="exercise-history-row" onclick='openExerciseHistory(${JSON.stringify(x.name)})'><div><strong>${htmlSafe(x.name)}</strong><span>${htmlSafe(x.muscle)} · ${new Date(x.summary.current.time).toLocaleDateString(undefined,{day:"numeric",month:"short"})}</span></div><div><strong>${compactMetric(x.summary.current.metric.value,x.summary.current.metric.type)}</strong><span class="${x.summary.vsPrevious?.raw>=0?"good":"bad"}">${x.summary.vsPrevious?`${progressText(x.summary.vsPrevious)} vs last`:"First result"}</span></div></button>`).join("")}</div>`;
}
function trackedExercisesForMuscle(muscle){
  return allTrackedExercises().filter(x=>!muscle||x.muscle===muscle);
}
function exerciseHistoryOptions(muscle){
  const rows=trackedExercisesForMuscle(muscle);
  return `<option value="">${rows.length?"Choose an exercise":"No logged exercises yet"}</option>${rows.map(x=>`<option value="${htmlSafe(x.name)}">${htmlSafe(x.name)}</option>`).join("")}`;
}
function selectExerciseHistoryMuscle(){
  const muscle=qs("#exerciseHistoryMuscle")?.value||"";
  state.exerciseFilters={...(state.exerciseFilters||{}),muscle,exercise:""};save();
  const select=qs("#exerciseHistoryExercise"),button=qs("#viewExerciseHistory");
  if(select){select.innerHTML=exerciseHistoryOptions(muscle);select.disabled=!muscle||!trackedExercisesForMuscle(muscle).length;}
  if(button)button.disabled=true;
}
function selectExerciseHistoryExercise(){
  const exercise=qs("#exerciseHistoryExercise")?.value||"";
  state.exerciseFilters={...(state.exerciseFilters||{}),exercise};save();
  const button=qs("#viewExerciseHistory");if(button)button.disabled=!exercise;
}
function viewSelectedExerciseHistory(){
  const exercise=qs("#exerciseHistoryExercise")?.value||"";
  if(!exercise){toast("Choose an exercise first");return}
  openExerciseHistory(exercise);
}
function exerciseTrendSVG(entries,type){
  const list=comparableEntries(entries,type);if(!list.length)return "";
  const vals=list.map(x=>x.metric.value),min0=Math.min(...vals),max0=Math.max(...vals),pad=Math.max(1,(max0-min0)*.18),min=min0-pad,max=max0+pad,w=340,h=178,l=26,r=14,t=18,b=30;
  const x=i=>l+(i/Math.max(1,list.length-1))*(w-l-r),y=v=>t+(max-v)/Math.max(1,max-min)*(h-t-b),line=list.map((e,i)=>`${i?"L":"M"}${x(i).toFixed(1)},${y(e.metric.value).toFixed(1)}`).join(" ");
  return `<svg class="exercise-trend" viewBox="0 0 ${w} ${h}" role="img" aria-label="${htmlSafe(list[0].log.name)} progress chart">${[0,.5,1].map(n=>`<line x1="${l}" x2="${w-r}" y1="${t+n*(h-t-b)}" y2="${t+n*(h-t-b)}" class="trend-grid-line"/>`).join("")} ${list.length>1?`<path d="${line}" class="trend-line"/>`:""}${list.map((e,i)=>`<circle cx="${x(i)}" cy="${y(e.metric.value)}" r="4" class="trend-dot"><title>${compactMetric(e.metric.value,type)} · ${new Date(e.time).toLocaleDateString()}</title></circle>`).join("")}<text x="${l}" y="${h-8}" class="trend-axis-label">${new Date(list[0].time).toLocaleDateString(undefined,{day:"numeric",month:"short"})}</text><text x="${w-r}" y="${h-8}" text-anchor="end" class="trend-axis-label">${new Date(list.at(-1).time).toLocaleDateString(undefined,{day:"numeric",month:"short"})}</text></svg>`;
}
function openExerciseHistory(name){
  const s=exerciseProgressSummary(name);if(!s){toast("No history for this exercise");return}
  const type=s.current.metric.type,lower=type==="assist";
  document.getElementById("app").innerHTML=shell(name,lower?"Assistance progress · lower is stronger":"Strength progress",
    `<section class="card"><div class="between"><div><div class="section-kicker">Current best</div><h3 style="margin:0">${compactMetric(s.current.metric.value,type)}</h3></div><span class="badge">${s.entries.length} session${s.entries.length===1?"":"s"}</span></div>
      <div class="comparison-grid"><div class="metric"><strong class="${s.vsPrevious?.raw>=0?"good":"bad"}">${progressText(s.vsPrevious)}</strong><span>Vs previous</span></div><div class="metric"><strong class="${s.vsBaseline?.raw>=0?"good":"bad"}">${progressText(s.vsBaseline)}</strong><span>Vs block baseline</span></div><div class="metric"><strong>${s.baseline?compactMetric(s.baseline.value,type):"—"}</strong><span>${s.baseline?.status||"No"} baseline</span></div><div class="metric"><strong>${compactMetric(s.pb?.metric.value,type)}</strong><span>Lifetime best</span></div></div>
    </section>
    <section class="card trend-card"><div class="between"><h3>Performance over time</h3><span class="badge">${lower?"Lower is better":"Higher is better"}</span></div><div class="exercise-chart-wrap">${exerciseTrendSVG(s.entries,type)}</div></section>
    <section class="card"><div class="between"><h3>Session history</h3><span class="badge">Comparable results</span></div>${comparableEntries(s.entries,type).slice().reverse().map((e,i)=>`<div class="workout-row between"><div><strong>${new Date(e.time).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})}</strong><div class="small">${htmlSafe(e.history.name||"Workout")}${i===0?" · latest":""}</div></div><div style="text-align:right"><strong>${compactMetric(e.metric.value,type)}</strong><div class="small">${e.metric.reps?`${e.metric.reps} reps`:"Best set"}</div></div></div>`).join("")}</section>
    <button class="secondary" style="width:100%" onclick="go('stats')">Back to Progress</button>`,"stats");
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

function sparklineSVG(points){
  if(!points || !points.length) return "";
  const vals=points.map(p=>Number(p.v)).filter(Number.isFinite);
  if(!vals.length) return "";
  const min=Math.min(...vals), max=Math.max(...vals), range=Math.max(1,max-min);
  const w=300,h=70,pad=6;
  const coords=points.map((p,i)=>{
    const v=Number(p.v);
    const x=pad+(i/(Math.max(1,points.length-1)))*(w-pad*2);
    const y=h-pad-((v-min)/range)*(h-pad*2);
    return [x,y];
  });
  const line=coords.map((c,i)=>(i?"L":"M")+c[0].toFixed(1)+","+c[1].toFixed(1)).join(" ");
  const dots=coords.map(c=>`<circle cx="${c[0]}" cy="${c[1]}" r="2.8" fill="#caff3a"/>`).join("");
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-label="Strength trend chart">
    <defs><linearGradient id="gymTrend" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#caff3a" stop-opacity=".22"/><stop offset="1" stop-color="#caff3a" stop-opacity="0"/></linearGradient></defs>
    <path d="${line} L ${coords[coords.length-1][0]},${h} L ${coords[0][0]},${h} Z" fill="url(#gymTrend)"/>
    <path d="${line}" fill="none" stroke="#caff3a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
  </svg>`;
}

const TREND_METRICS={
  weight:{label:"Weight",unit:"kg",decimals:1},
  calories:{label:"Calories",unit:"kcal",decimals:0},
  protein:{label:"Protein",unit:"g",decimals:0},
  carbs:{label:"Carbs",unit:"g",decimals:0},
  fat:{label:"Fat",unit:"g",decimals:0},
  waist:{label:"Waist",unit:"cm",decimals:1}
};
function trendMetricConfig(key){
  const base=TREND_METRICS[key]||TREND_METRICS.weight,t=state.macroTargets;
  const target=key==="calories"?calorieTarget():(key==="protein"?t.protein:(key==="carbs"?t.carbs:(key==="fat"?t.fat:null)));
  return {...base,key,target};
}
function checkinMetricValue(c,key){
  if(key==="calories"){
    if(c.protein==null && c.carbs==null && c.fat==null)return null;
    return macroCalories(c);
  }
  if(c[key]==null || c[key]==="")return null;
  const value=Number(c[key]);
  return Number.isFinite(value)?value:null;
}
function progressRangeStart(range,now=new Date()){
  const d=new Date(now);d.setHours(0,0,0,0);
  if(range==="7D")d.setDate(d.getDate()-6);
  else if(range==="1M")d.setDate(d.getDate()-29);
  else if(range==="3M")d.setDate(d.getDate()-89);
  else d.setFullYear(d.getFullYear()-1);
  return d;
}
function progressTrendPoints(key,range){
  const now=new Date(),start=progressRangeStart(range,now),raw=(state.checkins||[]).map(c=>({
    date:c.date,value:checkinMetricValue(c,key),time:new Date(c.date+"T12:00:00").getTime()
  })).filter(p=>p.value!=null && p.time>=start.getTime() && p.time<=now.getTime()+86400000).sort((a,b)=>a.time-b.time);
  if(range==="7D" || range==="1M")return raw.map(p=>({...p,label:new Date(p.date+"T12:00:00").toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})}));
  const buckets=new Map();
  raw.forEach(p=>{
    const d=new Date(p.date+"T12:00:00");
    const keyName=range==="3M"?String(Math.floor((p.time-start.getTime())/(7*86400000))):`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    if(!buckets.has(keyName))buckets.set(keyName,[]);
    buckets.get(keyName).push(p);
  });
  return [...buckets.values()].map(items=>{
    const value=items.reduce((a,p)=>a+p.value,0)/items.length;
    const date=items[items.length-1].date,time=items[items.length-1].time;
    const firstDate=new Date(items[0].date+"T12:00:00");
    const label=range==="3M"?`Week of ${firstDate.toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})}`:firstDate.toLocaleDateString(undefined,{month:"long",year:"numeric"});
    return {date,time,value,label};
  });
}
function formatTrendValue(value,config){
  if(value==null || !Number.isFinite(Number(value)))return "—";
  return `${Number(value).toFixed(config.decimals)}${config.unit==="kcal"?" ":""}${config.unit}`;
}
function setProgressMetric(metric){
  if(!TREND_METRICS[metric])return;
  state.progressMetric=metric;state.progressPoint=-1;save();render();
}
function setProgressRange(range){
  if(!["7D","1M","3M","1Y"].includes(range))return;
  state.progressRange=range;state.progressPoint=-1;save();render();
}
function selectTrendPoint(index){state.progressPoint=index;save();render();}
function trendChartHTML(points,config){
  if(!points.length)return `<div class="trend-empty"><strong>No ${config.label.toLowerCase()} entries yet</strong><span>Add entries from Home or the calendar.</span></div>`;
  const values=points.map(p=>p.value),scaleValues=config.target?[...values,config.target]:values;
  let min=Math.min(...scaleValues),max=Math.max(...scaleValues),range=max-min;
  if(range===0){range=Math.max(1,Math.abs(max)*.04);min-=range;max+=range;}else{min-=range*.14;max+=range*.14;}
  const w=340,h=205,left=10,right=18,top=18,bottom=32,plotW=w-left-right,plotH=h-top-bottom;
  const start=progressRangeStart(state.progressRange).getTime(),end=new Date().setHours(23,59,59,999),timeRange=Math.max(1,end-start);
  const coords=points.map(p=>({x:left+Math.max(0,Math.min(1,(p.time-start)/timeRange))*plotW,y:top+(max-p.value)/(max-min)*plotH}));
  const line=coords.map((c,i)=>`${i?"L":"M"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const selected=Math.max(0,Math.min(points.length-1,state.progressPoint>=0?state.progressPoint:points.length-1));
  const selectedPoint=points[selected],selectedCoord=coords[selected],targetY=config.target==null?null:top+(max-config.target)/(max-min)*plotH;
  const startLabel=new Date(start).toLocaleDateString(undefined,{day:"numeric",month:"short"});
  const endLabel=new Date().toLocaleDateString(undefined,{day:"numeric",month:"short"});
  return `<div class="trend-chart-wrap">
    <div class="trend-tooltip" style="left:${Math.max(19,Math.min(81,selectedCoord.x/w*100))}%">
      <strong>${formatTrendValue(selectedPoint.value,config)}</strong><span>${selectedPoint.label}</span>
    </div>
    <svg class="trend-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${config.label} trend">
      ${[0,.5,1].map(n=>`<line x1="${left}" x2="${w-right}" y1="${top+n*plotH}" y2="${top+n*plotH}" class="trend-grid-line"/>`).join("")}
      ${targetY==null?"":`<line x1="${left}" x2="${w-right}" y1="${targetY}" y2="${targetY}" class="trend-target-line"/><text x="${w-right}" y="${Math.max(10,targetY-5)}" text-anchor="end" class="trend-target-label">Target ${formatTrendValue(config.target,config)}</text>`}
      ${points.length>1?`<path d="${line}" class="trend-line"/>`:""}
      ${coords.map((c,i)=>`<circle cx="${c.x}" cy="${c.y}" r="${i===selected?5:3.5}" class="trend-dot ${i===selected?"selected":""}" onclick="selectTrendPoint(${i})"><title>${formatTrendValue(points[i].value,config)} · ${points[i].label}</title></circle>`).join("")}
      <text x="${left}" y="${h-8}" class="trend-axis-label">${startLabel}</text><text x="${w-right}" y="${h-8}" text-anchor="end" class="trend-axis-label">${endLabel}</text>
    </svg>
  </div>`;
}
function strengthImprovements(){
  const byExercise=new Map();
  [...(state.history||[])].sort((a,b)=>(a.end||a.start||0)-(b.end||b.start||0)).forEach(h=>(h.logs||[]).forEach(log=>{
    const metric=bestPerformanceMetric(log);if(!metric)return;
    if(!byExercise.has(log.name))byExercise.set(log.name,[]);
    byExercise.get(log.name).push({metric,time:h.end||h.start||0,primary:log.primary});
  }));
  const out=[];
  byExercise.forEach((entries,name)=>{
    if(entries.length<2)return;
    const latest=entries[entries.length-1];
    let previous=null;
    for(let i=entries.length-2;i>=0;i--){if(entries[i].metric.type===latest.metric.type){previous=entries[i];break;}}
    if(!previous)return;
    const a=latest.metric,b=previous.metric,date=new Date(latest.time).toLocaleDateString(undefined,{day:"numeric",month:"short"});
    if(a.type==="assist"){
      const drop=b.value-a.value;
      if(drop>0)out.push({name,primary:latest.primary,time:latest.time,kicker:"ASSISTANCE DOWN",change:`↓ ${drop.toFixed(1)}kg`,detail:`${b.value} → ${a.value} kg assistance · ${date}`,score:drop});
      else if(drop===0 && Number(a.reps)>Number(b.reps)){
        const reps=Number(a.reps)-Number(b.reps);out.push({name,primary:latest.primary,time:latest.time,kicker:"REPS UP",change:`↑ ${reps}`,detail:`${b.reps} → ${a.reps} reps at ${a.value}kg assistance · ${date}`,score:reps});
      }
    }else if(a.type==="added"){
      const gain=a.value-b.value;
      if(gain>0)out.push({name,primary:latest.primary,time:latest.time,kicker:"ADDED WEIGHT UP",change:`↑ ${gain.toFixed(1)}kg`,detail:`+${b.value} → +${a.value} kg · ${date}`,score:gain});
      else if(gain===0 && Number(a.reps)>Number(b.reps)){
        const reps=Number(a.reps)-Number(b.reps);out.push({name,primary:latest.primary,time:latest.time,kicker:"REPS UP",change:`↑ ${reps}`,detail:`${b.reps} → ${a.reps} reps at +${a.value}kg · ${date}`,score:reps});
      }
    }else{
      const pct=b.value?((a.value-b.value)/b.value*100):0;
      if(pct>0.05)out.push({name,primary:latest.primary,time:latest.time,kicker:"ESTIMATED 1RM UP",change:`↑ ${pct.toFixed(1)}%`,detail:`${b.value.toFixed(1)} → ${a.value.toFixed(1)} kg e1RM · ${date}`,score:pct});
    }
  });
  return out.sort((a,b)=>b.time-a.time||b.score-a.score).slice(0,8);
}
function strengthImprovementHTML(items){
  if(!items.length)return `<div class="trend-empty compact"><strong>No comparable improvements yet</strong><span>Complete the same exercise twice to start seeing strength cards.</span></div>`;
  return `<div class="improvement-grid">${items.map(x=>`<div class="improvement-card"><div class="improvement-icon">${x.change.startsWith("↓")?"↓":"↑"}</div><div class="improvement-main"><span>${x.kicker}</span><strong>${x.name}</strong><small>${x.detail}</small></div><div class="improvement-change">${x.change}</div></div>`).join("")}</div>`;
}
function stats(){
  const m=weeklyMuscleTotals(),config=trendMetricConfig(state.progressMetric),points=progressTrendPoints(config.key,state.progressRange),improvements=strengthImprovements();
  const vals=points.map(p=>p.value),latest=vals[vals.length-1],average=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null,highest=vals.length?Math.max(...vals):null,lowest=vals.length?Math.min(...vals):null;
  const latestWeight=[...(state.checkins||[])].filter(c=>Number(c.weight)>0).sort((a,b)=>a.date.localeCompare(b.date)).at(-1);
  const latestWaist=[...(state.checkins||[])].filter(c=>Number(c.waist)>0).sort((a,b)=>a.date.localeCompare(b.date)).at(-1);
  const tracked=allTrackedExercises(),historyMuscles=EXERCISE_GROUPS.filter(muscle=>tracked.some(x=>x.muscle===muscle));
  const selectedHistoryMuscle=historyMuscles.includes(state.exerciseFilters?.muscle)?state.exerciseFilters.muscle:"";
  return shell("Progress","Strength, bodyweight & nutrition trends",
    `${blockStatusCardHTML()}
    <section class="card">
      <div class="between"><div><div class="section-kicker">Current measurements</div><h3 style="margin:0">Body composition</h3></div><span class="badge">Latest</span></div>
      <div class="metric-grid" style="margin-top:12px">
        <div class="metric"><strong>${latestWeight?Number(latestWeight.weight).toFixed(1):"—"}kg</strong><span>Latest bodyweight</span></div>
        <div class="metric"><strong>${latestWaist?Number(latestWaist.waist).toFixed(1):"—"}cm</strong><span>Waist · belly button</span></div>
      </div>
    </section>
    <section class="card">
      <div class="between"><div><div class="section-kicker">Recent strength</div><h3 style="margin:0">Improvements</h3></div><span class="badge">Latest vs previous</span></div>
      <div style="margin-top:12px">${strengthImprovementHTML(improvements)}</div>
    </section>
    <section class="card exercise-history-card">
      <div class="between"><div><div class="section-kicker">Exercise history</div><h3 style="margin:0">Track every lift</h3></div><span class="badge">Baseline · latest · PB</span></div>
      <div class="exercise-history-guide">
        <div class="history-step"><span>1</span><div><strong>Choose muscle group</strong><small>Start with the area you trained</small></div></div>
        <div class="field history-select-field"><label>Muscle group</label><select id="exerciseHistoryMuscle" onchange="selectExerciseHistoryMuscle()"><option value="">Choose a muscle group</option>${historyMuscles.map(muscle=>`<option value="${htmlSafe(muscle)}" ${selectedHistoryMuscle===muscle?"selected":""}>${htmlSafe(muscle)}</option>`).join("")}</select></div>
        <div class="history-step"><span>2</span><div><strong>Choose exercise</strong><small>Only exercises with saved results appear</small></div></div>
        <div class="field history-select-field"><label>Exercise</label><select id="exerciseHistoryExercise" onchange="selectExerciseHistoryExercise()" ${selectedHistoryMuscle?"":"disabled"}>${exerciseHistoryOptions(selectedHistoryMuscle)}</select></div>
        <button id="viewExerciseHistory" class="primary history-view-button" onclick="viewSelectedExerciseHistory()" disabled>VIEW EXERCISE HISTORY</button>
      </div>
      ${exerciseHistoryListHTML()}
    </section>
    <section class="card trend-card">
      <div class="between"><div><div class="section-kicker">Body & nutrition</div><h3 style="margin:0">${config.label} trend</h3></div>${config.target?`<button class="secondary" onclick="editMacroTargets()">Target ${formatTrendValue(config.target,config)}</button>`:`<span class="badge">${state.progressRange}</span>`}</div>
      <div class="trend-tabs metric-tabs">${Object.entries(TREND_METRICS).map(([key,item])=>`<button class="${config.key===key?"active":""}" onclick="setProgressMetric('${key}')">${item.label}</button>`).join("")}</div>
      <div class="trend-tabs range-tabs">${["7D","1M","3M","1Y"].map(range=>`<button class="${state.progressRange===range?"active":""}" onclick="setProgressRange('${range}')">${range}</button>`).join("")}</div>
      <div class="metric-grid trend-summary">
        <div class="metric"><strong>${formatTrendValue(latest,config)}</strong><span>Latest</span></div>
        <div class="metric"><strong>${formatTrendValue(average,config)}</strong><span>Average</span></div>
        <div class="metric"><strong>${formatTrendValue(highest,config)}</strong><span>Highest</span></div>
        <div class="metric"><strong>${formatTrendValue(lowest,config)}</strong><span>Lowest</span></div>
      </div>
      ${trendChartHTML(points,config)}
      ${config.key==="calories"?`<div class="small trend-note">Calories are calculated automatically: protein × 4 + carbs × 4 + fat × 9.</div>`:""}
    </section>
    <section class="card"><div class="between"><h3>Weekly muscle volume</h3><span class="badge">Effective sets</span></div>
      ${Object.entries(TARGETS).map(([name,tg])=>{const n=m[name]||0,p=Math.min(100,n/tg[0]*100);return `<div class="muscle-row"><strong>${name}</strong><div class="progress"><span style="width:${p}%"></span></div><span class="small">${n.toFixed(n%1?1:0)} / ${tg[0]} sets</span></div>`}).join("")}
    </section>`,
  "stats");
}

function blockMeasurementChange(key,block=activeTrainingBlock()){
  const start=blockDateAt(block).getTime(),items=(state.checkins||[]).filter(c=>Number(c[key])>0&&new Date(c.date+"T12:00:00").getTime()>=start).sort((a,b)=>a.date.localeCompare(b.date));
  if(items.length<2)return null;return Number(items.at(-1)[key])-Number(items[0][key]);
}
function blockProgressExercises(block=activeTrainingBlock()){
  return allTrackedExercises().map(x=>x.summary).filter(s=>s?.baseline&&s.current.time>=blockDateAt(block).getTime()).sort((a,b)=>(b.vsBaseline?.pct||-999)-(a.vsBaseline?.pct||-999));
}
function blockGritAverage(sessions){const scores=sessions.map(h=>Number(h.gritScore)).filter(Number.isFinite);return scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):null}
function openBlockReview(){
  const b=activeTrainingBlock();if(!b)return;
  const sessions=blockSessions(b),sets=sessions.reduce((a,h)=>a+(h.logs||[]).reduce((x,l)=>x+(l.sets||[]).filter(s=>s.setType!=="warmup").length,0),0),grit=blockGritAverage(sessions),weight=blockMeasurementChange("weight",b),waist=blockMeasurementChange("waist",b),progress=blockProgressExercises(b),due=blockReviewDue(b);
  const plannedPerWeek=state.grit?.days?.length||0,expected=plannedPerWeek?plannedPerWeek*(Number(b.weeks)||6):null;
  document.getElementById("app").innerHTML=shell(due?"Six-Week Review":"Block Progress",b.name||"Training Block",
    `<section class="card block-review-hero"><div class="between"><div><div class="section-kicker">${due?"Block complete":"In progress"}</div><h3 style="margin:0">${blockDateAt(b).toLocaleDateString(undefined,{day:"numeric",month:"short"})} – ${blockEndDate(b).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})}</h3></div><span class="badge">${Number(b.weeks)||6} weeks</span></div>
      <div class="metric-grid" style="margin-top:13px"><div class="metric"><strong>${sessions.length}${expected?` / ${expected}`:""}</strong><span>Workouts${expected?" planned":""}</span></div><div class="metric"><strong>${sets}</strong><span>Working sets</span></div><div class="metric"><strong>${grit==null?"—":`${grit}%`}</strong><span>Block Grit</span></div><div class="metric"><strong>${progress.filter(x=>x.vsBaseline?.raw>0).length}</strong><span>Exercises up</span></div></div>
    </section>
    <section class="card"><div class="between"><h3>Strength since baseline</h3><span class="badge">${progress.length} tracked</span></div>${progress.length?progress.slice(0,8).map(s=>`<button class="block-exercise-row" onclick='openExerciseHistory(${JSON.stringify(s.name)})'><div><strong>${htmlSafe(s.name)}</strong><span>${s.baseline.status} baseline · ${compactMetric(s.baseline.value,s.current.metric.type)} → ${compactMetric(s.current.metric.value,s.current.metric.type)}</span></div><b class="${s.vsBaseline?.raw>=0?"good":"bad"}">${progressText(s.vsBaseline)}</b></button>`).join(""):`<div class="trend-empty compact"><strong>Not enough comparable exercise data yet</strong><span>Repeat exercises during this block to establish progress.</span></div>`}</section>
    <section class="card"><div class="between"><h3>Body measurements</h3><span class="badge">During this block</span></div><div class="metric-grid" style="margin-top:12px"><div class="metric"><strong>${weight==null?"—":`${weight>0?"+":""}${weight.toFixed(1)}kg`}</strong><span>Bodyweight change</span></div><div class="metric"><strong>${waist==null?"—":`${waist>0?"+":""}${waist.toFixed(1)}cm`}</strong><span>Waist change</span></div></div></section>
    ${due?`<section class="card review-actions"><div class="section-kicker">Choose what happens next</div><h3>Keep momentum, with a deliberate decision.</h3><button class="primary" onclick="completeTrainingBlock('continue')">CONTINUE FOR ANOTHER 6 WEEKS</button><button class="secondary" onclick="completeTrainingBlock('adjust')">Adjust programme first</button><button class="secondary" onclick="extendTrainingBlock()">Extend this block by 2 weeks</button><button class="secondary" onclick="completeTrainingBlock('recovery')">Take a recovery week</button></section>`:`<div class="notice">Your full review unlocks after week ${Number(b.weeks)||6}. You can still inspect any exercise now.</div>`}
    <button class="secondary" style="width:100%;margin-top:10px" onclick="go('stats')">Back to Progress</button>`,"stats");
}
function newTrainingBlock(startDate=isoDate()){
  const old=activeTrainingBlock();if(old)old.status="completed";
  const number=(state.trainingBlocks||[]).length+1,b={id:`block-${Date.now()}`,name:`Training Block ${number}`,startDate,weeks:6,status:"active"};
  state.trainingBlocks.push(b);state.activeBlockId=b.id;return b;
}
function completeTrainingBlock(action){
  if(action==="recovery"){
    const d=new Date();d.setDate(d.getDate()+7);state.recoveryUntil=isoDate(d);newTrainingBlock(state.recoveryUntil);save();go("home");toast("Recovery week recorded");return;
  }
  newTrainingBlock();save();
  if(action==="adjust"){go("program");toast("New block started — adjust your programme");}
  else{openBlockReview();toast("New six-week block started");}
}
function extendTrainingBlock(){const b=activeTrainingBlock();if(!b)return;b.weeks=(Number(b.weeks)||6)+2;save();openBlockReview();toast("Training block extended by 2 weeks")}
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

function programmeExerciseFromLibrary(name){
  const item=fullExerciseLibrary().find(x=>x.name===name);if(!item)return null;
  return {
    id:`programme-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
    name:item.name,sets:Number(item.sets)||3,repMin:Number(item.repMin)||8,repMax:Number(item.repMax)||12,
    rest:exerciseRest(item)||90,primary:item.primary,secondary:item.secondary||[],equipment:item.equipment||"Other",type:item.type||"Exercise"
  };
}
function programmeWorkMinutes(exercises=[]){
  const seconds=exercises.reduce((total,e)=>{
    const sets=Math.max(1,Number(e.sets)||1),rest=Math.max(15,Number(e.rest)||90);
    return total+(sets*45)+(Math.max(0,sets-1)*rest)+45;
  },0);
  return Math.round(seconds/60);
}
function refreshProgrammeDraftMinutes(){
  const d=window.__programmeDraft;if(!d)return;
  const currentWork=programmeWorkMinutes(d.exercises);
  if(window.__programmeDraftIsNew)d.plannedMinutes=Math.max(10,8+currentWork);
  else d.plannedMinutes=Math.max(10,(window.__programmeBaseMinutes||50)+(currentWork-(window.__programmeBaseWorkMinutes||0)));
}
function syncProgrammeDraftForm(){
  const d=window.__programmeDraft;if(!d)return;
  const name=qs("#programmeName"),day=qs("#programmeDay");
  if(name)d.name=name.value.trim();
  if(day)d.day=day.value;
}
function openProgrammeWorkoutEditor(workoutId=null){
  const existing=workoutId?workoutById(workoutId):null;
  window.__confirmDeleteWorkoutId=null;
  window.__programmeDraft=existing
    ?JSON.parse(JSON.stringify(existing))
    :{id:`custom-programme-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,name:"",day:"Flexible",plannedMinutes:50,exercises:[],isCustom:true};
  window.__programmeDraftIsNew=!existing;
  window.__programmeBaseMinutes=existing?.plannedMinutes||50;
  window.__programmeBaseWorkMinutes=programmeWorkMinutes(existing?.exercises||[]);
  if(!existing)refreshProgrammeDraftMinutes();
  renderProgrammeWorkoutEditor();
}
function renderProgrammeWorkoutEditor(){
  const d=window.__programmeDraft;if(!d){go("program");return}
  const isNew=!!window.__programmeDraftIsNew;
  const dayOptions=["Flexible","Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  document.getElementById("app").innerHTML=shell(isNew?"Add Workout":"Edit Workout","Programme template · future sessions only",
    `<section class="card programme-editor-card">
      <div class="notice" style="margin-bottom:13px">Changes affect future uses of this workout. Completed sessions and historic sets stay exactly as logged.</div>
      <div class="field programme-field"><label>Workout name</label><input id="programmeName" type="text" maxlength="48" placeholder="e.g. Push / Pull" value="${htmlSafe(d.name)}"></div>
      <div class="input-grid programme-meta-grid">
        <div class="field programme-field"><label>Planned day</label><select id="programmeDay">${dayOptions.map(x=>`<option value="${x}" ${d.day===x?"selected":""}>${x}</option>`).join("")}</select></div>
        <div class="field programme-field readonly-field"><label>Estimated minutes · auto</label><div class="readonly-value programme-minutes-value">${Number(d.plannedMinutes)||50} min</div></div>
      </div>
    </section>
    <section class="card custom-builder-summary">
      <div class="between"><div><div class="section-kicker">Exercises</div><h3 style="margin:2px 0 0">${d.exercises.length} selected</h3></div><span class="badge">${totalSets(d)} working sets</span></div>
      <div class="programme-exercise-list">
        ${d.exercises.length?d.exercises.map((e,i)=>`<div class="programme-exercise-row">
          <div class="custom-selected-number">${i+1}</div>
          <div class="programme-exercise-copy"><strong>${htmlSafe(e.name)}</strong><div class="small">${Number(e.sets)||0} sets · ${Number(e.repMin)||0}–${Number(e.repMax)||0} reps · ${Number(e.rest)||0}s rest</div></div>
          <div class="programme-row-actions">
            <button class="icon-action" onclick="moveProgrammeDraftExercise(${i},-1)" aria-label="Move ${htmlSafe(e.name)} up" ${i===0?"disabled":""}>↑</button>
            <button class="icon-action" onclick="moveProgrammeDraftExercise(${i},1)" aria-label="Move ${htmlSafe(e.name)} down" ${i===d.exercises.length-1?"disabled":""}>↓</button>
            <button class="mini-edit" onclick="editProgrammeDraftExercise(${i})">Edit</button>
          </div>
        </div>`).join(""):`<div class="empty">No exercises yet. Add exercises by muscle group.</div>`}
      </div>
      <button class="secondary programme-add-exercise" onclick="openProgrammeExercisePicker()">+ Add exercise</button>
    </section>
    <button class="primary" onclick="saveProgrammeWorkout()">${isNew?"ADD TO PROGRAMME":"SAVE WORKOUT"}</button>
    ${!isNew?(window.__confirmDeleteWorkoutId===d.id
      ?`<div class="delete-confirm-panel"><strong>Delete ${htmlSafe(d.name||"this workout")}?</strong><span>It will be removed from your programme. Completed workout history will remain.</span><div class="row"><button class="secondary" onclick="window.__confirmDeleteWorkoutId=null;renderProgrammeWorkoutEditor()">Keep workout</button><button class="secondary danger" onclick='deleteProgrammeWorkout(${JSON.stringify(d.id)})'>CONFIRM DELETE</button></div></div>`
      :`<button class="secondary danger" style="width:100%;margin-top:9px" onclick='requestDeleteProgrammeWorkout(${JSON.stringify(d.id)})'>Delete workout</button>`):""}
    <button class="secondary" style="width:100%;margin-top:9px" onclick="go('program')">Cancel</button>`,"program");
}
function openProgrammeExercisePicker(){
  syncProgrammeDraftForm();
  const d=window.__programmeDraft;if(!d)return;
  document.getElementById("app").innerHTML=shell("Add Exercise","Choose a muscle group",
    `<section class="card"><div class="muscle-card-grid">${EXERCISE_GROUPS.map(m=>`<button class="muscle-pick-card" onclick='openProgrammeExerciseGroup(${JSON.stringify(m)})'><strong>${m}</strong><span>${fullExerciseLibrary().filter(x=>x.primary===m).length} exercises</span></button>`).join("")}</div></section>
    <button class="secondary" style="width:100%" onclick="renderProgrammeWorkoutEditor()">Back to workout</button>`,"program");
}
function openProgrammeExerciseGroup(muscle){
  const d=window.__programmeDraft;if(!d)return;
  const selected=new Set(d.exercises.map(x=>x.name));
  const items=fullExerciseLibrary().filter(x=>x.primary===muscle);
  document.getElementById("app").innerHTML=shell(muscle,"Add an exercise to this programme workout",
    `<section class="card muscle-picker-visual"><div class="between"><div><div class="section-kicker">Target muscle</div><h3 style="margin:0">${muscle}</h3></div><span class="badge">${d.exercises.length} selected</span></div>${muscleBodySVG({[muscle]:1})}</section>
    <section class="card">${items.length?items.map(x=>{const added=selected.has(x.name);return `<button class="exercise-pick-card ${added?"is-selected":""}" ${added?"disabled":""} onclick='addProgrammeDraftExercise(${JSON.stringify(x.name)})'><div><strong>${htmlSafe(x.name)}</strong><div class="small">${x.sets??3} sets · ${x.repMin||8}–${x.repMax||12} reps · ${exerciseRest(x)}s · ${htmlSafe(x.equipment||"Other")}</div></div><span>${added?"Added":"Add"}</span></button>`}).join(""):`<div class="empty">No saved exercises in this muscle group yet.</div>`}</section>
    <section class="card"><div class="between"><div><h3 style="margin:0">Not listed?</h3><div class="small">Create it once and it will remain in your exercise library.</div></div></div><button class="primary" onclick='openCustomExerciseForm("programme-builder",null,${JSON.stringify(muscle)})'>+ CREATE CUSTOM ${muscle.toUpperCase()} EXERCISE</button></section>
    <button class="secondary" style="width:100%" onclick="openProgrammeExercisePicker()">Back to muscle groups</button>`,"program");
}
function addProgrammeDraftExercise(name){
  const d=window.__programmeDraft,item=programmeExerciseFromLibrary(name);if(!d||!item)return;
  if(d.exercises.some(x=>x.name===name)){toast(`${name} is already included`);return}
  d.exercises.push(item);refreshProgrammeDraftMinutes();toast(`${name} added`);renderProgrammeWorkoutEditor();
}
function moveProgrammeDraftExercise(index,direction){
  syncProgrammeDraftForm();
  const list=window.__programmeDraft?.exercises||[],from=Number(index),to=from+Number(direction);
  if(to<0||to>=list.length)return;
  [list[from],list[to]]=[list[to],list[from]];renderProgrammeWorkoutEditor();
}
function editProgrammeDraftExercise(index){
  syncProgrammeDraftForm();
  const e=window.__programmeDraft?.exercises?.[Number(index)];if(!e)return;
  document.getElementById("app").innerHTML=shell("Edit Exercise",e.name,
    `<section class="card"><div class="notice" style="margin-bottom:12px">These settings apply to this programme workout only.</div>
      <div class="input-grid programme-meta-grid">
        <div class="field programme-field"><label>Working sets</label><input id="programmeExSets" type="number" min="1" max="20" step="1" value="${e.sets}"></div>
        <div class="field programme-field"><label>Rest seconds</label><input id="programmeExRest" type="number" min="15" max="600" step="15" value="${e.rest}"></div>
        <div class="field programme-field"><label>Min reps</label><input id="programmeExMin" type="number" min="1" max="100" step="1" value="${e.repMin}"></div>
        <div class="field programme-field"><label>Max reps</label><input id="programmeExMax" type="number" min="1" max="100" step="1" value="${e.repMax}"></div>
      </div><button class="primary" onclick="saveProgrammeDraftExercise(${Number(index)})">SAVE EXERCISE</button>
      <button class="secondary danger" style="width:100%;margin-top:9px" onclick="removeProgrammeDraftExercise(${Number(index)})">Remove from workout</button>
    </section><button class="secondary" style="width:100%" onclick="renderProgrammeWorkoutEditor()">Cancel</button>`,"program");
}
function saveProgrammeDraftExercise(index){
  const e=window.__programmeDraft?.exercises?.[Number(index)];if(!e)return;
  const sets=parseInt(qs("#programmeExSets")?.value),rest=parseInt(qs("#programmeExRest")?.value),repMin=parseInt(qs("#programmeExMin")?.value),repMax=parseInt(qs("#programmeExMax")?.value);
  if(!(sets>0&&rest>=15&&repMin>0&&repMax>=repMin)){toast("Check sets, reps and rest");return}
  Object.assign(e,{sets,rest,repMin,repMax});refreshProgrammeDraftMinutes();renderProgrammeWorkoutEditor();
}
function removeProgrammeDraftExercise(index){
  window.__programmeDraft?.exercises?.splice(Number(index),1);refreshProgrammeDraftMinutes();renderProgrammeWorkoutEditor();
}
function saveProgrammeWorkout(){
  syncProgrammeDraftForm();
  const d=window.__programmeDraft;if(!d)return;
  if(!d.name){toast("Enter a workout name");return}
  if(!d.exercises.length){toast("Add at least one exercise");return}
  const existingIndex=state.program.findIndex(x=>x.id===d.id);
  const clean={...d,name:d.name.trim(),plannedMinutes:Number(d.plannedMinutes)||50,exercises:d.exercises.map(e=>({...e,sets:Number(e.sets),repMin:Number(e.repMin),repMax:Number(e.repMax),rest:Number(e.rest)}))};
  if(existingIndex>=0)state.program[existingIndex]=clean;else state.program.push(clean);
  if(!state.selectedProgram)state.selectedProgram=clean.id;
  save();window.__programmeDraft=null;window.__programmeDraftIsNew=false;state.route="program";save();render();toast(existingIndex>=0?"Workout updated":"Workout added to your programme");
}
function deleteProgrammeWorkout(id){
  const w=workoutById(id);if(!w)return;
  if(state.program.length<=1){toast("Keep at least one programme workout");return}
  state.program=state.program.filter(x=>x.id!==id);
  if(state.selectedProgram===id)state.selectedProgram=state.program[0]?.id||null;
  window.__programmeDraft=null;window.__programmeDraftIsNew=false;state.route="program";save();render();toast("Workout removed from programme");
}
function requestDeleteProgrammeWorkout(id){
  const w=workoutById(id);if(!w){toast("Workout could not be found");return}
  if(state.program.length<=1){toast("Keep at least one programme workout");return}
  window.__confirmDeleteWorkoutId=id;renderProgrammeWorkoutEditor();
}

function program(){
  return shell("Programme","Build, edit and select your workout plan",
    `<section class="plan-toolbar"><div><div class="section-kicker">Programme library</div><strong>${state.program.length} workout${state.program.length===1?"":"s"}</strong></div><button class="primary compact-primary" onclick="openProgrammeWorkoutEditor()">+ ADD WORKOUT</button></section>
    <section class="card">${state.program.map(w=>`<div class="workout-row">
      <div class="between"><div><strong>${htmlSafe(w.day||"Flexible")} · ${htmlSafe(w.name)}</strong><div class="small">${w.exercises.length} exercises · ${totalSets(w)} sets · ~${w.plannedMinutes||50} min</div></div><div class="plan-card-actions"><button class="secondary" onclick="openProgrammeWorkoutEditor('${w.id}')">Edit</button><button class="secondary plan-use" onclick="state.selectedProgram='${w.id}';save();go('home')">Use</button></div></div>
      <div style="margin-top:10px">${w.exercises.map(e=>`<div class="small" style="padding:4px 0">${htmlSafe(e.name)} · ${e.sets} × ${e.repMin}–${e.repMax} · ${e.rest}s rest</div>`).join("")}</div>
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
        if(!state.customExercises)state.customExercises=[];
        if(!state.exercisePrefs)state.exercisePrefs={};
        if(!state.checkins)state.checkins=[];
        if(!state.macroTargets)state.macroTargets={protein:190,carbs:250,fat:80};
        if(!state.progressMetric)state.progressMetric="weight";
        if(!state.progressRange)state.progressRange="7D";
        if(!/^\d{4}-\d{2}$/.test(state.calendarMonth||""))state.calendarMonth=isoDate().slice(0,7);
        state.progressPoint=-1;
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
  try{
    let html="";
    if(state.route==="home")html=home();
    else if(state.route==="live")html=live();
    else if(state.route==="summary")html=summary();
    else if(state.route==="analysis")html=analysis();
    else if(state.route==="stats")html=stats();
    else if(state.route==="history")html=history();
    else if(state.route==="program")html=program();
    else {state.route="home";save();html=home();}
    document.getElementById("app").innerHTML=html;
  }catch(err){
    console.error("Gym Tracker render error:",err);
    state.route="home";
    save();
    try{
      document.getElementById("app").innerHTML=home();
      setTimeout(()=>toast("Recovered from a screen error"),100);
    }catch(fatal){
      document.getElementById("app").innerHTML='<div style="padding:24px;color:white;font-family:-apple-system,sans-serif"><h2>Gym Tracker</h2><p>The app recovered from an error. Close and reopen it.</p></div>';
    }
  }
}
window.go=go; window.startWorkout=startWorkout; window.completeSet=completeSet; window.skipRest=skipRest; window.addRest=addRest;
window.cancelWorkout=cancelWorkout; window.exportData=exportData; window.importData=importData; window.resetAll=resetAll;
window.openExerciseMenu=openExerciseMenu; window.openAllExercises=openAllExercises; window.swapExercise=swapExercise;
window.addExercise=addExercise; window.skipExercise=skipExercise; window.moveExercise=moveExercise;
window.moveExerciseAt=moveExerciseAt;
window.setLoadMode=setLoadMode; window.editSet=editSet; window.deleteSet=deleteSet; window.finishWorkoutEarly=finishWorkoutEarly; window.setDefaultRest=setDefaultRest;
window.saveCheckin=saveCheckin;window.buildTopUp=buildTopUp;window.startBlankCustom=startBlankCustom;
window.renderCustomWorkoutBuilder=renderCustomWorkoutBuilder;window.openCustomWorkoutGroup=openCustomWorkoutGroup;
window.addToBlankCustom=addToBlankCustom;window.removeFromBlankCustom=removeFromBlankCustom;window.launchBlankCustom=launchBlankCustom;window.editMacroTargets=editMacroTargets;
window.openExercisePicker=openExercisePicker;window.openExerciseGroup=openExerciseGroup;window.chooseExerciseFromPicker=chooseExerciseFromPicker;
window.addExerciseByName=addExerciseByName;window.replaceExerciseAtIndex=replaceExerciseAtIndex;
window.openCustomExerciseForm=openCustomExerciseForm;window.saveCustomExerciseFromForm=saveCustomExerciseFromForm;
window.openCalendarDate=openCalendarDate;window.saveCheckinForDate=saveCheckinForDate;
window.changeCalendarMonth=changeCalendarMonth;
window.chooseBackdatedWorkout=chooseBackdatedWorkout;window.createBackdatedWorkout=createBackdatedWorkout;
window.createBackdatedCustomWorkout=createBackdatedCustomWorkout;
window.saveWeeklyWaist=saveWeeklyWaist;
window.openEditExerciseDefaults=openEditExerciseDefaults;window.saveExerciseDefaults=saveExerciseDefaults;
window.openEditCurrentExercise=openEditCurrentExercise;window.saveCurrentExercisePlan=saveCurrentExercisePlan;
window.updateAutoCalories=updateAutoCalories;
window.setProgressMetric=setProgressMetric;window.setProgressRange=setProgressRange;window.selectTrendPoint=selectTrendPoint;
window.openProgrammeWorkoutEditor=openProgrammeWorkoutEditor;window.renderProgrammeWorkoutEditor=renderProgrammeWorkoutEditor;
window.openProgrammeExercisePicker=openProgrammeExercisePicker;window.openProgrammeExerciseGroup=openProgrammeExerciseGroup;
window.addProgrammeDraftExercise=addProgrammeDraftExercise;window.moveProgrammeDraftExercise=moveProgrammeDraftExercise;
window.editProgrammeDraftExercise=editProgrammeDraftExercise;window.saveProgrammeDraftExercise=saveProgrammeDraftExercise;
window.removeProgrammeDraftExercise=removeProgrammeDraftExercise;window.saveProgrammeWorkout=saveProgrammeWorkout;window.deleteProgrammeWorkout=deleteProgrammeWorkout;window.requestDeleteProgrammeWorkout=requestDeleteProgrammeWorkout;
window.openGritSettings=openGritSettings;window.toggleGritDay=toggleGritDay;window.saveGritSettings=saveGritSettings;window.saveNextWorkoutDate=saveNextWorkoutDate;
window.selectExerciseHistoryMuscle=selectExerciseHistoryMuscle;window.selectExerciseHistoryExercise=selectExerciseHistoryExercise;
window.viewSelectedExerciseHistory=viewSelectedExerciseHistory;window.openExerciseHistory=openExerciseHistory;
window.openBlockReview=openBlockReview;window.completeTrainingBlock=completeTrainingBlock;window.extendTrainingBlock=extendTrainingBlock;
render();

if("serviceWorker" in navigator){ window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{})); }
