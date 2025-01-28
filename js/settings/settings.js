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

  this.settings = [];

  this.colorHighlight = '#FFFFFF';
  this.colorPrimary = '#D9D9D9'; // #EEE
  this.colorSecondary = '#7e8588' //'#5D6163'; // #999 #666
  this.colorTertiary = '#3E4446'; // #333
  this.colorBackground = '#3B4143'; // #1E1E1E
  this.colorDark = '#2B3437';
  this.colorAscent = '#EE4B2B';

  this.setup = function(parent)
  {
    this.container = parent;

    let titleSettings = new SettingsH1();
    titleSettings.setup(this.container, "Settings");

    // GEOLOCATION
    let titleGeolocation = new SettingsH2();
    titleGeolocation.setup(this.container, "Geolocation");
    let labelGeolocation1 = new SettingsLabel();
    labelGeolocation1.setup(this.container, "Used for sunlight and tide calculations.");

    this.latitude = new SettingsText();
    this.latitude.setup(this.container, "Latitude", "settingLatitude", -36.848461);
    this.settings.push(this.latitude);
    this.longitude = new SettingsText();
    this.longitude.setup(this.container, "Longitude", "settingLongitude", 174.763336);
    this.settings.push(this.longitude);

    this.geolocation = new SettingsCheckbox();
    this.geolocation.setup(this.container, "Get Browser Geolocation", "settingGeolocation", false);
    this.settings.push(this.geolocation);

    // TIME OF DAY
    let titleTimeOfDay = new SettingsH2();
    titleTimeOfDay.setup(this.container, "Day");

    this.timeOfDay = new SettingsCheckbox();
    this.timeOfDay.setup(this.container, "Show day", "settingTimeOfDay", true);
    this.timeOfDay.button.addEventListener("settingChecked", this, true);
    this.settings.push(this.timeOfDay);

    this.timeHand = new SettingsCheckbox();
    this.timeHand.setup(this.container, "Time Hand", "settingTimeHand", false);
    this.settings.push(this.timeHand);

    this.earthRotate = new SettingsCheckbox();
    this.earthRotate.setup(this.container, "Rotation", "settingEarthRotate", false);
    this.earthRotate.button.addEventListener("settingChecked", this, true);
    this.earthRotate.hide();
    this.settings.push(this.earthRotate);

    this.midnightTop = new SettingsCheckbox();
    this.midnightTop.setup(this.container, "Midnight Top", "settingMidnightTop", true);
    this.midnightTop.hide();
    this.settings.push(this.midnightTop);

    this.sunBands = new SettingsCheckbox();
    this.sunBands.setup(this.container, "Sun Bands", "settingSunBands", false);
    this.settings.push(this.sunBands);

    this.earthOutline = new SettingsCheckbox();
    this.earthOutline.setup(this.container, "Planet Outline", "settingPlanetOutline", false);
    this.settings.push(this.earthOutline);

    this.graduationMinimal = new SettingsCheckbox();
    this.graduationMinimal.setup(this.container, "Graduation Minimal", "settingGraduationMinimal", true);
    this.settings.push(this.graduationMinimal);

    this.graduationHighlight = new SettingsCheckbox();
    this.graduationHighlight.setup(this.container, "Graduation Highlight", "settingGraduationHighlight", true);
    this.settings.push(this.graduationHighlight);

    this.graduationSunlight = new SettingsCheckbox();
    this.graduationSunlight.setup(this.container, "Graduation Sunlight", "settingGraduationSunlight", true);
    this.settings.push(this.graduationSunlight);

    this.graduationRiseSetDisplay = new SettingsCheckbox();
    this.graduationRiseSetDisplay.setup(this.container, "Graduation Rise Set Display", "settingGraduationRiseSetDisplay", true);
    this.settings.push(this.graduationRiseSetDisplay);

    // YEAR
    let titleYear = new SettingsH2();
    titleYear.setup(this.container, "Year");

    this.year = new SettingsCheckbox();
    this.year.setup(this.container, "Show Year", "settingShowYear", false);
    this.settings.push(this.year);

    // MOON
    let titleMoon = new SettingsH2();
    titleMoon.setup(this.container, "Moon");

    this.moon = new SettingsCheckbox();
    this.moon.setup(this.container, "Show Moon", "settingShowMoon", true);
    this.settings.push(this.moon);

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
    let titleTide = new SettingsH2();
    titleTide.setup(this.container, "Tide");

    let labelTide = new SettingsLabel();
    labelTide.setupWithLink(this.container, "Requires free or paid ", "Stormglass", "https://stormglass.io/", " API key.")

    this.stormglassKey = new SettingsText();
    this.stormglassKey.setup(this.container, "Stormglass API key", "settingStormglassKey", globals.DEFAULT_API_KEY);
    this.settings.push(this.stormglassKey);

    this.tide = new SettingsCheckbox();
    this.tide.setup(this.container, "Show Tide", "settingShowTide", true);
    this.settings.push(this.tide);

    // SETUP
    this.hideAll();
  }
  
  this.setupState = function()
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
      // this.earthRotate.show();
      // this.midnightTop.show();
      this.sunBands.show();
      this.earthOutline.show();
      this.graduationMinimal.show();
      this.graduationHighlight.show();
      this.graduationSunlight.show();
      this.graduationRiseSetDisplay.show();
    }
    else
    {
      // this.earthRotate.hide();
      // this.midnightTop.hide();
      this.sunBands.hide();
      this.earthOutline.hide();
      this.graduationMinimal.hide();
      this.graduationHighlight.hide();
      this.graduationSunlight.hide();
      this.graduationRiseSetDisplay.hide();
    }

    // if (this.earthRotate.value)
    // {
    //   this.midnightTop.setValue(false);
    //   this.midnightTop.hide();
    // }
    // else if (this.timeOfDay.value)
    // {
    //   this.midnightTop.show();
    // }

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
    for (let i = 0; i < this.settings.length; i++)
    {
      this.settings[i].save();      
    }
  }
}