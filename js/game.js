
"use strict";


let CurrentTime, ElapsedTime, PreviousTime = Date.now(), LagTime = 0;
let FPS = 60;          // Frames per second
let FrameTime = 1 / FPS;
let UpdateIntervalInSeconds = FrameTime;
let MPF = 1000 * FrameTime; // Milliseconds per frame.
let FrameCounter = 0;
let CurrentFPS = 0;
let UpdateTimeFPS = Date.now();
let requestID=0;


function GameLoop () 
{
    requestID=window.requestAnimationFrame(function () 
    {
        GameLoop();
    });

   
    CurrentTime = Date.now();
    ElapsedTime = (CurrentTime - PreviousTime)/1000;
    PreviousTime = CurrentTime;
    LagTime += ElapsedTime;
    FrameCounter++;

   
    while (LagTime >= MPF) 
    {
        LagTime -= MPF;
        Game.Process();
    }

    if (CurrentTime - UpdateTimeFPS > 1000) 
    {
        CurrentFPS = FrameCounter;
        FrameCounter = 0;
 
        UpdateTimeFPS = Date.now();
    }

    Game.Update(ElapsedTime/100);
    Game.Render();
};


const DEG2RAD = Math.PI / 180.0;
const RAD2DEG = 180.0 / Math.PI;



class Texture
{
    constructor()
    {
        this.id = 0;
        this.width = 0;
        this.height = 0;
        this.channels = 0;
    
    }

}

class Texture2D extends Texture
{
    constructor()
    {
        super();
    }
    Create(width, height, channels, data)
    {
        this.width = width;
        this.height = height;
        this.channels = channels;

        let gl = Game.gl;

        let format = 0;
        if (channels === 4)
        {
            format = gl.RGBA;
        } else if (channels === 3)
        {
            format = gl.RGB;
        } else if (channels === 2)
        {
            format = gl.RG;
        } else 
        {
            format = gl.RED;
        }




        this.id = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.id);
      //  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      //  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, gl.UNSIGNED_BYTE, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    Load(image)
    {
        try 
        {
            if (image.width === 0 || image.height === 0 || image.data === null) 
            {
                console.log("Invalid image");
                return false;
            }  
            let gl = Game.gl;
            this.id = gl.createTexture();
            //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            //gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

            gl.bindTexture(gl.TEXTURE_2D, this.id);
     
 
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            this.width = image.width;
            this.height = image.height;
            console.log( `Textura carregada com sucesso: ${this.width}x${this.height}`);

            return true;
        } 
        catch (e)
        {
            console.log(e);
        }
        return false;
    }
    Use()
    {
        let gl = Game.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
    }
}


class Shader
{
    uniforms = {};
    
    constructor()
    {

    }

    Load( vertexShaderSource, fragmentShaderSource)
    {
        this.gl = Game.gl;
        this.program = this.gl.createProgram();
        this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(this.vertexShader, vertexShaderSource);
        this.gl.shaderSource(this.fragmentShader, fragmentShaderSource);
        this.gl.compileShader(this.vertexShader);
        if (!this.gl.getShaderParameter(this.vertexShader, this.gl.COMPILE_STATUS)) 
        {
            console.error('Erro ao compilar o vertex shader!', this.gl.getShaderInfoLog(this.vertexShader));
            return;
        }
        this.gl.compileShader(this.fragmentShader);
        if (!this.gl.getShaderParameter(this.fragmentShader, this.gl.COMPILE_STATUS)) 
        {
            console.error('Erro ao compilar o fragment shader!', this.gl.getShaderInfoLog(this.fragmentShader));
            return;
        }
        this.gl.attachShader(this.program, this.vertexShader);
        this.gl.attachShader(this.program, this.fragmentShader);
        this.gl.linkProgram(this.program);
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) 
        {
            console.error('Erro ao linkar o programa!', this.gl.getProgramInfoLog(this.program));
            return;
        }

