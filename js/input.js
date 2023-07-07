"use strict";

function Input(canvas)
{  
  this.mouse = { x: 0, y: 0, down: false }
  this.mouseDown = { x: 0, y: 0 }
  this.mouseChangeValue = 0;
  this.sendValue = 0;
  this.settings = { targetFps: 60 }

  canvas.addEventListener('mousemove', ev => this.mouseMove(ev), false);
  canvas.addEventListener('touchmove', ev => this.mouseMove(ev), false);

  canvas.addEventListener('mousedown', ev => this.mouseDown(ev), false);
  canvas.addEventListener('touchstart', ev => this.mouseDown(ev), false);

  canvas.addEventListener('mouseup', ev => this.mouseUp(ev), false);
  canvas.addEventListener('mouseout',  ev => this.mouseUp(ev), false);
  canvas.addEventListener('touchup',  ev => this.mouseUp(ev), false);
  canvas.addEventListener('touchend',  ev => this.mouseUp(ev), false);
  canvas.addEventListener('touchcancel',  ev => this.mouseUp(ev), false);

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
    event.preventDefault();
    this.mouse.x = event.pageX;
    this.mouse.y = event.pageY;
    if (event.touches && event.touches.length > 0)
    {
      this.mouse.x = event.touches[0].pageX;
      this.mouse.y = event.touches[0].pageY;
    }

    this.mouseChangeValue = (this.mouse.x - this.mouseDown.x);
    if (this.mouse.down)
    {
      this.sendValue = this.mouseChangeValue;
    }
  }

  this.mouseDown = function(event)
  {
    event.preventDefault();

    // TOUCH
    if (event.touches && event.touches.length > 0)
    {
      this.setMouseDownValues(event.touches[0].pageX, event.touches[0].pageY);
    }

    // MOUSE
    switch (event.which) {
      case 1:
          // Left Mouse button pressed.
          this.setMouseDownValues(event.pageX, event.pageY);
          break;
      default:
          // Other
          break;
    }
  }

  this.setMouseDownValues = function(x, y)
  {
    this.mouse.down = true;
    this.mouseDown.x = x;
    this.mouseDown.y = y;
    this.mouse.x = x;
    this.mouse.y = y;
    this.mouseChangeValue = (this.mouse.x - this.mouseDown.x);
    this.sendValue = this.mouseChangeValue;
  }
  
  this.mouseUp = function(event)
  {
    event.preventDefault();
    this.mouse.down = false;
  }
}