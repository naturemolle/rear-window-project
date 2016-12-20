/*

╦  ╦╔═╗╦  ╔═╗╦ ╦╦═╗╔═╗
╚╗╔╝╠═╣║  ║╣ ║ ║╠╦╝╚═╗
 ╚╝ ╩ ╩╩═╝╚═╝╚═╝╩╚═╚═╝


capter valeur fft 'ou amplitude si possible'respiration: microphone, connecter sur wemos.


avec l'amplitude, la valeur de l'expiration est frole le 0,4
la valeur de l'inspiration, le plateau se situe entre le 0,004 et le 0,09 un peu plus eleve que le bruit ambiant 0,004 à 0,01 de la salle de cours

trouver un la valeur de l'expiration: la valeur va etre pres  des 200, ou meme la depasser
trouver une valeur de plateau, neutre, de l'inspiration: en dessous de 100, de 50 a 90 peut-etre



╔╦╗╔═╗╔═╗╔═╗╦═╗╦╔═╗╔╦╗╦╔═╗╔╗╔  ╔═╗╦═╗╔═╗ ╦╔═╗╔╦╗
 ║║║╣ ╚═╗║  ╠╦╝║╠═╝ ║ ║║ ║║║║  ╠═╝╠╦╝║ ║ ║║╣  ║ 
═╩╝╚═╝╚═╝╚═╝╩╚═╩╩   ╩ ╩╚═╝╝╚╝  ╩  ╩╚═╚═╝╚╝╚═╝ ╩ 


video: avec contenu video en loop: peau avec des appliqués verts
avec la librairie seriously.js, utiliser la fonction chromakey afin de retirer le vert et obtenir de l'alpha a l'endroit des appliqués verts
pont du capteur de la respiration au contenu video: 
utliser les valeurs extremes 'expiration et inspiration', créer des variables probablement et un énoncé conditionnel
afin de modifier les parametres du chromakey. particulièrement si l'on peut étendre la surface de l'alpha.
les trous laisser par le chromakey vont pulser au rythme de la respiration . 
trouver une maniere de créer une installation qui amene l'observateur à se rapprocher du moniteur le plus possible, et donc du capteur. 
utiliser un moniteur de petite taille, peut-etre disposer le moniteur dans un boitier avec une ouverture plus étroite que le moniteur. 
l'observateur peut apercevoir le contenu, mais il peut l'observer completement seulement si il regarde dans la 'meurtrière'. 
Le boitier permettrait aussi de cacher le capteur à l'entrée de la meurtrière.
ca pourrait peuetre etre placer dans une salle obscure, ainsi la lumière s'evadant de la meurtriere attirerait le regard de l'observateur.
Elle inviterait a un rapport intime avec le dispositif.

resume: Je filme un fragment de corps en studio devant la fenêtre avec vue, sur lequel j'applique des autocollants vert comme sont 
utilisés les green screen au cinéma. Á la différence des effets spéciaux, je place le fond vert sur le corps et non derrière.
Ceci me permettra d'incruster sur les parties vertes du corps en postproduction l'image de la vue de la fenêtre devant lequel 
ce corps se trouve. Dans un deuxième temps,  l'étendue ou la rétractation  des trous sur le corps varie en fonction de la respiration
du spectateur grâce à un  dispositif interactif de microphones qui agit en fonction du souffle et l'intensité des membres du public.
Cependant, le dispositif ne fonctionnera qui si le spectateur se positionne à proximité de la meurtrière dans laquelle la vidéo sera 
projeté. Mon idée ici consiste à faire du corps une fenêtre, et d'inclure le corps du spectateur lui-même dans cette réflexion.
Dès lors apparait une nouvelle posture dans mon travail, qui est connexe à la réflexion, c’est-à-dire la figure de la fenêtre. 
Celle-ci c’étant présenté dans mon travail à plusieurs reprises, sans pour autant s’affirmer au premier plan. Cette figure de la fenêtre,
existant dans l’histoire de l’art dans la pratique de la peinture depuis la renaissance, serait une posture à développer, alors que mon 
dispositif se positionne lui-même sus forme de fenêtre, mais aussi qui ouvre une fenêtre sur le corps. 


╔╦╗╦ ╦╔═╗╔═╗╦═╗╦╔═╗
 ║ ╠═╣║╣ ║ ║╠╦╝║║╣ 
 ╩ ╩ ╩╚═╝╚═╝╩╚═╩╚═╝


Peak amplitude of inhale/exhale Breath type
0-0.3 Mild Breath
0.3-0.7 Soft Breath
above 0.7 Hard Breath
Table 4.1: Classification of breaths based on the peak amplitude


Calculate the sampling frequency (Fs) of the recorded signal.
• Down-sample the recorded signal, i.e., reduce the sampling rate of a signal.
• Remove noise from the recorded signal using filter (we use third-order
Butterworth filter).
• Detect the envelope of the recorded signal.
• Normalize the recoded signal.
• Determine the largest peak in the normalized recorded signal.

Classify the recorded signal using the following criterion:
– If ( normalized peak amplitude <= 0.3) then declare mild breath
– else if (normalized peak amplitude > 0.3) && (normalized peak amplitude
<= 0.7) then declare soft breath.
– else declare hard breath.
• Determine the number of breaths per minute.

*/