        console.log("Shader carregado com sucesso" );

    }
    Use()
    {
        Renderer.SetProgram(this.program);
    }
    AddUniform(name)
    {
       
        this.uniforms[name] = this.gl.getUniformLocation(this.program, name);
    }
    ContainsUniform(name)
    {
        return this.uniforms[name] !== undefined;
    }
    SetUniform1f(name, value)
    {
        if (this.ContainsUniform(name))
        {
            this.Use();
            this.gl.uniform1f(this.uniforms[name], value);
        }
    }
    SetUniform2f(name, x, y)
    {
        if (this.ContainsUniform(name))
        {
            this.Use();
            this.gl.uniform2f(this.uniforms[name], x, y);
        }
    }
    SetUniform3f(name, x, y, z)
    {
        if (this.ContainsUniform(name))
        {
            this.Use();
            this.gl.uniform3f(this.uniforms[name], x, y, z);
        }
    }
    SetUniform4f(name, x, y, z, w)
    {
        if (this.ContainsUniform(name))
        {
            this.Use();
            this.gl.uniform4f(this.uniforms[name], x, y, z, w);
        }
    }
    SetUniform1i(name, value)
    {
        if (this.ContainsUniform(name))
        {
            this.Use();
            this.gl.uniform1i(this.uniforms[name], value);
        }
    }
    SetUniform4fv(name, value)
    {
        if (this.ContainsUniform(name))
        {
            this.Use();
            this.gl.uniform4fv(this.uniforms[name], value);
        }
    }
    SetUniformMatrix4fv(name, value)
    {
        if (this.ContainsUniform(name))
        {
            this.Use();
            this.gl.uniformMatrix4fv(this.uniforms[name], false, value);
        }
    }
    SetUniformMatrix2fv(name, value)
    {
        if (this.ContainsUniform(name))
        {
            this.Use();
            this.gl.uniformMatrix2fv(this.uniforms[name], false, value);
        }
    }
    SetUniformMatrix3fv(name, value)
    {
        if (this.ContainsUniform(name))
        {
            this.Use();
            this.gl.uniformMatrix3fv(this.uniforms[name], false, value);
        }
    }


}

class Assets 
{
    static images = {};
    static imagesList = [];
    static imagesToLoad=[];
    static sounds = {};
    static soundsList = [];
    static soundsToLoad=[];

    static AddImage(src,name)
    {
        let id = name || src;
        this.imagesToLoad.push({src:src,name:id});
        return this.imagesToLoad.length-1; 
    }

    static AddSound(src,name)
    {
        let id = name || src;
        this.soundsToLoad.push({src:src,name:id});
        return this.soundsToLoad.length-1; 
    }

    static   async LoadImages( delayBetweenImages = 0)
    {
       const totalImages = this.imagesToLoad.length;
       let loadedImages = 0;
       console.log("Total de imagens "+ totalImages);
      

       const loadImageWithDelay = async (src, name) => 
       {
           return new Promise((resolve, reject) =>
            {
               const image = new Image();
               image.src = src;

               image.onload = () => 
               {
              
                     this.images[name] = image;
                     this.imagesList.push(image);
                  
    
                   resolve(image);
               };

                 image.onerror = (error) =>
                {
                   reject(error);
                   console.error('Erro ao carregar a imagem:', error); 
               };
           });
       };

       const loadImagesSequentially = async () => 
       {

           for (const image of this.imagesToLoad) 
           {
               await loadImageWithDelay(image.src,image.name);
               loadedImages++;
               const progress = loadedImages / totalImages;
               Game.DrawProgressBar(progress);
               //await new Promise(resolve => setTimeout(resolve, delayBetweenImages));
               await new Promise((resolve, reject) => 
               {
                if (delayBetweenImages === 0)
                {
                    resolve();
                } else 
                {
                    setTimeout(() => 
                    {
                        resolve();
                    }, delayBetweenImages);
                }
             
               });
               
           }
          
       };

       try 
       {
           await loadImagesSequentially();
           console.log('Todas as imagens foram carregadas com sucesso!');
           this.imagesToLoad = [];
           Game.DrawProgressBar(1); // Atualiza a barra de progresso para 100% quando todas as imagens são carregadas
       } catch (error) 
       {
           console.error('Erro ao carregar imagens:', error);
       }
    }

