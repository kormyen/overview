function DrawShared()
{
    this.size = null;

    this.calcOrbitLocation = function(x, y, degrees, radius)
    {
        var x = x - y * 2 * radius * Math.cos((degrees-90) * Math.PI / 180);
        var y = y - y * 2 *-radius * Math.sin((degrees-90) * Math.PI / 180);
        return {x:x, y:y};
    }

    this.drawCircGraduation = function(context, x, y, degrees, radius, lineLength, lineWidth, lineColor)
    {
        context.lineWidth = lineWidth;
        context.strokeStyle = lineColor;
        let outer = this.calcOrbitLocation(x, y, degrees, radius);
        let inner = this.calcOrbitLocation(x, y, degrees, radius - lineLength);
        context.stroke(new Path2D(`M ${outer.x} ${outer.y} L ${inner.x} ${inner.y}`));
    }

    this.drawCircle = function(context, x, y, radius, lineWidth, lineColor)
    {
        context.lineWidth = lineWidth;
        context.strokeStyle = lineColor;
        return context.stroke(new Path2D(`M ${x}, ${y} m ${-radius * this.size.height}, 0 a ${radius * this.size.height},${radius * this.size.height} 0 1, 1 0, 0.1`));
    }

    this.setSize = function(size)
    {
        this.size = size;
    }

    // Source: https://codepen.io/chambaz/pen/EyNeNw
	this.hexMix = function(colorFrom, colorTo, ratio)
	{
		colorFrom = colorFrom.slice(1);
		colorTo = colorTo.slice(1);

		const hex = function(x)
		{
			x = x.toString(16);
			return (x.length == 1) ? '0' + x : x;
		};
	
		let r = Math.ceil(parseInt(colorTo.substring(0, 2), 16) * ratio + parseInt(colorFrom.substring(0, 2), 16) * (1 - ratio)),
			g = Math.ceil(parseInt(colorTo.substring(2, 4), 16) * ratio + parseInt(colorFrom.substring(2, 4), 16) * (1 - ratio)),
			b = Math.ceil(parseInt(colorTo.substring(4, 6), 16) * ratio + parseInt(colorFrom.substring(4, 6), 16) * (1 - ratio));
	
		return '#' + hex(r) + hex(g) + hex(b);
	}
}