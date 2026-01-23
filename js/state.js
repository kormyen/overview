function State()
{
  const MODE_TELLURION = "modeTellurion";
  const MODE_SETTINGS = "modeSettings";

  this.mode = MODE_TELLURION;

  const eventModeTellurion = new CustomEvent(MODE_TELLURION);
  const eventModeSettings = new CustomEvent(MODE_SETTINGS);

  this.setup = function(input)
  {
    window.addEventListener("settingsToggled", this, true);
  }

  State.prototype.handleEvent = function(event) 
  {
    if (event.type === "settingsToggled")
    {
      if (this.mode == MODE_TELLURION)
      {
        this.mode = MODE_SETTINGS;
        window.dispatchEvent(eventModeSettings);
      }
      else
      {
        this.mode = MODE_TELLURION;
        window.dispatchEvent(eventModeTellurion);
      }
    }
  }
}