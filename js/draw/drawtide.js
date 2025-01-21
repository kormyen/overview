function DrawTide(drawShared)
{
    this.drawShared = drawShared;
    this.size = null;

    this.setSize = function(size)
    {
        this.size = size;
    }

    this.display = function(context, cx, cy, timeData, tideData, radiusLow, radiusHigh)
    {
        // Get data for current day.
        let indexLast = -1;
        let indexNext = -1;
        for (let i = 0; i < tideData.length; i++)
        {
            indexLast = i;
            if (this.checkSameDate(tideData[i].date, timeData.currentDate))
            {
                if (tideData[i].dayPerc > timeData.currentDayPercentage)
                {
                    indexNext = i;
                    break;
                }   
            }
        }
        if (indexNext == -1 && indexLast != -1)
        {
            // there are no more tide events today (the time is close to midnight), so the next event is the first event for tomorrow
            indexNext = indexLast + 1;
        }

        if (tideData.length <= indexNext || (indexNext == -1))
        {
            // console.error("Don't have today's tide data. Can't draw tide.")
        }
        else
        {
            this.doDrawTide(context, radiusLow, radiusHigh, timeData, tideData, indexNext, cx, cy);
        }
    }

    this.doDrawTide = function(context, radiusLow, radiusHigh, timeData, tideData, indexNext, cx, cy)
    {   
        // RADIUS
        let next1Radius = tideData[indexNext].tideType == "high" ? radiusHigh : radiusLow;
        let next2Radius = tideData[indexNext+1].tideType == "high" ? radiusHigh : radiusLow;
        let next3Radius = tideData[indexNext+2].tideType == "high" ? radiusHigh : radiusLow;
        let next4Radius = tideData[indexNext+3].tideType == "high" ? radiusHigh : radiusLow;
        let next5Radius = tideData[indexNext+4].tideType == "high" ? radiusHigh : radiusLow;
        let prev1Radius = tideData[indexNext-1].tideType == "high" ? radiusHigh : radiusLow;

        // Calculate current height
        var curDifference2 = (tideData[indexNext].date.getTime() - tideData[indexNext-1].date.getTime()) / 1000;
        var curProgress2 = (timeData.currentDate.getTime() - tideData[indexNext-1].date.getTime()) / 1000;
        let curPercToNextPoint2 = curProgress2 / curDifference2;
        let curRadius2 = this.lerp(prev1Radius, next1Radius, this.easeInOutSine(curPercToNextPoint2));

        // Calculate future height
        let futureDifference = tideData[indexNext+4].dayPerc - tideData[indexNext+3].dayPerc;
        let futureProgress = timeData.currentDayPercentage - tideData[indexNext+3].dayPerc;
        let futurePercToNextPoint = futureProgress / futureDifference;
        let futureRadius = this.lerp(next4Radius, next5Radius, this.easeInOutSine(futurePercToNextPoint));

        // POSITION
        let next1 = this.calcPositionOnCircle(this.size.height * next1Radius, tideData[indexNext].dayPerc, cx, cy);
        let next2 = this.calcPositionOnCircle(this.size.height * next2Radius, tideData[indexNext+1].dayPerc, cx, cy);
        let next3 = this.calcPositionOnCircle(this.size.height * next3Radius, tideData[indexNext+2].dayPerc, cx, cy);
        let next4 = this.calcPositionOnCircle(this.size.height * next4Radius, tideData[indexNext+3].dayPerc, cx, cy);
        let next5 = this.calcPositionOnCircle(this.size.height * next5Radius, tideData[indexNext+4].dayPerc, cx, cy);
        let prevPos1 = this.calcPositionOnCircle(this.size.height * prev1Radius, tideData[indexNext-1].dayPerc, cx, cy);

        let curPos = this.calcPositionOnCircle(this.size.height * curRadius2, timeData.currentDayPercentage, cx, cy);
        let futurePos = this.calcPositionOnCircle(this.size.height * futureRadius, timeData.currentDayPercentage, cx, cy);
        
        // DRAW
        let points = [];
        points[0] = curPos;
        points[1] = next1;
        points[2] = next2;
        points[3] = next3;
        if (timeData.currentDayPercentage > tideData[indexNext+3].dayPerc)
        {
            points[4] = next4;
            points[5] = futurePos;
            points[6] = curPos;
        }
        else
        {
            points[4] = futurePos;
            points[5] = curPos;
        }
        this.drawPathSharp(context, points, settings.colorTertiary);
        // this.drawPathSmooth(context, points, settings.colorTertiary, cx, cy);

        this.drawDebugDot(context, next1.x, next1.y, 'orange');
        this.drawDebugDot(context, next2.x, next2.y, 'yellow');
        this.drawDebugDot(context, next3.x, next3.y, 'yellow');
        this.drawDebugDot(context, next4.x, next4.y, 'DarkBlue');   
        this.drawDebugDot(context, next5.x, next5.y, 'LightBlue');
        this.drawDebugDot(context, prevPos1.x, prevPos1.y, 'red');
        
        this.drawDebugDot(context, futurePos.x, futurePos.y, 'blue');
        this.drawDebugDot(context, curPos.x, curPos.y, 'green');
    }

    this.lerp = function(a, b, alpha)
    {
        return a + alpha * (b-a);
    }

    this.easeInOutSine = function(x)
    {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }

    this.calcDayPercToDegrees = function(percentage)
    {
        let result = percentage * 360;
        result -= 90; // fix starting point.
        return result;
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
        result.radius = radius;

        return result;
    }

    // Define a function named degrees_to_radians that converts degrees to radians.
    this.degreesToRadians = function(degrees)
    {
        // Store the value of pi.
        var pi = Math.PI;
        // Multiply degrees by pi divided by 180 to convert to radians.
        return degrees * (pi/180);
    }

    this.displayOld = function(context, cx, cy, timeData, tideData, radius)
    {
        // DO: Here would use timeData to get data for current day
        let todaysTides = tideData["2023-07-31"];

        // Calculate tide point positions data
        let points = [];
        for (let i = 0; i < todaysTides.length; i++)
        {
            let tideDegrees = todaysTides[i].dayPerc * 360;

            // To find the x and y coordinates on a circle with a known radius and angle use the formula:
            // x = r(cos(degrees)), y = r(sin(degrees))
            let posX = this.size.height * radius * Math.cos(tideDegrees);
            let posY = this.size.height * radius * Math.sin(tideDegrees);

            // Move position values to be from the center of the clock
            posX += cx;
            posY += cy;

            // Set data
            points[i] = {};
            points[i].degrees = tideDegrees;
            points[i].x = posX;
            points[i].y = posY;
        }

        // this.drawDebugDots(context, points, 'yellow', 'green');
        this.drawPathSharp(context, points, settings.colorTertiary);
    }

    this.drawPathSharp = function(context, points, color)
    {
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for (let i = 0; i < points.length; i++)
        {
            context.lineTo(points[i].x, points[i].y);
        }
        context.lineTo(points[0].x, points[0].y);

        context.fillStyle = color;
        context.fill();
        context.closePath();
    }

    this.drawPathSmooth = function(context, points, color, centerX, centerY)
    {
        console.log("draw smooth")
    }

    this.drawDebugDots = function(context, points, color1, color2)
    {
        console.log(points)
        for (let i = 0; i < points.length; i++)
        {
            if (i==0)
            {
                this.drawDebugDot(context, points[i].x, points[i].y, color1);
            }
            else
            {
                this.drawDebugDot(context, points[i].x, points[i].y, color2);
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

    this.checkSameDate = function(d1, d2)
    {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }
}