//╦  ╦╦╔╦╗╔═╗╔═╗  ╔═╗╔╗╔╔╦╗  ╔═╗╔═╗╦═╗╦╔═╗╦ ╦╔═╗╦ ╦ ╦ ╦╔═╗
//╚╗╔╝║ ║║║╣ ║ ║  ╠═╣║║║ ║║  ╚═╗║╣ ╠╦╝║║ ║║ ║╚═╗║ ╚╦╝ ║╚═╗
// ╚╝ ╩═╩╝╚═╝╚═╝  ╩ ╩╝╚╝═╩╝  ╚═╝╚═╝╩╚═╩╚═╝╚═╝╚═╝╩═╝╩o╚╝╚═╝






var video;
var canvas;
var mic;
var micLevel;
var chroma;
//var mytext;




function setup() {
    
  mic = new p5.AudioIn();
  mic.start();    

  canvas = createCanvas(480, 640, WEBGL);
  canvas.id('canvastarget');
  canvas.position(540,120);
  
    
    
  video = createVideo('corps.mp4');
  video.autoplay(); 
  video.loop();
  video.size(480, 640);
  video.position(540,120);
  video.hide();
  video.id('rearwindow');
  
  var seriously = new Seriously();

  var src = seriously.source('#rearwindow');
  var target = seriously.target('#canvastarget');
    
    
  chroma = seriously.effect('chroma');
  
  
  chroma.source = src;
  target.source = chroma;
  var r = 42 / 255;
  var g = 120/ 255;
  var b = 40 / 255;
  chroma.screen = [r,g,b,1];
  chroma.balance = 70/100 ;
  
  
    
   
  seriously.go();



}
    
 


function draw(){
    
    
    chroma.clipBlack = micLevel;
    
    micLevel = mic.getLevel();
    micLevel = Math.round(micLevel*100)/100;
    
    console.log(micLevel);
    
  
    
}




//╔╦╗╔═╗╔═╗╔╦╗  ╦  ╦╦╔╦╗╔═╗╔═╗  ╔═╗╔╦╗  ╔═╗╔═╗╦═╗╦╔═╗╦ ╦╔═╗╦ ╦ ╦ ╦╔═╗
// ║ ║╣ ╚═╗ ║   ╚╗╔╝║ ║║║╣ ║ ║  ║╣  ║   ╚═╗║╣ ╠╦╝║║ ║║ ║╚═╗║ ╚╦╝ ║╚═╗
// ╩ ╚═╝╚═╝ ╩    ╚╝ ╩═╩╝╚═╝╚═╝  ╚═╝ ╩   ╚═╝╚═╝╩╚═╩╚═╝╚═╝╚═╝╩═╝╩o╚╝╚═╝






  //mytext = createP('clipblack');
  //slider = createSlider(0, 1, 0, 0.01);
 //slider.id('black-slider');
 // chroma.clipBlack = test;
    
  /*  
    
  mytext = createP('clipwhite');    
   
  slider = createSlider(0, 1, 1, 0.01);
  slider.id('white-slider');
  chroma.clipWhite = '#white-slider';  
    
    
    
  mytext = createP('balance'); 
    
  slider = createSlider(0, 1, 1, 0.01);
  slider.id('balance-slider');
  chroma.balance = '#balance-slider';
    
    
    
  mytext = createP('weight'); 
    
  slider = createSlider(0, 1, 1, 0.01);
  slider.id('weight-slider');
  chroma.weight = '#weight-slider';   
    
*/
    

    
    
 //chroma.clipBlack = black;
    //console.log("chroma : "+chroma.clipBlack);
  
 
   //blackslider.value(micLevel);    

   //slider.id('black-slider').value(micLevel);



//┌─┐┌─┐┌┬┐┌─┐  ╔═╗╔═╗╔╦╗
//│  │ │ ││├┤   ╠╣ ╠╣  ║ 
//└─┘└─┘─┴┘└─┘  ╚  ╚   ╩ 
 


