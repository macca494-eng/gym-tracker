# REPTRACE v8.9

GitHub-ready static web app release.

## Included in this release

- REPTRACE logo, wordmark and Home Screen icons
- Redesigned REPTRACE home dashboard
- Grit Score and next-workout cards
- Weekly anatomical muscle map and effective-set totals
- Calendar, weekly muscle targets and top-up workout builder
- Editable programme workouts and permanent custom exercises
- Guided exercise-history selector by muscle group and exercise
- Six-week training blocks, baselines and progress reviews

## Publish with GitHub Pages

1. Export a backup from the current app before changing anything.
2. Open the existing GitHub repository.
3. Upload every file from this release into the repository root, replacing files with the same names.
4. Commit the changes to the main branch.
5. In **Settings → Pages**, select **Deploy from a branch**, then choose **main** and **/(root)**.
6. Wait for the Pages deployment to finish and open the published address.

The app is intentionally buildless: `index.html` is the entry point and no installation or build command is required.

## Important data note

Workout data is stored in the browser on the user's device, not in this package or GitHub. Updating files at the same web address should retain that data, but always export a backup first. A changed domain or repository URL is treated as a different app and will not automatically contain the old browser data.

## iPhone Home Screen

If an older shortcut still says **Gym Tracker**, export a backup, remove the old shortcut, open the updated GitHub Pages address in Safari, then use **Share → Add to Home Screen**. Confirm the title says **REPTRACE** before adding it.
