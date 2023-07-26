function DrawEarth(drawShared, radius, lineWidth, colorPrimary, colorSecondary, colorBackground, colorAscent, lineLengthLarge, lineLengthSmall, lineLengthTiny)
{
    this.size = null;
    this.lineWidth = lineWidth;

    this.drawShared = drawShared;
    const EARTH_SIZE = radius;
    const COLOR_PRIMARY = colorPrimary;
    const COLOR_SECONDARY = colorSecondary;
    const COLOR_BACKGROUND = colorBackground;
    const COLOR_ASCENT = colorAscent;
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

    this.display = function(context, cx, cy, timeData, degreesEarthOffsetShared, sunData)
    {
        this.drawSunLight(context, cx, cy, degreesEarthOffsetShared, sunData);

        this.drawEarthTimeHand(context, cx, cy, timeData, degreesEarthOffsetShared);
        this.drawEarthGraduations(context, cx, cy, timeData, degreesEarthOffsetShared);
        this.drawShared.drawCircle(context, cx, cy, EARTH_SIZE, this.lineWidth, COLOR_PRIMARY);
    }

    // Normalizes any number to an arbitrary range 
    // by assuming the range wraps around when going below min or above max 
    this.normalize = function(value, start, end) 
    {
        let width       = end - start   ;   // 
        let offsetValue = value - start ;   // value relative to 0

        return (offsetValue - (Math.floor( offsetValue / width ) * width )) + start;
        // + start to reset back to start of original range
    }

    this.drawSunLight = function(context, cx, cy, degreesEarthOffsetShared, sunData)
    {
        let currentGraduationDegrees = this.normalize(degreesEarthOffsetShared-180, 0, 360);

        const TOTALSECONDSINDAY = 60*60*24;
        
        let set1Perc = this.getSecondsThroughDay(sunData.Set1GoldenHour) / TOTALSECONDSINDAY;
        let set2Perc = this.getSecondsThroughDay(sunData.Set2Sunset) / TOTALSECONDSINDAY;
        let set3Perc = this.getSecondsThroughDay(sunData.Set3TwilightCivil) / TOTALSECONDSINDAY;
        let set4Perc = this.getSecondsThroughDay(sunData.Set4TwilightNautical) / TOTALSECONDSINDAY;
        let set5Perc = this.getSecondsThroughDay(sunData.Set5TwilightAstro) / TOTALSECONDSINDAY;
        let set6Perc = this.getSecondsThroughDay(sunData.Set6Night) / TOTALSECONDSINDAY;
        // let set7Perc = this.getSecondsThroughDay(sunData.Set7SolarNadir) / TOTALSECONDSINDAY;

        let rise1Perc = this.getSecondsThroughDay(sunData.Rise1TwilightAstro) / TOTALSECONDSINDAY;
        let rise2Perc = this.getSecondsThroughDay(sunData.Rise2TwilightNautical) / TOTALSECONDSINDAY;
        let rise3Perc = this.getSecondsThroughDay(sunData.Rise3TwilightCivil) / TOTALSECONDSINDAY;
        let rise4Perc = this.getSecondsThroughDay(sunData.Rise4Sunrise) / TOTALSECONDSINDAY;
        let rise5Perc = this.getSecondsThroughDay(sunData.Rise5GoldenHour) / TOTALSECONDSINDAY;
        let rise6Perc = this.getSecondsThroughDay(sunData.Rise6Day) / TOTALSECONDSINDAY;
        // let rise7Perc = this.getSecondsThroughDay(sunData.Rise7SolarNoon) / TOTALSECONDSINDAY; 

        this.drawSunLightArc(context, cx, cy, currentGraduationDegrees, set6Perc, rise1Perc, 0.95); // astro
        this.drawSunLightArc(context, cx, cy, currentGraduationDegrees, set5Perc, rise2Perc, 0.85); // nautical
        this.drawSunLightArc(context, cx, cy, currentGraduationDegrees, set4Perc, rise3Perc, 0.75); // civil
        this.drawSunLightArc(context, cx, cy, currentGraduationDegrees, set3Perc, rise4Perc, 0.2); // sunrise
        this.drawSunLightArc(context, cx, cy, currentGraduationDegrees, set2Perc, rise5Perc, 0.4); // golden hour
        this.drawSunLightArc(context, cx, cy, currentGraduationDegrees, set1Perc, rise6Perc, 0.5); // day
    }

    this.drawSunLightArc = function(context, cx, cy, currentGraduationDegrees, startPerc, endPerc, colorPerc)
    {
        context.beginPath();
        context.fillStyle = drawShared.hexMix(COLOR_SECONDARY, COLOR_BACKGROUND, colorPerc);

        const ARC_FIX = -90;
        let sDegrees = this.normalize(ARC_FIX - currentGraduationDegrees - (startPerc * -360), 0, 360);
        let eDegrees = this.normalize(ARC_FIX - currentGraduationDegrees - (endPerc * -360), 0, 360);
        let sAngle = this.degreesToRadians(sDegrees);
        let eAngle = this.degreesToRadians(eDegrees);

        context.arc(cx, cy, EARTH_SIZE * this.size.height, eAngle, sAngle, false);
        context.closePath();
        context.fill();
    }

    this.getSecondsThroughDay = function(givenDate)
    {
        return givenDate.getHours() * 3600 + givenDate.getMinutes() * 60 + givenDate.getSeconds();
    }

    this.degreesToRadians = function(degrees)
    {
        return degrees * (Math.PI / 180);
    }

    this.drawEarthTimeHand = function(context, cx, cy, timeData, degreesEarthOffsetShared)
    {
        // 24h time hand
        let degreesForTimeOfDay = degreesEarthOffsetShared;
        degreesForTimeOfDay += 180; // offset to align to midnight.
        degreesForTimeOfDay += timeData.currentDayPercentage * -360; // 360 degree rotation for time of day.
        this.drawShared.drawCircGraduation(context, cx, cy, degreesForTimeOfDay, EARTH_SIZE + LINE_LENGTH_TINY*2, LINE_LENGTH_TINY, this.lineWidth*2.5, COLOR_ASCENT);
    }

    this.drawEarthGraduations = function(context, cx, cy, timeData, degreesEarthOffsetShared)
    {
        let graduationCount = 96;
        let secondary_HideSectionCount = 4;
        let secondary_AutoHide = false;
        let tertiary_HideSectionCount = 24;

        let degreesPerGraduation = 360 / graduationCount;
        for (let i = 0; i < graduationCount; i++)
        {
            // Shared
            let currentDayDegree = timeData.currentDayPercentage * 360;
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
                
                this.drawShared.drawCircGraduation(context, cx, cy, currentGraduationDegrees, EARTH_SIZE, lineLength, this.lineWidth, valueColor);
            }
        }
    }
}