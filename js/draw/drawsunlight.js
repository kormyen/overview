function DrawSunlight(drawShared)
{   
    this.drawShared = drawShared;

    this.display = function(context, cx, cy, degreesEarthOffsetShared, sunData, colorSecondary, colorBackground, earthSize)
    {
        let currentGraduationDegrees = 180;
        if (settings.earthRotate.value)
        {
            currentGraduationDegrees = this.normalize(degreesEarthOffsetShared-180, 0, 360);
        }
        if (settings.midnightTop.value)
        {
            currentGraduationDegrees += 180;
        }

        this.drawSunLightArc(context, cx, cy, currentGraduationDegrees, sunData.set6Perc, sunData.rise1Perc, 0.95, colorSecondary, colorBackground, earthSize); // astro
        this.drawSunLightArc(context, cx, cy, currentGraduationDegrees, sunData.set5Perc, sunData.rise2Perc, 0.85, colorSecondary, colorBackground, earthSize); // nautical
        this.drawSunLightArc(context, cx, cy, currentGraduationDegrees, sunData.set4Perc, sunData.rise3Perc, 0.75, colorSecondary, colorBackground, earthSize); // civil
        this.drawSunLightArc(context, cx, cy, currentGraduationDegrees, sunData.set3Perc, sunData.rise4Perc, 0.2, colorSecondary, colorBackground, earthSize); // sunrise
        this.drawSunLightArc(context, cx, cy, currentGraduationDegrees, sunData.set2Perc, sunData.rise5Perc, 0.4, colorSecondary, colorBackground, earthSize); // golden hour
        this.drawSunLightArc(context, cx, cy, currentGraduationDegrees, sunData.set1Perc, sunData.rise6Perc, 0.5, colorSecondary, colorBackground, earthSize); // day
    }

    this.drawSunLightArc = function(context, cx, cy, currentGraduationDegrees, startPerc, endPerc, colorPerc, colorSecondary, colorBackground, earthSize)
    {
        context.beginPath();
        context.fillStyle = drawShared.hexMix(colorSecondary, colorBackground, colorPerc);

        const ARC_FIX = -90;
        let sDegrees = this.normalize(ARC_FIX - currentGraduationDegrees - (startPerc * -360), 0, 360);
        let eDegrees = this.normalize(ARC_FIX - currentGraduationDegrees - (endPerc * -360), 0, 360);
        let sAngle = this.degreesToRadians(sDegrees);
        let eAngle = this.degreesToRadians(eDegrees);

        context.arc(cx, cy, earthSize, eAngle, sAngle, false);
        context.closePath();
        context.fill();
    }

    this.degreesToRadians = function(degrees)
    {
        return degrees * (Math.PI / 180);
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
}