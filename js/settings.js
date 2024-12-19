function Settings()
{
  this.offset;
  this.year;
  this.sunBands;
  this.moon;
  this.midnightTop;

  this.colorHighlight = '#FFFFFF';
  this.colorPrimary = '#D9D9D9'; // #EEE
  this.colorSecondary = '#5D6163'; // #999 #666
  this.colorTertiary = '#3E4446'; // #333
  this.colorBackground = '#3B4143'; // #1E1E1E
  this.colorDark = '#2B3437';
  this.colorAscent = '#EE4B2B';

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

    var cssRoot = document.querySelector(':root');
    cssRoot.style.setProperty('--color-highlight', this.colorHighlight);
    cssRoot.style.setProperty('--color-primary', this.colorPrimary);
    cssRoot.style.setProperty('--color-secondary', this.colorSecondary);
    cssRoot.style.setProperty('--color-tertiary', this.colorTertiary);
    cssRoot.style.setProperty('--color-background', this.colorBackground);
    cssRoot.style.setProperty('--color-dark', this.colorDark);
    cssRoot.style.setProperty('--color-ascent', this.colorAscent);
  }
}