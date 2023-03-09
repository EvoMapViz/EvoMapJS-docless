# EvoMapJS

## Data requirements: Overview

The app requires three `json` files each made of a single array of objects. 
The objects themselves can only contain key-value pairs. 
The three `json` files must be located in the `src/data` folder:

(Click on triangles to expand/collapse details about each file.)

<!-- https://stackoverflow.com/questions/52214187/how-can-i-fold-content-in-github-markdown -->
<details closed>
<summary style = "font-size: 17px; font-weight: bold">  
circles.json 
</summary> 
<p>

An array of objects containing a set of key-value pairs that represent the relevant data about the units that should be displayed in the visualization.

The data is assumed to be in tidy format, i.e., each object in the array must represent a *single* unit in a *single* time period.

Henceforth: 
  - An object in the `circles.json` array will often be referred to as a "row", or an "observation".
  - The term "unit" will be used to denote the group of rows belonging to the same observational agent (e.g., a firm, a political party,...) across time periods.
  - Beyond the required time-stamps, x-y coordinates, and unit identifiers, additional data about observations will be referred to as "features".

</p>
</details>

<details closed>
<summary style = "font-size: 17px; font-weight: bold">
 metadata.json 
 </summary>
<p>

An array of objects containing a set of key-value pairs that provides additional information about:

  - The types of some of the features included in `circle.json`,
  - How these features should be taken into account in the visualization,
  - How these features should be taken into account in the app's UI.

</p>
</details>

<details closed>
<summary style = "font-size: 17px; font-weight: bold"> 
arrows.json 
</summary>
<p>

An array of objects containing a set of key-value pairs that represent the relevant data about the arrows that should be displayed in the visualization.

The data is assumed to be in tidy format, i.e., each object in the array must represent a *single* arrow in a *single* time period.

The file is **required** *even if no arrows should be displayed* in the visualization. To display no arrows, simply provide an empty array, i.e., `[]`.

</p>
</details>


## Format details and effects on visualization

(Click on triangles to expand/collapse details about each file.)

<details closed>
<summary style = "font-size: 17px; font-weight: bold"> 
circles.json 
</summary>
<p>

Key-value pairs (each row):
<br />



  > `name` (required): the name of the unit corresponding to the observation.
  >  - *Acceptable*: Any string.
  >
  >`time` (required): the time period for the observation.
  >  - *Acceptable*: Any integer.
  >
  >`x` (required): the x coordinate of the unit at `time`.
  >  - *Acceptable*: Any number.
  > 
  >`y`(required): the y coordinate of the unit at `time`.
  >  - *Acceptable*: Any number.
  > 
  >`continuous_feature_1` (optional): a continuous feature of the unit at `time`.
  >  - *Acceptable*: Any string or number.
  >
  > ⋮
  >
  >`continuous_feature_c` (optional): a continuous feature of the unit at `time`.
  >  - *Acceptable*: Any string or number.
  >
  >`discrete_feature_1` (optional): a discrete feature of the unit at `time`.
  >  - *Acceptable*: Any string or number.
  >
  > ⋮
  > 
  >`discrete_feature_d` (optional): a discrete feature of the unit at `time`.
  >  - *Acceptable*: Any string or number.

<br />
Further requirements and info: 

- Each row *must* contain the full exact same set of keys, including **at least one** continuous feature (on top of the required `name`, `time`, `x`, and `y` keys).

- Whether a feature is considered "continuous" or "discrete" is specified through `metadata.json`.
  - Features marked as "continuous" in `metadata.json` must be numerical.
  - Features marked as "discrete" in `metadata.json` will be treated as categorical, even if they are supplied in a numerical format.
    - Inconsistent types for "discrete" features has not been tested. 
    It's safest to have a single discrete feature be either all strings or all numericals across all rows. 

- Missing time periods are allowed and are signaled by the *complete* absence of an row for that time period.
  - As indicated above, each object *must* contain the exact same set of keys.The app does not allow for "partially missing" time periods whereby a row  features missing keys or keys otherwise marked as `NA`, `NaN`, `null`,....

- The order of rows and key-value pairs within rows is irrelevant.

<br />
 Prototype of valid format: 
<br />
<br />


