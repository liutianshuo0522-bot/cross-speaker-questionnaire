# Cross-Speaker Emotion Transfer Questionnaire

This is a static listening-test website for evaluating cross-speaker emotional transfer.
It is designed to run on GitHub Pages and submit final responses directly to a backend.

## Contents

- `index.html`: GitHub Pages entry
- `questionnaire.html`: main questionnaire page
- `config.js`: frontend submission endpoint config
- `google-apps-script/`: simple backend for Google Sheets collection
- `Tess_Joyful/`: joyful reference audio
- `Tess_arctic/`, `Tess_arctic_+++/`, `Amelia_arctic/`, `Amelia_arctic_+++/`: anonymous evaluation conditions

## Local Preview

Open a local static server in this folder:

```bash
cd /Users/liutianshuo/Desktop/Experiment_ss/cross_speaker
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Deploy With GitHub Pages

1. Create a new GitHub repository.
2. Upload all files in this folder to the repository root.
3. In GitHub, open `Settings > Pages`.
4. Set `Build and deployment` to `Deploy from a branch`.
5. Choose branch `main` and folder `/ (root)`.
6. Save, then wait for GitHub Pages to publish.

Your public link will look like:

```text
https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/
```

## Collect Responses Automatically

The recommended setup is:

- frontend: GitHub Pages
- backend: Google Apps Script
- storage: Google Sheets

Setup steps:

1. Deploy the Apps Script backend in [`google-apps-script/Code.gs`](/Users/liutianshuo/Desktop/Experiment_ss/cross_speaker/google-apps-script/Code.gs).
2. Copy the Apps Script web app URL.
3. Paste it into [`config.js`](/Users/liutianshuo/Desktop/Experiment_ss/cross_speaker/config.js) as `submissionEndpoint`.
4. Commit and push the updated `config.js`.
5. Open the GitHub Pages site and test one submission.

## Notes

- Draft progress is saved locally while the participant is filling in the form.
- Final answers are sent to the backend only when the participant clicks `Submit Responses`.
- The backend stores both summary columns and the full JSON payload for later analysis.
