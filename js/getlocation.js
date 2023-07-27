function GetLocation()
{
  this.setup = function()
  {
    let btnLocation = document.getElementById('btn-location');
    btnLocation.addEventListener('click', ()=>{ getLocation(); });
    btnLocation.addEventListener('touchstart', ()=>{ getLocation(); });

    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted")
      {
        navigator.geolocation.getCurrentPosition(receivePosition);
      } 
      else if (result.state === "denied")
      {
        btnLocation.textContent = 'Geolocation permission denied';
        btnLocation.className = 'overview-button-disabled';
        btnLocation.disabled = true;
      }
    });
  }
}

this.getLocation = function()
{
  let btnLocation = document.getElementById('btn-location');
  if (navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(receivePosition);
    btnLocation.textContent = 'Check browser permissions...';
    btnLocation.className = 'overview-button-disabled';
    btnLocation.disabled = true;
  } 
  else 
  {
    btnLocation.textContent = 'Geolocation not supported';
    btnLocation.className = 'overview-button-disabled';
    btnLocation.disabled = true;
  }
}

function receivePosition(position)
{
  let btnLocation = document.getElementById('btn-location');
  btnLocation.textContent = 'Geolocation enabled!';
  btnLocation.className = 'overview-button-disabled';
  btnLocation.disabled = true;
  setTimeout(()=> { document.getElementById('btn-location').style.display = 'none'; }, 1000);
  overview.setLocation(position.coords.latitude, position.coords.longitude);
}