async function changeWeather(){
  let city = document.getElementById("cityInput").value;
  if(!city) city = "Patna";
  document.getElementById("temp").innerText = "--°C";
  document.getElementById("desc").innerText = "Loading...";
  document.getElementById("forecast").innerHTML = "";
  try {
    let geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    let geoData = await geoRes.json();
    if(!geoData.results) { alert("City not found! Please check the spelling."); return; }
    let lat = geoData.results[0].latitude;
    let lon = geoData.results[0].longitude;
    let name = geoData.results[0].name;
    
    let weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    let weatherData = await weatherRes.json();
    
    document.getElementById("cityName").innerText = name;
    document.getElementById("temp").innerText = weatherData.current_weather.temperature + "°C";
    document.getElementById("desc").innerText = "Wind: " + weatherData.current_weather.windspeed + " km/h";
    document.getElementById("icon").innerText = getIcon(weatherData.current_weather.weathercode);
    
    let map = document.getElementById("map");
    map.style.display = "block";
    map.src = `https://maps.google.com/maps?q=${lat},${lon}&z=12&output=embed`;

    // Forecast - 3 din ka
    let forecastRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`);
    let forecastData = await forecastRes.json();
    let forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";
    for(let i=0; i<3; i++){
      let max = forecastData.daily.temperature_2m_max[i];
      let min = forecastData.daily.temperature_2m_min[i];
      let code = forecastData.daily.weathercode[i];
      let date = new Date(forecastData.daily.time[i]).toLocaleDateString('en-US', {weekday: 'short'});
      forecastDiv.innerHTML += `
        <div style="background:rgba(255,255,255,0.2); padding:8px; border-radius:10px; text-align:center; min-width:70px;">
          <p style="margin:0; font-size:12px;">${date}</p>
          <p style="margin:2px 0; font-size:20px;">${getIcon(code)}</p>
          <p style="margin:0; font-size:12px;">${max}° / ${min}°</p>
        </div>
      `;
    }

 } catch(e){
  alert("City not found! Please check the spelling.");
  document.getElementById("desc").innerText = "City not found! Please check the spelling.";
}
}

function getIcon(code){
  if(code === 0) return "☀️";
  if(code === 1 || code === 2) return "🌤️";
  if(code === 3) return "☁️";
  if(code >= 45 && code <= 48) return "🌫️";
  if(code >= 51 && code <= 67) return "🌧️";
  if(code >= 71 && code <= 77) return "❄️";
  if(code >= 80 && code <= 82) return "🌦️";
  if(code >= 95) return "⛈️";
  return "🌡️";
}

document.getElementById("cityInput").addEventListener("keypress", function(e){
  if(e.key === "Enter") changeWeather();
});
changeWeather();
