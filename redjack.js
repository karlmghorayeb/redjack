// Images for front of cards from https://code.google.com/archive/p/vector-playing-cards/downloads
// Image for back of card from https://commons.wikimedia.org/wiki/File:Card_back_01.svg
// Background Image from https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fblackjack-background
//&psig=AOvVaw3UpFoNWOLqcjatU-QTRWK_&ust=1744981858250000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCICH7I-S34wDFQAAAAAdAAAAABAE

// Define variables and set the starting screen
var card;
var currentMoneySlider = 50;
var playerCardCount = 0;
var dealerCardCount = 0;
var playerTotal = 0;
var dealerTotal = 0;
var canPlay = 0;
var bank = 10;
var deck = [1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10];
var currentBet;
var cardImages = getColumn("Playing Cards", "image");
setScreen("mainScreen");

// Update text when moneySlider is updated
onEvent("moneySlider", "input", function( ) {
 currentMoneySlider=getNumber("moneySlider");
setText("amountLabel","$"+currentMoneySlider);
});

// Create animation for playButton when hovered over
onEvent("playButton", "mouseout", function( ) {
 setPosition("playButton", 120, 300, 80, 30);
 setProperty("playButton", "font-size", 15);
});
onEvent("playButton", "mouseover", function( ) {
 setPosition("playButton", 117, 297, 86, 36);
 setProperty("playButton", "font-size", 18);
});

// Change screen when rulesButton pressed
onEvent("rulesButton", "click", function( ) {
 setScreen("rulesScreen");
});

// Create animation for rulesButton when hovered over
onEvent("rulesButton", "mouseout", function( ) {
 setPosition("rulesButton", 120, 350, 80, 30);
 setProperty("rulesButton", "font-size", 15);
});
onEvent("rulesButton", "mouseover", function( ) {
 setPosition("rulesButton", 117, 347, 86, 36);
 setProperty("rulesButton", "font-size", 18);
});

// Change screen when rulesHomeButton pressed
onEvent("rulesHomeButton", "click", function( ) {
 setScreen("mainScreen");
});

// Create animation for rulesHomeButton when hovered over
onEvent("rulesHomeButton", "mouseout", function( ) {
 setPosition("rulesHomeButton", 120, 400, 80, 30);
 setProperty("rulesHomeButton", "font-size", 15);
});
onEvent("rulesHomeButton", "mouseover", function( ) {
 setPosition("rulesHomeButton", 117, 397, 86, 36);
 setProperty("rulesHomeButton", "font-size", 18);
 });

 // Change screen and set bank amount when playButton clicked
onEvent("playButton", "click", function( ) {
 setScreen("playScreen");
 bank = currentMoneySlider;
 setText("bankText","Bank: $"+currentMoneySlider);
 newGame();
});

// Flip cards, subtract current bet from bank, and allow players to hit or stand after betButton clicked
onEvent("betButton", "click", function( ) {
currentBet = getNumber("betInput");
if (currentBet > 0) {
 if (bank >= currentBet) {
 bank = bank - currentBet;
 newGame();
randomCard("playerCard1");
playerTotal=playerTotal+card;
playerCardCount = playerCardCount + 1;
dealerCardCount = dealerCardCount + 1;
updateScreen(["playerTotal", "dealerTotal", "bankText"]);
randomCard("playerCard2");
playerTotal=playerTotal+card;
playerCardCount = playerCardCount + 1;
updateScreen(["playerTotal", "dealerTotal", "bankText"]);
randomCard("dealerCard1");
dealerTotal=dealerTotal+card;
updateScreen(["playerTotal", "dealerTotal", "bankText"]);
canPlay = 1;
}
}
});

// When standButton is clicked, flip dealer cards until they have at least 17 total, then determine outcome of game based on whos total
// is higher
onEvent("standButton", "click", function( ) {
if (canPlay==1){
 while (dealerTotal<17) {
 dealerCardCount = dealerCardCount + 1;
 randomCard("dealerCard"+dealerCardCount);
 dealerTotal=dealerTotal+card;
 positionCards();
 updateScreen(["playerTotal", "dealerTotal", "bankText"]);
 }
 if (playerTotal > 21) {
 loseOutcome();
 } else if (dealerTotal > 21) {
 winOutcome();
 } else if (playerTotal > dealerTotal) {
 winOutcome();
 } else if (playerTotal == dealerTotal) {
 pushOutcome();
 } else {
 loseOutcome();
 }
 
}
});

