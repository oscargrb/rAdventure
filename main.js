const  background = document.querySelector(".main")
const b = background.getContext("2d");

let audio = document.querySelector("audio");
audio.muted = false

//let restart = document.querySelector(".restart");

const GRAVITY = 0.2

let id = 0;

background.width = 800;
background.height = 600

b.fillRect(0,0,background.width, background.height);


function init(){
    class Player{
        constructor({position, velocity}){

            this.position = position;//{x:10, y:10}
            this.velocity = velocity;
            this.width = 70;
            this.height = 70;
            this.color = "yellow"
            this.isFly = false
            this.collition = false
            this.img = document.createElement("img")
            this.img.src = "img/player.png"
        }

        draw(){
            const {x,y} = this.position
            b.fillStyle = this.color
            //b.fillRect(x,y,this.width, this.height)

            b.drawImage(this.img, x,y, this.width, this.height)
        }

        update(){
            this.draw()

            this.position.y += this.velocity.y;

            if(
                this.position.y + this.height + this.velocity.y >= background.height ||
                this.position.y + this.velocity.y <= 0
            ){
                this.collition = true
            }else{
                this.velocity.y += GRAVITY;
            }
        }

        fly(){

            if(this.position.y - 7 > 0){
                this.img.src = "img/player2.png"
                setTimeout(()=>{
                    this.img.src = "img/player.png"
                },100)
                this.velocity.y -= 7
            }

        }
    }

    class Obstacule{
        constructor(type, time){
            this.id = id
            id++
            this.type = type;
            this.width = 150;
            this.height = 250;
            this.type = type
            this.originalPosition = {
                x: background.width,
                y: type=="top"?0:background.height-this.height
            }
            this.position = {
                x: this.originalPosition.x,
                y: this.originalPosition.y
            }
            this.velocity = {
                x:1.5,
                y:0.3
            }
            this.color="green"
            this.onGame = false
            this.time = time
            this.birdPass = false
            this.img = document.createElement("img")
            this.img.src = "img/building.png"
        }

        draw(){
            const {x,y} = this.position
            b.fillStyle = this.color
            //b.fillRect(x,y,this.width, this.height)
            b.drawImage(this.img, x,y, this.width, this.height)
        }

        update(){

            if(this.type == "top"){
                if(
                    bird.position.x + bird.width - 5> this.position.x &&
                    bird.position.x < this.position.x + this.width &&
                    bird.position.y - 5 < this.height
                ){
                    bird.color = "red"
                    bird.collition = true
                }
            }
            if(this.type == "bottom"){
                if(
                    bird.position.x + bird.width - 5 > this.position.x &&
                    bird.position.x < this.position.x + this.width &&
                    bird.position.y + bird.height - 5 > this.position.y
                ){
                    bird.color = "red"
                    bird.collition = true
                }
            }

            if(
                bird.position.x > this.position.x + this.width &&
                !this.birdPass
            ){
                counter.score ++
                this.velocity.y += .5
                this.birdPass = true
            }

            if(
                bird.position.x + bird.width < this.position.x
            ){
                this.birdPass = false
            }

            this.position.x -= this.velocity.x

            if(this.position.x + this.width < 0){

                this.restart()
            }
            console.log(counter.score)
            this.draw()
        }

        restart(){
            let rPosition = Math.random()>.5?"top":"bottom"

            this.type = rPosition

            this.originalPosition.y = rPosition=="top"?0:background.height-this.height

            this.position = {
                x: this.originalPosition.x,
                y: this.originalPosition.y
            }


        }
    }

    class Counter{
        constructor(){
            this.position = {
                x:600,
                y:100
            }
            this.color="white"
            this.score = 0;
        }

        draw(){
            b.fillStyle = this.color
            b.font = "30px serif"
            b.fillText(this.score, this.position.x, this.position.y)
        }
    }


    const bird = new Player({
        position:{x:100,y:10},
        velocity:{x:0, y:.2}
    })
    bird.draw()

    let obs = [
        new Obstacule(Math.random()>.5?"top":"bottom",0),
        new Obstacule(Math.random()>.5?"top":"bottom",3000),
        new Obstacule(Math.random()>.5?"top":"bottom",6000),
    ]

    for(let ob of obs){
        setTimeout(()=>{
          ob.onGame = true;
        },ob.time)
    }

    let counter = new Counter()

    function animate(){

        let idAnimation = requestAnimationFrame(animate)
        b.fillStyle = 'black'
        b.fillRect(0,0,background.width, background.height);

        bird.update()



        for(let ob of obs){
            if(ob.onGame){
              ob.update()
            }
        }

        if(bird.collition){
            bird.color = "red";
            bird.update()
            cancelAnimationFrame(idAnimation)
            //restart.style.display = "inline"
            newGame()
            audio.pause()
            audio.currentTime = 0
        }



        counter.draw()
    }

    animate()

    window.addEventListener("keydown", e=>{
        switch(e.key){
            case ' ':{
                if(!bird.isFly){
                    bird.fly()
                    bird.isFly = true;
                }
            }
        }
    })

    window.addEventListener("touchstart", e=>{
      if(!bird.isFly){
          bird.fly()
          bird.isFly = true;
      }
    })

    window.addEventListener("keyup", e=>{
        switch(e.key){
            case ' ':{
                if(bird.isFly){
                    bird.isFly = false;
                }
            }
        }
    })

    window.addEventListener("touchend", e=>{
      if(bird.isFly){
          bird.isFly = false;
      }
    })
}

newGame()

function newGame(){
  console.log("entra")
  b.strokeStyle = "white"
  b.lineWidth = 10
  b.strokeRect(25,25 ,750, 550)
  b.fillStyle = "white"
  b.font = "30px serif"
  b.fillText("Para iniciar presiona Space", 250, 300)
  window.addEventListener("keydown", start)
  window.addEventListener("touchstart", start2)
}

function start(e){
  if(e.key == " "){
    init()
    audio.play()
    window.removeEventListener("keydown", start)
  }
}

function start2(e){
  init()
  audio.play()
  window.removeEventListener("touchstart", start2)
}2
