function DrawTide(drawShared)
{
    this.drawShared = drawShared;
    this.size = null;

    this.setSize = function(size)
    {
        this.size = size;
    }

    this.display = function(context, cx, cy, timeData, tideData, radius)
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

    this.drawDebugDots = function(context, points, color1, color2)
    {
        console.log(points)
        for (let i = 0; i < points.length; i++)
        {
            context.beginPath();
            context.arc(points[i].x, points[i].y, 10, 0, 2 * Math.PI, false);
            if (i==0)
            {
                context.fillStyle = color1;
            }
            else
            {
                context.fillStyle = color2;
            }
            context.fill();
            context.closePath();
        }
    }
}