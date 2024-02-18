"use strict";





let width  = 1024;
let height = 720;



let angle = 0;

let bunnyes = [];

class Bunny 
{
    constructor()
    {
        this.x = 50;
        this.y = 50;
        this.vx =  Math.random() * 10 ;
        this.vy =  Math.random() * 10 ;
        this.rotation = 0;
        this.width = 26;
        this.height = 37;
        this.color = new Color(1, 1, 1, 1);
        this.color.r = Math.random();
        this.color.g = Math.random();
        this.color.b = Math.random();
        this.color.a = 1;
    }
    update()
    {
        if (this.x > width || this.x < 0)
        {
            this.vx = -this.vx;
        }

        if (this.y > height || this.y < 0)
        {
            this.vy = -this.vy;
        }

        this.x += this.vx;
        this.y += this.vy;
    
    }
}


let count = Math.floor(50000);
let batch = new PolyBatch(4000);
let sprites = new SpriteBatch(count);
let font = new Font("assets/font.fnt","font");


function load()
{


    batch.Init();
    sprites.Init();
    font.Load().then(() =>
    {
        font.Init(500);

        console.log("Font loaded");
    });

    

     
    for (let i = 0; i < 1000; i++)
    {
    bunnyes.push(new Bunny());
    }


}


function render(gl)
{
    gl.clearColor(0.0, 0.0, 0.4, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);


    let L = 0;
    let R = width;
    let T = 0;
    let B = height;

    let ortho_projection = 
    [
        2 / (R - L), 0, 0, 0,
        0, 2 / (T - B), 0, 0,
        0, 0, -1, 0,
        -(R + L) / (R - L), -(T + B) / (T - B), 0, 1
    ];

    let view = 
    [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

  ///  Renderer.SetOrthoViewMatrix(0,width,height,0,-5.0,5.0);
    Renderer.SetProjectionMatrix(ortho_projection);
    Renderer.SetViewMatrix(view);





    batch.SetColor(RED);
    batch.Line(0,0,100,100);

     batch.SetColor(LIME);
     batch.DrawCircleLines(100,100,50);
     batch.DrawCircleLines(200,200,50);
     batch.DrawCircle(300,300,50);





   
      


    if (Game.mouseDown)
    {
        for (let i = 0; i < 100; i++)
        {
        bunnyes.push(new Bunny());
        }

    }



 
  


    
    let texture = Game.GetTextureByIndex(0);
   


    for (let i = 0; i < bunnyes.length; i++)
    {
        let bunny = bunnyes[i];
        bunny.update();

        sprites.SetColor(bunny.color);
     ///   batch.SetColor(bunny.color);

        

        if (i % 2 == 0)
        {
           // batch.DrawRectangle(bunny.x,bunny.y,50,50);
            // batch.DrawRotateRectangle(bunny.x,bunny.y,50,50,0.5,0.5,angle);
         //   batch.DrawRectangleLines(bunny.x,bunny.y,50,50);

       //  sprites.DrawRotate(texture, bunny.x, bunny.y, 50, 50, 0.5, 0.5, angle);
            sprites.Draw(texture, bunny.x, bunny.y,50,50);
           
           } else 
        {
            //sprites.Draw(texture, bunny.x, bunny.y,50,50);
          batch.DrawRectangleLines(bunny.x,bunny.y,50,50);
          //  batch.DrawRotateRectangle(bunny.x,bunny.y,50,50,0.5,0.5,0);

           }
       
    }

     sprites.SetColor(WHITE);
     sprites.Draw(texture, 500, 100, 50,50);



    let texture2 = Game.GetTextureByIndex(1);
    sprites.DrawRotate(texture2, 200, 200, 50, 50, 0.5, 0.5, angle);


     sprites.Render();
     batch.Render();


     font.SetColor(WHITE);
     font.Print(50,50,22,"Hello World");

     font.SetColor(RED);    
     font.Print(20,20,12,"FPS: " + CurrentFPS + " count " + bunnyes.length);
     

     font.Render();

    





}

function update(dt)
{ 
    angle += 1;
   // window.document.title = "FPS: " + CurrentFPS + " count " + bunnyes.length;
}

function mouseClicked(event) 
{
   

   
}

//window.addEventListener("click", mouseClicked);


if (Game.Init(width, height))
{

  
    Game.AddImage("assets/wabbit_alpha.png");
    Game.AddImage("assets/zazaka.png");
    Game.AddImage("assets/font.png","font");
    
    

   

    Game.LoadImages(0).then(() => 
    {
        load();
        Game.Start();
        Game.OnRender = render;
        Game.OnUpdate = update;
    
        console.log("Game initialized");
    });


} else
{
    console.log("Failed to initialize game");
}


/*
var poly = [93, 195, 129, 92, 280, 81, 402, 134, 477, 70, 619, 61, 759, 97, 758, 247, 662, 347, 665, 230, 721, 140, 607, 117, 472, 171, 580, 178, 603, 257, 605, 377, 690, 404, 787, 328, 786, 480, 617, 510, 611, 439, 544, 400, 529, 291, 509, 218, 400, 358, 489, 402, 425, 479, 268, 464, 341, 338, 393, 427, 373, 284, 429, 197, 301, 150, 296, 245, 252, 384, 118, 360, 190, 272, 244, 165, 81, 259, 40, 216];

let tris = Triangulate(poly);
console.log(tris);
*/