    static   async LoadSounds( delayBetweenSounds = 0)
    {
       const totalSounds = this.soundsToLoad.length;
       let loadedSounds = 0;
       console.log("Total de sons "+ totalSounds);
      

       const loadSoundWithDelay = async (src, name) => 
       {
           return new Promise((resolve, reject) =>
            {
               const sound = new Audio();
               sound.src = src;

               sound.onload = () => 
               {
              
                     this.sounds[name] = sound;
                     this.soundsList.push(sound);
                  
    
                   resolve(sound);
               };

                 sound.onerror = (error) =>
                {
                   reject(error);
                   console.error('Erro ao carregar o som:', error); 
               };
           });
       };

       const loadSoundsSequentially = async () => 
       {

           for (const sound of this.soundsToLoad) 
           {
               await loadSoundWithDelay(sound.src,sound.name);
               loadedSounds++;
               const progress = loadedSounds / totalSounds;
               Game.DrawProgressBar(progress);
               //await new Promise(resolve => setTimeout(resolve, delayBetweenSounds));
               await new Promise((resolve, reject) => 
               {
                if (delayBetweenSounds === 0)
                {
                    resolve();
                } else 
                {
                    setTimeout(() => 
                    {
                        resolve();
                    }, delayBetweenSounds);
                }
             
               });
               
           }
          
       };

       try 
       {
           await loadSoundsSequentially();
           console.log('Todos os sons foram carregados com sucesso!');
           this.soundsToLoad = [];
           Game.DrawProgressBar(1); // Atualiza a barra de progresso para 100% quando todos os sons são carregados
       } catch (error) 
       {
           console.error('Erro ao carregar sons:', error);
       }
    }


}

//BlendMode

const BlendMode =
{
    Normal: 0,
    Additive: 1,
    Multiply: 2,
    One : 3,
};

class Renderer
{
    static currentProgram = -1;
    static currentTexture = -1;
    static currentTextureLayer = -1;
    static isBlendEnabled = false;
    static isDepthTestEnabled = false;
    static isCullFaceEnabled = false;
    static blendMode = -1;
    static shaders = {};
    static viewMatrix       = new Mat4();
    static projectionMatrix = new Mat4();
    static modelMatrix      = new Mat4();
    

    static Init()
    {
        console.log("Initializing renderer");
        let gl = Game.gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
       // gl.disable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.frontFace(gl.CCW);

       // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        //gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);


        Renderer.shaders["solid"]   = Renderer.LoadSolidShader();
        Renderer.shaders["sprite"] = Renderer.LoadTextureShader();
    }
    static GetViewMatrix()
    {
        return Renderer.viewMatrix;
    }
    static GetProjectionMatrix()
    {
        return Renderer.projectionMatrix;
    }
    static GetModelMatrix()
    {
        return Renderer.modelMatrix;
    }
    static SetProjectionMatrix(matrix)  
    {
        Renderer.projectionMatrix.m[0] = matrix[0];
        Renderer.projectionMatrix.m[1] = matrix[1];
        Renderer.projectionMatrix.m[2] = matrix[2];
        Renderer.projectionMatrix.m[3] = matrix[3];
        Renderer.projectionMatrix.m[4] = matrix[4];
        Renderer.projectionMatrix.m[5] = matrix[5];
        Renderer.projectionMatrix.m[6] = matrix[6]; 
        Renderer.projectionMatrix.m[7] = matrix[7];
        Renderer.projectionMatrix.m[8] = matrix[8];
        Renderer.projectionMatrix.m[9] = matrix[9];
        Renderer.projectionMatrix.m[10] = matrix[10];
        Renderer.projectionMatrix.m[11] = matrix[11];
        Renderer.projectionMatrix.m[12] = matrix[12];
        Renderer.projectionMatrix.m[13] = matrix[13];
        Renderer.projectionMatrix.m[14] = matrix[14];
        Renderer.projectionMatrix.m[15] = matrix[15];
    }
    static SetViewMatrix(matrix)
    {
        Renderer.viewMatrix.m[0] = matrix[0];
        Renderer.viewMatrix.m[1] = matrix[1];
        Renderer.viewMatrix.m[2] = matrix[2];
        Renderer.viewMatrix.m[3] = matrix[3];
        Renderer.viewMatrix.m[4] = matrix[4];
        Renderer.viewMatrix.m[5] = matrix[5];
        Renderer.viewMatrix.m[6] = matrix[6]; 
        Renderer.viewMatrix.m[7] = matrix[7];
        Renderer.viewMatrix.m[8] = matrix[8];
        Renderer.viewMatrix.m[9] = matrix[9];
        Renderer.viewMatrix.m[10] = matrix[10];
        Renderer.viewMatrix.m[11] = matrix[11];
        Renderer.viewMatrix.m[12] = matrix[12];
        Renderer.viewMatrix.m[13] = matrix[13];
        Renderer.viewMatrix.m[14] = matrix[14];
        Renderer.viewMatrix.m[15] = matrix[15];

    }

