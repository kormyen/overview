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

    let titleSettings = new ElementH1();
    titleSettings.setup(this.container, "Settings");

    // GEOLOCATION
    let titleGeolocation = new ElementH2();
    titleGeolocation.setup(this.container, "Geolocation");
    let labelGeolocation1 = new ElementLabel();
    labelGeolocation1.setup(this.container, "Used for sunlight and tide calculations.");

    this.latitude = new ElementText();
    this.latitude.setup(this.container, "Latitude", "settingLatitude", globals.DEFAULT_LATITUDE);
    this.settings.push(this.latitude);
    this.longitude = new ElementText();
    this.longitude.setup(this.container, "Longitude", "settingLongitude", globals.DEFAULT_LONGITUDE);
    this.settings.push(this.longitude);

    this.geolocation = new ElementCheckbox();
    this.geolocation.setup(this.container, "Get Browser Geolocation", "settingGeolocation", false, "getBrowserGeolocation");
    this.geolocation.button.addEventListener("getBrowserGeolocation", this, true);
    this.settings.push(this.geolocation);

    // Auto-request browser geolocation if previously enabled
    if (this.geolocation.value)
    {
      this.requestBrowserGeolocation();
    }

    // TIME OF DAY
    let titleTimeOfDay = new ElementH2();
    titleTimeOfDay.setup(this.container, "Day");

    this.timeOfDay = new ElementCheckbox();
    this.timeOfDay.setup(this.container, "Show day", "settingTimeOfDay", true);
    // this.timeOfDay.button.addEventListener("settingChecked", this, true);
    this.settings.push(this.timeOfDay);

    this.timeHand = new ElementCheckbox();
    this.timeHand.setup(this.container, "Time Hand", "settingTimeHand", false);
    this.settings.push(this.timeHand);

    this.earthRotate = new ElementCheckbox();
    this.earthRotate.setup(this.container, "Rotation", "settingEarthRotate", false);
    // this.earthRotate.button.addEventListener("settingChecked", this, true);
    this.earthRotate.hide();
    this.settings.push(this.earthRotate);

    this.midnightTop = new ElementCheckbox();
    this.midnightTop.setup(this.container, "Midnight Top", "settingMidnightTop", true);
    this.midnightTop.hide();
    this.settings.push(this.midnightTop);

    this.sunBands = new ElementCheckbox();
    this.sunBands.setup(this.container, "Sun Bands", "settingSunBands", false);
    this.settings.push(this.sunBands);

    this.earthOutline = new ElementCheckbox();
    this.earthOutline.setup(this.container, "Planet Outline", "settingPlanetOutline", false);
    this.settings.push(this.earthOutline);

    this.graduationMinimal = new ElementCheckbox();
    this.graduationMinimal.setup(this.container, "Graduation Minimal", "settingGraduationMinimal", true);
    this.settings.push(this.graduationMinimal);

    this.graduationHighlight = new ElementCheckbox();
    this.graduationHighlight.setup(this.container, "Graduation Highlight", "settingGraduationHighlight", true);
    this.settings.push(this.graduationHighlight);

    this.graduationSunlight = new ElementCheckbox();
    this.graduationSunlight.setup(this.container, "Graduation Sunlight", "settingGraduationSunlight", true);
    this.settings.push(this.graduationSunlight);

    this.graduationRiseSetDisplay = new ElementCheckbox();
    this.graduationRiseSetDisplay.setup(this.container, "Graduation Rise Set Display", "settingGraduationRiseSetDisplay", true);
    this.settings.push(this.graduationRiseSetDisplay);

    // YEAR
    let titleYear = new ElementH2();
    titleYear.setup(this.container, "Year");

    this.year = new ElementCheckbox();
    this.year.setup(this.container, "Show Year", "settingShowYear", false);
    this.settings.push(this.year);

    // MOON
    let titleMoon = new ElementH2();
    titleMoon.setup(this.container, "Moon");

    this.moon = new ElementCheckbox();
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
    let titleTide = new ElementH2();
    titleTide.setup(this.container, "Tide");

    let labelTide = new ElementLabel();
    labelTide.setupWithLink(this.container, "Requires free or paid ", "Stormglass", "https://stormglass.io/", " API key.")

    this.stormglassKey = new ElementText();
    this.stormglassKey.setup(this.container, "Stormglass API key", "settingStormglassKey", globals.DEFAULT_API_KEY);
    this.settings.push(this.stormglassKey);

    this.tide = new ElementCheckbox();
    this.tide.setup(this.container, "Show Tide", "settingShowTide", true);
    this.settings.push(this.tide);

    // VISUAL
    this.targetFps = 60;

    // SETUP
    this.hideSettings();
  }

  this.update = function()
  {
    if (this.stormglassKey.input.value != globals.DEFAULT_API_KEY 
      && this.stormglassKey.input.value != null)
    {
      this.tide.show();
    }
    else
    {
      this.tide.hide();
    }
  }
  
  this.setupState = function()
  {
    window.addEventListener(globals.MODE_TELLURION, this, true);
    window.addEventListener(globals.MODE_SETTINGS, this, true);
  }

  Settings.prototype.handleEvent = function(event) 
  {
    if (event.type === globals.MODE_TELLURION)
    {
      this.saveSettings();
      this.hideSettings();
    }
    else if (event.type === globals.MODE_SETTINGS)
    {
      this.showSettings();
    }
    else if (event.type == "getBrowserGeolocation")
    {
      console.log("Geolocation setting changed: " + this.geolocation.value);
      this.geolocation.save();
      if (this.geolocation.value)
      {
        // Geolocation checkbox was toggled ON - request browser geolocation
        this.requestBrowserGeolocation();
      }
    }
    else
    {
      console.warn("Unhandled settings event: " + event.type);
    }
  }

  this.requestBrowserGeolocation = function()
  {
    // Check permission status first before requesting position
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted")
      {
        console.log("Permission already granted, get position without prompting");
        // Permission already granted, get position without prompting
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.latitude.setValue(position.coords.latitude);
            this.latitude.save();
            this.longitude.setValue(position.coords.longitude);
            this.longitude.save();
            console.log("Geolocation enabled: " + position.coords.latitude + ", " + position.coords.longitude);
          },
          (error) => {
            console.error("Geolocation error: " + error.message);
            this.geolocation.setValue(false);
            this.geolocation.save();
          }
        );
      }
      else if (result.state === "prompt")
      {
        console.log("Permission not yet decided, prompt the user");
        // Permission not yet decided, prompt the user
        if (navigator.geolocation)
        {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.latitude.setValue(position.coords.latitude);
              this.latitude.save();
              this.longitude.setValue(position.coords.longitude);
              this.longitude.save();
              console.log("Geolocation enabled: " + position.coords.latitude + ", " + position.coords.longitude);
            },
            (error) => {
              console.error("Geolocation error: " + error.message);
              this.geolocation.setValue(false);
              this.geolocation.save();
            }
          );
        }
      }
      else if (result.state === "denied")
      {
        console.error("Geolocation permission denied");
        this.geolocation.setValue(false);
      }
    });
  }

  this.hideSettings = function()
  {
    this.container.style.display = "none";
  }
  this.showSettings = function()
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
  }

  this.saveSettings = function()
  {
    for (let i = 0; i < this.settings.length; i++)
    {
      this.settings[i].save();      
    }
    console.log("Settings saved!");
  }
}