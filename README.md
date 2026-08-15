# Gym Tracker PWA — v7.4

## v7.4
- Replaces oversized strength line charts with compact recent-improvement cards.
- Compares each exercise's latest comparable performance with its previous session.
- Supports estimated 1RM increases, added-weight improvements, reduced assistance and same-load rep gains.
- Adds an interactive Renpho-style trend chart for weight, waist, calories, protein, carbs and fat.
- Adds 7-day, 1-month, 3-month and 1-year trend ranges with daily, weekly and monthly aggregation.
- Tap any chart point to view its exact value and date.
- Calories calculate automatically using protein × 4 + carbs × 4 + fat × 9.
- Adds a live read-only calorie field to today's and historical check-ins.
- Adds reliable up/down controls for every exercise in the live workout queue.
- Fixes workout sequencing after exercises are reordered so no displaced exercise is skipped.
- Missing nutrition days are omitted from trends rather than treated as zero.

## v7.3
- Persistent running workout-duration timer on live set and rest screens.
- Rest timer now shows the suggested next weight / assistance before the next set.
- Suggested load uses the existing rep-range + RIR progression logic.
- Visual muscle-body graphic highlights primary and secondary muscles on the live exercise screen.
- Muscle-group picker now shows the selected muscle on the body graphic.
- Workout Analysis includes a session muscle heat map.
- PB presentation redesigned as visual cards with muscle-group icons.
- PB system simplified to meaningful strength records:
  - Weight PB
  - Estimated 1RM PB
  - Assisted pull-up/dip lowest-assistance PB
  - Added-weight dip/pull-up PB
- Rep PB and volume PB removed.
- Weekly waist tracking added.
- Waist is recorded in centimetres around the belly button and is prompted once per training week.
- Progress now includes weight and waist body-composition trends.
- Historical calendar check-ins can also record/edit waist.
- Exercise defaults are editable after creation:
  - sets
  - rep range
  - rest period
  - primary muscle
  - secondary muscles
  - equipment
- Current-workout sets/reps/rest can be edited without changing the permanent exercise default.
- Fixes custom/replacement exercises incorrectly inheriting the replaced exercise's old set count.
- Saved exercise defaults are now respected when starting future planned workouts.
- Existing v7.2 workout, nutrition, bodyweight, exercise and preference data remains compatible.

## Existing MVP
Includes flexible rolling programming, <=60-minute programme design, exercise swaps/additions, custom workouts, weekly effective-set balance, top-up workouts, RIR-based load guidance, assisted-weight progression, workout history, calendar backdating, macro tracking, rest timer, PBs, progress charts, JSON backup/import and offline PWA support.

## Waist measurement
Record once weekly, around the belly button, relaxed, under similar conditions each week.

## Storage
All data remains stored locally in the PWA/browser. Export backups periodically from Plan → Data & backup.
