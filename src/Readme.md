# Code documentation

# Overview

## States

- **`data` state**: 
  - Ideally constant. 
  - Attached to visualization elements through `d3.select().data()`: serves to store constant "micro-states" (*not* stored as React states or Jotai atoms) that determine how the elements (in particular, circles) are rendered.
-  **Attributes of SVG/HTML elements**: Used to store dynamic circle-specific "micro-states" (*not* stored as React states or Jotai atoms) that determine how the circle are rendered. 
    - Time-slider attributes: 
      - `fill`, `cx`,  `cy`, `r`.
      - Updated when time slider changes.
      - Afect animation performance: Keep numbers of these attributes at a minimum.
    - Other attributes: 
      - Basic: `opacity`, `display`, `style`.
      - Custom: `data-highlighted`, among others.
      - Updated when user interacts with the visualization other than through time-slider.
      - More "static", low-load interactions. Little direct effect on performance (still makes each element "heavier").


# Glossary

## Jotai atoms

### Data

- `circle_data` (read from `./data/circle_data.json`): data for circles in main visualization.
- `meta_data` (read from `./data/metadata.json`): meta data customizing how variables in circle_data interact with the app.
- `arrow_data` (read from "./data/arrows.json"): optional data for arrows in main visualization.