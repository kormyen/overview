
function getLocationSetup()
{
  let btnLocation = document.getElementById('btn-location');
  btnLocation.addEventListener("click", ()=>{ getLocation(); });
}

function getLocation()
{
  let btnLocation = document.getElementById('btn-location');
  if (navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(receivePosition);
    btnLocation.textContent = 'Geolocation requested...';
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