    static SetOrthoViewMatrix(left, right, bottom, top, near, far)
    {
        Renderer.viewMatrix.ortho(left, right, bottom, top, near, far);
    }

    static GetShader(name)  
    {
        return Renderer.shaders[name];
    }
        static  LoadSolidShader()
        {
            let VertexShaderSolid = `
            precision mediump float;
            attribute vec3 aPosition;
            attribute vec4 aColor;
            uniform mat4 uProjection;
            uniform mat4 uView;
            varying vec4 vColor;
            void main()
            {
                gl_Position = uProjection * uView * vec4(aPosition, 1.0);
                vColor = aColor;
            }
            `;

            let FragmentShaderSolid = `
            precision mediump float;
            varying vec4 vColor;
            void main()
            {
                gl_FragColor = vColor;
            }
            `;

            let shader = new Shader();
            shader.Load(VertexShaderSolid, FragmentShaderSolid);
            shader.AddUniform("uProjection");
            shader.AddUniform("uView");
            return shader;

        }

        static LoadTextureShader()
        {
            let VertexShaderSprite = `
            precision mediump float;
            attribute vec3 aPosition;
            attribute vec2 aTexCoord;
            attribute vec4 aColor;
            uniform mat4 uProjection;
            uniform mat4 uView;

            varying vec2 vTexCoord;
            varying vec4 vColor;

            void main()
                {
                    gl_Position = uProjection * uView * vec4(aPosition, 1.0);
                    vTexCoord = aTexCoord;
                    vColor = aColor;
                }
                `;

            let FragmentShaderSprite = `
            precision mediump float;
            varying vec2 vTexCoord;
            varying vec4 vColor;
            uniform sampler2D uTexture;

            void main()
            {
                gl_FragColor =  texture2D(uTexture, vTexCoord) * vColor;
            }
            `;
  
            let shader = new Shader();
            shader.Load(VertexShaderSprite, FragmentShaderSprite);
            shader.AddUniform("uProjection");
            shader.AddUniform("uView");
            shader.AddUniform("uTexture");
            shader.SetUniform1i("uTexture", 0);
            return shader;

        }

    static SetDepthTest(isEnabled)
    {
        if (this.isDepthTestEnabled !== isEnabled)
        {
            if (isEnabled)
            {
                Game.gl.enable(Game.gl.DEPTH_TEST);
            }
            else
            {
                Game.gl.disable(Game.gl.DEPTH_TEST);
            }
            this.isDepthTestEnabled = isEnabled;
        }
    }


    static SetCullFace(isEnabled)   
    {
        if (this.isCullFaceEnabled !== isEnabled)
        {
            if (isEnabled)
            {
                Game.gl.enable(Game.gl.CULL_FACE);
            }
            else
            {
                Game.gl.disable(Game.gl.CULL_FACE);
            }
            this.isCullFaceEnabled = isEnabled;
        }
    }

    static SetBlendMode(blendMode)
    {
        if (!this.isBlendEnabled)
        {

            if (this.blendMode !== blendMode)
            {
                switch (blendMode)
                {
                    case BlendMode.Normal:
                        Game.gl.blendFunc(Game.gl.SRC_ALPHA, Game.gl.ONE_MINUS_SRC_ALPHA);
                        break;
                    case BlendMode.Additive:
                        Game.gl.blendFunc(Game.gl.SRC_ALPHA, Game.gl.ONE);
                        break;
                    case BlendMode.Multiply:
                        Game.gl.blendFunc(Game.gl.DST_COLOR, Game.gl.ONE_MINUS_SRC_ALPHA);
                        break;
                    case BlendMode.One:
                        Game.gl.blendFunc(Game.gl.ONE, Game.gl.ONE);
                        break;
                }
                this.blendMode = blendMode;
            }
        }
    }
    

    static EnableBlend()
    {
        if (!this.isBlendEnabled)
        {
            Game.gl.enable(Game.gl.BLEND);
            this.isBlendEnabled = true;
        }
    }

    static DisableBlend()
    {
        if (this.isBlendEnabled)
        {
            Game.gl.disable(Game.gl.BLEND);
            this.isBlendEnabled = false;
        }
    }

    static SetScissor(x,y,width,height)
    {
        Game.gl.scissor(x,y,width,height);
    }

