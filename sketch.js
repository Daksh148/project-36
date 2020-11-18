//Create variables here
var dog,happyDog, database, foodS, foodStock,dogimg,hdogimg, feedButton, addButton,fedTime,lastFed,foodObj, readState,changeState,gameState="hungry";

function preload()
{
  //load images here
  dogimg=loadImage("sprites/Dog.png");
  hdogimg=loadImage("sprites/happydog.png");
  milkimg=loadImage("sprites/Milk.png");
  bedimg=loadImage("sprites/Bed Room.png")
  gardenimg=loadImage("sprites/Garden.png");
  washimg=loadImage("sprites/Wash Room.png");
  deadog=loadImage("sprites/deadDog.png");
}

function setup() {
  createCanvas(1000, 500);
  database=firebase.database();
  dog=createSprite(900,280);
  dog.addImage(dogimg);
  dog.scale=0.3;
  
  foodStock=database.ref('food');
  foodStock.on("value",readStock);
 
  foodObj=new Food();
  feedButton=createButton("Feed the Dog");
  feedButton.position(700,95);
  

  addButton=createButton("Add Food");
  addButton.position(800,95);

  readState=database.ref('gameState');
  readState.on("value", function(data){
    gameState=data.val();
  })

}


function draw() {  
  background(46,139,87);
 
  drawSprites();
  //add styles here
  textSize(10);
  fill(rgb(0,0,20));
  stroke(1);
  
  
  textSize(50);
  fill("white");
  
  textSize(30);
  text("Food Remaining: "+foodS,110,150);

  foodObj.display();
  fedTime=database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  fill("white");
  textSize(15);
  if(lastFed>=12){
    text("Last Fed: "+ lastFed%12+"PM",350,30);
  }
  else if(lastFed==0){
    text("Last Fed: 12 AM",350,30);
  }
  else{
    text("Last Fed: "+lastFed+"AM",350,30);
  }
  addButton.mousePressed(function(){
    writeStock(foodS);
  });
  feedButton.mousePressed(function(){
    feedDog(foodS);
  });
  var x=80, y=100;
  if(foodS!=0){
      for(var i=0;i<foodS;i++){
          if(i%10==0){
              x=80;
              y=y+50;
          }
          image(milkimg,x,y,50,50);
          x=x+30;
      }
  }
  if(gameState!="hungry"){
    feedButton.hide();
    addButton.hide();
    dog.remove();
  }else{
    feedButton.show();
    addButton.show();
    dog.addImage(deadog);
  }
  currentTime=hour();
  if(currentTime==(lastFed+1)){
    Update("playing");
    background(gardenimg,550,500);

  }else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
    Update("bathing");
    background(washimg,550,500)

  }else if(currentTime==(lastFed+2)){
    Update("sleeping");
    background(bedimg,550,500);
  }else{
    Update("hungry");
  }
}

function writeStock(x){
  x=x+1;
  database.ref('/').update({
    food:x
  })
}
function readStock(data){
  foodS=data.val();
}
function feedDog(x){
  dog.addImage(hdogimg);
  if(x<=0){
    x=0
  }
  else{
    x=x-1;
  }
  database.ref('/').update({
    food:x,
    feedTime:hour()
  })
}

function Update(state){
  database.ref('/').update({
    gameState:state
  })

}