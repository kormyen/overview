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

    this.display = function(context, cx, cy, timeData, degreesEarthOffsetShared, sunData, colorPrimary, colorSecondary, colorBackground, colorAscent)
    {
        if (settings.midnightTop.value)
        {
            degreesEarthOffsetShared -= 180;
        }

        if (settings.sunBands.value)
        {
            this.drawSunlight.display(context, cx, cy, degreesEarthOffsetShared, sunData, colorSecondary, colorBackground, EARTH_SIZE * this.size.height);
        }

        this.drawEarthTimeHand(context, cx, cy, timeData, degreesEarthOffsetShared, colorAscent);
        this.drawEarthGraduations(context, cx, cy, timeData, degreesEarthOffsetShared, colorPrimary, colorSecondary);

        if (settings.earthOutline.value)
        {
            this.drawShared.drawCircle(context, cx, cy, EARTH_SIZE, this.lineWidth, colorPrimary);
        }
    }

    this.drawEarthTimeHand = function(context, cx, cy, timeData, degreesEarthOffsetShared, colorAscent)
    {
        // 24h time hand
        let degreesForTimeOfDay = degreesEarthOffsetShared;
        degreesForTimeOfDay += 180; // offset to align to midnight.
        degreesForTimeOfDay += timeData.currentDayPercentage * -360; // 360 degree rotation for time of day.
        this.drawShared.drawCircGraduation(context, cx, cy, degreesForTimeOfDay, EARTH_SIZE + LINE_LENGTH_TINY*2, LINE_LENGTH_TINY, this.lineWidth*2.5, colorAscent);
    }

    this.drawEarthGraduations = function(context, cx, cy, timeData, degreesEarthOffsetShared, colorPrimary, colorSecondary)
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
                let valueColor = colorSecondary;
                if (i == currentGraduationHighlighted)
                {
                    valueColor = colorPrimary;
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