

const POINTS                         = 0x0000;
const LINES                          = 0x0001;
const LINE_LOOP                      = 0x0002;
const LINE_STRIP                     = 0x0003;
const TRIANGLES                      = 0x0004;
const TRIANGLE_STRIP                 = 0x0005;
const TRIANGLE_FAN                   = 0x0006;


class Color 
{
    constructor(r, g, b, a)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}
const RED = new Color(1.0, 0.0, 0.0, 1.0);
const GREEN = new Color(0.0, 1.0, 0.0, 1.0);
const BLUE = new Color(0.0, 0.0, 1.0, 1.0);
const WHITE = new Color(1.0, 1.0, 1.0, 1.0);
const BLACK = new Color(0.0, 0.0, 0.0, 1.0);
const YELLOW = new Color(1.0, 1.0, 0.0, 1.0);
const MAGENTA = new Color(1.0, 0.0, 1.0, 1.0);
const CYAN = new Color(0.0, 1.0, 1.0, 1.0);
const ORANGE = new Color(1.0, 0.5, 0.0, 1.0);
const GRAY = new Color(0.5, 0.5, 0.5, 1.0);
const BROWN = new Color(0.5, 0.25, 0.0, 1.0);
const PURPLE = new Color(0.5, 0.0, 0.5, 1.0);
const PINK = new Color(1.0, 0.5, 0.5, 1.0);
const LIME = new Color(0.5, 1.0, 0.5, 1.0);
const TEAL = new Color(0.0, 0.5, 0.5, 1.0);
const OLIVE = new Color(0.5, 0.5, 0.0, 1.0);
const MAROON = new Color(0.5, 0.0, 0.0, 1.0);
const NAVY = new Color(0.0, 0.0, 0.5, 1.0);
const SILVER = new Color(0.75, 0.75, 0.75, 1.0);
const GOLD = new Color(1.0, 0.84, 0.0, 1.0);
const SKYBLUE = new Color(0.53, 0.81, 0.98, 1.0);
const VIOLET = new Color(0.93, 0.51, 0.93, 1.0);
const INDIGO = new Color(0.29, 0.0, 0.51, 1.0);
const TURQUOISE = new Color(0.25, 0.88, 0.82, 1.0);
const BEIGE = new Color(0.96, 0.96, 0.86, 1.0);
const TAN = new Color(0.82, 0.71, 0.55, 1.0);
const KHAKI = new Color(0.94, 0.9, 0.55, 1.0);
const LAVENDER = new Color(0.9, 0.9, 0.98, 1.0);
const SALMON = new Color(0.98, 0.5, 0.45, 1.0);
const CORAL = new Color(1.0, 0.5, 0.31, 1.0);
const AQUA = new Color(0.0, 1.0, 1.0, 1.0);
const MINT = new Color(0.74, 0.99, 0.79, 1.0);
const LEMON = new Color(0.99, 0.91, 0.0, 1.0);
const APRICOT = new Color(0.98, 0.81, 0.69, 1.0);
const PEACH = new Color(1.0, 0.9, 0.71, 1.0);
const LILAC = new Color(0.78, 0.64, 0.78, 1.0);
const LAVENDERBLUSH = new Color(1.0, 0.94, 0.96, 1.0);
const CRIMSON = new Color(0.86, 0.08, 0.24, 1.0);
const DARKORANGE = new Color(1.0, 0.55, 0.0, 1.0);


