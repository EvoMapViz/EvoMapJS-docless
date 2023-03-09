# Deploy online (Netlify)

## Existing turnkey deployement synced with Github repository

  - The app has already been deployed to a Netlify environment that is synced with the
github repository https://github.com/EvoMapViz/EvoMapJS.
  - The deployment settings can be accessed at https://app.netlify.com/sites/lustrous-pixie-414f67/overview (login through Github with EvoMapViz account).
  - The deployed app can be accessed at https://lustrous-pixie-414f67.netlify.app/.

## Redeploying the app from scratch on Netlify from Github repository

  - Copy https://github.com/EvoMapViz/EvoMapJS to a separate Github repository of your own.
  - Create a Netlify account and link it to your Github account.
  - Create a new site on Netlify and link it to your cloned version of https://github.com/EvoMapViz/EvoMapJS.
  - In your Netlify `Sites settings/Build setting`, set the build command to `Build command CI=false npm run build` (and the publish directory to `build` if that is not already the default).
  - In your Netlify site's `Sites settings/Environment variables`, add a variable with key `NPM_FLAGS` and value `--legacy-peer-deps`.