    static SetViewport(x,y,width,height)
    {
        Game.gl.viewport(x,y,width,height);
    }
 

    static SetClearColor(r,g,b,a)
    {
        Game.gl.clearColor(r,g,b,a);
    }

    static Clear()
    {
        Game.gl.clear(Game.gl.COLOR_BUFFER_BIT);
    }

    static SetProgram(program)
    {
        if (this.currentProgram !== program)
        {
            Game.gl.useProgram(program);
            this.currentProgram = program;
        }
    }

    static SetTexture(texture)
    {
        Game.gl.activeTexture(Game.gl.TEXTURE0 );
        Game.gl.bindTexture(Game.gl.TEXTURE_2D, texture);

        // if (this.currentTexture !== texture || this.currentTextureLayer !== layer)
        // {
        //     Game.gl.activeTexture(Game.gl.TEXTURE0 + layer);
        //     Game.gl.bindTexture(Game.gl.TEXTURE_2D, texture);
        //     this.currentTexture = texture;
        //     this.currentTextureLayer = layer;
        // }
    }  
  
}



class Game 
{
    static isRunning = false;
    static assetsToLoad=false;
    static currentScene = null;
    static textures = {};
    static texturesList = [];
    static images = {};
    static imagesList = [];
    static imagesToLoad=[];
    static width = 0;
    static height = 0;
    static canvas = null;
    static gl = null;

    static mouseDown = false;



    static Init(width, height)
    {   
        Game.width = width;
        Game.height = height; 
        Game.canvas = document.getElementById("canvas");
        Game.gl = Game.canvas.getContext("webgl");
        if (!Game.gl) 
        {
            return false;
        }

        this.MouseDown = function(x,y,b) {};
        this.MouseUp = function(x,y) {};
        this.MouseMove = function(x,y) {};
        this.MouseClick = function(x,y,b) {};
        this.canvas.addEventListener("webglcontextlost", function (event)
         {
            console.log("Contexto WebGL perdido");

          event.preventDefault();
        
          // Stop rendering
          window.cancelAnimationFrame(requestId);
        }, false);
        
        this.canvas.addEventListener("webglcontextrestored", function (event)
       {
        console.log("Contexto WebGL restaurado");
        
         // initializeResources();
        }, false);
        Game.canvas.width = width;  
        Game.canvas.height = height;



        this.canvas.addEventListener("click", this.OnMouseClicked);
        this.canvas.addEventListener("mousedown", this.OnMouseDown);
        this.canvas.addEventListener("mouseup", this.OnMouseUp);
        this.canvas.addEventListener("mousemove", this.OnMouseMove);
        Renderer.Init();
        Renderer.SetClearColor(0.0, 0.0, 0.0, 1.0);
        Renderer.SetViewport(0, 0, width, height);
        this.OnRender= function(gl) {};
        this.OnUpdate= function(dt) {};
        this.OnProcess= function() {};


      let wi = this.width/4;
      this.progressBar = 
      {
          x: (this.width  / 2)-wi/2,
          y: this.height / 2,
          width: this.width /4,
          height: 20
      };
      return true;
    } 

    static OnMouseClicked(event) 
    {
        let rect = Game.canvas.getBoundingClientRect();
        let mouseX = event.clientX - rect.left;
        let mouseY = event.clientY - rect.top;
      //  console.log("Mouse clicked at: " + mouseX + " " + mouseY + " Button: " + event.button);
        Game.MouseClick(mouseX, mouseY, event.button-1);
      
    }

    static OnMouseDown(event)
    {
        let rect = Game.canvas.getBoundingClientRect();
        let mouseX = event.clientX - rect.left;
        let mouseY = event.clientY - rect.top;
       // console.log("Mouse down at: " + mouseX + " " + mouseY);
        Game.MouseDown(mouseX, mouseY, event.button);
        Game.mouseDown = true;
    }

    static OnMouseUp(event)
    {
        let rect = Game.canvas.getBoundingClientRect();
        let mouseX = event.clientX - rect.left;
        let mouseY = event.clientY - rect.top;
        Game.MouseUp(mouseX, mouseY);
        Game.mouseDown = false;
       // console.log("Mouse up at: " + mouseX + " " + mouseY);
    }