```
[
{"name":"1ST SOURCE CORP","time":1998,"mkvalt":0.58,"sic_code":"60","x":6.4079211884,"y":13.0098593574,"cluster":8,"sic_code_label":"Depository Institutions","cluster_label":"Banking"},
{"name":"1ST SOURCE CORP","time":1999,"mkvalt":0.48,"sic_code":"60","x":6.4444474746,"y":13.0361878325,"cluster":8,"sic_code_label":"Depository Institutions","cluster_label":"Banking"},
{"name":"PIONEER NATURAL RESOURCES CO","time":2000,"mkvalt":1.94,"rank":288.0,"sic_code":"13","x":6.8169413341,"y":3.6371516382,"cluster":4,"sic_code_label":"Oil and Gas Extraction","cluster_label":"Oil, Energy and Utilities"},
{"time":1999, "name":"PIONEER NATURAL RESOURCES CO", "mkvalt":0.9,"rank":417.0,"sic_code":"13","x":6.8474968473,"y":3.6536847176,"cluster":4,"sic_code_label":"Oil and Gas Extraction","cluster_label":"Oil, Energy and Utilities"}
]
```

For a full example of the data format, see `src/data/circles_TEMPLATE_DO_NOT_ERASE.json` in this repository.
  - This is a reference template that should *not* be erased. 
  You should copy it, rename it to `circles.json`, and experiment with editing the latter with your own data (you can always revert to the template if you break the data format and want a fresh start).

</p>
</details>

<details closed>
<summary style = "font-size: 17px; font-weight: bold"> 
metadata.json
</summary>
<p>

The array must contain **at least** *one object corresponding to a feature* from `circles.json`, and must identify **at least** *one* of these features as *"continuous"*.

For each object in the array, the key-value pairs are:

