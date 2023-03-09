
# Updating process for circle.json, metadata.json, and arrows.json

## Netlify

### Existing turnkey deployement synced with Github repository.

  - Clone the https://github.com/EvoMapViz/EvoMapJS.
  - Edit `circle.json`, `metadata.json`, or `arrows.json` locally in the `src/data` folder.
  - Commit your changes using `git` and push them to the Github repository.
  - The https://lustrous-pixie-414f67.netlify.app/ app should automatically update on Netlify (pending about a minute for the build process to complete).

### App redeployed from scratch on Netlify from Github repository.

  - Clone your github copy of the https://github.com/EvoMapViz/EvoMapJS repo.
  - Edit `circle.json`, `metadata.json`, or `arrows.json` locally in the `src/data` folder.
  - Commit your changes using `git` and push them to the Github repository.
  - The Netlify app you synced with your personal copy of the repo should automatically update on Netlify (pending about a minute for the build process to complete).

## Local

- After running `npm start` (starts the local server environment for the app), edit `circle.json`, `metadata.json`, or `arrows.json` locally in the `src/data` folder.
- After you save your updates locally, the local deployment of your app at http://localhost:3000/ should automatically update in your browser.



