
"use strict";
const PI = 3.14159265;
const PI2 = 2*3.14159265;
const PI_2 = 3.14159265/2;
const PI_3 = 3.14159265/3;
const PI_4 = 3.14159265/4;


function RAD(d) { return -d*PI/180.0;}
function DEG(r) { return -r*180.0/PI;}

function Rand()
{
	return Math.floor(65536 * Math.random());
}

function RandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function RandomFloat(min, max)
{
	return Math.random() * (max - min) + min;
}

function Rand32()
{
	return rand()|(rand()<<16);
}

function Min(a,b)
{
	return Math.min(a,b);
}

function Max(a,b)
{
	return Math.max(a,b);
}
function Random()
{
	return Math.random();
}

function Abs(a) {return (a<0)?(-a):(a);}



function Lerp(from,to,progress)
{
	return from+(to-from)*progress;
}



function Sign(a)
{
	return a < 0 ? -1 : (a > 0 ? 1 : 0);
}



function Clamp(value,min,max)
{
	if (max > min)
	{
		if (value < min) return min;
		else if (value > max) return max;
		else return value;
	} else 
	{
		if (value < max) return max;
		else if (value > min) return min;
		else return value;
	}
}


class Mat4 
{
	constructor()
	{
		this.m = new Float32Array(16);
		this.identity();
	}

	set(m00,m01,m02,m03,
		m10,m11,m12,m13,
		m20,m21,m22,m23,
		m30,m31,m32,m33)
	{
		this.m[0] = m00; this.m[4] = m01; this.m[8] = m02; this.m[12] = m03;
		this.m[1] = m10; this.m[5] = m11; this.m[9] = m12; this.m[13] = m13;
		this.m[2] = m20; this.m[6] = m21; this.m[10] = m22; this.m[14] = m23;
		this.m[3] = m30; this.m[7] = m31; this.m[11] = m32; this.m[15] = m33;
	}

	identity()
	{
		this.m[0] = 1; this.m[4] = 0; this.m[8] = 0; this.m[12] = 0;
		this.m[1] = 0; this.m[5] = 1; this.m[9] = 0; this.m[13] = 0;
		this.m[2] = 0; this.m[6] = 0; this.m[10] = 1; this.m[14] = 0;
		this.m[3] = 0; this.m[7] = 0; this.m[11] = 0; this.m[15] = 1;
	}

	translate(x,y,z)
	{
		this.m[12] = x;
		this.m[13] = y;
		this.m[14] = z;
	}

	scale(x,y,z)
	{
		this.m[0] = x;
		this.m[5] = y;
		this.m[10] = z;
	}

	ortho(left, right, bottom, top, near, far)
	{
		let rl = (right - left);
		let tb = (top - bottom);
		let fn = (far - near);

		this.m[0] = 2.0/rl;
		this.m[1] = 0.0;
		this.m[2] = 0.0;
		this.m[3] = 0.0;
		this.m[4] = 0.0;
		this.m[5] = 2.0/tb;
		this.m[6] = 0.0;
		this.m[7] = 0.0;
		this.m[8] = 0.0;
		this.m[9] = 0.0;
		this.m[10] = -2.0/fn;
		this.m[11] = 0.0;
		this.m[12] = -((left + right)/rl);
		this.m[13] = -((top + bottom)/tb);
		this.m[14] = -((far + near)/fn);
		this.m[15] = 1.0;

	}




}






function isPointInTriangle(px, py, ax, ay, bx, by, cx, cy)
{
	let v0x = cx - ax;
	let v0y = cy - ay;
	let v1x = bx - ax;
	let v1y = by - ay;
	let v2x = px - ax;
	let v2y = py - ay;

	let dot00 = v0x * v0x + v0y * v0y;
	let dot01 = v0x * v1x + v0y * v1y;
	let dot02 = v0x * v2x + v0y * v2y;
	let dot11 = v1x * v1x + v1y * v1y;
	let dot12 = v1x * v2x + v1y * v2y;

	let invDen = 1.0 / (dot00 * dot11 - dot01 * dot01);
	let u = (dot11 * dot02 - dot01 * dot12) * invDen;
	let v = (dot00 * dot12 - dot01 * dot02) * invDen;

	return (u >= 0) && (v >= 0) && (u + v < 1);
}



function isConvexTriangle(ax, ay, bx, by, cx, cy)
{
	return (ay - by) * (cx - bx) + (bx - ax) * (cy - by) >= 0;
}

function IsVectorsIntersecting(ax, ay, bx, by, cx, cy, dx, dy)
{
	if ((ax == bx && ay == by) || (cx == dx && cy == dy)) return false; // length = 0

	let abx = bx - ax;
	let aby = by - ay;
	let cdx = dx - cx;
	let cdy = dy - cy;
	let tDen = cdy * abx - cdx * aby;

	if (tDen == 0.0) return false; // parallel or identical

	let t = (aby * (cx - ax) - abx * (cy - ay)) / tDen;

	if (t < 0 || t > 1) return false; // outside c->d

	let s = aby > 0 ? (cy - ay + t * cdy) / aby :
					 (cx - ax + t * cdx) / abx;

	return s >= 0.0 && s <= 1.0; // inside a->b
}




function Triangulate(p)
{
	let n = p.length>>1;
	if(n<3) return [];
	let tgs = [];
	let avl = [];
	for(let i=0; i<n; i++) avl.push(i);
	
	let i = 0;
	let al = n;
	while(al > 3)
	{
		let i0 = avl[(i+0)%al];
		let i1 = avl[(i+1)%al];
		let i2 = avl[(i+2)%al];
		
		let ax = p[2*i0],  ay = p[2*i0+1];
		let bx = p[2*i1],  by = p[2*i1+1];
		let cx = p[2*i2],  cy = p[2*i2+1];
		
		let earFound = false;
		if(isConvexTriangle(ax, ay, bx, by, cx, cy))
		{
			earFound = true;
			for(let j=0; j<al; j++)
			{
				let vi = avl[j];
				if(vi==i0 || vi==i1 || vi==i2) continue;
				if(isPointInTriangle(p[2*vi], p[2*vi+1], ax, ay, bx, by, cx, cy)) {earFound = false; break;}
			}
		}
		if(earFound)
		{
			tgs.push(i0, i1, i2);
			avl.splice((i+1)%al, 1);
			al--;
			i= 0;
		}
		else if(i++ > 3*al) break;		// no convex angles :(
	}
	tgs.push(avl[0], avl[1], avl[2]);
	return tgs;
	
}