> `name` (required): The name of the feature.
>   - *Acceptable*: Any string that matches the name of a feature in `circles.json`.
> 
> `label` (required): The label of the feature as it should be displayed
> in the app's UI.
>   - *Acceptable*: Any string.
> 
> `type` (optional): The type of the feature. Must be either
> "continuous" or "discrete".
>   - *Default*: `"discrete"`.
>   - *Acceptable*: `"continuous"`, `"discrete"`.
>   - `"continuous"`: 
>      - Feature appears in the "Size" selector menu of the app's UI unless the `tooltip` key is set to `"only"`.
>      - Feature must be numerical in `circle.json`. 
>    - `"discrete"`:
>      - Feature appears in the "Color" selector menu of the app's UI unless the `tooltip` key is set to `"only"`.
>      - Feature will be treated as categorical (even if it is supplied in a numerical format in `circle.json`).
> 
> `tooltip` (optional): 
>   - *Acceptable*: `"true"`, `"false"`, `"only"`.
>   - *Default*: `"false"`.
>   - `"true"`: 
>     - The feature is included in the tooltip that appears when the user hovers over a circle.
>   - `false`, 
>     - The feature is *not* included in the tooltip that appears when the user hovers over a circle.
>     - The feature is included in the relevant selector menu of the app's UI (see `type`).
>   - `"only"`:
>     - The feature *is* included in the tooltip that appears when the user hovers over a circle.
>     - The feature is *not* included in the relevant selector menu of the app's UI (see `type`).
>   - *Note*: The tooltip is calibrated to include at least one feature (on top of each circle's name). If no features listed in
> `metadata.json` has `tooltip` set of `"true"` or `"only"`, the
> dimensions of the tooltip will be slightly off.
> 
>   !!! The rest of this "metadata" section contains rough and
> approximative guidance on how to use the other metadata parameters. 
> It is a barely edited copy-paste from old documentation and may not be
> up-to-date. TO DO: Update this documentation to better reflect the
> current state of the app and unify formatting !!!.
> 
> `color_bins` (optional):   
>   -	*Acceptable*: An array of numbers, e.g., `[1,10,100,300,600]`.
>   - *Default*: 
>       - Features marked as "continuous" :The quintiles of the feature's distribution.
>       - Features marked as "discrete": `undefined`.  
>   -	For features marked as "continuous", determines how circles are binned into discrete categories when the feature is selected in the "Color" selector (e.g., `"color_bins": [1,10,100,300,600]` bins the feature based on whether its value is between its minimum value and 1, between 1 and 10, …, between 300 and 600, and between 600 and the feature's maximum value).
>   - No effect on features marked as "discrete".
> 
> `size_legend_bins` (optional):   
>   - *Acceptable*: An array of numbers, e.g., `[5, 100,300,600]`.
>   - *Default*: 
>       - Features marked as "continuous" :10%, 50%, and 100% quantiles of the feature's distribution.
>       - Features marked as "discrete": `undefined`.
>   - Determines the set of values of features marked as "continuous" for which a bubble-size is displayed in the size-legend.
>   - No effect on features marked as "discrete".
> 
> `scale_increasing` (optional): 
>   - *Acceptable*: `“true”`, `“false”`.
>   - *Default*: `“true”` for features marked as "continous", `undefined` for features marked as "discrete".
>   - `true`: For features marked as "continuous", when the feature is selected through the "Size" selector, makes 
>     - circle sizes  proportional  to the corresponding continuous feature.
>     - the size Legend display from lower to higher values.
proportional (`“true”`) or inversely proportional (“false”) to the corresponding continuous feature.
> - `false`: For features marked as "continuous", when the feature is selected through the "Size" selector, makes
>   - The size Legend is displayed from higher to lower values (`“false”`).
>   - circle sizes inversely proportional to the corresponding continuous feature.
>  - No effect on features marked as "discrete".
>
> `scale_minSize` (optional):
>   -	*Acceptable*: a single number.
>   - *Default*: `1`.
>   -	Determines the lowest possible circle-size. 
>
>`scale_maxSize` (optional):   
>   -	*Acceptable*: a single number.
>   - *Default*: `50`.
>   -	Determines the highest possible circle-size. 
>
>`scale_exponent` (optional):
>   -  *Acceptable*: a single number.
>   - *Default*: `1`.
>   - Determines the curvature of the matching between the values of a feature identified as “continuous” and the corresponding circle-sizes.
>     -	A value of 1 corresponds to a linear scale, i.e., all values of the feature between its min and max will be linearly recast to sizes between `scale_minSize` and `scale_maxSize`.
>     - A value above 1 corresponds to a concave scale, i.e., starting from `scale_minSize`, sizes will first increase fast with the value of the feature, and then increase slower and slower as they approach
> `scale_maxSize`.
>     - A value below 1 corresponds to a convex scale, i.e., starting from `scale_minSize`, sizes will first increase slowly with the value of the feature, and then increase faster and faster as they approach `scale_maxSize`. 
>  - No effect on features marked as "discrete".
>
>`unit`:
>   - *Acceptable*: A string (`"B"`, `"USD"`, or `"$"`).
>   - *Default*: empty string `""`.
>   - Determines whether a unit sign is appended whenever the value of a continuous feature is displayed, whether in legends or in tooltips. 
>   - No effect on features marked as "discrete".
>
>`truncate_label` (optional):   
>   - *Acceptable*: A single number.
>   - *Default*: `9`.
>   - Determines the number of characters after which the feature’s name label is truncated when displayed in the tooltip.  
>
>`truncate_value`:   
>   - *Acceptable*: A single number.
>   - *Default*: `6`.
>   - Determines the number of characters after which whether the value of the feature is truncated when displayed in the tooltip.  
>
>`legend_dline_extral`:  
>   - *Acceptable*: A single number.
>   - *Default*: `10`.
>   - For features marked as "continuous", determines the base-length of the dashed line connecting bubble-sizes to their label in the size-legend.
>   - No effect on features marked as "discrete".

Prototype of valid format:

```
[ 
  {"name": "cluster",
  "label": "Cluster Number",
  "type": "discrete"
  },
  {"name": "mkvalt",
  "label": "Market Value",
  "type": "continuous",
  "tooltip" : "true"
  }
]
``` 

For a full example of the data format, see `src/data/metadata_TEMPLATE_DO_NOT_ERASE.json` in this repository.
  - This is a reference template that should *not* be erased. 
  You should copy it, rename it to `metadata.json`,  and experiment editing the latter with your own data (you can always revert to the template if you break the data format and want a fresh start).
  - `src/data/metadata_TEMPLATE_DO_NOT_ERASE.json` is made to work with `src/data/circles_TEMPLATE_DO_NOT_ERASE.json`.

</p>
</details>

<details closed>
<summary style = "font-size: 17px; font-weight: bold"> 
 arrows.json
</summary>
<p>

Key-value pairs:

> `name` (required): The name of the arrow as it will be displayed in the app >(also serves as a technical identifier inside the code).
>  - *Acceptable*: Any string.
>
>`x` (required): The x-coordinate of the arrow's head.
>  - *Acceptable*: Any number.
>  - By default, all arrows tails are placed x = 0.
>
>`y` (required): The y-coordinate of the arrow's head.
>  - *Acceptable*: Any number.
>  - By default, all arrows tails are placed at y = 0.
>
>`time` (required): The time at which the arrow's head is located.
>  - *Acceptable*: Any number in the range of time periods included in `circle.json`.

</br>

Support for missing time periods has not been tested. 
  For *each* arrow identified in `arrows.json`, It is safest to provide `x` and `y` coordinates for *all* time periods included in `circle.json`. 

Prototype of valid format:

```
[
  {
    "name": "FACTOR 1",
    "x": 6.4079211884,
    "y": 13.0098593574,
    "time": 1998
  },
  {
    "name": "FACTOR 1",
    "x": 6.4444474746,
    "y": 13.0361878325,
    "time": 1999
  },
  {
    "name": "FACTOR 1",
    "x": 6.4658528654,
    "y": 13.0025843621,
    "time": 2000
  }
  ]
  ```


For a full example of the data format, see `src/data/arrows_TEMPLATE_DO_NOT_ERASE.json` in this repository.
  - This is reference template that should *not* be erased. 
  You should copy it, rename it to `arrows.json`, and experiment editing the latter with your own data (you can always revert to the template if you break the data format and want a fresh start).

</p>
</details>

> *Note:* In accordance with `json` formatting rules, all keys and all string values must be enclosed in *double* quotes, e.g., `"name"` or `"1ST SOURCE CORP"`. 

## Install the app

### Netlify

- Existing turnkey deployement synced with Github repository

  - The app has already been deployed to a Netlify environment that is synced with the
github repository https://github.com/EvoMapViz/EvoMapJS.
  - The deployment settings can be accessed at https://app.netlify.com/sites/lustrous-pixie-414f67/overview (login through Github with EvoMapViz account).
  - The deployed app can be accessed at https://lustrous-pixie-414f67.netlify.app/.

- Redeploying the app from scratch on Netlify from Github repository

  - Copy https://github.com/EvoMapViz/EvoMapJS to a separate Github repository of your own.
  - Create a Netlify account and link it to your Github account.
  - Create a new site on Netlify and link it to your cloned version of https://github.com/EvoMapViz/EvoMapJS.
  - In your Netlify `Sites settings/Build setting`, set the build command to `Build command CI=false npm run build` (and the publish directory to `build` if that is not already the default).
  - In your Netlify site's `Sites settings/Environment variables`, add a variable with key `NPM_FLAGS` and value `--legacy-peer-deps`.

### Local

- Clone the github repo.
- Open the terminal and navigate inside the terminal to its local repository (`cd local_path_of_githb_repo`).
- Run `npm i` (installs `Node.js` module dependencies for `React`).
- Run `npm start` (starts the local server environment for the app).
- The app should open automatically in your default browser. 
If it does not, open a browser and navigate to http://localhost:3000/. 

## Updating process for circle.json, metadata.json, and arrows.json

### Netlify

- Existing turnkey deployement synced with Github repository.

  - Clone the https://github.com/EvoMapViz/EvoMapJS.
  - Edit `circle.json`, `metadata.json`, or `arrows.json` locally in the `src/data` folder.
  - Commit your changes using `git` and push them to the Github repository.
  - The https://lustrous-pixie-414f67.netlify.app/ app should automatically update on Netlify (pending about a minute for the build process to complete).

- App redeployed from scratch on Netlify from Github repository.

  - Clone your github copy of the https://github.com/EvoMapViz/EvoMapJS repo.
  - Edit `circle.json`, `metadata.json`, or `arrows.json` locally in the `src/data` folder.
  - Commit your changes using `git` and push them to the Github repository.
  - The Netlify app you synced with your personal copy of the repo should automatically update on Netlify (pending about a minute for the build process to complete).

### Local

- Run `npm start` (starts the local server environment for the app).
- Edit `circle.json`, `metadata.json`, or `arrows.json` locally in the `src/data` folder.
- After you save your updates locally, the local deployment of your app at http://localhost:3000/ should automatically update in your browser.



