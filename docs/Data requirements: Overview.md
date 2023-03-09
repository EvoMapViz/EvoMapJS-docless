# Data requirements: Overview

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


