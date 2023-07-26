# Overview

A digital [tellurion](https://en.wikipedia.org/wiki/Tellurion).

<img src='https://raw.githubusercontent.com/kormyen/overview/master/2023-07-21.jpg'/>

[**Live web version here**](https://overview-kormyen.vercel.app/)

Drag left and right to time travel.

## Description

Every time you check your watch; you see a reminder that we are space pirates on a living rock flying through the universe at 200 km per second.

This is a 24h clock face design that more literally references the origins of how we beings on planets measure time - the rotation of our home planet producing periods of light and dark in direct view and shade of our home star.

> The overview effect is a cognitive shift reported by some astronauts while viewing the Earth from space with... unexpected and even overwhelming emotion, and an increased sense of connection to other people and the Earth as a whole. The effect can cause changes in the observer’s self concept and value system, and can be transformative.
>
> Source: [Wikipedia: Overview Effect](https://en.wikipedia.org/wiki/Overview_effect)

## Docs

- [To do](TODO.md)
- [Ideas](IDEAS.md)
- [Astronomy js lib comparison](https://tealdulcet.com/weather/)

## Changelog

#### 2.0 &mdash; 2023-07-26

- Add improved moon visual showing moon phase.
- Add day of week display on sun graduations via saturday and sunday being lighter color.
- Add sunlight markers like https://daylight.website/ with https://github.com/mourner/suncalc.
- Add geolocation access for sunlight calculations.

#### 1.1 &mdash; 2023-07-08

- Add mobile input handling.
- Add responsive width/height handling.
- Fix bug: on a high dpi laptop's low dpi external monitor the high dpi scale was used.

#### 1.0 &mdash; 2023-07-06

<img src='https://raw.githubusercontent.com/kormyen/overview/master/2023-07-06.jpg'/>

Core functionality, basic line display.

- Add basic functionality with simple display features;
- Add square day time marker.
- Add circle earth with day time graduation lines.
- Add circle moon with age displayed by orbit position.
- Add graduation lines as sun light for date.