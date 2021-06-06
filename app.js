//constants from html file
const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

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

//global constants
const speechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
const rec = new speechRec();


navigator.geolocation.getCurrentPosition(storePosition); 

//stores location data
function storePosition(position){
    const key = '1a1d6997558d87f7f7526a9681af9b3a';
    var lat = Math.floor(position.coords.latitude);
    var lon = Math.floor(position.coords.longitude);

    var api_link = 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid='+key;

    fetch(api_link)
        .then(function(response){
            let data = response.json();
            return data;
        });
}


//greeting lines
const greetings = [
    'i was doing fine until you showed up', 
    'leave me alone', 
    'die in a hole'
]

//weather lines
const weatherL = [
    'the weather is trash', 
    'good news! you can go and freeze to death outside', 
    'its raining, so you can take a free shower. Maybe youll be clean for once.'
]

//start up mic when button is clicked
btn.addEventListener('click', () => {rec.start();});

//console log for when mic is activated
rec.onstart = function() {
    console.log('recording started');
};

//console log for when mic is turned off
rec.onspeechend = function(){
    console.log('recording ended');
}

//logs transcript of what was said then calls readOutLoud() to respond
rec.onresult = function(event){
    const current = event.resultIndex;

    const transcript = event.results[current][0].transcript;
    content.textContent = transcript;
    readOutLoud(transcript);
};

//response function
function readOutLoud(message){
    const speech = new SpeechSynthesisUtterance();

    //by default, this function is passed the transcript of what user said
    //this sets default response aka nothing was found to respond to
    speech.text = 'tell me something i can actually understand';


    //if user greets
    if(message.includes('hello')){
        const greet = greetings[Math.floor(Math.random()*greetings.length)];
        speech.text = greet;
    }

    if(message.includes('how are you')){
        const greet = greetings[Math.floor(Math.random()*greetings.length)];
        speech.text = greet;
    }
    
    //if user asks for weather
    if(message.includes('weather')){

        const weatherR = weatherL[Math.floor(Math.random()*greetings.length)];
        speech.text = weatherR;
    }

    //voice synthesis properties
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    speech.lang = 1; 
    window.speechSynthesis.speak(speech);
}

