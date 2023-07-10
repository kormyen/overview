"use strict";

// DIY library for moon phase calculations from a given date.
function OverviewMoon()
{
  this.currentJulianDate = null;
  this.currentLuationPercentage = null;
  this.currentMoonIlluminationPercentage = null;
  this.currentMoonPhase = null;

  // Synodic month in days: 29.530588853 + 0.000000002162 × Y (Y = Years since J2000).
  const SYNODIC_MONTH_BASE = 29.530588853; // Length of a Synodic month in solar days (J2000 epoch)
  const SYNODIC_MONTH_OFFSET = 0.000000002162; // Yearly (J2000 epoch) offset to synodic month due to the Moon's drag
  const SYNODIC_JD_FULL_MOON_REF = 2451550.1; // Known precise full moon close to J2000.0. Equal to UTC 6th January 2000 at 14:24.
  // J2000 is the currently used standard equinox and epoch. J = "Julian epoch". 
  // J2000.0 is precisely Julian date 2451545.0 aka January 1, 2000, 11:58:55.816 UTC or 1 January 2000 12:00 TT (Terrestrial Time). 
  // Source: https://en.wikipedia.org/wiki/Equinox_(celestial_coordinates) and https://en.wikipedia.org/wiki/Epoch_(astronomy)#Julian_years_and_J2000 
  const J2000 = new Date(2000, 0, 1, 11, 58, 55, 816); 
  const DAYS_IN_JULIAN_YEAR = 365.25;
  const MS_IN_A_DAY = 86400000; // = 1000 * 60 * 60 * 24;

  this.updateGregorian = function(dateGregorian)
  {
    this.currentJulianDate = this.calcDateFromGregorianToJulian(dateGregorian);
    this.currentLuationPercentage = this.calcLunationPercentage(dateGregorian);
    this.currentMoonIlluminationPercentage = this.calcLunarIlluminationPercentage(dateGregorian);
    this.currentMoonPhase = this.calcLunarPhase(dateGregorian);
  }

  // MOON (LUNATION / SYNODIC MONTH)
  this.calcDateFromGregorianToJulian = function(dateGiven)
  {
    // The Julian date (JD) of any instant is the Julian day number plus the fraction of a day since the preceding noon in Universal Time.
    const time = dateGiven.getTime();
    const tzoffset = dateGiven.getTimezoneOffset()
    const result = (time / 86400000) - (tzoffset / 1440) + 2440587.5;
    return result;
    // Check above via https://weather.geek.nz/julian_time.php
  }

  this.calcSynodicMonthInDays = function(dateGiven)
  {
    // Synodic month in days: 29.530588853 + 0.000000002162 × Y (Y = Years since J2000).
    const secondsSinceJ2000 = Math.abs(dateGiven - J2000) / 1000;
    const daysSinceJ2000 = secondsSinceJ2000 / MS_IN_A_DAY; 
    const julianYearsSinceJ2000 = daysSinceJ2000 / DAYS_IN_JULIAN_YEAR;
    const currentSynodicMonthTotalDays = SYNODIC_MONTH_BASE + (SYNODIC_MONTH_OFFSET * julianYearsSinceJ2000);
    return currentSynodicMonthTotalDays;
  }

  this.normalize = function(value)
  {
    let result = value - Math.floor(value);
    if (result < 0)
    {
      result = result + 1
    }
    return result;
  }

  this.calcLunarAgeInDays = function(dateGiven)
  {
    return this.calcLunationPercentage(dateGiven) * this.calcSynodicMonthInDays(dateGiven);
  }

  this.calcLunarPhase = function(dateGiven)
  {
    const age = this.calcLunarAgeInDays(dateGiven);
    if (age < 1.84566)
      return "New";
    else if (age < 5.53699)
      return "Waxing Crescent";
    else if (age < 9.22831)
      return "First Quarter";
    else if (age < 12.91963)
      return "Waxing Gibbous";
    else if (age < 16.61096)
      return "Full";
    else if (age < 20.30228)
      return "Waning Gibbous";
    else if (age < 23.99361)
      return "Last Quarter";
    else if (age < 27.68493)
      return "Waning Crescent";
    return "New";
  }

  this.calcLunationPercentage = function(dateGregorian)
  {
    // Synodic month is the count of days between full moon to full moon.
    
    // OPTION 1: Standard calculation https://jasonsturges.medium.com/moons-lunar-phase-in-javascript-a5219acbfe6e 
    // Julian dates are used for for synodic calculations.
    // The Julian day number (JDN) is the integer assigned to a whole solar day in the Julian day count starting from 
    // noon Universal Time, with Julian day number 0 assigned to the day starting at noon on Monday, January 1, 4713 BC.
    // January 1, 4713 BC is chosen as it is a date which three multi-year cycles started, which are: 
    // - Indiction cycle: 15 year Roman tax cycle.
    // - Solar cycle: 28 year cycle in Julian calendar. There are 7 possible days to start a leap year, making a 28-year sequence.
    // - Metronic cycle or enneadecaeteris is a period of almost exactly 19 years after which the lunar phases recur at the same time of the year.

    // Moon phase is calcualted from UTC so we need to remove the user's timezone offset to get UTC time.
    let userTimezoneOffset = dateGregorian.getTimezoneOffset() * 60000;
    let dateNoTimezone = new Date(dateGregorian.getTime() + userTimezoneOffset);
    // var dateGiven_utc = new Date(Date.UTC(dateGregorian.getUTCFullYear(), dateGregorian.getUTCMonth(), dateGregorian.getUTCDate(), dateGregorian.getUTCHours(), dateGregorian.getUTCMinutes(), dateGregorian.getUTCSeconds()));

    const currentSynodicMonthPercent = this.normalize((this.calcDateFromGregorianToJulian(dateNoTimezone) - SYNODIC_JD_FULL_MOON_REF) / this.calcSynodicMonthInDays(dateNoTimezone));

    // OPTION 2: Moon phase via trigonometry http://witchy.co/trig/ 
    // Simplier for moon phase, but not useful for caclulating lunar eclipses.
    return currentSynodicMonthPercent;
  }

  this.calcLunarIlluminationPercentage = function(dateGiven)
  {
    let lunationPerc = this.calcLunationPercentage(dateGiven);
    let illuminationPerc = this.normalize(lunationPerc + 0.5);
    return illuminationPerc;
  }
}