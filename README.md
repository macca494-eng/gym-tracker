# Gym Tracker PWA — v7.2

## v7.2 workflow update
- Home now shows a prominent **Workout in Progress** card whenever a session is active.
- Leaving a workout no longer means hunting for it again: tap **Continue Workout** to resume exactly where you were.
- Exercise changes and additions now use a visual muscle-group library instead of requiring an exact typed exercise name.
- Muscle-group cards show current weekly set status to help you choose useful additions.
- Select a muscle group, then choose from saved exercise cards.
- **Change Exercise** replaces the selected unstarted exercise in the plan.
- **Add Exercise** always adds the new exercise to the end of the current workout.
- Upcoming exercises in the workout queue have a **Change** button.
- A custom-exercise form now lets you set name, primary muscle, secondary muscles, equipment, sets, rep range and rest period.
- Newly created custom exercises are saved permanently to the exercise library.
- Existing v7.1.1 training, nutrition, bodyweight and preference data remains compatible.

## v7.1.1 hotfix
- Fixes the Progress button / Progress screen.
- Restores the missing strength-chart helper.
- Fixes the black-screen-on-reopen issue caused when Progress was the saved last screen.
- Adds a render recovery safeguard so a future screen error returns the app to Home rather than leaving a blank screen.
- Keeps all existing workout, macro, bodyweight and preference data compatible.

## v7.1 update
- Tap any date in the monthly calendar.
- Add or edit bodyweight and macros for any historical date.
- View workouts recorded on a selected date.
- Add a standard programme workout to a historical date.
- Add a blank custom workout to a historical date.
- Backdated workouts save to the selected date and do not alter the rolling next-workout recommendation.

## What's new in v7
- Default 5-day programme redesigned to fit roughly 48–52 minutes including an 8–10 minute warm-up/dynamic preparation.
- Automatic time-of-day greeting and current date.
- Monthly workout calendar with completed workout dates highlighted and today's date ringed.
- Daily bodyweight entry.
- Daily protein, carbs and fat entry.
- Default macro targets: 190 g protein, 250 g carbs, 80 g fat (2,480 kcal calculated).
- 7-day nutrition averages and visual actual-vs-target bars.
- Current Monday–Sunday effective-set balance on Home.
- Front delts, side delts and rear delts tracked separately.
- Fractional secondary-muscle credit for compound exercises.
- Automatic Weekly Top-Up workout builder based on the biggest set deficits.
- Blank Custom Workout builder from the exercise library.
- Last-session exercise performance is remembered.
- Next-set and next-session load suggestions based on reps, RIR and rep range.
- 3 RIR normally suggests a small increase; 4 RIR a larger increase; 5+ RIR can suggest +5 kg or more depending on exercise.
- Assisted pull-ups/dips use reverse progression: lower assistance is better.
- All v6.1 workout history, exercise preferences and backups remain compatible.

## Core existing features
- Flexible rolling programme recommendation and manual override.
- Exercise swaps, additions, skips and reordering.
- Warm-up vs working sets.
- RIR, notes, edit/delete set.
- Rest timer with in-app beep/vibration.
- Finish workout early.
- PBs, estimated 1RM, history and workout analysis.
- JSON export/import backup.
- Local/offline PWA operation.

## Storage
Training and nutrition records are stored locally in the browser/PWA. Export a backup periodically from Programme → Data & backup.
