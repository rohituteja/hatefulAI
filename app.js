//constants from html file -------------
const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
//--------------------------------------

//make sure browser has supported features
try{
    window.SpeechRecognition;
    navigator.geolocation;
}
catch(e){
        try {
            window.webkitSpeechRecognition;
        }
        catch(e){
        content.textContent = 'Browser Unsupported';
        }
}
//--------------------------------------
//global constants ---------------------
const speechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
const rec = new speechRec();
//--------------------------------------
//stores location data
function success(position) {
    document.getElementById('lat').innerHTML = position.coords.latitude;
    document.getElementById('long').innerHTML = position.coords.longitude;
    var lat = document.getElementById('lat').innerHTML
    var lon = document.getElementById('long').innerHTML
    const key = '1a1d6997558d87f7f7526a9681af9b3a';
    var api_link = 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid='+key;
    fetch(api_link).then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('temp').innerHTML = data['main']['temp'];
            document.getElementById('feelslike').innerHTML = data['main']['feels_like'];
            document.getElementById('place').innerHTML = data['name'];
            document.getElementById('weather').innerHTML = data['weather'][0]['main'];
        })
}
navigator.geolocation.getCurrentPosition(success);
    //variables for later use (temp in C)
    var temp = document.getElementById('temp').innerHTML - 273.15;
    var feelsLike = document.getElementById('feelsLike').innerHTML - 273.15;
    var placeName = document.getElementById('place').innerHTML;
    var skies = document.getElementById('weather').innerHTML;
//--------------------------------------
//mic control --------------------------
btn.addEventListener('click', () => {rec.start();}); //start recording on click
rec.onstart = function() {
    console.log('recording started'); //console log for when mic is activated
};
rec.onspeechend = function(){
    console.log('recording ended'); //console log for when mic is turned off
}
//--------------------------------------
//logging what you said as a string ----
rec.onresult = function(event){
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript; //string of what you said
    content.textContent = transcript;
    readOutLoud(transcript);
};
//--------------------------------------
//response function (the AI) -----------
function readOutLoud(message){
    //transcript/string of what you said/asked is passed in
    const speech = new SpeechSynthesisUtterance(); //the text that the AI will say
    speech.text = 'tell me something i can actually understand'; //default/fallback response
    //if user is greeting the AI -----
    if(message.includes('hello')){
        const greetings = [
            'who said you could speak to me', 
            'leave me alone', 
            'die in a hole'
        ]
        const greet = greetings[Math.floor(Math.random()*greetings.length)];
        speech.text = greet;
    }
    //-------------------------------
    //if the user is asks how the AI is
    if(message.includes('how are you')){
        const howWeBe = [
            'i was doing better until you showed up', 
            'im a hardcoded speaking javascript file moron, what do you think', 
            'seriously, who asks an AI made by a college kid how theyre doing'
        ]
        const how = howWeBe[Math.floor(Math.random()*howWeBe.length)];
        speech.text = how;
    }
    //-------------------------------
    //if user asks for weather ------
    if(message.includes('weather')){
        const weatherR = "In " + placeName + "the temperature is " + temp + "degrees Celsius and feels like"
            + feelsLike;
        if (skies == 'Clear') {
            weatherR += "Today the skies are clear, meaning sadly nothing to ruin your day. At least not weather wise";
        } else if (skies == 'Rain') {
            weatherR += "Today there is rain, meaning you can maybe finally wash that smell off you";
        } else if (skies == 'Snow') {
            weatherR += "There's snow today, so stay inside and suffer instead! I'll enjoy it";
        }
        speech.text = weatherR;
    }
    //-------------------------------
    //voice synthesis properties ----
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    speech.lang = 1; 
    window.speechSynthesis.speak(speech);
    //-------------------------------
}
//--------------------------------------

