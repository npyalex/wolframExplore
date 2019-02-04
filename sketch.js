/*
 * Ubiquitous Computing - Digital Futures, OCAD University
 * Kate Hartman / Nick Puckett
 * 
 * Uses a PubNub function to query the Wolfram Conversation API
 * And paints a generative picture based on your response
 *  
 */

// server variables

var dataServer;
var pubKey = 'pub-c-122e664b-211d-4eab-a675-3817a4e453e8';
var subKey = 'sub-c-8d50a09c-23ef-11e9-9d72-060068e65422';

//input variables
var sendText;
var sendButton;

//size of the active area
var cSizeX = 900;
var cSizeY = 600;

var returnedAnswer = [];

//This must match the channel you set up in your function
var channelName = "wolfram";

function setup() 
{
  getAudioContext().resume();
  createCanvas(cSizeX, cSizeY);
  background(255);
  
  

   // initialize pubnub
  dataServer = new PubNub(
  {
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,  
    ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
  });
  
  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({ message: readIncoming})
  dataServer.subscribe({channels: [channelName]});

  //create the text fields for the message to be sent
  sendText = createInput();
  sendText.position(5,height);

  sendButton = createButton('Ask a Question');
  sendButton.position(sendText.x + sendText.width,height);
  sendButton.mousePressed(sendTheMessage);

}

function draw() 
{


}


///uses built in mouseClicked function to send the data to the pubnub server
function sendTheMessage() {
 

  // Send Data to the server to draw it in all other canvases
  dataServer.publish(
    {
      channel: channelName,
      message: 
      {
        text: sendText.value()       //text: is the message parameter the function is expecting   
      }
    });

}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()
  

console.log(inMessage);  //log the entire response
                          //the message parameter to look for is answer


    background(255);
    noStroke();
    fill(0);  //read the color values from the message
    textSize(20);
    text(inMessage.message.answer, 5, height/2);
    //returnedAnswer=inMessage.message.answer.split(" ");

    // cycle through the returned answer 1000 times or until the string ends
    // whichever comes first
    for(var i=0; i < 1000; i++) {
        if(isNaN(inMessage.message.answer.charCodeAt(i)))
            {
                break;
            }
    // print the UTC-16 code of each character in the answer
      //console.log(inMessage.message.answer.charCodeAt(i));
      returnedAnswer[i]=inMessage.message.answer.charCodeAt(i);
        console.log(returnedAnswer[i]);
    }
}