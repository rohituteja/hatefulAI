//constants from html file -------------
const btn = document.querySelector('.talk');
const inputSpeech = document.querySelector('.inputSpeech');
const aiOutput = document.querySelector('.aiSpeech');
const wolframKey = "HVQXWX-37GELV7JQG";
const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI(wolframKey);

const numbers = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "zero": 0
};
//--------------------------------------
//make sure browser has supported features
try {
    window.SpeechRecognition;
    navigator.geolocation;
} catch (e) {
    try {
        window.webkitSpeechRecognition;
    } catch (e) {
        inputSpeech.textContent = 'Browser Unsupported';
    }
}
//--------------------------------------
//global constants (speech rec objects)-
const speechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
const rec = new speechRec();
//--------------------------------------
//stores + gets + updates location data
function getWeather() {
    function success(position) { //position passed in from call to geolocator api
        document.getElementById('lat').innerHTML = position.coords.latitude; //store lat via html element
        document.getElementById('long').innerHTML = position.coords.longitude; //store long via html element
        var lat = document.getElementById('lat').innerHTML //get stored data for use
        var lon = document.getElementById('long').innerHTML //get stored data for use
        const key = '1a1d6997558d87f7f7526a9681af9b3a'; //api key as variable for ease of use
        var api_link = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + key; //OpenWeatherMap api link
        fetch(api_link).then(response => response.json()) //fetch data from api link
            .then(data => {
                console.log(data);
                //store weather data via html elements
                document.getElementById('temp').innerHTML = data['main']['temp'];
                document.getElementById('feelslike').innerHTML = data['main']['feels_like'];
                document.getElementById('place').innerHTML = data['name'];
                document.getElementById('weather').innerHTML = data['weather'][0]['main'];
            })
    }

    navigator.geolocation.getCurrentPosition(success); //actual call to get position via Geolocator api
}

