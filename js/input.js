"use strict";

function Input(canvas)
{  
  this.mouse = { x: 0, y: 0, down: false }
  this.mouseDown = { x: 0, y: 0 }
  this.mouseChangeValue = 0;
  this.sendValue = 0;
  this.settings = { targetFps: 60 }

  canvas.addEventListener('mousemove', ev => this.mouseMove(ev), false);
  canvas.addEventListener('mousedown', ev => this.mouseDown(ev), false);
  canvas.addEventListener('mouseup', ev => this.mouseUp(ev), false);
  canvas.addEventListener('mouseout',  ev => this.mouseUp(ev), false);

  setInterval(() => { this.update(); }, 1000 / this.settings.targetFps);

  this.update = function()
  {
    if (this.mouse.down)
    {
      this.sendEvent();
    }
    else if (this.sendValue != 0 && this.sendValue)
    {
      this.sendValue *= 0.925;
      if (Math.abs(this.sendValue) <= 0.01)
      {
        this.sendValue = 0;
      }
      this.sendEvent();
    }
  }

  this.sendEvent = function()
  {
    let evt = new CustomEvent('changeValue', { detail:this.setupValue(this.sendValue) });
    canvas.dispatchEvent(evt);
  }

  this.setupValue = function(value)
  {
    let sign = Math.sign(value);
    return value * value * sign;
  }

  this.mouseMove = function(event)
  {
    this.mouse.x = event.pageX;
    this.mouse.y = event.pageY;
    this.mouseChangeValue = (this.mouse.x - this.mouseDown.x);
    if (this.mouse.down)
    {
      this.sendValue = this.mouseChangeValue;
    }
  }

  this.mouseDown = function(event)
  {
    switch (event.which) {
      case 1:
          // Left Mouse button pressed.
          this.mouse.down = true;
          this.mouseDown.x = event.pageX;
          this.mouseDown.y = event.pageY;
          this.mouse.x = event.pageX;
          this.mouse.y = event.pageY;
          this.mouseChangeValue = (this.mouse.x - this.mouseDown.x);
          this.sendValue = this.mouseChangeValue;
          break;
      case 2:
          // Middle Mouse button pressed.
          break;
      case 3:
          // Right Mouse button pressed.
          break;
      default:
          // You have a strange Mouse!
          break;
    }
  }
  
  this.mouseUp = function(event)
  {
    this.mouse.down = false;
  }
}