"use strict";

// Wrapper around https://github.com/mourner/suncalc lib
function SunCalcWrapper()
{
    this.result = {};
    
    this.result.Rise1TwilightAstro = null;
    this.result.Rise2TwilightNautical = null;
    this.result.Rise3TwilightCivil = null;
    this.result.Rise4Sunrise = null;
    this.result.Rise5GoldenHour = null;
    this.result.Rise6Day = null;
    this.result.Rise7SolarNoon = null;

    this.result.Set1GoldenHour = null;
    this.result.Set2Sunset = null;
    this.result.Set3TwilightCivil = null;
    this.result.Set4TwilightNautical = null;
    this.result.Set5TwilightAstro = null;
    this.result.Set6Night = null;
    this.result.Set7SolarNadir = null;

    this.result.set1Perc = null;
    this.result.set2Perc = null;
    this.result.set3Perc = null;
    this.result.set4Perc = null;
    this.result.set5Perc = null;
    this.result.set6Perc = null;

    this.result.rise1Perc = null;
    this.result.rise2Perc = null;
    this.result.rise3Perc = null;
    this.result.rise4Perc = null;
    this.result.rise5Perc = null;
    this.result.rise6Perc = null;

    const TOTALSECONDSINDAY = 60*60*24;

    this.getSecondsThroughDay = function(givenDate)
    {
        return givenDate.getHours() * 3600 + givenDate.getMinutes() * 60 + givenDate.getSeconds();
    }

    this.updateGregorian = function(date, lat, long)
    {
        date.setHours(12) // ensure SunCalc identifies correct day
        let times = SunCalc.getTimes(date, lat, long);
        
        // times.goldenHour	                    evening golden hour starts
        this.result.Set1GoldenHour =            times.goldenHour;
        this.result.set1Perc =                  this.getSecondsThroughDay(times.goldenHour) / TOTALSECONDSINDAY;

        // times.sunsetStart	                sunset starts (bottom edge of the sun touches the horizon)
        this.result.Set2Sunset =                times.sunsetStart;
        this.result.set2Perc =                  this.getSecondsThroughDay(times.sunsetStart) / TOTALSECONDSINDAY;

        // times.sunset	                        sunset (sun disappears below the horizon, evening civil twilight starts)
        this.result.Set3TwilightCivil =         times.sunset;
        this.result.set3Perc =                  this.getSecondsThroughDay(times.sunset) / TOTALSECONDSINDAY;

        // times.dusk	                        dusk (evening nautical twilight starts)
        this.result.Set4TwilightNautical =      times.dusk;
        this.result.set4Perc =                  this.getSecondsThroughDay(times.dusk) / TOTALSECONDSINDAY;

        // times.nauticalDusk	                nautical dusk (evening astronomical twilight starts)
        this.result.Set5TwilightAstro =         times.nauticalDusk;
        this.result.set5Perc =                  this.getSecondsThroughDay(times.nauticalDusk) / TOTALSECONDSINDAY;

        // times.night	                        night starts (dark enough for astronomical observations)
        this.result.Set6Night =                 times.night;
        this.result.set6Perc =                  this.getSecondsThroughDay(times.night) / TOTALSECONDSINDAY;

        // times.nadir	                        nadir (darkest moment of the night, sun is in the lowest position)
        this.result.Set7SolarNadir =            times.nadir;
        this.set7Perc =                         this.getSecondsThroughDay(times.nadir) / TOTALSECONDSINDAY;


        // times.nightEnd	                    night ends (morning astronomical twilight starts)
        this.result.Rise1TwilightAstro =        times.nightEnd;
        this.result.rise1Perc =                 this.getSecondsThroughDay(times.nightEnd) / TOTALSECONDSINDAY;

        // times.nauticalDawn	                nautical dawn (morning nautical twilight starts)
        this.result.Rise2TwilightNautical =     times.nauticalDawn;
        this.result.rise2Perc =                 this.getSecondsThroughDay(times.nauticalDawn) / TOTALSECONDSINDAY;

        // times.dawn	                        dawn (morning nautical twilight ends, morning civil twilight starts)
        this.result.Rise3TwilightCivil =        times.dawn;
        this.result.rise3Perc =                 this.getSecondsThroughDay(times.dawn) / TOTALSECONDSINDAY;

        // times.sunrise	                    sunrise (top edge of the sun appears on the horizon)
        this.result.Rise4Sunrise =              times.sunrise;
        this.result.rise4Perc =                 this.getSecondsThroughDay(times.sunrise) / TOTALSECONDSINDAY;
        
        // times.sunriseEnd	                    sunrise ends (bottom edge of the sun touches the horizon)
        this.result.Rise5GoldenHour =           times.sunriseEnd;
        this.result.rise5Perc =                 this.getSecondsThroughDay(times.sunriseEnd) / TOTALSECONDSINDAY;
        
        // times.goldenHourEnd	                morning golden hour (soft light, best time for photography) ends
        this.result.Rise6Day =                  times.goldenHourEnd;
        this.result.rise6Perc =                 this.getSecondsThroughDay(times.goldenHourEnd) / TOTALSECONDSINDAY;

        // times.solarNoon	                    solar noon (sun is in the highest position)
        this.result.Rise7SolarNoon =            times.solarNoon;
        this.result.rise7Perc =                 this.getSecondsThroughDay(times.solarNoon) / TOTALSECONDSINDAY; 
    }
}