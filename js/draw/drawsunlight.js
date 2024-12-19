function DrawSunlight(drawShared)
{   
    this.drawShared = drawShared;

    this.display = function(context, cx, cy, degreesEarthOffsetShared, sunData, colorSecondary, colorBackground, earthSize)
    {
        let currentGraduationDegrees = 180;
        if (settings.offset.value)
        {
            currentGraduationDegrees = this.normalize(degreesEarthOffsetShared-180, 0, 360);
        }
        if (settings.midnightTop.value)
        {
            currentGraduationDegrees += 180;
        }

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

        this.drawSunLightArc(context, cx, cy, currentGraduationDegrees, set6Perc, rise1Perc, 0.95, colorSecondary, colorBackground, earthSize); // astro
        this.drawSunLightArc(context, cx, cy, currentGraduationDegrees, set5Perc, rise2Perc, 0.85, colorSecondary, colorBackground, earthSize); // nautical
        this.drawSunLightArc(context, cx, cy, currentGraduationDegrees, set4Perc, rise3Perc, 0.75, colorSecondary, colorBackground, earthSize); // civil
        this.drawSunLightArc(context, cx, cy, currentGraduationDegrees, set3Perc, rise4Perc, 0.2, colorSecondary, colorBackground, earthSize); // sunrise
        this.drawSunLightArc(context, cx, cy, currentGraduationDegrees, set2Perc, rise5Perc, 0.4, colorSecondary, colorBackground, earthSize); // golden hour
        this.drawSunLightArc(context, cx, cy, currentGraduationDegrees, set1Perc, rise6Perc, 0.5, colorSecondary, colorBackground, earthSize); // day
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

    this.getSecondsThroughDay = function(givenDate)
    {
        return givenDate.getHours() * 3600 + givenDate.getMinutes() * 60 + givenDate.getSeconds();
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