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
            points[i].x = posX;
            points[i].y = posY;

            // DO: calculate my mid points / "control points"
        }

        // Debug points
        context.beginPath();
        for (let i = 0; i < points.length; i++)
        {
            context.arc(points[i].x, points[i].y, 10, 0, 2 * Math.PI, false);
            context.fillStyle = 'green';
            context.fill();
            context.closePath();
        }
        
        // Draw tide
        context.beginPath();
        context.fillStyle = "#000000";
        context.moveTo(points[0].x, points[0].y); // start at first point
        for (let i = 1; i < points.length; i++)
        {
            context.quadraticCurveTo(points[i].x, points[i].y, points[i].x, points[i].y); // curve to each point
        }
        context.quadraticCurveTo(points[0].x, points[0].y, points[0].x, points[0].y); // curve to start point
        context.fill();
        context.closePath();


        // move to the first point
        context.beginPath();
        context.fillStyle = settings.colorTertiary;
        context.moveTo(points[0].x, points[0].y);

        for (var i = 1; i < points.length - 2; i++) {
            var xc = (points[i].x + points[i + 1].x) / 2;
            var yc = (points[i].y + points[i + 1].y) / 2;
            context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        // curve through the last two points
        context.quadraticCurveTo(
        points[i].x,
        points[i].y,
        points[i + 1].x,
        points[i + 1].y
        );
        context.fill();
        context.closePath();
    }
}