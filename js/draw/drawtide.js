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
            todaysTides[i].posX = posX;
            todaysTides[i].posY = posY;

        }

        // Draw tide
        context.beginPath();
        context.fillStyle = settings.colorTertiary;
        context.moveTo(todaysTides[0].posX, todaysTides[0].posY); // start at first point
        for (let i = 1; i < todaysTides.length; i++)
        {
            context.quadraticCurveTo(todaysTides[i].posX, todaysTides[i].posY, todaysTides[i].posX, todaysTides[i].posY); // curve to each point
        }
        context.quadraticCurveTo(todaysTides[0].posX, todaysTides[0].posY, todaysTides[0].posX, todaysTides[0].posY); // curve to start point
        context.fill();


        // Quadratic curves example
        // context.beginPath();
        // context.moveTo(75, 25);
        // context.quadraticCurveTo(25, 25, 25, 62.5);
        // context.quadraticCurveTo(25, 100, 50, 100);
        // context.quadraticCurveTo(50, 120, 30, 125);
        // context.quadraticCurveTo(60, 120, 65, 100);
        // context.quadraticCurveTo(125, 100, 125, 62.5);
        // context.quadraticCurveTo(125, 25, 75, 25);
        // context.stroke();
    }
}