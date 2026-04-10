# Google Apps Script Backend

This folder contains the simplest backend for the questionnaire.

## What it does

- Receives one JSON submission from the questionnaire page
- Appends one row to a Google Sheet
- Stores the full response payload as JSON for later analysis

## Setup

1. Create a new Google Sheet.
2. Open `Extensions > Apps Script`.
3. Replace the default script with the contents of `Code.gs`.
4. Click `Deploy > New deployment`.
5. Choose `Web app`.
6. Set access to `Anyone`.
7. Copy the web app URL.
8. Paste that URL into `config.js` as `submissionEndpoint`.

Example:

```js
window.QUESTIONNAIRE_CONFIG = {
  projectName: "cross-speaker-questionnaire",
  submissionEndpoint: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
};
```

## Notes

- The questionnaire sends one complete JSON payload on final submission.
- The sheet stores summary columns plus the full JSON payload in the last column.
- After editing `Code.gs`, redeploy the web app if Google Apps Script asks for a new version.
