# Cross-Speaker Emotion Transfer Questionnaire

This is a static listening-test website for evaluating cross-speaker emotional transfer.

## Contents

- `index.html`: GitHub Pages entry
- `questionnaire.html`: main questionnaire page
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

## Notes

- Responses are stored in the participant's local browser unless they export `JSON` or `CSV`.
- If you want centralized online collection, the page needs a backend or a form service.
