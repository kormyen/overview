function MoonPainter()
{
	this.drawMoon = function(context, cx, cy, size, lineWidth, color, phasePerc, rotationOffset)
	{
		context.save(); // save current canvas state (position, rotation).
		context.translate(cx, cy);

		context.rotate(Math.PI * 2 * phasePerc + this.degreesToRadians(-rotationOffset));

		context.fillRect(-size/2, -size/2, size, size);

		this.drawCircle(context, 0, 0, size, lineWidth, color);


		if (phasePerc <= 0.5) 
		{
			
		} 
		else 
		{
			
		}
		context.restore();
	}

	this.degreesToRadians = function(degrees)
	{
		return degrees * (Math.PI / 180);
	}


	this.drawCircle = function(context, x, y, radius, lineWidth, lineColor)
	{
		context.lineWidth = lineWidth;
		context.strokeStyle = lineColor;
		return context.stroke(new Path2D(`M ${x}, ${y} m ${-radius}, 0 a ${radius},${radius} 0 1, 1 0, 0.1`));
	}





	// OLD
	this.drawDisc = function(radius)
	{
		// this.ctx.translate(this.offset, this.offset) ;
		this.ctx.beginPath();
		this.ctx.arc(radius, radius, radius, 0, 2 * Math.PI, true);
		this.ctx.closePath();
		this.ctx.fillStyle = '#fff';
		this.ctx.strokeStyle = '#fff';
		this.ctx.lineWidth = this.lineWidth;

		this.ctx.fill();			
		this.ctx.stroke();
	}

	this.drawPhase = function(phase, radius)
	{
		this.ctx.beginPath();
		this.ctx.arc(radius, radius, radius, -Math.PI/2, Math.PI/2, true);
		this.ctx.closePath();
		this.ctx.fillStyle = '#000';
		this.ctx.fill();

		// this.ctx.translate(radius, radius);
		// this.ctx.scale( phase, 1 );
		// this.ctx.translate(-radius, -radius);
		this.ctx.beginPath();
		this.ctx.arc(radius, radius, radius, -Math.PI/2, Math.PI/2, true);
		this.ctx.closePath();
		this.ctx.fillStyle = phase > 0 ? '#fff' : '#000';
		this.ctx.fill();
	}
}