class SpriteBatch 
{
    constructor(capacity)
    {
        this.maxVertex = capacity;
        this.vertexStrideSize = (3 + 2 + 4);
        this.vertices = new Float32Array(capacity * 4 * this.vertexStrideSize *4);
        this.indices  = new Uint16Array(capacity *  4 * 6);
        this.maxElemnts = capacity * 4 * 6;


        this.totalAlloc = Math.floor( ( this.maxVertex * 4 * this.vertexStrideSize * 4) / 9);

        this.vertexCount  = 0;
        this.vertexIndex  = 0;
        this.textureCount = 0;

        this.invTexWidth  = 1;
        this.invTexHeight = 1;




        this.colorr=1.0;
        this.colorg=1.0;
        this.colorb=1.0;
        this.colora=1.0;
        this.uvx=0;
        this.uvy=0;
        
        this.defaultTexture  = new Texture2D();
        let k=0;
        for (let i = 0; i < this.maxElemnts ; i+=6)
        {
            this.indices[i ]    = 4 * k + 0;
            this.indices[i + 1] = 4 * k + 1;
            this.indices[i + 2] = 4 * k + 2;
            this.indices[i + 3] = 4 * k + 0;
            this.indices[i + 4] = 4 * k + 2;
            this.indices[i + 5] = 4 * k + 3;
            k++;
        }    
   

    }
    SwitchTexture(texture)
    {
        if (this.currentBaseTexture === texture) return;
        this.currentBaseTexture = texture;
        this.invTexWidth =  1.0 / texture.width;
        this.invTexHeight = 1.0 / texture.height;
        this.textureCount++;
    }
    Init()
    {
        let gl = Game.gl;

      
        var data = new Uint8Array(
        [
           255, 0, 255, 255,   
        ]);
        this.defaultTexture.Create(1, 1, 4,data);
        this.currentBaseTexture = this.defaultTexture;
 

        
        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer  = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, this.vertexStrideSize *4, 0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, this.vertexStrideSize *4, 3 * 4);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 4, gl.FLOAT, false, this.vertexStrideSize *4, 5 * 4);


    }
    Vertex3(x, y, z)
    {
        this.vertices[this.vertexIndex++] = x;
        this.vertices[this.vertexIndex++] = y;
        this.vertices[this.vertexIndex++] = z;
        this.vertices[this.vertexIndex++] = this.uvx;
        this.vertices[this.vertexIndex++] = this.uvy;
        this.vertices[this.vertexIndex++] = this.colorr;
        this.vertices[this.vertexIndex++] = this.colorg;
        this.vertices[this.vertexIndex++] = this.colorb;
        this.vertices[this.vertexIndex++] = this.colora;

        if ( this.vertexCount >= this.totalAlloc ) 
        {
            throw "Vertex buffer overflow with " +this.vertexCount + "  max  " + this.totalAlloc;
        }

        this.vertexCount++;

    }




    Begin()
    {

        // this.vertexIndex = 0;
        // this.vertexCount = 0;
        // this.textureCount = 0;
        // this.currentBaseTexture = this.defaultTexture;

        // let gl = Game.gl;

        // gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // gl.enableVertexAttribArray(0);
        // gl.vertexAttribPointer(0, 3, gl.FLOAT, false, this.vertexStrideSize *4, 0);
        // gl.enableVertexAttribArray(1);
        // gl.vertexAttribPointer(1, 2, gl.FLOAT, false, this.vertexStrideSize *4, 3 * 4);
        // gl.enableVertexAttribArray(2);
        // gl.vertexAttribPointer(2, 4, gl.FLOAT, false, this.vertexStrideSize *4, 5 * 4);
 
        // gl.enable(gl.BLEND);
        // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // let shader = Renderer.GetShader("sprite");
        // shader.Use();
        // shader.SetUniformMatrix4fv("uProjection", Renderer.projectionMatrix.m);
        // shader.SetUniformMatrix4fv("uView", Renderer.viewMatrix.m);
        // shader.SetUniform1i("uTexture", 0);

      
    }

    Render()
    {
        this.Flush();
    }

    Flush()
    {
        let gl = Game.gl;

       if (this.vertexCount === 0) return;

     

 
       
       gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
       gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices.subarray(0, this.vertexIndex));




   

   //    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
       gl.enableVertexAttribArray(0);
       gl.vertexAttribPointer(0, 3, gl.FLOAT, false, this.vertexStrideSize *4, 0);
       gl.enableVertexAttribArray(1);
       gl.vertexAttribPointer(1, 2, gl.FLOAT, false, this.vertexStrideSize *4, 3 * 4);
       gl.enableVertexAttribArray(2);
       gl.vertexAttribPointer(2, 4, gl.FLOAT, false, this.vertexStrideSize *4, 5 * 4);

       gl.enable(gl.BLEND);
       gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

       let shader = Renderer.GetShader("sprite");
       shader.Use();
       shader.SetUniformMatrix4fv("uProjection", Renderer.projectionMatrix.m);
       shader.SetUniformMatrix4fv("uView", Renderer.viewMatrix.m);
       shader.SetUniform1i("uTexture", 0);

       

         





        this.currentBaseTexture.Use();

        //console.log("Draw " + this.vertexIndex + " " + this.vertexCount * 6 + " " + this.textureCount);



        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.drawElements(gl.TRIANGLES, this.vertexCount *6, gl.UNSIGNED_SHORT, 0);
       // gl.drawArrays(gl.TRIANGLES, 0, this.vertexIndex);




        this.vertexIndex = 0;
        this.vertexCount = 0;
        this.textureCount = 0;

     //   this.currentBaseTexture = this.defaultTexture;
    }

    SetColor4f(r, g, b, a)
    {
        this.colorr = r;
        this.colorg = g;
        this.colorb = b;
        this.colora = a;
    }
    SetColor (color)
    {
        this.colorr = color.r;
        this.colorg = color.g;
        this.colorb = color.b;
        this.colora = color.a;
    }
    Vertex2(x, y)
    {
        this.Vertex3(x, y, 0.0);
    }

    TextCoords(u, v)
    {
        this.uvx = u ;
        this.uvy = v ;
    }

    Color4f(r, g, b, a)
    {
        this.colorr = r;
        this.colorg = g;
        this.colorb = b;
        this.colora = a;
    }
    Color3f(r, g, b)
    {
        this.colorr = r;
        this.colorg = g;
        this.colorb = b;
    }
    
    Color(color)
    {
        this.colorr = color.r;
        this.colorg = color.g;
        this.colorb = color.b;
        this.colora = color.a;
    }


    Draw(texture, x, y, width, height)
    {
        if (texture !== this.currentBaseTexture)
        {
            this.Flush();
            this.SwitchTexture(texture);
        }


        let u = 0;
        let v = 0;
        let u2 = 1;
        let v2 = 1;

        let fx2 = x + width;
        let fy2 = y + height;

        this.TextCoords(u, v);
        this.Vertex2(x, y);

        this.TextCoords(u, v2);
        this.Vertex2(x, fy2);

        this.TextCoords(u2, v2);
        this.Vertex2(fx2, fy2);

        this.TextCoords(u2, v);
        this.Vertex2(fx2, y);

    }

    DrawRotate(texture, x, y, w, h, pivot_x, pivot_y,rotation)
    {
        if (texture !== this.currentBaseTexture)
        {
            this.Flush();
            this.SwitchTexture(texture);
        }

        let spin = (rotation * DEG2RAD);
        let cosRotation = Math.cos(spin);
        let sinRotation = Math.sin(spin);


        let dx = -pivot_x * w;
        let dy = -pivot_y * h;

        let topLeftX = x + dx * cosRotation - dy * sinRotation;
        let topLeftY = y + dx * sinRotation + dy * cosRotation;

        let topRightX = x + (dx + w) * cosRotation - dy * sinRotation;
        let topRightY = y + (dx + w) * sinRotation + dy * cosRotation;

        let bottomLeftX = x + dx * cosRotation - (dy + h) * sinRotation;
        let bottomLeftY = y + dx * sinRotation + (dy + h) * cosRotation;

        let bottomRightX = x + (dx + w) * cosRotation - (dy + h) * sinRotation;
        let bottomRightY = y + (dx + w) * sinRotation + (dy + h) * cosRotation;


        let u = 0;
        let v = 0;
        let u2 = 1;
        let v2 = 1;

        this.TextCoords(u, v);
        this.Vertex2(topLeftX, topLeftY);

        this.TextCoords(u, v2);
        this.Vertex2(bottomLeftX, bottomLeftY);

        this.TextCoords(u2, v2);
        this.Vertex2(bottomRightX, bottomRightY);

        this.TextCoords(u2, v);
        this.Vertex2(topRightX, topRightY);

        
    }

    DrawRectangle(x, y, width,height)
    {
        this.TextCoords(0, 0);
        this.Vertex2(x, y);

        this.TextCoords(1, 0);
        this.Vertex2(x , y );

        this.TextCoords(1, 1);
        this.Vertex2(x + width, y + height);

        this.TextCoords(0, 1);
        this.Vertex2(x + width , y + height);
    }
    
}

