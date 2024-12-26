function Settings()
{
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
    // TIME OF DAY
    this.timeOfDay = new SettingsCheckbox();
    this.timeOfDay.setup(parent, "Time of day", "cb-timeOfDay", false);
    this.timeOfDay.button.addEventListener("settingChecked", this, true);

    this.earthRotate = new SettingsCheckbox();
    this.earthRotate.setup(parent, "Rotation", "cb-earthRotate", false);
    this.earthRotate.button.addEventListener("settingChecked", this, true);

    this.midnightTop = new SettingsCheckbox();
    this.midnightTop.setup(parent, "Midnight Top", "cb-midnightTop", true);

    this.sunBands = new SettingsCheckbox();
    this.sunBands.setup(parent, "Sun Bands", "cb-sunBands", false);

    this.earthOutline = new SettingsCheckbox();
    this.earthOutline.setup(parent, "Earth Outline", "cb-earthOutline", false);

    this.graduationMinimal = new SettingsCheckbox();
    this.graduationMinimal.setup(parent, "Graduation Minimal", "cb-graduationMinimal", true);

    this.graduationHighlight = new SettingsCheckbox();
    this.graduationHighlight.setup(parent, "Graduation Highlight", "cb-graduationHighlight", false);

    this.graduationSunlight = new SettingsCheckbox();
    this.graduationSunlight.setup(parent, "Graduation Sunlight", "cb-graduationSunlight", true);

    // TIDE
    this.tide = new SettingsCheckbox();
    this.tide.setup(parent, "Tide", "cb-tide", true);

    // YEAR
    this.year = new SettingsCheckbox();
    this.year.setup(parent, "Year", "cb-year", false);

    // MOON
    this.moon = new SettingsCheckbox();
    this.moon.setup(parent, "Moon", "cb-moon", false);

    // COLORS
    var cssRoot = document.querySelector(':root');
    cssRoot.style.setProperty('--color-highlight', this.colorHighlight);
    cssRoot.style.setProperty('--color-primary', this.colorPrimary);
    cssRoot.style.setProperty('--color-secondary', this.colorSecondary);
    cssRoot.style.setProperty('--color-tertiary', this.colorTertiary);
    cssRoot.style.setProperty('--color-background', this.colorBackground);
    cssRoot.style.setProperty('--color-dark', this.colorDark);
    cssRoot.style.setProperty('--color-ascent', this.colorAscent);

    // SETUP
    this.hideShowSettings();
  }

  Settings.prototype.handleEvent = function(event) 
  {
    if (event.type === "settingChecked")
    {
      this.hideShowSettings();
    }
  }

  this.hideShowSettings = function()
  {
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
  }
}