    static OnMouseMove(event)
    {
        let rect = Game.canvas.getBoundingClientRect();
        let mouseX = event.clientX - rect.left;
        let mouseY = event.clientY - rect.top;
        Game.MouseMove(mouseX, mouseY);
      //  console.log("Mouse move at: " + mouseX + " " + mouseY);
    }

    static AddImage(src,name)
    {
        let id = name || src;
        this.imagesToLoad.push({src:src,name:id});
        this.assetsToLoad = true;
        return this.imagesToLoad.length-1; 
    }
    static GetTexture(name)
    {
        return this.textures[name];
    }
    static GetTextureByIndex(index)
    {
        return this.texturesList[index];
    }
    static async  LoadFile(filename)
    {
        try 
        {
            const response = await fetch(filename);
            const data = await response.text();
            return data;
        } catch (error) 
        {
            console.error('Erro ao carregar o arquivo:', error);
            throw error;
        }
    }

    static   async LoadImages( delayBetweenImages = 0)
    {
       const totalImages = this.imagesToLoad.length;
       let loadedImages = 0;
       console.log("Total de imagens "+ totalImages);
      

       const loadImageWithDelay = async (src, name) => 
       {
           return new Promise((resolve, reject) =>
            {
               const image = new Image();
               image.src = src;

               image.onload = () => 
               {
              
                     this.images[name] = image;
                     this.imagesList.push(image);
                     let texture = new Texture2D();
                     texture.Load(image);
                     this.textures[name] = texture;
                     this.texturesList.push(texture);



                  
    
                   resolve(image);
               };

                 image.onerror = (error) =>
                {
                   reject(error);
                   console.error('Erro ao carregar a imagem:', error); 
               };
           });
       };

       const loadImagesSequentially = async () => 
       {

           for (const image of this.imagesToLoad) 
           {
               await loadImageWithDelay(image.src,image.name);
               loadedImages++;
               const progress = loadedImages / totalImages;
               Game.DrawProgressBar(progress);
               //await new Promise(resolve => setTimeout(resolve, delayBetweenImages));
               await new Promise((resolve, reject) => 
               {
                if (delayBetweenImages === 0)
                {
                    resolve();
                } else 
                {
                    setTimeout(() => 
                    {
                        resolve();
                    }, delayBetweenImages);
                }
             
               });
               
           }
          
       };

       try 
       {
           await loadImagesSequentially();
           console.log('Todas as imagens foram carregadas com sucesso!');
           Game.imagesToLoad = [];
           this.assetsToLoad = false;
           Game.DrawProgressBar(1); // Atualiza a barra de progresso para 100% quando todas as imagens são carregadas
       } catch (error) 
       {
           console.error('Erro ao carregar imagens:', error);
       }
   }

   static DrawProgressBar(progress) 
   {
       

    //    Game.context.clearRect(0, 0, this.width, this.height);
    //    Game.context.fillStyle = 'lightgray';
    //    Game.context.fillRect(this.progressBar.x, this.progressBar.y, this.progressBar.width, this.progressBar.height);

    //    Game.context.fillStyle = 'green';
    //    const progressWidth = progress * this.progressBar.width;
    //    Game.context.fillRect(this.progressBar.x, this.progressBar.y, progressWidth, this.progressBar.height);

    //    Game.context.fillStyle = 'white';
    //    Game.context.font = '16px Arial';
    //    Game.context.textAlign = 'center';
    //    Game.context.fillText(`CARREGANDO  ${Math.round(progress * 100)}%`, this.width / 2, this.progressBar.y - 10);
   }





    static Start()
    {
        Game.isRunning = true;
        GameLoop();

    }


    static Update(dt)
    {
        if (!Game.isRunning || Game.assetsToLoad)
            return;
        Game.OnUpdate(dt);
    }

    static Process()
    {
        if (!Game.isRunning || Game.assetsToLoad)
            return;
        Game.OnProcess();
      
    }

    static Render()
    {
        
        if (!Game.isRunning || Game.assetsToLoad)
            return;
        Game.OnRender(Game.gl);
         
    }

   
  
    static Resize(width, height)
    {
        Game.width = width;
        Game.height = height;
      
    }

    static ShowMouse()
    {
        canvas.canvas.style.cursor = "auto";
    }
    static HideMouse()
    {
        canvas.canvas.style.cursor = "none";
    }


    static SetCursor(name)
    {
        canvas.style.cursor = name;
    }
    static SetTitle(title)
    {
        window.document.title = title;
    }
}