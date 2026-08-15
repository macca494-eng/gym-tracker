
const APP_RELEASE = "7.4";
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
function muscleBodySVG(values={}){
  const max=Math.max(1,...Object.values(values).map(Number).filter(Number.isFinite));
  const op=m=>values[m]?Math.max(.42,Math.min(1,Number(values[m])/max)):.08;
  const fill=(m)=>`style="opacity:${op(m)}"`;
  return `<svg class="muscle-body" viewBox="0 0 340 190" role="img" aria-label="Muscles worked">
    <g class="body-base">
      <circle cx="86" cy="22" r="15"/><rect x="66" y="39" width="40" height="55" rx="16"/>
      <rect x="48" y="45" width="15" height="67" rx="8"/><rect x="109" y="45" width="15" height="67" rx="8"/>
      <rect x="67" y="96" width="17" height="69" rx="9"/><rect x="88" y="96" width="17" height="69" rx="9"/>
      <circle cx="254" cy="22" r="15"/><rect x="234" y="39" width="40" height="55" rx="16"/>
      <rect x="216" y="45" width="15" height="67" rx="8"/><rect x="277" y="45" width="15" height="67" rx="8"/>
      <rect x="235" y="96" width="17" height="69" rx="9"/><rect x="256" y="96" width="17" height="69" rx="9"/>
    </g>
    <g class="muscle-hi">
      <path d="M69 49 Q86 39 103 49 L101 69 Q86 76 71 69 Z" ${fill("Chest")}/>
      <circle cx="62" cy="48" r="10" ${fill("Front Delts")}/><circle cx="110" cy="48" r="10" ${fill("Front Delts")}/>
      <circle cx="58" cy="52" r="11" ${fill("Side Delts")}/><circle cx="114" cy="52" r="11" ${fill("Side Delts")}/>
      <rect x="50" y="61" width="11" height="28" rx="6" ${fill("Biceps")}/><rect x="111" y="61" width="11" height="28" rx="6" ${fill("Biceps")}/>
      <rect x="76" y="70" width="20" height="21" rx="5" ${fill("Core")}/>
      <rect x="68" y="99" width="15" height="38" rx="7" ${fill("Quads")}/><rect x="89" y="99" width="15" height="38" rx="7" ${fill("Quads")}/>
      <rect x="69" y="139" width="13" height="25" rx="6" ${fill("Calves")}/><rect x="90" y="139" width="13" height="25" rx="6" ${fill("Calves")}/>

      <path d="M237 49 Q254 38 271 49 L269 83 Q254 93 239 83 Z" ${fill("Back")}/>
      <circle cx="230" cy="49" r="10" ${fill("Rear Delts")}/><circle cx="278" cy="49" r="10" ${fill("Rear Delts")}/>
      <rect x="218" y="61" width="11" height="30" rx="6" ${fill("Triceps")}/><rect x="279" y="61" width="11" height="30" rx="6" ${fill("Triceps")}/>
      <rect x="239" y="91" width="31" height="17" rx="8" ${fill("Glutes")}/>
      <rect x="236" y="108" width="15" height="31" rx="7" ${fill("Hamstrings")}/><rect x="257" y="108" width="15" height="31" rx="7" ${fill("Hamstrings")}/>
      <rect x="237" y="140" width="13" height="25" rx="6" ${fill("Calves")}/><rect x="258" y="140" width="13" height="25" rx="6" ${fill("Calves")}/>
    </g>
    <text x="86" y="184" text-anchor="middle">FRONT</text><text x="254" y="184" text-anchor="middle">BACK</text>
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
      <button class="primary" onclick='saveCustomExerciseFromForm(${JSON.stringify(mode)},${targetIndex===null?"null":targetIndex})'>SAVE & ${mode==="replace"?"USE AS REPLACEMENT":"ADD TO WORKOUT"}</button>
    </section>
    <button class="secondary" style="width:100%" onclick='openExercisePicker(${JSON.stringify(mode)},${targetIndex===null?"null":targetIndex})'>Cancel</button>`,
  "home");
}

