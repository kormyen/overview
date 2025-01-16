function State()
{
  const MODE_0 = "tellurion";
  const MODE_1 = "settings";

  this.mode = MODE_0;

  const eventMode0 = new CustomEvent("modeChange0");
  const eventMode1 = new CustomEvent("modeChange1");

  this.setup = function(input)
  {
    window.addEventListener("settingsToggled", this, true);
  }

  State.prototype.handleEvent = function(event) 
  {
    if (event.type === "settingsToggled")
    {
      if (this.mode == MODE_0)
      {
        this.mode = MODE_1;
        window.dispatchEvent(eventMode0);
      }
      else
      {
        this.mode = MODE_0;
        window.dispatchEvent(eventMode1);
      }
    }
  }
}