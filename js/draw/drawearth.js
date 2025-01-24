function DrawEarth(drawShared, drawSunlight, radius, lineWidth, lineLengthLarge, lineLengthSmall, lineLengthTiny)
{
    this.size = null;
    this.lineWidth = lineWidth;

    this.drawShared = drawShared;
    this.drawSunlight = drawSunlight;

    const EARTH_SIZE = radius;
    const LINE_LENGTH_LARGE = lineLengthLarge;
    const LINE_LENGTH_SMALL = lineLengthSmall;
    const LINE_LENGTH_TINY = lineLengthTiny;

    this.setSize = function(size)
    {
        this.size = size;
    }

    this.setLineWidth = function(lineWidth)
    {
        this.lineWidth = lineWidth;
    }

    this.display = function(context, cx, cy, timeData, degreesEarthOffsetShared, sunData, colorPrimary, colorSecondary, colorBackground)
    {
        if (settings.midnightTop.value)
        {
            degreesEarthOffsetShared -= 180;  // offset to align to midnight.
        }

        if (settings.sunBands.value)
        {
            this.drawSunlight.display(context, cx, cy, degreesEarthOffsetShared, sunData, colorSecondary, colorBackground, EARTH_SIZE * this.size.height);
        }
        this.drawEarthTimeHand(context, cx, cy, timeData, degreesEarthOffsetShared);
        this.drawEarthGraduations(context, cx, cy, timeData, degreesEarthOffsetShared, sunData);

        if (settings.earthOutline.value)
        {
            this.drawShared.drawCircle(context, cx, cy, EARTH_SIZE, this.lineWidth, colorPrimary);
        }
    }

    this.drawEarthTimeHand = function(context, cx, cy, timeData, degreesEarthOffsetShared)
    {
        // 24h time hand
        let degreesForTimeOfDay = degreesEarthOffsetShared;
        degreesForTimeOfDay += 180; // offset to align to midnight.
        degreesForTimeOfDay += timeData.currentDayPercentage * -360; // 360 degree rotation for time of day.
        this.drawShared.drawCircGraduation(context, cx, cy, degreesForTimeOfDay, EARTH_SIZE + LINE_LENGTH_LARGE + LINE_LENGTH_TINY*2, LINE_LENGTH_TINY, this.lineWidth*2.5, settings.colorPrimary);
    }

    this.drawEarthGraduations = function(context, cx, cy, timeData, degreesEarthOffsetShared, sunData)
    {
        let graduationCount = 96; // 96 = 24 hours with 4x (15 minute) graduations. 24*4.
        let secondary_HideSectionCount = 4;
        let secondary_AutoHide = false;
        let tertiary_HideSectionCount = 24;

        let degreesPerGraduation = 360 / graduationCount;
        for (let i = 0; i < graduationCount; i++)
        {
            // Shared
            let sharedGraduationDegrees = degreesEarthOffsetShared + 180;
            let sharedGraduationPerc = Math.abs(sharedGraduationDegrees)/360;

            let currentDayDegree = timeData.currentDayPercentage * 360;

            let currentGraduationDegrees = sharedGraduationDegrees - (degreesPerGraduation * i); // offset for each of the graduations
            let currentGraduationPerc = Math.abs(currentGraduationDegrees)/360;

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
            if (!settings.graduationMinimal.value)
            {
                display = true;
            }
            let graduationTypePrimary = false; // 6 hour marks
            let graduationTypeSecondary = false; // 1 hour marks
            if (i % 24 === 0)
            {
                // Primary graduation! 6 hour mark
                graduationTypePrimary = true;
                display = true;
            }
            else if (i % 4 === 0)
            {
                // Secondary graduation! 1 hour mark
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
                // Tertiary graduation! 15 minute mark
                if (tertiary_currentSection == tertiary_DrawnSection)
                {
                    display = true;
                }

                if (settings.graduationRiseSetDisplay.value)
                {
                    let percPerHour = 1/24;
                    let percPer15Mins = percPerHour/4;

                    let sunriseHourPercEnd = Math.floor((sunData.rise4Perc+sharedGraduationPerc)/percPerHour)*percPerHour;
                    let sunriseHourPercStart = sunriseHourPercEnd + percPerHour;

                    // console.log(sunriseHourPercEnd + " v " + sunriseHourPercStart)


                    let sunsetHourPercEnd = Math.floor((sunData.set3Perc+sharedGraduationPerc)/percPerHour)*percPerHour+percPerHour;
                    let sunsetHourPercStart = sunsetHourPercEnd - percPerHour;

                    let debugPos = this.calcPositionOnCircle(EARTH_SIZE * this.size.height + 30, sunData.set3Perc, cx, cy);
                    let debugPos2 = this.calcPositionOnCircle(EARTH_SIZE * this.size.height + 40, sunsetHourPercEnd, cx, cy);
                    this.drawDebugDot(context, debugPos.x, debugPos.y, "green");
                    this.drawDebugDot(context, debugPos2.x, debugPos2.y, "red");

                    // console.log(sunsetHourPercStart + " v " + sunsetHourPercEnd)

                    if (currentGraduationPerc < sunriseHourPercStart 
                        && currentGraduationPerc > sunriseHourPercEnd)
                    {
                        display = true;
                    }
                    else if (currentGraduationPerc > sunsetHourPercStart 
                        && currentGraduationPerc < sunsetHourPercEnd)
                    {
                        display = true;
                    }
                }

            }

            if (display)
            {
                // COLOR
                let valueColor = settings.colorDark;
                if (settings.graduationHighlight.value && i == currentGraduationHighlighted)
                {
                    valueColor = settings.colorPrimary;
                }
                if (settings.graduationSunlight.value 
                    && currentGraduationPerc < (sunData.set3Perc+sharedGraduationPerc) 
                    && currentGraduationPerc > (sunData.rise4Perc+sharedGraduationPerc))
                {
                    valueColor = settings.colorPrimary;
                }

                // LENGTH
                // 15 minute marks
                let lineLength = LINE_LENGTH_TINY;
                if (graduationTypeSecondary)
                {
                    // 1 hour marks
                    lineLength = LINE_LENGTH_SMALL;
                }
                else if (graduationTypePrimary)
                {
                    // 6 hour marks
                    lineLength = LINE_LENGTH_LARGE;
                }
                
                this.drawShared.drawCircGraduation(context, cx, cy, currentGraduationDegrees, EARTH_SIZE+lineLength, lineLength, this.lineWidth, valueColor);
            }
        }
    }

    this.drawDebugDot = function(context, posX, posY, color)
    {
        context.beginPath();
        context.arc(posX, posY, 10, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();
        context.closePath();
    }

    this.calcDayPercToDegrees = function(percentage)
    {
        let result = percentage * 360;
        result -= 90; // fix starting point.
        return result;
    }

    this.degreesToRadians = function(degrees)
    {
        // Store the value of pi.
        var pi = Math.PI;
        // Multiply degrees by pi divided by 180 to convert to radians.
        return degrees * (pi / 180);
    }

    this.calcPositionOnCircle = function(radius, perc, centerX, centerY)
    {
        let result = {};
        let degrees = this.calcDayPercToDegrees(perc);

        // To find the x and y coordinates on a circle with a known radius and angle use the formula:
        // x = r(cos(degrees)), y = r(sin(degrees))
        result.x = radius * Math.cos(this.degreesToRadians(degrees));
        result.y = radius * Math.sin(this.degreesToRadians(degrees));

        // Move position values to be from the center of the clock
        result.x += centerX;
        result.y += centerY;

        // Extra data for smooth drawing
        result.perc = perc;
        result.degrees = degrees;
        result.radius = radius;

        return result;
    }

}