function saveCustomExerciseFromForm(mode="add",targetIndex=null){
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
  chooseExerciseFromPicker(item.name,mode,targetIndex);
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
  const isOverride=selected.id!==recommended.id,c=todayCheckin(),t=state.macroTargets,gaps=weeklyGapRows(),biggest=gaps.filter(x=>x.short>0).slice(0,3),kcalTarget=Math.round(t.protein*4+t.carbs*4+t.fat*9);
  const active=activeWorkoutSummary();
  return shell(`${greeting()}, Michael`,todayLabel(),
  `${active?`<section class="card active-workout-card">
      <div class="between"><span class="tag" style="margin-bottom:0">WORKOUT IN PROGRESS</span><span class="badge">${active.elapsed===null?"Backdated":`${active.elapsed} min`}</span></div>
      <div class="big" style="font-size:28px;margin-top:14px">${state.current.name}</div>
      <div class="meta">${active.ex?`Exercise ${active.idx+1} of ${active.exercises.length} · ${active.ex.name}`:""} · ${active.completed} working sets logged</div>
      <button class="primary" onclick="go('live')">CONTINUE WORKOUT</button>
      <button class="secondary danger" style="width:100%;margin-top:8px" onclick="cancelWorkout()">Discard workout</button>
    </section>`:""}
    <section class="card hero">
      <div class="hero-orb"></div><span class="tag">${isOverride?"SELECTED":"RECOMMENDED"}</span>
      <div class="big">${selected.name}</div>
      <div class="meta">${isOverride?"Manual choice":recommendationReason(recommended)} · ${selected.exercises.length} exercises · ${totalSets(selected)} planned sets · ~${selected.plannedMinutes||50} min incl. warm-up</div>
      <button class="primary" onclick="startWorkout('${selected.id}')">START ${selected.name.toUpperCase()}</button>
      ${isOverride?`<button class="secondary" style="width:100%;margin-top:8px" onclick="state.selectedProgram='${recommended.id}';save();render()">Use recommended: ${recommended.name}</button>`:""}
    </section>
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
  window.__blankCustom=[]; if(!state.backdatedCustomDate) state.backdatedCustomDate=null;
  document.getElementById("app").innerHTML=shell("Custom Workout","Choose exercises",
    `<section class="card"><div class="notice" style="margin-bottom:12px">Pick exercises from the library. Use your weekly set balance to guide what you need most.</div>${fullExerciseLibrary().map(x=>`<div class="workout-row between"><div><strong>${x.name}</strong><div class="small">${x.primary} · ${x.equipment||""}</div></div><button class="secondary" onclick='addToBlankCustom(${JSON.stringify(x.name)})'>Add</button></div>`).join("")}</section>
     <section class="card"><h3>Selected</h3><div id="customSelected" class="small">No exercises selected yet.</div><button class="primary" onclick="launchBlankCustom()">START CUSTOM WORKOUT</button></section>`,"home");
}
function addToBlankCustom(name){
  const item=fullExerciseLibrary().find(x=>x.name===name);if(!item)return;window.__blankCustom.push(makeSessionExercise(item));
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
  return shell("Progress","Strength, bodyweight & nutrition trends",
    `<section class="card">
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
        if(!state.customExercises)state.customExercises=[];
        if(!state.exercisePrefs)state.exercisePrefs={};
        if(!state.checkins)state.checkins=[];
        if(!state.macroTargets)state.macroTargets={protein:190,carbs:250,fat:80};
        if(!state.progressMetric)state.progressMetric="weight";
        if(!state.progressRange)state.progressRange="7D";
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
window.addToBlankCustom=addToBlankCustom;window.launchBlankCustom=launchBlankCustom;window.editMacroTargets=editMacroTargets;
window.openExercisePicker=openExercisePicker;window.openExerciseGroup=openExerciseGroup;window.chooseExerciseFromPicker=chooseExerciseFromPicker;
window.addExerciseByName=addExerciseByName;window.replaceExerciseAtIndex=replaceExerciseAtIndex;
window.openCustomExerciseForm=openCustomExerciseForm;window.saveCustomExerciseFromForm=saveCustomExerciseFromForm;
window.openCalendarDate=openCalendarDate;window.saveCheckinForDate=saveCheckinForDate;
window.chooseBackdatedWorkout=chooseBackdatedWorkout;window.createBackdatedWorkout=createBackdatedWorkout;
window.createBackdatedCustomWorkout=createBackdatedCustomWorkout;
window.saveWeeklyWaist=saveWeeklyWaist;
window.openEditExerciseDefaults=openEditExerciseDefaults;window.saveExerciseDefaults=saveExerciseDefaults;
window.openEditCurrentExercise=openEditCurrentExercise;window.saveCurrentExercisePlan=saveCurrentExercisePlan;
window.updateAutoCalories=updateAutoCalories;
window.setProgressMetric=setProgressMetric;window.setProgressRange=setProgressRange;window.selectTrendPoint=selectTrendPoint;
render();

if("serviceWorker" in navigator){ window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{})); }
