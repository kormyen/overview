function Settings()
{
  this.offset;
  this.year;
  this.sunBands;
  this.moon;
  this.midnightTop;

  this.setup = function(parent)
  {
    this.offset = new SettingsCheckbox();
    this.offset.setup(parent, "Offset", "cb-offset", false);

    this.year = new SettingsCheckbox();
    this.year.setup(parent, "Year", "cb-year", false);

    this.sunBands = new SettingsCheckbox();
    this.sunBands.setup(parent, "Sun Bands", "cb-sunBands", false);

    this.moon = new SettingsCheckbox();
    this.moon.setup(parent, "Moon", "cb-moon", false);

    this.midnightTop = new SettingsCheckbox();
    this.midnightTop.setup(parent, "Midnight Top", "cb-midnightTop", true);
  }
}