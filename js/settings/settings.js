function Settings()
{
  this.container;

  this.timeOfDay;
  this.earthRotate;
  this.year;
  this.sunBands;
  this.moon;
  this.midnightTop;
  this.earthOutline;
  this.graduationHighlight;
  this.graduationSunlight;

  this.colorHighlight = '#FFFFFF';
  this.colorPrimary = '#D9D9D9'; // #EEE
  this.colorSecondary = '#5D6163'; // #999 #666
  this.colorTertiary = '#3E4446'; // #333
  this.colorBackground = '#3B4143'; // #1E1E1E
  this.colorDark = '#2B3437';
  this.colorAscent = '#EE4B2B';

  this.setup = function(parent)
  {
    this.container = parent;

    // TIME OF DAY
    this.timeOfDay = new SettingsCheckbox();
    this.timeOfDay.setup(this.container, "Show Time of day", "cb-timeOfDay", true);
    this.timeOfDay.button.addEventListener("settingChecked", this, true);

    this.earthRotate = new SettingsCheckbox();
    this.earthRotate.setup(this.container, "Rotation", "cb-earthRotate", false);
    this.earthRotate.button.addEventListener("settingChecked", this, true);

    this.midnightTop = new SettingsCheckbox();
    this.midnightTop.setup(this.container, "Midnight Top", "cb-midnightTop", true);

    this.sunBands = new SettingsCheckbox();
    this.sunBands.setup(this.container, "Sun Bands", "cb-sunBands", false);

    this.earthOutline = new SettingsCheckbox();
    this.earthOutline.setup(this.container, "Earth Outline", "cb-earthOutline", false);

    this.graduationMinimal = new SettingsCheckbox();
    this.graduationMinimal.setup(this.container, "Graduation Minimal", "cb-graduationMinimal", true);

    this.graduationHighlight = new SettingsCheckbox();
    this.graduationHighlight.setup(this.container, "Graduation Highlight", "cb-graduationHighlight", false);

    this.graduationSunlight = new SettingsCheckbox();
    this.graduationSunlight.setup(this.container, "Graduation Sunlight", "cb-graduationSunlight", true);

    // YEAR
    this.year = new SettingsCheckbox();
    this.year.setup(this.container, "Show Year", "cb-year", false);

    // MOON
    this.moon = new SettingsCheckbox();
    this.moon.setup(this.container, "Show Moon", "cb-moon", false);

    // COLORS
    var cssRoot = document.querySelector(':root');
    cssRoot.style.setProperty('--color-highlight', this.colorHighlight);
    cssRoot.style.setProperty('--color-primary', this.colorPrimary);
    cssRoot.style.setProperty('--color-secondary', this.colorSecondary);
    cssRoot.style.setProperty('--color-tertiary', this.colorTertiary);
    cssRoot.style.setProperty('--color-background', this.colorBackground);
    cssRoot.style.setProperty('--color-dark', this.colorDark);
    cssRoot.style.setProperty('--color-ascent', this.colorAscent);

    // TIDE
    let stormglassKeyValue = localStorage.getItem(globals.STORAGE_KEY_STORMGLASS);
    if (stormglassKeyValue == null)
    {
      stormglassKeyValue = globals.DEFAULT_API_KEY;
    }

    this.stormglassKey = new SettingsText();
    this.stormglassKey.setup(this.container, "Stormglass Key", stormglassKeyValue);

    this.tide = new SettingsCheckbox();
    this.tide.setup(this.container, "Show Tide", "cb-tide", true);

    // SETUP
    this.hideAll();
  }
  
  this.setupState = function(state)
  {
    window.addEventListener("modeChange0", this, true);
    window.addEventListener("modeChange1", this, true);
  }

  Settings.prototype.handleEvent = function(event) 
  {
    if (event.type === "settingChecked")
    {
      this.hideShowSettings();
    }
    else if (event.type === "modeChange0")
    {
      this.saveSettings();
      this.hideAll();
    }
    else if (event.type === "modeChange1")
    {
      this.hideShowSettings();
    }
  }

  this.hideAll = function()
  {
    this.container.style.display = "none";
  }
  this.hideShowSettings = function()
  {
    this.container.style.display = "flex";
    
    if (this.timeOfDay.value)
    {
      this.earthRotate.show();
      this.midnightTop.show();
      this.sunBands.show();
      this.earthOutline.show();
      this.graduationMinimal.show();
      this.graduationHighlight.show();
      this.graduationSunlight.show();
    }
    else
    {
      this.earthRotate.hide();
      this.midnightTop.hide();
      this.sunBands.hide();
      this.earthOutline.hide();
      this.graduationMinimal.hide();
      this.graduationHighlight.hide();
      this.graduationSunlight.hide();
    }

    if (this.earthRotate.value)
    {
      this.midnightTop.setValue(false);
      this.midnightTop.hide();
    }
    else if (this.timeOfDay.value)
    {
      this.midnightTop.show();
    }

    if (this.stormglassKey.input.value != globals.DEFAULT_API_KEY)
    {
      this.tide.show();
    }
    else
    {
      this.tide.hide();
    }
  }

  this.saveSettings = function()
  {
    localStorage.setItem(globals.STORAGE_KEY_STORMGLASS, this.stormglassKey.input.value);
  }
}