class PolyBatch
{
    constructor(maxVertex)
    {
        this.vertexStrideSize = (3 + 4) ;

        this.maxVertex =  maxVertex ;
 
        this.vertices = new Float32Array( this.maxVertex * 3 * this.vertexStrideSize *4); 
        this.totalAlloc = Math.floor( ( this.maxVertex * 3 * this.vertexStrideSize * 4) /7 );
        console.log("TotalAlloc: " + this.totalAlloc + " Vertex: " + Math.floor(this.totalAlloc*7));
        this.vertexCount= 0;
        this.indexCount = 0;
        this.colorr=1.0;
        this.colorg=1.0;
        this.colorb=1.0;
        this.colora=1.0;
        this.mode = -1;
   
    }

    Init()
    {
        let gl = Game.gl;
       

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
 
     

        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, this.vertexStrideSize *4, 0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, this.vertexStrideSize *4, 3*4);





    }
    Vertex3f(x, y, z)
    {
       
        this.vertices[this.indexCount++] = x;
        this.vertices[this.indexCount++] = y;
        this.vertices[this.indexCount++] = z;
        this.vertices[this.indexCount++] = this.colorr;
        this.vertices[this.indexCount++] = this.colorg;
        this.vertices[this.indexCount++] = this.colorb;
        this.vertices[this.indexCount++] = this.colora;
        
        if ( this.vertexCount >= this.totalAlloc ) 
        {

            throw "Vertex buffer overflow with " +this.vertexCount + "  max  " + this.totalAlloc;
        }

        this.vertexCount++;
        
       
    }
    Vertex2f(x, y)
    {
        this.Vertex3f(x, y, 0.5);
    }
    Color4f(r, g, b, a)
    {
        this.colorr = r;
        this.colorg = g;
        this.colorb = b;
        this.colora = a;
    }
    Color3f(r, g, b)
    {
        this.colorr = r;
        this.colorg = g;
        this.colorb = b;
    }

    Render()
    {
       this.Flush();   
    }

    Flush()
    {
        let gl = Game.gl;
        if (this.indexCount === 0) return;
        if (this.mode === -1) return;

        let shader = Renderer.GetShader("solid");
        shader.Use();
        shader.SetUniformMatrix4fv("uProjection", Renderer.projectionMatrix.m);
        shader.SetUniformMatrix4fv("uView", Renderer.viewMatrix.m);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices.subarray(0, this.indexCount));
      
    
           
      
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, this.vertexStrideSize*4, 0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, this.vertexStrideSize*4, 3*4);
 



        let count =this.vertexCount;

   
  
        gl.drawArrays(this.mode, 0, count);

        gl.disableVertexAttribArray(0);
        gl.disableVertexAttribArray(1);
        gl.disableVertexAttribArray(2);

     //   console.log( "Vertex buffer overflow with " + this.indexCount+" vtx " +this.vertexCount + "  max  " + this.totalAlloc);
    
        const error = Game.gl.getError();
       if (error !== Game.gl.NO_ERROR) 
       {
        console.log( "Vertex buffer overflow" + this.indexCount + " "+this.vertexCount +" "+ this.totalAlloc);
          // console.error("Erro WebGL:", error);       
       }

        this.indexCount = 0;
        this.vertexCount = 0;
        this.linesCount = 0;
        this.triCount = 0;
    }
    Clear()
    {
   
        this.indexCount = 0;
        this.vertexCount = 0;
    }
    SetMode(mode)
    {
        if (this.mode !== mode)
        {
            this.Flush();
        }
     
        this.mode = mode;
    }

    SetColor4f(r, g, b, a)
    {
        this.colorr = r;
        this.colorg = g;
        this.colorb = b;
        this.colora = a;
    }
    SetColor3f(r, g, b)
    {
        this.colorr = r;
        this.colorg = g;
        this.colorb = b;
    }
    SetColor(color)
    {
        this.colorr = color.r;
        this.colorg = color.g;
        this.colorb = color.b;
        this.colora = color.a;
    }
    Line(x1, y1, x2, y2)
    {
        this.SetMode(LINES);
        this.Vertex2f(x1, y1);
        this.Vertex2f(x2, y2);
    }

    DrawRotateRectangle(x, y, w, h, pivot_x, pivot_y,rotation)
    {
        let cosRotation = Math.cos(rotation*DEG2RAD);
        let sinRotation = Math.sin(rotation*DEG2RAD);


        let dx = -pivot_x * w;
        let dy = -pivot_y * h;

        let topLeftX = x + dx * cosRotation - dy * sinRotation;
        let topLeftY = y + dx * sinRotation + dy * cosRotation;

        let topRightX = x + (dx + w) * cosRotation - dy * sinRotation;
        let topRightY = y + (dx + w) * sinRotation + dy * cosRotation;

        let bottomLeftX = x + dx * cosRotation - (dy + h) * sinRotation;
        let bottomLeftY = y + dx * sinRotation + (dy + h) * cosRotation;

        let bottomRightX = x + (dx + w) * cosRotation - (dy + h) * sinRotation;
        let bottomRightY = y + (dx + w) * sinRotation + (dy + h) * cosRotation;


        this.SetMode(TRIANGLES);

        
        this.Vertex2f(topLeftX, topLeftY);
        this.Vertex2f(topRightX, topRightY);
        this.Vertex2f(bottomRightX, bottomRightY);

        this.Vertex2f(bottomRightX, bottomRightY);
        this.Vertex2f(bottomLeftX, bottomLeftY);
        this.Vertex2f(topLeftX, topLeftY);

        
    }
    DrawCircleSector(x, y, radius, startAngle, endAngle,  segments)
    {
            
            this.SetMode(TRIANGLES);
            if (radius <= 0.0) radius = 0.1;
            if (endAngle < startAngle)
            {
                let tmp = startAngle;
                startAngle = endAngle;
                endAngle = tmp;
            }
    
            let minSegments = Math.ceil((endAngle - startAngle)/90);
    
            if (segments < minSegments)
            {
                let th = Math.acos(2*Math.pow(1 - 0.5/radius, 2) - 1);
                segments = Math.ceil(2*Math.PI/th);
                if (segments <= 0) segments = minSegments;
            }
    
            let stepLength = (endAngle - startAngle)/segments;
            let angle = startAngle;
           
    
            for (let i = 0; i < segments; i++)
            {
                this.Vertex2f(x, y);
                this.Vertex2f(x + Math.sin(DEG2RAD*angle)*radius, y + Math.cos(DEG2RAD*angle)*radius);
                this.Vertex2f(x + Math.sin(DEG2RAD*(angle + stepLength))*radius, y + Math.cos(DEG2RAD*(angle + stepLength))*radius);
                    
                angle += stepLength;
            }
    

    }
    DrawCircle(x, y, radius)    
    {
        this.DrawCircleSector(x, y, radius, 0, 360, 18);
    }


    DrawCircleSectorLines(x, y, radius, startAngle, endAngle,  segments)
    {

        this.SetMode(LINES);
        if (radius <= 0.0) radius = 0.1;
        if (endAngle < startAngle)
        {
            let tmp = startAngle;
            startAngle = endAngle;
            endAngle = tmp;
        }

        let minSegments = Math.ceil((endAngle - startAngle)/90);

        if (segments < minSegments)
        {
            let th = Math.acos(2*Math.pow(1 - 0.5/radius, 2) - 1);
            segments = Math.ceil(2*Math.PI/th);
            if (segments <= 0) segments = minSegments;
        }

        let stepLength = (endAngle - startAngle)/segments;
        let angle = startAngle;
        let showCapLines = false;

  
        
        if (showCapLines)
        {
        this.Vertex2f(x, y);
        this.Vertex2f(x + Math.sin(DEG2RAD*angle)*radius, y + Math.cos(DEG2RAD*angle)*radius);
        }

        for (let i = 0; i < segments; i++)
        {
            this.Vertex2f(x + Math.sin(DEG2RAD*angle)*radius, y + Math.cos(DEG2RAD*angle)*radius);
            this.Vertex2f(x + Math.sin(DEG2RAD*(angle + stepLength))*radius, y + Math.cos(DEG2RAD*(angle + stepLength))*radius);
                
            angle += stepLength;
        }
        if(showCapLines)
        {
        this.Vertex2f(x, y);
        this.Vertex2f(x + Math.sin(DEG2RAD*angle)*radius, y + Math.cos(DEG2RAD*angle)*radius);
        }

    
    }

    DrawCircleLines(x, y, radius)
    {
        this.DrawCircleSectorLines(x, y, radius, 0, 360, 18);

    }
    DrawEllipseLine(x, y, width, height)
    {
        this.SetMode(LINES);
        let segments = 36;
        let stepLength = 360/segments;
        let angle = 0;
        for (let i = 0; i < segments; i++)
        {
            this.Vertex2f(x + Math.sin(DEG2RAD*angle)*width, y + Math.cos(DEG2RAD*angle)*height);
            this.Vertex2f(x + Math.sin(DEG2RAD*(angle + stepLength))*width, y + Math.cos(DEG2RAD*(angle + stepLength))*height);
            angle += stepLength;
        }       
    }
    DrawRectangleLinesFromTo(x, y,x2,y2)
    {
        this.SetMode(LINES);
        this.Vertex2f(x, y);
        this.Vertex2f(x2, y);
        this.Vertex2f(x2, y);
        this.Vertex2f(x2, y2);
        this.Vertex2f(x2, y2);
        this.Vertex2f(x, y2);
        this.Vertex2f(x, y2);
        this.Vertex2f(x, y);
    }
    DrawRectangleLines(x, y,width,height)
    {
        this.SetMode(LINES);
        this.Vertex2f(x, y);
        this.Vertex2f(x + width, y);
        this.Vertex2f(x + width, y);
        this.Vertex2f(x + width, y + height);
        this.Vertex2f(x + width, y + height);
        this.Vertex2f(x, y + height);
        this.Vertex2f(x, y + height);
        this.Vertex2f(x, y);
    }
    DrawRectangle(x, y,width,height)
    {
        this.SetMode(TRIANGLES);
        this.Vertex2f(x, y);
        this.Vertex2f(x + width, y);
        this.Vertex2f(x + width, y + height);

        this.Vertex2f(x + width, y + height);
        this.Vertex2f(x, y + height);
        this.Vertex2f(x, y);
    }
    DrawRectangleFromTo(x, y,x2,y2)
    {
        this.SetMode(TRIANGLES);
        this.Vertex2f(x, y);
        this.Vertex2f(x2, y);
        this.Vertex2f(x2, y2);

        this.Vertex2f(x2, y2);
        this.Vertex2f(x, y2);
        this.Vertex2f(x, y);
    }
    DrawTriangleStrip(points)
    {
        this.SetMode(TRIANGLE_STRIP);
        for (let i = 0; i < points.length; i++)
        {
            this.Vertex2f(points[i].x, points[i].y);
        }
    }
    DrawTriangleFan(points)
    {
        this.SetMode(TRIANGLE_FAN);
        for (let i = 0; i < points.length; i++)
        {
            this.Vertex2f(points[i].x, points[i].y);
        }
    }
    DrawLines(points)
    {
        this.SetMode(LINES);
        for (let i = 0; i < points.length; i++)
        {
            this.Vertex2f(points[i].x, points[i].y);
        }
    }
    DrawPoints(points)
    {
        this.SetMode(POINTS);
        for (let i = 0; i < points.length; i++)
        {
            this.Vertex2f(points[i].x, points[i].y);
        }
    }
    DrawLineStrip(points)
    {
        this.SetMode(LINE_STRIP);
        for (let i = 0; i < points.length; i++)
        {
            this.Vertex2f(points[i].x, points[i].y);
        }
    }
    DrawLinesLoop(points)
    {
        this.SetMode(LINE_LOOP);
        for (let i = 0; i < points.length; i++)
        {
            this.Vertex2f(points[i].x, points[i].y);
        }
    }
    DrawTriangle(points)
    {
        this.SetMode(TRIANGLES);
        for (let i = 0; i < points.length; i++)
        {
            this.Vertex2f(points[i].x, points[i].y);
        }
    }
}




