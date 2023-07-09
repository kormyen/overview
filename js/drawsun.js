function DrawSun(drawShared, radius, lineWidth, lineLengthLarge, lineLengthMedium, lineLengthSmall, colorPrimary, colorSecondary, colorAscent)
{   
    this.drawShared = drawShared;
    const SUN_SIZE = radius;
    const LINE_WIDTH = lineWidth;
    const LINE_LENGTH_LARGE = lineLengthLarge;
    const LINE_LENGTH_MEDIUM = lineLengthMedium;
    const LINE_LENGTH_SMALL = lineLengthSmall;
    const COLOR_PRIMARY = colorPrimary; // used to display today
    const COLOR_SECONDARY = colorSecondary; // used for month graduations
    const COLOR_ASCENT = colorAscent; // used for saturday and sunday

    this.display = function(context, cx, cy, timeData)
	{
        let currentDayInCurrentMonth = 1;
        let currentMonth = 0;

        for (let i = 0; i < timeData.currentYearsTotalDays; i++)
        {
            let dayDivideByFive = currentDayInCurrentMonth % 5 === 0;
            let dayDivideByTen = currentDayInCurrentMonth % 10 === 0;
            let dayLineLength = LINE_LENGTH_SMALL;
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
            let degrees = 360 - ((i / timeData.currentYearsTotalDays) * 360);

            // SUN (DAYS) GRADUATIONS - DAY IN CURRENT MONTH
            let anyDayOfThisMonth = timeData.currentMonth == currentMonth;
            if (anyDayOfThisMonth)
            {
                let strokeColor = this.checkIfWeekend(timeData, i+1) ? COLOR_ASCENT : COLOR_SECONDARY;
                if (timeData.currentDaysIntoYear == i + 1)
                {
                    strokeColor = COLOR_PRIMARY;
                }
                
                this.drawShared.drawCircGraduation(context, cx, cy, degrees, SUN_SIZE, dayLineLength, LINE_WIDTH, strokeColor);
            }

            // SUN (DAYS) GRADUATIONS - MONTH
            let firstDayOfAnyMonth = currentDayInCurrentMonth == 1;
            let strokeColor = COLOR_SECONDARY;
            if (firstDayOfAnyMonth)
            {
                if (timeData.currentDaysIntoYear == i+1)
                {
                    strokeColor = COLOR_PRIMARY;
                }
                this.drawShared.drawCircGraduation(context, cx, cy, degrees, SUN_SIZE + dayLineLength, dayLineLength, LINE_WIDTH, strokeColor);
            }

            currentDayInCurrentMonth++;
            if (currentDayInCurrentMonth > timeData.currentYearsDaysPerMonth[currentMonth])
            {
                currentMonth++;
                currentDayInCurrentMonth = 1;
            }
        }
    }

    this.checkIfWeekend = function(timeData, dayOfYear)
    {
        let dateOfYear = this.dateFromDay(timeData.currentYear, dayOfYear);
        let dayOfWeek = dateOfYear.getDay();

        if (dayOfWeek == 0 || dayOfWeek == 6)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    this.dateFromDay = function(year, day)
    {
        var date = new Date(year, 0); // initialize a date in `year-01-01`
        return new Date(date.setDate(day)); // add the number of days
    }
}