[Github Pages Demo](https://ranylm.github.io/MOD1-Dungeon-Crawler/)

#### Controls
- up = w
- down = s
- left = a
- right = d
- inventory = Click to Move/Use

#### Summary
This project implements a dungeon crawler with randomized level generation with combat mechanics and item based progression. Your goal is to eliminate all enemies on the floor to score points.

#### Build Instructions
Run in project root:
```
git clone https://github.com/ranylm/MOD1-Dungeon-Crawler.git
npm install typescript
tsc
```

#### Details
Project is seperated into 3 pieces. 
A map class for handling creation and rendering of the map and all entites.
A management class for creating and control entities as well as additional game logic such as collision, pathfinding and tracking items. 
A UI class for handling all user interaction and DOM elements and interactivity.

#### Built with:
- Typescript/Javascript
- HTML/CSS
- Canvas
- https://codepen.io/DoomGoober/pen/vYOvPJg For canvas resizing code.

#### To Be Fixed
- Resolve AI to avoid circular tail chasing.
