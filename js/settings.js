function Settings()
{
  this.doOffset = false;
  this.doYear = false;
  this.doSunBands = false;

  this.setup = function()
  {
    const cbOffset = document.getElementById("cb-offset");
    cbOffset.addEventListener('change', function() {
      settings.doOffset = this.checked;
    });

    const cbYear = document.getElementById("cb-year");
    cbYear.addEventListener('change', function() {
      settings.doYear = this.checked;
    });

    const cbSunBands = document.getElementById("cb-sunBands");
    cbSunBands.addEventListener('change', function() {
      settings.doSunBands = this.checked;
    });
  }
}