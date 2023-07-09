function MoonPainter()
{
	this.drawMoon = function(context, cx, cy, radius, colorForeground, colorSecondary, colorBackground, phasePerc, rotationOffset)
	{
		context.save(); // save current canvas state (position, rotation).
		context.translate(cx, cy);

		// context.rotate(Math.PI * 2 * phasePerc + this.degreesToRadians(-rotationOffset)); // rotate to face earth
		context.rotate(this.degreesToRadians(-rotationOffset) + Math.PI/2); // rotate to face sun

		if (phasePerc <= 0.5) 
		{
			if (phasePerc <= 0.25) 
			{
				// New Moon to Waxing Cresent to First Quarter
				let quarterPercentageFirst = phasePerc*4;
				quarterPercentageFirst = this.easeInSine(quarterPercentageFirst);

				// First half: fill background white
				this.drawHalfMoon(context, radius, colorForeground, true);

				// First half: Black overlay
				context.scale(1-quarterPercentageFirst, 1);
				context.beginPath();
				context.fillStyle = colorBackground;
				context.arc(0, 0, radius, -Math.PI/2, Math.PI/2, true); // half circle
				context.closePath();
				context.fill();	
			}
			else 
			{
				// First Quarter to Waxing Gibbous to Full Moon
				let quarterPercentageSecond = (phasePerc-0.25)*4;
				quarterPercentageSecond = this.easeOutSine(quarterPercentageSecond);

				// First half: fill background white
				this.drawHalfMoon(context, radius, colorForeground, true);

				// Second half: white phase
				context.scale(-quarterPercentageSecond, 1);
				context.beginPath();
				context.fillStyle = colorForeground;
				context.arc(0, 0, radius, -Math.PI/2, Math.PI/2, true); // half circle
				context.closePath();
				context.fill();		
			}	
		} 
		else 
		{
			let halfPercentageSecond = (phasePerc-0.5)*2;
			halfPercentageSecond = this.easeInSine(halfPercentageSecond);
			let mixColor = this.hexMix(colorSecondary, colorBackground, halfPercentageSecond);
			// this.drawCircle(context, cx, cy, radius-lineWidth/2, lineWidth, mixColor);

			if (phasePerc <= 0.75) 
			{
				// Full Moon to Waning Gibbous to Last Quarter
				let quarterPercentageThird = (phasePerc-0.5)*4;
				quarterPercentageThird = this.easeInSine(quarterPercentageThird);

				// First half: fill background white
				this.drawHalfMoon(context, radius, colorForeground, true);

				// Second half: white phase
				this.drawHalfMoon(context, radius, mixColor, false);

				context.scale(1-quarterPercentageThird, 1);
				context.beginPath();
				context.fillStyle = colorForeground;
				context.arc(0, 0, radius, -Math.PI/2, Math.PI/2, false); // half circle
				context.closePath();
				context.fill();		
			}	
			else
			{
				// Last Quarter to Waning Crescent to New Moon
				let quarterPercentageForth = (phasePerc-0.75)*4;
				quarterPercentageForth = this.easeOutSine(quarterPercentageForth);

				// Second half: fill background secondary
				this.drawHalfMoon(context, radius, mixColor, false);

				// First half: fill background white
				this.drawHalfMoon(context, radius, colorForeground, true);

				// First half: secondary overlay
				context.scale(quarterPercentageForth, 1);
				context.beginPath();
				context.fillStyle = mixColor;
				context.arc(0, 0, radius, -Math.PI/2, Math.PI/2, true); // half circle
				context.closePath();
				context.fill();	
			}
		}

		context.restore(); // reset canvas state (position, rotation).
	}

	this.easeInSine = function(x)
	{
		return 1 - Math.cos((x * Math.PI) / 2);
	}
	this.easeOutSine = function(x)
	{
		return Math.sin((x * Math.PI) / 2);
	}
	this.easeInCubic = function(x)
	{
		return x * x * x;
	}
	this.easeOutCubic = function(x)
	{
		return 1 - Math.pow(1 - x, 3);
	}

	this.drawHalfMoon = function(context, radius, fillColor, clockwise)
	{
		// First half of moon
		context.beginPath();
		context.fillStyle = fillColor;
		context.arc(0, 0, radius, -Math.PI/2, Math.PI/2, clockwise); // half circle
		context.closePath();
		context.fill();
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