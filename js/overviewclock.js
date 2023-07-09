"use strict";

function Overview()
{
  this.timeData = null;

  this.canvas = document.createElement("canvas"); 
  this.canvas.id = "overview";
  
  this.size = null;
  this.settings = { targetFps: 60 }

  const COLOR_PRIMARY = '#FFFFFF';
  const COLOR_SECONDARY = '#666666';
  const COLOR_ASCENT = '#EE4B2B';
  const COLOR_BACKGROUND = '#1E1E1E';
  // const COLOR_BACKGROUND = '#000000';

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
  this.drawSun = new DrawSun(this.drawShared, SUN_SIZE, LINE_WIDTH, LINE_LENGTH_LARGE, LINE_LENGTH_MEDIUM, LINE_LENGTH_TINY, COLOR_PRIMARY, COLOR_SECONDARY);
  this.drawEarth = new DrawEarth(this.drawShared, EARTH_SIZE, LINE_WIDTH, COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ASCENT, LINE_LENGTH_LARGE, LINE_LENGTH_SMALL, LINE_LENGTH_TINY);
  this.drawMoon = new DrawMoon(COLOR_PRIMARY, COLOR_SECONDARY, COLOR_BACKGROUND);

  this.display = function(timeData)
  {
    this.timeData = timeData;
    this.update();
  }

  this.getContext = function()
  {
    return this.canvas.getContext('2d');
  }

  this.startUpdate = function()
  {
    document.body.appendChild(this.canvas);
    setInterval(() => { this.update(); }, 1000 / this.settings.targetFps);
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
    this.drawEarth.display(context, cx, cy, this.timeData, degreesEarthRotated);

    // Moon (synodic month)
    let moonPos = this.drawShared.calcOrbitLocation(cx, cy, degreesEarthRotated -(360 * this.timeData.currentLuationPercentage), MOON_DISTANCE);
    this.drawMoon.display(context, moonPos.x, moonPos.y, MOON_SIZE * this.size.height, this.timeData.currentLuationPercentage, degreesEarthRotated);
    
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
    if (this.timeData != null)
    {
      this.timeData.update();
      this.setCanvasSize();
      this.clearCanvas();
      this.drawTellurion();
    }
  }

  this.setCanvasSize = function()
  {
    // Set responsive (fit to screen) 1:1 resizing.
    if (window.innerHeight >= window.innerWidth)
    {
      this.size = { width:window.innerWidth, height:window.innerWidth, ratio:window.devicePixelRatio };
    } 
    else 
    {
      this.size = { width:window.innerHeight, height:window.innerHeight, ratio:window.devicePixelRatio };
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
  }

  window.onresize = function(event)
  {
    overview.update();
  }
}