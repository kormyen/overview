# Overview

A digital [tellurion](https://en.wikipedia.org/wiki/Tellurion).

<img src='https://raw.githubusercontent.com/kormyen/overview/master/2023-07-26_17-50.jpg'/>

[**Live web version here**](https://overview-kormyen.vercel.app/)

Drag left and right to time travel.

## Abstract

The goal of this project is to simply, visually and intuitively show cestial movements and how they affect our day to day experience on Earth.

> "My desire is to bring astronomical events and objects down into your personal, lived-in space." - [James Turrell](https://www.youtube.com/watch?v=g0g6JFYRKxQ)

Every time you check your watch; you see a reminder that we are space pirate ghosts piloting bones on a living rock spinning around nuclear explosions flying through the universe at 200 km per second.

This is a 24h clock face design that more literally references the origins of how we beings on planets measure time - the rotation of our home planet producing periods of light and dark in direct view and shade of our home star.

## Docs

- [Do](DO.md)
- [Ideas](IDEAS.md)

## Reference

- [Astronomy lib comparison](https://tealdulcet.com/weather/)
- [Bartosz Ciechanowski: Moon (interactive article)](https://ciechanow.ski/moon/)

## Inspiration

- [daylight.website by Alex Burner](https://daylight.website/)
- [Neuoire's Arvelie](https://wiki.xxiivv.com/site/time.html)
- [James Turrell's Roden Crater](https://www.youtube.com/watch?v=g0g6JFYRKxQ)

> The overview effect is a cognitive shift reported by some astronauts while viewing the Earth from space with... unexpected and even overwhelming emotion, and an increased sense of connection to other people and the Earth as a whole. The effect can cause changes in the observer’s self concept and value system, and can be transformative.
> Source: [Wikipedia: Overview Effect](https://en.wikipedia.org/wiki/Overview_effect)

## Changelog

#### 3.0 &mdash; Tide 2026-01-23

- Add: new design.
- Add: tide.
- Add: settings (press ESC).

#### 2.1 &mdash; Fixes 2023-07-28

- Fix: visual glitch in middle of moon due to scaling half, seen when moon halves align horizontally or vertically to screen - fixed by over drawing arc on specfic layers.
- Fix: distracting glitchy dithery look on moon when close to zero/new moon - fixed by introduing epsilon threshold.

#### 2.0 &mdash; Intent 2023-07-26

<img src='https://raw.githubusercontent.com/kormyen/overview/master/2023-07-26_17-50.jpg'/>

Originally intended basic display achieved.

- Add: improved moon visual showing moon phase.
- Add: day of week display on sun graduations via saturday and sunday being lighter color.
- Add: sunlight markers like https://daylight.website/ with https://github.com/mourner/suncalc.
- Add: geolocation access for sunlight calculations.
- Fix: first day of month extended line section on sat/sun is not highlighted for weekend day - fixed calc sat sun for month line.
- Fix: line thickness should not appear thicker on smaller resolutions - fixed by scaling line thickness to intended screen size.

#### 1.1 &mdash; Fixes 2023-07-08

- Add: mobile input handling.
- Add: responsive width/height handling.
- Fix: on a high dpi laptop's low dpi external monitor the high dpi scale was used.

#### 1.0 &mdash; MVP 2023-07-06 

<img src='https://raw.githubusercontent.com/kormyen/overview/master/2023-07-06_00-42.jpg'/>

Core functionality, basic line display.

- Add: basic functionality with simple display features;
- Add: square day time marker.
- Add: circle earth with day time graduation lines.
- Add: circle moon with age displayed by orbit position.
- Add: graduation lines as sun light for date.