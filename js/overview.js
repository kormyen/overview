"use strict";

function Overview()
{
  this.timeData = null;
  this.moonData = null;

  this.canvas = document.createElement("canvas"); 
  this.canvas.id = "overview";
  
  this.size = null;
  this.sizeReference = 1024;
  this.settings = { targetFps: 60 }
  this.location = { latitude: -36.85, longditude: 174.76 } // Auckland, New Zealand.

  const COLOR_PRIMARY = '#FFFFFF';
  const COLOR_SECONDARY = '#666666';
  const COLOR_ASCENT = '#EE4B2B';
  const COLOR_BACKGROUND = '#1E1E1E';

  const LINE_WIDTH = 4;
  const LINE_LENGTH_TINY = 0.01;
  const LINE_LENGTH_SMALL = 0.015;
  const LINE_LENGTH_MEDIUM = 0.02;
  const LINE_LENGTH_LARGE = 0.03;

  const SUN_SIZE = 0.46;
  const EARTH_SIZE = 0.25;
  const MOON_SIZE = EARTH_SIZE * 0.2727986187; // = Moon diameter 3476km / Earth diameter 12,742km

  const MOON_DISTANCE = 0.35;

  this.drawShared = new DrawShared();
  this.drawSun = new DrawSun(this.drawShared, SUN_SIZE, LINE_WIDTH, LINE_LENGTH_LARGE, LINE_LENGTH_MEDIUM, LINE_LENGTH_TINY, COLOR_ASCENT, COLOR_SECONDARY, this.drawShared.hexMix(COLOR_PRIMARY, COLOR_SECONDARY, 0.5));
  this.drawEarth = new DrawEarth(this.drawShared, EARTH_SIZE, LINE_WIDTH, COLOR_PRIMARY, COLOR_SECONDARY, COLOR_BACKGROUND, COLOR_ASCENT, LINE_LENGTH_LARGE, LINE_LENGTH_SMALL, LINE_LENGTH_TINY);
  this.drawMoon = new DrawMoon(this.drawShared, COLOR_PRIMARY, COLOR_SECONDARY, COLOR_BACKGROUND);

  this.setData = function(timeData, moonData, sunData)
  {
    this.timeData = timeData;
    this.moonData = moonData;
    this.sunData = sunData;

    this.update();
  }

  this.setLocation = function(lat, long)
  {
    this.location.latitude = lat;
    this.location.longditude = long;
  }

  this.display = function()
  {
    document.body.appendChild(this.canvas);
  }

  this.startUpdateLoop = function()
  {
    this.update();
    setInterval(() => { this.update(); }, 1000 / this.settings.targetFps);
  }

  this.getContext = function()
  {
    return this.canvas.getContext('2d');
  }

  this.changeValue = function(value)
  {
    this.timeData.changeValue(value);
  }

  this.clearCanvas = function()
  {
    this.getContext().clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  this.drawTellurion = function()
  {
    // Shared variables
    let context = this.getContext();
    let cx = this.size.width / 2; // center position horizontal
    let cy = this.size.height / 2; // center position vertical
    let degreesEarthRotated = this.calcEarthDegreeOffsetShared();

    // Eath (24h time of day)
    this.drawEarth.display(context, cx, cy, this.timeData, degreesEarthRotated, this.sunData.result);

    // Moon (synodic month)
    let moonPos = this.drawShared.calcOrbitLocation(cx, cy, degreesEarthRotated -(360 * this.moonData.currentLuationPercentage), MOON_DISTANCE);
    this.drawMoon.display(context, moonPos.x, moonPos.y, MOON_SIZE * this.size.height, this.moonData.currentLuationPercentage, degreesEarthRotated);
    
    // Sun (date of month and month in year)
    this.drawSun.display(context, cx, cy, this.timeData);
  }

  // This calculates a degree offset representing the rotation of the 24h earth due to orbiting the sun (year date display).
  this.calcEarthDegreeOffsetShared = function()
  {
    let degreesPerDay = 360 / this.timeData.currentYearsTotalDays;
    let degreesDayCurrent = this.timeData.currentDayPercentage * degreesPerDay;
    let degreesIntoYearCurrent = degreesPerDay * this.timeData.currentDaysIntoYear;

    let result = 0;
    result -= degreesIntoYearCurrent; // offset for days into year.
    result -= degreesDayCurrent; // offset for time-of-day.
    result += degreesPerDay; // offset to align to date graduations.

    return result;
  }

  this.update = function()
  {
    if (this.timeData != null && this.moonData != null)
    {
      this.timeData.update();
      this.moonData.updateGregorian(this.timeData.currentDate);
      this.sunData.updateGregorian(this.timeData.currentDate, this.location.latitude, this.location.longditude);

      this.setCanvasSize();
      this.clearCanvas();
      this.drawTellurion();
    }
    else
    {
      console.error('Missing data');
    }
  }

  this.setCanvasSize = function()
  {
    let curSize = 0;
    // Set responsive (fit to screen) 1:1 resizing.
    if (window.innerHeight >= window.innerWidth)
    {
      curSize = window.innerWidth;
      this.size = { width:curSize, height:curSize, ratio:window.devicePixelRatio };
    } 
    else 
    {
      curSize = window.innerHeight;
      this.size = { width:curSize, height:curSize, ratio:window.devicePixelRatio };
    }


    // Set high DPI canvas, if high devicePixelRatio.
    this.canvas.width = this.size.width * this.size.ratio;
    this.canvas.height = this.size.height * this.size.ratio;

    // Set html canvas size as expected.
    this.canvas.style.width = this.size.width + "px";
    this.canvas.style.height = this.size.height + "px";

    // Set internal canvas scale as expected.
    this.getContext().scale(window.devicePixelRatio, window.devicePixelRatio);

    this.drawShared.setSize(this.size);
    this.drawEarth.setSize(this.size);

    // Set scale adjusted line width to fix the line appearing to be thicker on smaller resolutions
    let curLineWidth = curSize/this.sizeReference * LINE_WIDTH;
    this.drawEarth.setLineWidth(curLineWidth);
    this.drawSun.setLineWidth(curLineWidth);
  }

  window.onresize = function(event)
  {
    overview.update();
  }
}