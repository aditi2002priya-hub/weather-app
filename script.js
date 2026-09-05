async function changeWeather(){
  let city = document.getElementById("cityInput").value;
  if(!city) city = "Patna";
  
  try {
    let geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
    let geoData = await geoRes.json();
    if(!geoData.results) { alert("City nahi mila!"); return; }
    
    let lat = geoData.results[0].latitude;
    let lon = geoData.results[0].longitude;
    let name = geoData.results[0].name;

    let weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    let weatherData = await weatherRes.json();
    
    document.getElementById("cityName").innerText = name;
    document.getElementById("temp").innerText = weatherData.current_weather.temperature + "°C";
    document.getElementById("desc").innerText = "Wind: " + weatherData.current_weather.windspeed + " km/h";
    
    let map = document.getElementById("map");
    map.style.display = "block";
    map.src = `https://maps.google.com/maps?q=${lat},${lon}&z=12&output=embed`;

  } catch(e){
    alert("Error aa gaya");
  }
}
changeWeather();