// When hitButton is clicked, flip a player card, if player goes above 21, they bust
onEvent("hitButton", "click", function( ) {
if (canPlay==1){
 playerCardCount=playerCardCount+1;
 randomCard("playerCard"+playerCardCount);
 playerTotal=playerTotal+card;
 positionCards();
 updateScreen(["playerTotal", "dealerTotal", "bankText"]);
 if (playerTotal>21) {
 bustOutcome();
 }
}
});

// Reset the game when the button is pressed after a loss
onEvent("buttonReset", "click", function( ) {
newGame();
canPlay=1;
});

// Change screen to the mainScreen when the homeButton is pressed (only appears when player runs out of money)
onEvent("homeButton", "click", function( ) {
 setScreen("mainScreen");
});

// Function to get a random card from the deck and set the image of the card to it, takes value from a list to determine the value of
// the card as face cards are all worth 10
function randomCard(chosenCard) {
 var random = randomNumber(1,52);
 setImageURL(chosenCard, cardImages[random-1]);
 card = deck[random-1];
}

// Function to update the text on screen
function updateScreen(updateList) {
 for (var i = 0; i < updateList.length; i++) {
 var label = updateList[i];
 if (label == "bankText") {
 setText(label, "Bank: $" + bank);
 } else if (label == "playerTotal") {
 setText(label, playerTotal);
 } else if (label == "dealerTotal") {
 setText(label, dealerTotal);
 }
 }
 setText("betInput", "");
}

// Functions to position the cards and always keep them centered no matter how many cards are pulled
function positionCards() {
 positionMath("player", playerCardCount, 295);
 if (dealerCardCount > 1) {
 positionMath("dealer", dealerCardCount, 40);
 }
}
function positionMath(participant, cardCount, yPosition) {
 var margin = (320 - (cardCount * 50 + ((cardCount - 1) * 5))) / 2;
 for (var i = 1; i <= cardCount; i++) {
 var xPos = margin + ((i - 1) * 55);
 setPosition(participant + "Card" + i, xPos, yPosition);
 }
}

// Shows "PUSH!" text and allows player to reset, player doesn't lose any money
function pushOutcome() {
showElement("pushText");
showElement("buttonReset");
bank = bank+currentBet;
canPlay=0;
}

// Shows "BUST!" text and allows player to reset, player loses current bet
function bustOutcome() {
showElement("bustText");
showElement("buttonReset");
canPlay=0;
if (bank==0) {
 showElement("homeButton");
}
}

// Shows "LOSE!" text and allows player to reset, player loses current bet
function loseOutcome() {
showElement("loseText");
showElement("buttonReset");
canPlay=0;
if (bank==0) {
 showElement("homeButton");
}
}

// Shows "WIN!" text and allows player to reset, player gains current bet
function winOutcome() {
showElement("winText");
showElement("buttonReset");
bank = bank+currentBet*2;
}

 // Function for a new game, resets the values, positions the cards correctly, and changes card image to be flipped
function newGame() {
 playerCardCount = 0;
 dealerCardCount = 0;
 playerTotal = 0;
 dealerTotal = 0;
 canPlay = 0;
 setPosition("playerCard1",105, 295);
 setPosition("playerCard2",165, 295);
 setPosition("dealerCard1",105, 40);
 setPosition("dealerCard2",165, 40);
 hideElement("bustText");
 hideElement("pushText");
 hideElement("loseText");
 hideElement("homeButton");
 hideElement("winText");
 hideElement("buttonReset");
 
 // Use new function to reset card images
 resetCardImages(["playerCard1", "playerCard2", "playerCard3", "dealerCard1", "dealerCard2", "dealerCard3"]);
 for (var i = 3; i < 10; i++) {
 setPosition("playerCard"+i,500, 295);
 setPosition("dealerCard"+i,500, 295);
 }
 updateScreen(["playerTotal", "dealerTotal", "bankText"]);
}

//Resets card images
function resetCardImages(cardList) {
 for (var i = 0; i < cardList.length; i++) {
 var cardName = cardList[i];
 if (cardName.includes("player") || cardName.includes("dealer")) {
 setImageURL(cardName, "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/1406px-Card_back_01.svg.png");
 }
}
}