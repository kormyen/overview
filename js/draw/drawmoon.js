function DrawMoon(drawShared)
{
    this.drawShared = drawShared;
	const EPSILON = 0.02;

	this.display = function(context, cx, cy, radius, phasePerc, rotationOffset, colorPrimary, colorSecondary, colorBackground)
	{
		context.save(); // save current canvas state (position, rotation).
		context.translate(cx, cy);

		// context.rotate(Math.PI * 2 * phasePerc + this.degreesToRadians(-rotationOffset)); // rotate to face earth
		context.rotate(this.degreesToRadians(-rotationOffset) + Math.PI/2); // rotate to face sun

		this.drawFullMoon(context, radius, colorSecondary, true)

		if (phasePerc <= 0.5) 
		{
			if (phasePerc <= 0.25) 
			{
				// New Moon to Waxing Cresent to First Quarter
				// 0.00 to 0.25

				let quarterPercentageFirst = phasePerc*4;
				quarterPercentageFirst = this.easeInSine(quarterPercentageFirst);

				// Skip glitchy dithery phase
				if (phasePerc >= EPSILON) 
				{
					// First half: fill background white
					this.drawHalfMoonShort(context, radius, colorPrimary, true);

					// First half: Black overlay
					context.scale(1-quarterPercentageFirst, 1);
					context.beginPath();
					context.fillStyle = colorBackground;
					context.arc(0, 0, radius, 0, Math.PI * 2, true); // half circle
					context.closePath();
					context.fill();	
				}
			}
			else 
			{
				// First Quarter to Waxing Gibbous to Full Moon
				// 0.25 to 0.50

				let quarterPercentageSecond = (phasePerc-0.25)*4;
				quarterPercentageSecond = this.easeOutSine(quarterPercentageSecond);

				// First half: fill background white
				this.drawHalfMoonExtra(context, radius, colorPrimary, true);

				// Second half: white phase
				context.scale(-quarterPercentageSecond, 1);
				context.beginPath();
				context.fillStyle = colorPrimary;
				context.arc(0, 0, radius, 0, Math.PI * 2, true); // half circle
				context.closePath();
				context.fill();		

				// context.translate(1, 0);
			}	
		} 
		else 
		{
			let halfPercentageSecond = (phasePerc-0.5)*2;
			halfPercentageSecond = this.easeInSine(halfPercentageSecond);
			let mixColor = this.drawShared.hexMix(colorSecondary, colorBackground, halfPercentageSecond);

			if (phasePerc <= 0.75) 
			{
				// Full Moon to Waning Gibbous to Last Quarter
				// 0.50 to 0.75

				let quarterPercentageThird = (phasePerc-0.5)*4;
				quarterPercentageThird = this.easeInSine(quarterPercentageThird);

				// First half: fill background white
				this.drawHalfMoonExtra(context, radius, colorPrimary, true);

				// Second half: white phase
				this.drawHalfMoonExtra(context, radius, mixColor, false);

				context.scale(1-quarterPercentageThird, 1);
				context.beginPath();
				context.fillStyle = colorPrimary;
				context.arc(0, 0, radius, 0, Math.PI * 2, false); // half circle
				context.closePath();
				context.fill();		
			}	
			else
			{
				// Last Quarter to Waning Crescent to New Moon
				// 0.75 to 1.00

				let quarterPercentageForth = (phasePerc-0.75)*4;
				quarterPercentageForth = this.easeOutSine(quarterPercentageForth);

				// Full background circle: fill background secondary
				this.drawFullMoon(context, radius, mixColor, false);
				
				// Skip glitchy dithery phase
				if (phasePerc <= 1-EPSILON) 
				{
					// First half: fill background white
					this.drawHalfMoonShort(context, radius, colorPrimary, true);

					// First half: secondary overlay
					context.scale(quarterPercentageForth, 1);
					context.beginPath();
					context.fillStyle = mixColor;
					context.arc(0, 0, radius, 0, Math.PI * 2, true); // half circle
					context.closePath();
					context.fill();	
				}
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

	this.drawFullMoon = function(context, radius, fillColor, clockwise)
	{
		// First half of moon
		context.beginPath();
		context.fillStyle = fillColor;
		context.arc(0, 0, radius, 0, 2 * Math.PI, clockwise); // half circle
		context.closePath();
		context.fill();
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

	// Extra overdraw to fix a visual glitch with current setup, can see a dithery line down the 
	// middle between the two halves of the moon when the moon halves align vertical and horizonal with square pixels.
	// This is used by 0.00 to 0.25
	// This fix method draws a bit less UNDER half so that the white layer on top can fully cover it (the bg).
	this.drawHalfMoonShort = function(context, radius, fillColor, clockwise)
	{
		// First half of moon
		context.beginPath();
		context.fillStyle = fillColor;
		context.arc(0, 0, radius, -Math.PI/2-0.005, Math.PI/2+0.005, clockwise); // half circle
		context.closePath();
		context.fill();
	}

	// Extra overdraw to fix a visual glitch with current setup, can see a dithery line down the 
	// middle between the two halves of the moon when the moon halves align vertical and horizonal with square pixels.
	// This is used by 0.25 to 0.75
	// This fix method draws a bit EXTRA over half to hide cover the glitch.
	this.drawHalfMoonExtra = function(context, radius, fillColor, clockwise)
	{
		// First half of moon
		context.beginPath();
		context.fillStyle = fillColor;
		context.arc(0, 0, radius, -Math.PI/2+0.005, Math.PI/2-0.005, clockwise); // half circle
		context.closePath();
		context.fill();
	}

	this.degreesToRadians = function(degrees)
	{
		return degrees * (Math.PI / 180);
	}
}