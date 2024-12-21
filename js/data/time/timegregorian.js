"use strict";

// DIY library for simple time wrapper.
function TimeGregorian(myDate)
{
  // App update data
  this.appStartTime = new Date();
  this.appMsElapsed = null;
  this.appUserChangeValue = 0;

  // Time data
  this.baseDate = myDate;
  this.currentDate = new Date(myDate.getTime());;
  this.currentDaysIntoYear = null;
  this.currentDayPercentage = null;
  this.currentJulianDate = null;
  this.currentMonth = null;
  this.currentYear = null;
  this.currentYearsTotalDays = null;
  this.currentYearsDaysPerMonth = null;
  
  const MS_IN_A_DAY = 86400000; // = 1000 * 60 * 60 * 24;
  
  this.calcDaysInGregorianYear = function(year)
  {
    // In the Gregorian calendar three criteria must be taken into account to identify leap years: 
    // The year can be evenly divided by 4; 
    // If the year can be evenly divided by 100, it is NOT a leap year, unless; 
    // The year is also evenly divisible by 400. 
    // Then it is a leap year.
    return ((year % 4 === 0 && year % 100 > 0) || year %400 == 0) ? 366 : 365;
  }

  this.calccurrentYearsDaysPerMonthInGregorianYear = function(givenYear)
  {
    let result = [];
    for (let i = 1; i <= 12; i++)
    {
      result.push(new Date(givenYear, i, 0).getDate());
    }
    return result;
  }

  // source: https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
  this.calcCurrentDaysIntoYear = function(date)
  {
    let result = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
    return result;
  }

  this.update = function()
  {
    let currentTime = new Date();
    this.appMsElapsed = (currentTime - this.appStartTime);

    let currentUserInput = (this.appUserChangeValue*60);
    this.currentDate.setTime(this.baseDate.getTime() + currentUserInput + this.appMsElapsed);
    this.updateValues();
  }

  this.changeValue = function(value)
  {
    this.appUserChangeValue += value;
  }

  this.calcCurrentDayPercentage = function(dateGiven)
  {
    // Copy the date to compare start of day with given time
    let startOfDay = new Date(dateGiven.valueOf());
    
    // Set copied date to start of the same day
    startOfDay.setHours(0);
    startOfDay.setMinutes(0);
    startOfDay.setSeconds(0);
    startOfDay.setMilliseconds(0);

    // Subtract the two days to find the time since beginning of the day,
    // divide by number of ms in day to get percentage
    return ( dateGiven - startOfDay ) / MS_IN_A_DAY;
  }

  this.updateValues = function()
  {
    // Current day stats
    this.currentDaysIntoYear = this.calcCurrentDaysIntoYear(this.currentDate);
    this.currentDayPercentage = this.calcCurrentDayPercentage(this.currentDate);

    // Current month stats
    this.currentMonth = this.currentDate.getMonth();

    // Current year stats
    this.currentYear = this.currentDate.getFullYear();
    this.currentYearsTotalDays = this.calcDaysInGregorianYear(this.currentDate.getFullYear());
    this.currentYearsDaysPerMonth = this.calccurrentYearsDaysPerMonthInGregorianYear(this.currentDate.getFullYear());
  }

  this.updateValues();
}