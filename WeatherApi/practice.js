let key = "7ced05417af56c90c076f185126f8faa"
function weatherApi(city){
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    fetch(url).then(response=>response.json()).then(function(data){
        console.log(data);
        let { name } = data;
        if(name != undefined){
            localStorage.setItem("cityName", name);
        }
        console.log("City Name: "+name);
        let {description, icon} = data.weather[0];
        let {humidity} = data.main;
        let {speed} = data.wind;
        console.log("Weather Desc: " +description);
        console.log("Wind Speed: "+speed);
        let {temp} = data.main;
        temp = (temp - 273).toFixed(2);
        console.log("Temperature: "+temp+"°C");

        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + ",weather,trees')";
        let infoWeather = document.querySelector(".infoWeather");
        let html = `<h2>Weather in ${name}</h2>
            <div class="actWeather">
                <h2 id="temp">${temp}°C</h2>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Image">
                <h4 id="desc">${description}</h4>
                <h4 id="wind">WindSpeed: ${speed}</h4>
                <h4 id="wind">Humidity: ${humidity}%</h4>
            </div>`;
        infoWeather.innerHTML = html;
    })
}
let searchBtn = document.getElementById("btn");
let city;
searchBtn.addEventListener("click", function(){
    // console.log("hello")
    let searchBar = document.getElementById("city");
    city = searchBar.value;
    // console.log(city);
    weatherApi(city); 
})
let searching = document.getElementById("city");
searching.addEventListener("keyup", function(event){
    if(event.key == "Enter"){
        city = searching.value;
        console.log(city);
        weatherApi(city); 
    }
})

let cityName = localStorage.getItem("cityName");
if(!cityName){
    cityName = "Tokyo";
}
weatherApi(cityName); 

// // alt + 0176
