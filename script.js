const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray =[];
let adjustX = 7;
let adjustY = 30;

const mouse = {
    x :null,
    y :null,
    radius:150
}

window.addEventListener('mousemove',function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});


class Particle{
    constructor(x,y,color){
        this.x = x;
        this.y = y;
        this.size  = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random()*30)+5;
        this.color = color;
    }
    draw(){
        ctx.fillStyle =this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx+dy*dy);
        let forceDx = dx/distance;
        let forceDy = dy/distance;
        let maxDistance = mouse.radius;
        let force =(maxDistance - distance)/maxDistance;
        let directionX = forceDx*force *this.density;
        let directionY = forceDy*force *this.density;
        if(distance < mouse.radius){
            this.x -= directionX;
            this.y -= directionY;
        }else{
            if (this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -=dx/5;
            } 
            if (this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy/5;
            }
        }
    }
}
function writeTextByParticles(text='text',color='white',font='30px Verdana',dt=10){
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text,adjustX,adjustY);
    const textCoordinates= ctx.getImageData(0,0,100,100);
    for(let y = 0, y2 = textCoordinates.height; y < y2; y++){
        for(let x = 0, x2  =textCoordinates.width; x < x2; x++){
            if(textCoordinates.data[(y *4 * textCoordinates.width)+(x*4)+3] > 128){
                let positionX = x;
                let positionY = y;
                particleArray.push(new Particle(positionX*dt,positionY*dt,color));
            }
        }
    }
    
}
function connect()
{
    let opacity=1;
    for(let a=0; a<particleArray.length;a++)
    {
        for(let b =a; b <particleArray.length;b++)
        {
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            opacity = 1-(distance/30);
            if (distance <30)
            {
                ctx.strokeStyle ='rgba(255,255,255,'+opacity+')';
                ctx.lineWidth =2;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x,particleArray[a].y);
                ctx.lineTo(particleArray[b].x,particleArray[b].y);
                ctx.stroke();
            } 
        }
    }
}
function init(){
    particleArray =[];
    writeTextByParticles('예희','white','30px Verdana',20);
}
init();

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i = 0;i<particleArray.length;i++){
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}
animate();
