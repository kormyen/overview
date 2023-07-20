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

    this.updateGregorian = function(date, lat, long)
    {

        date.setHours(12) // ensure SunCalc identifies correct day
        let times = SunCalc.getTimes(date, lat, long);
        
        // times.goldenHour	                    evening golden hour starts
        this.result.Set1GoldenHour =            times.goldenHour;

        // times.sunsetStart	                sunset starts (bottom edge of the sun touches the horizon)
        this.result.Set2Sunset =                times.sunsetStart;

        // times.sunset	                        sunset (sun disappears below the horizon, evening civil twilight starts)
        this.result.Set3TwilightCivil =         times.sunset;

        // times.dusk	                        dusk (evening nautical twilight starts)
        this.result.Set4TwilightNautical =      times.dusk;

        // times.nauticalDusk	                nautical dusk (evening astronomical twilight starts)
        this.result.Set5TwilightAstro =         times.nauticalDusk;

        // times.night	                        night starts (dark enough for astronomical observations)
        this.result.Set6Night =                 times.night;

        // times.nadir	                        nadir (darkest moment of the night, sun is in the lowest position)
        this.result.Set7SolarNadir =            times.nadir;


        // times.nightEnd	                    night ends (morning astronomical twilight starts)
        this.result.Rise1TwilightAstro =        times.nightEnd;

        // times.nauticalDawn	                nautical dawn (morning nautical twilight starts)
        this.result.Rise2TwilightNautical =     times.nauticalDawn;

        // times.dawn	                        dawn (morning nautical twilight ends, morning civil twilight starts)
        this.result.Rise3TwilightCivil =        times.dawn;

        // times.sunrise	                    sunrise (top edge of the sun appears on the horizon)
        this.result.Rise4Sunrise =              times.sunrise;
        
        // times.sunriseEnd	                    sunrise ends (bottom edge of the sun touches the horizon)
        this.result.Rise5GoldenHour =           times.sunriseEnd;
        
        // times.goldenHourEnd	                morning golden hour (soft light, best time for photography) ends
        this.result.Rise6Day =                  times.goldenHourEnd;

        // times.solarNoon	                    solar noon (sun is in the highest position)
        this.result.Rise7SolarNoon =            times.solarNoon;
    }
}