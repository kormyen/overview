"use strict";

function Overview()
{
  this.timeData = null;

  this.canvas = document.createElement("canvas"); 
  this.canvas.id = "overview";
  
  this.size = { width:window.innerWidth, height:window.innerHeight, ratio:1 };
  this.settings = { targetFps: 60 }

  const COLOR_PRIMARY = '#FFFFFF';
  const COLOR_SECONDARY = '#666666';
  const COLOR_ASCENT = '#EE4B2B';

  const LINE_WIDTH = 4;
  const LINE_LENGTH_TINY = 0.01;
  const LINE_LENGTH_SMALL = 0.015;
  const LINE_LENGTH_MEDIUM = 0.02;
  const LINE_LENGTH_LARGE = 0.03;

  const SUN_SIZE = 0.46;
  const EARTH_SIZE = 0.25;
  const MOON_SIZE = EARTH_SIZE * 0.2727986187; // = Moon diameter 3476km / Earth diameter 12,742km

  const MOON_DISTANCE = 0.35;

  this.display = function(timeData)
  {
    this.timeData = timeData;
    this.update();
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

  this.getContext = function()
  {
    return this.canvas.getContext('2d');
  }

  this.clearCanvas = function()
  {
    this.getContext().clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  this.drawTellurion = function()
  {
    let context = this.getContext();
    // context.beginPath();

    let cx = this.size.width * this.size.ratio / 2;
    let cy = this.size.height * this.size.ratio / 2;

    this.drawEarth(context, cx, cy);
    this.drawMoon(context, cx, cy);
    this.drawLINEs(context, cx, cy);
  }

  // SUN (DAY AND MONTH IN YEAR)
  this.drawLINEs = function(context, cx, cy)
  {
    let currentDayInCurrentMonth = 1;
    let currentMonth = 0;
    for (let i = 0; i < this.timeData.currentYearsTotalDays; i++)
    {
      let dayDivideByFive = currentDayInCurrentMonth % 5 === 0;
      let dayDivideByTen = currentDayInCurrentMonth % 10 === 0;
      let dayLineLength = LINE_LENGTH_TINY;
      if (currentDayInCurrentMonth > 0)
      {
        if (dayDivideByFive)
        {
          dayLineLength = LINE_LENGTH_MEDIUM;
        }
        if (dayDivideByTen)
        {
          dayLineLength = LINE_LENGTH_LARGE;
        }
      }
      let degrees = 360 - i / this.timeData.currentYearsTotalDays * 360;

      // SUN (DAYS) GRADUATIONS - DAY IN CURRENT MONTH
      let anyDayOfThisMonth = this.timeData.currentMonth == currentMonth;
      if (anyDayOfThisMonth)
      {
        let strokeColor = COLOR_SECONDARY;
        if (this.timeData.currentDaysIntoYear == i+1)
        {
          strokeColor = COLOR_PRIMARY;
        }
        
        this.drawCircGraduation(context, cx, cy, degrees, SUN_SIZE, dayLineLength, LINE_WIDTH, strokeColor);
      }

      // SUN (DAYS) GRADUATIONS - MONTH
      let firstDayOfAnyMonth = currentDayInCurrentMonth == 1;
      let strokeColor = COLOR_SECONDARY;
      if (firstDayOfAnyMonth)
      {
        if (this.timeData.currentDaysIntoYear == i+1)
        {
          strokeColor = COLOR_PRIMARY;
        }
        this.drawCircGraduation(context, cx, cy, degrees, SUN_SIZE+dayLineLength, dayLineLength, LINE_WIDTH, strokeColor);
      }

      currentDayInCurrentMonth++;
      if (currentDayInCurrentMonth > this.timeData.currentYearsDaysPerMonth[currentMonth])
      {
        currentMonth++;
        currentDayInCurrentMonth = 1;
      }
    }
  }

  // This calculates a degree offset representing the rotation of the 24h earth due to orbiting the sun (year date display).
  this.calcEarthDegreeOffsetShared = function()
  {
    let degreesPerDay = 360 / this.timeData.currentYearsTotalDays;
    let degreesDayCurrent = this.timeData.currentDayPercentage * degreesPerDay;
    let degreesIntoYearCurrent = degreesPerDay * this.timeData.currentDaysIntoYear;

    let degreesEarthOffsetShared = 0;
    degreesEarthOffsetShared -= degreesIntoYearCurrent; // offset for days into year.
    degreesEarthOffsetShared -= degreesDayCurrent; // offset for time-of-day.
    degreesEarthOffsetShared += degreesPerDay; // offset to align to date graduations.

    return degreesEarthOffsetShared;
  }

  // EARTH (24H TIME)
  this.drawEarth = function(context, cx, cy)
  {
    let degreesEarthOffsetShared = this.calcEarthDegreeOffsetShared();
    this.drawEarthGraduations(context, cx, cy, degreesEarthOffsetShared);
    this.drawEarthTimeHand(context, cx, cy, degreesEarthOffsetShared);
    this.drawCircle(context, cx, cy, EARTH_SIZE, LINE_WIDTH, COLOR_PRIMARY);
  }

  this.drawEarthTimeHand = function(context, cx, cy, degreesEarthOffsetShared)
  {
    // 24h time hand
    let degreesForTimeOfDay = degreesEarthOffsetShared;
    degreesForTimeOfDay += 180; // offset to align to midnight.
    degreesForTimeOfDay += this.timeData.currentDayPercentage * -360; // 360 degree rotation for time of day.
    this.drawCircGraduation(context, cx, cy, degreesForTimeOfDay, EARTH_SIZE + LINE_LENGTH_TINY*2, LINE_LENGTH_TINY, LINE_WIDTH*2.5, COLOR_ASCENT);
  }

  this.drawEarthGraduations = function(context, cx, cy, degreesEarthOffsetShared)
  {
    let graduationCount = 96;
    let secondary_HideSectionCount = 4;
    let secondary_AutoHide = false;
    let tertiary_HideSectionCount = 24;

    let degreesPerGraduation = 360 / graduationCount;
    for (let i = 0; i < graduationCount; i++)
    {
      // Shared
      let currentDayDegree = this.timeData.currentDayPercentage * 360;
      let currentGraduationDegrees = degreesEarthOffsetShared + 180;
      currentGraduationDegrees -= degreesPerGraduation * i; // offset for each of the graduations

      // Highlight
      let degreesPerHighlight = 360 / graduationCount;
      let currentGraduationHighlighted = Math.floor(currentDayDegree / degreesPerHighlight);

      // Tertiary type
      let tertiary_DegreesInSection = 360 / tertiary_HideSectionCount;
      let tertiary_currentSection = Math.floor(currentDayDegree / tertiary_DegreesInSection);
      let tertiary_DrawnSection = Math.floor(degreesPerGraduation * i / tertiary_DegreesInSection);

      // Secondary type
      let secondary_DegreesInSection = 360 / secondary_HideSectionCount;
      let secondary_currentSection = Math.floor(currentDayDegree / secondary_DegreesInSection);
      let secondary_DrawnSection = Math.floor(degreesPerGraduation * i / secondary_DegreesInSection);
      
      // Handle type
      let display = false;
      let graduationTypePrimary = false; // 6 hour marks
      let graduationTypeSecondary = false; // 1 hour marks
      if (i % 24 === 0)
      {
        // Primary graduation!
        graduationTypePrimary = true;
        display = true;
      }
      else if (i % 4 === 0)
      {
        // Secondary graduation!
        graduationTypeSecondary = true;
        if (secondary_AutoHide)
        {
          if (secondary_currentSection == secondary_DrawnSection)
          {
            display = true;
          }
        }
        else
        {
          display = true;
        }
      }
      else
      {
        // Tertiary graduation!
        if (tertiary_currentSection == tertiary_DrawnSection)
        {
          display = true;
        }
      }

      if (display)
      {
        let valueColor = COLOR_SECONDARY;
        if (i == currentGraduationHighlighted)
        {
          valueColor = COLOR_PRIMARY;
        }

        let lineLength = LINE_LENGTH_TINY;
        if (graduationTypeSecondary)
        {
          lineLength = LINE_LENGTH_SMALL;
        }
        if (graduationTypePrimary)
        {
          lineLength = LINE_LENGTH_LARGE;
        }
        
        this.drawCircGraduation(context, cx, cy, currentGraduationDegrees, EARTH_SIZE, lineLength, LINE_WIDTH, valueColor);
      }
    }
  }

  this.drawMoon = function(context, cx, cy)
  {
    // MOON (LUNATION / SYNODIC MONTH)
    let degreesEarthOffsetShared = this.calcEarthDegreeOffsetShared();
    let moonPos = this.calcOrbitLocation(cx, cy, degreesEarthOffsetShared -(360 * this.timeData.currentLuationPercentage), MOON_DISTANCE);
    this.drawCircle(context, moonPos.x, moonPos.y, MOON_SIZE, LINE_WIDTH, COLOR_PRIMARY);
  }

  this.drawCircle = function(context, x, y, r, lineWidth, lineColor)
  {
    context.lineWidth = lineWidth;
    context.strokeStyle = lineColor;
    return context.stroke(new Path2D(`M ${x}, ${y} m ${-r * this.size.height}, 0 a ${r * this.size.height},${r * this.size.height} 0 1, 1 0, 0.1`));
  }

  this.drawCircGraduation = function(context, x, y, degrees, radius, lineLength, lineWidth, lineColor)
  {
    context.lineWidth = lineWidth;
    context.strokeStyle = lineColor;
    let outer = this.calcOrbitLocation(x, y, degrees, radius);
    let inner = this.calcOrbitLocation(x, y, degrees, radius - lineLength);
    context.stroke(new Path2D(`M ${outer.x} ${outer.y} L ${inner.x} ${inner.y}`));
  }

  this.calcOrbitLocation = function(x, y, degrees, radius)
  {
    var x = x - y*2* radius * Math.cos((degrees-90) * Math.PI / 180);
    var y = y - y*2*-radius * Math.sin((degrees-90) * Math.PI / 180);
    return {x:x, y:y};
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
    overview.size = { width:window.innerWidth, height:window.innerHeight, ratio:1 };

    if (window.devicePixelRatio > 1)
    {
      var canvasWidth = this.size.width * this.size.ratio;
      var canvasHeight = this.size.height * this.size.ratio;

      this.canvas.width = canvasWidth * window.devicePixelRatio;
      this.canvas.height = canvasHeight * window.devicePixelRatio;
      this.canvas.style.width = canvasWidth + "px";
      this.canvas.style.height = canvasHeight + "px";

      this.getContext().scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }

  window.onresize = function(event)
  {
    overview.size = {width:window.innerWidth,height:window.innerHeight,ratio:2};
    overview.update();
  };
}