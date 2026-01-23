"use strict";

function Overview()
{
  this.timeData = null;
  this.moonData = null;
  this.sunData = null;
  this.tideData = null;

  this.canvas = document.createElement("canvas"); 
  this.canvas.id = "overview";
  
  this.size = null;

  const SIZE_REFERENCE = 1024;

  const LINE_WIDTH = 2;
  const LINE_LENGTH_TINY = 0.005;
  const LINE_LENGTH_SMALL = 0.0075;
  const LINE_LENGTH_MEDIUM = 0.01;
  const LINE_LENGTH_LARGE = 0.02;

  const IRL_MOON_DIAMETER = 3476; // km
  const IRL_EARTH_DIAMETER = 12742; // km
  const IRL_EARTH_MOON_RATIO = IRL_MOON_DIAMETER / IRL_EARTH_DIAMETER;

  const SUN_SIZE = 0.46;
  const EARTH_SIZE = 0.25;
  const TIDE_SIZE_LOW = 0.35;
  const TIDE_SIZE_HIGH = 0.45;
  const MOON_SIZE = EARTH_SIZE * IRL_EARTH_MOON_RATIO;

  const MOON_DISTANCE = 0.375;

  this.drawShared = new DrawShared();
  this.drawSun = new DrawSun(this.drawShared, SUN_SIZE, LINE_WIDTH, LINE_LENGTH_LARGE, LINE_LENGTH_MEDIUM, LINE_LENGTH_TINY);
  this.drawSunlight = new DrawSunlight(this.drawShared);
  this.drawEarth = new DrawEarth(this.drawShared, this.drawSunlight, EARTH_SIZE, LINE_WIDTH, LINE_LENGTH_LARGE, LINE_LENGTH_MEDIUM, LINE_LENGTH_TINY);
  this.drawMoon = new DrawMoon(this.drawShared);
  this.drawTide = new DrawTide(this.drawShared);

  this.setData = function(timeData, moonData, sunData, tideData)
  {
    this.timeData = timeData;
    this.moonData = moonData;
    this.sunData = sunData;
    this.tideData = tideData;

    this.update();
  }

  this.display = function()
  {
    document.body.appendChild(this.canvas);
  }

  this.startUpdateLoop = function()
  {
    this.update();
    setInterval(() => { this.update(); }, 1000 / settings.targetFps);
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
    if (state.mode == globals.MODE_SETTINGS)
    {
      cx = (this.size.width - 400) / 2;
    }
    let cy = this.size.height / 2; // center position vertical
    let degreesEarthRotated = this.calcEarthDegreeOffsetShared();

    if (!settings.earthRotate.value)
    {
      degreesEarthRotated = 0;
    }

    this.timeData.update(); // HACK: Not sure why this is required here, but this.timeData.currentDate seems invalid otherwise for drawTide it was always noon but minutes updated.

    if (settings.tide.value && this.tideData.stateDataReady)
    {
      this.drawTide.display(context, cx, cy, this.timeData, this.tideData.result, TIDE_SIZE_LOW, TIDE_SIZE_HIGH);
    }

    // Eath (24h time of day)
    if (settings.timeOfDay.value)
    {
      this.drawEarth.display(context, cx, cy, this.timeData, degreesEarthRotated, this.sunData.result, settings.colorPrimary, settings.colorSecondary, settings.colorBackground);
    }

    // Moon (synodic month)
    if (settings.moon.value)
    {
      let moonPos = this.drawShared.calcOrbitLocation(cx, cy, degreesEarthRotated -(360 * this.moonData.currentLuationPercentage), MOON_DISTANCE);
      this.drawMoon.display(context, moonPos.x, moonPos.y, MOON_SIZE * this.size.height, this.moonData.currentLuationPercentage, degreesEarthRotated, settings.colorPrimary, settings.colorTertiary, settings.colorTertiary);
    } 
    
    // Sun (date of month and month in year)
    if (settings.year.value)
    {
      this.drawSun.display(context, cx, cy, this.timeData, settings.colorPrimary, settings.colorSecondary, settings.colorTertiary);
    }
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
      this.sunData.updateGregorian(this.timeData.currentDate, settings.latitude.value, settings.longitude.value);

      if (settings.tide.value == true)
      {
        this.tideData.updateTides(settings.latitude.value, settings.longitude.value);
      }

      this.setCanvasSize();
      this.clearCanvas();
      this.drawTellurion();

      if (state.mode == globals.MODE_SETTINGS)
      {
        settings.update();
      }
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
    // if (window.innerHeight >= window.innerWidth)
    // {
    //   curSize = window.innerWidth;
    //   this.size = { width:curSize, height:curSize, ratio:window.devicePixelRatio };
    // } 
    // else 
    // {
    //   curSize = window.innerHeight;
    //   this.size = { width:curSize, height:curSize, ratio:window.devicePixelRatio };
    // }

    this.size = { width:window.innerWidth, height:window.innerHeight, ratio:window.devicePixelRatio };

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
    this.drawTide.setSize(this.size);

    // Set scale adjusted line width to fix the line appearing to be thicker on smaller resolutions
    let curLineWidth = curSize/SIZE_REFERENCE * LINE_WIDTH;
    this.drawEarth.setLineWidth(curLineWidth);
    this.drawSun.setLineWidth(curLineWidth);
  }

  window.onresize = function(event)
  {
    overview.update();
  }
}