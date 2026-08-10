# Gym Tracker PWA — v6.1

Personal, mobile-first gym tracker for iPhone / web.

## v6.1 hotfix
- Fixes Workout Analysis not opening
- Fixes Progress screen not opening
- Adds the missing performance-metric helper used by both screens
- Makes muscle analysis safer for custom/older exercise records
- Treats the first session for each exercise as a baseline instead of displaying a large number of PBs
- Uses a new service-worker cache so the fix updates on iPhone

## Improvements in v6
- Assisted Pull-Up and Assisted Dip tracking
- Tracks decreasing assistance as progress
- Supports transition to bodyweight and later added-weight reps
- RIR entry for each set
- Warm-up vs working-set classification
- Warm-up sets excluded from weekly volume and PB analysis
- Edit and delete logged sets
- Finish workout early and still save it
- Persistent per-exercise default rest periods
- Exercise notes such as machine seat or grip
- Persistent custom exercises
- Broader PB detection: weight, reps at a load, estimated 1RM and session volume
- Rest timer now uses in-app vibration/beep rather than push notifications
- Existing v5 workout data remains compatible

## Previous v5 improvements
- Automatic real calendar-day display on Home
- Rolling workout sequence based on the last workout actually completed
- Missed training days do not create failures or blank sessions
- Automatic recommendation for the next workout
- Manual override: choose any workout on any day
- Recommendation advances after each completed workout
- Existing workout history remains compatible

## Previous v4 improvements
- Premium visual redesign to closely match the dark/lime concept screens
- Refined typography, spacing, cards and bottom navigation
- Cleaner live-workout hierarchy
- More polished rest timer
- Dashboard summary cards
- Strength trend charts using estimated 1RM
- Improved workout-history and analysis presentation
- Preserves the same `gymState` local-storage key, so existing v3 workout data remains compatible

## Previous v3 improvements
- Live workout exercise swapping
- Suggested same-muscle alternatives
- Full exercise library
- Add an extra exercise during a workout
- Create a custom exercise on the fly
- Skip an exercise without it counting as a decline
- Reorder the current exercise during the session
- Analysis follows what you actually performed, not only the planned template
- Strength history stays separate for Bench Press vs Seated Chest Press etc.

## Previous v2 improvements
- Proper 180px iPhone Home Screen icon
- 192px and 512px PWA icons
- Improved iPhone standalone/PWA metadata
- Offline cache updated
- Export workout-history backup
- Import/restore workout-history backup
- Clear in-app iPhone installation instructions
- No paid services, external libraries, accounts or API keys

## Current features
- Preloaded 5-day Upper/Lower + V-Taper programme
- Start a selected workout
- Log weight and reps for every working set
- Automatic rest timer after each set
- Browser notification / vibration when rest finishes where supported
- Workout history
- Workout summary with duration, working sets, total volume and PB count
- Muscle-group analysis:
  - primary muscle = 1.0 set
  - secondary muscle = 0.5 set
- Weekly set targets
- Estimated 1RM strength tracking
- Estimated-1RM PB detection
- Performance vs previous session
- Local browser storage
- JSON backup export/import
- Installable PWA and offline caching

## Deploy to GitHub Pages
Upload ALL files from this folder into the root of your GitHub repository:

- index.html
- styles.css
- app.js
- manifest.json
- sw.js
- icon-192.png
- icon-512.png
- apple-touch-icon.png

Then enable GitHub Pages:
Settings → Pages → Deploy from branch → main → /(root)

## Install on iPhone
1. Open your GitHub Pages address in Safari.
2. Tap Share.
3. Tap Add to Home Screen.
4. Tap Add.
5. Open Gym Tracker from the Home Screen.
6. Allow notifications when requested.

## Backup
Inside Programme → Data & backup:
- Export backup downloads a JSON backup.
- Import backup lets you restore that JSON later.

Important: because this free version stores workout data locally in Safari/PWA storage, keep an occasional exported backup.


## Flexible workout behaviour
Your programme is treated as a template.

During a live workout tap the `⋯` button beside the exercise to:
- swap to a similar exercise
- choose any exercise in the library
- add another exercise
- create a custom exercise
- skip the current exercise
- move the current exercise up or down

Example:
If Bench Press is planned but you swap it for Seated Chest Press:
- the workout records Seated Chest Press
- chest working-set volume is still counted
- Bench Press is NOT marked as weaker
- Seated Chest Press keeps its own independent PB and strength history


## Updating from v3 without losing data
The app still uses the same localStorage key: `gymState`.

If you replace the GitHub Pages files with v4 at the same URL, your existing workout history should remain on that device.

Recommended before every major update:
Programme → Data & backup → Export backup.


## Flexible scheduling behaviour
Programme order:
Upper A → Lower A → V-Taper / Arms → Upper B → Lower B → repeat.

Weekday labels are guides only.

Example:
- Monday: complete Upper A
- Tuesday: miss the gym
- Wednesday: miss the gym
- Thursday: app recommends Lower A

If you prefer Upper B on Thursday, choose Upper B manually and start it. The app records what you actually completed and then recommends the next workout from that point.

A missed day is never logged as a failed workout and does not count as a strength decline.


## Assisted Dip / Pull-Up progression
For Assisted Pull-Ups and Assisted Dips, the app stores `assistWeight`.
Progress means the assistance number decreases.

Example:
32 kg assistance → 27 kg → 20 kg → 10 kg → 0 kg/bodyweight.

You can switch the exercise to Bodyweight / Added mode later and log added load independently.

## Set types
Every set can be marked:
- Working
- Warm-up

Only working sets count toward muscle-volume targets and PB analysis.

## Effort
Each set can optionally store RIR (reps in reserve).

## Rest timer
The PWA does not require push notifications. Keep the app open and it will:
- count down visually
- vibrate if supported
- play a short beep
- show the next set when rest finishes
