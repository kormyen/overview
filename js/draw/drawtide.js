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
        // We have tide data, but need to figure out which entry is the next closest to current time (aka indexNext).
        let indexNext = -1;
        for (let i = 0; i < tideData.length; i++)
        {
            if (this.checkSameDate(tideData[i].date, timeData.currentDate))
            {
                if (tideData[i].dayPerc > timeData.currentDayPercentage)
                {
                    indexNext = i;
                    break;
                }
                else
                {
                    indexNext = i + 1;
                }
            }
        }

        if (tideData.length <= indexNext || (indexNext == -1))
        {
            // console.error("Don't have today's tide data. Can't draw tide.")
        }
        else
        {
            this.doDrawTide(context, radiusLow, radiusHigh, timeData, tideData, indexNext, cx, cy);
        }

        this.doDrawTide(context, radiusLow, radiusHigh, timeData, tideData, indexNext, cx, cy);

    }

    this.doDrawTide = function(context, radiusLow, radiusHigh, timeData, tideData, indexNext, cx, cy)
    {
        if (tideData.length > indexNext+4+1)
        {
            if (indexNext > 0)
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
                let curRadius2 = this.lerp(prev1Radius, next1Radius, curPercToNextPoint2);

                // Calculate future height
                let futureDifference = tideData[indexNext+4].dayPerc - tideData[indexNext+3].dayPerc;
                let futureProgress = timeData.currentDayPercentage - tideData[indexNext+3].dayPerc;
                let futurePercToNextPoint = futureProgress / futureDifference;
                let futureRadius = this.lerp(next4Radius, next5Radius, futurePercToNextPoint);

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
                points.push(prevPos1);
                points.push(next1);
                points.push(next2);
                points.push(next3);
                // points.push(prevPos1);

                points = this.smoothPoints(context, points, cx, cy);
                this.drawPointsAsPath(context, points, settings.colorTertiary);

                // this.drawDebugDot(context, next1.x, next1.y, 'yellow');
                // this.drawDebugDot(context, next2.x, next2.y, 'yellow');
                // this.drawDebugDot(context, next3.x, next3.y, 'yellow');
                // // this.drawDebugDot(context, next4.x, next4.y, 'red'); 
                // // this.drawDebugDot(context, next5.x, next5.y, 'LightBlue');
                // this.drawDebugDot(context, prevPos1.x, prevPos1.y, 'yellow');
                
                // // this.drawDebugDot(context, futurePos.x, futurePos.y, 'blue');
                // // this.drawDebugDot(context, curPos.x, curPos.y, 'red');
            }
            else
            {
                console.log("Can't draw. No past tide data.")
            }
        }
        else
        {
            console.log("Can't draw. No future tide data.")
        }
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
        result.degrees = degrees;
        result.radius = radius;

        return result;
    }

    // Define a function named degrees_to_radians that converts degrees to radians.
    this.degreesToRadians = function(degrees)
    {
        // Store the value of pi.
        var pi = Math.PI;
        // Multiply degrees by pi divided by 180 to convert to radians.
        return degrees * (pi / 180);
    }

    this.drawPointsAsPath = function(context, points, color)
    {
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for (let i = 0; i < points.length; i++)
        {
            context.lineTo(points[i].x, points[i].y);
        }
        // context.lineTo(points[0].x, points[0].y);

        context.fillStyle = color;
        context.fill();
        context.stroke();
        context.closePath();
    }

    this.smoothPoints = function(context, points, centerX, centerY)
    {
        // Settings
        let smoothPercDelta = 0.01;

        // State
        points.sort(function(a, b){return a.perc - b.perc});
        let newPoints = [];


        // Start at midnight/zero-percent
        let zeroDistance = (1-points[points.length-1].perc) + points[0].perc;
        let zeroPerc = (1-points[points.length-1].perc) / zeroDistance;
        let zeroPercEased = this.easeInOutSine(zeroPerc);
        let zeroRadius = this.lerp(points[points.length-1].radius, points[0].radius, zeroPercEased);
        let zeroPoint = this.calcPositionOnCircle(zeroRadius, 0, centerX, centerY);
        this.drawDebugDot(context, zeroPoint.x, zeroPoint.y, 'green');
        
        let pointsSorted = [];
        pointsSorted.push(zeroPoint);
        for (let i = 0; i < points.length; i++)
        {
            pointsSorted.push(points[i]);
        }
        pointsSorted.push(zeroPoint);
        points = pointsSorted; // points are now sorted so that they start at mightnight, and go around clockwise.

        let distanceTotalBetweenPoints = 0;
        let currentPerc = 0;

        // DO: Here need to do different easing for the first point!




        
        currentPerc = points[0].perc;
        for (let i = 0; i < points.length-2; i++)
        {
            distanceTotalBetweenPoints = points[i+1].perc - points[i].perc;
            newPoints.push(points[i]);
            while (Math.abs(points[i+1].perc - currentPerc) > smoothPercDelta)
            {
                currentPerc += smoothPercDelta;
                let newPointDistance = currentPerc - points[i].perc;
                let newPointDistancePerc = newPointDistance / distanceTotalBetweenPoints;
                let newPointDistancePercEased = this.easeInOutSine(newPointDistancePerc);
                let newPointRadius = this.lerp(points[i].radius, points[i+1].radius, newPointDistancePercEased);
                newPoints.push(this.calcPositionOnCircle(newPointRadius, currentPerc, centerX, centerY));
            }
        }

        // Ease from tide data near 9 o'clock to zero/midnight.
        newPoints.push(points[points.length-2]);
        distanceTotalBetweenPoints = 1 - points[points.length-2].perc + points[1].perc;
        while (Math.abs(zeroPoint.perc - currentPerc) > smoothPercDelta)
        {
            currentPerc += smoothPercDelta;
            if (currentPerc >= 1)
            {
                // currentPerc -= 1;
                break;
            }
            let newPointDistance = currentPerc - points[points.length-2].perc;
            let newPointDistancePerc = newPointDistance / distanceTotalBetweenPoints;
            let newPointDistancePercEased = this.easeInOutSine(newPointDistancePerc);
            let newPointRadius = this.lerp(points[points.length-2].radius, points[1].radius, newPointDistancePercEased);
            newPoints.push(this.calcPositionOnCircle(newPointRadius, currentPerc, centerX, centerY));
        }
        newPoints.push(zeroPoint);

        return newPoints;
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