class CharacterInfo 
{
    constructor() 
    {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.char=0;

    }
}


class Font 
{
    constructor(filename,imageName)
    {
    
        this.mCharInfo=[];
        this.isReady = false;
        this.filename = filename;
        this.textureName = imageName;
        this.texture = null;
        this.depth= 1.0;
       

    }

    processData(data)
    {
        try 
        {
            let lines = data.split('\n');
            for (let i = 0; i < lines.length; i++)
            {
                let line = lines[i];
                let charInfo = new CharacterInfo();
                let tokens = line.split(',');
                charInfo.char = tokens[0].split('=')[1];
                charInfo.x = parseInt(tokens[1]);
                charInfo.y = parseInt(tokens[2]);
                charInfo.width = parseInt(tokens[3]);
                charInfo.height= parseInt(tokens[4]);
                charInfo.offsetX= parseInt(tokens[5]);
                charInfo.offsetY= parseInt(tokens[6]);
                this.mCharInfo.push(charInfo);
            }
           
        } 
        catch (e) 
        {
            this.isReady = false;
            console.log(e);
            return;
        }
        
        this.isReady = true;
    }

    async Load()
     {
        try 
        {
            const data = await Game.LoadFile(this.filename);
            this.processData(data);
            this.texture = Game.GetTexture(this.textureName);
        } catch (error) 
        {
            console.error('Erro ao carregar o arquivo:', error);
        }
    }