/*var mic,fft;

function setup() {
createCanvas(1024,400);
   noFill();

   mic = new p5.AudioIn();
   mic.start();
   fft = new p5.FFT();
   fft.setInput(mic);
   
}

function draw() {
   background(255);

   var spectrum = fft.analyze();

   beginShape();
   for (i = 0; i<spectrum.length; i++) {
    vertex(i, map(spectrum[i], 0, 255, height, 0) );
   }
   endShape();

   
console.log(spectrum);

}

*/






//┌─┐┌─┐┌┬┐┌─┐  ╔═╗╔╦╗╔═╗
//│  │ │ ││├┤   ╠═╣║║║╠═╝
//└─┘└─┘─┴┘└─┘  ╩ ╩╩ ╩╩  



/*

var mic;
function setup(){
  mic = new p5.AudioIn()
  mic.start();
}
function draw(){
  background(0);
  micLevel = mic.getLevel();
  ellipse(width/2, constrain(height-micLevel*height*5, 0, height), 10, 10);
    
  console.log(micLevel);
}

*/



//┌─┐┌─┐┌┬┐┌─┐  ╔═╗╔╦╗╔═╗  ╔═╗╔╦╗  ╦  ╦╦╔╦╗╔═╗╔═╗
//│  │ │ ││├┤   ╠═╣║║║╠═╝  ║╣  ║   ╚╗╔╝║ ║║║╣ ║ ║
//└─┘└─┘─┴┘└─┘  ╩ ╩╩ ╩╩    ╚═╝ ╩    ╚╝ ╩═╩╝╚═╝╚═╝

/*
if (micLevel > 0.3){
    //console.log('condition1');
    black = 100/100;
    }
else if (micLevel > 0.004 && micLevel < 0.3){
    //console.log('condition2');
    black = 50/100;
    }  
 */   

/*


var amp = mic.getLevel();

If (amp => 0,1){
    Ligne de code pour effet vidéo expi
    }
If (amp => 0,004 && amp < 0,1){
    Ligne code pour inspi
    }
Else(amp < 0,004){
    Code pour plateau, bruit ambiant
    } 
    
    

*/




//┌┬┐┌─┐┌─┐┌┬┐  ╔═╗╔╦╗╔═╗
// │ ├┤ └─┐ │   ╠═╣║║║╠═╝
// ┴ └─┘└─┘ ┴   ╩ ╩╩ ╩╩  

/*


var mic;

function setup() {
createCanvas(1024,400);
   noFill();

   mic = new p5.AudioIn();
   mic.start();
   
}

function draw() {
   background(255);
   micLevel = mic.getLevel();

   beginShape();
   stroke(0);
   noFill();
   for (i = 0; i<micLevel; i++) {
    vertex(i, map(micLevel[i], 0, 1, height, 0) );
   }
   endShape();

   
//console.log(micLevel);
}
*/



/*
var mic,amp;

function setup() {
createCanvas(1024,400);
   noFill();

   mic = new p5.AudioIn();
   mic.start();
   amp = new p5.Amplitude();
   amp.getLevel(mic);
}

function draw() {
   background(255);

   var spectrum = amp.getLevel(mic);

   beginShape();
   for (i = 0; i<spectrum; i++) {
    vertex(i, map(spectrum[i], 0, 1, height, 0) );
   }
   endShape();

   
console.log(spectrum);

}
*/



/*
var vol = amp.getLevel();
    
volhistory.push(vol);
stroke(255);
noFill();
beginShape();
for(var i=0; i<volhistory.lenght; i++){
    var y = map(volhistory[i],0,1,height/2,0);
    vertex(i,y);
    }
endShape();
    
if (volhistory.lenght>width){ 
    volhistory.splice(0,1);
    }
console.log(vol);
volhistory.push(vol);
*/





/* var mic;
var amp;
var volhistory=[];

function setup(){
  mic = new p5.AudioIn();
  mic.start();
  amp = new p5.Amplitude();
}

function draw(){
    
background(0);
    
var vol = amp.getLevel();
    
volhistory.push(vol);
stroke(255);
noFill();
beginShape();
for(var i=0; i<volhistory.lenght; i++){
    var y = map(volhistory[i],0,1,height/2,0);
    vertex(i,y);
    }
endShape();
    
if (volhistory.lenght>width){ 
    volhistory.splice(0,1);
    }
console.log(vol);
volhistory.push(vol);
    
}
*/




//<img src='fenetre.jpg' style='position:fixed;top:0px;left:0px;width:100%;height:100%;z-index:-1;'>
