# TO DO

## Next

- BUG: moon has line render glitch in middle due to split half rendering, seen when moon half aligns horizontal or vertical (overdraw the first arc).
- BUG: moon gets glitchy dithery look when close to zero/new moon (epsilon number).
- Add improved time marker visual (triangle vs semi-circle).
- Add smooth animations on sunlight (get sun times for next or prev days and lerp).

## Future

- Add ocean tide data display.
- Add text info, ideally editable (next/prev; day, full moon, month, year etc).
- Add geolocation settings.

- Add alternate time data wrappers.
-- decimal time.
-- Arvelie time.

- Add alternate moon data wrappers.
-- https://github.com/Fabiz/MeeusJs
-- https://tealdulcet.com/weather/moon.js

- Add alternate sun data wrappers.
-- https://github.com/commenthol/astronomia
-- https://github.com/Fabiz/MeeusJs
-- https://tealdulcet.com/weather/riseset.js
-- https://github.com/Triggertrap/sun-js