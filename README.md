# Overview

A digital [tellurion](https://en.wikipedia.org/wiki/Tellurion).

<img src='https://raw.githubusercontent.com/kormyen/overview/master/2023-07-26_17-50.jpg'/>

[**Live web version here**](https://overview-kormyen.vercel.app/)

Drag left and right to time travel.

## Abstract

Every time you check your watch; you see a reminder that we are space pirates on a living rock flying through the universe at 200 km per second.

This is a 24h clock face design that more literally references the origins of how we beings on planets measure time - the rotation of our home planet producing periods of light and dark in direct view and shade of our home star.

> The overview effect is a cognitive shift reported by some astronauts while viewing the Earth from space with... unexpected and even overwhelming emotion, and an increased sense of connection to other people and the Earth as a whole. The effect can cause changes in the observer’s self concept and value system, and can be transformative.
>
> Source: [Wikipedia: Overview Effect](https://en.wikipedia.org/wiki/Overview_effect)

The goal of this project is to simply, visually and intuitively show cestial movements and how they affect our day to day experience on Earth.

## Explainer

The tellurion is a top down flat abstract cross section view of Earth (central circle) and a view of the moon representing it's current phase.

#### Month of year

The white light on Earth shows the direction of the Sun's light. This is used to tell the day of year and day of month. It starts at the top (12 on a 12 hour clock) and goes clockwise. 

The 12 graduation lines on the outer most ring represent the first day of each month. 

#### Day of Month

The graduation lines for the current month display each day. 

Long graduation lines show 10s, medium lines show 5s. 

The red line is today's date. From this and the above you can figure out the date.

#### Day of Week

Lighter lines show Saturdays and Sundays. From today's red line and the closest weekends you can figure out what the day of week is. 

#### Sunlight hours

The light on Earth shows the sunlight hours, the sunrise and sunset times. The thinnest line is the sunset and sunrise times. The ligher hour is golden hour. 

The first lightest dark layer outside of sunset is 'civil twilight'.
> The Sun is just below the horizon, so there is generally enough natural light to carry out most outdoor activities.

The second layer is nautical twilight.
> Both the horizon and the brighter stars are usually visible at this time, making it possible to navigate at sea.

The third layer is astronomical twilight.
> Most stars and other celestial objects can be seen during this phase.

The dark section is night.

#### Time of day

The triangle is your position on Earth which rotates to show the time mimicing Earth's rotation through a day.

The position of the triangle as it rotates tells you the time of the day in reference to the direction of the sun light. Directly pointing toward the sun would be noon.

#### Moon phase

The changing shape orbiting Earth is the moon. The position of it as it orbits Earth (and it's corresponding shape) tells you the current moon phase. The white light on the moon fills as it approaches the opposite side of the sun - as from Earth we see this as a "full moon".

## Docs

- [Do](DO.md)
- [Ideas](IDEAS.md)

## Reference

- [Astronomy lib comparison](https://tealdulcet.com/weather/)

## Changelog

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