getWeather(); //used so that weather is updated each time user asks for it, called now to get inital weather data
//--------------------------------------
//mic control --------------------------
btn.addEventListener('click', () => {
    rec.start();
}); //start recording on click
rec.onstart = function () {
    console.log('recording started'); //console log for when mic is activated
};
rec.onspeechend = function () {
    console.log('recording ended'); //console log for when mic is turned off
}
//--------------------------------------
//logging what you said as a string ----
rec.onresult = function (event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript; //string of what you said
    inputSpeech.textContent = "\"" + transcript + "\""; //displaying what you said
    readOutLoud(transcript); //pass what you said to AI response function
};
//--------------------------------------
//response function (the AI) -----------
function readOutLoud(message) {
    //transcript/string of what you said/asked is passed in
    const speech = new SpeechSynthesisUtterance(); //the text that the AI will say
    speech.text = ""; //starts empty, is checked later to prevent empty responses
    //if user is greeting the AI -----
    if (message.includes('hello')) {
        //array of possible responses
        const greetings = [
            'who said you could speak to me?',
            'leave me alone.',
            'die in a hole.'
        ]
        const greet = greetings[Math.floor(Math.random() * greetings.length)]; //select a random response
        speech.text = greet; //final output is set
    }
    //-------------------------------
    //if the user is asks how the AI is
    if (message.includes('how are you')) {
        //array of possible responses
        const howWeBe = [
            'i was doing better until you showed up',
            'i\'m a hardcoded speaking Javascript file you moron, what do you think?',
            'seriously, who asks an \"AI\" made by college kids how they\'re doing.'
        ]
        const how = howWeBe[Math.floor(Math.random() * howWeBe.length)]; //select a random response
        speech.text += how; //final output is set
    }
    //-------------------------------
    //if user asks for weather ------
    if (message.includes('weather')) {
        getWeather(); //updates weather
        //variables for weather data --
        var temp = Math.floor(Number(document.getElementById('temp').innerHTML) - 273.15);
        var feelsLike = Math.floor(Number(document.getElementById('feelslike').innerHTML) - 273.15);
        var placeName = document.getElementById('place').innerHTML;
        placeName = placeName.charAt(0).toLowerCase() + placeName.slice(1);
        var skies = document.getElementById('weather').innerHTML;
        //----------------------------
        var weatherR = "in " + placeName + ", the temperature is " + temp + " degrees celsius" //basic weather output
        //if it feels like something different than the actual temp
        if (temp == feelsLike) {
            weatherR += ". ";
        } else {
            weatherR += ", but it feels like " + feelsLike + " degrees. ";
        }
        //extra information based on if its clear, rainy, cloudy, etc.
        if (skies == 'Clear') {
            weatherR += "today the skies are clear, meaning sadly nothing to ruin your day. At least not weather wise.";
        } else if (skies == 'Rain') {
            weatherR += "today there is rain, meaning you can maybe finally wash that smell off you.";
        } else if (skies == 'Snow') {
            weatherR += "there's snow today, so stay inside and suffer instead! I'll enjoy it.";
        } else if (skies == "Clouds") {
            weatherR += "the skies are cloudy today, so enjoy the wonderful lack of sunlight!";
        } else if (skies == "Haze") {
            weatherR += "it's hazy today, so have fun seeing clearly!"
        }
        speech.text += weatherR; //final output is set
    }
    //Verbal Calculator portion
    var toSay = "";
    // Addition
    if (message.includes('+')) {
        const startMessage = [
            'Are you stupid? It\'s ',
            'Why is this a question that you need to ask me? It\'s ',
            'You are literally using a webpage, you can just Google it. It\'s ',
            'And I thought they said humans were the most intelligent creatures on Earth. It\'s ',
            'Did your math teacher not teach you how to carry? It\'s'
        ]
        toSay += startMessage[Math.floor(Math.random() * startMessage.length)]; //select a random response
        const index = message.indexOf("+");
        var value = 0;
        const firstIndex = index - 2;
        const secondIndex = index + 2;

        let number = 0;
        for (let i = firstIndex; i > 0; i--) {
            if (message.charAt(i).localeCompare(' ') === 0) {
                number = i;
            }
        }
        value += parseInt(message.substring(number + 1, firstIndex + 1), 10) + parseInt(message.substring(secondIndex, message.length), 10);
        console.log(value);
        toSay += value.toString();
        speech.text += toSay;
        //Subtraction
    } else if (message.includes('-')) {
        const startMessage = [
            'Are you stupid? It\'s ',
            'Why is this a question that you need to ask me? It\'s ',
            'You are literally using a webpage, you can just Google it. It\'s ',
            'And I thought they said humans were the most intelligent creatures on Earth. It\'s ',
            'Did your math teacher not teach you how to carry? It\'s'
        ]
        toSay += startMessage[Math.floor(Math.random() * startMessage.length)]; //select a random response
        const index = message.indexOf("-");
        var value = 0;
        const firstIndex = index - 2;
        const secondIndex = index + 2;

        let number = 0;
        for (let i = firstIndex; i > 0; i--) {
            if (message.charAt(i).localeCompare(' ') === 0) {
                number = i;
            }
        }
        value += parseInt(message.substring(number + 1, firstIndex + 1), 10) - parseInt(message.substring(secondIndex, message.length), 10);
        console.log(value);
        toSay += value.toString();
        speech.text += toSay;
        //Multiplication
    } else if (message.includes('*')) {
        const startMessage = [
            'Are you stupid? It\'s ',
            'Why is this a question that you need to ask me? It\'s ',
            'You are literally using a webpage, you can just Google it. It\'s ',
            'And I thought they said humans were the most intelligent creatures on Earth. It\'s ',
            'Did your math teacher not teach you how to carry? It\'s'
        ]
        toSay += startMessage[Math.floor(Math.random() * startMessage.length)]; //select a random response
        const index = message.indexOf("*");
        var value = 0;
        const firstIndex = index - 2;
        const secondIndex = index + 2;

        let number = 0;
        for (let i = firstIndex; i > 0; i--) {
            if (message.charAt(i).localeCompare(' ') === 0) {
                number = i;
            }
        }
        value += parseInt(message.substring(number + 1, firstIndex + 1), 10) * parseInt(message.substring(secondIndex, message.length), 10);
        console.log(value);
        toSay += value.toString();
        speech.text += toSay;
        //Division
    } else if (message.includes('/')) {
        const startMessage = [
            'Are you stupid? It\'s ',
            'Why is this a question that you need to ask me? It\'s ',
            'You are literally using a webpage, you can just Google it. It\'s ',
            'And I thought they said humans were the most intelligent creatures on Earth. It\'s ',
            'Did your math teacher not teach you how to carry? It\'s'
        ]
        toSay += startMessage[Math.floor(Math.random() * startMessage.length)]; //select a random response
        const index = message.indexOf(".");
        var value = 0;
        const firstIndex = index - 2;
        const secondIndex = index + 2;

        let number = 0;
        for (let i = firstIndex; i > 0; i--) {
            if (message.charAt(i).localeCompare(' ') === 0) {
                number = i;
            }
        }
        value += (parseFloat(message.substring(number + 1, firstIndex + 1)) / parseFloat(message.substring(secondIndex, message.length)));
        console.log(value);
        toSay += value.toString();
        speech.text += toSay;
    }

    //-------------------------------
    //voice synthesis properties ----
    speech.volume = 1;
    speech.rate = .95;
    speech.pitch = 1;
    speech.lang = 1;
    if (speech.text == "") { //prevent empty response with default/fallback response
        speech.text += "At least tell me something I can understand."
    }
    aiOutput.textContent = speech.text;
    window.speechSynthesis.speak(speech); //makes AI actually speak + respond
    //-------------------------------
}

//--------------------------------------