    Init(capacity)
    {
        // fetch(this.filename)
        // .then(response => response.text())
        // .then(data => {
   
        //     this.processData(data); 
        // })
        // .catch(error => console.error('Erro ao carregar o arquivo:', error));
    
        if (this.texture === null || !this.isReady) return;
        console.log("Font is ready");
       
        this.maxVertex = capacity;
        this.vertexStrideSize = (3 + 2 + 4);
        this.vertices = new Float32Array(capacity * 4 * this.vertexStrideSize *4);
        this.indices  = new Uint16Array(capacity *  4 * 6);
        this.maxElemnts = capacity * 4 * 6;


        this.totalAlloc = Math.floor( ( this.maxVertex * 4 * this.vertexStrideSize * 4) / 9);

        this.vertexCount  = 0;
        this.vertexIndex  = 0;
        this.textureCount = 0;

        this.invTexWidth =  1.0 / this.texture.width;
        this.invTexHeight = 1.0 / this.texture.height;




        this.colorr=1.0;
        this.colorg=1.0;
        this.colorb=1.0;
        this.colora=1.0;
 
        

        let k=0;
        for (let i = 0; i < this.maxElemnts ; i+=6)
        {
            this.indices[i ]    = 4 * k + 0;
            this.indices[i + 1] = 4 * k + 1;
            this.indices[i + 2] = 4 * k + 2;
            this.indices[i + 3] = 4 * k + 0;
            this.indices[i + 4] = 4 * k + 2;
            this.indices[i + 5] = 4 * k + 3;
            k++;
        }    

        let gl = Game.gl;

        
        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer  = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, this.vertexStrideSize *4, 0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, this.vertexStrideSize *4, 3 * 4);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 4, gl.FLOAT, false, this.vertexStrideSize *4, 5 * 4);
   

    }

    Render()
    {
        if (!this.isReady || this.vertexCount === 0) return;
    

        let gl = Game.gl;
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices.subarray(0, this.vertexIndex));
 

        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, this.vertexStrideSize *4, 0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, this.vertexStrideSize *4, 3 * 4);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 4, gl.FLOAT, false, this.vertexStrideSize *4, 5 * 4);
 
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
 
        let shader = Renderer.GetShader("sprite");
        shader.Use();
        shader.SetUniformMatrix4fv("uProjection", Renderer.projectionMatrix.m);
        shader.SetUniformMatrix4fv("uView", Renderer.viewMatrix.m);
        shader.SetUniform1i("uTexture", 0);
 
        
 
         this.texture.Use();
 
     
 
         
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
         gl.drawElements(gl.TRIANGLES, this.vertexCount *6, gl.UNSIGNED_SHORT, 0);
   
 
 
 
 
         this.vertexIndex = 0;
         this.vertexCount = 0;

    }

    SetColor4f(r, g, b, a)
    {
        this.colorr = r;
        this.colorg = g;
        this.colorb = b;
        this.colora = a;
    }
    SetColor3f(r, g, b)
    {
        this.colorr = r;
        this.colorg = g;
        this.colorb = b;
    }

    SetColor(color)
    {
        this.colorr = color.r;
        this.colorg = color.g;
        this.colorb = color.b;
        this.colora = color.a;
    }

    Print(x, y, size,text)
    {
        if (!this.isReady) return;
        let scale = size / 16;
        let offsetX = x;
        let offsetY = y;
        let length = text.length;
        for (let i = 0; i < length; i++)
        {
            let c = text.charCodeAt(i);
            if (c === 10)
            {
                offsetY -= 16 * scale;
                offsetX = 0;
                continue;
            }
            let charInfo = this.mCharInfo[c - 32];
            if (charInfo === undefined) continue;
            //console.log("Char: " + charInfo.char + " " + charInfo.x + " " + charInfo.y + " " + charInfo.width + " " + charInfo.height);
            let clip_x = charInfo.x;
            let clip_y = charInfo.y;
            let clip_w = charInfo.width;
            let clip_h = charInfo.height;
            let off_x = charInfo.offsetX;
            let off_y = charInfo.offsetY;

          
            this.DrawTexture(off_x + offsetX, off_y +offsetY, clip_w * scale, clip_h * scale, clip_x, clip_y, clip_w, clip_h);
            offsetX += clip_w * scale;
        }

    }

    DrawTexture(x, y, width, height, src_x,src_y,src_width,src_height)
    {

        if (!this.isReady ) return;
    

        let u = src_x / this.texture.width;
        let v = src_y / this.texture.height;
        let u2 = (src_x + src_width) / this.texture.width;
        let v2 = (src_y + src_height) / this.texture.height;

        this.TextCoords(u, v);
        this.Vertex2(x, y);

        this.TextCoords(u, v2);
        this.Vertex2(x, y + height);

        this.TextCoords(u2, v2);
        this.Vertex2(x + width, y + height);

        this.TextCoords(u2, v);
        this.Vertex2(x + width, y);


    }
    TextCoords(u, v)
    {
        this.uvx = u ;
        this.uvy = v ;
    }
    Vertex2(x, y)
    {
        this.Vertex3(x, y, this.depth);
    }

    Vertex3(x, y, z)
    {
        this.vertices[this.vertexIndex++] = x;
        this.vertices[this.vertexIndex++] = y;
        this.vertices[this.vertexIndex++] = z;
        this.vertices[this.vertexIndex++] = this.uvx;
        this.vertices[this.vertexIndex++] = this.uvy;
        this.vertices[this.vertexIndex++] = this.colorr;
        this.vertices[this.vertexIndex++] = this.colorg;
        this.vertices[this.vertexIndex++] = this.colorb;
        this.vertices[this.vertexIndex++] = this.colora;

        if ( this.vertexCount >= this.totalAlloc ) 
        {
            this.Render();
           // throw "Vertex buffer overflow with " +this.vertexCount + "  max  " + this.totalAlloc;
        }

        this.vertexCount++;

    }

}