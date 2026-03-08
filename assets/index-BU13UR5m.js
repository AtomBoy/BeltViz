(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Ed="modulepreload",Ad=function(i,t){return new URL(i,t).href},cc={},Td=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){let o=function(h){return Promise.all(h.map(u=>Promise.resolve(u).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const a=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));s=o(e.map(h=>{if(h=Ad(h,n),h in cc)return;cc[h]=!0;const u=h.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(!!n)for(let _=a.length-1;_>=0;_--){const m=a[_];if(m.href===h&&(!u||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${d}`))return;const g=document.createElement("link");if(g.rel=u?"stylesheet":Ed,u||(g.as="script"),g.crossOrigin="",g.href=h,c&&g.setAttribute("nonce",c),document.head.appendChild(g),u)return new Promise((_,m)=>{g.addEventListener("load",_),g.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return s.then(o=>{for(const a of o||[])a.status==="rejected"&&r(a.reason);return t().catch(r)})};/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Il="172",ns={ROTATE:0,DOLLY:1,PAN:2},Ji={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},wd=0,hc=1,Cd=2,Bh=1,Rd=2,Dn=3,zn=0,He=1,en=2,Jn=0,is=1,ei=2,uc=3,dc=4,Pd=5,_i=100,Ld=101,Dd=102,Id=103,Ud=104,Nd=200,Fd=201,Od=202,Bd=203,Pa=204,La=205,zd=206,kd=207,Vd=208,Hd=209,Gd=210,Wd=211,Xd=212,qd=213,$d=214,Da=0,Ia=1,Ua=2,ls=3,Na=4,Fa=5,Oa=6,Ba=7,zh=0,Yd=1,Kd=2,Qn=0,jd=1,Zd=2,Jd=3,kh=4,Qd=5,tf=6,ef=7,Vh=300,cs=301,hs=302,za=303,ka=304,So=306,Va=1e3,xi=1001,Ha=1002,mn=1003,nf=1004,ur=1005,Mn=1006,Fo=1007,Mi=1008,kn=1009,Hh=1010,Gh=1011,Ks=1012,Ul=1013,Si=1014,Nn=1015,tr=1016,Nl=1017,Fl=1018,us=1020,Wh=35902,Xh=1021,qh=1022,pn=1023,$h=1024,Yh=1025,ss=1026,ds=1027,Kh=1028,Ol=1029,jh=1030,Bl=1031,zl=1033,jr=33776,Zr=33777,Jr=33778,Qr=33779,Ga=35840,Wa=35841,Xa=35842,qa=35843,$a=36196,Ya=37492,Ka=37496,ja=37808,Za=37809,Ja=37810,Qa=37811,tl=37812,el=37813,nl=37814,il=37815,sl=37816,rl=37817,ol=37818,al=37819,ll=37820,cl=37821,to=36492,hl=36494,ul=36495,Zh=36283,dl=36284,fl=36285,pl=36286,sf=2200,rf=2201,of=2202,oo=2300,ml=2301,Oo=2302,Qi=2400,ts=2401,ao=2402,kl=2500,af=2501,lf=3200,cf=3201,Jh=0,hf=1,Kn="",Qe="srgb",fs="srgb-linear",lo="linear",se="srgb",Ri=7680,fc=519,uf=512,df=513,ff=514,Qh=515,pf=516,mf=517,gf=518,_f=519,gl=35044,Ws=35048,pc="300 es",Fn=2e3,co=2001;class ni{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Ce=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],eo=Math.PI/180,_l=180/Math.PI;function On(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ce[i&255]+Ce[i>>8&255]+Ce[i>>16&255]+Ce[i>>24&255]+"-"+Ce[t&255]+Ce[t>>8&255]+"-"+Ce[t>>16&15|64]+Ce[t>>24&255]+"-"+Ce[e&63|128]+Ce[e>>8&255]+"-"+Ce[e>>16&255]+Ce[e>>24&255]+Ce[n&255]+Ce[n>>8&255]+Ce[n>>16&255]+Ce[n>>24&255]).toLowerCase()}function jt(i,t,e){return Math.max(t,Math.min(e,i))}function vf(i,t){return(i%t+t)%t}function Bo(i,t,e){return(1-e)*i+e*t}function xn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function re(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const xf={DEG2RAD:eo};class Pt{constructor(t=0,e=0){Pt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=jt(this.x,t.x,e.x),this.y=jt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=jt(this.x,t,e),this.y=jt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(jt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Yt{constructor(t,e,n,s,r,o,a,l,c){Yt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],_=s[0],m=s[3],p=s[6],y=s[1],M=s[4],x=s[7],w=s[2],A=s[5],C=s[8];return r[0]=o*_+a*y+l*w,r[3]=o*m+a*M+l*A,r[6]=o*p+a*x+l*C,r[1]=c*_+h*y+u*w,r[4]=c*m+h*M+u*A,r[7]=c*p+h*x+u*C,r[2]=d*_+f*y+g*w,r[5]=d*m+f*M+g*A,r[8]=d*p+f*x+g*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,g=e*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(s*c-h*n)*_,t[2]=(a*n-s*o)*_,t[3]=d*_,t[4]=(h*e-s*l)*_,t[5]=(s*r-a*e)*_,t[6]=f*_,t[7]=(n*l-c*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(zo.makeScale(t,e)),this}rotate(t){return this.premultiply(zo.makeRotation(-t)),this}translate(t,e){return this.premultiply(zo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const zo=new Yt;function tu(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function js(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Mf(){const i=js("canvas");return i.style.display="block",i}const mc={};function Ki(i){i in mc||(mc[i]=!0,console.warn(i))}function yf(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function Sf(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function bf(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const gc=new Yt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),_c=new Yt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ef(){const i={enabled:!0,workingColorSpace:fs,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===se&&(s.r=Bn(s.r),s.g=Bn(s.g),s.b=Bn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===se&&(s.r=rs(s.r),s.g=rs(s.g),s.b=rs(s.b))),s},fromWorkingColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},toWorkingColorSpace:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Kn?lo:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[fs]:{primaries:t,whitePoint:n,transfer:lo,toXYZ:gc,fromXYZ:_c,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Qe},outputColorSpaceConfig:{drawingBufferColorSpace:Qe}},[Qe]:{primaries:t,whitePoint:n,transfer:se,toXYZ:gc,fromXYZ:_c,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Qe}}}),i}const Jt=Ef();function Bn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function rs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Pi;class Af{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Pi===void 0&&(Pi=js("canvas")),Pi.width=t.width,Pi.height=t.height;const n=Pi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Pi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=js("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Bn(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Bn(e[n]/255)*255):e[n]=Bn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Tf=0;class eu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Tf++}),this.uuid=On(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ko(s[o].image)):r.push(ko(s[o]))}else r=ko(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function ko(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Af.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let wf=0;class Le extends ni{constructor(t=Le.DEFAULT_IMAGE,e=Le.DEFAULT_MAPPING,n=xi,s=xi,r=Mn,o=Mi,a=pn,l=kn,c=Le.DEFAULT_ANISOTROPY,h=Kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:wf++}),this.uuid=On(),this.name="",this.source=new eu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Pt(0,0),this.repeat=new Pt(1,1),this.center=new Pt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Vh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Va:t.x=t.x-Math.floor(t.x);break;case xi:t.x=t.x<0?0:1;break;case Ha:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Va:t.y=t.y-Math.floor(t.y);break;case xi:t.y=t.y<0?0:1;break;case Ha:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Le.DEFAULT_IMAGE=null;Le.DEFAULT_MAPPING=Vh;Le.DEFAULT_ANISOTROPY=1;class ue{constructor(t=0,e=0,n=0,s=1){ue.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(c+1)/2,x=(f+1)/2,w=(p+1)/2,A=(h+d)/4,C=(u+_)/4,P=(g+m)/4;return M>x&&M>w?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=A/n,r=C/n):x>w?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=A/s,r=P/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=C/r,s=P/r),this.set(n,s,r,e),this}let y=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(u-_)/y,this.z=(d-h)/y,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=jt(this.x,t.x,e.x),this.y=jt(this.y,t.y,e.y),this.z=jt(this.z,t.z,e.z),this.w=jt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=jt(this.x,t,e),this.y=jt(this.y,t,e),this.z=jt(this.z,t,e),this.w=jt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Cf extends ni{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ue(0,0,t,e),this.scissorTest=!1,this.viewport=new ue(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Mn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Le(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;const e=Object.assign({},t.texture.image);return this.texture.source=new eu(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class bi extends Cf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class nu extends Le{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=mn,this.minFilter=mn,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Rf extends Le{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=mn,this.minFilter=mn,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class sn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3];const d=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(u!==_||l!==d||c!==f||h!==g){let m=1-a;const p=l*d+c*f+h*g+u*_,y=p>=0?1:-1,M=1-p*p;if(M>Number.EPSILON){const w=Math.sqrt(M),A=Math.atan2(w,p*y);m=Math.sin(m*A)/w,a=Math.sin(a*A)/w}const x=a*y;if(l=l*m+d*x,c=c*m+f*x,h=h*m+g*x,u=u*m+_*x,m===1-a){const w=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=w,c*=w,h*=w,u*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+h*u+l*f-c*d,t[e+1]=l*g+h*d+c*u-a*f,t[e+2]=c*g+h*f+a*d-l*u,t[e+3]=h*g-a*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),d=l(n/2),f=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(jt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class O{constructor(t=0,e=0,n=0){O.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(vc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(vc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=jt(this.x,t.x,e.x),this.y=jt(this.y,t.y,e.y),this.z=jt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=jt(this.x,t,e),this.y=jt(this.y,t,e),this.z=jt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Vo.copy(this).projectOnVector(t),this.sub(Vo)}reflect(t){return this.sub(Vo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(jt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Vo=new O,vc=new sn;class er{constructor(t=new O(1/0,1/0,1/0),e=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(cn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(cn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=cn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,cn):cn.fromBufferAttribute(r,o),cn.applyMatrix4(t.matrixWorld),this.expandByPoint(cn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),dr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),dr.copy(n.boundingBox)),dr.applyMatrix4(t.matrixWorld),this.union(dr)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,cn),cn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Rs),fr.subVectors(this.max,Rs),Li.subVectors(t.a,Rs),Di.subVectors(t.b,Rs),Ii.subVectors(t.c,Rs),Gn.subVectors(Di,Li),Wn.subVectors(Ii,Di),ri.subVectors(Li,Ii);let e=[0,-Gn.z,Gn.y,0,-Wn.z,Wn.y,0,-ri.z,ri.y,Gn.z,0,-Gn.x,Wn.z,0,-Wn.x,ri.z,0,-ri.x,-Gn.y,Gn.x,0,-Wn.y,Wn.x,0,-ri.y,ri.x,0];return!Ho(e,Li,Di,Ii,fr)||(e=[1,0,0,0,1,0,0,0,1],!Ho(e,Li,Di,Ii,fr))?!1:(pr.crossVectors(Gn,Wn),e=[pr.x,pr.y,pr.z],Ho(e,Li,Di,Ii,fr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,cn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(cn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(wn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const wn=[new O,new O,new O,new O,new O,new O,new O,new O],cn=new O,dr=new er,Li=new O,Di=new O,Ii=new O,Gn=new O,Wn=new O,ri=new O,Rs=new O,fr=new O,pr=new O,oi=new O;function Ho(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){oi.fromArray(i,r);const a=s.x*Math.abs(oi.x)+s.y*Math.abs(oi.y)+s.z*Math.abs(oi.z),l=t.dot(oi),c=e.dot(oi),h=n.dot(oi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Pf=new er,Ps=new O,Go=new O;class vs{constructor(t=new O,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Pf.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ps.subVectors(t,this.center);const e=Ps.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Ps,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Go.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ps.copy(t.center).add(Go)),this.expandByPoint(Ps.copy(t.center).sub(Go))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Cn=new O,Wo=new O,mr=new O,Xn=new O,Xo=new O,gr=new O,qo=new O;class bo{constructor(t=new O,e=new O(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Cn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Cn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Cn.copy(this.origin).addScaledVector(this.direction,e),Cn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Wo.copy(t).add(e).multiplyScalar(.5),mr.copy(e).sub(t).normalize(),Xn.copy(this.origin).sub(Wo);const r=t.distanceTo(e)*.5,o=-this.direction.dot(mr),a=Xn.dot(this.direction),l=-Xn.dot(mr),c=Xn.lengthSq(),h=Math.abs(1-o*o);let u,d,f,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Wo).addScaledVector(mr,d),f}intersectSphere(t,e){Cn.subVectors(t.center,this.origin);const n=Cn.dot(this.direction),s=Cn.dot(Cn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Cn)!==null}intersectTriangle(t,e,n,s,r){Xo.subVectors(e,t),gr.subVectors(n,t),qo.crossVectors(Xo,gr);let o=this.direction.dot(qo),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Xn.subVectors(this.origin,t);const l=a*this.direction.dot(gr.crossVectors(Xn,gr));if(l<0)return null;const c=a*this.direction.dot(Xo.cross(Xn));if(c<0||l+c>o)return null;const h=-a*Xn.dot(qo);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ae{constructor(t,e,n,s,r,o,a,l,c,h,u,d,f,g,_,m){ae.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,u,d,f,g,_,m)}set(t,e,n,s,r,o,a,l,c,h,u,d,f,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ae().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ui.setFromMatrixColumn(t,0).length(),r=1/Ui.setFromMatrixColumn(t,1).length(),o=1/Ui.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=o*h,f=o*u,g=a*h,_=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+g*c,e[5]=d-_*c,e[9]=-a*l,e[2]=_-d*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d+_*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=_+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d-_*a,e[4]=-o*u,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=_-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,f=o*u,g=a*h,_=a*u;e[0]=l*h,e[4]=g*c-f,e[8]=d*c+_,e[1]=l*u,e[5]=_*c+d,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=_-d*u,e[8]=g*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*u+g,e[10]=d-_*u}else if(t.order==="XZY"){const d=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+_,e[5]=o*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=a*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Lf,t,Df)}lookAt(t,e,n){const s=this.elements;return Xe.subVectors(t,e),Xe.lengthSq()===0&&(Xe.z=1),Xe.normalize(),qn.crossVectors(n,Xe),qn.lengthSq()===0&&(Math.abs(n.z)===1?Xe.x+=1e-4:Xe.z+=1e-4,Xe.normalize(),qn.crossVectors(n,Xe)),qn.normalize(),_r.crossVectors(Xe,qn),s[0]=qn.x,s[4]=_r.x,s[8]=Xe.x,s[1]=qn.y,s[5]=_r.y,s[9]=Xe.y,s[2]=qn.z,s[6]=_r.z,s[10]=Xe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],y=n[3],M=n[7],x=n[11],w=n[15],A=s[0],C=s[4],P=s[8],S=s[12],v=s[1],E=s[5],L=s[9],D=s[13],U=s[2],B=s[6],F=s[10],q=s[14],V=s[3],tt=s[7],X=s[11],nt=s[15];return r[0]=o*A+a*v+l*U+c*V,r[4]=o*C+a*E+l*B+c*tt,r[8]=o*P+a*L+l*F+c*X,r[12]=o*S+a*D+l*q+c*nt,r[1]=h*A+u*v+d*U+f*V,r[5]=h*C+u*E+d*B+f*tt,r[9]=h*P+u*L+d*F+f*X,r[13]=h*S+u*D+d*q+f*nt,r[2]=g*A+_*v+m*U+p*V,r[6]=g*C+_*E+m*B+p*tt,r[10]=g*P+_*L+m*F+p*X,r[14]=g*S+_*D+m*q+p*nt,r[3]=y*A+M*v+x*U+w*V,r[7]=y*C+M*E+x*B+w*tt,r[11]=y*P+M*L+x*F+w*X,r[15]=y*S+M*D+x*q+w*nt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+r*l*u-s*c*u-r*a*d+n*c*d+s*a*f-n*l*f)+_*(+e*l*f-e*c*d+r*o*d-s*o*f+s*c*h-r*l*h)+m*(+e*c*u-e*a*f-r*o*u+n*o*f+r*a*h-n*c*h)+p*(-s*a*h-e*l*u+e*a*d+s*o*u-n*o*d+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],y=u*m*c-_*d*c+_*l*f-a*m*f-u*l*p+a*d*p,M=g*d*c-h*m*c-g*l*f+o*m*f+h*l*p-o*d*p,x=h*_*c-g*u*c+g*a*f-o*_*f-h*a*p+o*u*p,w=g*u*l-h*_*l-g*a*d+o*_*d+h*a*m-o*u*m,A=e*y+n*M+s*x+r*w;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/A;return t[0]=y*C,t[1]=(_*d*r-u*m*r-_*s*f+n*m*f+u*s*p-n*d*p)*C,t[2]=(a*m*r-_*l*r+_*s*c-n*m*c-a*s*p+n*l*p)*C,t[3]=(u*l*r-a*d*r-u*s*c+n*d*c+a*s*f-n*l*f)*C,t[4]=M*C,t[5]=(h*m*r-g*d*r+g*s*f-e*m*f-h*s*p+e*d*p)*C,t[6]=(g*l*r-o*m*r-g*s*c+e*m*c+o*s*p-e*l*p)*C,t[7]=(o*d*r-h*l*r+h*s*c-e*d*c-o*s*f+e*l*f)*C,t[8]=x*C,t[9]=(g*u*r-h*_*r-g*n*f+e*_*f+h*n*p-e*u*p)*C,t[10]=(o*_*r-g*a*r+g*n*c-e*_*c-o*n*p+e*a*p)*C,t[11]=(h*a*r-o*u*r-h*n*c+e*u*c+o*n*f-e*a*f)*C,t[12]=w*C,t[13]=(h*_*s-g*u*s+g*n*d-e*_*d-h*n*m+e*u*m)*C,t[14]=(g*a*s-o*_*s-g*n*l+e*_*l+o*n*m-e*a*m)*C,t[15]=(o*u*s-h*a*s+h*n*l-e*u*l-o*n*d+e*a*d)*C,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,g=r*u,_=o*h,m=o*u,p=a*u,y=l*c,M=l*h,x=l*u,w=n.x,A=n.y,C=n.z;return s[0]=(1-(_+p))*w,s[1]=(f+x)*w,s[2]=(g-M)*w,s[3]=0,s[4]=(f-x)*A,s[5]=(1-(d+p))*A,s[6]=(m+y)*A,s[7]=0,s[8]=(g+M)*C,s[9]=(m-y)*C,s[10]=(1-(d+_))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Ui.set(s[0],s[1],s[2]).length();const o=Ui.set(s[4],s[5],s[6]).length(),a=Ui.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],hn.copy(this);const c=1/r,h=1/o,u=1/a;return hn.elements[0]*=c,hn.elements[1]*=c,hn.elements[2]*=c,hn.elements[4]*=h,hn.elements[5]*=h,hn.elements[6]*=h,hn.elements[8]*=u,hn.elements[9]*=u,hn.elements[10]*=u,e.setFromRotationMatrix(hn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Fn){const l=this.elements,c=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s);let f,g;if(a===Fn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===co)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Fn){const l=this.elements,c=1/(e-t),h=1/(n-s),u=1/(o-r),d=(e+t)*c,f=(n+s)*h;let g,_;if(a===Fn)g=(o+r)*u,_=-2*u;else if(a===co)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ui=new O,hn=new ae,Lf=new O(0,0,0),Df=new O(1,1,1),qn=new O,_r=new O,Xe=new O,xc=new ae,Mc=new sn;class En{constructor(t=0,e=0,n=0,s=En.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(jt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-jt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(jt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-jt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(jt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-jt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return xc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(xc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Mc.setFromEuler(this),this.setFromQuaternion(Mc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}En.DEFAULT_ORDER="XYZ";class iu{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let If=0;const yc=new O,Ni=new sn,Rn=new ae,vr=new O,Ls=new O,Uf=new O,Nf=new sn,Sc=new O(1,0,0),bc=new O(0,1,0),Ec=new O(0,0,1),Ac={type:"added"},Ff={type:"removed"},Fi={type:"childadded",child:null},$o={type:"childremoved",child:null};class ve extends ni{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:If++}),this.uuid=On(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ve.DEFAULT_UP.clone();const t=new O,e=new En,n=new sn,s=new O(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ae},normalMatrix:{value:new Yt}}),this.matrix=new ae,this.matrixWorld=new ae,this.matrixAutoUpdate=ve.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new iu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ni.setFromAxisAngle(t,e),this.quaternion.multiply(Ni),this}rotateOnWorldAxis(t,e){return Ni.setFromAxisAngle(t,e),this.quaternion.premultiply(Ni),this}rotateX(t){return this.rotateOnAxis(Sc,t)}rotateY(t){return this.rotateOnAxis(bc,t)}rotateZ(t){return this.rotateOnAxis(Ec,t)}translateOnAxis(t,e){return yc.copy(t).applyQuaternion(this.quaternion),this.position.add(yc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Sc,t)}translateY(t){return this.translateOnAxis(bc,t)}translateZ(t){return this.translateOnAxis(Ec,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Rn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?vr.copy(t):vr.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ls.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Rn.lookAt(Ls,vr,this.up):Rn.lookAt(vr,Ls,this.up),this.quaternion.setFromRotationMatrix(Rn),s&&(Rn.extractRotation(s.matrixWorld),Ni.setFromRotationMatrix(Rn),this.quaternion.premultiply(Ni.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Ac),Fi.child=t,this.dispatchEvent(Fi),Fi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Ff),$o.child=t,this.dispatchEvent($o),$o.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Rn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Rn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Rn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Ac),Fi.child=t,this.dispatchEvent(Fi),Fi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ls,t,Uf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ls,Nf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ve.DEFAULT_UP=new O(0,1,0);ve.DEFAULT_MATRIX_AUTO_UPDATE=!0;ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const un=new O,Pn=new O,Yo=new O,Ln=new O,Oi=new O,Bi=new O,Tc=new O,Ko=new O,jo=new O,Zo=new O,Jo=new ue,Qo=new ue,ta=new ue;class nn{constructor(t=new O,e=new O,n=new O){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),un.subVectors(t,e),s.cross(un);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){un.subVectors(s,e),Pn.subVectors(n,e),Yo.subVectors(t,e);const o=un.dot(un),a=un.dot(Pn),l=un.dot(Yo),c=Pn.dot(Pn),h=Pn.dot(Yo),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Ln)===null?!1:Ln.x>=0&&Ln.y>=0&&Ln.x+Ln.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Ln)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ln.x),l.addScaledVector(o,Ln.y),l.addScaledVector(a,Ln.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return Jo.setScalar(0),Qo.setScalar(0),ta.setScalar(0),Jo.fromBufferAttribute(t,e),Qo.fromBufferAttribute(t,n),ta.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Jo,r.x),o.addScaledVector(Qo,r.y),o.addScaledVector(ta,r.z),o}static isFrontFacing(t,e,n,s){return un.subVectors(n,e),Pn.subVectors(t,e),un.cross(Pn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return un.subVectors(this.c,this.b),Pn.subVectors(this.a,this.b),un.cross(Pn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return nn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return nn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return nn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return nn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return nn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Oi.subVectors(s,n),Bi.subVectors(r,n),Ko.subVectors(t,n);const l=Oi.dot(Ko),c=Bi.dot(Ko);if(l<=0&&c<=0)return e.copy(n);jo.subVectors(t,s);const h=Oi.dot(jo),u=Bi.dot(jo);if(h>=0&&u<=h)return e.copy(s);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Oi,o);Zo.subVectors(t,r);const f=Oi.dot(Zo),g=Bi.dot(Zo);if(g>=0&&f<=g)return e.copy(r);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Bi,a);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Tc.subVectors(r,s),a=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(Tc,a);const p=1/(m+_+d);return o=_*p,a=d*p,e.copy(n).addScaledVector(Oi,o).addScaledVector(Bi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const su={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$n={h:0,s:0,l:0},xr={h:0,s:0,l:0};function ea(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Ot{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Qe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Jt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Jt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Jt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Jt.workingColorSpace){if(t=vf(t,1),e=jt(e,0,1),n=jt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=ea(o,r,t+1/3),this.g=ea(o,r,t),this.b=ea(o,r,t-1/3)}return Jt.toWorkingColorSpace(this,s),this}setStyle(t,e=Qe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Qe){const n=su[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Bn(t.r),this.g=Bn(t.g),this.b=Bn(t.b),this}copyLinearToSRGB(t){return this.r=rs(t.r),this.g=rs(t.g),this.b=rs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Qe){return Jt.fromWorkingColorSpace(Re.copy(this),t),Math.round(jt(Re.r*255,0,255))*65536+Math.round(jt(Re.g*255,0,255))*256+Math.round(jt(Re.b*255,0,255))}getHexString(t=Qe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Jt.workingColorSpace){Jt.fromWorkingColorSpace(Re.copy(this),e);const n=Re.r,s=Re.g,r=Re.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Jt.workingColorSpace){return Jt.fromWorkingColorSpace(Re.copy(this),e),t.r=Re.r,t.g=Re.g,t.b=Re.b,t}getStyle(t=Qe){Jt.fromWorkingColorSpace(Re.copy(this),t);const e=Re.r,n=Re.g,s=Re.b;return t!==Qe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL($n),this.setHSL($n.h+t,$n.s+e,$n.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL($n),t.getHSL(xr);const n=Bo($n.h,xr.h,e),s=Bo($n.s,xr.s,e),r=Bo($n.l,xr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Re=new Ot;Ot.NAMES=su;let Of=0;class ii extends ni{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Of++}),this.uuid=On(),this.name="",this.type="Material",this.blending=is,this.side=zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Pa,this.blendDst=La,this.blendEquation=_i,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ot(0,0,0),this.blendAlpha=0,this.depthFunc=ls,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ri,this.stencilZFail=Ri,this.stencilZPass=Ri,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==is&&(n.blending=this.blending),this.side!==zn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Pa&&(n.blendSrc=this.blendSrc),this.blendDst!==La&&(n.blendDst=this.blendDst),this.blendEquation!==_i&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ls&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==fc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ri&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ri&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ri&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Vl extends ii{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ot(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.combine=zh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const me=new O,Mr=new Pt;class de{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=gl,this.updateRanges=[],this.gpuType=Nn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Mr.fromBufferAttribute(this,e),Mr.applyMatrix3(t),this.setXY(e,Mr.x,Mr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix3(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix4(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyNormalMatrix(t),this.setXYZ(e,me.x,me.y,me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.transformDirection(t),this.setXYZ(e,me.x,me.y,me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=xn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=re(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=xn(e,this.array)),e}setX(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=xn(e,this.array)),e}setY(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=xn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=xn(e,this.array)),e}setW(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=re(e,this.array),n=re(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=re(e,this.array),n=re(n,this.array),s=re(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=re(e,this.array),n=re(n,this.array),s=re(s,this.array),r=re(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==gl&&(t.usage=this.usage),t}}class ru extends de{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class ou extends de{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class we extends de{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Bf=0;const Ke=new ae,na=new ve,zi=new O,qe=new er,Ds=new er,Se=new O;class Ae extends ni{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Bf++}),this.uuid=On(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(tu(t)?ou:ru)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Yt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ke.makeRotationFromQuaternion(t),this.applyMatrix4(Ke),this}rotateX(t){return Ke.makeRotationX(t),this.applyMatrix4(Ke),this}rotateY(t){return Ke.makeRotationY(t),this.applyMatrix4(Ke),this}rotateZ(t){return Ke.makeRotationZ(t),this.applyMatrix4(Ke),this}translate(t,e,n){return Ke.makeTranslation(t,e,n),this.applyMatrix4(Ke),this}scale(t,e,n){return Ke.makeScale(t,e,n),this.applyMatrix4(Ke),this}lookAt(t){return na.lookAt(t),na.updateMatrix(),this.applyMatrix4(na.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zi).negate(),this.translate(zi.x,zi.y,zi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new we(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new er);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];qe.setFromBufferAttribute(r),this.morphTargetsRelative?(Se.addVectors(this.boundingBox.min,qe.min),this.boundingBox.expandByPoint(Se),Se.addVectors(this.boundingBox.max,qe.max),this.boundingBox.expandByPoint(Se)):(this.boundingBox.expandByPoint(qe.min),this.boundingBox.expandByPoint(qe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new vs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(t){const n=this.boundingSphere.center;if(qe.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Ds.setFromBufferAttribute(a),this.morphTargetsRelative?(Se.addVectors(qe.min,Ds.min),qe.expandByPoint(Se),Se.addVectors(qe.max,Ds.max),qe.expandByPoint(Se)):(qe.expandByPoint(Ds.min),qe.expandByPoint(Ds.max))}qe.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Se.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Se));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Se.fromBufferAttribute(a,c),l&&(zi.fromBufferAttribute(t,c),Se.add(zi)),s=Math.max(s,n.distanceToSquared(Se))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new de(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let P=0;P<n.count;P++)a[P]=new O,l[P]=new O;const c=new O,h=new O,u=new O,d=new Pt,f=new Pt,g=new Pt,_=new O,m=new O;function p(P,S,v){c.fromBufferAttribute(n,P),h.fromBufferAttribute(n,S),u.fromBufferAttribute(n,v),d.fromBufferAttribute(r,P),f.fromBufferAttribute(r,S),g.fromBufferAttribute(r,v),h.sub(c),u.sub(c),f.sub(d),g.sub(d);const E=1/(f.x*g.y-g.x*f.y);isFinite(E)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(E),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(E),a[P].add(_),a[S].add(_),a[v].add(_),l[P].add(m),l[S].add(m),l[v].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let P=0,S=y.length;P<S;++P){const v=y[P],E=v.start,L=v.count;for(let D=E,U=E+L;D<U;D+=3)p(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const M=new O,x=new O,w=new O,A=new O;function C(P){w.fromBufferAttribute(s,P),A.copy(w);const S=a[P];M.copy(S),M.sub(w.multiplyScalar(w.dot(S))).normalize(),x.crossVectors(A,S);const E=x.dot(l[P])<0?-1:1;o.setXYZW(P,M.x,M.y,M.z,E)}for(let P=0,S=y.length;P<S;++P){const v=y[P],E=v.start,L=v.count;for(let D=E,U=E+L;D<U;D+=3)C(t.getX(D+0)),C(t.getX(D+1)),C(t.getX(D+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new de(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new O,r=new O,o=new O,a=new O,l=new O,c=new O,h=new O,u=new O;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Se.fromBufferAttribute(t,e),Se.normalize(),t.setXYZ(e,Se.x,Se.y,Se.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new de(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ae,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const wc=new ae,ai=new bo,yr=new vs,Cc=new O,Sr=new O,br=new O,Er=new O,ia=new O,Ar=new O,Rc=new O,Tr=new O;class Ee extends ve{constructor(t=new Ae,e=new Vl){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Ar.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],u=r[l];h!==0&&(ia.fromBufferAttribute(u,t),o?Ar.addScaledVector(ia,h):Ar.addScaledVector(ia.sub(e),h))}e.add(Ar)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),yr.copy(n.boundingSphere),yr.applyMatrix4(r),ai.copy(t.ray).recast(t.near),!(yr.containsPoint(ai.origin)===!1&&(ai.intersectSphere(yr,Cc)===null||ai.origin.distanceToSquared(Cc)>(t.far-t.near)**2))&&(wc.copy(r).invert(),ai.copy(t.ray).applyMatrix4(wc),!(n.boundingBox!==null&&ai.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ai)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],y=Math.max(m.start,f.start),M=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let x=y,w=M;x<w;x+=3){const A=a.getX(x),C=a.getX(x+1),P=a.getX(x+2);s=wr(this,p,t,n,c,h,u,A,C,P),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const y=a.getX(m),M=a.getX(m+1),x=a.getX(m+2);s=wr(this,o,t,n,c,h,u,y,M,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],y=Math.max(m.start,f.start),M=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let x=y,w=M;x<w;x+=3){const A=x,C=x+1,P=x+2;s=wr(this,p,t,n,c,h,u,A,C,P),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const y=m,M=m+1,x=m+2;s=wr(this,o,t,n,c,h,u,y,M,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function zf(i,t,e,n,s,r,o,a){let l;if(t.side===He?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===zn,a),l===null)return null;Tr.copy(a),Tr.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Tr);return c<e.near||c>e.far?null:{distance:c,point:Tr.clone(),object:i}}function wr(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,Sr),i.getVertexPosition(l,br),i.getVertexPosition(c,Er);const h=zf(i,t,e,n,Sr,br,Er,Rc);if(h){const u=new O;nn.getBarycoord(Rc,Sr,br,Er,u),s&&(h.uv=nn.getInterpolatedAttribute(s,a,l,c,u,new Pt)),r&&(h.uv1=nn.getInterpolatedAttribute(r,a,l,c,u,new Pt)),o&&(h.normal=nn.getInterpolatedAttribute(o,a,l,c,u,new O),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new O,materialIndex:0};nn.getNormal(Sr,br,Er,d.normal),h.face=d,h.barycoord=u}return h}class nr extends Ae{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new we(c,3)),this.setAttribute("normal",new we(h,3)),this.setAttribute("uv",new we(u,2));function g(_,m,p,y,M,x,w,A,C,P,S){const v=x/C,E=w/P,L=x/2,D=w/2,U=A/2,B=C+1,F=P+1;let q=0,V=0;const tt=new O;for(let X=0;X<F;X++){const nt=X*E-D;for(let ct=0;ct<B;ct++){const et=ct*v-L;tt[_]=et*y,tt[m]=nt*M,tt[p]=U,c.push(tt.x,tt.y,tt.z),tt[_]=0,tt[m]=0,tt[p]=A>0?1:-1,h.push(tt.x,tt.y,tt.z),u.push(ct/C),u.push(1-X/P),q+=1}}for(let X=0;X<P;X++)for(let nt=0;nt<C;nt++){const ct=d+nt+B*X,et=d+nt+B*(X+1),N=d+(nt+1)+B*(X+1),W=d+(nt+1)+B*X;l.push(ct,et,W),l.push(et,N,W),V+=6}a.addGroup(f,V,S),f+=V,d+=q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new nr(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ps(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ne(i){const t={};for(let e=0;e<i.length;e++){const n=ps(i[e]);for(const s in n)t[s]=n[s]}return t}function kf(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function au(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Jt.workingColorSpace}const Vf={clone:ps,merge:Ne};var Hf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Gf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class on extends ii{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Hf,this.fragmentShader=Gf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ps(t.uniforms),this.uniformsGroups=kf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class lu extends ve{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ae,this.projectionMatrix=new ae,this.projectionMatrixInverse=new ae,this.coordinateSystem=Fn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Yn=new O,Pc=new Pt,Lc=new Pt;class tn extends lu{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=_l*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(eo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return _l*2*Math.atan(Math.tan(eo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Yn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Yn.x,Yn.y).multiplyScalar(-t/Yn.z),Yn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Yn.x,Yn.y).multiplyScalar(-t/Yn.z)}getViewSize(t,e){return this.getViewBounds(t,Pc,Lc),e.subVectors(Lc,Pc)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(eo*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ki=-90,Vi=1;class Wf extends ve{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new tn(ki,Vi,t,e);s.layers=this.layers,this.add(s);const r=new tn(ki,Vi,t,e);r.layers=this.layers,this.add(r);const o=new tn(ki,Vi,t,e);o.layers=this.layers,this.add(o);const a=new tn(ki,Vi,t,e);a.layers=this.layers,this.add(a);const l=new tn(ki,Vi,t,e);l.layers=this.layers,this.add(l);const c=new tn(ki,Vi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===Fn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===co)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class cu extends Le{constructor(t,e,n,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:cs,super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Xf extends bi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new cu(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Mn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new nr(5,5,5),r=new on({name:"CubemapFromEquirect",uniforms:ps(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:He,blending:Jn});r.uniforms.tEquirect.value=e;const o=new Ee(s,r),a=e.minFilter;return e.minFilter===Mi&&(e.minFilter=Mn),new Wf(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}class qf extends ve{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new En,this.environmentIntensity=1,this.environmentRotation=new En,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class $f{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=gl,this.updateRanges=[],this.version=0,this.uuid=On()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=On()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=On()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ue=new O;class ho{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix4(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyNormalMatrix(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.transformDirection(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=xn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=re(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=xn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=xn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=xn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=xn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=re(e,this.array),n=re(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=re(e,this.array),n=re(n,this.array),s=re(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=re(e,this.array),n=re(n,this.array),s=re(s,this.array),r=re(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new de(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ho(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Hl extends ii{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ot(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Hi;const Is=new O,Gi=new O,Wi=new O,Xi=new Pt,Us=new Pt,hu=new ae,Cr=new O,Ns=new O,Rr=new O,Dc=new Pt,sa=new Pt,Ic=new Pt;class uu extends ve{constructor(t=new Hl){if(super(),this.isSprite=!0,this.type="Sprite",Hi===void 0){Hi=new Ae;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new $f(e,5);Hi.setIndex([0,1,2,0,2,3]),Hi.setAttribute("position",new ho(n,3,0,!1)),Hi.setAttribute("uv",new ho(n,2,3,!1))}this.geometry=Hi,this.material=t,this.center=new Pt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Gi.setFromMatrixScale(this.matrixWorld),hu.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Wi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Gi.multiplyScalar(-Wi.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const o=this.center;Pr(Cr.set(-.5,-.5,0),Wi,o,Gi,s,r),Pr(Ns.set(.5,-.5,0),Wi,o,Gi,s,r),Pr(Rr.set(.5,.5,0),Wi,o,Gi,s,r),Dc.set(0,0),sa.set(1,0),Ic.set(1,1);let a=t.ray.intersectTriangle(Cr,Ns,Rr,!1,Is);if(a===null&&(Pr(Ns.set(-.5,.5,0),Wi,o,Gi,s,r),sa.set(0,1),a=t.ray.intersectTriangle(Cr,Rr,Ns,!1,Is),a===null))return;const l=t.ray.origin.distanceTo(Is);l<t.near||l>t.far||e.push({distance:l,point:Is.clone(),uv:nn.getInterpolation(Is,Cr,Ns,Rr,Dc,sa,Ic,new Pt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Pr(i,t,e,n,s,r){Xi.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(Us.x=r*Xi.x-s*Xi.y,Us.y=s*Xi.x+r*Xi.y):Us.copy(Xi),i.copy(t),i.x+=Us.x,i.y+=Us.y,i.applyMatrix4(hu)}const ra=new O,Yf=new O,Kf=new Yt;class gn{constructor(t=new O(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=ra.subVectors(n,e).cross(Yf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(ra),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Kf.getNormalMatrix(t),s=this.coplanarPoint(ra).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const li=new vs,Lr=new O;class Gl{constructor(t=new gn,e=new gn,n=new gn,s=new gn,r=new gn,o=new gn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Fn){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],u=s[6],d=s[7],f=s[8],g=s[9],_=s[10],m=s[11],p=s[12],y=s[13],M=s[14],x=s[15];if(n[0].setComponents(l-r,d-c,m-f,x-p).normalize(),n[1].setComponents(l+r,d+c,m+f,x+p).normalize(),n[2].setComponents(l+o,d+h,m+g,x+y).normalize(),n[3].setComponents(l-o,d-h,m-g,x-y).normalize(),n[4].setComponents(l-a,d-u,m-_,x-M).normalize(),e===Fn)n[5].setComponents(l+a,d+u,m+_,x+M).normalize();else if(e===co)n[5].setComponents(a,u,_,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),li.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),li.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(li)}intersectsSprite(t){return li.center.set(0,0,0),li.radius=.7071067811865476,li.applyMatrix4(t.matrixWorld),this.intersectsSphere(li)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Lr.x=s.normal.x>0?t.max.x:t.min.x,Lr.y=s.normal.y>0?t.max.y:t.min.y,Lr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Lr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class du extends ii{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ot(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const uo=new O,fo=new O,Uc=new ae,Fs=new bo,Dr=new vs,oa=new O,Nc=new O;class jf extends ve{constructor(t=new Ae,e=new du){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)uo.fromBufferAttribute(e,s-1),fo.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=uo.distanceTo(fo);t.setAttribute("lineDistance",new we(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Dr.copy(n.boundingSphere),Dr.applyMatrix4(s),Dr.radius+=r,t.ray.intersectsSphere(Dr)===!1)return;Uc.copy(s).invert(),Fs.copy(t.ray).applyMatrix4(Uc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){const p=h.getX(_),y=h.getX(_+1),M=Ir(this,t,Fs,l,p,y);M&&e.push(M)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(f),p=Ir(this,t,Fs,l,_,m);p&&e.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){const p=Ir(this,t,Fs,l,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=Ir(this,t,Fs,l,g-1,f);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Ir(i,t,e,n,s,r){const o=i.geometry.attributes.position;if(uo.fromBufferAttribute(o,s),fo.fromBufferAttribute(o,r),e.distanceSqToSegment(uo,fo,oa,Nc)>n)return;oa.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(oa);if(!(l<t.near||l>t.far))return{distance:l,point:Nc.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}class Zf extends ii{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ot(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Fc=new ae,vl=new bo,Ur=new vs,Nr=new O;class fu extends ve{constructor(t=new Ae,e=new Zf){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ur.copy(n.boundingSphere),Ur.applyMatrix4(s),Ur.radius+=r,t.ray.intersectsSphere(Ur)===!1)return;Fc.copy(s).invert(),vl.copy(t.ray).applyMatrix4(Fc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=d,_=f;g<_;g++){const m=c.getX(g);Nr.fromBufferAttribute(u,m),Oc(Nr,m,l,s,t,e,this)}}else{const d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let g=d,_=f;g<_;g++)Nr.fromBufferAttribute(u,g),Oc(Nr,g,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Oc(i,t,e,n,s,r,o){const a=vl.distanceSqToPoint(i);if(a<e){const l=new O;vl.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class yn extends ve{constructor(){super(),this.isGroup=!0,this.type="Group"}}class pu extends Le{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class mu extends Le{constructor(t,e,n,s,r,o,a,l,c,h=ss){if(h!==ss&&h!==ds)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ss&&(n=Si),n===void 0&&h===ds&&(n=us),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:mn,this.minFilter=l!==void 0?l:mn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Vn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);const h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new Pt:new O);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new O,s=[],r=[],o=[],a=new O,l=new ae;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new O)}r[0]=new O,o[0]=new O;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(jt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(jt(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class gu extends Vn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new Pt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Jf extends gu{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Wl(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const Fr=new O,aa=new Wl,la=new Wl,ca=new Wl;class _u extends Vn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new O){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(Fr.subVectors(s[0],s[1]).add(s[0]),c=Fr);const u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Fr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Fr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),aa.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,_,m),la.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,_,m),ca.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(aa.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),la.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),ca.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(aa.calc(l),la.calc(l),ca.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new O().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Bc(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function Qf(i,t){const e=1-i;return e*e*t}function tp(i,t){return 2*(1-i)*i*t}function ep(i,t){return i*i*t}function Xs(i,t,e,n){return Qf(i,t)+tp(i,e)+ep(i,n)}function np(i,t){const e=1-i;return e*e*e*t}function ip(i,t){const e=1-i;return 3*e*e*i*t}function sp(i,t){return 3*(1-i)*i*i*t}function rp(i,t){return i*i*i*t}function qs(i,t,e,n,s){return np(i,t)+ip(i,e)+sp(i,n)+rp(i,s)}class op extends Vn{constructor(t=new Pt,e=new Pt,n=new Pt,s=new Pt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new Pt){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(qs(t,s.x,r.x,o.x,a.x),qs(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class ap extends Vn{constructor(t=new O,e=new O,n=new O,s=new O){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new O){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(qs(t,s.x,r.x,o.x,a.x),qs(t,s.y,r.y,o.y,a.y),qs(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class lp extends Vn{constructor(t=new Pt,e=new Pt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Pt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Pt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class cp extends Vn{constructor(t=new O,e=new O){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new O){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new O){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class hp extends Vn{constructor(t=new Pt,e=new Pt,n=new Pt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new Pt){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Xs(t,s.x,r.x,o.x),Xs(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class vu extends Vn{constructor(t=new O,e=new O,n=new O){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new O){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Xs(t,s.x,r.x,o.x),Xs(t,s.y,r.y,o.y),Xs(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class up extends Vn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Pt){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Bc(a,l.x,c.x,h.x,u.x),Bc(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new Pt().fromArray(s))}return this}}var dp=Object.freeze({__proto__:null,ArcCurve:Jf,CatmullRomCurve3:_u,CubicBezierCurve:op,CubicBezierCurve3:ap,EllipseCurve:gu,LineCurve:lp,LineCurve3:cp,QuadraticBezierCurve:hp,QuadraticBezierCurve3:vu,SplineCurve:up});class Eo extends Ae{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=t/a,d=e/l,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const y=p*d-o;for(let M=0;M<c;M++){const x=M*u-r;g.push(x,-y,0),_.push(0,0,1),m.push(M/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<a;y++){const M=y+c*p,x=y+c*(p+1),w=y+1+c*(p+1),A=y+1+c*p;f.push(M,x,A),f.push(x,w,A)}this.setIndex(f),this.setAttribute("position",new we(g,3)),this.setAttribute("normal",new we(_,3)),this.setAttribute("uv",new we(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Eo(t.width,t.height,t.widthSegments,t.heightSegments)}}class ms extends Ae{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new O,d=new O,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const y=[],M=p/n;let x=0;p===0&&o===0?x=.5/e:p===n&&l===Math.PI&&(x=-.5/e);for(let w=0;w<=e;w++){const A=w/e;u.x=-t*Math.cos(s+A*r)*Math.sin(o+M*a),u.y=t*Math.cos(o+M*a),u.z=t*Math.sin(s+A*r)*Math.sin(o+M*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(A+x,1-M),y.push(c++)}h.push(y)}for(let p=0;p<n;p++)for(let y=0;y<e;y++){const M=h[p][y+1],x=h[p][y],w=h[p+1][y],A=h[p+1][y+1];(p!==0||o>0)&&f.push(M,x,A),(p!==n-1||l<Math.PI)&&f.push(x,w,A)}this.setIndex(f),this.setAttribute("position",new we(g,3)),this.setAttribute("normal",new we(_,3)),this.setAttribute("uv",new we(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ms(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Xl extends Ae{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],l=[],c=[],h=new O,u=new O,d=new O;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){const _=g/s*r,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/s),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){const _=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,y=(s+1)*f+g;o.push(_,m,y),o.push(m,p,y)}this.setIndex(o),this.setAttribute("position",new we(a,3)),this.setAttribute("normal",new we(l,3)),this.setAttribute("uv",new we(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xl(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class ql extends Ae{constructor(t=new vu(new O(-1,-1,0),new O(-1,1,0),new O(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new O,l=new O,c=new Pt;let h=new O;const u=[],d=[],f=[],g=[];_(),this.setIndex(g),this.setAttribute("position",new we(u,3)),this.setAttribute("normal",new we(d,3)),this.setAttribute("uv",new we(f,2));function _(){for(let M=0;M<e;M++)m(M);m(r===!1?e:0),y(),p()}function m(M){h=t.getPointAt(M/e,h);const x=o.normals[M],w=o.binormals[M];for(let A=0;A<=s;A++){const C=A/s*Math.PI*2,P=Math.sin(C),S=-Math.cos(C);l.x=S*x.x+P*w.x,l.y=S*x.y+P*w.y,l.z=S*x.z+P*w.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function p(){for(let M=1;M<=e;M++)for(let x=1;x<=s;x++){const w=(s+1)*(M-1)+(x-1),A=(s+1)*M+(x-1),C=(s+1)*M+x,P=(s+1)*(M-1)+x;g.push(w,A,P),g.push(A,C,P)}}function y(){for(let M=0;M<=e;M++)for(let x=0;x<=s;x++)c.x=M/e,c.y=x/s,f.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new ql(new dp[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class Ao extends ii{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ot(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ot(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Jh,this.normalScale=new Pt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class xu extends Ao{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Pt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return jt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ot(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ot(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ot(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class fp extends ii{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=lf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class pp extends ii{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}function Or(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function mp(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function gp(i){function t(s,r){return i[s]-i[r]}const e=i.length,n=new Array(e);for(let s=0;s!==e;++s)n[s]=s;return n.sort(t),n}function zc(i,t,e){const n=i.length,s=new i.constructor(n);for(let r=0,o=0;o!==n;++r){const a=e[r]*t;for(let l=0;l!==t;++l)s[o++]=i[a+l]}return s}function Mu(i,t,e,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(t.push(r.time),e.push.apply(e,o)),r=i[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(t.push(r.time),o.toArray(e,e.length)),r=i[s++];while(r!==void 0);else do o=r[n],o!==void 0&&(t.push(r.time),e.push(o)),r=i[s++];while(r!==void 0)}class To{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){const e=this.parameterPositions;let n=this._cachedIndex,s=e[n],r=e[n-1];t:{e:{let o;n:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break e}o=e.length;break n}if(!(t>=r)){const a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break e}o=n,n=0;break n}break t}for(;n<o;){const a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){const e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class _p extends To{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Qi,endingEnd:Qi}}intervalChanged_(t,e,n){const s=this.parameterPositions;let r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case ts:r=t,a=2*e-n;break;case ao:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case ts:o=t,l=2*n-e;break;case ao:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}const c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-e)/(s-e),_=g*g,m=_*g,p=-d*m+2*d*_-d*g,y=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,M=(-1-f)*m+(1.5+f)*_+.5*g,x=f*m-f*_;for(let w=0;w!==a;++w)r[w]=p*o[h+w]+y*o[c+w]+M*o[l+w]+x*o[u+w];return r}}class yu extends To{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}}class vp extends To{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}}class An{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Or(e,this.TimeBufferType),this.values=Or(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){const e=t.constructor;let n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Or(t.times,Array),values:Or(t.values,Array)};const s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new vp(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new yu(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new _p(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case oo:e=this.InterpolantFactoryMethodDiscrete;break;case ml:e=this.InterpolantFactoryMethodLinear;break;case Oo:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return oo;case this.InterpolantFactoryMethodLinear:return ml;case this.InterpolantFactoryMethodSmooth:return Oo}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){const e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){const e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){const n=this.times,s=n.length;let r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);const a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0;const e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);const n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){const l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&mp(s))for(let a=0,l=s.length;a!==l;++a){const c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){const t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Oo,r=t.length-1;let o=1;for(let a=1;a<r;++a){let l=!1;const c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{const u=a*n,d=u-n,f=u+n;for(let g=0;g!==n;++g){const _=e[u+g];if(_!==e[d+g]||_!==e[f+g]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];const u=a*n,d=o*n;for(let f=0;f!==n;++f)e[d+f]=e[u+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){const t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}}An.prototype.TimeBufferType=Float32Array;An.prototype.ValueBufferType=Float32Array;An.prototype.DefaultInterpolation=ml;class xs extends An{constructor(t,e,n){super(t,e,n)}}xs.prototype.ValueTypeName="bool";xs.prototype.ValueBufferType=Array;xs.prototype.DefaultInterpolation=oo;xs.prototype.InterpolantFactoryMethodLinear=void 0;xs.prototype.InterpolantFactoryMethodSmooth=void 0;class Su extends An{}Su.prototype.ValueTypeName="color";class po extends An{}po.prototype.ValueTypeName="number";class xp extends To{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e);let c=t*a;for(let h=c+a;c!==h;c+=4)sn.slerpFlat(r,0,o,c-a,o,c,l);return r}}class wo extends An{InterpolantFactoryMethodLinear(t){return new xp(this.times,this.values,this.getValueSize(),t)}}wo.prototype.ValueTypeName="quaternion";wo.prototype.InterpolantFactoryMethodSmooth=void 0;class Ms extends An{constructor(t,e,n){super(t,e,n)}}Ms.prototype.ValueTypeName="string";Ms.prototype.ValueBufferType=Array;Ms.prototype.DefaultInterpolation=oo;Ms.prototype.InterpolantFactoryMethodLinear=void 0;Ms.prototype.InterpolantFactoryMethodSmooth=void 0;class gs extends An{}gs.prototype.ValueTypeName="vector";class mo{constructor(t="",e=-1,n=[],s=kl){this.name=t,this.tracks=n,this.duration=e,this.blendMode=s,this.uuid=On(),this.duration<0&&this.resetDuration()}static parse(t){const e=[],n=t.tracks,s=1/(t.fps||1);for(let o=0,a=n.length;o!==a;++o)e.push(yp(n[o]).scale(s));const r=new this(t.name,t.duration,e,t.blendMode);return r.uuid=t.uuid,r}static toJSON(t){const e=[],n=t.tracks,s={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode};for(let r=0,o=n.length;r!==o;++r)e.push(An.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(t,e,n,s){const r=e.length,o=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);const h=gp(l);l=zc(l,1,h),c=zc(c,1,h),!s&&l[0]===0&&(l.push(r),c.push(c[0])),o.push(new po(".morphTargetInfluences["+e[a].name+"]",l,c).scale(1/n))}return new this(t,-1,o)}static findByName(t,e){let n=t;if(!Array.isArray(t)){const s=t;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===e)return n[s];return null}static CreateClipsFromMorphTargetSequences(t,e,n){const s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=t.length;a<l;a++){const c=t[a],h=c.name.match(r);if(h&&h.length>1){const u=h[1];let d=s[u];d||(s[u]=d=[]),d.push(c)}}const o=[];for(const a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],e,n));return o}static parseAnimation(t,e){if(!t)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(u,d,f,g,_){if(f.length!==0){const m=[],p=[];Mu(f,m,p,g),m.length!==0&&_.push(new u(d,m,p))}},s=[],r=t.name||"default",o=t.fps||30,a=t.blendMode;let l=t.length||-1;const c=t.hierarchy||[];for(let u=0;u<c.length;u++){const d=c[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let g;for(g=0;g<d.length;g++)if(d[g].morphTargets)for(let _=0;_<d[g].morphTargets.length;_++)f[d[g].morphTargets[_]]=-1;for(const _ in f){const m=[],p=[];for(let y=0;y!==d[g].morphTargets.length;++y){const M=d[g];m.push(M.time),p.push(M.morphTarget===_?1:0)}s.push(new po(".morphTargetInfluence["+_+"]",m,p))}l=f.length*o}else{const f=".bones["+e[u].name+"]";n(gs,f+".position",d,"pos",s),n(wo,f+".quaternion",d,"rot",s),n(gs,f+".scale",d,"scl",s)}}return s.length===0?null:new this(r,l,s,a)}resetDuration(){const t=this.tracks;let e=0;for(let n=0,s=t.length;n!==s;++n){const r=this.tracks[n];e=Math.max(e,r.times[r.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){const t=[];for(let e=0;e<this.tracks.length;e++)t.push(this.tracks[e].clone());return new this.constructor(this.name,this.duration,t,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function Mp(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return po;case"vector":case"vector2":case"vector3":case"vector4":return gs;case"color":return Su;case"quaternion":return wo;case"bool":case"boolean":return xs;case"string":return Ms}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function yp(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const t=Mp(i.type);if(i.times===void 0){const e=[],n=[];Mu(i.keys,e,n,"value"),i.times=e,i.values=n}return t.parse!==void 0?t.parse(i):new t(i.name,i.times,i.values,i.interpolation)}const kc={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class Sp{constructor(t,e,n){const s=this;let r=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){const f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null}}}const bp=new Sp;class $l{constructor(t){this.manager=t!==void 0?t:bp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){const n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}}$l.DEFAULT_MATERIAL_NAME="__DEFAULT";class Ep extends $l{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,o=kc.get(t);if(o!==void 0)return r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0),o;const a=js("img");function l(){h(),kc.add(t,this),e&&e(this),r.manager.itemEnd(t)}function c(u){h(),s&&s(u),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(t),a.src=t,a}}class Ap extends $l{constructor(t){super(t)}load(t,e,n,s){const r=new Le,o=new Ep(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}}class bu extends ve{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ot(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}const ha=new ae,Vc=new O,Hc=new O;class Tp{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Pt(512,512),this.map=null,this.mapPass=null,this.matrix=new ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Gl,this._frameExtents=new Pt(1,1),this._viewportCount=1,this._viewports=[new ue(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Vc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Vc),Hc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Hc),e.updateMatrixWorld(),ha.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ha),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ha)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Eu extends lu{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class wp extends Tp{constructor(){super(new Eu(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Cp extends bu{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ve.DEFAULT_UP),this.updateMatrix(),this.target=new ve,this.shadow=new wp}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Rp extends bu{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class Pp extends tn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Lp{constructor(t,e,n){this.binding=t,this.valueSize=n;let s,r,o;switch(e){case"quaternion":s=this._slerp,r=this._slerpAdditive,o=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":s=this._select,r=this._select,o=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:s=this._lerp,r=this._lerpAdditive,o=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=s,this._mixBufferRegionAdditive=r,this._setIdentity=o,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(t,e){const n=this.buffer,s=this.valueSize,r=t*s+s;let o=this.cumulativeWeight;if(o===0){for(let a=0;a!==s;++a)n[r+a]=n[a];o=e}else{o+=e;const a=e/o;this._mixBufferRegion(n,r,0,a,s)}this.cumulativeWeight=o}accumulateAdditive(t){const e=this.buffer,n=this.valueSize,s=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(e,s,0,t,n),this.cumulativeWeightAdditive+=t}apply(t){const e=this.valueSize,n=this.buffer,s=t*e+e,r=this.cumulativeWeight,o=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=e*this._origIndex;this._mixBufferRegion(n,s,l,1-r,e)}o>0&&this._mixBufferRegionAdditive(n,s,this._addIndex*e,1,e);for(let l=e,c=e+e;l!==c;++l)if(n[l]!==n[l+e]){a.setValue(n,s);break}}saveOriginalState(){const t=this.binding,e=this.buffer,n=this.valueSize,s=n*this._origIndex;t.getValue(e,s);for(let r=n,o=s;r!==o;++r)e[r]=e[s+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const t=this.valueSize*3;this.binding.setValue(this.buffer,t)}_setAdditiveIdentityNumeric(){const t=this._addIndex*this.valueSize,e=t+this.valueSize;for(let n=t;n<e;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const t=this._origIndex*this.valueSize,e=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[e+n]=this.buffer[t+n]}_select(t,e,n,s,r){if(s>=.5)for(let o=0;o!==r;++o)t[e+o]=t[n+o]}_slerp(t,e,n,s){sn.slerpFlat(t,e,t,e,t,n,s)}_slerpAdditive(t,e,n,s,r){const o=this._workIndex*r;sn.multiplyQuaternionsFlat(t,o,t,e,t,n),sn.slerpFlat(t,e,t,e,t,o,s)}_lerp(t,e,n,s,r){const o=1-s;for(let a=0;a!==r;++a){const l=e+a;t[l]=t[l]*o+t[n+a]*s}}_lerpAdditive(t,e,n,s,r){for(let o=0;o!==r;++o){const a=e+o;t[a]=t[a]+t[n+o]*s}}}const Yl="\\[\\]\\.:\\/",Dp=new RegExp("["+Yl+"]","g"),Kl="[^"+Yl+"]",Ip="[^"+Yl.replace("\\.","")+"]",Up=/((?:WC+[\/:])*)/.source.replace("WC",Kl),Np=/(WCOD+)?/.source.replace("WCOD",Ip),Fp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Kl),Op=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Kl),Bp=new RegExp("^"+Up+Np+Fp+Op+"$"),zp=["material","materials","bones","map"];class kp{constructor(t,e,n){const s=n||ne.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();const n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){const n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}}class ne{constructor(t,e,n){this.path=e,this.parsedPath=n||ne.parseTrackName(e),this.node=ne.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new ne.Composite(t,e,n):new ne(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Dp,"")}static parseTrackName(t){const e=Bp.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);const n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=n.nodeName.substring(s+1);zp.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){const n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){const n=function(r){for(let o=0;o<r.length;o++){const a=r[o];if(a.name===e||a.uuid===e)return a;const l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node;const e=this.parsedPath,n=e.objectName,s=e.propertyName;let r=e.propertyIndex;if(t||(t=ne.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}const o=t[s];if(o===void 0){const c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ne.Composite=kp;ne.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ne.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ne.prototype.GetterByBindingType=[ne.prototype._getValue_direct,ne.prototype._getValue_array,ne.prototype._getValue_arrayElement,ne.prototype._getValue_toArray];ne.prototype.SetterByBindingTypeAndVersioning=[[ne.prototype._setValue_direct,ne.prototype._setValue_direct_setNeedsUpdate,ne.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ne.prototype._setValue_array,ne.prototype._setValue_array_setNeedsUpdate,ne.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ne.prototype._setValue_arrayElement,ne.prototype._setValue_arrayElement_setNeedsUpdate,ne.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ne.prototype._setValue_fromArray,ne.prototype._setValue_fromArray_setNeedsUpdate,ne.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class Vp{constructor(t,e,n=null,s=e.blendMode){this._mixer=t,this._clip=e,this._localRoot=n,this.blendMode=s;const r=e.tracks,o=r.length,a=new Array(o),l={endingStart:Qi,endingEnd:Qi};for(let c=0;c!==o;++c){const h=r[c].createInterpolant(null);a[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=a,this._propertyBindings=new Array(o),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=rf,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(t){return this._startTime=t,this}setLoop(t,e){return this.loop=t,this.repetitions=e,this}setEffectiveWeight(t){return this.weight=t,this._effectiveWeight=this.enabled?t:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(t){return this._scheduleFading(t,0,1)}fadeOut(t){return this._scheduleFading(t,1,0)}crossFadeFrom(t,e,n){if(t.fadeOut(e),this.fadeIn(e),n){const s=this._clip.duration,r=t._clip.duration,o=r/s,a=s/r;t.warp(1,o,e),this.warp(a,1,e)}return this}crossFadeTo(t,e,n){return t.crossFadeFrom(this,e,n)}stopFading(){const t=this._weightInterpolant;return t!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}setEffectiveTimeScale(t){return this.timeScale=t,this._effectiveTimeScale=this.paused?0:t,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(t){return this.timeScale=this._clip.duration/t,this.stopWarping()}syncWith(t){return this.time=t.time,this.timeScale=t.timeScale,this.stopWarping()}halt(t){return this.warp(this._effectiveTimeScale,0,t)}warp(t,e,n){const s=this._mixer,r=s.time,o=this.timeScale;let a=this._timeScaleInterpolant;a===null&&(a=s._lendControlInterpolant(),this._timeScaleInterpolant=a);const l=a.parameterPositions,c=a.sampleValues;return l[0]=r,l[1]=r+n,c[0]=t/o,c[1]=e/o,this}stopWarping(){const t=this._timeScaleInterpolant;return t!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(t,e,n,s){if(!this.enabled){this._updateWeight(t);return}const r=this._startTime;if(r!==null){const l=(t-r)*n;l<0||n===0?e=0:(this._startTime=null,e=n*l)}e*=this._updateTimeScale(t);const o=this._updateTime(e),a=this._updateWeight(t);if(a>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case af:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(o),c[h].accumulateAdditive(a);break;case kl:default:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(o),c[h].accumulate(s,a)}}}_updateWeight(t){let e=0;if(this.enabled){e=this.weight;const n=this._weightInterpolant;if(n!==null){const s=n.evaluate(t)[0];e*=s,t>n.parameterPositions[1]&&(this.stopFading(),s===0&&(this.enabled=!1))}}return this._effectiveWeight=e,e}_updateTimeScale(t){let e=0;if(!this.paused){e=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const s=n.evaluate(t)[0];e*=s,t>n.parameterPositions[1]&&(this.stopWarping(),e===0?this.paused=!0:this.timeScale=e)}}return this._effectiveTimeScale=e,e}_updateTime(t){const e=this._clip.duration,n=this.loop;let s=this.time+t,r=this._loopCount;const o=n===of;if(t===0)return r===-1?s:o&&(r&1)===1?e-s:s;if(n===sf){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));t:{if(s>=e)s=e;else if(s<0)s=0;else{this.time=s;break t}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:t<0?-1:1})}}else{if(r===-1&&(t>=0?(r=0,this._setEndings(!0,this.repetitions===0,o)):this._setEndings(this.repetitions===0,!0,o)),s>=e||s<0){const a=Math.floor(s/e);s-=e*a,r+=Math.abs(a);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,s=t>0?e:0,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:t>0?1:-1});else{if(l===1){const c=t<0;this._setEndings(c,!c,o)}else this._setEndings(!1,!1,o);this._loopCount=r,this.time=s,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this.time=s;if(o&&(r&1)===1)return e-s}return s}_setEndings(t,e,n){const s=this._interpolantSettings;n?(s.endingStart=ts,s.endingEnd=ts):(t?s.endingStart=this.zeroSlopeAtStart?ts:Qi:s.endingStart=ao,e?s.endingEnd=this.zeroSlopeAtEnd?ts:Qi:s.endingEnd=ao)}_scheduleFading(t,e,n){const s=this._mixer,r=s.time;let o=this._weightInterpolant;o===null&&(o=s._lendControlInterpolant(),this._weightInterpolant=o);const a=o.parameterPositions,l=o.sampleValues;return a[0]=r,l[0]=e,a[1]=r+t,l[1]=n,this}}const Hp=new Float32Array(1);class Gc extends ni{constructor(t){super(),this._root=t,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(t,e){const n=t._localRoot||this._root,s=t._clip.tracks,r=s.length,o=t._propertyBindings,a=t._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let u=0;u!==r;++u){const d=s[u],f=d.name;let g=h[f];if(g!==void 0)++g.referenceCount,o[u]=g;else{if(g=o[u],g!==void 0){g._cacheIndex===null&&(++g.referenceCount,this._addInactiveBinding(g,l,f));continue}const _=e&&e._propertyBindings[u].binding.parsedPath;g=new Lp(ne.create(n,f,_),d.ValueTypeName,d.getValueSize()),++g.referenceCount,this._addInactiveBinding(g,l,f),o[u]=g}a[u].resultBuffer=g.buffer}}_activateAction(t){if(!this._isActiveAction(t)){if(t._cacheIndex===null){const n=(t._localRoot||this._root).uuid,s=t._clip.uuid,r=this._actionsByClip[s];this._bindAction(t,r&&r.knownActions[0]),this._addInactiveAction(t,s,n)}const e=t._propertyBindings;for(let n=0,s=e.length;n!==s;++n){const r=e[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(t)}}_deactivateAction(t){if(this._isActiveAction(t)){const e=t._propertyBindings;for(let n=0,s=e.length;n!==s;++n){const r=e[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(t)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const t=this;this.stats={actions:{get total(){return t._actions.length},get inUse(){return t._nActiveActions}},bindings:{get total(){return t._bindings.length},get inUse(){return t._nActiveBindings}},controlInterpolants:{get total(){return t._controlInterpolants.length},get inUse(){return t._nActiveControlInterpolants}}}}_isActiveAction(t){const e=t._cacheIndex;return e!==null&&e<this._nActiveActions}_addInactiveAction(t,e,n){const s=this._actions,r=this._actionsByClip;let o=r[e];if(o===void 0)o={knownActions:[t],actionByRoot:{}},t._byClipCacheIndex=0,r[e]=o;else{const a=o.knownActions;t._byClipCacheIndex=a.length,a.push(t)}t._cacheIndex=s.length,s.push(t),o.actionByRoot[n]=t}_removeInactiveAction(t){const e=this._actions,n=e[e.length-1],s=t._cacheIndex;n._cacheIndex=s,e[s]=n,e.pop(),t._cacheIndex=null;const r=t._clip.uuid,o=this._actionsByClip,a=o[r],l=a.knownActions,c=l[l.length-1],h=t._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),t._byClipCacheIndex=null;const u=a.actionByRoot,d=(t._localRoot||this._root).uuid;delete u[d],l.length===0&&delete o[r],this._removeInactiveBindingsForAction(t)}_removeInactiveBindingsForAction(t){const e=t._propertyBindings;for(let n=0,s=e.length;n!==s;++n){const r=e[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(t){const e=this._actions,n=t._cacheIndex,s=this._nActiveActions++,r=e[s];t._cacheIndex=s,e[s]=t,r._cacheIndex=n,e[n]=r}_takeBackAction(t){const e=this._actions,n=t._cacheIndex,s=--this._nActiveActions,r=e[s];t._cacheIndex=s,e[s]=t,r._cacheIndex=n,e[n]=r}_addInactiveBinding(t,e,n){const s=this._bindingsByRootAndName,r=this._bindings;let o=s[e];o===void 0&&(o={},s[e]=o),o[n]=t,t._cacheIndex=r.length,r.push(t)}_removeInactiveBinding(t){const e=this._bindings,n=t.binding,s=n.rootNode.uuid,r=n.path,o=this._bindingsByRootAndName,a=o[s],l=e[e.length-1],c=t._cacheIndex;l._cacheIndex=c,e[c]=l,e.pop(),delete a[r],Object.keys(a).length===0&&delete o[s]}_lendBinding(t){const e=this._bindings,n=t._cacheIndex,s=this._nActiveBindings++,r=e[s];t._cacheIndex=s,e[s]=t,r._cacheIndex=n,e[n]=r}_takeBackBinding(t){const e=this._bindings,n=t._cacheIndex,s=--this._nActiveBindings,r=e[s];t._cacheIndex=s,e[s]=t,r._cacheIndex=n,e[n]=r}_lendControlInterpolant(){const t=this._controlInterpolants,e=this._nActiveControlInterpolants++;let n=t[e];return n===void 0&&(n=new yu(new Float32Array(2),new Float32Array(2),1,Hp),n.__cacheIndex=e,t[e]=n),n}_takeBackControlInterpolant(t){const e=this._controlInterpolants,n=t.__cacheIndex,s=--this._nActiveControlInterpolants,r=e[s];t.__cacheIndex=s,e[s]=t,r.__cacheIndex=n,e[n]=r}clipAction(t,e,n){const s=e||this._root,r=s.uuid;let o=typeof t=="string"?mo.findByName(s,t):t;const a=o!==null?o.uuid:t,l=this._actionsByClip[a];let c=null;if(n===void 0&&(o!==null?n=o.blendMode:n=kl),l!==void 0){const u=l.actionByRoot[r];if(u!==void 0&&u.blendMode===n)return u;c=l.knownActions[0],o===null&&(o=c._clip)}if(o===null)return null;const h=new Vp(this,o,e,n);return this._bindAction(h,c),this._addInactiveAction(h,a,r),h}existingAction(t,e){const n=e||this._root,s=n.uuid,r=typeof t=="string"?mo.findByName(n,t):t,o=r?r.uuid:t,a=this._actionsByClip[o];return a!==void 0&&a.actionByRoot[s]||null}stopAllAction(){const t=this._actions,e=this._nActiveActions;for(let n=e-1;n>=0;--n)t[n].stop();return this}update(t){t*=this.timeScale;const e=this._actions,n=this._nActiveActions,s=this.time+=t,r=Math.sign(t),o=this._accuIndex^=1;for(let c=0;c!==n;++c)e[c]._update(s,t,r,o);const a=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)a[c].apply(o);return this}setTime(t){this.time=0;for(let e=0;e<this._actions.length;e++)this._actions[e].time=0;return this.update(t)}getRoot(){return this._root}uncacheClip(t){const e=this._actions,n=t.uuid,s=this._actionsByClip,r=s[n];if(r!==void 0){const o=r.knownActions;for(let a=0,l=o.length;a!==l;++a){const c=o[a];this._deactivateAction(c);const h=c._cacheIndex,u=e[e.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,u._cacheIndex=h,e[h]=u,e.pop(),this._removeInactiveBindingsForAction(c)}delete s[n]}}uncacheRoot(t){const e=t.uuid,n=this._actionsByClip;for(const o in n){const a=n[o].actionByRoot,l=a[e];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const s=this._bindingsByRootAndName,r=s[e];if(r!==void 0)for(const o in r){const a=r[o];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(t,e){const n=this.existingAction(t,e);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}class Wc{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=jt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(jt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Gp extends ni{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}function Xc(i,t,e,n){const s=Wp(n);switch(e){case Xh:return i*t;case $h:return i*t;case Yh:return i*t*2;case Kh:return i*t/s.components*s.byteLength;case Ol:return i*t/s.components*s.byteLength;case jh:return i*t*2/s.components*s.byteLength;case Bl:return i*t*2/s.components*s.byteLength;case qh:return i*t*3/s.components*s.byteLength;case pn:return i*t*4/s.components*s.byteLength;case zl:return i*t*4/s.components*s.byteLength;case jr:case Zr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Jr:case Qr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Wa:case qa:return Math.max(i,16)*Math.max(t,8)/4;case Ga:case Xa:return Math.max(i,8)*Math.max(t,8)/2;case $a:case Ya:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ka:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ja:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Za:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Ja:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Qa:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case tl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case el:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case nl:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case il:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case sl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case rl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case ol:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case al:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case ll:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case cl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case to:case hl:case ul:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Zh:case dl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case fl:case pl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Wp(i){switch(i){case kn:case Hh:return{byteLength:1,components:1};case Ks:case Gh:case tr:return{byteLength:2,components:1};case Nl:case Fl:return{byteLength:2,components:4};case Si:case Ul:case Nn:return{byteLength:4,components:1};case Wh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Il}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Il);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Au(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Xp(i){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){const h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],_=u[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const _=u[f];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var qp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,$p=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Yp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Kp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,jp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Zp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Jp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Qp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,tm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,em=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,nm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,im=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,sm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,rm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,om=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,am=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,lm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,cm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,hm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,um=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,dm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,fm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,pm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,mm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,gm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,_m=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,vm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,xm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Mm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ym=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Sm="gl_FragColor = linearToOutputTexel( gl_FragColor );",bm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Em=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Am=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Tm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,wm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Cm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Rm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Pm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Lm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Dm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Im=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Um=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Nm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Fm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Om=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Bm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,zm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,km=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Vm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Hm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Gm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Wm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Xm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,qm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,$m=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ym=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Km=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jm=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zm=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Jm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Qm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,t0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,e0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,n0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,i0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,s0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,r0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,o0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,a0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,l0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,c0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,h0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,u0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,d0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,f0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,p0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,m0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,g0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,_0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,v0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,x0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,M0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,y0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,S0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,b0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,E0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,A0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,T0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,w0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,C0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,R0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,P0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,L0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,D0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,I0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,U0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,N0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,F0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,O0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,B0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,z0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,k0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,V0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,H0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,G0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,W0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const X0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,q0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Y0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,K0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,j0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Z0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,J0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Q0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,tg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,eg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ng=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ig=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,rg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,og=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ag=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,hg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ug=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,dg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,fg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,gg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_g=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Mg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,yg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Sg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,bg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Eg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Kt={alphahash_fragment:qp,alphahash_pars_fragment:$p,alphamap_fragment:Yp,alphamap_pars_fragment:Kp,alphatest_fragment:jp,alphatest_pars_fragment:Zp,aomap_fragment:Jp,aomap_pars_fragment:Qp,batching_pars_vertex:tm,batching_vertex:em,begin_vertex:nm,beginnormal_vertex:im,bsdfs:sm,iridescence_fragment:rm,bumpmap_pars_fragment:om,clipping_planes_fragment:am,clipping_planes_pars_fragment:lm,clipping_planes_pars_vertex:cm,clipping_planes_vertex:hm,color_fragment:um,color_pars_fragment:dm,color_pars_vertex:fm,color_vertex:pm,common:mm,cube_uv_reflection_fragment:gm,defaultnormal_vertex:_m,displacementmap_pars_vertex:vm,displacementmap_vertex:xm,emissivemap_fragment:Mm,emissivemap_pars_fragment:ym,colorspace_fragment:Sm,colorspace_pars_fragment:bm,envmap_fragment:Em,envmap_common_pars_fragment:Am,envmap_pars_fragment:Tm,envmap_pars_vertex:wm,envmap_physical_pars_fragment:Bm,envmap_vertex:Cm,fog_vertex:Rm,fog_pars_vertex:Pm,fog_fragment:Lm,fog_pars_fragment:Dm,gradientmap_pars_fragment:Im,lightmap_pars_fragment:Um,lights_lambert_fragment:Nm,lights_lambert_pars_fragment:Fm,lights_pars_begin:Om,lights_toon_fragment:zm,lights_toon_pars_fragment:km,lights_phong_fragment:Vm,lights_phong_pars_fragment:Hm,lights_physical_fragment:Gm,lights_physical_pars_fragment:Wm,lights_fragment_begin:Xm,lights_fragment_maps:qm,lights_fragment_end:$m,logdepthbuf_fragment:Ym,logdepthbuf_pars_fragment:Km,logdepthbuf_pars_vertex:jm,logdepthbuf_vertex:Zm,map_fragment:Jm,map_pars_fragment:Qm,map_particle_fragment:t0,map_particle_pars_fragment:e0,metalnessmap_fragment:n0,metalnessmap_pars_fragment:i0,morphinstance_vertex:s0,morphcolor_vertex:r0,morphnormal_vertex:o0,morphtarget_pars_vertex:a0,morphtarget_vertex:l0,normal_fragment_begin:c0,normal_fragment_maps:h0,normal_pars_fragment:u0,normal_pars_vertex:d0,normal_vertex:f0,normalmap_pars_fragment:p0,clearcoat_normal_fragment_begin:m0,clearcoat_normal_fragment_maps:g0,clearcoat_pars_fragment:_0,iridescence_pars_fragment:v0,opaque_fragment:x0,packing:M0,premultiplied_alpha_fragment:y0,project_vertex:S0,dithering_fragment:b0,dithering_pars_fragment:E0,roughnessmap_fragment:A0,roughnessmap_pars_fragment:T0,shadowmap_pars_fragment:w0,shadowmap_pars_vertex:C0,shadowmap_vertex:R0,shadowmask_pars_fragment:P0,skinbase_vertex:L0,skinning_pars_vertex:D0,skinning_vertex:I0,skinnormal_vertex:U0,specularmap_fragment:N0,specularmap_pars_fragment:F0,tonemapping_fragment:O0,tonemapping_pars_fragment:B0,transmission_fragment:z0,transmission_pars_fragment:k0,uv_pars_fragment:V0,uv_pars_vertex:H0,uv_vertex:G0,worldpos_vertex:W0,background_vert:X0,background_frag:q0,backgroundCube_vert:$0,backgroundCube_frag:Y0,cube_vert:K0,cube_frag:j0,depth_vert:Z0,depth_frag:J0,distanceRGBA_vert:Q0,distanceRGBA_frag:tg,equirect_vert:eg,equirect_frag:ng,linedashed_vert:ig,linedashed_frag:sg,meshbasic_vert:rg,meshbasic_frag:og,meshlambert_vert:ag,meshlambert_frag:lg,meshmatcap_vert:cg,meshmatcap_frag:hg,meshnormal_vert:ug,meshnormal_frag:dg,meshphong_vert:fg,meshphong_frag:pg,meshphysical_vert:mg,meshphysical_frag:gg,meshtoon_vert:_g,meshtoon_frag:vg,points_vert:xg,points_frag:Mg,shadow_vert:yg,shadow_frag:Sg,sprite_vert:bg,sprite_frag:Eg},yt={common:{diffuse:{value:new Ot(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},envMapRotation:{value:new Yt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new Pt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ot(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ot(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new Ot(16777215)},opacity:{value:1},center:{value:new Pt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},_n={basic:{uniforms:Ne([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.fog]),vertexShader:Kt.meshbasic_vert,fragmentShader:Kt.meshbasic_frag},lambert:{uniforms:Ne([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,yt.lights,{emissive:{value:new Ot(0)}}]),vertexShader:Kt.meshlambert_vert,fragmentShader:Kt.meshlambert_frag},phong:{uniforms:Ne([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,yt.lights,{emissive:{value:new Ot(0)},specular:{value:new Ot(1118481)},shininess:{value:30}}]),vertexShader:Kt.meshphong_vert,fragmentShader:Kt.meshphong_frag},standard:{uniforms:Ne([yt.common,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.roughnessmap,yt.metalnessmap,yt.fog,yt.lights,{emissive:{value:new Ot(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag},toon:{uniforms:Ne([yt.common,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.gradientmap,yt.fog,yt.lights,{emissive:{value:new Ot(0)}}]),vertexShader:Kt.meshtoon_vert,fragmentShader:Kt.meshtoon_frag},matcap:{uniforms:Ne([yt.common,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,{matcap:{value:null}}]),vertexShader:Kt.meshmatcap_vert,fragmentShader:Kt.meshmatcap_frag},points:{uniforms:Ne([yt.points,yt.fog]),vertexShader:Kt.points_vert,fragmentShader:Kt.points_frag},dashed:{uniforms:Ne([yt.common,yt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Kt.linedashed_vert,fragmentShader:Kt.linedashed_frag},depth:{uniforms:Ne([yt.common,yt.displacementmap]),vertexShader:Kt.depth_vert,fragmentShader:Kt.depth_frag},normal:{uniforms:Ne([yt.common,yt.bumpmap,yt.normalmap,yt.displacementmap,{opacity:{value:1}}]),vertexShader:Kt.meshnormal_vert,fragmentShader:Kt.meshnormal_frag},sprite:{uniforms:Ne([yt.sprite,yt.fog]),vertexShader:Kt.sprite_vert,fragmentShader:Kt.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Kt.background_vert,fragmentShader:Kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Yt}},vertexShader:Kt.backgroundCube_vert,fragmentShader:Kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Kt.cube_vert,fragmentShader:Kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Kt.equirect_vert,fragmentShader:Kt.equirect_frag},distanceRGBA:{uniforms:Ne([yt.common,yt.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Kt.distanceRGBA_vert,fragmentShader:Kt.distanceRGBA_frag},shadow:{uniforms:Ne([yt.lights,yt.fog,{color:{value:new Ot(0)},opacity:{value:1}}]),vertexShader:Kt.shadow_vert,fragmentShader:Kt.shadow_frag}};_n.physical={uniforms:Ne([_n.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new Pt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new Ot(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new Pt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new Ot(0)},specularColor:{value:new Ot(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new Pt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag};const Br={r:0,b:0,g:0},ci=new En,Ag=new ae;function Tg(i,t,e,n,s,r,o){const a=new Ot(0);let l=r===!0?0:1,c,h,u=null,d=0,f=null;function g(M){let x=M.isScene===!0?M.background:null;return x&&x.isTexture&&(x=(M.backgroundBlurriness>0?e:t).get(x)),x}function _(M){let x=!1;const w=g(M);w===null?p(a,l):w&&w.isColor&&(p(w,1),x=!0);const A=i.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(M,x){const w=g(x);w&&(w.isCubeTexture||w.mapping===So)?(h===void 0&&(h=new Ee(new nr(1,1,1),new on({name:"BackgroundCubeMaterial",uniforms:ps(_n.backgroundCube.uniforms),vertexShader:_n.backgroundCube.vertexShader,fragmentShader:_n.backgroundCube.fragmentShader,side:He,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,C,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ci.copy(x.backgroundRotation),ci.x*=-1,ci.y*=-1,ci.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(ci.y*=-1,ci.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Ag.makeRotationFromEuler(ci)),h.material.toneMapped=Jt.getTransfer(w.colorSpace)!==se,(u!==w||d!==w.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=w,d=w.version,f=i.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(c===void 0&&(c=new Ee(new Eo(2,2),new on({name:"BackgroundMaterial",uniforms:ps(_n.background.uniforms),vertexShader:_n.background.vertexShader,fragmentShader:_n.background.fragmentShader,side:zn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=w,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=Jt.getTransfer(w.colorSpace)!==se,w.matrixAutoUpdate===!0&&w.updateMatrix(),c.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||d!==w.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,u=w,d=w.version,f=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function p(M,x){M.getRGB(Br,au(i)),n.buffers.color.setClear(Br.r,Br.g,Br.b,x,o)}function y(){h!==void 0&&(h.geometry.dispose(),h.material.dispose()),c!==void 0&&(c.geometry.dispose(),c.material.dispose())}return{getClearColor:function(){return a},setClearColor:function(M,x=1){a.set(M),l=x,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,p(a,l)},render:_,addToRenderList:m,dispose:y}}function wg(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,o=!1;function a(v,E,L,D,U){let B=!1;const F=u(D,L,E);r!==F&&(r=F,c(r.object)),B=f(v,D,L,U),B&&g(v,D,L,U),U!==null&&t.update(U,i.ELEMENT_ARRAY_BUFFER),(B||o)&&(o=!1,x(v,E,L,D),U!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function l(){return i.createVertexArray()}function c(v){return i.bindVertexArray(v)}function h(v){return i.deleteVertexArray(v)}function u(v,E,L){const D=L.wireframe===!0;let U=n[v.id];U===void 0&&(U={},n[v.id]=U);let B=U[E.id];B===void 0&&(B={},U[E.id]=B);let F=B[D];return F===void 0&&(F=d(l()),B[D]=F),F}function d(v){const E=[],L=[],D=[];for(let U=0;U<e;U++)E[U]=0,L[U]=0,D[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:E,enabledAttributes:L,attributeDivisors:D,object:v,attributes:{},index:null}}function f(v,E,L,D){const U=r.attributes,B=E.attributes;let F=0;const q=L.getAttributes();for(const V in q)if(q[V].location>=0){const X=U[V];let nt=B[V];if(nt===void 0&&(V==="instanceMatrix"&&v.instanceMatrix&&(nt=v.instanceMatrix),V==="instanceColor"&&v.instanceColor&&(nt=v.instanceColor)),X===void 0||X.attribute!==nt||nt&&X.data!==nt.data)return!0;F++}return r.attributesNum!==F||r.index!==D}function g(v,E,L,D){const U={},B=E.attributes;let F=0;const q=L.getAttributes();for(const V in q)if(q[V].location>=0){let X=B[V];X===void 0&&(V==="instanceMatrix"&&v.instanceMatrix&&(X=v.instanceMatrix),V==="instanceColor"&&v.instanceColor&&(X=v.instanceColor));const nt={};nt.attribute=X,X&&X.data&&(nt.data=X.data),U[V]=nt,F++}r.attributes=U,r.attributesNum=F,r.index=D}function _(){const v=r.newAttributes;for(let E=0,L=v.length;E<L;E++)v[E]=0}function m(v){p(v,0)}function p(v,E){const L=r.newAttributes,D=r.enabledAttributes,U=r.attributeDivisors;L[v]=1,D[v]===0&&(i.enableVertexAttribArray(v),D[v]=1),U[v]!==E&&(i.vertexAttribDivisor(v,E),U[v]=E)}function y(){const v=r.newAttributes,E=r.enabledAttributes;for(let L=0,D=E.length;L<D;L++)E[L]!==v[L]&&(i.disableVertexAttribArray(L),E[L]=0)}function M(v,E,L,D,U,B,F){F===!0?i.vertexAttribIPointer(v,E,L,U,B):i.vertexAttribPointer(v,E,L,D,U,B)}function x(v,E,L,D){_();const U=D.attributes,B=L.getAttributes(),F=E.defaultAttributeValues;for(const q in B){const V=B[q];if(V.location>=0){let tt=U[q];if(tt===void 0&&(q==="instanceMatrix"&&v.instanceMatrix&&(tt=v.instanceMatrix),q==="instanceColor"&&v.instanceColor&&(tt=v.instanceColor)),tt!==void 0){const X=tt.normalized,nt=tt.itemSize,ct=t.get(tt);if(ct===void 0)continue;const et=ct.buffer,N=ct.type,W=ct.bytesPerElement,$=N===i.INT||N===i.UNSIGNED_INT||tt.gpuType===Ul;if(tt.isInterleavedBufferAttribute){const K=tt.data,lt=K.stride,st=tt.offset;if(K.isInstancedInterleavedBuffer){for(let ht=0;ht<V.locationSize;ht++)p(V.location+ht,K.meshPerAttribute);v.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let ht=0;ht<V.locationSize;ht++)m(V.location+ht);i.bindBuffer(i.ARRAY_BUFFER,et);for(let ht=0;ht<V.locationSize;ht++)M(V.location+ht,nt/V.locationSize,N,X,lt*W,(st+nt/V.locationSize*ht)*W,$)}else{if(tt.isInstancedBufferAttribute){for(let K=0;K<V.locationSize;K++)p(V.location+K,tt.meshPerAttribute);v.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let K=0;K<V.locationSize;K++)m(V.location+K);i.bindBuffer(i.ARRAY_BUFFER,et);for(let K=0;K<V.locationSize;K++)M(V.location+K,nt/V.locationSize,N,X,nt*W,nt/V.locationSize*K*W,$)}}else if(F!==void 0){const X=F[q];if(X!==void 0)switch(X.length){case 2:i.vertexAttrib2fv(V.location,X);break;case 3:i.vertexAttrib3fv(V.location,X);break;case 4:i.vertexAttrib4fv(V.location,X);break;default:i.vertexAttrib1fv(V.location,X)}}}}y()}function w(){P();for(const v in n){const E=n[v];for(const L in E){const D=E[L];for(const U in D)h(D[U].object),delete D[U];delete E[L]}delete n[v]}}function A(v){if(n[v.id]===void 0)return;const E=n[v.id];for(const L in E){const D=E[L];for(const U in D)h(D[U].object),delete D[U];delete E[L]}delete n[v.id]}function C(v){for(const E in n){const L=n[E];if(L[v.id]===void 0)continue;const D=L[v.id];for(const U in D)h(D[U].object),delete D[U];delete L[v.id]}}function P(){S(),o=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:S,dispose:w,releaseStatesOfGeometry:A,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:m,disableUnusedAttributes:y}}function Cg(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function a(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}function l(c,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Rg(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==pn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){const P=C===tr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==kn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Nn&&!P)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:y,maxVaryings:M,maxFragmentUniforms:x,vertexTextures:w,maxSamples:A}}function Pg(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new gn,a=new Yt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const y=r?0:n,M=y*4;let x=p.clippingState||null;l.value=x,x=h(g,d,M,f);for(let w=0;w!==M;++w)x[w]=e[w];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=f+_*4,y=d.matrixWorldInverse;a.getNormalMatrix(y),(m===null||m.length<p)&&(m=new Float32Array(p));for(let M=0,x=f;M!==_;++M,x+=4)o.copy(u[M]).applyMatrix4(y,a),o.normal.toArray(m,x),m[x+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Lg(i){let t=new WeakMap;function e(o,a){return a===za?o.mapping=cs:a===ka&&(o.mapping=hs),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===za||a===ka)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Xf(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const es=4,qc=[.125,.215,.35,.446,.526,.582],vi=20,ua=new Eu,$c=new Ot;let da=null,fa=0,pa=0,ma=!1;const gi=(1+Math.sqrt(5))/2,qi=1/gi,Yc=[new O(-gi,qi,0),new O(gi,qi,0),new O(-qi,0,gi),new O(qi,0,gi),new O(0,gi,-qi),new O(0,gi,qi),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)];class Kc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){da=this._renderer.getRenderTarget(),fa=this._renderer.getActiveCubeFace(),pa=this._renderer.getActiveMipmapLevel(),ma=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Jc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Zc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(da,fa,pa),this._renderer.xr.enabled=ma,t.scissorTest=!1,zr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===cs||t.mapping===hs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),da=this._renderer.getRenderTarget(),fa=this._renderer.getActiveCubeFace(),pa=this._renderer.getActiveMipmapLevel(),ma=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Mn,minFilter:Mn,generateMipmaps:!1,type:tr,format:pn,colorSpace:fs,depthBuffer:!1},s=jc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=jc(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Dg(r)),this._blurMaterial=Ig(r,t,e)}return s}_compileMaterial(t){const e=new Ee(this._lodPlanes[0],t);this._renderer.compile(e,ua)}_sceneToCubeUV(t,e,n,s){const a=new tn(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor($c),h.toneMapping=Qn,h.autoClear=!1;const f=new Vl({name:"PMREM.Background",side:He,depthWrite:!1,depthTest:!1}),g=new Ee(new nr,f);let _=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,_=!0):(f.color.copy($c),_=!0);for(let p=0;p<6;p++){const y=p%3;y===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):y===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));const M=this._cubeSize;zr(s,y*M,p>2?M:0,M,M),h.setRenderTarget(s),_&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===cs||t.mapping===hs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Jc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Zc());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Ee(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;zr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,ua)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Yc[(s-r-1)%Yc.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Ee(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*vi-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):vi;m>vi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${vi}`);const p=[];let y=0;for(let C=0;C<vi;++C){const P=C/_,S=Math.exp(-P*P/2);p.push(S),C===0?y+=S:C<m&&(y+=2*S)}for(let C=0;C<p.length;C++)p[C]=p[C]/y;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:M}=this;d.dTheta.value=g,d.mipInt.value=M-n;const x=this._sizeLods[s],w=3*x*(s>M-es?s-M+es:0),A=4*(this._cubeSize-x);zr(e,w,A,3*x,2*x),l.setRenderTarget(e),l.render(u,ua)}}function Dg(i){const t=[],e=[],n=[];let s=i;const r=i-es+1+qc.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let l=1/a;o>i-es?l=qc[o-i+es-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,y=new Float32Array(_*g*f),M=new Float32Array(m*g*f),x=new Float32Array(p*g*f);for(let A=0;A<f;A++){const C=A%3*2/3-1,P=A>2?0:-1,S=[C,P,0,C+2/3,P,0,C+2/3,P+1,0,C,P,0,C+2/3,P+1,0,C,P+1,0];y.set(S,_*g*A),M.set(d,m*g*A);const v=[A,A,A,A,A,A];x.set(v,p*g*A)}const w=new Ae;w.setAttribute("position",new de(y,_)),w.setAttribute("uv",new de(M,m)),w.setAttribute("faceIndex",new de(x,p)),t.push(w),s>es&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function jc(i,t,e){const n=new bi(i,t,e);return n.texture.mapping=So,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function zr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Ig(i,t,e){const n=new Float32Array(vi),s=new O(0,1,0);return new on({name:"SphericalGaussianBlur",defines:{n:vi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:jl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function Zc(){return new on({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:jl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function Jc(){return new on({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:jl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function jl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Ug(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===za||l===ka,h=l===cs||l===hs;if(c||h){let u=t.get(a);const d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new Kc(i)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const f=a.image;return c&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new Kc(i)),u=c?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Ng(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Ki("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Fg(i,t,e,n){const s={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete s[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const f in d)t.update(d[f],i.ARRAY_BUFFER)}function c(u){const d=[],f=u.index,g=u.attributes.position;let _=0;if(f!==null){const y=f.array;_=f.version;for(let M=0,x=y.length;M<x;M+=3){const w=y[M+0],A=y[M+1],C=y[M+2];d.push(w,A,A,C,C,w)}}else if(g!==void 0){const y=g.array;_=g.version;for(let M=0,x=y.length/3-1;M<x;M+=3){const w=M+0,A=M+1,C=M+2;d.push(w,A,A,C,C,w)}}else return;const m=new(tu(d)?ou:ru)(d,1);m.version=_;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function Og(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*o),e.update(f,n,1)}function c(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,d*o,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function u(d,f,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,_,0,g);let p=0;for(let y=0;y<g;y++)p+=f[y]*_[y];e.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Bg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function zg(i,t,e){const n=new WeakMap,s=new ue;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let S=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",S)};d!==void 0&&d.texture.dispose();const f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],y=a.morphAttributes.color||[];let M=0;f===!0&&(M=1),g===!0&&(M=2),_===!0&&(M=3);let x=a.attributes.position.count*M,w=1;x>t.maxTextureSize&&(w=Math.ceil(x/t.maxTextureSize),x=t.maxTextureSize);const A=new Float32Array(x*w*4*u),C=new nu(A,x,w,u);C.type=Nn,C.needsUpdate=!0;const P=M*4;for(let v=0;v<u;v++){const E=m[v],L=p[v],D=y[v],U=x*w*4*v;for(let B=0;B<E.count;B++){const F=B*P;f===!0&&(s.fromBufferAttribute(E,B),A[U+F+0]=s.x,A[U+F+1]=s.y,A[U+F+2]=s.z,A[U+F+3]=0),g===!0&&(s.fromBufferAttribute(L,B),A[U+F+4]=s.x,A[U+F+5]=s.y,A[U+F+6]=s.z,A[U+F+7]=0),_===!0&&(s.fromBufferAttribute(D,B),A[U+F+8]=s.x,A[U+F+9]=s.y,A[U+F+10]=s.z,A[U+F+11]=D.itemSize===4?s.w:1)}}d={count:u,texture:C,size:new Pt(x,w)},n.set(a,d),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];const g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function kg(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}const Tu=new Le,Qc=new mu(1,1),wu=new nu,Cu=new Rf,Ru=new cu,th=[],eh=[],nh=new Float32Array(16),ih=new Float32Array(9),sh=new Float32Array(4);function ys(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=th[s];if(r===void 0&&(r=new Float32Array(s),th[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function xe(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Me(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Co(i,t){let e=eh[t];e===void 0&&(e=new Int32Array(t),eh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Vg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Hg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(xe(e,t))return;i.uniform2fv(this.addr,t),Me(e,t)}}function Gg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(xe(e,t))return;i.uniform3fv(this.addr,t),Me(e,t)}}function Wg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(xe(e,t))return;i.uniform4fv(this.addr,t),Me(e,t)}}function Xg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(xe(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Me(e,t)}else{if(xe(e,n))return;sh.set(n),i.uniformMatrix2fv(this.addr,!1,sh),Me(e,n)}}function qg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(xe(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Me(e,t)}else{if(xe(e,n))return;ih.set(n),i.uniformMatrix3fv(this.addr,!1,ih),Me(e,n)}}function $g(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(xe(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Me(e,t)}else{if(xe(e,n))return;nh.set(n),i.uniformMatrix4fv(this.addr,!1,nh),Me(e,n)}}function Yg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Kg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(xe(e,t))return;i.uniform2iv(this.addr,t),Me(e,t)}}function jg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(xe(e,t))return;i.uniform3iv(this.addr,t),Me(e,t)}}function Zg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(xe(e,t))return;i.uniform4iv(this.addr,t),Me(e,t)}}function Jg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Qg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(xe(e,t))return;i.uniform2uiv(this.addr,t),Me(e,t)}}function t_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(xe(e,t))return;i.uniform3uiv(this.addr,t),Me(e,t)}}function e_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(xe(e,t))return;i.uniform4uiv(this.addr,t),Me(e,t)}}function n_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Qc.compareFunction=Qh,r=Qc):r=Tu,e.setTexture2D(t||r,s)}function i_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Cu,s)}function s_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Ru,s)}function r_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||wu,s)}function o_(i){switch(i){case 5126:return Vg;case 35664:return Hg;case 35665:return Gg;case 35666:return Wg;case 35674:return Xg;case 35675:return qg;case 35676:return $g;case 5124:case 35670:return Yg;case 35667:case 35671:return Kg;case 35668:case 35672:return jg;case 35669:case 35673:return Zg;case 5125:return Jg;case 36294:return Qg;case 36295:return t_;case 36296:return e_;case 35678:case 36198:case 36298:case 36306:case 35682:return n_;case 35679:case 36299:case 36307:return i_;case 35680:case 36300:case 36308:case 36293:return s_;case 36289:case 36303:case 36311:case 36292:return r_}}function a_(i,t){i.uniform1fv(this.addr,t)}function l_(i,t){const e=ys(t,this.size,2);i.uniform2fv(this.addr,e)}function c_(i,t){const e=ys(t,this.size,3);i.uniform3fv(this.addr,e)}function h_(i,t){const e=ys(t,this.size,4);i.uniform4fv(this.addr,e)}function u_(i,t){const e=ys(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function d_(i,t){const e=ys(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function f_(i,t){const e=ys(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function p_(i,t){i.uniform1iv(this.addr,t)}function m_(i,t){i.uniform2iv(this.addr,t)}function g_(i,t){i.uniform3iv(this.addr,t)}function __(i,t){i.uniform4iv(this.addr,t)}function v_(i,t){i.uniform1uiv(this.addr,t)}function x_(i,t){i.uniform2uiv(this.addr,t)}function M_(i,t){i.uniform3uiv(this.addr,t)}function y_(i,t){i.uniform4uiv(this.addr,t)}function S_(i,t,e){const n=this.cache,s=t.length,r=Co(e,s);xe(n,r)||(i.uniform1iv(this.addr,r),Me(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Tu,r[o])}function b_(i,t,e){const n=this.cache,s=t.length,r=Co(e,s);xe(n,r)||(i.uniform1iv(this.addr,r),Me(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Cu,r[o])}function E_(i,t,e){const n=this.cache,s=t.length,r=Co(e,s);xe(n,r)||(i.uniform1iv(this.addr,r),Me(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Ru,r[o])}function A_(i,t,e){const n=this.cache,s=t.length,r=Co(e,s);xe(n,r)||(i.uniform1iv(this.addr,r),Me(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||wu,r[o])}function T_(i){switch(i){case 5126:return a_;case 35664:return l_;case 35665:return c_;case 35666:return h_;case 35674:return u_;case 35675:return d_;case 35676:return f_;case 5124:case 35670:return p_;case 35667:case 35671:return m_;case 35668:case 35672:return g_;case 35669:case 35673:return __;case 5125:return v_;case 36294:return x_;case 36295:return M_;case 36296:return y_;case 35678:case 36198:case 36298:case 36306:case 35682:return S_;case 35679:case 36299:case 36307:return b_;case 35680:case 36300:case 36308:case 36293:return E_;case 36289:case 36303:case 36311:case 36292:return A_}}class w_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=o_(e.type)}}class C_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=T_(e.type)}}class R_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const ga=/(\w+)(\])?(\[|\.)?/g;function rh(i,t){i.seq.push(t),i.map[t.id]=t}function P_(i,t,e){const n=i.name,s=n.length;for(ga.lastIndex=0;;){const r=ga.exec(n),o=ga.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){rh(e,c===void 0?new w_(a,i,t):new C_(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new R_(a),rh(e,u)),e=u}}}class no{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);P_(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function oh(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const L_=37297;let D_=0;function I_(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const ah=new Yt;function U_(i){Jt._getMatrix(ah,Jt.workingColorSpace,i);const t=`mat3( ${ah.elements.map(e=>e.toFixed(4))} )`;switch(Jt.getTransfer(i)){case lo:return[t,"LinearTransferOETF"];case se:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function lh(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+I_(i.getShaderSource(t),o)}else return s}function N_(i,t){const e=U_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function F_(i,t){let e;switch(t){case jd:e="Linear";break;case Zd:e="Reinhard";break;case Jd:e="Cineon";break;case kh:e="ACESFilmic";break;case tf:e="AgX";break;case ef:e="Neutral";break;case Qd:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const kr=new O;function O_(){Jt.getLuminanceCoefficients(kr);const i=kr.x.toFixed(4),t=kr.y.toFixed(4),e=kr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function B_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Hs).join(`
`)}function z_(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function k_(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Hs(i){return i!==""}function ch(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function hh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const V_=/^[ \t]*#include +<([\w\d./]+)>/gm;function xl(i){return i.replace(V_,G_)}const H_=new Map;function G_(i,t){let e=Kt[t];if(e===void 0){const n=H_.get(t);if(n!==void 0)e=Kt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return xl(e)}const W_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function uh(i){return i.replace(W_,X_)}function X_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function dh(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function q_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Bh?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Rd?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Dn&&(t="SHADOWMAP_TYPE_VSM"),t}function $_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case cs:case hs:t="ENVMAP_TYPE_CUBE";break;case So:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Y_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case hs:t="ENVMAP_MODE_REFRACTION";break}return t}function K_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case zh:t="ENVMAP_BLENDING_MULTIPLY";break;case Yd:t="ENVMAP_BLENDING_MIX";break;case Kd:t="ENVMAP_BLENDING_ADD";break}return t}function j_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Z_(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=q_(e),c=$_(e),h=Y_(e),u=K_(e),d=j_(e),f=B_(e),g=z_(r),_=s.createProgram();let m,p,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Hs).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Hs).join(`
`),p.length>0&&(p+=`
`)):(m=[dh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Hs).join(`
`),p=[dh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Qn?"#define TONE_MAPPING":"",e.toneMapping!==Qn?Kt.tonemapping_pars_fragment:"",e.toneMapping!==Qn?F_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Kt.colorspace_pars_fragment,N_("linearToOutputTexel",e.outputColorSpace),O_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Hs).join(`
`)),o=xl(o),o=ch(o,e),o=hh(o,e),a=xl(a),a=ch(a,e),a=hh(a,e),o=uh(o),a=uh(a),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===pc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===pc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const M=y+m+o,x=y+p+a,w=oh(s,s.VERTEX_SHADER,M),A=oh(s,s.FRAGMENT_SHADER,x);s.attachShader(_,w),s.attachShader(_,A),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function C(E){if(i.debug.checkShaderErrors){const L=s.getProgramInfoLog(_).trim(),D=s.getShaderInfoLog(w).trim(),U=s.getShaderInfoLog(A).trim();let B=!0,F=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(B=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,w,A);else{const q=lh(s,w,"vertex"),V=lh(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+E.name+`
Material Type: `+E.type+`

Program Info Log: `+L+`
`+q+`
`+V)}else L!==""?console.warn("THREE.WebGLProgram: Program Info Log:",L):(D===""||U==="")&&(F=!1);F&&(E.diagnostics={runnable:B,programLog:L,vertexShader:{log:D,prefix:m},fragmentShader:{log:U,prefix:p}})}s.deleteShader(w),s.deleteShader(A),P=new no(s,_),S=k_(s,_)}let P;this.getUniforms=function(){return P===void 0&&C(this),P};let S;this.getAttributes=function(){return S===void 0&&C(this),S};let v=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(_,L_)),v},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=D_++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=A,this}let J_=0;class Q_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new t1(t),e.set(t,n)),n}}class t1{constructor(t){this.id=J_++,this.code=t,this.usedTimes=0}}function e1(i,t,e,n,s,r,o){const a=new iu,l=new Q_,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,v,E,L,D){const U=L.fog,B=D.geometry,F=S.isMeshStandardMaterial?L.environment:null,q=(S.isMeshStandardMaterial?e:t).get(S.envMap||F),V=q&&q.mapping===So?q.image.height:null,tt=g[S.type];S.precision!==null&&(f=s.getMaxPrecision(S.precision),f!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));const X=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,nt=X!==void 0?X.length:0;let ct=0;B.morphAttributes.position!==void 0&&(ct=1),B.morphAttributes.normal!==void 0&&(ct=2),B.morphAttributes.color!==void 0&&(ct=3);let et,N,W,$;if(tt){const Qt=_n[tt];et=Qt.vertexShader,N=Qt.fragmentShader}else et=S.vertexShader,N=S.fragmentShader,l.update(S),W=l.getVertexShaderID(S),$=l.getFragmentShaderID(S);const K=i.getRenderTarget(),lt=i.state.buffers.depth.getReversed(),st=D.isInstancedMesh===!0,ht=D.isBatchedMesh===!0,At=!!S.map,wt=!!S.matcap,Nt=!!q,I=!!S.aoMap,Gt=!!S.lightMap,Rt=!!S.bumpMap,Lt=!!S.normalMap,pt=!!S.displacementMap,dt=!!S.emissiveMap,Ct=!!S.metalnessMap,R=!!S.roughnessMap,b=S.anisotropy>0,G=S.clearcoat>0,it=S.dispersion>0,rt=S.iridescence>0,Z=S.sheen>0,vt=S.transmission>0,ft=b&&!!S.anisotropyMap,gt=G&&!!S.clearcoatMap,zt=G&&!!S.clearcoatNormalMap,ut=G&&!!S.clearcoatRoughnessMap,St=rt&&!!S.iridescenceMap,Dt=rt&&!!S.iridescenceThicknessMap,Ut=Z&&!!S.sheenColorMap,_t=Z&&!!S.sheenRoughnessMap,Wt=!!S.specularMap,Vt=!!S.specularColorMap,Zt=!!S.specularIntensityMap,k=vt&&!!S.transmissionMap,xt=vt&&!!S.thicknessMap,J=!!S.gradientMap,at=!!S.alphaMap,Tt=S.alphaTest>0,bt=!!S.alphaHash,Ht=!!S.extensions;let le=Qn;S.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(le=i.toneMapping);const ye={shaderID:tt,shaderType:S.type,shaderName:S.name,vertexShader:et,fragmentShader:N,defines:S.defines,customVertexShaderID:W,customFragmentShaderID:$,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:ht,batchingColor:ht&&D._colorsTexture!==null,instancing:st,instancingColor:st&&D.instanceColor!==null,instancingMorph:st&&D.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:K===null?i.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:fs,alphaToCoverage:!!S.alphaToCoverage,map:At,matcap:wt,envMap:Nt,envMapMode:Nt&&q.mapping,envMapCubeUVHeight:V,aoMap:I,lightMap:Gt,bumpMap:Rt,normalMap:Lt,displacementMap:d&&pt,emissiveMap:dt,normalMapObjectSpace:Lt&&S.normalMapType===hf,normalMapTangentSpace:Lt&&S.normalMapType===Jh,metalnessMap:Ct,roughnessMap:R,anisotropy:b,anisotropyMap:ft,clearcoat:G,clearcoatMap:gt,clearcoatNormalMap:zt,clearcoatRoughnessMap:ut,dispersion:it,iridescence:rt,iridescenceMap:St,iridescenceThicknessMap:Dt,sheen:Z,sheenColorMap:Ut,sheenRoughnessMap:_t,specularMap:Wt,specularColorMap:Vt,specularIntensityMap:Zt,transmission:vt,transmissionMap:k,thicknessMap:xt,gradientMap:J,opaque:S.transparent===!1&&S.blending===is&&S.alphaToCoverage===!1,alphaMap:at,alphaTest:Tt,alphaHash:bt,combine:S.combine,mapUv:At&&_(S.map.channel),aoMapUv:I&&_(S.aoMap.channel),lightMapUv:Gt&&_(S.lightMap.channel),bumpMapUv:Rt&&_(S.bumpMap.channel),normalMapUv:Lt&&_(S.normalMap.channel),displacementMapUv:pt&&_(S.displacementMap.channel),emissiveMapUv:dt&&_(S.emissiveMap.channel),metalnessMapUv:Ct&&_(S.metalnessMap.channel),roughnessMapUv:R&&_(S.roughnessMap.channel),anisotropyMapUv:ft&&_(S.anisotropyMap.channel),clearcoatMapUv:gt&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:zt&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ut&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:St&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:Dt&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ut&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:_t&&_(S.sheenRoughnessMap.channel),specularMapUv:Wt&&_(S.specularMap.channel),specularColorMapUv:Vt&&_(S.specularColorMap.channel),specularIntensityMapUv:Zt&&_(S.specularIntensityMap.channel),transmissionMapUv:k&&_(S.transmissionMap.channel),thicknessMapUv:xt&&_(S.thicknessMap.channel),alphaMapUv:at&&_(S.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(Lt||b),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!B.attributes.uv&&(At||at),fog:!!U,useFog:S.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:lt,skinning:D.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:nt,morphTextureStride:ct,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&E.length>0,shadowMapType:i.shadowMap.type,toneMapping:le,decodeVideoTexture:At&&S.map.isVideoTexture===!0&&Jt.getTransfer(S.map.colorSpace)===se,decodeVideoTextureEmissive:dt&&S.emissiveMap.isVideoTexture===!0&&Jt.getTransfer(S.emissiveMap.colorSpace)===se,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===en,flipSided:S.side===He,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Ht&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ht&&S.extensions.multiDraw===!0||ht)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return ye.vertexUv1s=c.has(1),ye.vertexUv2s=c.has(2),ye.vertexUv3s=c.has(3),c.clear(),ye}function p(S){const v=[];if(S.shaderID?v.push(S.shaderID):(v.push(S.customVertexShaderID),v.push(S.customFragmentShaderID)),S.defines!==void 0)for(const E in S.defines)v.push(E),v.push(S.defines[E]);return S.isRawShaderMaterial===!1&&(y(v,S),M(v,S),v.push(i.outputColorSpace)),v.push(S.customProgramCacheKey),v.join()}function y(S,v){S.push(v.precision),S.push(v.outputColorSpace),S.push(v.envMapMode),S.push(v.envMapCubeUVHeight),S.push(v.mapUv),S.push(v.alphaMapUv),S.push(v.lightMapUv),S.push(v.aoMapUv),S.push(v.bumpMapUv),S.push(v.normalMapUv),S.push(v.displacementMapUv),S.push(v.emissiveMapUv),S.push(v.metalnessMapUv),S.push(v.roughnessMapUv),S.push(v.anisotropyMapUv),S.push(v.clearcoatMapUv),S.push(v.clearcoatNormalMapUv),S.push(v.clearcoatRoughnessMapUv),S.push(v.iridescenceMapUv),S.push(v.iridescenceThicknessMapUv),S.push(v.sheenColorMapUv),S.push(v.sheenRoughnessMapUv),S.push(v.specularMapUv),S.push(v.specularColorMapUv),S.push(v.specularIntensityMapUv),S.push(v.transmissionMapUv),S.push(v.thicknessMapUv),S.push(v.combine),S.push(v.fogExp2),S.push(v.sizeAttenuation),S.push(v.morphTargetsCount),S.push(v.morphAttributeCount),S.push(v.numDirLights),S.push(v.numPointLights),S.push(v.numSpotLights),S.push(v.numSpotLightMaps),S.push(v.numHemiLights),S.push(v.numRectAreaLights),S.push(v.numDirLightShadows),S.push(v.numPointLightShadows),S.push(v.numSpotLightShadows),S.push(v.numSpotLightShadowsWithMaps),S.push(v.numLightProbes),S.push(v.shadowMapType),S.push(v.toneMapping),S.push(v.numClippingPlanes),S.push(v.numClipIntersection),S.push(v.depthPacking)}function M(S,v){a.disableAll(),v.supportsVertexTextures&&a.enable(0),v.instancing&&a.enable(1),v.instancingColor&&a.enable(2),v.instancingMorph&&a.enable(3),v.matcap&&a.enable(4),v.envMap&&a.enable(5),v.normalMapObjectSpace&&a.enable(6),v.normalMapTangentSpace&&a.enable(7),v.clearcoat&&a.enable(8),v.iridescence&&a.enable(9),v.alphaTest&&a.enable(10),v.vertexColors&&a.enable(11),v.vertexAlphas&&a.enable(12),v.vertexUv1s&&a.enable(13),v.vertexUv2s&&a.enable(14),v.vertexUv3s&&a.enable(15),v.vertexTangents&&a.enable(16),v.anisotropy&&a.enable(17),v.alphaHash&&a.enable(18),v.batching&&a.enable(19),v.dispersion&&a.enable(20),v.batchingColor&&a.enable(21),S.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.reverseDepthBuffer&&a.enable(4),v.skinning&&a.enable(5),v.morphTargets&&a.enable(6),v.morphNormals&&a.enable(7),v.morphColors&&a.enable(8),v.premultipliedAlpha&&a.enable(9),v.shadowMapEnabled&&a.enable(10),v.doubleSided&&a.enable(11),v.flipSided&&a.enable(12),v.useDepthPacking&&a.enable(13),v.dithering&&a.enable(14),v.transmission&&a.enable(15),v.sheen&&a.enable(16),v.opaque&&a.enable(17),v.pointsUvs&&a.enable(18),v.decodeVideoTexture&&a.enable(19),v.decodeVideoTextureEmissive&&a.enable(20),v.alphaToCoverage&&a.enable(21),S.push(a.mask)}function x(S){const v=g[S.type];let E;if(v){const L=_n[v];E=Vf.clone(L.uniforms)}else E=S.uniforms;return E}function w(S,v){let E;for(let L=0,D=h.length;L<D;L++){const U=h[L];if(U.cacheKey===v){E=U,++E.usedTimes;break}}return E===void 0&&(E=new Z_(i,v,S,r),h.push(E)),E}function A(S){if(--S.usedTimes===0){const v=h.indexOf(S);h[v]=h[h.length-1],h.pop(),S.destroy()}}function C(S){l.remove(S)}function P(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:w,releaseProgram:A,releaseShaderCache:C,programs:h,dispose:P}}function n1(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function i1(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function fh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function ph(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,d,f,g,_,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function a(u,d,f,g,_,m){const p=o(u,d,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function l(u,d,f,g,_,m){const p=o(u,d,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||i1),n.length>1&&n.sort(d||fh),s.length>1&&s.sort(d||fh)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function s1(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new ph,i.set(n,[o])):s>=r.length?(o=new ph,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function r1(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new O,color:new Ot};break;case"SpotLight":e={position:new O,direction:new O,color:new Ot,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new O,color:new Ot,distance:0,decay:0};break;case"HemisphereLight":e={direction:new O,skyColor:new Ot,groundColor:new Ot};break;case"RectAreaLight":e={color:new Ot,position:new O,halfWidth:new O,halfHeight:new O};break}return i[t.id]=e,e}}}function o1(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let a1=0;function l1(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function c1(i){const t=new r1,e=o1(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new O);const s=new O,r=new ae,o=new ae;function a(c){let h=0,u=0,d=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,y=0,M=0,x=0,w=0,A=0,C=0;c.sort(l1);for(let S=0,v=c.length;S<v;S++){const E=c[S],L=E.color,D=E.intensity,U=E.distance,B=E.shadow&&E.shadow.map?E.shadow.map.texture:null;if(E.isAmbientLight)h+=L.r*D,u+=L.g*D,d+=L.b*D;else if(E.isLightProbe){for(let F=0;F<9;F++)n.probe[F].addScaledVector(E.sh.coefficients[F],D);C++}else if(E.isDirectionalLight){const F=t.get(E);if(F.color.copy(E.color).multiplyScalar(E.intensity),E.castShadow){const q=E.shadow,V=e.get(E);V.shadowIntensity=q.intensity,V.shadowBias=q.bias,V.shadowNormalBias=q.normalBias,V.shadowRadius=q.radius,V.shadowMapSize=q.mapSize,n.directionalShadow[f]=V,n.directionalShadowMap[f]=B,n.directionalShadowMatrix[f]=E.shadow.matrix,y++}n.directional[f]=F,f++}else if(E.isSpotLight){const F=t.get(E);F.position.setFromMatrixPosition(E.matrixWorld),F.color.copy(L).multiplyScalar(D),F.distance=U,F.coneCos=Math.cos(E.angle),F.penumbraCos=Math.cos(E.angle*(1-E.penumbra)),F.decay=E.decay,n.spot[_]=F;const q=E.shadow;if(E.map&&(n.spotLightMap[w]=E.map,w++,q.updateMatrices(E),E.castShadow&&A++),n.spotLightMatrix[_]=q.matrix,E.castShadow){const V=e.get(E);V.shadowIntensity=q.intensity,V.shadowBias=q.bias,V.shadowNormalBias=q.normalBias,V.shadowRadius=q.radius,V.shadowMapSize=q.mapSize,n.spotShadow[_]=V,n.spotShadowMap[_]=B,x++}_++}else if(E.isRectAreaLight){const F=t.get(E);F.color.copy(L).multiplyScalar(D),F.halfWidth.set(E.width*.5,0,0),F.halfHeight.set(0,E.height*.5,0),n.rectArea[m]=F,m++}else if(E.isPointLight){const F=t.get(E);if(F.color.copy(E.color).multiplyScalar(E.intensity),F.distance=E.distance,F.decay=E.decay,E.castShadow){const q=E.shadow,V=e.get(E);V.shadowIntensity=q.intensity,V.shadowBias=q.bias,V.shadowNormalBias=q.normalBias,V.shadowRadius=q.radius,V.shadowMapSize=q.mapSize,V.shadowCameraNear=q.camera.near,V.shadowCameraFar=q.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=B,n.pointShadowMatrix[g]=E.shadow.matrix,M++}n.point[g]=F,g++}else if(E.isHemisphereLight){const F=t.get(E);F.skyColor.copy(E.color).multiplyScalar(D),F.groundColor.copy(E.groundColor).multiplyScalar(D),n.hemi[p]=F,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=yt.LTC_FLOAT_1,n.rectAreaLTC2=yt.LTC_FLOAT_2):(n.rectAreaLTC1=yt.LTC_HALF_1,n.rectAreaLTC2=yt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const P=n.hash;(P.directionalLength!==f||P.pointLength!==g||P.spotLength!==_||P.rectAreaLength!==m||P.hemiLength!==p||P.numDirectionalShadows!==y||P.numPointShadows!==M||P.numSpotShadows!==x||P.numSpotMaps!==w||P.numLightProbes!==C)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=x+w-A,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=C,P.directionalLength=f,P.pointLength=g,P.spotLength=_,P.rectAreaLength=m,P.hemiLength=p,P.numDirectionalShadows=y,P.numPointShadows=M,P.numSpotShadows=x,P.numSpotMaps=w,P.numLightProbes=C,n.version=a1++)}function l(c,h){let u=0,d=0,f=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,y=c.length;p<y;p++){const M=c[p];if(M.isDirectionalLight){const x=n.directional[u];x.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),u++}else if(M.isSpotLight){const x=n.spot[f];x.position.setFromMatrixPosition(M.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),f++}else if(M.isRectAreaLight){const x=n.rectArea[g];x.position.setFromMatrixPosition(M.matrixWorld),x.position.applyMatrix4(m),o.identity(),r.copy(M.matrixWorld),r.premultiply(m),o.extractRotation(r),x.halfWidth.set(M.width*.5,0,0),x.halfHeight.set(0,M.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(M.isPointLight){const x=n.point[d];x.position.setFromMatrixPosition(M.matrixWorld),x.position.applyMatrix4(m),d++}else if(M.isHemisphereLight){const x=n.hemi[_];x.direction.setFromMatrixPosition(M.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function mh(i){const t=new c1(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function h1(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new mh(i),t.set(s,[a])):r>=o.length?(a=new mh(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const u1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,d1=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function f1(i,t,e){let n=new Gl;const s=new Pt,r=new Pt,o=new ue,a=new fp({depthPacking:cf}),l=new pp,c={},h=e.maxTextureSize,u={[zn]:He,[He]:zn,[en]:en},d=new on({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Pt},radius:{value:4}},vertexShader:u1,fragmentShader:d1}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Ae;g.setAttribute("position",new de(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Ee(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Bh;let p=this.type;this.render=function(A,C,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const S=i.getRenderTarget(),v=i.getActiveCubeFace(),E=i.getActiveMipmapLevel(),L=i.state;L.setBlending(Jn),L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const D=p!==Dn&&this.type===Dn,U=p===Dn&&this.type!==Dn;for(let B=0,F=A.length;B<F;B++){const q=A[B],V=q.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const tt=V.getFrameExtents();if(s.multiply(tt),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/tt.x),s.x=r.x*tt.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/tt.y),s.y=r.y*tt.y,V.mapSize.y=r.y)),V.map===null||D===!0||U===!0){const nt=this.type!==Dn?{minFilter:mn,magFilter:mn}:{};V.map!==null&&V.map.dispose(),V.map=new bi(s.x,s.y,nt),V.map.texture.name=q.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const X=V.getViewportCount();for(let nt=0;nt<X;nt++){const ct=V.getViewport(nt);o.set(r.x*ct.x,r.y*ct.y,r.x*ct.z,r.y*ct.w),L.viewport(o),V.updateMatrices(q,nt),n=V.getFrustum(),x(C,P,V.camera,q,this.type)}V.isPointLightShadow!==!0&&this.type===Dn&&y(V,P),V.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(S,v,E)};function y(A,C){const P=t.update(_);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new bi(s.x,s.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(C,null,P,d,_,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(C,null,P,f,_,null)}function M(A,C,P,S){let v=null;const E=P.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(E!==void 0)v=E;else if(v=P.isPointLight===!0?l:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){const L=v.uuid,D=C.uuid;let U=c[L];U===void 0&&(U={},c[L]=U);let B=U[D];B===void 0&&(B=v.clone(),U[D]=B,C.addEventListener("dispose",w)),v=B}if(v.visible=C.visible,v.wireframe=C.wireframe,S===Dn?v.side=C.shadowSide!==null?C.shadowSide:C.side:v.side=C.shadowSide!==null?C.shadowSide:u[C.side],v.alphaMap=C.alphaMap,v.alphaTest=C.alphaTest,v.map=C.map,v.clipShadows=C.clipShadows,v.clippingPlanes=C.clippingPlanes,v.clipIntersection=C.clipIntersection,v.displacementMap=C.displacementMap,v.displacementScale=C.displacementScale,v.displacementBias=C.displacementBias,v.wireframeLinewidth=C.wireframeLinewidth,v.linewidth=C.linewidth,P.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const L=i.properties.get(v);L.light=P}return v}function x(A,C,P,S,v){if(A.visible===!1)return;if(A.layers.test(C.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&v===Dn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,A.matrixWorld);const D=t.update(A),U=A.material;if(Array.isArray(U)){const B=D.groups;for(let F=0,q=B.length;F<q;F++){const V=B[F],tt=U[V.materialIndex];if(tt&&tt.visible){const X=M(A,tt,S,v);A.onBeforeShadow(i,A,C,P,D,X,V),i.renderBufferDirect(P,null,D,X,A,V),A.onAfterShadow(i,A,C,P,D,X,V)}}}else if(U.visible){const B=M(A,U,S,v);A.onBeforeShadow(i,A,C,P,D,B,null),i.renderBufferDirect(P,null,D,B,A,null),A.onAfterShadow(i,A,C,P,D,B,null)}}const L=A.children;for(let D=0,U=L.length;D<U;D++)x(L[D],C,P,S,v)}function w(A){A.target.removeEventListener("dispose",w);for(const P in c){const S=c[P],v=A.target.uuid;v in S&&(S[v].dispose(),delete S[v])}}}const p1={[Da]:Ia,[Ua]:Oa,[Na]:Ba,[ls]:Fa,[Ia]:Da,[Oa]:Ua,[Ba]:Na,[Fa]:ls};function m1(i,t){function e(){let k=!1;const xt=new ue;let J=null;const at=new ue(0,0,0,0);return{setMask:function(Tt){J!==Tt&&!k&&(i.colorMask(Tt,Tt,Tt,Tt),J=Tt)},setLocked:function(Tt){k=Tt},setClear:function(Tt,bt,Ht,le,ye){ye===!0&&(Tt*=le,bt*=le,Ht*=le),xt.set(Tt,bt,Ht,le),at.equals(xt)===!1&&(i.clearColor(Tt,bt,Ht,le),at.copy(xt))},reset:function(){k=!1,J=null,at.set(-1,0,0,0)}}}function n(){let k=!1,xt=!1,J=null,at=null,Tt=null;return{setReversed:function(bt){if(xt!==bt){const Ht=t.get("EXT_clip_control");xt?Ht.clipControlEXT(Ht.LOWER_LEFT_EXT,Ht.ZERO_TO_ONE_EXT):Ht.clipControlEXT(Ht.LOWER_LEFT_EXT,Ht.NEGATIVE_ONE_TO_ONE_EXT);const le=Tt;Tt=null,this.setClear(le)}xt=bt},getReversed:function(){return xt},setTest:function(bt){bt?K(i.DEPTH_TEST):lt(i.DEPTH_TEST)},setMask:function(bt){J!==bt&&!k&&(i.depthMask(bt),J=bt)},setFunc:function(bt){if(xt&&(bt=p1[bt]),at!==bt){switch(bt){case Da:i.depthFunc(i.NEVER);break;case Ia:i.depthFunc(i.ALWAYS);break;case Ua:i.depthFunc(i.LESS);break;case ls:i.depthFunc(i.LEQUAL);break;case Na:i.depthFunc(i.EQUAL);break;case Fa:i.depthFunc(i.GEQUAL);break;case Oa:i.depthFunc(i.GREATER);break;case Ba:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}at=bt}},setLocked:function(bt){k=bt},setClear:function(bt){Tt!==bt&&(xt&&(bt=1-bt),i.clearDepth(bt),Tt=bt)},reset:function(){k=!1,J=null,at=null,Tt=null,xt=!1}}}function s(){let k=!1,xt=null,J=null,at=null,Tt=null,bt=null,Ht=null,le=null,ye=null;return{setTest:function(Qt){k||(Qt?K(i.STENCIL_TEST):lt(i.STENCIL_TEST))},setMask:function(Qt){xt!==Qt&&!k&&(i.stencilMask(Qt),xt=Qt)},setFunc:function(Qt,Ge,an){(J!==Qt||at!==Ge||Tt!==an)&&(i.stencilFunc(Qt,Ge,an),J=Qt,at=Ge,Tt=an)},setOp:function(Qt,Ge,an){(bt!==Qt||Ht!==Ge||le!==an)&&(i.stencilOp(Qt,Ge,an),bt=Qt,Ht=Ge,le=an)},setLocked:function(Qt){k=Qt},setClear:function(Qt){ye!==Qt&&(i.clearStencil(Qt),ye=Qt)},reset:function(){k=!1,xt=null,J=null,at=null,Tt=null,bt=null,Ht=null,le=null,ye=null}}}const r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,y=null,M=null,x=null,w=null,A=null,C=new Ot(0,0,0),P=0,S=!1,v=null,E=null,L=null,D=null,U=null;const B=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let F=!1,q=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(V)[1]),F=q>=1):V.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),F=q>=2);let tt=null,X={};const nt=i.getParameter(i.SCISSOR_BOX),ct=i.getParameter(i.VIEWPORT),et=new ue().fromArray(nt),N=new ue().fromArray(ct);function W(k,xt,J,at){const Tt=new Uint8Array(4),bt=i.createTexture();i.bindTexture(k,bt),i.texParameteri(k,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(k,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ht=0;Ht<J;Ht++)k===i.TEXTURE_3D||k===i.TEXTURE_2D_ARRAY?i.texImage3D(xt,0,i.RGBA,1,1,at,0,i.RGBA,i.UNSIGNED_BYTE,Tt):i.texImage2D(xt+Ht,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Tt);return bt}const $={};$[i.TEXTURE_2D]=W(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=W(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=W(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=W(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),K(i.DEPTH_TEST),o.setFunc(ls),Rt(!1),Lt(hc),K(i.CULL_FACE),I(Jn);function K(k){h[k]!==!0&&(i.enable(k),h[k]=!0)}function lt(k){h[k]!==!1&&(i.disable(k),h[k]=!1)}function st(k,xt){return u[k]!==xt?(i.bindFramebuffer(k,xt),u[k]=xt,k===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=xt),k===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=xt),!0):!1}function ht(k,xt){let J=f,at=!1;if(k){J=d.get(xt),J===void 0&&(J=[],d.set(xt,J));const Tt=k.textures;if(J.length!==Tt.length||J[0]!==i.COLOR_ATTACHMENT0){for(let bt=0,Ht=Tt.length;bt<Ht;bt++)J[bt]=i.COLOR_ATTACHMENT0+bt;J.length=Tt.length,at=!0}}else J[0]!==i.BACK&&(J[0]=i.BACK,at=!0);at&&i.drawBuffers(J)}function At(k){return g!==k?(i.useProgram(k),g=k,!0):!1}const wt={[_i]:i.FUNC_ADD,[Ld]:i.FUNC_SUBTRACT,[Dd]:i.FUNC_REVERSE_SUBTRACT};wt[Id]=i.MIN,wt[Ud]=i.MAX;const Nt={[Nd]:i.ZERO,[Fd]:i.ONE,[Od]:i.SRC_COLOR,[Pa]:i.SRC_ALPHA,[Gd]:i.SRC_ALPHA_SATURATE,[Vd]:i.DST_COLOR,[zd]:i.DST_ALPHA,[Bd]:i.ONE_MINUS_SRC_COLOR,[La]:i.ONE_MINUS_SRC_ALPHA,[Hd]:i.ONE_MINUS_DST_COLOR,[kd]:i.ONE_MINUS_DST_ALPHA,[Wd]:i.CONSTANT_COLOR,[Xd]:i.ONE_MINUS_CONSTANT_COLOR,[qd]:i.CONSTANT_ALPHA,[$d]:i.ONE_MINUS_CONSTANT_ALPHA};function I(k,xt,J,at,Tt,bt,Ht,le,ye,Qt){if(k===Jn){_===!0&&(lt(i.BLEND),_=!1);return}if(_===!1&&(K(i.BLEND),_=!0),k!==Pd){if(k!==m||Qt!==S){if((p!==_i||x!==_i)&&(i.blendEquation(i.FUNC_ADD),p=_i,x=_i),Qt)switch(k){case is:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ei:i.blendFunc(i.ONE,i.ONE);break;case uc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case dc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}else switch(k){case is:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ei:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case uc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case dc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}y=null,M=null,w=null,A=null,C.set(0,0,0),P=0,m=k,S=Qt}return}Tt=Tt||xt,bt=bt||J,Ht=Ht||at,(xt!==p||Tt!==x)&&(i.blendEquationSeparate(wt[xt],wt[Tt]),p=xt,x=Tt),(J!==y||at!==M||bt!==w||Ht!==A)&&(i.blendFuncSeparate(Nt[J],Nt[at],Nt[bt],Nt[Ht]),y=J,M=at,w=bt,A=Ht),(le.equals(C)===!1||ye!==P)&&(i.blendColor(le.r,le.g,le.b,ye),C.copy(le),P=ye),m=k,S=!1}function Gt(k,xt){k.side===en?lt(i.CULL_FACE):K(i.CULL_FACE);let J=k.side===He;xt&&(J=!J),Rt(J),k.blending===is&&k.transparent===!1?I(Jn):I(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),o.setFunc(k.depthFunc),o.setTest(k.depthTest),o.setMask(k.depthWrite),r.setMask(k.colorWrite);const at=k.stencilWrite;a.setTest(at),at&&(a.setMask(k.stencilWriteMask),a.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),a.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),dt(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?K(i.SAMPLE_ALPHA_TO_COVERAGE):lt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Rt(k){v!==k&&(k?i.frontFace(i.CW):i.frontFace(i.CCW),v=k)}function Lt(k){k!==wd?(K(i.CULL_FACE),k!==E&&(k===hc?i.cullFace(i.BACK):k===Cd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):lt(i.CULL_FACE),E=k}function pt(k){k!==L&&(F&&i.lineWidth(k),L=k)}function dt(k,xt,J){k?(K(i.POLYGON_OFFSET_FILL),(D!==xt||U!==J)&&(i.polygonOffset(xt,J),D=xt,U=J)):lt(i.POLYGON_OFFSET_FILL)}function Ct(k){k?K(i.SCISSOR_TEST):lt(i.SCISSOR_TEST)}function R(k){k===void 0&&(k=i.TEXTURE0+B-1),tt!==k&&(i.activeTexture(k),tt=k)}function b(k,xt,J){J===void 0&&(tt===null?J=i.TEXTURE0+B-1:J=tt);let at=X[J];at===void 0&&(at={type:void 0,texture:void 0},X[J]=at),(at.type!==k||at.texture!==xt)&&(tt!==J&&(i.activeTexture(J),tt=J),i.bindTexture(k,xt||$[k]),at.type=k,at.texture=xt)}function G(){const k=X[tt];k!==void 0&&k.type!==void 0&&(i.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function it(){try{i.compressedTexImage2D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function rt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Z(){try{i.texSubImage2D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function vt(){try{i.texSubImage3D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ft(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function gt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function zt(){try{i.texStorage2D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ut(){try{i.texStorage3D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function St(){try{i.texImage2D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Dt(){try{i.texImage3D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Ut(k){et.equals(k)===!1&&(i.scissor(k.x,k.y,k.z,k.w),et.copy(k))}function _t(k){N.equals(k)===!1&&(i.viewport(k.x,k.y,k.z,k.w),N.copy(k))}function Wt(k,xt){let J=c.get(xt);J===void 0&&(J=new WeakMap,c.set(xt,J));let at=J.get(k);at===void 0&&(at=i.getUniformBlockIndex(xt,k.name),J.set(k,at))}function Vt(k,xt){const at=c.get(xt).get(k);l.get(xt)!==at&&(i.uniformBlockBinding(xt,at,k.__bindingPointIndex),l.set(xt,at))}function Zt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},tt=null,X={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,y=null,M=null,x=null,w=null,A=null,C=new Ot(0,0,0),P=0,S=!1,v=null,E=null,L=null,D=null,U=null,et.set(0,0,i.canvas.width,i.canvas.height),N.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:K,disable:lt,bindFramebuffer:st,drawBuffers:ht,useProgram:At,setBlending:I,setMaterial:Gt,setFlipSided:Rt,setCullFace:Lt,setLineWidth:pt,setPolygonOffset:dt,setScissorTest:Ct,activeTexture:R,bindTexture:b,unbindTexture:G,compressedTexImage2D:it,compressedTexImage3D:rt,texImage2D:St,texImage3D:Dt,updateUBOMapping:Wt,uniformBlockBinding:Vt,texStorage2D:zt,texStorage3D:ut,texSubImage2D:Z,texSubImage3D:vt,compressedTexSubImage2D:ft,compressedTexSubImage3D:gt,scissor:Ut,viewport:_t,reset:Zt}}function g1(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Pt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,b){return f?new OffscreenCanvas(R,b):js("canvas")}function _(R,b,G){let it=1;const rt=Ct(R);if((rt.width>G||rt.height>G)&&(it=G/Math.max(rt.width,rt.height)),it<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const Z=Math.floor(it*rt.width),vt=Math.floor(it*rt.height);u===void 0&&(u=g(Z,vt));const ft=b?g(Z,vt):u;return ft.width=Z,ft.height=vt,ft.getContext("2d").drawImage(R,0,0,Z,vt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+rt.width+"x"+rt.height+") to ("+Z+"x"+vt+")."),ft}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+rt.width+"x"+rt.height+")."),R;return R}function m(R){return R.generateMipmaps}function p(R){i.generateMipmap(R)}function y(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(R,b,G,it,rt=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let Z=b;if(b===i.RED&&(G===i.FLOAT&&(Z=i.R32F),G===i.HALF_FLOAT&&(Z=i.R16F),G===i.UNSIGNED_BYTE&&(Z=i.R8)),b===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.R8UI),G===i.UNSIGNED_SHORT&&(Z=i.R16UI),G===i.UNSIGNED_INT&&(Z=i.R32UI),G===i.BYTE&&(Z=i.R8I),G===i.SHORT&&(Z=i.R16I),G===i.INT&&(Z=i.R32I)),b===i.RG&&(G===i.FLOAT&&(Z=i.RG32F),G===i.HALF_FLOAT&&(Z=i.RG16F),G===i.UNSIGNED_BYTE&&(Z=i.RG8)),b===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.RG8UI),G===i.UNSIGNED_SHORT&&(Z=i.RG16UI),G===i.UNSIGNED_INT&&(Z=i.RG32UI),G===i.BYTE&&(Z=i.RG8I),G===i.SHORT&&(Z=i.RG16I),G===i.INT&&(Z=i.RG32I)),b===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),G===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),G===i.UNSIGNED_INT&&(Z=i.RGB32UI),G===i.BYTE&&(Z=i.RGB8I),G===i.SHORT&&(Z=i.RGB16I),G===i.INT&&(Z=i.RGB32I)),b===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),G===i.UNSIGNED_INT&&(Z=i.RGBA32UI),G===i.BYTE&&(Z=i.RGBA8I),G===i.SHORT&&(Z=i.RGBA16I),G===i.INT&&(Z=i.RGBA32I)),b===i.RGB&&G===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),b===i.RGBA){const vt=rt?lo:Jt.getTransfer(it);G===i.FLOAT&&(Z=i.RGBA32F),G===i.HALF_FLOAT&&(Z=i.RGBA16F),G===i.UNSIGNED_BYTE&&(Z=vt===se?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function x(R,b){let G;return R?b===null||b===Si||b===us?G=i.DEPTH24_STENCIL8:b===Nn?G=i.DEPTH32F_STENCIL8:b===Ks&&(G=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Si||b===us?G=i.DEPTH_COMPONENT24:b===Nn?G=i.DEPTH_COMPONENT32F:b===Ks&&(G=i.DEPTH_COMPONENT16),G}function w(R,b){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==mn&&R.minFilter!==Mn?Math.log2(Math.max(b.width,b.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?b.mipmaps.length:1}function A(R){const b=R.target;b.removeEventListener("dispose",A),P(b),b.isVideoTexture&&h.delete(b)}function C(R){const b=R.target;b.removeEventListener("dispose",C),v(b)}function P(R){const b=n.get(R);if(b.__webglInit===void 0)return;const G=R.source,it=d.get(G);if(it){const rt=it[b.__cacheKey];rt.usedTimes--,rt.usedTimes===0&&S(R),Object.keys(it).length===0&&d.delete(G)}n.remove(R)}function S(R){const b=n.get(R);i.deleteTexture(b.__webglTexture);const G=R.source,it=d.get(G);delete it[b.__cacheKey],o.memory.textures--}function v(R){const b=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let it=0;it<6;it++){if(Array.isArray(b.__webglFramebuffer[it]))for(let rt=0;rt<b.__webglFramebuffer[it].length;rt++)i.deleteFramebuffer(b.__webglFramebuffer[it][rt]);else i.deleteFramebuffer(b.__webglFramebuffer[it]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[it])}else{if(Array.isArray(b.__webglFramebuffer))for(let it=0;it<b.__webglFramebuffer.length;it++)i.deleteFramebuffer(b.__webglFramebuffer[it]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let it=0;it<b.__webglColorRenderbuffer.length;it++)b.__webglColorRenderbuffer[it]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[it]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const G=R.textures;for(let it=0,rt=G.length;it<rt;it++){const Z=n.get(G[it]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),o.memory.textures--),n.remove(G[it])}n.remove(R)}let E=0;function L(){E=0}function D(){const R=E;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),E+=1,R}function U(R){const b=[];return b.push(R.wrapS),b.push(R.wrapT),b.push(R.wrapR||0),b.push(R.magFilter),b.push(R.minFilter),b.push(R.anisotropy),b.push(R.internalFormat),b.push(R.format),b.push(R.type),b.push(R.generateMipmaps),b.push(R.premultiplyAlpha),b.push(R.flipY),b.push(R.unpackAlignment),b.push(R.colorSpace),b.join()}function B(R,b){const G=n.get(R);if(R.isVideoTexture&&pt(R),R.isRenderTargetTexture===!1&&R.version>0&&G.__version!==R.version){const it=R.image;if(it===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(it.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{N(G,R,b);return}}e.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+b)}function F(R,b){const G=n.get(R);if(R.version>0&&G.__version!==R.version){N(G,R,b);return}e.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+b)}function q(R,b){const G=n.get(R);if(R.version>0&&G.__version!==R.version){N(G,R,b);return}e.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+b)}function V(R,b){const G=n.get(R);if(R.version>0&&G.__version!==R.version){W(G,R,b);return}e.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+b)}const tt={[Va]:i.REPEAT,[xi]:i.CLAMP_TO_EDGE,[Ha]:i.MIRRORED_REPEAT},X={[mn]:i.NEAREST,[nf]:i.NEAREST_MIPMAP_NEAREST,[ur]:i.NEAREST_MIPMAP_LINEAR,[Mn]:i.LINEAR,[Fo]:i.LINEAR_MIPMAP_NEAREST,[Mi]:i.LINEAR_MIPMAP_LINEAR},nt={[uf]:i.NEVER,[_f]:i.ALWAYS,[df]:i.LESS,[Qh]:i.LEQUAL,[ff]:i.EQUAL,[gf]:i.GEQUAL,[pf]:i.GREATER,[mf]:i.NOTEQUAL};function ct(R,b){if(b.type===Nn&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===Mn||b.magFilter===Fo||b.magFilter===ur||b.magFilter===Mi||b.minFilter===Mn||b.minFilter===Fo||b.minFilter===ur||b.minFilter===Mi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,tt[b.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,tt[b.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,tt[b.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,X[b.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,X[b.minFilter]),b.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,nt[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===mn||b.minFilter!==ur&&b.minFilter!==Mi||b.type===Nn&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const G=t.get("EXT_texture_filter_anisotropic");i.texParameterf(R,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function et(R,b){let G=!1;R.__webglInit===void 0&&(R.__webglInit=!0,b.addEventListener("dispose",A));const it=b.source;let rt=d.get(it);rt===void 0&&(rt={},d.set(it,rt));const Z=U(b);if(Z!==R.__cacheKey){rt[Z]===void 0&&(rt[Z]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,G=!0),rt[Z].usedTimes++;const vt=rt[R.__cacheKey];vt!==void 0&&(rt[R.__cacheKey].usedTimes--,vt.usedTimes===0&&S(b)),R.__cacheKey=Z,R.__webglTexture=rt[Z].texture}return G}function N(R,b,G){let it=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(it=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(it=i.TEXTURE_3D);const rt=et(R,b),Z=b.source;e.bindTexture(it,R.__webglTexture,i.TEXTURE0+G);const vt=n.get(Z);if(Z.version!==vt.__version||rt===!0){e.activeTexture(i.TEXTURE0+G);const ft=Jt.getPrimaries(Jt.workingColorSpace),gt=b.colorSpace===Kn?null:Jt.getPrimaries(b.colorSpace),zt=b.colorSpace===Kn||ft===gt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,zt);let ut=_(b.image,!1,s.maxTextureSize);ut=dt(b,ut);const St=r.convert(b.format,b.colorSpace),Dt=r.convert(b.type);let Ut=M(b.internalFormat,St,Dt,b.colorSpace,b.isVideoTexture);ct(it,b);let _t;const Wt=b.mipmaps,Vt=b.isVideoTexture!==!0,Zt=vt.__version===void 0||rt===!0,k=Z.dataReady,xt=w(b,ut);if(b.isDepthTexture)Ut=x(b.format===ds,b.type),Zt&&(Vt?e.texStorage2D(i.TEXTURE_2D,1,Ut,ut.width,ut.height):e.texImage2D(i.TEXTURE_2D,0,Ut,ut.width,ut.height,0,St,Dt,null));else if(b.isDataTexture)if(Wt.length>0){Vt&&Zt&&e.texStorage2D(i.TEXTURE_2D,xt,Ut,Wt[0].width,Wt[0].height);for(let J=0,at=Wt.length;J<at;J++)_t=Wt[J],Vt?k&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,_t.width,_t.height,St,Dt,_t.data):e.texImage2D(i.TEXTURE_2D,J,Ut,_t.width,_t.height,0,St,Dt,_t.data);b.generateMipmaps=!1}else Vt?(Zt&&e.texStorage2D(i.TEXTURE_2D,xt,Ut,ut.width,ut.height),k&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ut.width,ut.height,St,Dt,ut.data)):e.texImage2D(i.TEXTURE_2D,0,Ut,ut.width,ut.height,0,St,Dt,ut.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Vt&&Zt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,xt,Ut,Wt[0].width,Wt[0].height,ut.depth);for(let J=0,at=Wt.length;J<at;J++)if(_t=Wt[J],b.format!==pn)if(St!==null)if(Vt){if(k)if(b.layerUpdates.size>0){const Tt=Xc(_t.width,_t.height,b.format,b.type);for(const bt of b.layerUpdates){const Ht=_t.data.subarray(bt*Tt/_t.data.BYTES_PER_ELEMENT,(bt+1)*Tt/_t.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,bt,_t.width,_t.height,1,St,Ht)}b.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,_t.width,_t.height,ut.depth,St,_t.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,J,Ut,_t.width,_t.height,ut.depth,0,_t.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Vt?k&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,_t.width,_t.height,ut.depth,St,Dt,_t.data):e.texImage3D(i.TEXTURE_2D_ARRAY,J,Ut,_t.width,_t.height,ut.depth,0,St,Dt,_t.data)}else{Vt&&Zt&&e.texStorage2D(i.TEXTURE_2D,xt,Ut,Wt[0].width,Wt[0].height);for(let J=0,at=Wt.length;J<at;J++)_t=Wt[J],b.format!==pn?St!==null?Vt?k&&e.compressedTexSubImage2D(i.TEXTURE_2D,J,0,0,_t.width,_t.height,St,_t.data):e.compressedTexImage2D(i.TEXTURE_2D,J,Ut,_t.width,_t.height,0,_t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Vt?k&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,_t.width,_t.height,St,Dt,_t.data):e.texImage2D(i.TEXTURE_2D,J,Ut,_t.width,_t.height,0,St,Dt,_t.data)}else if(b.isDataArrayTexture)if(Vt){if(Zt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,xt,Ut,ut.width,ut.height,ut.depth),k)if(b.layerUpdates.size>0){const J=Xc(ut.width,ut.height,b.format,b.type);for(const at of b.layerUpdates){const Tt=ut.data.subarray(at*J/ut.data.BYTES_PER_ELEMENT,(at+1)*J/ut.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,at,ut.width,ut.height,1,St,Dt,Tt)}b.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ut.width,ut.height,ut.depth,St,Dt,ut.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ut,ut.width,ut.height,ut.depth,0,St,Dt,ut.data);else if(b.isData3DTexture)Vt?(Zt&&e.texStorage3D(i.TEXTURE_3D,xt,Ut,ut.width,ut.height,ut.depth),k&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ut.width,ut.height,ut.depth,St,Dt,ut.data)):e.texImage3D(i.TEXTURE_3D,0,Ut,ut.width,ut.height,ut.depth,0,St,Dt,ut.data);else if(b.isFramebufferTexture){if(Zt)if(Vt)e.texStorage2D(i.TEXTURE_2D,xt,Ut,ut.width,ut.height);else{let J=ut.width,at=ut.height;for(let Tt=0;Tt<xt;Tt++)e.texImage2D(i.TEXTURE_2D,Tt,Ut,J,at,0,St,Dt,null),J>>=1,at>>=1}}else if(Wt.length>0){if(Vt&&Zt){const J=Ct(Wt[0]);e.texStorage2D(i.TEXTURE_2D,xt,Ut,J.width,J.height)}for(let J=0,at=Wt.length;J<at;J++)_t=Wt[J],Vt?k&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,St,Dt,_t):e.texImage2D(i.TEXTURE_2D,J,Ut,St,Dt,_t);b.generateMipmaps=!1}else if(Vt){if(Zt){const J=Ct(ut);e.texStorage2D(i.TEXTURE_2D,xt,Ut,J.width,J.height)}k&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,St,Dt,ut)}else e.texImage2D(i.TEXTURE_2D,0,Ut,St,Dt,ut);m(b)&&p(it),vt.__version=Z.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function W(R,b,G){if(b.image.length!==6)return;const it=et(R,b),rt=b.source;e.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+G);const Z=n.get(rt);if(rt.version!==Z.__version||it===!0){e.activeTexture(i.TEXTURE0+G);const vt=Jt.getPrimaries(Jt.workingColorSpace),ft=b.colorSpace===Kn?null:Jt.getPrimaries(b.colorSpace),gt=b.colorSpace===Kn||vt===ft?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,gt);const zt=b.isCompressedTexture||b.image[0].isCompressedTexture,ut=b.image[0]&&b.image[0].isDataTexture,St=[];for(let at=0;at<6;at++)!zt&&!ut?St[at]=_(b.image[at],!0,s.maxCubemapSize):St[at]=ut?b.image[at].image:b.image[at],St[at]=dt(b,St[at]);const Dt=St[0],Ut=r.convert(b.format,b.colorSpace),_t=r.convert(b.type),Wt=M(b.internalFormat,Ut,_t,b.colorSpace),Vt=b.isVideoTexture!==!0,Zt=Z.__version===void 0||it===!0,k=rt.dataReady;let xt=w(b,Dt);ct(i.TEXTURE_CUBE_MAP,b);let J;if(zt){Vt&&Zt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,xt,Wt,Dt.width,Dt.height);for(let at=0;at<6;at++){J=St[at].mipmaps;for(let Tt=0;Tt<J.length;Tt++){const bt=J[Tt];b.format!==pn?Ut!==null?Vt?k&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Tt,0,0,bt.width,bt.height,Ut,bt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Tt,Wt,bt.width,bt.height,0,bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Vt?k&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Tt,0,0,bt.width,bt.height,Ut,_t,bt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Tt,Wt,bt.width,bt.height,0,Ut,_t,bt.data)}}}else{if(J=b.mipmaps,Vt&&Zt){J.length>0&&xt++;const at=Ct(St[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,xt,Wt,at.width,at.height)}for(let at=0;at<6;at++)if(ut){Vt?k&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,St[at].width,St[at].height,Ut,_t,St[at].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Wt,St[at].width,St[at].height,0,Ut,_t,St[at].data);for(let Tt=0;Tt<J.length;Tt++){const Ht=J[Tt].image[at].image;Vt?k&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Tt+1,0,0,Ht.width,Ht.height,Ut,_t,Ht.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Tt+1,Wt,Ht.width,Ht.height,0,Ut,_t,Ht.data)}}else{Vt?k&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Ut,_t,St[at]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Wt,Ut,_t,St[at]);for(let Tt=0;Tt<J.length;Tt++){const bt=J[Tt];Vt?k&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Tt+1,0,0,Ut,_t,bt.image[at]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Tt+1,Wt,Ut,_t,bt.image[at])}}}m(b)&&p(i.TEXTURE_CUBE_MAP),Z.__version=rt.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function $(R,b,G,it,rt,Z){const vt=r.convert(G.format,G.colorSpace),ft=r.convert(G.type),gt=M(G.internalFormat,vt,ft,G.colorSpace),zt=n.get(b),ut=n.get(G);if(ut.__renderTarget=b,!zt.__hasExternalTextures){const St=Math.max(1,b.width>>Z),Dt=Math.max(1,b.height>>Z);rt===i.TEXTURE_3D||rt===i.TEXTURE_2D_ARRAY?e.texImage3D(rt,Z,gt,St,Dt,b.depth,0,vt,ft,null):e.texImage2D(rt,Z,gt,St,Dt,0,vt,ft,null)}e.bindFramebuffer(i.FRAMEBUFFER,R),Lt(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,it,rt,ut.__webglTexture,0,Rt(b)):(rt===i.TEXTURE_2D||rt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&rt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,it,rt,ut.__webglTexture,Z),e.bindFramebuffer(i.FRAMEBUFFER,null)}function K(R,b,G){if(i.bindRenderbuffer(i.RENDERBUFFER,R),b.depthBuffer){const it=b.depthTexture,rt=it&&it.isDepthTexture?it.type:null,Z=x(b.stencilBuffer,rt),vt=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ft=Rt(b);Lt(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ft,Z,b.width,b.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,ft,Z,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,Z,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,vt,i.RENDERBUFFER,R)}else{const it=b.textures;for(let rt=0;rt<it.length;rt++){const Z=it[rt],vt=r.convert(Z.format,Z.colorSpace),ft=r.convert(Z.type),gt=M(Z.internalFormat,vt,ft,Z.colorSpace),zt=Rt(b);G&&Lt(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,zt,gt,b.width,b.height):Lt(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,zt,gt,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,gt,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function lt(R,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,R),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const it=n.get(b.depthTexture);it.__renderTarget=b,(!it.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),B(b.depthTexture,0);const rt=it.__webglTexture,Z=Rt(b);if(b.depthTexture.format===ss)Lt(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,rt,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,rt,0);else if(b.depthTexture.format===ds)Lt(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,rt,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,rt,0);else throw new Error("Unknown depthTexture format")}function st(R){const b=n.get(R),G=R.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==R.depthTexture){const it=R.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),it){const rt=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,it.removeEventListener("dispose",rt)};it.addEventListener("dispose",rt),b.__depthDisposeCallback=rt}b.__boundDepthTexture=it}if(R.depthTexture&&!b.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");lt(b.__webglFramebuffer,R)}else if(G){b.__webglDepthbuffer=[];for(let it=0;it<6;it++)if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[it]),b.__webglDepthbuffer[it]===void 0)b.__webglDepthbuffer[it]=i.createRenderbuffer(),K(b.__webglDepthbuffer[it],R,!1);else{const rt=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=b.__webglDepthbuffer[it];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,rt,i.RENDERBUFFER,Z)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),K(b.__webglDepthbuffer,R,!1);else{const it=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,rt=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,rt),i.framebufferRenderbuffer(i.FRAMEBUFFER,it,i.RENDERBUFFER,rt)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ht(R,b,G){const it=n.get(R);b!==void 0&&$(it.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&st(R)}function At(R){const b=R.texture,G=n.get(R),it=n.get(b);R.addEventListener("dispose",C);const rt=R.textures,Z=R.isWebGLCubeRenderTarget===!0,vt=rt.length>1;if(vt||(it.__webglTexture===void 0&&(it.__webglTexture=i.createTexture()),it.__version=b.version,o.memory.textures++),Z){G.__webglFramebuffer=[];for(let ft=0;ft<6;ft++)if(b.mipmaps&&b.mipmaps.length>0){G.__webglFramebuffer[ft]=[];for(let gt=0;gt<b.mipmaps.length;gt++)G.__webglFramebuffer[ft][gt]=i.createFramebuffer()}else G.__webglFramebuffer[ft]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){G.__webglFramebuffer=[];for(let ft=0;ft<b.mipmaps.length;ft++)G.__webglFramebuffer[ft]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(vt)for(let ft=0,gt=rt.length;ft<gt;ft++){const zt=n.get(rt[ft]);zt.__webglTexture===void 0&&(zt.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&Lt(R)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let ft=0;ft<rt.length;ft++){const gt=rt[ft];G.__webglColorRenderbuffer[ft]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[ft]);const zt=r.convert(gt.format,gt.colorSpace),ut=r.convert(gt.type),St=M(gt.internalFormat,zt,ut,gt.colorSpace,R.isXRRenderTarget===!0),Dt=Rt(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Dt,St,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ft,i.RENDERBUFFER,G.__webglColorRenderbuffer[ft])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),K(G.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){e.bindTexture(i.TEXTURE_CUBE_MAP,it.__webglTexture),ct(i.TEXTURE_CUBE_MAP,b);for(let ft=0;ft<6;ft++)if(b.mipmaps&&b.mipmaps.length>0)for(let gt=0;gt<b.mipmaps.length;gt++)$(G.__webglFramebuffer[ft][gt],R,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,gt);else $(G.__webglFramebuffer[ft],R,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0);m(b)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(vt){for(let ft=0,gt=rt.length;ft<gt;ft++){const zt=rt[ft],ut=n.get(zt);e.bindTexture(i.TEXTURE_2D,ut.__webglTexture),ct(i.TEXTURE_2D,zt),$(G.__webglFramebuffer,R,zt,i.COLOR_ATTACHMENT0+ft,i.TEXTURE_2D,0),m(zt)&&p(i.TEXTURE_2D)}e.unbindTexture()}else{let ft=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ft=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ft,it.__webglTexture),ct(ft,b),b.mipmaps&&b.mipmaps.length>0)for(let gt=0;gt<b.mipmaps.length;gt++)$(G.__webglFramebuffer[gt],R,b,i.COLOR_ATTACHMENT0,ft,gt);else $(G.__webglFramebuffer,R,b,i.COLOR_ATTACHMENT0,ft,0);m(b)&&p(ft),e.unbindTexture()}R.depthBuffer&&st(R)}function wt(R){const b=R.textures;for(let G=0,it=b.length;G<it;G++){const rt=b[G];if(m(rt)){const Z=y(R),vt=n.get(rt).__webglTexture;e.bindTexture(Z,vt),p(Z),e.unbindTexture()}}}const Nt=[],I=[];function Gt(R){if(R.samples>0){if(Lt(R)===!1){const b=R.textures,G=R.width,it=R.height;let rt=i.COLOR_BUFFER_BIT;const Z=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,vt=n.get(R),ft=b.length>1;if(ft)for(let gt=0;gt<b.length;gt++)e.bindFramebuffer(i.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,vt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,vt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,vt.__webglFramebuffer);for(let gt=0;gt<b.length;gt++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(rt|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(rt|=i.STENCIL_BUFFER_BIT)),ft){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,vt.__webglColorRenderbuffer[gt]);const zt=n.get(b[gt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,zt,0)}i.blitFramebuffer(0,0,G,it,0,0,G,it,rt,i.NEAREST),l===!0&&(Nt.length=0,I.length=0,Nt.push(i.COLOR_ATTACHMENT0+gt),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Nt.push(Z),I.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,I)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Nt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ft)for(let gt=0;gt<b.length;gt++){e.bindFramebuffer(i.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.RENDERBUFFER,vt.__webglColorRenderbuffer[gt]);const zt=n.get(b[gt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,vt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.TEXTURE_2D,zt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,vt.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const b=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function Rt(R){return Math.min(s.maxSamples,R.samples)}function Lt(R){const b=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function pt(R){const b=o.render.frame;h.get(R)!==b&&(h.set(R,b),R.update())}function dt(R,b){const G=R.colorSpace,it=R.format,rt=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||G!==fs&&G!==Kn&&(Jt.getTransfer(G)===se?(it!==pn||rt!==kn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),b}function Ct(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=D,this.resetTextureUnits=L,this.setTexture2D=B,this.setTexture2DArray=F,this.setTexture3D=q,this.setTextureCube=V,this.rebindTextures=ht,this.setupRenderTarget=At,this.updateRenderTargetMipmap=wt,this.updateMultisampleRenderTarget=Gt,this.setupDepthRenderbuffer=st,this.setupFrameBufferTexture=$,this.useMultisampledRTT=Lt}function _1(i,t){function e(n,s=Kn){let r;const o=Jt.getTransfer(s);if(n===kn)return i.UNSIGNED_BYTE;if(n===Nl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Fl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Wh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Hh)return i.BYTE;if(n===Gh)return i.SHORT;if(n===Ks)return i.UNSIGNED_SHORT;if(n===Ul)return i.INT;if(n===Si)return i.UNSIGNED_INT;if(n===Nn)return i.FLOAT;if(n===tr)return i.HALF_FLOAT;if(n===Xh)return i.ALPHA;if(n===qh)return i.RGB;if(n===pn)return i.RGBA;if(n===$h)return i.LUMINANCE;if(n===Yh)return i.LUMINANCE_ALPHA;if(n===ss)return i.DEPTH_COMPONENT;if(n===ds)return i.DEPTH_STENCIL;if(n===Kh)return i.RED;if(n===Ol)return i.RED_INTEGER;if(n===jh)return i.RG;if(n===Bl)return i.RG_INTEGER;if(n===zl)return i.RGBA_INTEGER;if(n===jr||n===Zr||n===Jr||n===Qr)if(o===se)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===jr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Zr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Jr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Qr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===jr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Zr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Jr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Qr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ga||n===Wa||n===Xa||n===qa)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ga)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Wa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Xa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===qa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===$a||n===Ya||n===Ka)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===$a||n===Ya)return o===se?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ka)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ja||n===Za||n===Ja||n===Qa||n===tl||n===el||n===nl||n===il||n===sl||n===rl||n===ol||n===al||n===ll||n===cl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ja)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Za)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ja)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Qa)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===tl)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===el)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===nl)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===il)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===sl)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===rl)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ol)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===al)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ll)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===cl)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===to||n===hl||n===ul)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===to)return o===se?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===hl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ul)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Zh||n===dl||n===fl||n===pl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===to)return r.COMPRESSED_RED_RGTC1_EXT;if(n===dl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===fl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===pl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===us?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const v1={type:"move"};class _a{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new yn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new yn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new yn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(v1)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new yn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const x1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,M1=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class y1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Le,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new on({vertexShader:x1,fragmentShader:M1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Ee(new Eo(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class S1 extends ni{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const _=new y1,m=e.getContextAttributes();let p=null,y=null;const M=[],x=[],w=new Pt;let A=null;const C=new tn;C.viewport=new ue;const P=new tn;P.viewport=new ue;const S=[C,P],v=new Pp;let E=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(N){let W=M[N];return W===void 0&&(W=new _a,M[N]=W),W.getTargetRaySpace()},this.getControllerGrip=function(N){let W=M[N];return W===void 0&&(W=new _a,M[N]=W),W.getGripSpace()},this.getHand=function(N){let W=M[N];return W===void 0&&(W=new _a,M[N]=W),W.getHandSpace()};function D(N){const W=x.indexOf(N.inputSource);if(W===-1)return;const $=M[W];$!==void 0&&($.update(N.inputSource,N.frame,c||o),$.dispatchEvent({type:N.type,data:N.inputSource}))}function U(){s.removeEventListener("select",D),s.removeEventListener("selectstart",D),s.removeEventListener("selectend",D),s.removeEventListener("squeeze",D),s.removeEventListener("squeezestart",D),s.removeEventListener("squeezeend",D),s.removeEventListener("end",U),s.removeEventListener("inputsourceschange",B);for(let N=0;N<M.length;N++){const W=x[N];W!==null&&(x[N]=null,M[N].disconnect(W))}E=null,L=null,_.reset(),t.setRenderTarget(p),f=null,d=null,u=null,s=null,y=null,et.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(N){r=N,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(N){a=N,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(N){c=N},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(N){if(s=N,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",D),s.addEventListener("selectstart",D),s.addEventListener("selectend",D),s.addEventListener("squeeze",D),s.addEventListener("squeezestart",D),s.addEventListener("squeezeend",D),s.addEventListener("end",U),s.addEventListener("inputsourceschange",B),m.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(w),s.enabledFeatures!==void 0&&s.enabledFeatures.includes("layers")){let $=null,K=null,lt=null;m.depth&&(lt=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,$=m.stencil?ds:ss,K=m.stencil?us:Si);const st={colorFormat:e.RGBA8,depthFormat:lt,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(st),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new bi(d.textureWidth,d.textureHeight,{format:pn,type:kn,depthTexture:new mu(d.textureWidth,d.textureHeight,K,void 0,void 0,void 0,void 0,void 0,void 0,$),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}else{const $={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,$),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new bi(f.framebufferWidth,f.framebufferHeight,{format:pn,type:kn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),et.setContext(s),et.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function B(N){for(let W=0;W<N.removed.length;W++){const $=N.removed[W],K=x.indexOf($);K>=0&&(x[K]=null,M[K].disconnect($))}for(let W=0;W<N.added.length;W++){const $=N.added[W];let K=x.indexOf($);if(K===-1){for(let st=0;st<M.length;st++)if(st>=x.length){x.push($),K=st;break}else if(x[st]===null){x[st]=$,K=st;break}if(K===-1)break}const lt=M[K];lt&&lt.connect($)}}const F=new O,q=new O;function V(N,W,$){F.setFromMatrixPosition(W.matrixWorld),q.setFromMatrixPosition($.matrixWorld);const K=F.distanceTo(q),lt=W.projectionMatrix.elements,st=$.projectionMatrix.elements,ht=lt[14]/(lt[10]-1),At=lt[14]/(lt[10]+1),wt=(lt[9]+1)/lt[5],Nt=(lt[9]-1)/lt[5],I=(lt[8]-1)/lt[0],Gt=(st[8]+1)/st[0],Rt=ht*I,Lt=ht*Gt,pt=K/(-I+Gt),dt=pt*-I;if(W.matrixWorld.decompose(N.position,N.quaternion,N.scale),N.translateX(dt),N.translateZ(pt),N.matrixWorld.compose(N.position,N.quaternion,N.scale),N.matrixWorldInverse.copy(N.matrixWorld).invert(),lt[10]===-1)N.projectionMatrix.copy(W.projectionMatrix),N.projectionMatrixInverse.copy(W.projectionMatrixInverse);else{const Ct=ht+pt,R=At+pt,b=Rt-dt,G=Lt+(K-dt),it=wt*At/R*Ct,rt=Nt*At/R*Ct;N.projectionMatrix.makePerspective(b,G,it,rt,Ct,R),N.projectionMatrixInverse.copy(N.projectionMatrix).invert()}}function tt(N,W){W===null?N.matrixWorld.copy(N.matrix):N.matrixWorld.multiplyMatrices(W.matrixWorld,N.matrix),N.matrixWorldInverse.copy(N.matrixWorld).invert()}this.updateCamera=function(N){if(s===null)return;let W=N.near,$=N.far;_.texture!==null&&(_.depthNear>0&&(W=_.depthNear),_.depthFar>0&&($=_.depthFar)),v.near=P.near=C.near=W,v.far=P.far=C.far=$,(E!==v.near||L!==v.far)&&(s.updateRenderState({depthNear:v.near,depthFar:v.far}),E=v.near,L=v.far),C.layers.mask=N.layers.mask|2,P.layers.mask=N.layers.mask|4,v.layers.mask=C.layers.mask|P.layers.mask;const K=N.parent,lt=v.cameras;tt(v,K);for(let st=0;st<lt.length;st++)tt(lt[st],K);lt.length===2?V(v,C,P):v.projectionMatrix.copy(C.projectionMatrix),X(N,v,K)};function X(N,W,$){$===null?N.matrix.copy(W.matrixWorld):(N.matrix.copy($.matrixWorld),N.matrix.invert(),N.matrix.multiply(W.matrixWorld)),N.matrix.decompose(N.position,N.quaternion,N.scale),N.updateMatrixWorld(!0),N.projectionMatrix.copy(W.projectionMatrix),N.projectionMatrixInverse.copy(W.projectionMatrixInverse),N.isPerspectiveCamera&&(N.fov=_l*2*Math.atan(1/N.projectionMatrix.elements[5]),N.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(N){l=N,d!==null&&(d.fixedFoveation=N),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=N)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(v)};let nt=null;function ct(N,W){if(h=W.getViewerPose(c||o),g=W,h!==null){const $=h.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let K=!1;$.length!==v.cameras.length&&(v.cameras.length=0,K=!0);for(let st=0;st<$.length;st++){const ht=$[st];let At=null;if(f!==null)At=f.getViewport(ht);else{const Nt=u.getViewSubImage(d,ht);At=Nt.viewport,st===0&&(t.setRenderTargetTextures(y,Nt.colorTexture,d.ignoreDepthValues?void 0:Nt.depthStencilTexture),t.setRenderTarget(y))}let wt=S[st];wt===void 0&&(wt=new tn,wt.layers.enable(st),wt.viewport=new ue,S[st]=wt),wt.matrix.fromArray(ht.transform.matrix),wt.matrix.decompose(wt.position,wt.quaternion,wt.scale),wt.projectionMatrix.fromArray(ht.projectionMatrix),wt.projectionMatrixInverse.copy(wt.projectionMatrix).invert(),wt.viewport.set(At.x,At.y,At.width,At.height),st===0&&(v.matrix.copy(wt.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),K===!0&&v.cameras.push(wt)}const lt=s.enabledFeatures;if(lt&&lt.includes("depth-sensing")){const st=u.getDepthInformation($[0]);st&&st.isValid&&st.texture&&_.init(t,st,s.renderState)}}for(let $=0;$<M.length;$++){const K=x[$],lt=M[$];K!==null&&lt!==void 0&&lt.update(K,W,c||o)}nt&&nt(N,W),W.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:W}),g=null}const et=new Au;et.setAnimationLoop(ct),this.setAnimationLoop=function(N){nt=N},this.dispose=function(){}}}const hi=new En,b1=new ae;function E1(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,au(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,y,M,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,x)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,y,M):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===He&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===He&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const y=t.get(p),M=y.envMap,x=y.envMapRotation;M&&(m.envMap.value=M,hi.copy(x),hi.x*=-1,hi.y*=-1,hi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),m.envMapRotation.value.setFromMatrix4(b1.makeRotationFromEuler(hi)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,y,M){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*y,m.scale.value=M*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,y){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===He&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const y=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function A1(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,M){const x=M.program;n.uniformBlockBinding(y,x)}function c(y,M){let x=s[y.id];x===void 0&&(g(y),x=h(y),s[y.id]=x,y.addEventListener("dispose",m));const w=M.program;n.updateUBOMapping(y,w);const A=t.render.frame;r[y.id]!==A&&(d(y),r[y.id]=A)}function h(y){const M=u();y.__bindingPointIndex=M;const x=i.createBuffer(),w=y.__size,A=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,w,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,x),x}function u(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const M=s[y.id],x=y.uniforms,w=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let A=0,C=x.length;A<C;A++){const P=Array.isArray(x[A])?x[A]:[x[A]];for(let S=0,v=P.length;S<v;S++){const E=P[S];if(f(E,A,S,w)===!0){const L=E.__offset,D=Array.isArray(E.value)?E.value:[E.value];let U=0;for(let B=0;B<D.length;B++){const F=D[B],q=_(F);typeof F=="number"||typeof F=="boolean"?(E.__data[0]=F,i.bufferSubData(i.UNIFORM_BUFFER,L+U,E.__data)):F.isMatrix3?(E.__data[0]=F.elements[0],E.__data[1]=F.elements[1],E.__data[2]=F.elements[2],E.__data[3]=0,E.__data[4]=F.elements[3],E.__data[5]=F.elements[4],E.__data[6]=F.elements[5],E.__data[7]=0,E.__data[8]=F.elements[6],E.__data[9]=F.elements[7],E.__data[10]=F.elements[8],E.__data[11]=0):(F.toArray(E.__data,U),U+=q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,L,E.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(y,M,x,w){const A=y.value,C=M+"_"+x;if(w[C]===void 0)return typeof A=="number"||typeof A=="boolean"?w[C]=A:w[C]=A.clone(),!0;{const P=w[C];if(typeof A=="number"||typeof A=="boolean"){if(P!==A)return w[C]=A,!0}else if(P.equals(A)===!1)return P.copy(A),!0}return!1}function g(y){const M=y.uniforms;let x=0;const w=16;for(let C=0,P=M.length;C<P;C++){const S=Array.isArray(M[C])?M[C]:[M[C]];for(let v=0,E=S.length;v<E;v++){const L=S[v],D=Array.isArray(L.value)?L.value:[L.value];for(let U=0,B=D.length;U<B;U++){const F=D[U],q=_(F),V=x%w,tt=V%q.boundary,X=V+tt;x+=tt,X!==0&&w-X<q.storage&&(x+=w-X),L.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=x,x+=q.storage}}}const A=x%w;return A>0&&(x+=w-A),y.__size=x,y.__cache={},this}function _(y){const M={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(M.boundary=4,M.storage=4):y.isVector2?(M.boundary=8,M.storage=8):y.isVector3||y.isColor?(M.boundary=16,M.storage=12):y.isVector4?(M.boundary=16,M.storage=16):y.isMatrix3?(M.boundary=48,M.storage=48):y.isMatrix4?(M.boundary=64,M.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),M}function m(y){const M=y.target;M.removeEventListener("dispose",m);const x=o.indexOf(M.__bindingPointIndex);o.splice(x,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function p(){for(const y in s)i.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}class T1{constructor(t={}){const{canvas:e=Mf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const y=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Qe,this.toneMapping=Qn,this.toneMappingExposure=1;const x=this;let w=!1,A=0,C=0,P=null,S=-1,v=null;const E=new ue,L=new ue;let D=null;const U=new Ot(0);let B=0,F=e.width,q=e.height,V=1,tt=null,X=null;const nt=new ue(0,0,F,q),ct=new ue(0,0,F,q);let et=!1;const N=new Gl;let W=!1,$=!1;this.transmissionResolutionScale=1;const K=new ae,lt=new ae,st=new O,ht=new ue,At={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let wt=!1;function Nt(){return P===null?V:1}let I=n;function Gt(T,H){return e.getContext(T,H)}try{const T={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Il}`),e.addEventListener("webglcontextlost",at,!1),e.addEventListener("webglcontextrestored",Tt,!1),e.addEventListener("webglcontextcreationerror",bt,!1),I===null){const H="webgl2";if(I=Gt(H,T),I===null)throw Gt(H)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Rt,Lt,pt,dt,Ct,R,b,G,it,rt,Z,vt,ft,gt,zt,ut,St,Dt,Ut,_t,Wt,Vt,Zt,k;function xt(){Rt=new Ng(I),Rt.init(),Vt=new _1(I,Rt),Lt=new Rg(I,Rt,t,Vt),pt=new m1(I,Rt),Lt.reverseDepthBuffer&&d&&pt.buffers.depth.setReversed(!0),dt=new Bg(I),Ct=new n1,R=new g1(I,Rt,pt,Ct,Lt,Vt,dt),b=new Lg(x),G=new Ug(x),it=new Xp(I),Zt=new wg(I,it),rt=new Fg(I,it,dt,Zt),Z=new kg(I,rt,it,dt),Ut=new zg(I,Lt,R),ut=new Pg(Ct),vt=new e1(x,b,G,Rt,Lt,Zt,ut),ft=new E1(x,Ct),gt=new s1,zt=new h1(Rt),Dt=new Tg(x,b,G,pt,Z,f,l),St=new f1(x,Z,Lt),k=new A1(I,dt,Lt,pt),_t=new Cg(I,Rt,dt),Wt=new Og(I,Rt,dt),dt.programs=vt.programs,x.capabilities=Lt,x.extensions=Rt,x.properties=Ct,x.renderLists=gt,x.shadowMap=St,x.state=pt,x.info=dt}xt();const J=new S1(x,I);this.xr=J,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const T=Rt.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Rt.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(T){T!==void 0&&(V=T,this.setSize(F,q,!1))},this.getSize=function(T){return T.set(F,q)},this.setSize=function(T,H,Y=!0){if(J.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=T,q=H,e.width=Math.floor(T*V),e.height=Math.floor(H*V),Y===!0&&(e.style.width=T+"px",e.style.height=H+"px"),this.setViewport(0,0,T,H)},this.getDrawingBufferSize=function(T){return T.set(F*V,q*V).floor()},this.setDrawingBufferSize=function(T,H,Y){F=T,q=H,V=Y,e.width=Math.floor(T*Y),e.height=Math.floor(H*Y),this.setViewport(0,0,T,H)},this.getCurrentViewport=function(T){return T.copy(E)},this.getViewport=function(T){return T.copy(nt)},this.setViewport=function(T,H,Y,j){T.isVector4?nt.set(T.x,T.y,T.z,T.w):nt.set(T,H,Y,j),pt.viewport(E.copy(nt).multiplyScalar(V).round())},this.getScissor=function(T){return T.copy(ct)},this.setScissor=function(T,H,Y,j){T.isVector4?ct.set(T.x,T.y,T.z,T.w):ct.set(T,H,Y,j),pt.scissor(L.copy(ct).multiplyScalar(V).round())},this.getScissorTest=function(){return et},this.setScissorTest=function(T){pt.setScissorTest(et=T)},this.setOpaqueSort=function(T){tt=T},this.setTransparentSort=function(T){X=T},this.getClearColor=function(T){return T.copy(Dt.getClearColor())},this.setClearColor=function(){Dt.setClearColor.apply(Dt,arguments)},this.getClearAlpha=function(){return Dt.getClearAlpha()},this.setClearAlpha=function(){Dt.setClearAlpha.apply(Dt,arguments)},this.clear=function(T=!0,H=!0,Y=!0){let j=0;if(T){let z=!1;if(P!==null){const ot=P.texture.format;z=ot===zl||ot===Bl||ot===Ol}if(z){const ot=P.texture.type,mt=ot===kn||ot===Si||ot===Ks||ot===us||ot===Nl||ot===Fl,Et=Dt.getClearColor(),Mt=Dt.getClearAlpha(),Ft=Et.r,kt=Et.g,It=Et.b;mt?(g[0]=Ft,g[1]=kt,g[2]=It,g[3]=Mt,I.clearBufferuiv(I.COLOR,0,g)):(_[0]=Ft,_[1]=kt,_[2]=It,_[3]=Mt,I.clearBufferiv(I.COLOR,0,_))}else j|=I.COLOR_BUFFER_BIT}H&&(j|=I.DEPTH_BUFFER_BIT),Y&&(j|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",at,!1),e.removeEventListener("webglcontextrestored",Tt,!1),e.removeEventListener("webglcontextcreationerror",bt,!1),Dt.dispose(),gt.dispose(),zt.dispose(),Ct.dispose(),b.dispose(),G.dispose(),Z.dispose(),Zt.dispose(),k.dispose(),vt.dispose(),J.dispose(),J.removeEventListener("sessionstart",sr),J.removeEventListener("sessionend",rr),Tn.stop()};function at(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Tt(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const T=dt.autoReset,H=St.enabled,Y=St.autoUpdate,j=St.needsUpdate,z=St.type;xt(),dt.autoReset=T,St.enabled=H,St.autoUpdate=Y,St.needsUpdate=j,St.type=z}function bt(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Ht(T){const H=T.target;H.removeEventListener("dispose",Ht),le(H)}function le(T){ye(T),Ct.remove(T)}function ye(T){const H=Ct.get(T).programs;H!==void 0&&(H.forEach(function(Y){vt.releaseProgram(Y)}),T.isShaderMaterial&&vt.releaseShaderCache(T))}this.renderBufferDirect=function(T,H,Y,j,z,ot){H===null&&(H=At);const mt=z.isMesh&&z.matrixWorld.determinant()<0,Et=Uo(T,H,Y,j,z);pt.setMaterial(j,mt);let Mt=Y.index,Ft=1;if(j.wireframe===!0){if(Mt=rt.getWireframeAttribute(Y),Mt===void 0)return;Ft=2}const kt=Y.drawRange,It=Y.attributes.position;let Xt=kt.start*Ft,qt=(kt.start+kt.count)*Ft;ot!==null&&(Xt=Math.max(Xt,ot.start*Ft),qt=Math.min(qt,(ot.start+ot.count)*Ft)),Mt!==null?(Xt=Math.max(Xt,0),qt=Math.min(qt,Mt.count)):It!=null&&(Xt=Math.max(Xt,0),qt=Math.min(qt,It.count));const ee=qt-Xt;if(ee<0||ee===1/0)return;Zt.setup(z,j,Et,Y,Mt);let ie,$t=_t;if(Mt!==null&&(ie=it.get(Mt),$t=Wt,$t.setIndex(ie)),z.isMesh)j.wireframe===!0?(pt.setLineWidth(j.wireframeLinewidth*Nt()),$t.setMode(I.LINES)):$t.setMode(I.TRIANGLES);else if(z.isLine){let Bt=j.linewidth;Bt===void 0&&(Bt=1),pt.setLineWidth(Bt*Nt()),z.isLineSegments?$t.setMode(I.LINES):z.isLineLoop?$t.setMode(I.LINE_LOOP):$t.setMode(I.LINE_STRIP)}else z.isPoints?$t.setMode(I.POINTS):z.isSprite&&$t.setMode(I.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)$t.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(Rt.get("WEBGL_multi_draw"))$t.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Bt=z._multiDrawStarts,Te=z._multiDrawCounts,te=z._multiDrawCount,ln=Mt?it.get(Mt).bytesPerElement:1,Ci=Ct.get(j).currentProgram.getUniforms();for(let We=0;We<te;We++)Ci.setValue(I,"_gl_DrawID",We),$t.render(Bt[We]/ln,Te[We])}else if(z.isInstancedMesh)$t.renderInstances(Xt,ee,z.count);else if(Y.isInstancedBufferGeometry){const Bt=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Te=Math.min(Y.instanceCount,Bt);$t.renderInstances(Xt,ee,Te)}else $t.render(Xt,ee)};function Qt(T,H,Y){T.transparent===!0&&T.side===en&&T.forceSinglePass===!1?(T.side=He,T.needsUpdate=!0,wi(T,H,Y),T.side=zn,T.needsUpdate=!0,wi(T,H,Y),T.side=en):wi(T,H,Y)}this.compile=function(T,H,Y=null){Y===null&&(Y=T),p=zt.get(Y),p.init(H),M.push(p),Y.traverseVisible(function(z){z.isLight&&z.layers.test(H.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),T!==Y&&T.traverseVisible(function(z){z.isLight&&z.layers.test(H.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),p.setupLights();const j=new Set;return T.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const ot=z.material;if(ot)if(Array.isArray(ot))for(let mt=0;mt<ot.length;mt++){const Et=ot[mt];Qt(Et,Y,z),j.add(Et)}else Qt(ot,Y,z),j.add(ot)}),M.pop(),p=null,j},this.compileAsync=function(T,H,Y=null){const j=this.compile(T,H,Y);return new Promise(z=>{function ot(){if(j.forEach(function(mt){Ct.get(mt).currentProgram.isReady()&&j.delete(mt)}),j.size===0){z(T);return}setTimeout(ot,10)}Rt.get("KHR_parallel_shader_compile")!==null?ot():setTimeout(ot,10)})};let Ge=null;function an(T){Ge&&Ge(T)}function sr(){Tn.stop()}function rr(){Tn.start()}const Tn=new Au;Tn.setAnimationLoop(an),typeof self<"u"&&Tn.setContext(self),this.setAnimationLoop=function(T){Ge=T,J.setAnimationLoop(T),T===null?Tn.stop():Tn.start()},J.addEventListener("sessionstart",sr),J.addEventListener("sessionend",rr),this.render=function(T,H){if(H!==void 0&&H.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),J.enabled===!0&&J.isPresenting===!0&&(J.cameraAutoUpdate===!0&&J.updateCamera(H),H=J.getCamera()),T.isScene===!0&&T.onBeforeRender(x,T,H,P),p=zt.get(T,M.length),p.init(H),M.push(p),lt.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),N.setFromProjectionMatrix(lt),$=this.localClippingEnabled,W=ut.init(this.clippingPlanes,$),m=gt.get(T,y.length),m.init(),y.push(m),J.enabled===!0&&J.isPresenting===!0){const ot=x.xr.getDepthSensingMesh();ot!==null&&Ss(ot,H,-1/0,x.sortObjects)}Ss(T,H,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(tt,X),wt=J.enabled===!1||J.isPresenting===!1||J.hasDepthSensing()===!1,wt&&Dt.addToRenderList(m,T),this.info.render.frame++,W===!0&&ut.beginShadows();const Y=p.state.shadowsArray;St.render(Y,T,H),W===!0&&ut.endShadows(),this.info.autoReset===!0&&this.info.reset();const j=m.opaque,z=m.transmissive;if(p.setupLights(),H.isArrayCamera){const ot=H.cameras;if(z.length>0)for(let mt=0,Et=ot.length;mt<Et;mt++){const Mt=ot[mt];ar(j,z,T,Mt)}wt&&Dt.render(T);for(let mt=0,Et=ot.length;mt<Et;mt++){const Mt=ot[mt];or(m,T,Mt,Mt.viewport)}}else z.length>0&&ar(j,z,T,H),wt&&Dt.render(T),or(m,T,H);P!==null&&C===0&&(R.updateMultisampleRenderTarget(P),R.updateRenderTargetMipmap(P)),T.isScene===!0&&T.onAfterRender(x,T,H),Zt.resetDefaultState(),S=-1,v=null,M.pop(),M.length>0?(p=M[M.length-1],W===!0&&ut.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,y.pop(),y.length>0?m=y[y.length-1]:m=null};function Ss(T,H,Y,j){if(T.visible===!1)return;if(T.layers.test(H.layers)){if(T.isGroup)Y=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(H);else if(T.isLight)p.pushLight(T),T.castShadow&&p.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||N.intersectsSprite(T)){j&&ht.setFromMatrixPosition(T.matrixWorld).applyMatrix4(lt);const mt=Z.update(T),Et=T.material;Et.visible&&m.push(T,mt,Et,Y,ht.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||N.intersectsObject(T))){const mt=Z.update(T),Et=T.material;if(j&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),ht.copy(T.boundingSphere.center)):(mt.boundingSphere===null&&mt.computeBoundingSphere(),ht.copy(mt.boundingSphere.center)),ht.applyMatrix4(T.matrixWorld).applyMatrix4(lt)),Array.isArray(Et)){const Mt=mt.groups;for(let Ft=0,kt=Mt.length;Ft<kt;Ft++){const It=Mt[Ft],Xt=Et[It.materialIndex];Xt&&Xt.visible&&m.push(T,mt,Xt,Y,ht.z,It)}}else Et.visible&&m.push(T,mt,Et,Y,ht.z,null)}}const ot=T.children;for(let mt=0,Et=ot.length;mt<Et;mt++)Ss(ot[mt],H,Y,j)}function or(T,H,Y,j){const z=T.opaque,ot=T.transmissive,mt=T.transparent;p.setupLightsView(Y),W===!0&&ut.setGlobalState(x.clippingPlanes,Y),j&&pt.viewport(E.copy(j)),z.length>0&&Ti(z,H,Y),ot.length>0&&Ti(ot,H,Y),mt.length>0&&Ti(mt,H,Y),pt.buffers.depth.setTest(!0),pt.buffers.depth.setMask(!0),pt.buffers.color.setMask(!0),pt.setPolygonOffset(!1)}function ar(T,H,Y,j){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[j.id]===void 0&&(p.state.transmissionRenderTarget[j.id]=new bi(1,1,{generateMipmaps:!0,type:Rt.has("EXT_color_buffer_half_float")||Rt.has("EXT_color_buffer_float")?tr:kn,minFilter:Mi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Jt.workingColorSpace}));const ot=p.state.transmissionRenderTarget[j.id],mt=j.viewport||E;ot.setSize(mt.z*x.transmissionResolutionScale,mt.w*x.transmissionResolutionScale);const Et=x.getRenderTarget();x.setRenderTarget(ot),x.getClearColor(U),B=x.getClearAlpha(),B<1&&x.setClearColor(16777215,.5),x.clear(),wt&&Dt.render(Y);const Mt=x.toneMapping;x.toneMapping=Qn;const Ft=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),p.setupLightsView(j),W===!0&&ut.setGlobalState(x.clippingPlanes,j),Ti(T,Y,j),R.updateMultisampleRenderTarget(ot),R.updateRenderTargetMipmap(ot),Rt.has("WEBGL_multisampled_render_to_texture")===!1){let kt=!1;for(let It=0,Xt=H.length;It<Xt;It++){const qt=H[It],ee=qt.object,ie=qt.geometry,$t=qt.material,Bt=qt.group;if($t.side===en&&ee.layers.test(j.layers)){const Te=$t.side;$t.side=He,$t.needsUpdate=!0,lr(ee,Y,j,ie,$t,Bt),$t.side=Te,$t.needsUpdate=!0,kt=!0}}kt===!0&&(R.updateMultisampleRenderTarget(ot),R.updateRenderTargetMipmap(ot))}x.setRenderTarget(Et),x.setClearColor(U,B),Ft!==void 0&&(j.viewport=Ft),x.toneMapping=Mt}function Ti(T,H,Y){const j=H.isScene===!0?H.overrideMaterial:null;for(let z=0,ot=T.length;z<ot;z++){const mt=T[z],Et=mt.object,Mt=mt.geometry,Ft=j===null?mt.material:j,kt=mt.group;Et.layers.test(Y.layers)&&lr(Et,H,Y,Mt,Ft,kt)}}function lr(T,H,Y,j,z,ot){T.onBeforeRender(x,H,Y,j,z,ot),T.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),z.onBeforeRender(x,H,Y,j,T,ot),z.transparent===!0&&z.side===en&&z.forceSinglePass===!1?(z.side=He,z.needsUpdate=!0,x.renderBufferDirect(Y,H,j,z,T,ot),z.side=zn,z.needsUpdate=!0,x.renderBufferDirect(Y,H,j,z,T,ot),z.side=en):x.renderBufferDirect(Y,H,j,z,T,ot),T.onAfterRender(x,H,Y,j,z,ot)}function wi(T,H,Y){H.isScene!==!0&&(H=At);const j=Ct.get(T),z=p.state.lights,ot=p.state.shadowsArray,mt=z.state.version,Et=vt.getParameters(T,z.state,ot,H,Y),Mt=vt.getProgramCacheKey(Et);let Ft=j.programs;j.environment=T.isMeshStandardMaterial?H.environment:null,j.fog=H.fog,j.envMap=(T.isMeshStandardMaterial?G:b).get(T.envMap||j.environment),j.envMapRotation=j.environment!==null&&T.envMap===null?H.environmentRotation:T.envMapRotation,Ft===void 0&&(T.addEventListener("dispose",Ht),Ft=new Map,j.programs=Ft);let kt=Ft.get(Mt);if(kt!==void 0){if(j.currentProgram===kt&&j.lightsStateVersion===mt)return hr(T,Et),kt}else Et.uniforms=vt.getUniforms(T),T.onBeforeCompile(Et,x),kt=vt.acquireProgram(Et,Mt),Ft.set(Mt,kt),j.uniforms=Et.uniforms;const It=j.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(It.clippingPlanes=ut.uniform),hr(T,Et),j.needsLights=Es(T),j.lightsStateVersion=mt,j.needsLights&&(It.ambientLightColor.value=z.state.ambient,It.lightProbe.value=z.state.probe,It.directionalLights.value=z.state.directional,It.directionalLightShadows.value=z.state.directionalShadow,It.spotLights.value=z.state.spot,It.spotLightShadows.value=z.state.spotShadow,It.rectAreaLights.value=z.state.rectArea,It.ltc_1.value=z.state.rectAreaLTC1,It.ltc_2.value=z.state.rectAreaLTC2,It.pointLights.value=z.state.point,It.pointLightShadows.value=z.state.pointShadow,It.hemisphereLights.value=z.state.hemi,It.directionalShadowMap.value=z.state.directionalShadowMap,It.directionalShadowMatrix.value=z.state.directionalShadowMatrix,It.spotShadowMap.value=z.state.spotShadowMap,It.spotLightMatrix.value=z.state.spotLightMatrix,It.spotLightMap.value=z.state.spotLightMap,It.pointShadowMap.value=z.state.pointShadowMap,It.pointShadowMatrix.value=z.state.pointShadowMatrix),j.currentProgram=kt,j.uniformsList=null,kt}function cr(T){if(T.uniformsList===null){const H=T.currentProgram.getUniforms();T.uniformsList=no.seqWithValue(H.seq,T.uniforms)}return T.uniformsList}function hr(T,H){const Y=Ct.get(T);Y.outputColorSpace=H.outputColorSpace,Y.batching=H.batching,Y.batchingColor=H.batchingColor,Y.instancing=H.instancing,Y.instancingColor=H.instancingColor,Y.instancingMorph=H.instancingMorph,Y.skinning=H.skinning,Y.morphTargets=H.morphTargets,Y.morphNormals=H.morphNormals,Y.morphColors=H.morphColors,Y.morphTargetsCount=H.morphTargetsCount,Y.numClippingPlanes=H.numClippingPlanes,Y.numIntersection=H.numClipIntersection,Y.vertexAlphas=H.vertexAlphas,Y.vertexTangents=H.vertexTangents,Y.toneMapping=H.toneMapping}function Uo(T,H,Y,j,z){H.isScene!==!0&&(H=At),R.resetTextureUnits();const ot=H.fog,mt=j.isMeshStandardMaterial?H.environment:null,Et=P===null?x.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:fs,Mt=(j.isMeshStandardMaterial?G:b).get(j.envMap||mt),Ft=j.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,kt=!!Y.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),It=!!Y.morphAttributes.position,Xt=!!Y.morphAttributes.normal,qt=!!Y.morphAttributes.color;let ee=Qn;j.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(ee=x.toneMapping);const ie=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,$t=ie!==void 0?ie.length:0,Bt=Ct.get(j),Te=p.state.lights;if(W===!0&&($===!0||T!==v)){const Ie=T===v&&j.id===S;ut.setState(j,T,Ie)}let te=!1;j.version===Bt.__version?(Bt.needsLights&&Bt.lightsStateVersion!==Te.state.version||Bt.outputColorSpace!==Et||z.isBatchedMesh&&Bt.batching===!1||!z.isBatchedMesh&&Bt.batching===!0||z.isBatchedMesh&&Bt.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Bt.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Bt.instancing===!1||!z.isInstancedMesh&&Bt.instancing===!0||z.isSkinnedMesh&&Bt.skinning===!1||!z.isSkinnedMesh&&Bt.skinning===!0||z.isInstancedMesh&&Bt.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Bt.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Bt.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Bt.instancingMorph===!1&&z.morphTexture!==null||Bt.envMap!==Mt||j.fog===!0&&Bt.fog!==ot||Bt.numClippingPlanes!==void 0&&(Bt.numClippingPlanes!==ut.numPlanes||Bt.numIntersection!==ut.numIntersection)||Bt.vertexAlphas!==Ft||Bt.vertexTangents!==kt||Bt.morphTargets!==It||Bt.morphNormals!==Xt||Bt.morphColors!==qt||Bt.toneMapping!==ee||Bt.morphTargetsCount!==$t)&&(te=!0):(te=!0,Bt.__version=j.version);let ln=Bt.currentProgram;te===!0&&(ln=wi(j,H,z));let Ci=!1,We=!1,Cs=!1;const ce=ln.getUniforms(),$e=Bt.uniforms;if(pt.useProgram(ln.program)&&(Ci=!0,We=!0,Cs=!0),j.id!==S&&(S=j.id,We=!0),Ci||v!==T){pt.buffers.depth.getReversed()?(K.copy(T.projectionMatrix),Sf(K),bf(K),ce.setValue(I,"projectionMatrix",K)):ce.setValue(I,"projectionMatrix",T.projectionMatrix),ce.setValue(I,"viewMatrix",T.matrixWorldInverse);const Be=ce.map.cameraPosition;Be!==void 0&&Be.setValue(I,st.setFromMatrixPosition(T.matrixWorld)),Lt.logarithmicDepthBuffer&&ce.setValue(I,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&ce.setValue(I,"isOrthographic",T.isOrthographicCamera===!0),v!==T&&(v=T,We=!0,Cs=!0)}if(z.isSkinnedMesh){ce.setOptional(I,z,"bindMatrix"),ce.setOptional(I,z,"bindMatrixInverse");const Ie=z.skeleton;Ie&&(Ie.boneTexture===null&&Ie.computeBoneTexture(),ce.setValue(I,"boneTexture",Ie.boneTexture,R))}z.isBatchedMesh&&(ce.setOptional(I,z,"batchingTexture"),ce.setValue(I,"batchingTexture",z._matricesTexture,R),ce.setOptional(I,z,"batchingIdTexture"),ce.setValue(I,"batchingIdTexture",z._indirectTexture,R),ce.setOptional(I,z,"batchingColorTexture"),z._colorsTexture!==null&&ce.setValue(I,"batchingColorTexture",z._colorsTexture,R));const Ye=Y.morphAttributes;if((Ye.position!==void 0||Ye.normal!==void 0||Ye.color!==void 0)&&Ut.update(z,Y,ln),(We||Bt.receiveShadow!==z.receiveShadow)&&(Bt.receiveShadow=z.receiveShadow,ce.setValue(I,"receiveShadow",z.receiveShadow)),j.isMeshGouraudMaterial&&j.envMap!==null&&($e.envMap.value=Mt,$e.flipEnvMap.value=Mt.isCubeTexture&&Mt.isRenderTargetTexture===!1?-1:1),j.isMeshStandardMaterial&&j.envMap===null&&H.environment!==null&&($e.envMapIntensity.value=H.environmentIntensity),We&&(ce.setValue(I,"toneMappingExposure",x.toneMappingExposure),Bt.needsLights&&bs($e,Cs),ot&&j.fog===!0&&ft.refreshFogUniforms($e,ot),ft.refreshMaterialUniforms($e,j,V,q,p.state.transmissionRenderTarget[T.id]),no.upload(I,cr(Bt),$e,R)),j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(no.upload(I,cr(Bt),$e,R),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&ce.setValue(I,"center",z.center),ce.setValue(I,"modelViewMatrix",z.modelViewMatrix),ce.setValue(I,"normalMatrix",z.normalMatrix),ce.setValue(I,"modelMatrix",z.matrixWorld),j.isShaderMaterial||j.isRawShaderMaterial){const Ie=j.uniformsGroups;for(let Be=0,No=Ie.length;Be<No;Be++){const si=Ie[Be];k.update(si,ln),k.bind(si,ln)}}return ln}function bs(T,H){T.ambientLightColor.needsUpdate=H,T.lightProbe.needsUpdate=H,T.directionalLights.needsUpdate=H,T.directionalLightShadows.needsUpdate=H,T.pointLights.needsUpdate=H,T.pointLightShadows.needsUpdate=H,T.spotLights.needsUpdate=H,T.spotLightShadows.needsUpdate=H,T.rectAreaLights.needsUpdate=H,T.hemisphereLights.needsUpdate=H}function Es(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(T,H,Y){Ct.get(T.texture).__webglTexture=H,Ct.get(T.depthTexture).__webglTexture=Y;const j=Ct.get(T);j.__hasExternalTextures=!0,j.__autoAllocateDepthBuffer=Y===void 0,j.__autoAllocateDepthBuffer||Rt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),j.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,H){const Y=Ct.get(T);Y.__webglFramebuffer=H,Y.__useDefaultFramebuffer=H===void 0};const As=I.createFramebuffer();this.setRenderTarget=function(T,H=0,Y=0){P=T,A=H,C=Y;let j=!0,z=null,ot=!1,mt=!1;if(T){const Mt=Ct.get(T);if(Mt.__useDefaultFramebuffer!==void 0)pt.bindFramebuffer(I.FRAMEBUFFER,null),j=!1;else if(Mt.__webglFramebuffer===void 0)R.setupRenderTarget(T);else if(Mt.__hasExternalTextures)R.rebindTextures(T,Ct.get(T.texture).__webglTexture,Ct.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const It=T.depthTexture;if(Mt.__boundDepthTexture!==It){if(It!==null&&Ct.has(It)&&(T.width!==It.image.width||T.height!==It.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(T)}}const Ft=T.texture;(Ft.isData3DTexture||Ft.isDataArrayTexture||Ft.isCompressedArrayTexture)&&(mt=!0);const kt=Ct.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(kt[H])?z=kt[H][Y]:z=kt[H],ot=!0):T.samples>0&&R.useMultisampledRTT(T)===!1?z=Ct.get(T).__webglMultisampledFramebuffer:Array.isArray(kt)?z=kt[Y]:z=kt,E.copy(T.viewport),L.copy(T.scissor),D=T.scissorTest}else E.copy(nt).multiplyScalar(V).floor(),L.copy(ct).multiplyScalar(V).floor(),D=et;if(Y!==0&&(z=As),pt.bindFramebuffer(I.FRAMEBUFFER,z)&&j&&pt.drawBuffers(T,z),pt.viewport(E),pt.scissor(L),pt.setScissorTest(D),ot){const Mt=Ct.get(T.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+H,Mt.__webglTexture,Y)}else if(mt){const Mt=Ct.get(T.texture),Ft=H;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,Mt.__webglTexture,Y,Ft)}else if(T!==null&&Y!==0){const Mt=Ct.get(T.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Mt.__webglTexture,Y)}S=-1},this.readRenderTargetPixels=function(T,H,Y,j,z,ot,mt){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Et=Ct.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&mt!==void 0&&(Et=Et[mt]),Et){pt.bindFramebuffer(I.FRAMEBUFFER,Et);try{const Mt=T.texture,Ft=Mt.format,kt=Mt.type;if(!Lt.textureFormatReadable(Ft)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Lt.textureTypeReadable(kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=T.width-j&&Y>=0&&Y<=T.height-z&&I.readPixels(H,Y,j,z,Vt.convert(Ft),Vt.convert(kt),ot)}finally{const Mt=P!==null?Ct.get(P).__webglFramebuffer:null;pt.bindFramebuffer(I.FRAMEBUFFER,Mt)}}},this.readRenderTargetPixelsAsync=async function(T,H,Y,j,z,ot,mt){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Et=Ct.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&mt!==void 0&&(Et=Et[mt]),Et){const Mt=T.texture,Ft=Mt.format,kt=Mt.type;if(!Lt.textureFormatReadable(Ft))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Lt.textureTypeReadable(kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(H>=0&&H<=T.width-j&&Y>=0&&Y<=T.height-z){pt.bindFramebuffer(I.FRAMEBUFFER,Et);const It=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,It),I.bufferData(I.PIXEL_PACK_BUFFER,ot.byteLength,I.STREAM_READ),I.readPixels(H,Y,j,z,Vt.convert(Ft),Vt.convert(kt),0);const Xt=P!==null?Ct.get(P).__webglFramebuffer:null;pt.bindFramebuffer(I.FRAMEBUFFER,Xt);const qt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await yf(I,qt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,It),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,ot),I.deleteBuffer(It),I.deleteSync(qt),ot}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,H=null,Y=0){T.isTexture!==!0&&(Ki("WebGLRenderer: copyFramebufferToTexture function signature has changed."),H=arguments[0]||null,T=arguments[1]);const j=Math.pow(2,-Y),z=Math.floor(T.image.width*j),ot=Math.floor(T.image.height*j),mt=H!==null?H.x:0,Et=H!==null?H.y:0;R.setTexture2D(T,0),I.copyTexSubImage2D(I.TEXTURE_2D,Y,0,0,mt,Et,z,ot),pt.unbindTexture()};const Ts=I.createFramebuffer(),ws=I.createFramebuffer();this.copyTextureToTexture=function(T,H,Y=null,j=null,z=0,ot=null){T.isTexture!==!0&&(Ki("WebGLRenderer: copyTextureToTexture function signature has changed."),j=arguments[0]||null,T=arguments[1],H=arguments[2],ot=arguments[3]||0,Y=null),ot===null&&(z!==0?(Ki("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ot=z,z=0):ot=0);let mt,Et,Mt,Ft,kt,It,Xt,qt,ee;const ie=T.isCompressedTexture?T.mipmaps[ot]:T.image;if(Y!==null)mt=Y.max.x-Y.min.x,Et=Y.max.y-Y.min.y,Mt=Y.isBox3?Y.max.z-Y.min.z:1,Ft=Y.min.x,kt=Y.min.y,It=Y.isBox3?Y.min.z:0;else{const Ye=Math.pow(2,-z);mt=Math.floor(ie.width*Ye),Et=Math.floor(ie.height*Ye),T.isDataArrayTexture?Mt=ie.depth:T.isData3DTexture?Mt=Math.floor(ie.depth*Ye):Mt=1,Ft=0,kt=0,It=0}j!==null?(Xt=j.x,qt=j.y,ee=j.z):(Xt=0,qt=0,ee=0);const $t=Vt.convert(H.format),Bt=Vt.convert(H.type);let Te;H.isData3DTexture?(R.setTexture3D(H,0),Te=I.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(R.setTexture2DArray(H,0),Te=I.TEXTURE_2D_ARRAY):(R.setTexture2D(H,0),Te=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,H.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,H.unpackAlignment);const te=I.getParameter(I.UNPACK_ROW_LENGTH),ln=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Ci=I.getParameter(I.UNPACK_SKIP_PIXELS),We=I.getParameter(I.UNPACK_SKIP_ROWS),Cs=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,ie.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ie.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ft),I.pixelStorei(I.UNPACK_SKIP_ROWS,kt),I.pixelStorei(I.UNPACK_SKIP_IMAGES,It);const ce=T.isDataArrayTexture||T.isData3DTexture,$e=H.isDataArrayTexture||H.isData3DTexture;if(T.isDepthTexture){const Ye=Ct.get(T),Ie=Ct.get(H),Be=Ct.get(Ye.__renderTarget),No=Ct.get(Ie.__renderTarget);pt.bindFramebuffer(I.READ_FRAMEBUFFER,Be.__webglFramebuffer),pt.bindFramebuffer(I.DRAW_FRAMEBUFFER,No.__webglFramebuffer);for(let si=0;si<Mt;si++)ce&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ct.get(T).__webglTexture,z,It+si),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ct.get(H).__webglTexture,ot,ee+si)),I.blitFramebuffer(Ft,kt,mt,Et,Xt,qt,mt,Et,I.DEPTH_BUFFER_BIT,I.NEAREST);pt.bindFramebuffer(I.READ_FRAMEBUFFER,null),pt.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(z!==0||T.isRenderTargetTexture||Ct.has(T)){const Ye=Ct.get(T),Ie=Ct.get(H);pt.bindFramebuffer(I.READ_FRAMEBUFFER,Ts),pt.bindFramebuffer(I.DRAW_FRAMEBUFFER,ws);for(let Be=0;Be<Mt;Be++)ce?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ye.__webglTexture,z,It+Be):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ye.__webglTexture,z),$e?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ie.__webglTexture,ot,ee+Be):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ie.__webglTexture,ot),z!==0?I.blitFramebuffer(Ft,kt,mt,Et,Xt,qt,mt,Et,I.COLOR_BUFFER_BIT,I.NEAREST):$e?I.copyTexSubImage3D(Te,ot,Xt,qt,ee+Be,Ft,kt,mt,Et):I.copyTexSubImage2D(Te,ot,Xt,qt,Ft,kt,mt,Et);pt.bindFramebuffer(I.READ_FRAMEBUFFER,null),pt.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else $e?T.isDataTexture||T.isData3DTexture?I.texSubImage3D(Te,ot,Xt,qt,ee,mt,Et,Mt,$t,Bt,ie.data):H.isCompressedArrayTexture?I.compressedTexSubImage3D(Te,ot,Xt,qt,ee,mt,Et,Mt,$t,ie.data):I.texSubImage3D(Te,ot,Xt,qt,ee,mt,Et,Mt,$t,Bt,ie):T.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,ot,Xt,qt,mt,Et,$t,Bt,ie.data):T.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,ot,Xt,qt,ie.width,ie.height,$t,ie.data):I.texSubImage2D(I.TEXTURE_2D,ot,Xt,qt,mt,Et,$t,Bt,ie);I.pixelStorei(I.UNPACK_ROW_LENGTH,te),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ln),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ci),I.pixelStorei(I.UNPACK_SKIP_ROWS,We),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Cs),ot===0&&H.generateMipmaps&&I.generateMipmap(Te),pt.unbindTexture()},this.copyTextureToTexture3D=function(T,H,Y=null,j=null,z=0){return T.isTexture!==!0&&(Ki("WebGLRenderer: copyTextureToTexture3D function signature has changed."),Y=arguments[0]||null,j=arguments[1]||null,T=arguments[2],H=arguments[3],z=arguments[4]||0),Ki('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(T,H,Y,j,z)},this.initRenderTarget=function(T){Ct.get(T).__webglFramebuffer===void 0&&R.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?R.setTextureCube(T,0):T.isData3DTexture?R.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?R.setTexture2DArray(T,0):R.setTexture2D(T,0),pt.unbindTexture()},this.resetState=function(){A=0,C=0,P=null,pt.reset(),Zt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Fn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Jt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Jt._getUnpackColorSpace()}}function w1(i){const t=new Ap,e=new ms(1,64,64),n=new Ao({map:t.load("./textures/earth_day_2k.png"),roughness:.8,metalness:.1}),s=new Ee(e,n);i.add(s);const r=new ms(1.015,64,64),o=new on({vertexShader:`
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vec3 viewDir = normalize(-vPosition);
        float rim = 1.0 - dot(viewDir, vNormal);
        float intensity = pow(rim, 3.0) * 0.8;
        gl_FragColor = vec4(0.4, 0.6, 1.0, intensity);
      }
    `,transparent:!0,blending:ei,side:zn,depthWrite:!1}),a=new Ee(r,o);return i.add(a),s}function C1(i){const e=new ms(2,32,32),n=new Vl({color:16772744}),s=new Ee(e,n),r=document.createElement("canvas");r.width=128,r.height=128;const o=r.getContext("2d"),a=o.createRadialGradient(64,64,0,64,64,64);a.addColorStop(0,"rgba(255, 238, 136, 1.0)"),a.addColorStop(.3,"rgba(255, 200, 80, 0.6)"),a.addColorStop(.7,"rgba(255, 160, 40, 0.15)"),a.addColorStop(1,"rgba(255, 120, 0, 0.0)"),o.fillStyle=a,o.fillRect(0,0,128,128);const l=new pu(r),c=new Hl({map:l,blending:ei,transparent:!0,depthWrite:!1}),h=new uu(c);h.scale.set(12,12,1);const u=new yn;u.add(s),u.add(h),u.visible=!1,i.add(u);function d(f,g=0){const _=Math.cos(g);u.position.set(_*Math.cos(f)*120,Math.sin(g)*120,_*Math.sin(f)*120)}return d(0),{group:u,setDirection:d}}function R1(i){const t=new ms(.2727,32,32),e=new Ao({color:10066329,roughness:.95,metalness:0,emissive:2236962,emissiveIntensity:1}),n=new Ee(t,e),s=document.createElement("canvas");s.width=64,s.height=64;const r=s.getContext("2d"),o=r.createRadialGradient(32,32,0,32,32,32);o.addColorStop(0,"rgba(180, 180, 180, 0.15)"),o.addColorStop(.6,"rgba(160, 160, 160, 0.05)"),o.addColorStop(1,"rgba(140, 140, 140, 0.0)"),r.fillStyle=o,r.fillRect(0,0,64,64);const a=new pu(s),l=new Hl({map:a,blending:ei,transparent:!0,depthWrite:!1}),c=new uu(l);c.scale.set(.8,.8,1);const h=new yn;h.add(n),h.add(c),i.add(h);function u(f,g,_){const m=Math.cos(g);h.position.set(m*Math.cos(f)*_,Math.sin(g)*_,m*Math.sin(f)*_)}function d(f){h.visible=f}return{mesh:h,setPosition:u,setVisible:d}}const os=2*Math.PI;function je(i){return i*Math.PI/180}function vn(i){return(i%360+360)%360}function Pu(i){return i.getTime()/864e5+24405875e-1}function Zl(i){return(i-2451545)/36525}function Lu(i){const t=Zl(i),e=280.46061837+360.98564736629*(i-2451545)+387933e-9*t*t-t*t*t/3871e4;return vn(e)}function P1(i){const t=Pu(i),e=Zl(t),n=vn(280.46646+36000.76983*e+3032e-7*e*e),s=vn(357.52911+35999.05029*e-1537e-7*e*e),r=je(s),o=(1.914602-.004817*e-14e-6*e*e)*Math.sin(r)+(.019993-101e-6*e)*Math.sin(2*r)+289e-6*Math.sin(3*r),a=vn(n+o),l=23.439291111-.013004167*e-1639e-10*e*e+5036e-10*e*e*e,c=je(a),h=je(l),u=Math.sin(c),d=Math.cos(c),f=Math.sin(h),g=Math.cos(h),_=Math.atan2(g*u,d),m=Math.asin(f*u),p=je(Lu(t));let y=_-p;return y=((y+Math.PI)%os+os)%os-Math.PI,{declinationRad:m,longitudeRad:y}}function L1(i){const t=Pu(i),e=Zl(t),n=vn(218.3165+481267.8813*e),s=vn(357.5291+35999.0503*e),r=vn(134.9634+477198.8676*e),o=vn(297.8502+445267.1115*e),a=vn(93.272+483202.0175*e),l=je(r),c=je(s),h=je(o),u=je(a),d=6.2888*Math.sin(l)+1.274*Math.sin(2*h-l)+.6583*Math.sin(2*h)+.2136*Math.sin(2*l)-.1851*Math.sin(c)-.1143*Math.sin(2*u)+.0588*Math.sin(2*h-2*l)+.0572*Math.sin(2*h-c-l)+.0533*Math.sin(2*h+l),f=vn(n+d),g=5.1282*Math.sin(u)+.2806*Math.sin(l+u)+.2777*Math.sin(l-u)+.1733*Math.sin(2*h-u)-.0554*Math.sin(2*h-l+u)-.0463*Math.sin(2*h-l-u),p=(385001-20905*Math.cos(l)-3699*Math.cos(2*h-l)-2956*Math.cos(2*h)-570*Math.cos(2*l)+246*Math.cos(2*l-2*h))/6371.2,y=23.439291111-.013004167*e,M=je(f),x=je(g),w=je(y),A=Math.sin(M),C=Math.cos(M),P=Math.sin(x),S=Math.cos(x),v=Math.sin(w),E=Math.cos(w),L=Math.atan2(A*E-Math.tan(x)*v,C),D=Math.asin(P*E+S*v*A),U=je(Lu(t));let B=L-U;return B=((B+Math.PI)%os+os)%os-Math.PI,{declinationRad:D,longitudeRad:B,distanceEarthRadii:p}}function D1(i){const t=new Cp(16777215,3.6);t.position.set(5,3,5),i.add(t);const e=new Rp(3355460,.5);return i.add(e),{sunLight:t,ambientLight:e}}const gh={type:"change"},Jl={type:"start"},Du={type:"end"},Vr=new bo,_h=new gn,I1=Math.cos(70*xf.DEG2RAD),_e=new O,ze=2*Math.PI,oe={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},va=1e-6;class U1 extends Gp{constructor(t,e=null){super(t,e),this.state=oe.NONE,this.enabled=!0,this.target=new O,this.cursor=new O,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ns.ROTATE,MIDDLE:ns.DOLLY,RIGHT:ns.PAN},this.touches={ONE:Ji.ROTATE,TWO:Ji.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new O,this._lastQuaternion=new sn,this._lastTargetPosition=new O,this._quat=new sn().setFromUnitVectors(t.up,new O(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Wc,this._sphericalDelta=new Wc,this._scale=1,this._panOffset=new O,this._rotateStart=new Pt,this._rotateEnd=new Pt,this._rotateDelta=new Pt,this._panStart=new Pt,this._panEnd=new Pt,this._panDelta=new Pt,this._dollyStart=new Pt,this._dollyEnd=new Pt,this._dollyDelta=new Pt,this._dollyDirection=new O,this._mouse=new Pt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=F1.bind(this),this._onPointerDown=N1.bind(this),this._onPointerUp=O1.bind(this),this._onContextMenu=W1.bind(this),this._onMouseWheel=k1.bind(this),this._onKeyDown=V1.bind(this),this._onTouchStart=H1.bind(this),this._onTouchMove=G1.bind(this),this._onMouseDown=B1.bind(this),this._onMouseMove=z1.bind(this),this._interceptControlDown=X1.bind(this),this._interceptControlUp=q1.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(gh),this.update(),this.state=oe.NONE}update(t=null){const e=this.object.position;_e.copy(e).sub(this.target),_e.applyQuaternion(this._quat),this._spherical.setFromVector3(_e),this.autoRotate&&this.state===oe.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=ze:n>Math.PI&&(n-=ze),s<-Math.PI?s+=ze:s>Math.PI&&(s-=ze),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(_e.setFromSpherical(this._spherical),_e.applyQuaternion(this._quatInverse),e.copy(this.target).add(_e),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=_e.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const a=new O(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new O(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=_e.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Vr.origin.copy(this.object.position),Vr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Vr.direction))<I1?this.object.lookAt(this.target):(_h.setFromNormalAndCoplanarPoint(this.object.up,this.target),Vr.intersectPlane(_h,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>va||8*(1-this._lastQuaternion.dot(this.object.quaternion))>va||this._lastTargetPosition.distanceToSquared(this.target)>va?(this.dispatchEvent(gh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?ze/60*this.autoRotateSpeed*t:ze/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){_e.setFromMatrixColumn(e,0),_e.multiplyScalar(-t),this._panOffset.add(_e)}_panUp(t,e){this.screenSpacePanning===!0?_e.setFromMatrixColumn(e,1):(_e.setFromMatrixColumn(e,0),_e.crossVectors(this.object.up,_e)),_e.multiplyScalar(t),this._panOffset.add(_e)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;_e.copy(s).sub(this.target);let r=_e.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(ze*this._rotateDelta.x/e.clientHeight),this._rotateUp(ze*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(ze*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-ze*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(ze*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-ze*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(ze*this._rotateDelta.x/e.clientHeight),this._rotateUp(ze*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new Pt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function N1(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function F1(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function O1(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Du),this.state=oe.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function B1(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case ns.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=oe.DOLLY;break;case ns.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=oe.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=oe.ROTATE}break;case ns.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=oe.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=oe.PAN}break;default:this.state=oe.NONE}this.state!==oe.NONE&&this.dispatchEvent(Jl)}function z1(i){switch(this.state){case oe.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case oe.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case oe.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function k1(i){this.enabled===!1||this.enableZoom===!1||this.state!==oe.NONE||(i.preventDefault(),this.dispatchEvent(Jl),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Du))}function V1(i){this.enabled!==!1&&this._handleKeyDown(i)}function H1(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Ji.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=oe.TOUCH_ROTATE;break;case Ji.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=oe.TOUCH_PAN;break;default:this.state=oe.NONE}break;case 2:switch(this.touches.TWO){case Ji.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=oe.TOUCH_DOLLY_PAN;break;case Ji.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=oe.TOUCH_DOLLY_ROTATE;break;default:this.state=oe.NONE}break;default:this.state=oe.NONE}this.state!==oe.NONE&&this.dispatchEvent(Jl)}function G1(i){switch(this._trackPointer(i),this.state){case oe.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case oe.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case oe.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case oe.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=oe.NONE}}function W1(i){this.enabled!==!1&&i.preventDefault()}function X1(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function q1(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function $1(i,t){const e=new U1(i,t.domElement);return e.enableDamping=!0,e.dampingFactor=.05,e.minDistance=1.5,e.maxDistance=80,e.enablePan=!1,e.autoRotateSpeed=.3,e}const go=6371.2,xa=1/go,Iu=200;function Uu(i,t={}){const e=t.radius||.008,n=t.radialSegments||5,s=t.color||43775,r=i.map(([h,u,d])=>new O(h*xa,u*xa,d*xa));if(r.length<2)return null;const o=new _u(r),a=t.tubularSegments??Iu,l=new ql(o,a,e,n,!1),c=new Ao({color:s,emissive:s,emissiveIntensity:.25,roughness:.5,metalness:.2,transparent:!0,opacity:.85});return new Ee(l,c)}function Y1(i,t,e={}){const n=new yn;for(const s of i){const r=t(s.lat),o=Uu(s.points,{color:r,radius:e.radius||.008});o&&n.add(o)}return n}function Nu(i){const e=0+Math.abs(i)/90*.55;return new Ot().setHSL(e,.85,.55)}function K1(i,t,e){const s=(1-Math.min(1,Math.max(0,(i-t)/(e-t))))*.66;return new Ot().setHSL(s,.9,.5)}function j1(i,t,e){const s=Math.min(1,Math.max(0,(i-t)/(e-t)))*.75;return new Ot().setHSL(s,.85,.55)}/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.20.0
 * @author George Michael Brower
 * @license MIT
 */class bn{constructor(t,e,n,s,r="div"){this.parent=t,this.object=e,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(r),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),bn.nextNameID=bn.nextNameID||0,this.$name.id=`lil-gui-name-${++bn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Z1 extends bn{constructor(t,e,n){super(t,e,n,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Ml(i){let t,e;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const J1={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:Ml,toHexString:Ml},Zs={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},Q1={isPrimitive:!1,match:i=>Array.isArray(i),fromHexString(i,t,e=1){const n=Zs.fromHexString(i);t[0]=(n>>16&255)/255*e,t[1]=(n>>8&255)/255*e,t[2]=(n&255)/255*e},toHexString([i,t,e],n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return Zs.toHexString(s)}},tv={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,e=1){const n=Zs.fromHexString(i);t.r=(n>>16&255)/255*e,t.g=(n>>8&255)/255*e,t.b=(n&255)/255*e},toHexString({r:i,g:t,b:e},n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return Zs.toHexString(s)}},ev=[J1,Zs,Q1,tv];function nv(i){return ev.find(t=>t.match(i))}class iv extends bn{constructor(t,e,n,s){super(t,e,n,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=nv(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const r=Ml(this.$text.value);r&&this._setValueFromHexString(r)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Ma extends bn{constructor(t,e,n){super(t,e,n,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class sv extends bn{constructor(t,e,n,s,r,o){super(t,e,n,"number"),this._initInput(),this.min(s),this.max(r);const a=o!==void 0;this.step(a?o:this._getImplicitStep(),a),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let y=parseFloat(this.$input.value);isNaN(y)||(this._stepExplicit&&(y=this._snap(y)),this.setValue(this._clamp(y)))},n=y=>{const M=parseFloat(this.$input.value);isNaN(M)||(this._snapClampSetValue(M+y),this.$input.value=this.getValue())},s=y=>{y.key==="Enter"&&this.$input.blur(),y.code==="ArrowUp"&&(y.preventDefault(),n(this._step*this._arrowKeyMultiplier(y))),y.code==="ArrowDown"&&(y.preventDefault(),n(this._step*this._arrowKeyMultiplier(y)*-1))},r=y=>{this._inputFocused&&(y.preventDefault(),n(this._step*this._normalizeMouseWheel(y)))};let o=!1,a,l,c,h,u;const d=5,f=y=>{a=y.clientX,l=c=y.clientY,o=!0,h=this.getValue(),u=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",_)},g=y=>{if(o){const M=y.clientX-a,x=y.clientY-l;Math.abs(x)>d?(y.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(M)>d&&_()}if(!o){const M=y.clientY-c;u-=M*this._step*this._arrowKeyMultiplier(y),h+u>this._max?u=this._max-h:h+u<this._min&&(u=this._min-h),this._snapClampSetValue(h+u)}c=y.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",_)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",r,{passive:!1}),this.$input.addEventListener("mousedown",f),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,y,M,x,w)=>(p-y)/(M-y)*(w-x)+x,e=p=>{const y=this.$slider.getBoundingClientRect();let M=t(p,y.left,y.right,this._min,this._max);this._snapClampSetValue(M)},n=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",r)},s=p=>{e(p.clientX)},r=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",r)};let o=!1,a,l;const c=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(a=p.touches[0].clientX,l=p.touches[0].clientY,o=!0):c(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",d))},u=p=>{if(o){const y=p.touches[0].clientX-a,M=p.touches[0].clientY-l;Math.abs(y)>Math.abs(M)?c(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",d)},f=this._callOnFinishChange.bind(this),g=400;let _;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const M=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+M),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(f,g)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:n}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,n=-t.wheelDelta/120,n*=this._stepExplicit?1:10),e+-n}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){let e=0;return this._hasMin?e=this._min:this._hasMax&&(e=this._max),t-=e,t=Math.round(t/this._step)*this._step,t+=e,t=parseFloat(t.toPrecision(15)),t}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class rv extends bn{constructor(t,e,n,s){super(t,e,n,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const n=document.createElement("option");n.textContent=e,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class ov extends bn{constructor(t,e,n){super(t,e,n,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}var av=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.root > .title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.root > .children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.root > .children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.root > .children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.allow-touch-styles, .lil-gui.allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.force-touch-styles, .lil-gui.force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-gui .controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-gui .controller.disabled {
  opacity: 0.5;
}
.lil-gui .controller.disabled, .lil-gui .controller.disabled * {
  pointer-events: none !important;
}
.lil-gui .controller > .name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-gui .controller .widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-gui .controller.string input {
  color: var(--string-color);
}
.lil-gui .controller.boolean {
  cursor: pointer;
}
.lil-gui .controller.color .display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-gui .controller.color .display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-gui .controller.color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-gui .controller.color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-gui .controller.option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-gui .controller.option .display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-gui .controller.option .display.focus {
    background: var(--focus-color);
  }
}
.lil-gui .controller.option .display.active {
  background: var(--focus-color);
}
.lil-gui .controller.option .display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-gui .controller.option .widget,
.lil-gui .controller.option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-gui .controller.option .widget:hover .display {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number input {
  color: var(--number-color);
}
.lil-gui .controller.number.hasSlider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-gui .controller.number .slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-gui .controller.number .slider:hover {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number .slider.active {
  background: var(--focus-color);
}
.lil-gui .controller.number .slider.active .fill {
  opacity: 0.95;
}
.lil-gui .controller.number .fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-gui-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-gui-dragging * {
  cursor: ew-resize !important;
}

.lil-gui-dragging.lil-gui-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-gui-dragging) .lil-gui .title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.root > .title:focus {
  text-decoration: none !important;
}
.lil-gui.closed > .title:before {
  content: "▸";
}
.lil-gui.closed > .children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.closed:not(.transition) > .children {
  display: none;
}
.lil-gui.transition > .children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.root > .children > .lil-gui > .title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.root > .children > .lil-gui.closed > .title {
  border-bottom-color: transparent;
}
.lil-gui + .controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff");
}`;function lv(i){const t=document.createElement("style");t.innerHTML=i;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let vh=!1;class Ql{constructor({parent:t,autoPlace:e=t===void 0,container:n,width:s,title:r="Controls",closeFolders:o=!1,injectStyles:a=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("button"),this.$title.classList.add("title"),this.$title.setAttribute("aria-expanded",!0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(r),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!vh&&a&&(lv(av),vh=!0),n?n.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=o}add(t,e,n,s,r){if(Object(n)===n)return new rv(this,t,e,n);const o=t[e];switch(typeof o){case"number":return new sv(this,t,e,n,s,r);case"boolean":return new Z1(this,t,e);case"string":return new ov(this,t,e);case"function":return new Ma(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,n=1){return new iv(this,t,e,n)}addFolder(t){const e=new Ql({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(n=>{n instanceof Ma||n._name in t.controllers&&n.load(t.controllers[n._name])}),e&&t.folders&&this.folders.forEach(n=>{n._title in t.folders&&n.load(t.folders[n._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof Ma)){if(n._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);e.controllers[n._name]=n.save()}}),t&&this.folders.forEach(n=>{if(n._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);e.folders[n._title]=n.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const n=r=>{r.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function cv(){if(document.getElementById("control-panel-styles"))return;const i=document.createElement("style");i.id="control-panel-styles",i.textContent=`
    .lil-gui.root > .children > .lil-gui.section-magnetosphere > .title {
      border-left: 3px solid #44ccee;
    }
    .lil-gui.root > .children > .lil-gui.section-solar-wind > .title {
      border-left: 3px solid #ffaa44;
    }
    .lil-gui.root > .children > .lil-gui.section-radiation > .title {
      border-left: 3px solid #9988ff;
    }
    .lil-gui.root > .children > .lil-gui.section-satellites > .title {
      border-left: 3px solid #ffdd44;
    }
    .lil-gui.root > .children > .lil-gui.section-clipping > .title {
      border-left: 3px solid #445566;
    }
    .lil-gui.section-magnetosphere > .title,
    .lil-gui.section-solar-wind > .title,
    .lil-gui.section-radiation > .title,
    .lil-gui.section-satellites > .title,
    .lil-gui.section-clipping > .title {
      padding-left: 9px;
      letter-spacing: 1.5px; text-transform: uppercase; font-size: 11px;
    }
  `,document.head.appendChild(i)}function hv(i,t){const{onRebuild:e,onVisualChange:n,onIsoRebuild:s,onIsoVisualChange:r,onClipChange:o,onBeltRebuild:a,onBeltVisualChange:l,onSatelliteSwarmChange:c=()=>{},onSatelliteSearchOpen:h=()=>{},onSolarWindChange:u,onMagnetopauseChange:d,onParticleChange:f=()=>{},onAuroraChange:g=()=>{}}=t;cv();const _=new Ql({title:"Controls"}),m=_.addFolder("Magnetosphere");m.domElement.classList.add("section-magnetosphere");const p=m.addFolder("Field Lines");p.add(i,"maxDegree",1,13,1).name("IGRF Degree").onChange(()=>{e(),i.showIsosurfaces&&s(),(i.showInnerBelt||i.showOuterBelt)&&a()}),p.add(i,"numLatitudes",1,12,1).name("Latitude Bands").onChange(e),p.add(i,"numLongitudes",4,36,2).name("Longitudes").onChange(e),p.add(i,"tubeRadius",.003,.04,.001).name("Line Thickness").onChange(e),p.add(i,"showFieldLines").name("Show Field Lines").onChange(n),p.add(i,"autoRotate").name("Auto Rotate").onChange(n);const y=m.addFolder("Isosurfaces");y.add(i,"showIsosurfaces").name("Show Isosurfaces").onChange(st=>{st?s():r()}),y.add(i,"isoMode",{"L-shell (field topology)":"lShell","Field Strength |B|":"fieldStrength"}).name("Mode").onChange(s),y.add(i,"isoResolution",{Low:48,Medium:64,High:96}).name("Resolution").onChange(s),y.add(i,"isoOpacity",.05,.8,.01).name("Opacity").onChange(r);const M=y.addFolder("Levels");function x(){for(const st of[...M.controllers])st.destroy();for(const st of Object.keys(i.isoLevels)){const ht=i.isoMode==="lShell"?`L = ${st}`:`${Number(st).toLocaleString()} nT`;M.add(i.isoLevels,st).name(ht).onChange(r)}}x(),i._rebuildLevelToggles=x,M.close(),y.close();const w=_.addFolder("Solar Wind");w.domElement.classList.add("section-solar-wind");const A={"Historical Data":null,Quiet:{vSw:400,nSw:5,imfBy:0,imfBz:0,dst:0},"Moderate Storm":{vSw:500,nSw:10,imfBy:2,imfBz:-5,dst:-50},"Severe Storm":{vSw:700,nSw:20,imfBy:5,imfBz:-15,dst:-150}};w.add(i,"solarWindEnabled").name("Enable Solar Wind").onChange(u),i._solarPreset="Historical Data";const C=w.add(i,"_solarPreset",Object.keys(A)).name("Preset").onChange(st=>{const ht=A[st];ht&&(i.solarWindSpeed=ht.vSw,i.solarWindDensity=ht.nSw,i.imfBy=ht.imfBy,i.imfBz=ht.imfBz,i.dst=ht.dst,_.controllersRecursive().forEach(At=>At.updateDisplay()),i.solarWindEnabled&&u())}),P=w.add(i,"solarWindSpeed",300,800,10).name("Speed (km/s)").onChange(()=>{i.solarWindEnabled&&u()}),S=w.add(i,"solarWindDensity",1,30,.5).name("Density (cm⁻³)").onChange(()=>{i.solarWindEnabled&&u()}),v=w.add(i,"imfBy",-20,20,.5).name("IMF By (nT)").onChange(()=>{i.solarWindEnabled&&u()}),E=w.add(i,"imfBz",-20,20,.5).name("IMF Bz (nT)").onChange(()=>{i.solarWindEnabled&&u()}),L=w.add(i,"dst",-200,50,5).name("Dst Index (nT)").onChange(()=>{i.solarWindEnabled&&u()});w.add(i,"showMagnetopause").name("Show Magnetopause").onChange(d),w.close();const D=_.addFolder("Radiation & Aurora");D.domElement.classList.add("section-radiation");const U=D.addFolder("Radiation Belts");U.add(i,"showInnerBelt").name("Inner Belt (L=1.2-2)").onChange(st=>{st?a():l()}),U.add(i,"showOuterBelt").name("Outer Belt (L=3-6)").onChange(st=>{st?a():l()}),U.add(i,"beltOpacity",.05,.8,.01).name("Opacity").onChange(l),U.close();const B=D.addFolder("Belt Particles");B.add(i.particles,"enabled").name("Show Particles");const F=B.add(i.particles,"showElectrons").name("Electrons (eastward)");F.$name.innerHTML='<span style="color:#3399ff">●</span> Electrons (eastward)';const q=B.add(i.particles,"showProtons").name("Protons (westward)");q.$name.innerHTML='<span style="color:#ff6622">●</span> Protons (westward)',B.add(i.particles,"count",200,2e3,100).name("Max Particles"),B.add(i.particles,"energyMeV",{"< 1 MeV (low)":.3,"1–3 MeV (medium)":2,"> 3 MeV (high)":5}).name("Electron Energy"),B.close();const V=D.addFolder("Aurora");V.add(i.aurora,"enabled").name("Show Aurora"),V.add(i.aurora,"opacity",.1,2,.05).name("Brightness"),V.close(),D.close();const tt=_.addFolder("Satellites");tt.domElement.classList.add("section-satellites"),tt.add(i.satellites,"enabled").name("Show Satellites").onChange(c),tt.add(i.satellites,"notableOnly").name("Notable Only").onChange(c);const X=tt.addFolder("Orbit Classes"),nt=X.add(i.satellites,"showLeo").name("LEO").onChange(c);nt.$name.innerHTML='<span style="color:#c8d8f0">●</span> LEO';const ct=X.add(i.satellites,"showMeo").name("MEO").onChange(c);ct.$name.innerHTML='<span style="color:#44eebb">●</span> MEO';const et=X.add(i.satellites,"showGeo").name("GEO").onChange(c);et.$name.innerHTML='<span style="color:#ffdd44">●</span> GEO';const N=X.add(i.satellites,"showHeo").name("HEO").onChange(c);N.$name.innerHTML='<span style="color:#ee66ff">●</span> HEO';const W=X.add(i.satellites,"showOther").name("Other").onChange(c);W.$name.innerHTML='<span style="color:#888888">●</span> Other',X.close();const $=document.createElement("button");$.id="sat-open-btn",$.textContent="Search / Select Satellite",$.style.cssText=["width:100%","box-sizing:border-box","margin:4px 0","padding:5px 8px","background:rgba(30,50,80,0.7)","color:#88ccff","border:1px solid rgba(100,150,200,0.35)","border-radius:4px","cursor:pointer","font-family:var(--font-family)","font-size:11px"].join(";"),$.addEventListener("mouseenter",()=>{$.style.background="rgba(50,80,120,0.8)"}),$.addEventListener("mouseleave",()=>{$.style.background="rgba(30,50,80,0.7)"}),$.addEventListener("click",h),tt.$children.appendChild($),tt.close();const K=_.addFolder("Clipping");K.domElement.classList.add("section-clipping"),K.add(i,"clipEquatorial").name("Equatorial Clip").onChange(o),K.add(i,"clipMeridional").name("Meridional Clip").onChange(o),K.add(i,"clipMeridionalAngle",0,360,1).name("Meridional Angle").onChange(o),K.close();function lt(){C.updateDisplay(),P.updateDisplay(),S.updateDisplay(),v.updateDisplay(),E.updateDisplay(),L.updateDisplay()}return{gui:_,refreshSolarWindControls:lt}}function uv(){const i=document.createElement("div");i.id="info-overlay",i.innerHTML=`
    <h3>MagRad-CG  by <a href="https://www.atomodo.com/">AtOmOdO</a></h3>
    <p><strong>Magnetospheric Radiometric Cybernetic Garden</strong></p>
    <p class="attribution"><a href="/about.html" target="_blank">About &amp; Data Sources</a></p>
  `,document.body.appendChild(i);const t=document.createElement("style");return t.textContent=`
    #info-overlay {
      position: fixed;
      top: 20px;
      left: 20px;
      background: rgba(0, 5, 20, 0.75);
      color: #c8ddf0;
      padding: 12px 15px;
      border-radius: 16px;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 13px;
      line-height: 1.5;
      max-width: 360px;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(100, 150, 200, 0.2);
      z-index: 10;
    }
    #info-overlay h3 {
      margin: 0 0 6px 0;
      font-size: 16px;
      color: #88ccff;
      letter-spacing: 1px;
    }
    #info-overlay p { margin: 4px 0; }
    #info-overlay .legend { margin-top: 8px; }
    #info-overlay .attribution {
      font-size: 11px;
      color: #88a0b8;
    }
    #info-overlay a {
      color: #88ccff;
      text-decoration: none;
    }
    #info-overlay a:hover { text-decoration: underline; }
  `,document.head.appendChild(t),i}function dv(i){const t=document.getElementById("sw-data-note");t&&(t.textContent=i)}const fv=8e3,ui=7*864e5,Os=7;function ya(i){const t=new Date(i);return t.setUTCHours(0,0,0,0),t}function yl(i,t,e){return i+(t-i)*e}function Sa(i,t,e,n){return n<.5?yl(i,t,n*2):yl(t,e,(n-.5)*2)}function pv(i){if(!i)return"rgba(0,20,80,0.06)";const t=i.Dst!==null?Math.max(0,-i.Dst/150):0,e=i.Bz!==null?Math.max(0,-i.Bz/20):0,n=Math.min(1,t*.7+e*.3),s=Math.round(Sa(0,180,210,n)),r=Math.round(Sa(40,100,20,n)),o=Math.round(Sa(120,30,20,n)),a=yl(.06,.55,n).toFixed(2);return`rgba(${s},${r},${o},${a})`}function mv(){if(document.getElementById("timeline-styles"))return;const i=document.createElement("style");i.id="timeline-styles",i.textContent=`
    #timeline {
      position: fixed; bottom: 0; left: 0; right: 0; height: 64px;
      background: rgba(0, 5, 20, 0.88);
      backdrop-filter: blur(8px);
      border-top: 1px solid rgba(100, 150, 200, 0.2);
      display: flex; align-items: center;
      z-index: 20; color: #c8ddf0;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      user-select: none; box-sizing: border-box;
    }
    #tl-controls {
      display: flex; align-items: center; gap: 6px;
      padding: 0 12px; flex-shrink: 0; width: 230px;
    }
    #tl-clock { text-align: center; min-width: 84px; }
    #tl-date  { font-size: 11px; color: #88ccff; line-height: 1.3; }
    #tl-time  {
      font-size: 13px; font-weight: bold;
      font-family: 'Courier New', monospace; line-height: 1.3;
    }
    #tl-bar {
      flex: 1; position: relative; height: 100%; cursor: pointer;
      border-left: 1px solid rgba(100, 150, 200, 0.2);
      overflow: hidden;
    }
    #tl-sw-canvas {
      position: absolute; top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none; z-index: 0;
    }
    .tl-tick-major {
      position: absolute; top: 0; bottom: 0; width: 1px;
      background: rgba(100, 150, 200, 0.3);
      pointer-events: none; z-index: 1;
    }
    .tl-tick-major .tl-label {
      position: absolute; bottom: 7px; left: 4px;
      font-size: 10px; color: #6688aa; white-space: nowrap;
    }
    .tl-tick-minor {
      position: absolute; top: 44%; bottom: 0; width: 1px;
      background: rgba(100, 150, 200, 0.15);
      pointer-events: none; z-index: 1;
    }
    #tl-playhead {
      position: absolute; top: 0; bottom: 0; width: 2px;
      background: #88ccff; pointer-events: none; z-index: 2;
    }
    #tl-playhead::before {
      content: ''; position: absolute; top: 0; left: -4px;
      width: 0; height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 9px solid #88ccff;
    }
    button.tl-btn {
      background: rgba(100, 150, 200, 0.15);
      border: 1px solid rgba(100, 150, 200, 0.3);
      color: #c8ddf0; border-radius: 4px;
      padding: 3px 8px; cursor: pointer; font-size: 12px;
      flex-shrink: 0;
    }
    button.tl-btn:hover { background: rgba(100, 150, 200, 0.3); }
    select.tl-select {
      background: rgba(0, 5, 20, 0.8);
      border: 1px solid rgba(100, 150, 200, 0.3);
      color: #c8ddf0; border-radius: 4px;
      padding: 2px 4px; font-size: 12px; cursor: pointer;
      flex-shrink: 0;
    }
    #tl-legend {
      display: flex; flex-direction: column; align-items: stretch;
      justify-content: center; gap: 7px;
      padding: 0 14px; flex-shrink: 0; width: 190px;
      border-left: 1px solid rgba(100, 150, 200, 0.2);
    }
    .tl-gauge {
      display: flex; align-items: center; gap: 6px; cursor: default;
    }
    .tl-gauge-lbl {
      font-size: 10px; color: #7799bb; letter-spacing: .05em; text-transform: uppercase;
      width: 20px; flex-shrink: 0; text-align: right;
    }
    .tl-gauge-num {
      font-size: 11px; font-weight: bold; font-family: 'Courier New', monospace;
      width: 48px; flex-shrink: 0; text-align: right; transition: color 0.3s;
    }
    .tl-gauge-track {
      flex: 1; height: 5px; border-radius: 3px; position: relative;
      background: rgba(100, 150, 200, 0.12);
    }
    .tl-gauge-fill {
      position: absolute; top: 0; left: 0; height: 100%; border-radius: 3px;
      transition: width 0.4s ease, background 0.4s ease;
      min-width: 0;
    }
    .tl-gauge-marker {
      position: absolute; top: -3px; width: 2px; height: 11px; border-radius: 1px;
      background: rgba(220, 230, 255, 0.8);
      transform: translateX(-50%);
      transition: left 0.4s ease;
    }
  `,document.head.appendChild(i)}function gv({initialTime:i,onTimeChange:t,onPause:e,onPeriodicRebuild:n,getSolarWindData:s}){const r=n||e;let o=new Date(i),a=ya(o),l=!1,c=60,h=null,u=0,d=!1;mv();const f=document.createElement("div");f.id="timeline",f.innerHTML=`
    <div id="tl-controls">
      <button class="tl-btn" id="tl-prev" title="Previous week">⏮</button>
      <div id="tl-clock">
        <div id="tl-date"></div>
        <div id="tl-time"></div>
      </div>
      <button class="tl-btn" id="tl-next" title="Next week">⏭</button>
      <button class="tl-btn" id="tl-play" title="Play / Pause">▶</button>
      <select class="tl-select" id="tl-speed" title="Playback speed">
        <option value="1">1×</option>
        <option value="60" selected>60×</option>
        <option value="3600">3600×</option>
        <option value="86400">86400×</option>
      </select>
      <button class="tl-btn" id="tl-now" title="Jump to now">Now</button>
    </div>
    <div id="tl-bar" title="Timeline background color: storm intensity derived from Dst ring-current index + IMF Bz (southward field coupling). Blue = quiet, amber = moderate, red = severe."></div>
    <div id="tl-legend">
      <div class="tl-gauge" id="tl-gauge-kp"
           title="Kp index (0–9): overall geomagnetic activity level derived from solar wind speed, density, and Dst. Green (Kp &lt; 3) = quiet conditions. Amber (3–5) = moderate storm, elevated radiation belt activity. Red (&gt; 5) = severe geomagnetic storm — outer belt intensifies, aurora visible at lower latitudes.">
        <span class="tl-gauge-lbl">Kp</span>
        <span class="tl-gauge-num" id="tl-kp-val">–</span>
        <div class="tl-gauge-track">
          <div class="tl-gauge-fill" id="tl-kp-fill"></div>
          <div class="tl-gauge-marker" id="tl-kp-mk"></div>
        </div>
      </div>
      <div class="tl-gauge" id="tl-gauge-dst"
           title="Dst index (nT): disturbance storm time — measures the global ring current in the inner magnetosphere. Near 0 = quiet. −50 nT = moderate storm. −150 nT = intense storm (outer belt electrons injected, slot region fills). Background colors on the timeline reflect Dst + IMF Bz.">
        <span class="tl-gauge-lbl">Dst</span>
        <span class="tl-gauge-num" id="tl-dst-val">– nT</span>
        <div class="tl-gauge-track">
          <div class="tl-gauge-fill" id="tl-dst-fill"></div>
          <div class="tl-gauge-marker" id="tl-dst-mk"></div>
        </div>
      </div>
      <div class="tl-gauge" id="tl-gauge-bz"
           title="IMF Bz (nT): interplanetary magnetic field north–south component. Southward (negative) Bz opens the magnetopause via magnetic reconnection — the primary trigger for geomagnetic storms. +20 nT = strongly northward (protective). −20 nT = strongly southward (storm driver). Values below −5 nT are significant.">
        <span class="tl-gauge-lbl">Bz</span>
        <span class="tl-gauge-num" id="tl-bz-val">– nT</span>
        <div class="tl-gauge-track">
          <div class="tl-gauge-fill" id="tl-bz-fill"></div>
          <div class="tl-gauge-marker" id="tl-bz-mk"></div>
        </div>
      </div>
    </div>
  `,document.body.appendChild(f);const g=f.querySelector("#tl-date"),_=f.querySelector("#tl-time"),m=f.querySelector("#tl-play"),p=f.querySelector("#tl-bar"),y=f.querySelector("#tl-kp-val"),M=f.querySelector("#tl-kp-fill"),x=f.querySelector("#tl-kp-mk"),w=f.querySelector("#tl-dst-val"),A=f.querySelector("#tl-dst-fill"),C=f.querySelector("#tl-dst-mk"),P=f.querySelector("#tl-bz-val"),S=f.querySelector("#tl-bz-fill"),v=f.querySelector("#tl-bz-mk"),E=document.createElement("canvas");E.id="tl-sw-canvas",p.appendChild(E);let L=null,D="",U="",B="";function F(){if(!s)return;const et=p.clientWidth,N=p.clientHeight;if(et===0||N===0)return;(E.width!==et||E.height!==N)&&(E.width=et,E.height=N);const W=E.getContext("2d");W.clearRect(0,0,et,N);const $=Os*24;for(let K=0;K<$;K++){const lt=(a.getTime()+K*36e5)/1e3,st=s(lt);W.fillStyle=pv(st);const ht=Math.floor(K/$*et),At=Math.floor((K+1)/$*et);W.fillRect(ht,0,At-ht||1,N)}}const q=new ResizeObserver(()=>F());q.observe(p);function V(){p.querySelectorAll(".tl-tick-major, .tl-tick-minor").forEach(et=>et.remove());for(let et=0;et<=Os;et++){const N=new Date(a.getTime()+et*864e5),W=document.createElement("div");W.className="tl-tick-major",W.style.left=et/Os*100+"%";const $=document.createElement("span");$.className="tl-label",$.textContent=N.toLocaleDateString("en",{month:"short",day:"numeric",timeZone:"UTC"}),W.appendChild($),p.appendChild(W)}for(let et=0;et<Os;et++){const N=document.createElement("div");N.className="tl-tick-minor",N.style.left=(et+.5)/Os*100+"%",p.appendChild(N)}L=p.querySelector("#tl-playhead"),L||(L=document.createElement("div"),L.id="tl-playhead"),p.appendChild(L),F()}function tt(){const et=o.toLocaleDateString("en",{month:"short",day:"numeric",year:"numeric",timeZone:"UTC"});et!==D&&(g.textContent=et,D=et);const N=o.toISOString().slice(11,16)+" UTC";N!==U&&(_.textContent=N,U=N);const W=(o.getTime()-a.getTime())/ui;L&&(L.style.left=Math.max(0,Math.min(1,W))*100+"%");const $=l?"⏸":"▶";$!==B&&(m.textContent=$,B=$)}function X(et){const N=p.getBoundingClientRect(),W=Math.max(0,Math.min(1,(et.clientX-N.left)/N.width));o=new Date(a.getTime()+W*ui),tt(),t(o.toISOString().slice(0,16))}function nt(et){d&&X(et)}function ct(){d&&(d=!1,document.removeEventListener("mousemove",nt),document.removeEventListener("mouseup",ct),e())}return p.addEventListener("mousedown",et=>{d=!0,X(et),document.addEventListener("mousemove",nt),document.addEventListener("mouseup",ct)}),f.querySelector("#tl-play").addEventListener("click",()=>{l=!l,l||(u=0,e()),tt()}),f.querySelector("#tl-prev").addEventListener("click",()=>{a=new Date(a.getTime()-ui),o=new Date(o.getTime()-ui),V(),tt(),t(o.toISOString().slice(0,16)),e()}),f.querySelector("#tl-next").addEventListener("click",()=>{a=new Date(a.getTime()+ui),o=new Date(o.getTime()+ui),V(),tt(),t(o.toISOString().slice(0,16)),e()}),f.querySelector("#tl-now").addEventListener("click",()=>{o=new Date,a=ya(o),V(),tt(),t(o.toISOString().slice(0,16)),e()}),f.querySelector("#tl-speed").addEventListener("change",et=>{c=Number(et.target.value)}),V(),tt(),{tick(et){if(!l||d){h=null;return}if(h===null){h=et;return}const N=Math.min(et-h,100);h=et,o=new Date(o.getTime()+c*N);const W=a.getTime()+ui;o.getTime()>=W&&(a=new Date(a.getTime()+864e5),V()),tt(),t(o.toISOString().slice(0,19)),et-u>=fv&&(u=et,r())},setTime(et){const N=new Date(et);isNaN(N.getTime())||(o=N,a=ya(o),V(),tt())},getSpeed(){return c},getSimTimeAt(et){return l?new Date(o.getTime()+c*et).toISOString():o.toISOString()},refreshColors(){F()},updateGauges(et,N,W){if(y&&M&&x){const $=et??0,K=Math.min(1,Math.max(0,$/9))*100,lt=$<3?"#44aa66":$<5?"#cc8822":"#cc3333";y.textContent=$.toFixed(1),y.style.color=lt,M.style.width=K+"%",M.style.background=lt,x.style.left=K+"%"}if(w&&A&&C){const $=N??0,K=Math.min(1,Math.max(0,-$/200)),lt=$>-50?"#4488aa":$>-100?"#cc8822":"#cc3333";w.textContent=`${Math.round($)} nT`,w.style.color=lt,A.style.width=K*100+"%",A.style.background=lt,C.style.left=K*100+"%"}if(P&&S&&v){const $=W??0,K=Math.min(1,Math.max(0,-$/20)),lt=$>-5?"#4488aa":$>-10?"#cc8822":"#cc3333";P.textContent=`${$>=0?"+":""}${$.toFixed(1)} nT`,P.style.color=$>0?"#557799":lt,S.style.width=K*100+"%",S.style.background=lt,v.style.left=K*100+"%"}},destroy(){q.disconnect(),document.removeEventListener("mousemove",nt),document.removeEventListener("mouseup",ct),f.remove()}}}const _v=[0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0],vv=[[-1],[0,8,3,-1],[0,1,9,-1],[1,8,3,9,8,1,-1],[1,2,10,-1],[0,8,3,1,2,10,-1],[9,2,10,0,2,9,-1],[2,8,3,2,10,8,10,9,8,-1],[3,11,2,-1],[0,11,2,8,11,0,-1],[1,9,0,2,3,11,-1],[1,11,2,1,9,11,9,8,11,-1],[3,10,1,11,10,3,-1],[0,10,1,0,8,10,8,11,10,-1],[3,9,0,3,11,9,11,10,9,-1],[9,8,10,10,8,11,-1],[4,7,8,-1],[4,3,0,7,3,4,-1],[0,1,9,8,4,7,-1],[4,1,9,4,7,1,7,3,1,-1],[1,2,10,8,4,7,-1],[3,4,7,3,0,4,1,2,10,-1],[9,2,10,9,0,2,8,4,7,-1],[2,10,9,2,9,7,2,7,3,7,9,4,-1],[8,4,7,3,11,2,-1],[11,4,7,11,2,4,2,0,4,-1],[9,0,1,8,4,7,2,3,11,-1],[4,7,11,9,4,11,9,11,2,9,2,1,-1],[3,10,1,3,11,10,7,8,4,-1],[1,11,10,1,4,11,1,0,4,7,11,4,-1],[4,7,8,9,0,11,9,11,10,11,0,3,-1],[4,7,11,4,11,9,9,11,10,-1],[9,5,4,-1],[9,5,4,0,8,3,-1],[0,5,4,1,5,0,-1],[8,5,4,8,3,5,3,1,5,-1],[1,2,10,9,5,4,-1],[3,0,8,1,2,10,4,9,5,-1],[5,2,10,5,4,2,4,0,2,-1],[2,10,5,3,2,5,3,5,4,3,4,8,-1],[9,5,4,2,3,11,-1],[0,11,2,0,8,11,4,9,5,-1],[0,5,4,0,1,5,2,3,11,-1],[2,1,5,2,5,8,2,8,11,4,8,5,-1],[10,3,11,10,1,3,9,5,4,-1],[4,9,5,0,8,1,8,10,1,8,11,10,-1],[5,4,0,5,0,11,5,11,10,11,0,3,-1],[5,4,8,5,8,10,10,8,11,-1],[9,7,8,5,7,9,-1],[9,3,0,9,5,3,5,7,3,-1],[0,7,8,0,1,7,1,5,7,-1],[1,5,3,3,5,7,-1],[9,7,8,9,5,7,10,1,2,-1],[10,1,2,9,5,0,5,3,0,5,7,3,-1],[8,0,2,8,2,5,8,5,7,10,5,2,-1],[2,10,5,2,5,3,3,5,7,-1],[7,9,5,7,8,9,3,11,2,-1],[9,5,7,9,7,2,9,2,0,2,7,11,-1],[2,3,11,0,1,8,1,7,8,1,5,7,-1],[11,2,1,11,1,7,7,1,5,-1],[9,5,8,8,5,7,10,1,3,10,3,11,-1],[5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1],[11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1],[11,10,5,7,11,5,-1],[10,6,5,-1],[0,8,3,5,10,6,-1],[9,0,1,5,10,6,-1],[1,8,3,1,9,8,5,10,6,-1],[1,6,5,2,6,1,-1],[1,6,5,1,2,6,3,0,8,-1],[9,6,5,9,0,6,0,2,6,-1],[5,9,8,5,8,2,5,2,6,3,2,8,-1],[2,3,11,10,6,5,-1],[11,0,8,11,2,0,10,6,5,-1],[0,1,9,2,3,11,5,10,6,-1],[5,10,6,1,9,2,9,11,2,9,8,11,-1],[6,3,11,6,5,3,5,1,3,-1],[0,8,11,0,11,5,0,5,1,5,11,6,-1],[3,11,6,0,3,6,0,6,5,0,5,9,-1],[6,5,9,6,9,11,11,9,8,-1],[5,10,6,4,7,8,-1],[4,3,0,4,7,3,6,5,10,-1],[1,9,0,5,10,6,8,4,7,-1],[10,6,5,1,9,7,1,7,3,7,9,4,-1],[6,1,2,6,5,1,4,7,8,-1],[1,2,5,5,2,6,3,0,4,3,4,7,-1],[8,4,7,9,0,5,0,6,5,0,2,6,-1],[7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1],[3,11,2,7,8,4,10,6,5,-1],[5,10,6,4,7,2,4,2,0,2,7,11,-1],[0,1,9,4,7,8,2,3,11,5,10,6,-1],[9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1],[8,4,7,3,11,5,3,5,1,5,11,6,-1],[5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1],[0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1],[6,5,9,6,9,11,4,7,9,7,11,9,-1],[10,4,9,6,4,10,-1],[4,10,6,4,9,10,0,8,3,-1],[10,0,1,10,6,0,6,4,0,-1],[8,3,1,8,1,6,8,6,4,6,1,10,-1],[1,4,9,1,2,4,2,6,4,-1],[3,0,8,1,2,9,2,4,9,2,6,4,-1],[0,2,4,4,2,6,-1],[8,3,2,8,2,4,4,2,6,-1],[10,4,9,10,6,4,11,2,3,-1],[0,8,2,2,8,11,4,9,10,4,10,6,-1],[3,11,2,0,1,6,0,6,4,6,1,10,-1],[6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1],[9,6,4,9,3,6,9,1,3,11,6,3,-1],[8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1],[3,11,6,3,6,0,0,6,4,-1],[6,4,8,11,6,8,-1],[7,10,6,7,8,10,8,9,10,-1],[0,7,3,0,10,7,0,9,10,6,7,10,-1],[10,6,7,1,10,7,1,7,8,1,8,0,-1],[10,6,7,10,7,1,1,7,3,-1],[1,2,6,1,6,8,1,8,9,8,6,7,-1],[2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1],[7,8,0,7,0,6,6,0,2,-1],[7,3,2,6,7,2,-1],[2,3,11,10,6,8,10,8,9,8,6,7,-1],[2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1],[1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1],[11,2,1,11,1,7,10,6,1,6,7,1,-1],[8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1],[0,9,1,11,6,7,-1],[7,8,0,7,0,6,3,11,0,11,6,0,-1],[7,11,6,-1],[7,6,11,-1],[3,0,8,11,7,6,-1],[0,1,9,11,7,6,-1],[8,1,9,8,3,1,11,7,6,-1],[10,1,2,6,11,7,-1],[1,2,10,3,0,8,6,11,7,-1],[2,9,0,2,10,9,6,11,7,-1],[6,11,7,2,10,3,10,8,3,10,9,8,-1],[7,2,3,6,2,7,-1],[7,0,8,7,6,0,6,2,0,-1],[2,7,6,2,3,7,0,1,9,-1],[1,6,2,1,8,6,1,9,8,8,7,6,-1],[10,7,6,10,1,7,1,3,7,-1],[10,7,6,1,7,10,1,8,7,1,0,8,-1],[0,3,7,0,7,10,0,10,9,6,10,7,-1],[7,6,10,7,10,8,8,10,9,-1],[6,8,4,11,8,6,-1],[3,6,11,3,0,6,0,4,6,-1],[8,6,11,8,4,6,9,0,1,-1],[9,4,6,9,6,3,9,3,1,11,3,6,-1],[6,8,4,6,11,8,2,10,1,-1],[1,2,10,3,0,11,0,6,11,0,4,6,-1],[4,11,8,4,6,11,0,2,9,2,10,9,-1],[10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1],[8,2,3,8,4,2,4,6,2,-1],[0,4,2,4,6,2,-1],[1,9,0,2,3,4,2,4,6,4,3,8,-1],[1,9,4,1,4,2,2,4,6,-1],[8,1,3,8,6,1,8,4,6,6,10,1,-1],[10,1,0,10,0,6,6,0,4,-1],[4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1],[10,9,4,6,10,4,-1],[4,9,5,7,6,11,-1],[0,8,3,4,9,5,11,7,6,-1],[5,0,1,5,4,0,7,6,11,-1],[11,7,6,8,3,4,3,5,4,3,1,5,-1],[9,5,4,10,1,2,7,6,11,-1],[6,11,7,1,2,10,0,8,3,4,9,5,-1],[7,6,11,5,4,10,4,2,10,4,0,2,-1],[3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1],[7,2,3,7,6,2,5,4,9,-1],[9,5,4,0,8,6,0,6,2,6,8,7,-1],[3,6,2,3,7,6,1,5,0,5,4,0,-1],[6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1],[9,5,4,10,1,6,1,7,6,1,3,7,-1],[1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1],[4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1],[7,6,10,7,10,8,5,4,10,4,8,10,-1],[6,9,5,6,11,9,11,8,9,-1],[3,6,11,0,6,3,0,5,6,0,9,5,-1],[0,11,8,0,5,11,0,1,5,5,6,11,-1],[6,11,3,6,3,5,5,3,1,-1],[1,2,10,9,5,11,9,11,8,11,5,6,-1],[0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1],[11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1],[6,11,3,6,3,5,2,10,3,10,5,3,-1],[5,8,9,5,2,8,5,6,2,3,8,2,-1],[9,5,6,9,6,0,0,6,2,-1],[1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1],[1,5,6,2,1,6,-1],[1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1],[10,1,0,10,0,6,9,5,0,5,6,0,-1],[0,3,8,5,6,10,-1],[10,5,6,-1],[11,5,10,7,5,11,-1],[11,5,10,11,7,5,8,3,0,-1],[5,11,7,5,10,11,1,9,0,-1],[10,7,5,10,11,7,9,8,1,8,3,1,-1],[11,1,2,11,7,1,7,5,1,-1],[0,8,3,1,2,7,1,7,5,7,2,11,-1],[9,7,5,9,2,7,9,0,2,2,11,7,-1],[7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1],[2,5,10,2,3,5,3,7,5,-1],[8,2,0,8,5,2,8,7,5,10,2,5,-1],[9,0,1,5,10,3,5,3,7,3,10,2,-1],[9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1],[1,3,5,3,7,5,-1],[0,8,7,0,7,1,1,7,5,-1],[9,0,3,9,3,5,5,3,7,-1],[9,8,7,5,9,7,-1],[5,8,4,5,10,8,10,11,8,-1],[5,0,4,5,11,0,5,10,11,11,3,0,-1],[0,1,9,8,4,10,8,10,11,10,4,5,-1],[10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1],[2,5,1,2,8,5,2,11,8,4,5,8,-1],[0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1],[0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1],[9,4,5,2,11,3,-1],[2,5,10,3,5,2,3,4,5,3,8,4,-1],[5,10,2,5,2,4,4,2,0,-1],[3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1],[5,10,2,5,2,4,1,9,2,9,4,2,-1],[8,4,5,8,5,3,3,5,1,-1],[0,4,5,1,0,5,-1],[8,4,5,8,5,3,9,0,5,0,3,5,-1],[9,4,5,-1],[4,11,7,4,9,11,9,10,11,-1],[0,8,3,4,9,7,9,11,7,9,10,11,-1],[1,10,11,1,11,4,1,4,0,7,4,11,-1],[3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1],[4,11,7,9,11,4,9,2,11,9,1,2,-1],[9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1],[11,7,4,11,4,2,2,4,0,-1],[11,7,4,11,4,2,8,3,4,3,2,4,-1],[2,9,10,2,7,9,2,3,7,7,4,9,-1],[9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1],[3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1],[1,10,2,8,7,4,-1],[4,9,1,4,1,7,7,1,3,-1],[4,9,1,4,1,7,0,8,1,8,7,1,-1],[4,0,3,7,4,3,-1],[4,8,7,-1],[9,10,8,10,11,8,-1],[3,0,9,3,9,11,11,9,10,-1],[0,1,10,0,10,8,8,10,11,-1],[3,1,10,11,3,10,-1],[1,2,11,1,11,9,9,11,8,-1],[3,0,9,3,9,11,1,2,9,2,11,9,-1],[0,2,11,8,0,11,-1],[3,2,11,-1],[2,3,8,2,8,10,10,8,9,-1],[9,10,2,0,9,2,-1],[2,3,8,2,8,10,0,1,8,1,10,8,-1],[1,10,2,-1],[1,3,8,9,1,8,-1],[0,9,1,-1],[0,3,8,-1],[-1]],Bs=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]],xh=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];function xv(i,t,e,n,s){const r=t,o=(n[0]-e[0])/(r-1),a=(n[1]-e[1])/(r-1),l=(n[2]-e[2])/(r-1),c=[],h=[],u=new Map;function d(x,w,A){return x*r*r+w*r+A}function f(x,w,A){return i[d(x,w,A)]}function g(x,w,A){return[e[0]+x*o,e[1]+w*a,e[2]+A*l]}function _(x,w,A,C){const[P,S]=xh[C],v=Bs[P],E=Bs[S],L=f(x+v[0],w+v[1],A+v[2]),D=f(x+E[0],w+E[1],A+E[2]);let U=.5;const B=D-L;Math.abs(B)>1e-10&&(U=(s-L)/B,U=Math.max(0,Math.min(1,U)));const F=g(x+v[0],w+v[1],A+v[2]),q=g(x+E[0],w+E[1],A+E[2]);return[F[0]+U*(q[0]-F[0]),F[1]+U*(q[1]-F[1]),F[2]+U*(q[2]-F[2])]}function m(x,w,A,C){const[P,S]=xh[C],v=Bs[P],E=Bs[S],L=x+v[0],D=w+v[1],U=A+v[2],B=x+E[0],F=w+E[1],q=A+E[2],V=L<=B&&D<=F&&U<=q?`${L},${D},${U}-${B},${F},${q}`:`${B},${F},${q}-${L},${D},${U}`;if(u.has(V))return u.get(V);const tt=_(x,w,A,C),X=c.length/3;return c.push(tt[0],tt[1],tt[2]),u.set(V,X),X}for(let x=0;x<r-1;x++)for(let w=0;w<r-1;w++)for(let A=0;A<r-1;A++){const C=new Array(8);let P=!1;for(let L=0;L<8;L++){const D=Bs[L];if(C[L]=f(x+D[0],w+D[1],A+D[2]),!isFinite(C[L])){P=!0;break}}if(P)continue;let S=0;for(let L=0;L<8;L++)C[L]<s&&(S|=1<<L);if(_v[S]===0)continue;const E=vv[S];for(let L=0;L<E.length&&E[L]!==-1;L+=3){const D=m(x,w,A,E[L]),U=m(x,w,A,E[L+1]),B=m(x,w,A,E[L+2]);h.push(D,U,B)}}const p=new Float32Array(c),y=new Uint32Array(h),M=Mv(p,y);return{positions:p,normals:M,indices:y}}function Mv(i,t){const e=new Float32Array(i.length);for(let n=0;n<t.length;n+=3){const s=t[n]*3,r=t[n+1]*3,o=t[n+2]*3,a=i[r]-i[s],l=i[r+1]-i[s+1],c=i[r+2]-i[s+2],h=i[o]-i[s],u=i[o+1]-i[s+1],d=i[o+2]-i[s+2],f=l*d-c*u,g=c*h-a*d,_=a*u-l*h;e[s]+=f,e[s+1]+=g,e[s+2]+=_,e[r]+=f,e[r+1]+=g,e[r+2]+=_,e[o]+=f,e[o+1]+=g,e[o+2]+=_}for(let n=0;n<e.length;n+=3){const s=Math.sqrt(e[n]*e[n]+e[n+1]*e[n+1]+e[n+2]*e[n+2]);s>0&&(e[n]/=s,e[n+1]/=s,e[n+2]/=s)}return e}const yv=[4e4,2e4,1e4,5e3,2e3,1e3,500,200],Sv=[1.5,2,3,4,5,6,8,10];function bv(i,t={}){const e=new yn,n=t.opacity??.2,s=t.clippingPlanes||[],r=t.mode||"fieldStrength";return[...i].sort((a,l)=>r==="lShell"?l.level-a.level:a.level-l.level).forEach((a,l)=>{if(a.positions.length===0)return;const c=new Ae;c.setAttribute("position",new de(a.positions,3)),c.setAttribute("normal",new de(a.normals,3)),c.setIndex(new de(a.indices,1));let h;r==="lShell"?h=j1(a.level,1,12):h=K1(a.level,100,5e4);const u=new xu({color:h,emissive:h,emissiveIntensity:.25,transparent:!0,opacity:n,depthWrite:!1,side:en,roughness:.6,metalness:0,clippingPlanes:s}),d=new Ee(c,u);d.renderOrder=l,d.userData.isoLevel=a.level,e.add(d)}),e}function Fu(i){i&&i.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()})}function Ev(i,t){i&&i.traverse(e=>{e.material&&e.material.opacity!==void 0&&(e.material.opacity=t)})}function Av(i,t){i&&i.traverse(e=>{e.material&&(e.material.clippingPlanes=t,e.material.needsUpdate=!0)})}const Tv=38*Math.PI/180,wv=28*Math.PI/180,Cv=[{name:"innerBelt",label:"Inner Belt",lMin:1.2,lMax:2,latLimit:Tv,color:new Ot(.9,.4,.1),opacity:.12},{name:"outerBelt",label:"Outer Belt",lMin:3,lMax:5,latLimit:wv,color:new Ot(0,.75,.75),opacity:.08}];function Rv(i,t,e,n,s){const r=[],o=c=>Math.cos(Math.PI/2*Math.abs(c)/e);for(let c=0;c<=n;c++){const h=-e+2*e*c/n,u=Math.cos(h),d=Math.sin(h);r.push(i*u*u*u,i*u*u*d)}for(let c=n;c>=0;c--){const h=-e+2*e*c/n,u=i+(t-i)*o(h),d=Math.cos(h),f=Math.sin(h);r.push(u*d*d*d,u*d*d*f)}const a=r.length/2,l=new Float32Array((s+1)*a*3);for(let c=0;c<=s;c++){const h=2*Math.PI*c/s,u=Math.cos(h),d=Math.sin(h);for(let f=0;f<a;f++){const g=r[f*2],_=r[f*2+1],m=(c*a+f)*3;l[m]=g*u,l[m+1]=_,l[m+2]=g*d}}return{positions:l,nP:a}}function Pv(i,t){const e=[];for(let n=0;n<t;n++)for(let s=0;s<i;s++){const r=(s+1)%i,o=n*i+s,a=n*i+r,l=(n+1)*i+s,c=(n+1)*i+r;e.push(o,l,a),e.push(a,l,c)}return new Uint32Array(e)}function Lv(i={}){const{showInnerBelt:t=!0,showOuterBelt:e=!0,clippingPlanes:n=[],opacity:s,sunDirX:r=1,sunDirZ:o=0,stormIntensity:a=0}=i,l=new yn,c=80,h=120;for(const u of Cv){if(!(u.name==="innerBelt"&&t||u.name==="outerBelt"&&e))continue;const{positions:f,nP:g}=Rv(u.lMin,u.lMax,u.latLimit,c,h);u.name==="outerBelt"&&a>.01&&Dv({positions:f},r,o,a);const _=Pv(g,h),m=new Ae;m.setAttribute("position",new de(f,3)),m.setIndex(new de(_,1)),m.computeVertexNormals();const p=new xu({color:u.color,emissive:u.color,emissiveIntensity:.15,transparent:!0,opacity:s??u.opacity,depthWrite:!1,side:en,roughness:.55,metalness:0,clippingPlanes:n}),y=new Ee(m,p);y.renderOrder=u.name==="innerBelt"?10:11,y.userData.beltName=u.name,l.add(y)}return l}function Ou(i){i&&i.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()})}function Dv(i,t,e,n,s=.22){if(n<.01)return;const r=i.positions;for(let o=0,a=r.length/3;o<a;o++){const l=r[3*o],c=r[3*o+1],h=r[3*o+2],u=Math.sqrt(l*l+h*h),d=u>1e-6?(l*t+h*e)/u:0,f=1-n*s*d;r[3*o]=l*f,r[3*o+1]=c*f,r[3*o+2]=h*f}}function Iv(i,t,e){if(!i)return;const n=e/.15;i.traverse(s=>{if(!s.isMesh||!s.material)return;const r=s.userData.beltName;if(r==="innerBelt")s.material.opacity=Math.min(1,(.06+.1*t.innerFlux)*n),s.material.emissiveIntensity=.08+.14*t.innerFlux;else if(r==="outerBelt"){s.material.opacity=Math.min(1,(.03+.2*t.outerFlux)*n),s.material.emissiveIntensity=.05+.17*t.outerFlux;const o=t.outerFlux*.7;s.material.emissive.setRGB(0+.5*o,.75+.25*o,.75+.25*o),s.material.needsUpdate=!0}})}function Uv(i,t){i&&i.traverse(e=>{e.material&&(e.material.clippingPlanes=t,e.material.needsUpdate=!0)})}const Nv=16726e-31;function Fv(i,t){return .5*(t*1e6)*Nv*(i*1e3)**2*1e9}function Ro(i){if(!(i!=null&&i.enabled))return 0;const t=Fv(i.vSw,i.nSw),e=Math.min(6,Math.max(0,-i.dst/15)),n=Math.min(2,Math.max(0,(t-2)/1.5));return Math.min(9,Math.max(0,e+.2*n))}function Bu(i,t){const n=Math.min(1,Math.max(0,.1+.15*i)),s=t<-100?Math.min(.6,Math.max(0,(-t-100)/100)):0;return{innerFlux:.65,outerFlux:n,slotFlux:s}}function Ov(){const i=new gn(new O(0,1,0),0),t=new gn(new O(1,0,0),0);function e(s){const r=s*(Math.PI/180);t.normal.set(Math.cos(r),0,Math.sin(r))}function n(s,r){const o=[];return s&&o.push(i),r&&o.push(t),o}return{equatorial:i,meridional:t,setMeridionalAngle:e,getActivePlanes:n}}function Bv(i,t){const n=Math.max(1e-10,Math.min(Math.PI-1e-10,t)),s=Math.cos(n),r=Math.sin(n),o=new Array(i+1),a=new Array(i+1);for(let l=0;l<=i;l++)o[l]=new Float64Array(l+1),a[l]=new Float64Array(l+1);if(o[0][0]=1,a[0][0]=0,i===0)return{P:o,dP:a};o[1][0]=s,o[1][1]=r,a[1][0]=-r,a[1][1]=s;for(let l=2;l<=i;l++){const c=Math.sqrt(1-1/(2*l));o[l][l]=c*r*o[l-1][l-1],a[l][l]=c*(s*o[l-1][l-1]+r*a[l-1][l-1])}for(let l=2;l<=i;l++)o[l][l-1]=s*Math.sqrt(2*l-1)*o[l-1][l-1],a[l][l-1]=Math.sqrt(2*l-1)*(-r*o[l-1][l-1]+s*a[l-1][l-1]);for(let l=2;l<=i;l++)for(let c=0;c<=l-2;c++){const h=l*l-c*c,u=(2*l-1)/Math.sqrt(h),d=Math.sqrt(((l-1)*(l-1)-c*c)/h);o[l][c]=u*s*o[l-1][c]-d*o[l-2][c],a[l][c]=u*(-r*o[l-1][c]+s*a[l-1][c])-d*a[l-2][c]}return{P:o,dP:a}}function Po(i,t,e,n,s){var _;const r=n.referenceRadius,o=s||n.nmax,{g:a,h:l}=n,{P:c,dP:h}=Bv(o,t),u=Math.sin(Math.max(1e-10,Math.min(Math.PI-1e-10,t)));let d=0,f=0,g=0;for(let m=1;m<=o;m++){const p=Math.pow(r/i,m+2);for(let y=0;y<=m;y++){const M=a[m][y],x=((_=l[m])==null?void 0:_[y])||0,w=Math.cos(y*e),A=Math.sin(y*e),C=M*w+x*A;d+=(m+1)*p*C*c[m][y],f-=p*C*h[m][y],y>0&&(g+=p*y*(M*A-x*w)*c[m][y]/u)}}return[d,f,g]}function Mh(i,t,e,n,s){const[r,o,a]=Po(i,t,e,n,s);return Math.sqrt(r*r+o*o+a*a)}function zv(i,t,e){const n=Math.sin(t);return[i*n*Math.cos(e),i*Math.cos(t),i*n*Math.sin(e)]}function kv(i,t,e,n,s){const r=Math.sin(n),o=Math.cos(n),a=Math.sin(s),l=Math.cos(s),c=i*r*l+t*o*l-e*a,h=i*o-t*r,u=i*r*a+t*o*a+e*l;return[c,h,u]}function Vv(i,t,e,n,s){const r=Math.sin(n),o=Math.cos(n),a=Math.sin(s),l=Math.cos(s),c=i*r*l+t*o+e*r*a,h=i*o*l-t*r+e*o*a,u=-i*a+e*l;return[c,h,u]}function Hv(i,t,e,n,s){const r=[1,2.47341,.40791,.30429,-.10637,-.89108,3.2935,-.05413,-.00696,1.07869,-.02314,-.66173,-.68018,-.03246,.02681,.28062,.16535,-.02939,.02639,-.24891,-.08063,.089,-.02475,.05887,.57691,.65256,-.0323,2.24733,4.10546,1.13665,.05506,.97669,.21164,.64594,1.12556,.01389,1.02978,.02968,.15821,9.00519,28.17582,1.35285,.42279],o=i[0],a=i[1]*.8-13*Math.sqrt(o),l=i[2],c=i[3],h=i[4],u=i[5];return Gv(r,o,a,l,c,h,u,t,e,n,s)}function Gv(i,t,e,n,s,r,o,a,l,c,h){const u=Math.pow(t/2,i[38]),d=i[39],f=i[40],g=u*u*u,_=l*u,m=c*u,p=h*u;let y=0;if(n!==0||s!==0){let Zt=Math.atan2(n,s);Zt<=0&&(Zt+=2*Math.PI);const k=Math.sin(Zt*.5);y=k*k}const M=i[25]+i[26]*o,x=0,w=i[27],A=i[28],C=i[34]+i[35]*o,P=i[36]+i[37]*o,S=Math.abs(e)<20?20:Math.abs(e),v=i[29]*Math.pow(20/S,i[30])*u,E=i[31]*Math.pow(20/S,i[32])*u,L=1.5707963*Math.tanh(Math.abs(e)/i[33]),[D,U,B]=Wv(_,m,p,a),F=D*g,q=U*g,V=B*g,[tt,X,nt,ct,et,N]=Xv(a,_,m,p,d,f,M,x,w,A),[W,$,K,lt,st,ht,At,wt,Nt,I,Gt,Rt]=Yv(a,_,m,p,C,P),[Lt,pt,dt,Ct,R,b]=Zv(a,_,m,p,v,E,L),G=Math.pow(t/2,i[41]),it=Math.pow(t/2,i[42]),rt=i[1]+i[2]*G+i[3]*r+i[4]*e,Z=i[5]+i[6]*it+i[7]*r+i[8]*e,vt=i[9]+i[10]*e+i[11]*Math.sqrt(t),ft=i[12]+i[13]*e+i[14]*Math.sqrt(t),gt=i[15]+i[16]*o,zt=i[17]+i[18]*o,ut=i[19]+i[20]*o,St=i[21]+i[22]*o,Dt=i[23],Ut=i[24]*y,_t=i[0]*F+rt*tt+Z*ct+vt*Lt+ft*Ct+gt*W+zt*lt+ut*At+St*I,Wt=i[0]*q+rt*X+Z*et+vt*pt+ft*R+gt*$+zt*st+ut*wt+St*Gt+(Dt+Ut)*n,Vt=i[0]*V+rt*nt+Z*N+vt*dt+ft*b+gt*K+zt*ht+ut*Nt+St*Rt+(Dt+Ut)*s;return[_t,Wt,Vt]}function Wv(i,t,e,n){const s=[-901.2327248,895.8011176,817.6208321,-845.5880889,-83.73539535,86.58542841,336.8781402,-329.3619944,-311.294712,308.6011161,31.94469304,-31.30824526,125.8739681,-372.3384278,-235.4720434,286.7594095,21.86305585,-27.42344605,-150.4874688,2.669338538,1.395023949,-.5540427503,-56.85224007,3.681827033,-43.48705106,5.103131905,1.073551279,-.6673083508,12.21404266,4.177465543,5.799964188,-.3977802319,-1.044652977,.570356001,3.536082962,-3.222069852,9.620648151,6.082014949,27.75216226,12.44199571,5.122226936,6.982039615,20.12149582,6.150973118,4.663639687,15.73319647,2.303504968,5.840511214,.08385953499,.3477844929],r=s[36],o=s[37],a=s[38],l=s[39],c=s[40],h=s[41],u=s[42],d=s[43],f=s[44],g=s[45],_=s[46],m=s[47],p=s[48],y=s[49],M=Math.cos(n),x=Math.sin(n),w=2*M,A=Math.sin(n*p),C=Math.cos(n*p),P=Math.sin(n*y),S=Math.cos(n*y),v=i*C-e*A,E=i*A+e*C,L=i*S-e*P,D=i*P+e*S;function U(z,ot,mt,Et){const Mt=Math.sqrt(1/(z*z)+1/(ot*ot)),Ft=Math.cos(t/z),kt=Math.sin(t/z),It=Math.cos(mt/ot),Xt=Math.sin(mt/ot),qt=Math.exp(Mt*Et),ee=-Mt*qt*Ft*Xt,ie=qt/z*kt*Xt,$t=-qt*Ft/ot*It;return[ee*C+$t*A,ie,-ee*A+$t*C]}function B(z,ot,mt,Et){const Mt=Math.sqrt(1/(z*z)+1/(ot*ot)),Ft=Math.cos(t/z),kt=Math.sin(t/z),It=Math.cos(mt/ot),Xt=Math.sin(mt/ot),qt=Math.exp(Mt*Et),ee=-qt*Ft*(Mt*mt*It+Xt/ot*(Et+1/Mt)),ie=qt/z*kt*(mt*It+Et/ot*Xt/Mt),$t=-qt*Ft*(It*(1+Et/(ot*ot)/Mt)-mt/ot*Xt);return[ee*C+$t*A,ie,-ee*A+$t*C]}const[F,q,V]=U(r,l,E,v),[tt,X,nt]=U(r,c,E,v),[ct,et,N]=B(r,h,E,v),[W,$,K]=U(o,l,E,v),[lt,st,ht]=U(o,c,E,v),[At,wt,Nt]=B(o,h,E,v),[I,Gt,Rt]=U(a,l,E,v),[Lt,pt,dt]=U(a,c,E,v),[Ct,R,b]=B(a,h,E,v),G=s[0]+s[1]*M,it=s[2]+s[3]*M,rt=s[4]+s[5]*M,Z=s[6]+s[7]*M,vt=s[8]+s[9]*M,ft=s[10]+s[11]*M,gt=s[12]+s[13]*M,zt=s[14]+s[15]*M,ut=s[16]+s[17]*M;let St=G*F+it*tt+rt*ct+Z*W+vt*lt+ft*At+gt*I+zt*Lt+ut*Ct,Dt=G*q+it*X+rt*et+Z*$+vt*st+ft*wt+gt*Gt+zt*pt+ut*R,Ut=G*V+it*nt+rt*N+Z*K+vt*ht+ft*Nt+gt*Rt+zt*dt+ut*b;function _t(z,ot,mt,Et){const Mt=Math.sqrt(1/(z*z)+1/(ot*ot)),Ft=Math.cos(t/z),kt=Math.sin(t/z),It=Math.cos(mt/ot),Xt=Math.sin(mt/ot),qt=Math.exp(Mt*Et)*x,ee=-Mt*qt*Ft*It,ie=qt/z*kt*It,$t=qt/ot*Ft*Xt;return[ee*S+$t*P,ie,-ee*P+$t*S]}const[Wt,Vt,Zt]=_t(u,g,D,L),[k,xt,J]=_t(u,_,D,L),[at,Tt,bt]=_t(u,m,D,L),[Ht,le,ye]=_t(d,g,D,L),[Qt,Ge,an]=_t(d,_,D,L),[sr,rr,Tn]=_t(d,m,D,L),[Ss,or,ar]=_t(f,g,D,L),[Ti,lr,wi]=_t(f,_,D,L),[cr,hr,Uo]=_t(f,m,D,L),bs=s[18]+s[19]*w,Es=s[20]+s[21]*w,As=s[22]+s[23]*w,Ts=s[24]+s[25]*w,ws=s[26]+s[27]*w,T=s[28]+s[29]*w,H=s[30]+s[31]*w,Y=s[32]+s[33]*w,j=s[34]+s[35]*w;return St+=bs*Wt+Es*k+As*at+Ts*Ht+ws*Qt+T*sr+H*Ss+Y*Ti+j*cr,Dt+=bs*Vt+Es*xt+As*Tt+Ts*le+ws*Ge+T*rr+H*or+Y*lr+j*hr,Ut+=bs*Zt+Es*J+As*bt+Ts*ye+ws*an+T*Tn+H*ar+Y*wi+j*Uo,[St,Dt,Ut]}function Xv(i,t,e,n,s,r,o,a,l,c){const d=Math.sin(i),f=t*t+e*e+n*n,g=Math.sqrt(f),_=n/g,m=s+-5.2*_*_,p=-_/g*2*-5.2*_,y=2*-5.2*_/g,M=g/m,x=Math.pow(1+Math.pow(M,3),-1/3),w=-Math.pow(M,2)*Math.pow(x,4)/m,A=-M*w,C=d*x,P=Math.sqrt(1-C*C),S=t*P-n*C,v=t*C+n*P,E=d/P*(w+A*p)/g,L=E*t,D=E*e,U=E*n+d/P*A*y,B=P-v*L,F=-v*D,q=-C-v*U,V=C+S*L,tt=S*D,X=P+S*U,nt=q*tt-F*X,ct=B*X-q*V,et=V*F-B*tt,[N,W,$,K,lt,st]=qv(i,S,e,v,r,o,a,l,c),ht=N*X-$*q+W*nt,At=W*ct,wt=$*B-N*V+W*et,Nt=K*X-st*q+lt*nt,I=lt*ct,Gt=st*B-K*V+lt*et;return[ht,At,wt,Nt,I,Gt]}function qv(i,t,e,n,s,r,o,a,l){const h=Math.sin(i),u=e*e+n*n,d=Math.sqrt(u);let f,g,_;e===0&&n===0?(f=0,g=1,_=0):(f=Math.atan2(n,e),g=e/d,_=n/d);const m=400*20*20,p=d/(u*u+m),y=f+s*u*p*g*h,M=1-s*u*p*_*h,x=s*p*p*(3*m-u*u)*g*h,w=Math.cos(y),A=Math.sin(y),C=d*w,P=d*A,[S,v,E,L,D,U]=$v(t,C,P,r,o,a,l),B=v*w+E*A,F=-v*A+E*w,q=B*M,V=F-d*(B*x),tt=S*M,X=q*g-V*_,nt=q*_+V*g,ct=D*w+U*A,et=-D*A+U*w,N=ct*M,W=et-d*(ct*x),$=L*M,K=N*g-W*_,lt=N*_+W*g;return[tt,X,nt,$,K,lt]}function $v(i,t,e,n,s,r,o){const _=[-25.45869857,57.3589908,317.5501869,-2.626756717,-93.38053698,-199.6467926,-858.8129729,34.09192395,845.4214929,-29.07463068,47.10678547,-128.9797943,-781.7512093,6.165038619,167.8905046,492.068041,1654.724031,-46.7733792,-1635.922669,40.86186772,-.1349775602,-.09661991179,-.1662302354,.002810467517,.2487355077,.1025565237,-14.41750229,-.8185333989,11.07693629,.7569503173,-9.655264745,112.2446542,777.5948964,-5.745008536,-83.03921993,-490.2278695,-1155.004209,39.0802332,1172.780574,-39.44349797,-14.07211198,-40.41201127,-313.2277343,2.203920979,8.232835341,197.7065115,391.2733948,-18.57424451,-437.2779053,23.04976898,11.75673963,13.60497313,4.69192706,18.20923547,27.59044809,6.677425469,1.398283308,2.839005878,31.24817706,24.53577264],m=[-287187.1962,4970.499233,410490.1952,-1347.839052,-386370.324,3317.98375,-143462.3895,5706.513767,171176.2904,250.888275,-506570.8891,5733.592632,397975.5842,9771.762168,-941834.2436,7990.97526,54313.10318,447.538806,528046.3449,12751.04453,-21920.98301,-21.05075617,31971.07875,3012.641612,-301822.9103,-3601.107387,1797.577552,-6.315855803,142578.8406,13161.9364,804184.841,-14168.99698,-851926.636,-1890.885671,972475.6869,-8571.862853,26432.49197,-2554.752298,-482308.3431,-4391.473324,105155.916,-1134.62205,-74353.53091,-5382.670711,695055.0788,-916.3365144,-12111.06667,67.20923358,-367200.9285,-21414.14421,14.75567902,20.7563819,59.78601609,16.86431444,32.58482365,23.69472951,17.24977936,13.64902647,68.40989058,11.67828167];let p=0,y=0,M=0,x=0,w=0,A=0;{const C=(i-6-n)*1.1- -1.200000000000001,P=t*1.1,S=e*1.1,v=r*1.1,[E,L,D]=Sh(v,1,o,C,P,S),[U,B,F]=yh(_,i,t,e,n);p=E+U,y=L+B,M=D+F}{const C=(i-4-s)*.25-9,P=t*.25,S=e*.25,v=r*.25,[E,L,D]=Sh(v,0,o,C,P,S),[U,B,F]=yh(m,i,t,e,s);x=E+U,w=L+B,A=D+F}return[p,y,M,x,w,A]}function yh(i,t,e,n,s){let r=0,o=0,a=0,l=0;for(let c=0;c<5;c++){const h=1/i[50+c],u=Math.cos(e*h),d=Math.sin(e*h);for(let f=0;f<5;f++){const g=1/i[55+f],_=Math.sin(n*g),m=Math.cos(n*g),p=Math.sqrt(h*h+g*g),y=Math.exp(t*p),M=-p*y*u*_,x=h*y*d*_,w=-g*y*u*m,A=i[l]+i[l+1]*s;l+=2,r+=A*M,o+=A*x,a+=A*w}}return[r,o,a]}function Sh(i,t,e,n,s,r){const o=[-71.09346626,-1014.308601,-1272.939359,-3224.935936,-44546.86232],a=[10.90101242,12.68393898,13.51791954,14.86775017,15.12306404],l=[.7954069972,.6716601849,1.174866319,2.56524992,10.0198679],c=Math.sqrt(n*n+s*s),h=n/c,u=s/c,d=Math.exp(n/7),f=i+e*(s/20)*(s/20)+t*d,g=e*s*.005,_=t/7*d,m=Math.sqrt(r*r+f*f),p=f*_/m,y=f*g/m,M=r/m;let x=0,w=0,A=0;for(let C=0;C<5;C++){const P=a[C],S=l[C],v=Math.sqrt((c+P)*(c+P)+(m+S)*(m+S)),E=Math.sqrt((c-P)*(c-P)+(m+S)*(m+S)),L=(c+P)/v,D=(c-P)/E,U=(m+S)/v,B=(m+S)/E,F=L*h+U*p,q=L*u+U*y,V=U*M,tt=D*h+B*p,X=D*u+B*y,nt=B*M,ct=v*E,et=v+E,N=et*et,W=2*P,$=Math.sqrt(N-W*W),K=$/(ct*N),lt=(1/($*E)-K/et*(E*E+v*(3*v+4*E)))/(v*et),st=(1/($*v)-K/et*(v*v+E*(3*E+4*v)))/(E*et),ht=lt*F+st*tt,At=lt*q+st*X,wt=lt*V+st*nt;x-=o[C]*n*wt,w-=o[C]*s*wt,A+=o[C]*(2*K+n*ht+s*At)}return[x,w,A]}function Yv(i,t,e,n,s,r){const o=[46488.84663,-15541.95244,-23210.09824,-32625.03856,-109894.4551,-71415.32808,58168.94612,55564.87578,-22890.60626,-6056.763968,5091.3681,239.7001538,-13899.49253,4648.016991,6971.310672,9699.351891,32633.34599,21028.48811,-17395.9619,-16461.11037,7447.621471,2528.844345,-1934.094784,-588.3108359,-32588.88216,10894.11453,16238.25044,22925.60557,77251.11274,50375.97787,-40763.78048,-39088.6066,15546.53559,3559.617561,-3187.730438,309.1487975,88.22153914,-243.0721938,-63.63543051,191.1109142,69.94451996,-187.9539415,-49.89923833,104.0902848,-120.2459738,253.5572433,89.25456949,-205.6516252,-44.93654156,124.7026309,32.53005523,-98.85321751,-36.51904756,98.8824169,24.88493459,-55.04058524,61.14493565,-128.4224895,-45.3502346,105.0548704,-43.66748755,119.3284161,31.38442798,-92.87946767,-33.52716686,89.98992001,25.87341323,-48.86305045,59.69362881,-126.5353789,-44.39474251,101.5196856,59.41537992,41.18892281,80.861012,3.066809418,7.893523804,30.56212082,10.36861082,8.222335945,19.97575641,2.050148531,4.992657093,2.300564232,.2256245602,-.05841594319],a=[210260.4816,-1443587401e-3,-1468919281e-3,281939.2993,-1131124839e-3,729331.7943,2573541307e-3,304616.7457,468887.5847,181554.7517,-130072265e-2,-257012.8601,645888.8041,-2048126412e-3,-2529093041e-3,571093.7972,-2115508353e-3,1122035951e-3,4489168802e-3,75234.22743,823905.6909,147926.6121,-2276322876e-3,-155528.5992,-858076.2979,3474422388e-3,3986279931e-3,-834613.9747,3250625781e-3,-1818680377e-3,-7040468986e-3,-414359.6073,-1295117666e-3,-346320.6487,3565527409e-3,430091.9496,-.1565573462,7.377619826,.4115646037,-6.14607888,3.808028815,-.5232034932,1.454841807,-12.32274869,-4.466974237,-2.941184626,-.6172620658,12.6461349,1.494922012,-21.35489898,-1.65225696,16.81799898,-1.404079922,-24.09369677,-10.99900839,45.9423782,2.248579894,31.91234041,7.575026816,-45.80833339,-1.507664976,14.60016998,1.348516288,-11.05980247,-5.402866968,31.69094514,12.28261196,-37.55354174,4.155626879,-33.70159657,-8.437907434,36.22672602,145.0262164,70.73187036,85.51110098,21.47490989,24.34554406,31.34405345,4.655207476,5.747889264,7.802304187,1.844169801,4.86725455,2.941393119,.1379899178,.06607020029],l=[162294.6224,503885.1125,-27057.67122,-531450.1339,84747.05678,-237142.1712,84133.6149,259530.0402,69196.0516,-189093.5264,-19278.55134,195724.5034,-263082.6367,-818899.6923,43061.10073,863506.6932,-139707.9428,389984.885,-135167.5555,-426286.9206,-109504.0387,295258.3531,30415.07087,-305502.9405,100785.34,315010.9567,-15999.50673,-332052.2548,54964.34639,-152808.375,51024.67566,166720.0603,40389.67945,-106257.7272,-11126.14442,109876.2047,2.978695024,558.6019011,2.685592939,-338.000473,-81.9972409,-444.1102659,89.44617716,212.0849592,-32.58562625,-982.7336105,-35.10860935,567.8931751,-1.917212423,-260.2023543,-1.023821735,157.5533477,23.00200055,232.0603673,-36.79100036,-111.9110936,18.05429984,447.0481,15.10187415,-258.7297813,-1.032340149,-298.6402478,-1.676201415,180.5856487,64.52313024,209.0160857,-53.8557401,-98.5216429,14.35891214,536.7666279,20.09318806,-309.734953,58.54144539,67.4522685,97.92374406,4.75244976,10.46824379,32.9185611,12.05124381,9.962933904,15.91258637,1.804233877,6.578149088,2.515223491,.1930034238,-.02261109942],c=[-131287.8986,-631927.6885,-318797.4173,616785.8782,-50027.36189,863099.9833,47680.2024,-1053367944e-3,-501120.3811,-174400.9476,222328.6873,333551.7374,-389338.7841,-1995527467e-3,-982971.3024,1960434268e-3,297239.7137,2676525168e-3,-147113.4775,-3358059979e-3,-2106979191e-3,-462827.1322,101760796e-2,1039018475e-3,520266.9296,2627427473e-3,1301981763e-3,-2577171706e-3,-238071.9956,-3539781111e-3,94628.1642,4411304724e-3,2598205733e-3,637504.9351,-1234794298e-3,-1372562403e-3,-2.646186796,-31.10055575,2.295799273,19.20203279,30.01931202,-302.102855,-14.78310655,162.1561899,.4943938056,176.8089129,-.244492168,-100.6148929,9.172262228,137.430344,-8.451613443,-84.20684224,-167.3354083,1321.830393,76.89928813,-705.7586223,18.28186732,-770.1665162,-9.084224422,436.3368157,-6.374255638,-107.2730177,6.080451222,65.53843753,143.2872994,-1028.009017,-64.2273933,547.8536586,-20.58928632,597.3893669,10.17964133,-337.7800252,159.3532209,76.34445954,84.74398828,12.76722651,27.63870691,32.69873634,5.145153451,6.310949163,6.996159733,1.971629939,4.436299219,2.904964304,.1486276863,.06859991529],h=s-1.1,[u,d,f]=Hr(1,1,i,t,e,n,s),[g,_,m]=Gr(o,i,h,t,e,n),p=u+g,y=d+_,M=f+m,[x,w,A]=Hr(1,2,i,t,e,n,s),[C,P,S]=Gr(a,i,h,t,e,n),v=x+C,E=w+P,L=A+S,D=r-1,[U,B,F]=Hr(2,1,i,t,e,n,r),[q,V,tt]=Gr(l,i,D,t,e,n),X=U+q,nt=B+V,ct=F+tt,[et,N,W]=Hr(2,2,i,t,e,n,r),[$,K,lt]=Gr(c,i,D,t,e,n),st=et+$,ht=N+K,At=W+lt;return[p,y,M,v,E,L,X,nt,ct,st,ht,At]}function Hr(i,t,e,n,s,r,o){const d=[.161806835,-.1797957553,2.999642482,-.9322708978,-.681105976,.2099057262,-8.358815746,-14.8603355,.3838362986,-16.30945494,4.537022847,2.685836007,27.97833029,6.330871059,1.876532361,18.95619213,.96515281,.4217195118,-.0895777002,-1.823555887,.7457045438,-.5785916524,-1.010200918,.01112389357,.09572927448,-.3599292276,8.713700514,.9763932955,3.834602998,2.492118385,.7113544659],f=[.705802694,-.2845938535,5.715471266,-2.47282088,-.7738802408,.347829393,-11.37653694,-38.64768867,.6932927651,-212.4017288,4.944204937,3.071270411,33.05882281,7.387533799,2.366769108,79.22572682,.6154290178,.5592050551,-.1796585105,-1.65493221,.7309108776,-.4926292779,-1.130266095,-.009613974555,.1484586169,-.2215347198,7.883592948,.02768251655,2.950280953,1.212634762,.5567714182],g=[.1278764024,-.2320034273,1.805623266,-32.3724144,-.9931490648,.317508563,-2.492465814,-16.21600096,.2695393416,-6.752691265,3.971794901,14.54477563,41.10158386,7.91288973,1.258297372,9.583547721,1.014141963,.5104134759,-.1790430468,-1.756358428,.7561986717,-.6775248254,-.0401401642,.01446794851,.1200521731,-.2203584559,4.50896385,.8221623576,1.77993373,1.102649543,.886788002],_=[.4036015198,-.3302974212,2.82773093,-45.4440583,-1.611103927,.4927112073,-.003258457559,-49.59014949,.3796217108,-233.7884098,4.31266698,18.05051709,28.95320323,11.09948019,.7471649558,67.10246193,.5667096597,.6468519751,-.1560665317,-1.460805289,.7719653528,-.6658988668,2515179349e-15,.02426021891,.1195003324,-.2625739255,4.377172556,.2421190547,2.503482679,1.071587299,.724799743],m=i===1?.055:.03,p=i===1?.06:.09,y=n*o,M=s*o,x=r*o,w=y*y+x*x,A=Math.sqrt(w),C=Math.sqrt(y*y+M*M+x*x),P=49;let S;y===0&&x===0?S=0:S=Math.atan2(-x,y);const v=Math.sin(S),E=Math.cos(S),L=m+.5*P/(P+1)*(A*A-1)/(P+A*A),D=(C-1)/10,U=Math.pow(1+Math.pow(D,3),1/3),B=.9*e/U,F=S-L*Math.sin(S)-B,q=1-L*Math.cos(S),V=-2*.5*P*A/((P+A*A)*(P+A*A))*Math.sin(S)+.9*e*Math.pow(D,2)*A/(10*C*U*(1+Math.pow(D,3))),tt=.9*e*Math.pow(D,2)*M/(10*C*U*(1+Math.pow(D,3))),X=Math.sin(F),nt=Math.cos(F),ct=A*nt,et=-A*X;let N;i===1?N=t===1?d:f:N=t===1?g:_;const[W,$,K]=Kv(N,ct,M,et,p,t),lt=W*nt-K*X,st=-W*X-K*nt,ht=lt*q*o,At=(st-A*($*tt+lt*V))*o,wt=$*q*o,Nt=ht*E-At*v,I=wt,Gt=-ht*v-At*E;return[Nt,I,Gt]}function Kv(i,t,e,n,s,r){const[o,a,l]=bh(i,t,e,n,s,r),[c,h,u]=bh(i,t,-e,-n,s,r);return[o-c,a+h,l+u]}function bh(i,t,e,n,s,r){const l=i[30],c=t*t+e*e,h=Math.sqrt(c),u=Math.sqrt(c+n*n),d=Math.atan2(h,n),f=Math.atan2(e,t),g=zs(i,u,d),_=ks(i,u,d),[m,p]=jv(g,_,f,r,l,s),y=(zs(i,u+1e-6,d)-zs(i,u-1e-6,d))/(2*1e-6),M=(zs(i,u,d+1e-6)-zs(i,u,d-1e-6))/(2*1e-6),x=(ks(i,u+1e-6,d)-ks(i,u-1e-6,d))/(2*1e-6),w=(ks(i,u,d+1e-6)-ks(i,u,d-1e-6))/(2*1e-6),A=Math.sin(_)/Math.sin(d),C=g/u,P=-C/u*A*m*M,S=C*A*m*y,v=C*p*(y*w-M*x),E=h/u,L=n/u,D=h>0?e/h:0,U=h>0?t/h:1,B=P*E+S*L;return[i[0]*(B*U-v*D),i[0]*(B*D+v*U),i[0]*(P*L-S*E)]}function zs(i,t,e){const n=Math.cos(e),s=Math.cos(2*e);return t+i[1]/t+i[2]*t/Math.sqrt(t*t+i[10]*i[10])+i[3]*t/(t*t+i[11]*i[11])+(i[4]+i[5]/t+i[6]*t/Math.sqrt(t*t+i[12]*i[12])+i[7]*t/(t*t+i[13]*i[13]))*n+(i[8]*t/Math.sqrt(t*t+i[14]*i[14])+i[9]*t/Math.pow(t*t+i[15]*i[15],2))*s}function ks(i,t,e){const n=Math.sin(e),s=Math.sin(2*e),r=Math.sin(3*e);return e+(i[16]+i[17]/t+i[18]/(t*t)+i[19]*t/Math.sqrt(t*t+i[26]*i[26]))*n+(i[20]+i[21]*t/Math.sqrt(t*t+i[27]*i[27])+i[22]*t/(t*t+i[28]*i[28]))*s+(i[23]+i[24]/t+i[25]*t/(t*t+i[29]*i[29]))*r}function jv(i,t,e,n,s,r){const o=new Array(10).fill(0),a=new Array(10).fill(0),l=new Array(10).fill(0),c=new Array(10).fill(0),h=Math.sin(t),u=i*h,d=Math.cos(t),f=Math.sin(e),g=Math.cos(e),_=h/(1+d),m=h/(1-d),p=s+r,y=s-r;let M=0,x=0,w=0,A=0;t>=y&&(M=Math.tan(p*.5),x=Math.tan(y*.5),w=x*x,A=M*M);let C=1,P=0,S=1,v=1,E=1;for(let L=1;L<=n;L++){S=S*_,l[L-1]=C*g-P*f,c[L-1]=P*g+C*f,C=l[L-1],P=c[L-1];let D=0,U=0;if(t<y)D=S,U=.5*L*S*(_+m);else if(t<p){v=v*w;const B=1/(M-x),F=1/(2*L+1),q=v*x,V=1+_*_;D=B*(S*(M-_)+F*(S*_-q/S)),U=.5*L*B*V*(S/_*(M-_)-F*(S-q/(S*_)))}else{E=E*A,v=v*w;const B=1/(M-x),F=1/(2*L+1);D=B*F*(E*M-v*x)/S,U=-D*L*.5*(_+m)}o[L-1]=L*D*l[L-1]/u,a[L-1]=-U*c[L-1]/i}return[o[n-1]*800,a[n-1]*800]}function Gr(i,t,e,n,s,r){const o=Math.cos(t),a=Math.sin(t),l=2*o,c=t*i[84],h=t*i[85],u=Math.sin(c),d=Math.cos(c),f=Math.sin(h),g=Math.cos(h),_=n*d-r*u,m=n*u+r*d,p=n*g-r*f,y=n*f+r*g;let M=0,x=0,w=0,A=0;for(let C=0;C<2;C++)for(let P=0;P<3;P++){const S=i[72+P],v=i[78+P],E=Math.cos(s/S),L=Math.sin(s/S),D=Math.cos(s/v),U=Math.sin(s/v);for(let B=0;B<3;B++){const F=i[75+B],q=i[81+B],V=Math.sin(m/F),tt=Math.cos(m/F),X=Math.cos(y/q),nt=Math.sin(y/q),ct=Math.sqrt(1/(S*S)+1/(F*F)),et=Math.sqrt(1/(v*v)+1/(q*q)),N=Math.exp(_*ct),W=Math.exp(p*et);let $,K,lt;C===0?($=-ct*N*E*V,K=N*L*V/S,lt=-N*E*tt/F):($=-a*et*W*D*X,K=a/v*W*U*X,lt=a/q*W*D*nt);for(let st=0;st<2;st++)for(let ht=0;ht<2;ht++){let At,wt,Nt;if(C===0){const Rt=st===0?$:$*o,Lt=st===0?K:K*o,pt=st===0?lt:lt*o;At=ht===0?Rt:Rt*e,wt=ht===0?Lt:Lt*e,Nt=ht===0?pt:pt*e}else{const Rt=st===0?$:$*l,Lt=st===0?K:K*l,pt=st===0?lt:lt*l;At=ht===0?Rt:Rt*e,wt=ht===0?Lt:Lt*e,Nt=ht===0?pt:pt*e}const I=C===0?At*d+Nt*u:At*g+Nt*f,Gt=C===0?-At*u+Nt*d:-At*f+Nt*g;x+=I*i[M],w+=wt*i[M],A+=Gt*i[M],M++}}}return[x,w,A]}function Zv(i,t,e,n,s,r,o){const a=[-957.25349,-817.5450246,583.2991249,758.856827,13.17029064,68.94173502,-15.29764089,-53.4315159,27.34311724,149.5252826,-11.00696044,-179.7031814,953.0914774,817.2340042,-581.0791366,-757.5387665,-13.10602697,-68.58155678,15.22447386,53.15535633,-27.07982637,-149.1413391,10.91433279,179.3251739,-6.028703251,1.303196101,-1.345909343,-1.13829633,-.06642634348,-.3795246458,.07487833559,.2891156371,-.5506314391,-.4443105812,.2273682152,.01086886655,-9.130025352,1.11868484,1.110838825,.1219761512,-.06263009645,-.1896093743,.03434321042,.01523060688,-.4913171541,-.2264814165,-.04791374574,.1981955976,-68.3267814,-48.72036263,14.03247808,16.56233733,2.369921099,6.200577111,-1.41584125,-.8184867835,-3.401307527,-8.490692287,3.217860767,-9.037752107,66.09298105,48.23198578,-13.67277141,-16.27028909,-2.309299411,-6.016572391,1.381468849,.7935312553,3.436934845,8.260038635,-3.136213782,8.833214943,8.041075485,8.024818618,35.54861873,12.55415215,1.738167799,3.721685353,23.06768025,6.871230562,6.806229878,21.35990364,1.687412298,3.500885177,.3498952546,.6595919814],l=[-64820.58481,-63965.62048,66267.93413,135049.7504,-36.56316878,124.6614669,56.75637955,-87.56841077,5848.631425,4981.097722,-6233.712207,-10986.40188,68716.52057,65682.69473,-69673.32198,-138829.3568,43.45817708,-117.9565488,-62.14836263,79.83651604,-6211.451069,-5151.633113,6544.481271,11353.03491,23.72352603,-256.4846331,25.77629189,145.2377187,-4.472639098,-3.554312754,2.936973114,2.682302576,2.728979958,26.43396781,-9.312348296,-29.65427726,-247.5855336,-206.9111326,74.25277664,106.4069993,15.45391072,16.35943569,-5.96517775,-6.0794517,115.6748385,-35.27377307,-32.28763497,-32.53122151,93.7440931,84.25677504,-29.23010465,-43.79485175,-6.434679514,-6.620247951,2.443524317,2.266538956,-43.82903825,6.904117876,12.24289401,17.62014361,152.3078796,124.5505289,-44.5869029,-63.0238241,-8.999368955,-9.693774119,3.510930306,3.770949738,-77.96705716,22.07730961,20.46491655,18.67728847,9.451290614,9.313661792,644.762097,418.2515954,7.183754387,35.62128817,19.43180682,39.57218411,15.69384715,7.123215241,2.300635346,21.90881131,-.0177583937,.399634671],[c,h,u,d,f,g]=Jv(s,r,o,i,t,e,n),_=s-1,[m,p,y]=Eh(a,i,_,t,e,n),M=r-1,[x,w,A]=Eh(l,i,M,t,e,n);return[c+m,h+p,u+y,d+x,f+w,g+A]}function Jv(i,t,e,n,s,r,o){const a=Math.cos(n),l=Math.sin(n),c=s*a-o*l,h=o*a+s*l,u=c/i,d=r/i,f=h/i,[g,_,m]=Qv(u,d,f),p=c/t,y=r/t,M=h/t,[x,w,A]=tx(p,y,M),C=Math.cos(e),P=Math.sin(e),S=p*C-y*P,v=p*P+y*C,[E,L,D]=ex(S,v,M),U=E*C+L*P,B=-E*P+L*C,F=x+U,q=w+B,V=A+D,tt=g*a+m*l,X=_,nt=m*a-g*l,ct=F*a+V*l,et=q,N=V*a-F*l;return[tt,X,nt,ct,et,N]}function Qv(i,t,e){const s=.99994999875,r=1e-4,o=5e3,a=i*i+t*t,l=a+e*e,c=Math.sqrt(l),h=c+r,u=c-r,d=Math.sqrt(a)/c,f=e/c;let g,_,m;if(d<.01){const p=di(c,.01,s)/.01,y=(h*di(h,.01,s)-u*di(u,.01,s))*o,M=e*(2*p-y)/(c*l);g=M*i,_=M*t,m=(2*p*f*f+y*d*d)/c}else{const p=Math.atan2(d,f),y=p+r,M=p-r,x=Math.sin(y),w=Math.cos(y),A=Math.sin(M),C=Math.cos(M),P=(x*di(c,x,w)-A*di(c,A,C))/(c*d)*o,S=(u*di(u,d,f)-h*di(h,d,f))/c*o,v=(P+S*f/d)/c;g=v*i,_=v*t,m=P*f-S*d}return[g,_,m]}function di(i,t,e){const[n,s,r,o,a,l,c,h,u,d,f,g,_,m,p,y,M]=[-456.5289941,375.9055332,4.27468495,2.439528329,3.367557287,3.146382545,-.2291904607,3.74606474,1.508802177,.5873525737,.1556236119,4.993638842,3.324180497,.4368407663,.1855957207,2.969226745,2.243367377];let x=!1,w=t,A=e;w<.01&&(w=.01,A=.99994999875,x=!0);const C=w*w/i,P=A/(i*i),S=-((i-h)/u)*((i-h)/u)-A/d*(A/d),v=-((i-g)/_)*((i-g)/_)-A/m*(A/m),E=-((i-y)/M)*((i-y)/M),L=S<-500?0:Math.exp(S),D=v<-500?0:Math.exp(v),U=E<-500?0:Math.exp(E),B=C*(1+c*L+f*D+p*U),F=P*P,q=B*B/2,V=64/27*F+q*q,tt=Math.pow(Math.sqrt(V)+q,1/3);let X=tt-4*Math.pow(F,1/3)/(3*tt);X<0&&(X=0);const nt=Math.sqrt(X*X+4*Math.pow(F,1/3)),ct=4/((Math.sqrt(2*nt-X)+Math.sqrt(X))*(nt+X)),et=P*ct*ct,N=Math.sqrt(1-et*et),W=ct*N,$=ct*et,K=_o(r,W,$,o),lt=_o(a,W,$,l);let st=n*K+s*lt;return x&&(st=st*t/w),st}function _o(i,t,e,n){const s=(i+t)*(i+t)+e*e+n*n,r=4*i*t/s,a=Math.sqrt(r)*Math.sqrt(t),l=1-r,c=Math.log(1/l),h=1.38629436112+l*(.09666344259+l*(.03590092383+l*(.03742563713+l*.01451196212)))+c*(.5+l*(.12498593597+l*(.06880248576+l*(.03328355346+l*.00441787012)))),u=1+l*(.44325141463+l*(.0626060122+l*(.04757383546+l*.01736506451)))+c*l*(.2499836831+l*(.09200180037+l*(.04069697526+l*.00526449639)));return((1-r*.5)*h-u)/a}function tx(i,t,e){const s=.99994999875,r=1e-4,o=5e3,a=i*i+t*t,l=a+e*e,c=Math.sqrt(l),h=c+r,u=c-r,d=Math.sqrt(a)/c,f=e/c;let g,_,m;if(d<.01){const p=fi(c,.01,s)/.01,y=(h*fi(h,.01,s)-u*fi(u,.01,s))*o,M=e*(2*p-y)/(c*l);g=M*i,_=M*t,m=(2*p*f*f+y*d*d)/c}else{const p=Math.atan2(d,f),y=p+r,M=p-r,x=Math.sin(y),w=Math.cos(y),A=Math.sin(M),C=Math.cos(M),P=(x*fi(c,x,w)-A*fi(c,A,C))/(c*d)*o,S=(u*fi(u,d,f)-h*fi(h,d,f))/c*o,v=(P+S*f/d)/c;g=v*i,_=v*t,m=P*f-S*d}return[g,_,m]}function fi(i,t,e){const[n,s,r,o,a,l,c,h,u,d,f,g,_,m,p,y,M,x,w,A,C,P,S,v,E,L,D,U,B,F,q,V,tt,X]=[-80.11202281,12.58246758,6.560486035,1.930711037,3.827208119,.7789990504,.3058309043,.1817139853,.1257532909,3.422509402,.04742939676,-4.800458958,-.02845643596,.2188114228,2.545944574,.00813272793,.35868244,103.1601001,-.00764731187,.1046487459,2.958863546,.01172314188,.4382872938,.0113490815,14.51339943,.2647095287,.07091230197,.01512963586,6.861329631,.1677400816,.04433648846,.05553741389,.7665599464,.7277854652];let nt=!1,ct=t,et=e;ct<.01&&(ct=.01,et=.99994999875,nt=!0);const N=ct*ct/i,W=et/(i*i),$=-(W/f)*(W/f),K=-((N-L)/D)*((N-L)/D)-W/U*(W/U),lt=$<-500?0:Math.exp($),st=K<-500?0:Math.exp(K),ht=N*(1+c/Math.pow(1+(N-h)/u*((N-h)/u),d)*lt+g*(N-_)/Math.pow(1+(N-_)/m*((N-_)/m),p)/Math.pow(1+W/y*(W/y),M)+x*(N-w)*(N-w)/Math.pow(1+(N-w)/A*((N-w)/A),C)/Math.pow(1+W/P*(W/P),S)),At=W*(1+v+E*(N-L)*st+B*(N-F)/Math.pow(1+(N-F)/q*((N-F)/q),tt)/Math.pow(1+W/V*(W/V),X)),wt=At*At,Nt=ht*ht/2,I=64/27*wt+Nt*Nt,Gt=Math.pow(Math.sqrt(I)+Nt,1/3);let Rt=Gt-4*Math.pow(wt,1/3)/(3*Gt);Rt<0&&(Rt=0);const Lt=Math.sqrt(Rt*Rt+4*Math.pow(wt,1/3)),pt=4/((Math.sqrt(2*Lt-Rt)+Math.sqrt(Rt))*(Lt+Rt)),dt=At*pt*pt,Ct=Math.sqrt(1-dt*dt),R=pt*Ct,b=pt*dt,G=_o(r,R,b,o),it=_o(a,R,b,l);let rt=n*G+s*it;return nt&&(rt=rt*t/ct),rt}function ex(i,t,e){const o=.99994999875,a=i*i+t*t,l=Math.sqrt(a+e*e),c=Math.sqrt(a),h=c/l,u=e/l,d=l+1e-4,f=l-1e-4;let g,_,m;if(h>.01){const p=i/c,y=t/c,M=$i(l,h,u),x=Yi(l,h,u),w=($i(d,h,u)-$i(f,h,u))/2e-4,A=Math.atan2(h,u),C=Math.sin(A+1e-4),P=Math.cos(A+1e-4),S=Math.sin(A-1e-4),v=Math.cos(A-1e-4),E=(Yi(l,C,P)-Yi(l,S,v))/2e-4;g=h*(M+(M+l*w+E)*y*y)+u*x,_=-h*y*p*(M+l*w+E),m=(M*u-x*h)*p}else{const y=e<0?-o:o,M=Math.atan2(.01,y),x=Math.sin(M+1e-4),w=Math.cos(M+1e-4),A=Math.sin(M-1e-4),C=Math.cos(M-1e-4),P=$i(l,.01,y),S=Yi(l,.01,y),v=($i(d,.01,y)-$i(f,.01,y))/2e-4,E=(Yi(l,x,w)-Yi(l,A,C))/2e-4,L=l*v+E;g=(P*(i*i+2*t*t)+L*t*t)/(l*.01)/(l*.01)+S*y,_=-(P+L)*i*t/(l*.01*(l*.01)),m=(P*y/.01-S)*i/l}return[g,_,m]}function $i(i,t,e){const n=-21.2666329,s=32.24527521,r=-6.062894078,o=7.515660734,a=233.7341288,l=-227.1195714,c=8.483233889,h=16.80642754,u=-24.63534184,d=9.067120578,f=-1.052686913,g=-12.08384538,_=18.61969572,m=-12.71686069,p=47017.35679,y=-50646.71204,M=7746.058231,x=1.531069371,w=2.318824273,A=.1417519429,C=.00638801311,P=5.303934488,S=4.213397467,v=.7955534018,E=.1401142771,L=.02306094179,D=3.462235072,U=2.56874301,B=3.477425908,F=1.92215511,q=.1485233485,V=.02319676273,tt=7.830223587,X=8.492933868,nt=.1295221828,ct=.01753008801,et=.01125504083,N=.1811846095,W=.04841237481,$=.01981805097,K=6.557801891,lt=6.348576071,st=5.744436687,ht=.2265212965,At=.1301957209,wt=.5654023158,Nt=t*t,I=e*e,Gt=t*e,Rt=Nt/i,Lt=e/(i*i);let[pt,dt,Ct]=Zn(Rt,A,C);const R=Gt*Math.pow(pt,w)/(Math.pow(i/P,S)+1),b=R*I;[pt,dt,Ct]=Zn(Rt,E,L);const G=Gt*Math.pow(Ct,v)/(Math.pow(i/D,U)+1),it=G*I;[pt,dt,Ct]=Zn(Rt,q,V);const rt=Gt*Math.pow(Rt,B)*Math.pow(Ct,F)/(Math.pow(i/tt,X)+1),Z=rt*I,vt=(Rt-nt)/ct*((Rt-nt)/ct)+1,ft=1+Lt/et*(Lt/et),gt=Gt/vt/ft,zt=gt/vt,ut=zt/vt,St=ut/vt,Dt=(Rt-N)/W*((Rt-N)/W)+1,Ut=1+Lt/$*(Lt/$),_t=Gt/Dt/Ut,Wt=_t/Dt,Vt=Wt/Dt,Zt=Vt/Dt,k=K*K*K*K,xt=lt*lt*lt*lt,J=st*st*st*st,at=Gt/(i*i*i*i+k),Tt=Gt/(i*i*i*i+xt)*I,bt=Gt/(i*i*i*i+J)*I*I;[pt,dt,Ct]=Zn(Rt,ht,At);const Ht=Gt*Ct/(1+(i-1.2)/wt*((i-1.2)/wt));return n*R+s*b+r*G+o*it+a*rt+l*Z+c*gt+h*zt+u*ut+d*St+f*_t+g*Wt+_*Vt+m*Zt+p*at+y*Tt+M*bt+x*Ht}function Yi(i,t,e){const n=12.74640393,s=-7.516393516,r=-5.476233865,o=3.212704645,a=-59.10926169,l=46.62198189,c=-.01644280062,h=.1234229112,u=-.08579198697,d=.01321366966,f=.8970494003,g=9.136186247,_=-38.19301215,m=21.73775846,p=-410.0783424,y=-69.9083269,M=-848.854344,x=1.243288286,w=.207172136,A=.05030555417,C=7.471332374,P=3.180533613,S=1.376743507,v=.1568504222,E=.02092910682,L=1.985148197,D=.315713994,U=1.056309517,B=.1701395257,F=.101987007,q=6.293740981,V=5.671824276,tt=.1280772299,X=.02189060799,nt=.0104069608,ct=.1648265607,et=.04701592613,N=.01526400086,W=12.88384229,$=3.361775101,K=23.44173897,lt=t*t,st=e*e,ht=lt/i,At=e/(i*i);let[wt,Nt,I]=Zn(ht,w,A);const Gt=Math.pow(wt,x)/(Math.pow(i/C,P)+1),Rt=Gt*st;[wt,Nt,I]=Zn(ht,v,E);const Lt=Math.pow(Nt,S)/Math.pow(i,L),pt=Lt*st;[wt,Nt,I]=Zn(ht,B,F);const dt=Math.pow(I,D)*Math.pow(ht,U)/(Math.pow(i/q,V)+1),Ct=dt*st;[wt,Nt,I]=Zn(At,0,nt);const R=1+(ht-tt)/X*((ht-tt)/X),b=I/R,G=b/R,it=G/R,rt=it/R,Z=1+(ht-ct)/et*((ht-ct)/et),vt=1/Z/(1+At/N*(At/N)),ft=vt/Z,gt=ft/Z,zt=gt/Z,ut=W*W,St=$*$,Dt=K*K,Ut=1/(i*i*i*i+ut),_t=st/(i*i*i*i+St),Wt=st*st/(i*i*i*i+Dt);return n*Gt+s*Rt+r*Lt+o*pt+a*dt+l*Ct+c*b+h*G+u*it+d*rt+f*vt+g*ft+_*gt+m*zt+p*Ut+y*_t+M*Wt}function Zn(i,t,e){const n=Math.sqrt((i+t)*(i+t)+e*e),s=Math.sqrt((i-t)*(i-t)+e*e),r=2/(n+s),o=r*i,a=.5*(n+s)/(n*s)*(1-o*o);return[o,r,a]}function Eh(i,t,e,n,s,r){const o=(e+1)*(e+1)*(e+1),a=Math.cos(t),l=Math.sin(t),c=2*a,h=t*i[84],u=t*i[85],d=Math.sin(h),f=Math.cos(h),g=Math.sin(u),_=Math.cos(u),m=n*f-r*d,p=n*d+r*f,y=n*_-r*g,M=n*g+r*_;let x=0,w=0,A=0,C=0;for(let P=0;P<2;P++)for(let S=0;S<3;S++){const v=i[72+S],E=i[78+S],L=Math.cos(s/v),D=Math.sin(s/v),U=Math.cos(s/E),B=Math.sin(s/E);for(let F=0;F<3;F++){const q=i[75+F],V=i[81+F],tt=Math.sin(p/q),X=Math.cos(p/q),nt=Math.cos(M/V),ct=Math.sin(M/V),et=Math.sqrt(1/(v*v)+1/(q*q)),N=Math.sqrt(1/(E*E)+1/(V*V)),W=Math.exp(m*et),$=Math.exp(y*N);let K,lt,st;P===0?(K=-et*W*L*tt*o,lt=W*D*tt/v*o,st=-W*L*X/q*o):(K=-l*N*$*U*nt*o,lt=l/E*$*B*nt*o,st=l/V*$*U*ct*o);for(let ht=0;ht<2;ht++)for(let At=0;At<2;At++){let wt,Nt,I;if(P===0){const Lt=ht===0?K:K*a,pt=ht===0?lt:lt*a,dt=ht===0?st:st*a;wt=At===0?Lt:Lt*e,Nt=At===0?pt:pt*e,I=At===0?dt:dt*e}else{const Lt=ht===0?K:K*c,pt=ht===0?lt:lt*c,dt=ht===0?st:st*c;wt=At===0?Lt:Lt*e,Nt=At===0?pt:pt*e,I=At===0?dt:dt*e}const Gt=P===0?wt*f+I*d:wt*_+I*g,Rt=P===0?-wt*d+I*f:-wt*g+I*_;w+=Gt*i[x],A+=Nt*i[x],C+=Rt*i[x],x++}}}return[w,A,C]}const io=go,nx=16726219e-34;function zu(i,t){const e=i*1e3;return .5*(t*1e6)*nx*e*e*1e9}function ix(i,t){return(10.22+1.29*Math.tanh(.184*(t+8.14)))*Math.pow(i,-1/6.6)}function sx(i,t,e){const n=ix(t,e),s=(.58-.007*e)*(1+.024*Math.log(t)),r=Math.cos(Math.max(0,Math.min(Math.PI*.999,i)));return n*Math.pow(2/(1+r),s)}function ku(i,t,e,n){const s=Math.cos(n),r=Math.sin(n),o=i*s+e*r,a=-i*r+e*s;return[o,a,t]}function rx(i,t,e,n){const s=Math.cos(n),r=Math.sin(n),o=i*s-t*r,a=i*r+t*s;return[o,e,a]}function ox(i,t,e,n){if(!(n!=null&&n.enabled))return 1;const{imfBz:s,sunLonRad:r}=n,o=zu(n.vSw,n.nSw),[a,l,c]=ku(i,t,e,r),h=Math.sqrt(i*i+t*t+e*e)/io;if(h<.1)return 1;const u=Math.sqrt(a*a+l*l+c*c),d=Math.acos(Math.max(-1,Math.min(1,a/u))),f=sx(d,o,s),g=.5;return ax(f-h,-g,g)}function ax(i,t,e){const n=Math.max(0,Math.min(1,(i-t)/(e-t)));return n*n*(3-2*n)}function lx(i,t,e,n){if(!(n!=null&&n.enabled))return[0,0,0];const{vSw:s=400,nSw:r=5,imfBy:o=0,imfBz:a=0,dst:l=0,g1:c=0,g2:h=0,sunLonRad:u,ps:d=0}=n,g=[zu(s,r),l,o,a,c,h,0,0,0,0],[_,m,p]=ku(i,t,e,u),y=_/io,M=m/io,x=p/io,[w,A,C]=Hv(g,d,y,M,x);return rx(w,A,C,u)}function Vu(i,t,e,n,s,r){const[o,a,l]=Po(i,t,e,n,s);if(!(r!=null&&r.enabled))return[o,a,l];const[c,h,u]=zv(i,t,e),[d,f,g]=kv(o,a,l,t,e),[_,m,p]=lx(c,h,u,r),y=ox(c,h,u,r),M=(d+_)*y,x=(f+m)*y,w=(g+p)*y;return Vv(M,x,w,t,e)}function cx(i,t,e,n,s,r){const[o,a,l]=r!=null&&r.enabled?Vu(i,t,e,n,s,r):Po(i,t,e,n,s),c=Math.sqrt(a*a+l*l);if(c<1e-10)return i/go;const h=Math.abs(o)/(2*c),u=1/(1+h*h);return i/go/u}const Wr={INNER_BELT_MIN:1.2,INNER_BELT_MAX:2,SLOT_MAX:3,OUTER_BELT_MAX:6};function hx(i){return i<Wr.INNER_BELT_MIN?"below-inner-belt":i<=Wr.INNER_BELT_MAX?"inner-belt":i<=Wr.SLOT_MAX?"slot-region":i<=Wr.OUTER_BELT_MAX?"outer-belt":"beyond-outer-belt"}function ux(i,t,e,n,s){const r=Mh(i,t,e,n,s),o=Mh(i,t,e,n,1);if(o<1e-10)return 0;const a=1-r/o;return Math.max(0,Math.min(1,(a-.05)/.2))}function dx(i,t,e,n,s,r){const o=r!=null&&r.enabled?Vu(i,t,e,n,s,r):Po(i,t,e,n,s),a=Math.sqrt(o[0]*o[0]+o[1]*o[1]+o[2]*o[2]),l=cx(i,t,e,n,s,r),c=hx(l),h=ux(i,t,e,n,s);return{bMagnitude:a,bVector:o,lShell:l,region:c,saaProximity:h}}const fx={"below-inner-belt":"Below Inner Belt","inner-belt":"Inner Belt","slot-region":"Slot Region","outer-belt":"Outer Belt","beyond-outer-belt":"Beyond Outer Belt"};let In=null;function px(){if(In)return In;In=document.createElement("div"),In.id="env-readout",In.style.display="none",document.body.appendChild(In);const i=document.createElement("style");return i.textContent=`
    #env-readout {
      position: fixed;
      top: 155px;
      left: 20px;
      background: rgba(0, 5, 20, 0.8);
      color: #c8ddf0;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.6;
      min-width: 240px;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(100, 150, 200, 0.25);
      z-index: 10;
      pointer-events: none;
    }
    #env-readout .label {
      color: #6688aa;
      display: inline-block;
      width: 90px;
    }
    #env-readout .value {
      color: #aaccee;
    }
    #env-readout .region-inner-belt { color: #ff8844; }
    #env-readout .region-outer-belt { color: #6666ee; }
    #env-readout .region-slot-region { color: #88aa66; }
    #env-readout .saa-active { color: #ff4444; font-weight: bold; }
    #env-readout .kp-quiet    { color: #88cc88; }
    #env-readout .kp-moderate { color: #ddcc44; }
    #env-readout .kp-storm    { color: #ff6644; }
    #env-readout .flux-inner  { color: #ff8844; }
    #env-readout .flux-outer  { color: #6666ee; }
    #env-readout .flux-slot   { color: #88aa66; }
    #env-readout .title {
      color: #88ccff;
      font-size: 13px;
      margin-bottom: 6px;
      font-weight: bold;
    }
  `,document.head.appendChild(i),In}function mx(i,t){const e=px(),n=`${Math.abs(i.latDeg).toFixed(1)}°${i.latDeg>=0?"N":"S"}`,s=`${Math.abs(i.lonDeg).toFixed(1)}°${i.lonDeg>=0?"E":"W"}`,r=i.altitudeKm<1e3?`${i.altitudeKm.toFixed(0)} km`:`${(i.altitudeKm/1e3).toFixed(1)}k km`,o=i.bMagnitude.toLocaleString(void 0,{maximumFractionDigits:0}),a=fx[i.region]||i.region,l=`region-${i.region}`,c=i.saaProximity>.1?`<span class="saa-active">Detected (${(i.saaProximity*100).toFixed(0)}%)</span>`:"Not detected",h=i.kp??0,u=h<3?"kp-quiet":h<5?"kp-moderate":"kp-storm",d=i.swEnabled?"":' <span style="color:#4466aa">(SW off)</span>',f=`<span class="${u}">${h.toFixed(1)}</span>${d}`,g=(i.innerFlux*100).toFixed(0),_=((i.outerFlux??0)*100).toFixed(0),m=((i.slotFlux??0)*100).toFixed(0),p=(i.slotFlux??0)>.01?`<div><span class="label">Slot</span><span class="flux-slot">${m}%</span></div>`:"";e.innerHTML=`
    <div class="title">${t||"Environment"}</div>
    <div><span class="label">Position</span><span class="value">${n}, ${s}, ${r}</span></div>
    <div><span class="label">|B|</span><span class="value">${o} nT</span></div>
    <div><span class="label">L-shell</span><span class="value">${i.lShell.toFixed(2)}</span></div>
    <div><span class="label">Region</span><span class="value ${l}">${a}</span></div>
    <div><span class="label">SAA</span><span class="value">${c}</span></div>
    <div><span class="label">Kp</span><span class="value">${f}</span></div>
    <div><span class="label">Inner Belt</span><span class="flux-inner">${g}%</span></div>
    <div><span class="label">Outer Belt</span><span class="flux-outer">${_}%</span></div>
    ${p}
  `,e.style.display="block"}function Hu(){In&&(In.style.display="none")}const vo=new Map;let dn=null;const Xr=new Map,gx=6;let Sl=null;function _x(i){Sl=i}function vx(i,t){return`${i}-${String(t).padStart(2,"0")}`}function xx(){if(vo.size===0){dn=null;return}const i=[...vo.values()].sort((c,h)=>c.epochs[0]-h.epochs[0]),t=[],e=[],n=[],s=[],r=[],o=[],a=[],l=[];for(const c of i)for(let h=0;h<c.epochs.length;h++)t.push(c.epochs[h]),e.push(c.vSw[h]),n.push(c.nSw[h]),s.push(c.By[h]),r.push(c.Bz[h]),o.push(c.Dst[h]),a.push(c.G1?c.G1[h]:null),l.push(c.G2?c.G2[h]:null);dn={epochs:t,vSw:e,nSw:n,By:s,Bz:r,Dst:o,G1:a,G2:l}}function Mx(i,t){let e=0,n=i.length-1;for(;e<n;){const s=e+n+1>>1;i[s]<=t?e=s:n=s-1}return e}function yx(i,t){let e=t-1;for(;e>=0&&i[e]===null;)e--;let n=t+1;for(;n<i.length&&i[n]===null;)n++;const s=e>=0,r=n<i.length;if(!s&&!r)return{value:null,interpolated:!1};if(!s)return{value:i[n],interpolated:!0};if(!r)return{value:i[e],interpolated:!0};if(n-e-1>gx)return{value:null,interpolated:!1};const a=(t-e)/(n-e);return{value:i[e]+a*(i[n]-i[e]),interpolated:!0}}async function Gu(i,t){const e=vx(i,t);if(vo.has(e))return;if(Xr.has(e))return Xr.get(e);const n=String(t).padStart(2,"0"),s=(async()=>{try{const r=await fetch(`./data/solarwind/${i}-${n}.json`);if(!r.ok)return;const o=await r.json();vo.set(e,o),xx(),Sl&&Sl()}finally{Xr.delete(e)}})();return Xr.set(e,s),s}function Sx(i){const t=new Date(i*1e3),e=t.getUTCFullYear(),n=t.getUTCMonth()+1,s=[];return n===1?s.push([e-1,12]):s.push([e,n-1]),s.push([e,n]),n===12?s.push([e+1,1]):s.push([e,n+1]),Promise.allSettled(s.map(([r,o])=>Gu(r,o)))}function Wu(i){if(!dn)return null;const{epochs:t}=dn;if(i<t[0]-3600||i>t[t.length-1]+3600)return null;const e=Mx(t,i);let n=!1;function s(r){if(r[e]!==null)return r[e];const o=yx(r,e);return o.interpolated&&(n=!0),o.value}return{vSw:s(dn.vSw),nSw:s(dn.nSw),By:s(dn.By),Bz:s(dn.Bz),Dst:s(dn.Dst),G1:s(dn.G1),G2:s(dn.G2),interpolated:n}}const xo=-1,Ah=1;function bx(i,t,e){if(i<=0||t<=0)return 0;const s=(e===xo?1.05/(i*t):58/(i*t))*3600,r=2*Math.PI/s;return e===xo?r:-r}function bl(i){return i>=-20?1:i>=-50?1+(-i-20)/30*4:i>=-150?5+(-i-50)/100*15:20+(-i-150)/50*30}function Ex(i){return i>=-20?{lMin:3,lMax:4.5}:i>=-50?{lMin:2.8,lMax:4.5}:i>=-150?{lMin:2.5,lMax:4.5}:{lMin:2,lMax:4}}function El(){return 2}function Ax(){return{lMin:1.5,lMax:2}}function Tx(i){return i>=-20?{lMin:2.5,lMax:4.5}:i>=-50?{lMin:2,lMax:4}:i>=-150?{lMin:1.8,lMax:3.5}:{lMin:1.5,lMax:3}}function Al(){return 4}function wx(){return{lMin:1.2,lMax:2}}function Cx(i){return 600-(i-1.2)/.8*300}const be=2e3,Rx=6.3,Xu=20,qu=4,Px=.2,Lx=.07,Dx=.3,Ix=.05,Th=3,Ux=5,Nx=2,Fx=3,Ox=-100,Bx=30,zx=1,kx=10,Vx=120,Hx=450,Gx=120,Wx=35,Xx=40,ba=new Ot(3381759),Ea=new Ot(16737826);function qx(i,t,e,n){const s=bl(t),r=n?Al()*Hx:0,o=e?El()*Gx:0,a=e?s*Xu*Wx:0,l=n?s*qu*Xx:0,c=r+o+a+l;if(c===0)return{budgetA:0,budgetB:0,budgetC:0,budgetD:0};const h=Math.floor(i*r/c),u=Math.floor(i*o/c),d=Math.floor(i*l/c),f=Math.max(0,i-h-u-d);return{budgetA:h,budgetB:u,budgetC:f,budgetD:d}}function wh(i){return i<4?45:25}const $x=`
  attribute vec3 particleColor;
  varying   vec3 vColor;
  uniform   float uDPR;

  void main() {
    vColor = particleColor;
    vec4 mvPos  = modelViewMatrix * vec4(position, 1.0);
    float dist  = max(-mvPos.z, 0.01);
    gl_PointSize = clamp(15.0 / (dist * 0.18 + 0.05), 4.5, 27.0) * uDPR;
    gl_Position  = projectionMatrix * mvPos;
  }
`,Yx=`
  varying vec3 vColor;

  void main() {
    float d     = length(gl_PointCoord - vec2(0.5)) * 2.0;
    if (d > 1.0) discard;
    float alpha = pow(1.0 - d, 1.6);
    gl_FragColor = vec4(vColor, alpha);
  }
`;function Kx(i){const t=new Float32Array(be),e=new Float32Array(be),n=new Float32Array(be),s=new Float32Array(be),r=new Float32Array(be),o=new Float32Array(be),a=new Uint8Array(be),l=new Uint8Array(be),c=new Float32Array(be),h=new Float32Array(be),u=new Float32Array(be*3),d=new Float32Array(be*3),f=new Ae,g=new de(u,3),_=new de(d,3);g.setUsage(Ws),_.setUsage(Ws),f.setAttribute("position",g),f.setAttribute("particleColor",_),f.setDrawRange(0,be),f.boundingSphere=new vs(new O(0,0,0),7);const m=new on({vertexShader:$x,fragmentShader:Yx,uniforms:{uDPR:{value:window.devicePixelRatio??1}},transparent:!0,depthWrite:!1,blending:ei}),p=new fu(f,m);p.frustumCulled=!1,i.add(p);let y=0,M=0,x=0,w=0,A=0,C=0,P=0,S=0,v=!1,E=0;function L(){for(let X=0;X<be;X++){const nt=(E+X)%be;if(!a[nt])return E=(nt+1)%be,nt}return-1}function D(X,nt,ct,et,N,W,$,K){const lt=Math.acos(Math.sqrt(1/Math.max(nt,1)))*.35,st=(Math.random()-.5)*2*lt,ht=bx(nt,N,et)*Rx,At=Math.cos(st),wt=nt*At*At;t[X]=nt,e[X]=ct,n[X]=st,c[X]=wt*At,h[X]=wt*Math.sin(st),s[X]=ht,r[X]=W,o[X]=0,a[X]=1,l[X]=K,K===0?y++:K===1?M++:K===2?x++:w++,d[X*3]=$.r,d[X*3+1]=$.g,d[X*3+2]=$.b}function U(){const X=L();if(X===-1)return;const{lMin:nt,lMax:ct}=wx(),et=nt+Math.random()*(ct-nt),N=Math.random()*Math.PI*2;D(X,et,N,Ah,Bx,Cx(et),Ea,0)}function B(){const X=L();if(X===-1)return;const{lMin:nt,lMax:ct}=Ax(),et=nt+Math.random()*(ct-nt),N=Math.random()*Math.PI*2;D(X,et,N,xo,zx,Vx,ba,1)}function F(X,nt,ct){const{lMin:et,lMax:N}=Ex(ct),W=et+Math.random()*(N-et);if(W>=Nx&&W<=Fx&&ct>Ox)return;const $=L();if($===-1)return;const K=Math.PI-nt+(Math.random()-.5)*Math.PI;D($,W,K,xo,X,wh(W),ba,2)}function q(X,nt){const{lMin:ct,lMax:et}=Tx(nt),N=ct+Math.random()*(et-ct),W=L();if(W===-1)return;const $=Math.PI-X+(Math.random()-.5)*Math.PI;D(W,N,$,Ah,kx,wh(N),Ea,3)}function V(X,nt,ct,et=1){if(!ct.enabled){p.visible=!1,v=!1;return}p.visible=!0;const N=(nt==null?void 0:nt.dst)??0,W=(nt==null?void 0:nt.sunLonRad)??0,$=Math.min(1,Math.abs(N)/150),K=Math.cos(W),lt=Math.sin(W),st=ct.showElectrons??!0,ht=ct.showProtons??!0,At=ct.energyMeV??1,wt=Math.max(50,Math.min(ct.count??800,be)),{budgetA:Nt,budgetB:I,budgetC:Gt,budgetD:Rt}=qx(wt,N,st,ht);if(!v){if(v=!0,ht){for(let dt=0;dt<Math.floor(Nt*Px);dt++)U();for(let dt=0;dt<Math.floor(Rt*Ix);dt++)q(W,N)}if(st){for(let dt=0;dt<Math.floor(I*Lx);dt++)B();for(let dt=0;dt<Math.floor(Gt*Dx);dt++)F(At,W,N)}A=C=P=S=0}if(ht){for(A+=Al()*X;A>=1&&y<Nt;)A-=1,U();A>Al()&&(A=0);const dt=bl(N)*qu;for(S+=dt*X;S>=1&&w<Rt;)S-=1,q(W,N);S>dt&&(S=0)}if(st){for(C+=El()*X;C>=1&&M<I;)C-=1,B();C>El()&&(C=0);const dt=bl(N)*Xu;for(P+=dt*X;P>=1&&x<Gt;)P-=1,F(At,W,N);P>dt&&(P=0)}let Lt=!1,pt=!1;for(let dt=0;dt<be;dt++){if(!a[dt])continue;if(Math.random()<1-Math.exp(-X/r[dt])){a[dt]=0;const ft=l[dt];ft===0?y--:ft===1?M--:ft===2?x--:w--,d[dt*3]=d[dt*3+1]=d[dt*3+2]=0,u[dt*3]=u[dt*3+1]=u[dt*3+2]=0,Lt=pt=!0;continue}e[dt]=(e[dt]+s[dt]*X)%(Math.PI*2);const Ct=Math.cos(e[dt]),R=Math.sin(e[dt]);let b=c[dt]*Ct,G=h[dt],it=-c[dt]*R;if($>.01&&l[dt]>=2){const ft=c[dt];if(ft>1e-6){const gt=(b*K+it*lt)/ft,zt=1-$*.22*gt;b*=zt,G*=zt,it*=zt}}u[dt*3]=b,u[dt*3+1]=G,u[dt*3+2]=it,Lt=!0,o[dt]+=X;const Z=1+(o[dt]<Th?Ux*(1-o[dt]/Th):0),vt=s[dt]>=0?ba:Ea;d[dt*3]=vt.r*Z,d[dt*3+1]=vt.g*Z,d[dt*3+2]=vt.b*Z,pt=!0}Lt?(g.needsUpdate=!0,_.needsUpdate=!0):pt&&(_.needsUpdate=!0)}function tt(){i.remove(p),f.dispose(),m.dispose()}return{mesh:p,update:V,dispose:tt}}const jx=67,$u=jx*Math.PI/180,Yu=1.02,Zx=Yu*Math.cos($u),Jx=Yu*Math.sin($u),Ku=.03,Qx=`
  varying vec3 vWorldPos;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,tM=`
  uniform float uTime;
  uniform float uOpacity;
  varying vec3  vWorldPos;

  void main() {
    if (uOpacity <= 0.0) discard;

    // ── Altitude fraction ────────────────────────────────────────────────
    // r=1.0 = Earth's surface; tube centre at r≈1.02; tube spans ~0.06 Re.
    float r       = length(vWorldPos);
    float altFrac = clamp((r - 0.99) / (TUBE_RADIUS * 2.0), 0.0, 1.0);

    // ── Longitude angle (no discontinuity) ───────────────────────────────
    float angle = atan(-vWorldPos.z, vWorldPos.x);   // range −π … +π, sin-safe

    // ── Curtain striations ────────────────────────────────────────────────
    // Layered sin waves at different spatial and temporal frequencies.
    float s1 = sin(angle * 38.0 + uTime * 0.9);
    float s2 = sin(angle * 19.0 + uTime * 0.4 + 1.3);
    float s3 = sin(angle *  7.0 - uTime * 0.6 + 2.1);
    float striation = 0.50 + 0.28 * s1 + 0.14 * s2 + 0.08 * s3;

    // ── Vertical fade: peaks at mid-altitude, fades at edges ─────────────
    float vertFade = sin(altFrac * 3.14159);

    // ── Colour: green at base, red tinge at top (altitude) ───────────────
    // Real aurora: O I (557.7 nm) green dominant below ~200 km,
    //              O I (630.0 nm) red tinge above ~200 km.
    vec3 col = mix(vec3(0.05, 0.95, 0.25), vec3(0.85, 0.15, 0.05), altFrac * altFrac);

    float alpha = striation * vertFade * uOpacity;
    gl_FragColor = vec4(col * alpha, alpha);
  }
`,eM=tM.replace("TUBE_RADIUS",Ku.toFixed(6));function Ch(i){const t=new Xl(Zx,Ku,12,128);return t.rotateX(Math.PI/2),t.translate(0,i*Jx,0),t}function nM(i){const t={uTime:{value:0},uOpacity:{value:0}},e=new on({vertexShader:Qx,fragmentShader:eM,uniforms:t,transparent:!0,depthWrite:!1,blending:ei,side:en}),n=new Ee(Ch(1),e),s=new Ee(Ch(-1),e);n.frustumCulled=!1,s.frustumCulled=!1,i.add(n),i.add(s);const r=[n,s];function o(l,c,h){if(!h.enabled){t.uOpacity.value=0;return}t.uTime.value=l;let u;c>=-20?u=.12:c>=-50?u=.12+(-c-20)/30*.18:c>=-150?u=.3+(-c-50)/100*.4:u=.7+Math.min((-c-150)/100,1)*.15,u*=h.opacity??1;const d=t.uOpacity.value;t.uOpacity.value=d+(u-d)*.05}function a(){for(const l of r)i.remove(l),l.geometry.dispose();e.dispose()}return{meshes:r,update:o,dispose:a}}const iM={maxDegree:13,numLatitudes:4,numLongitudes:8,tubeRadius:.008,showFieldLines:!0,autoRotate:!1,datetimeString:"2025-11-06T00:00",showIsosurfaces:!1,isoMode:"lShell",isoResolution:64,isoOpacity:.2,showInnerBelt:!1,showOuterBelt:!1,beltOpacity:.15,clipEquatorial:!1,clipMeridional:!1,clipMeridionalAngle:0,solarWindEnabled:!0,solarWindSpeed:400,solarWindDensity:5,imfBy:0,imfBz:0,dst:0,showMagnetopause:!1,pEnabled:!1,pShowElec:!0,pShowProt:!0,pCount:800,pEnergy:1,aEnabled:!1,aOpacity:1,satSwarm:!1,isoLevels:"2,4,6,10"};function sM(){const i=window.location.hash.slice(1);if(!i)return{params:{},isoLevels:null};const t=new URLSearchParams(i),e={},n=u=>{const d=Number(t.get(u));return isNaN(d)?null:d},s=u=>t.get(u)==="true",r=u=>t.get(u);if(t.has("maxDegree")){const u=n("maxDegree");u!==null&&(e.maxDegree=u)}if(t.has("numLat")){const u=n("numLat");u!==null&&(e.numLatitudes=u)}if(t.has("numLon")){const u=n("numLon");u!==null&&(e.numLongitudes=u)}if(t.has("tubeRadius")){const u=n("tubeRadius");u!==null&&(e.tubeRadius=u)}if(t.has("showFL")&&(e.showFieldLines=s("showFL")),t.has("autoRotate")&&(e.autoRotate=s("autoRotate")),t.has("date")&&(e.datetimeString=r("date")),t.has("showIso")&&(e.showIsosurfaces=s("showIso")),t.has("isoMode")&&(e.isoMode=r("isoMode")),t.has("isoRes")){const u=n("isoRes");u!==null&&(e.isoResolution=u)}if(t.has("isoOpacity")){const u=n("isoOpacity");u!==null&&(e.isoOpacity=u)}if(t.has("innerBelt")&&(e.showInnerBelt=s("innerBelt")),t.has("outerBelt")&&(e.showOuterBelt=s("outerBelt")),t.has("beltOpacity")){const u=n("beltOpacity");u!==null&&(e.beltOpacity=u)}if(t.has("clipEq")&&(e.clipEquatorial=s("clipEq")),t.has("clipMer")&&(e.clipMeridional=s("clipMer")),t.has("clipAngle")){const u=n("clipAngle");u!==null&&(e.clipMeridionalAngle=u)}if(t.has("sw")&&(e.solarWindEnabled=s("sw")),t.has("vSw")){const u=n("vSw");u!==null&&(e.solarWindSpeed=u)}if(t.has("nSw")){const u=n("nSw");u!==null&&(e.solarWindDensity=u)}if(t.has("by")){const u=n("by");u!==null&&(e.imfBy=u)}if(t.has("bz")){const u=n("bz");u!==null&&(e.imfBz=u)}if(t.has("dst")){const u=n("dst");u!==null&&(e.dst=u)}t.has("showMp")&&(e.showMagnetopause=s("showMp"));const o={};if(t.has("particles")&&(o.enabled=s("particles")),t.has("showElec")&&(o.showElectrons=s("showElec")),t.has("showProt")&&(o.showProtons=s("showProt")),t.has("pCount")){const u=n("pCount");u!==null&&(o.count=u)}if(t.has("pEnergy")){const u=n("pEnergy");u!==null&&(o.energyMeV=u)}Object.keys(o).length&&(e.particles=o);const a={};if(t.has("aurora")&&(a.enabled=s("aurora")),t.has("auroraOp")){const u=n("auroraOp");u!==null&&(a.opacity=u)}Object.keys(a).length&&(e.aurora=a);const l={};if(t.has("satSwarm")&&(l.enabled=s("satSwarm")),Object.keys(l).length&&(e.satellites=l),t.has("satSelected")){const u=n("satSelected");u!==null&&(e._satSelected=u)}const c=t.has("isoLevels")?r("isoLevels"):null;let h=null;if(t.has("camX")&&t.has("camY")&&t.has("camZ")){const u=n("camX"),d=n("camY"),f=n("camZ");u!==null&&d!==null&&f!==null&&(h={x:u,y:d,z:f})}return{params:e,isoLevels:c,camera:h}}function rM(i,t){const e=new Set(t.split(",").map(n=>n.trim()).filter(Boolean));for(const n of Object.keys(i.isoLevels))i.isoLevels[n]=e.has(String(n))}let Rh=null;function De(i,t=null){clearTimeout(Rh),Rh=setTimeout(()=>oM(i,t),500)}function oM(i,t){var o;const e=new URLSearchParams,n=iM,s=(a,l,c)=>{const h=String(typeof l=="number"?parseFloat(l.toPrecision(6)):l),u=String(c);h!==u&&e.set(a,h)};if(s("maxDegree",i.maxDegree,n.maxDegree),s("numLat",i.numLatitudes,n.numLatitudes),s("numLon",i.numLongitudes,n.numLongitudes),s("tubeRadius",i.tubeRadius,n.tubeRadius),s("showFL",i.showFieldLines,n.showFieldLines),s("autoRotate",i.autoRotate,n.autoRotate),s("date",i.datetimeString,n.datetimeString),s("showIso",i.showIsosurfaces,n.showIsosurfaces),s("isoMode",i.isoMode,n.isoMode),s("isoRes",i.isoResolution,n.isoResolution),s("isoOpacity",i.isoOpacity,n.isoOpacity),i.isoLevels&&Object.keys(i.isoLevels).length){const a=Object.entries(i.isoLevels).filter(([,l])=>l).map(([l])=>l).sort().join(",");a!==n.isoLevels&&e.set("isoLevels",a)}if(s("innerBelt",i.showInnerBelt,n.showInnerBelt),s("outerBelt",i.showOuterBelt,n.showOuterBelt),s("beltOpacity",i.beltOpacity,n.beltOpacity),s("clipEq",i.clipEquatorial,n.clipEquatorial),s("clipMer",i.clipMeridional,n.clipMeridional),s("clipAngle",i.clipMeridionalAngle,n.clipMeridionalAngle),s("sw",i.solarWindEnabled,n.solarWindEnabled),s("vSw",i.solarWindSpeed,n.solarWindSpeed),s("nSw",i.solarWindDensity,n.solarWindDensity),s("by",i.imfBy,n.imfBy),s("bz",i.imfBz,n.imfBz),s("dst",i.dst,n.dst),s("showMp",i.showMagnetopause,n.showMagnetopause),s("particles",i.particles.enabled,n.pEnabled),s("showElec",i.particles.showElectrons,n.pShowElec),s("showProt",i.particles.showProtons,n.pShowProt),s("pCount",i.particles.count,n.pCount),s("pEnergy",i.particles.energyMeV,n.pEnergy),s("aurora",i.aurora.enabled,n.aEnabled),s("auroraOp",i.aurora.opacity,n.aOpacity),s("satSwarm",(o=i.satellites)==null?void 0:o.enabled,n.satSwarm),i._satSelected>=0&&e.set("satSelected",String(i._satSelected)),t){const a=t.position.x,l=t.position.y,c=t.position.z;if(a!==0||l!==1.5||c!==4){const h=u=>String(parseFloat(u.toPrecision(6)));e.set("camX",h(a)),e.set("camY",h(l)),e.set("camZ",h(c))}}const r=e.toString();window.location.replace(r?"#"+r:window.location.pathname+window.location.search)}const Vs=["leo","meo","geo","heo","other"],Ph={leo:new Ot(13162736),meo:new Ot(4517563),geo:new Ot(16768324),heo:new Ot(15623935),other:new Ot(8947848)},Aa=new Ot(1,1,1),aM=`
  attribute vec3  satColor;
  attribute float satSize;
  varying   vec3  vColor;
  uniform   float uDPR;

  void main() {
    vColor = satColor;
    vec4  mvPos = modelViewMatrix * vec4(position, 1.0);
    float dist  = max(-mvPos.z, 0.01);
    // Size attenuation: larger up close, smaller far away
    gl_PointSize = clamp(satSize / (dist * 0.18 + 0.05), 3.0, 20.0) * uDPR;
    gl_Position  = projectionMatrix * mvPos;
  }
`,lM=`
  varying vec3 vColor;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5)) * 2.0;
    if (d > 1.0) discard;
    // Crisp disc with thin anti-aliased edge (no soft glow)
    float alpha = smoothstep(1.0, 0.6, d);
    gl_FragColor = vec4(vColor, alpha);
  }
`;function ju(i,t){const e=window.devicePixelRatio??1,n={leo:[],meo:[],geo:[],heo:[],other:[]},s=new Array(t.length);for(let E=0;E<t.length;E++){const L=t[E].orbitClass,D=n[L].length;n[L].push(E),s[E]={orbitClass:L,localIndex:D}}const r={},o=new yn;i.add(o);for(const E of Vs){const L=n[E].length;if(L===0){r[E]=null;continue}const D=new Ae,U=new Float32Array(L*3),B=new Float32Array(L*3),F=new Float32Array(L),q=Ph[E],V=E==="geo"?14:E==="heo"?12:11;for(let N=0;N<L;N++)B[N*3]=q.r,B[N*3+1]=q.g,B[N*3+2]=q.b,F[N]=V,U[N*3+1]=-2;const tt=new de(U,3),X=new de(B,3),nt=new de(F,1);tt.setUsage(Ws),X.setUsage(Ws),nt.setUsage(Ws),D.setAttribute("position",tt),D.setAttribute("satColor",X),D.setAttribute("satSize",nt);const ct=new on({uniforms:{uDPR:{value:e}},vertexShader:aM,fragmentShader:lM,transparent:!0,blending:ei,depthWrite:!1}),et=new fu(D,ct);et.frustumCulled=!1,o.add(et),r[E]={points:et,posAttr:tt,colorAttr:X,sizeAttr:nt,baseColor:q,baseSize:V}}let a=-1,l=null,c=null,h=null,u=1,d=0,f=1e4,g=0,_=0,m=null;const p=2e3;function y(E,L){if(!E||L===0)return;const D=performance.now(),U=Math.min(L,t.length);if(!h){h=new Float32Array(t.length*3),c=new Float32Array(t.length*3);for(let F=0;F<U;F++)h[F*3]=E[F*3],h[F*3+1]=E[F*3+1],h[F*3+2]=E[F*3+2];c.set(h),d=D,u=1,M(h);return}d>0&&(f=Math.max(200,D-d)),d=D;const B=c;c=h,h=B;for(let F=0;F<U;F++)h[F*3]=E[F*3],h[F*3+1]=E[F*3+1],h[F*3+2]=E[F*3+2];u=0}function M(E){for(let L=0;L<t.length;L++){const D=s[L];if(!D)continue;const U=r[D.orbitClass];if(!U)continue;const B=D.localIndex;U.posAttr.array[B*3]=E[L*3],U.posAttr.array[B*3+1]=E[L*3+1],U.posAttr.array[B*3+2]=E[L*3+2]}for(const L of Vs)r[L]&&(r[L].posAttr.needsUpdate=!0)}function x(E){if(!h||!c||u>=1)return;u=Math.min(1,(E-d)/f);const L=u,D=1-L;for(let U=0;U<t.length;U++){const B=s[U];if(!B)continue;const F=r[B.orbitClass];if(!F)continue;const q=B.localIndex;F.posAttr.array[q*3]=c[U*3]*D+h[U*3]*L,F.posAttr.array[q*3+1]=c[U*3+1]*D+h[U*3+1]*L,F.posAttr.array[q*3+2]=c[U*3+2]*D+h[U*3+2]*L}for(const U of Vs)r[U]&&(r[U].posAttr.needsUpdate=!0)}function w(E){if(a>=0&&a<t.length){const L=s[a],D=r[L.orbitClass];if(D){const U=L.localIndex,B=D.baseColor;D.colorAttr.array[U*3]=B.r,D.colorAttr.array[U*3+1]=B.g,D.colorAttr.array[U*3+2]=B.b,D.sizeAttr.array[U]=D.baseSize,D.colorAttr.needsUpdate=!0,D.sizeAttr.needsUpdate=!0}}if(a=E,E>=0&&E<t.length){const L=s[E],D=r[L.orbitClass];if(D){const U=L.localIndex;D.colorAttr.array[U*3]=Aa.r,D.colorAttr.array[U*3+1]=Aa.g,D.colorAttr.array[U*3+2]=Aa.b,D.sizeAttr.array[U]=D.baseSize*2.5,D.colorAttr.needsUpdate=!0,D.sizeAttr.needsUpdate=!0}}}function A(E,L){if(P(),!E||E.length<6)return;const D=new Ae;D.setAttribute("position",new de(E.slice(),3)),_=E.length/3,g=1,D.setDrawRange(0,1);const U=Ph[L]??new Ot(16777215),B=new du({color:U,transparent:!0,opacity:.8,depthWrite:!1});l=new jf(D,B),l.frustumCulled=!1,i.add(l),m=performance.now()}function C(E){if(!l||g>=_)return;const L=E-m,D=Math.min(1,L/p);g=Math.max(2,Math.floor(D*_)),l.geometry.setDrawRange(0,g)}function P(){l&&(i.remove(l),l.geometry.dispose(),l.material.dispose(),l=null),g=0,_=0,m=null}function S(E){var D;const L={leo:E.showLeo,meo:E.showMeo,geo:E.showGeo,heo:E.showHeo,other:E.showOther};for(const U of Vs)r[U]&&(r[U].points.visible=L[U]);if(a>=0){const U=(D=s[a])==null?void 0:D.orbitClass;U&&!L[U]&&P()}}function v(){P();for(const E of Vs){const L=r[E];L&&(L.points.geometry.dispose(),L.points.material.dispose())}i.remove(o)}return{group:o,updatePositions:y,lerpPositions:x,setSelected:w,setOrbitTrace:A,tickOrbitTrace:C,clearOrbitTrace:P,applyVisibility:S,dispose:v,getSelectedGlobalIndex:()=>a}}function cM(i,t,e,n){const s=t.trim().toLowerCase(),r=new Set(e);return i.filter(o=>{if(!r.has(o.orbitClass)||n&&!o.notable)return!1;if(s){const a=o.name.toLowerCase().includes(s),l=String(o.id).includes(s);if(!a&&!l)return!1}return!0})}function tc(i){return{leo:"LEO",meo:"MEO",geo:"GEO",heo:"HEO",other:"OTHER"}[i]??i.toUpperCase()}function hM(i,t){return i.findIndex(e=>e.id===t)}function ec(i){const t=parseFloat(i.substring(52,63));return!isFinite(t)||t<=0?0:1440/t}const uM={leo:"#3a6080",meo:"#1a6050",geo:"#706020",heo:"#602060",other:"#404040"};let Ze=null,yi=null,Je=null,Sn=null,Js=!1,Ei=[],Zu="",Tl=["leo","meo","geo","heo"],Ju=!0,Gs=null,Lh=null;function dM(){if(document.getElementById("sat-panel-styles"))return;const i=document.createElement("style");i.id="sat-panel-styles",i.textContent=`
    #sat-panel {
      position: fixed;
      top: 60px;
      right: 310px;        /* just left of lil-gui panel */
      width: 280px;
      background: rgba(0, 5, 20, 0.88);
      color: #c8ddf0;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.5;
      border: 1px solid rgba(100, 150, 200, 0.3);
      backdrop-filter: blur(10px);
      z-index: 20;
      display: none;
      flex-direction: column;
      max-height: calc(100vh - 120px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    #sat-panel.visible { display: flex; }
    #sat-panel-header {
      padding: 10px 12px 6px;
      border-bottom: 1px solid rgba(100, 150, 200, 0.2);
      flex-shrink: 0;
    }
    #sat-panel-title {
      color: #88ccff;
      font-size: 13px;
      font-weight: bold;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #sat-panel-close {
      cursor: pointer;
      color: #6688aa;
      font-size: 16px;
      line-height: 1;
      padding: 2px 4px;
      border-radius: 3px;
    }
    #sat-panel-close:hover { color: #c8ddf0; background: rgba(255,255,255,0.1); }
    #sat-search {
      width: 100%;
      box-sizing: border-box;
      background: rgba(0, 10, 30, 0.7);
      border: 1px solid rgba(100, 150, 200, 0.3);
      border-radius: 4px;
      color: #c8ddf0;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      padding: 5px 8px;
      outline: none;
      margin-bottom: 0;
    }
    #sat-search::placeholder { color: #446688; }
    #sat-search:focus { border-color: rgba(136, 204, 255, 0.5); }
    #sat-results {
      overflow-y: auto;
      flex: 1;
      min-height: 80px;
      max-height: 300px;
      padding: 4px 0;
    }
    #sat-results::-webkit-scrollbar { width: 4px; }
    #sat-results::-webkit-scrollbar-track { background: transparent; }
    #sat-results::-webkit-scrollbar-thumb { background: rgba(100,150,200,0.3); border-radius: 2px; }
    .sat-result-row {
      padding: 5px 12px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }
    .sat-result-row:hover { background: rgba(100, 150, 200, 0.15); }
    .sat-result-row.selected { background: rgba(136, 204, 255, 0.15); }
    .sat-result-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #c8ddf0;
    }
    .sat-class-badge {
      font-size: 10px;
      padding: 1px 5px;
      border-radius: 3px;
      flex-shrink: 0;
      font-weight: bold;
      opacity: 0.9;
    }
    .sat-no-results {
      padding: 12px;
      color: #446688;
      text-align: center;
    }
    #sat-selected-info {
      border-top: 1px solid rgba(100, 150, 200, 0.2);
      padding: 10px 12px;
      flex-shrink: 0;
      font-size: 11px;
      color: #8aaabb;
    }
    #sat-selected-info .sat-info-name {
      color: #88ccff;
      font-size: 12px;
      font-weight: bold;
      margin-bottom: 4px;
    }
    #sat-selected-info .sat-info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1px;
    }
    #sat-selected-info .sat-info-label { color: #6688aa; }
    #sat-selected-info .sat-info-value { color: #aaccee; }
  `,document.head.appendChild(i)}function fM(){dM(),Ze=document.createElement("div"),Ze.id="sat-panel";const i=document.createElement("div");i.id="sat-panel-header";const t=document.createElement("div");t.id="sat-panel-title",t.innerHTML="<span>Satellite Search</span>";const e=document.createElement("span");e.id="sat-panel-close",e.textContent="✕",e.addEventListener("click",so),t.appendChild(e),i.appendChild(t),Je=document.createElement("input"),Je.id="sat-search",Je.type="text",Je.placeholder="Search name or NORAD ID…",Je.autocomplete="off",Je.spellcheck=!1,Je.addEventListener("input",pM),i.appendChild(Je),Ze.appendChild(i),yi=document.createElement("div"),yi.id="sat-results",Ze.appendChild(yi),Sn=document.createElement("div"),Sn.id="sat-selected-info",Sn.style.display="none",Ze.appendChild(Sn),document.body.appendChild(Ze),document.addEventListener("keydown",n=>{n.key==="Escape"&&Js&&so()}),document.addEventListener("mousedown",n=>{if(Js&&Ze&&!Ze.contains(n.target)){if(n.target.closest&&n.target.closest("#sat-open-btn"))return;so()}})}function pM(){clearTimeout(Lh),Lh=setTimeout(()=>{Zu=Je.value,Lo()},200)}function Lo(){const i=[];Tl&&i.push(...Tl);const t=cM(Ei,Zu,i,Ju);if(yi.innerHTML="",t.length===0){const s=document.createElement("div");s.className="sat-no-results",s.textContent="No satellites match.",yi.appendChild(s);return}const e=80,n=t.slice(0,e);for(const s of n){const r=Ei.indexOf(s),o=document.createElement("div");o.className="sat-result-row",r===nc&&o.classList.add("selected");const a=document.createElement("span");a.className="sat-result-name",a.title=s.name,a.textContent=s.name;const l=document.createElement("span");l.className="sat-class-badge",l.textContent=tc(s.orbitClass),l.style.background=uM[s.orbitClass]??"#404040",l.style.color="#c8ddf0",o.appendChild(a),o.appendChild(l),o.addEventListener("click",()=>mM(r)),yi.appendChild(o)}if(t.length>e){const s=document.createElement("div");s.className="sat-no-results",s.textContent=`… and ${t.length-e} more. Refine search.`,yi.appendChild(s)}}let nc=-1;function mM(i){if(nc=i,Lo(),i<0||i>=Ei.length){Sn.style.display="none",Gs&&Gs(-1);return}const t=Ei[i],e=ec(t.line2),n=Qu(t.line2);Sn.style.display="block",Sn.innerHTML=`
    <div class="sat-info-name">${td(t.name)}</div>
    <div class="sat-info-row">
      <span class="sat-info-label">NORAD ID</span>
      <span class="sat-info-value">${t.id}</span>
    </div>
    <div class="sat-info-row">
      <span class="sat-info-label">Orbit</span>
      <span class="sat-info-value">${tc(t.orbitClass)}</span>
    </div>
    ${n>0?`<div class="sat-info-row">
      <span class="sat-info-label">Altitude</span>
      <span class="sat-info-value">~${Math.round(n)} km</span>
    </div>`:""}
    ${e>0?`<div class="sat-info-row">
      <span class="sat-info-label">Period</span>
      <span class="sat-info-value">${e.toFixed(1)} min</span>
    </div>`:""}
  `,Gs&&Gs(i)}function Qu(i){const t=parseFloat(i.substring(52,63));if(!isFinite(t)||t<=0)return 0;const e=398600.4418,n=t*2*Math.PI/86400,s=Math.pow(e/(n*n),1/3);return Math.max(0,s-6371.2)}function td(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function gM(i,t={}){Ei=i,Gs=t.onSelect??null,fM(),Lo()}function _M(){Ze&&(Ze.classList.add("visible"),Js=!0,Je==null||Je.focus())}function so(){Ze&&(Ze.classList.remove("visible"),Js=!1)}function vM(){Js?so():_M()}function xM(i,t){Tl=i,Ju=t,Lo()}function MM(i){if(nc=i,i>=0&&i<Ei.length){const t=Ei[i],e=ec(t.line2),n=Qu(t.line2);Sn.style.display="block",Sn.innerHTML=`
      <div class="sat-info-name">${td(t.name)}</div>
      <div class="sat-info-row"><span class="sat-info-label">NORAD ID</span><span class="sat-info-value">${t.id}</span></div>
      <div class="sat-info-row"><span class="sat-info-label">Orbit</span><span class="sat-info-value">${tc(t.orbitClass)}</span></div>
      ${n>0?`<div class="sat-info-row"><span class="sat-info-label">Altitude</span><span class="sat-info-value">~${Math.round(n)} km</span></div>`:""}
      ${e>0?`<div class="sat-info-row"><span class="sat-info-label">Period</span><span class="sat-info-value">${e.toFixed(1)} min</span></div>`:""}
    `}else Sn.style.display="none"}const Q={maxDegree:13,numLatitudes:4,numLongitudes:8,tubeRadius:.008,showFieldLines:!0,autoRotate:!1,showIsosurfaces:!1,isoMode:"lShell",isoResolution:64,isoOpacity:.2,isoLevels:{},showInnerBelt:!1,showOuterBelt:!1,beltOpacity:.15,clipEquatorial:!1,clipMeridional:!1,clipMeridionalAngle:0,solarWindEnabled:!0,solarWindSpeed:400,solarWindDensity:5,imfBy:0,imfBz:0,dst:0,g1:0,g2:0,sunLongitude:0,sunDeclination:0,showMagnetopause:!1,datetimeString:"2025-11-06T00:00",particles:{enabled:!1,showElectrons:!0,showProtons:!0,count:800,energyMeV:1},aurora:{enabled:!1,opacity:1},satellites:{enabled:!1,showLeo:!0,showMeo:!0,showGeo:!0,showHeo:!0,showOther:!1,notableOnly:!0}},{params:rn,isoLevels:Dh,camera:qr}=sM();rn.particles&&(Object.assign(Q.particles,rn.particles),delete rn.particles);rn.aurora&&(Object.assign(Q.aurora,rn.aurora),delete rn.aurora);rn.satellites&&(Object.assign(Q.satellites,rn.satellites),delete rn.satellites);Object.assign(Q,rn);function ed(){if(Q.isoLevels={},Q.isoMode==="lShell")for(const i of Sv)Q.isoLevels[i]=[2,4,6,10].includes(i);else for(const i of yv)Q.isoLevels[i]=[1e4,5e3,2e3,500].includes(i)}ed();function Ai(){return Q.solarWindEnabled?{enabled:!0,vSw:Q.solarWindSpeed,nSw:Q.solarWindDensity,imfBy:Q.imfBy,imfBz:Q.imfBz,dst:Q.dst,g1:Q.g1,g2:Q.g2,sunLonRad:Q.sunLongitude*Math.PI/180,ps:Q.sunDeclination*Math.PI/180}:null}const yM=[[55],[40,65],[30,50,70],[25,40,55,70],[20,35,50,60,72],[20,30,42,54,64,75],[18,28,38,48,58,68,78],[15,24,33,42,51,60,69,78],[14,22,30,38,46,54,62,70,78],[12,20,28,36,44,52,60,68,74,80],[12,19,26,33,40,47,54,61,68,74,80],[10,17,24,31,38,45,52,59,66,72,78,82]],Hn=new T1({antialias:!0});Hn.setPixelRatio(window.devicePixelRatio);Hn.setSize(window.innerWidth,window.innerHeight);Hn.toneMapping=kh;Hn.toneMappingExposure=1;Hn.localClippingEnabled=!0;document.body.appendChild(Hn.domElement);const ge=new qf;ge.background=new Ot(8);const fe=new tn(45,window.innerWidth/window.innerHeight,.01,500);fe.position.set(0,1.5,4);w1(ge);const{sunLight:SM}=D1(ge),$s=C1(ge),Ih=R1(ge),Do=$1(fe,Hn);qr&&(fe.position.set(qr.x,qr.y,qr.z),Do.update());Do.addEventListener("change",()=>De(Q,fe));const Mo=Ov();let Pe=null,nd=0,id=8200,$r=null,ke=null,yo=null,wl=null;function sd(i,t){const{epochs:e,g:n,h:s,sv_g:r,sv_h:o,svEpoch:a,nmax:l,referenceRadius:c}=i;if(t>=a){const d=t-a,f=e.length-1;return{epoch:t,nmax:l,referenceRadius:c,sv_g:r,sv_h:o,g:n[f].map((g,_)=>g.map((m,p)=>m+d*r[_][p])),h:s[f].map((g,_)=>g.map((m,p)=>m+d*o[_][p]))}}let h=e.length-2;for(let d=0;d<e.length-1;d++)if(t>=e[d]&&t<e[d+1]){h=d;break}const u=(t-e[h])/(e[h+1]-e[h]);return{epoch:t,nmax:l,referenceRadius:c,sv_g:r,sv_h:o,g:n[h].map((d,f)=>d.map((g,_)=>g+u*(n[h+1][f][_]-g))),h:s[h].map((d,f)=>d.map((g,_)=>g+u*(s[h+1][f][_]-g)))}}function rd(i){if(!yo)return;const t=i.getUTCFullYear();t!==wl&&(wl=t,ke=sd(yo,t))}async function bM(){yo=await(await fetch("./data/igrf/igrf14-all.json")).json();const t=new Date(Q.datetimeString).getUTCFullYear();wl=t,ke=sd(yo,t)}function EM(){return $r||($r=new Worker(new URL(""+new URL("fieldLineWorker-DQ34Blhd.js",import.meta.url).href,import.meta.url),{type:"module"}),$r.onmessage=AM),$r}function AM(i){const{type:t,buildId:e,tracedLines:n}=i.data;if(t!=="fieldLinesReady"||e!==nd)return;const s=n.filter(a=>a.points.length>=2);Pe!==null&&Pe.children.length===s.length?TM(s,id):od(s);const o=document.getElementById("loading");o&&(o.style.display="none")}function Io(i=8200,t=!0){const e=++nd;if(id=i,t){const r=document.getElementById("loading");r&&(r.style.display="")}const n=Ai(),s=Q.solarWindEnabled;EM().postMessage({buildId:e,latitudes:yM[Q.numLatitudes-1],nLongitudes:Q.numLongitudes,bothHemispheres:s,polarCapLatitudes:s?[85,88]:[],coeffs:ke,maxDegree:Q.maxDegree,solarWindParams:n})}function od(i){jn=null,Pe&&(ge.remove(Pe),Pe.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()}),Pe=null),Pe=Y1(i,Nu,{radius:Q.tubeRadius}),Pe.visible=Q.showFieldLines,ge.add(Pe),Pe.children.forEach((t,e)=>{t.userData.isOpen=i[e].isOpen??!1}),gd()}function TM(i,t=8200){const e=[];for(let n=0;n<Pe.children.length;n++){const s=Pe.children[n],r=i[n],o=Uu(r.points,{color:Nu(r.lat),radius:Q.tubeRadius,tubularSegments:Iu});if(!o){od(i);return}const a=s.userData.isOpen??!1,l=r.isOpen??!1,c=a!==l,h=c?DM:t,u=c?UM:IM;s.userData.isOpen=l,e.push({mesh:s,oldPos:s.geometry.attributes.position.array.slice(),newPos:o.geometry.attributes.position.array.slice(),lineDuration:h,easing:u}),o.geometry.dispose(),o.material.dispose()}jn={startTime:performance.now(),duration:Math.max(...e.map(n=>n.lineDuration)),lines:e}}function wM(i){if(!jn)return;const t=i-jn.startTime,e=t/jn.duration;for(const{mesh:n,oldPos:s,newPos:r,lineDuration:o,easing:a}of jn.lines){const l=Math.min(1,t/o),c=a(l),h=n.geometry.attributes.position.array;for(let u=0;u<h.length;u++)h[u]=s[u]+c*(r[u]-s[u]);n.geometry.attributes.position.needsUpdate=!0,n.geometry.computeVertexNormals(),n.geometry.computeBoundingSphere()}e>=1&&(jn=null)}function ad(){Pe&&(Pe.visible=Q.showFieldLines),Do.autoRotate=Q.autoRotate,De(Q,fe)}let Ta=null,Cl=null,ld=null,ic=null,Rl=null,cd=null,sc=null,Ve=null,Fe=null,pi={innerFlux:.65,outerFlux:.1,slotFlux:0};const as=12,hd=[-as,-as,-as],ud=[as,as,as];function CM(){return Ta||(Ta=new Worker(new URL(""+new URL("scalarFieldWorker-BIDCwx3E.js",import.meta.url).href,import.meta.url),{type:"module"})),Ta}function rc(i,t){if(Q.isoMode==="lShell"){if(Rl&&cd===i&&sc===t)return Rl}else if(Cl&&ld===i&&ic===t)return Cl;return null}function oc(){if(De(Q,fe),!Q.showIsosurfaces||!ke)return;ed(),Q._rebuildLevelToggles&&Q._rebuildLevelToggles();const i=Number(Q.isoResolution),t=Q.maxDegree;if(rc(t,i)){ro();return}const e=Q.isoMode==="lShell",n=e?"computeLShellGrid":"computeGrid",s=e?"L-shell":"|B|";wa(!0,`Computing ${s} field...`);const r=CM();r.onmessage=o=>{o.data.type==="progress"?PM(o.data.percent,s):o.data.type==="gridReady"?(Cl=o.data.grid,ld=t,ic=o.data.resolution,wa(!1),ro()):o.data.type==="lshellGridReady"&&(Rl=o.data.grid,cd=t,sc=o.data.resolution,wa(!1),ro())},r.postMessage({type:n,coeffs:ke,maxDegree:t,resolution:i,boundsMin:hd,boundsMax:ud})}function ro(){const i=Number(Q.isoResolution),t=Q.maxDegree,e=rc(t,i);if(!e||(Ve&&(ge.remove(Ve),Fu(Ve),Ve=null),!Q.showIsosurfaces))return;const n=Q.isoMode==="lShell"?sc:ic,s=[];for(const[o,a]of Object.entries(Q.isoLevels)){if(!a)continue;const l=Number(o),{positions:c,normals:h,indices:u}=xv(e,n,hd,ud,l);s.push({level:l,positions:c,normals:h,indices:u})}if(s.length===0)return;const r=Mo.getActivePlanes(Q.clipEquatorial,Q.clipMeridional);Ve=bv(s,{opacity:Q.isoOpacity,clippingPlanes:r,mode:Q.isoMode}),ge.add(Ve)}function dd(){if(!Q.showIsosurfaces){Ve&&(ge.remove(Ve),Fu(Ve),Ve=null);return}const i=Number(Q.isoResolution),t=Q.maxDegree;rc(t,i)&&ro(),Ve&&Ev(Ve,Q.isoOpacity),De(Q,fe)}function ac(){!Q.showInnerBelt&&!Q.showOuterBelt||!ke||(md(),De(Q,fe))}function fd(){var t,e,n;const i=new sn;if((t=ke==null?void 0:ke.g)!=null&&t[1]){const s=ke.g[1][0],r=ke.g[1][1],o=((n=(e=ke.h)==null?void 0:e[1])==null?void 0:n[1])??0,a=new O(-r,-s,-o).normalize();i.setFromUnitVectors(new O(0,1,0),a)}return i}function pd(){Qs&&Qs.mesh.quaternion.copy(fd())}function md(){if(Fe&&(ge.remove(Fe),Ou(Fe),Fe=null),!Q.showInnerBelt&&!Q.showOuterBelt)return;const i=Q.sunLongitude*Math.PI/180,t=Mo.getActivePlanes(Q.clipEquatorial,Q.clipMeridional);Fe=Lv({showInnerBelt:Q.showInnerBelt,showOuterBelt:Q.showOuterBelt,clippingPlanes:t,opacity:Q.beltOpacity,sunDirX:Math.cos(i),sunDirZ:Math.sin(i),stormIntensity:Math.min(1,Math.abs(Q.dst)/150)}),Fe.quaternion.copy(fd()),ge.add(Fe),pd()}function RM(){if(!Q.showInnerBelt&&!Q.showOuterBelt){Fe&&(ge.remove(Fe),Ou(Fe),Fe=null);return}md(),De(Q,fe)}function gd(){Mo.setMeridionalAngle(Q.clipMeridionalAngle);const i=Mo.getActivePlanes(Q.clipEquatorial,Q.clipMeridional);Ve&&Av(Ve,i),Fe&&Uv(Fe,i),Pe&&Pe.traverse(t=>{t.material&&(t.material.clippingPlanes=i,t.material.needsUpdate=!0)}),De(Q,fe)}function wa(i,t){let e=document.getElementById("iso-loading");!e&&i&&(e=document.createElement("div"),e.id="iso-loading",e.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-family:monospace;font-size:14px;background:rgba(0,0,0,0.7);padding:12px 24px;border-radius:8px;z-index:1000;pointer-events:none;",document.body.appendChild(e)),e&&(e.textContent=t||"Computing...",e.style.display=i?"block":"none")}function PM(i,t){const e=document.getElementById("iso-loading");e&&(e.textContent=`Computing ${t} field... ${i}%`)}const Ys=120,LM=300,Yr=289;let ti=null,ji=null,Zi=null,Uh=null,Nh=null;const DM=800,IM=i=>i*i*(3-2*i),UM=i=>i*i*i;let jn=null,Pl=null;function _d(i){ti=new Date(i),ti.setUTCHours(0,0,0,0);const t=new Float32Array(Yr),e=new Float32Array(Yr*3),n=new Float32Array(Yr*3);for(let l=0;l<Yr;l++){const c=l*LM;t[l]=c;const h=new Date(ti.getTime()+c*1e3),u=P1(h),d=Math.cos(u.declinationRad);e[l*3]=d*Math.cos(u.longitudeRad)*Ys,e[l*3+1]=Math.sin(u.declinationRad)*Ys,e[l*3+2]=d*Math.sin(u.longitudeRad)*Ys;const f=L1(h),g=Math.cos(f.declinationRad);n[l*3]=g*Math.cos(f.longitudeRad)*f.distanceEarthRadii,n[l*3+1]=Math.sin(f.declinationRad)*f.distanceEarthRadii,n[l*3+2]=g*Math.sin(f.longitudeRad)*f.distanceEarthRadii}ji==null||ji.stopAllAction();const s=new gs(".position",t,e),r=new mo("sun-day",86400,[s]);ji=new Gc($s.group),Uh=ji.clipAction(r),Uh.play(),Zi==null||Zi.stopAllAction();const o=new gs(".position",t,n),a=new mo("moon-day",86400,[o]);Zi=new Gc(Ih.mesh),Nh=Zi.clipAction(a),Nh.play(),$s.group.visible=!0,Ih.setVisible(!0)}function vd(i){const t=(i.getTime()-ti.getTime())/1e3;ji.setTime(t),$s.group.visible=!0,SM.position.copy($s.group.position).multiplyScalar(5/Ys);const e=$s.group.position;Q.sunLongitude=(Math.atan2(e.z,e.x)*180/Math.PI+360)%360,Q.sunDeclination=Math.asin(e.y/Ys)*180/Math.PI,Zi.setTime(t)}function Ll(i=!1){const t=new Date(Q.datetimeString);if(isNaN(t.getTime()))return;rd(t);const e=new Date(t);e.setUTCHours(0,0,0,0),(!ti||e.getTime()!==ti.getTime())&&_d(t),vd(t),Q.solarWindEnabled&&(Io(i?8200:1e3,!i),Q.showIsosurfaces&&oc(),(Q.showInnerBelt||Q.showOuterBelt)&&ac(),Q.showMagnetopause&&lc()),Q.satellites.enabled&&he&&(_s=0),De(Q,fe)}function xd(i){Sx(i);const t=Wu(i);if(t&&(t.vSw!==null&&(Q.solarWindSpeed=Math.min(800,Math.max(300,Math.round(t.vSw)))),t.nSw!==null&&(Q.solarWindDensity=Math.min(30,Math.max(1,Math.round(t.nSw*10)/10))),t.By!==null&&(Q.imfBy=Math.min(20,Math.max(-20,Math.round(t.By*10)/10))),t.Bz!==null&&(Q.imfBz=Math.min(20,Math.max(-20,Math.round(t.Bz*10)/10))),t.Dst!==null&&(Q.dst=Math.min(50,Math.max(-200,Math.round(t.Dst)))),t.G1!==null&&(Q.g1=Math.max(0,t.G1)),t.G2!==null&&(Q.g2=Math.max(0,t.G2)),Q._solarPreset="Historical Data",qM(),pe)){const e=Ai();pe.updateGauges(Ro(e),(e==null?void 0:e.dst)??0,(e==null?void 0:e.imfBz)??0)}}function NM(i){const t=new Date(i);if(isNaN(t.getTime()))return;Q.datetimeString=i,rd(t),zM(t);const e=new Date(t);e.setUTCHours(0,0,0,0),(!ti||e.getTime()!==ti.getTime())&&_d(t),vd(t);const n=Math.floor(t.getTime()/36e5)*3600;n!==Pl&&(Pl=n,xd(n))}function FM(){if(Io(1e3),Q.showIsosurfaces&&oc(),(Q.showInnerBelt||Q.showOuterBelt)&&ac(),Q.showMagnetopause&&lc(),pe){const i=Ai();pe.updateGauges(Ro(i),(i==null?void 0:i.dst)??0,(i==null?void 0:i.imfBz)??0)}De(Q,fe)}let mi=null,Qs=null,Dl=null,Oe=null,he=null,fn=null,Md=0,_s=0,Un=-1,yd=0;const Ca=new Map,Kr=new Map;let Ra=null;function OM(i,t){const e=`${i}-${String(t).padStart(2,"0")}`;if(Ca.has(e))return Promise.resolve(Ca.get(e));if(Kr.has(e))return Kr.get(e);const n=fetch(`./data/tles/${e}.json`).then(s=>s.ok?s.json():null).catch(()=>null).then(s=>(Ca.set(e,s),Kr.delete(e),s));return Kr.set(e,n),n}function BM(i){if(!(i!=null&&i.tles)||!Oe)return;const t=i.tles;for(const e of Oe.satellites){const n=t[String(e.id)];n&&(e.line1=n[0],e.line2=n[1])}fn&&(fn.terminate(),fn=null,ir().postMessage({type:"init",satellites:Oe.satellites}),_s=0)}function zM(i){if(!Q.satellites.enabled||!Oe)return;const t=`${i.getUTCFullYear()}-${String(i.getUTCMonth()+1).padStart(2,"0")}`;t!==Ra&&(Ra=t,OM(i.getUTCFullYear(),i.getUTCMonth()+1).then(e=>{e&&t===Ra&&BM(e)}))}function Sd(i){return(i.getTime()+631152e6)/864e5}function kM(i){return i>=86400?200:i>=3600?500:i>=60?2e3:1e4}function ir(){return fn||(fn=new Worker("/workers/satelliteWorker.js"),fn.onmessage=VM,fn.onerror=i=>console.error("[SatWorker]",i.message)),fn}function VM(i){const{type:t,requestId:e}=i.data;if(t==="ready"){_s=0;return}if(t==="positions"){if(e!==Md)return;he&&(he.updatePositions(i.data.positions,i.data.count),Un>=0&&ke&&HM(i.data.positions,i.data.count));return}if(t==="orbit"){if(e!==yd)return;if(he&&i.data.points){const n=Oe==null?void 0:Oe.satellites[Un];he.setOrbitTrace(i.data.points,(n==null?void 0:n.orbitClass)??"leo")}return}}function HM(i,t){if(Un<0||Un>=t)return;const e=i[Un*3],n=i[Un*3+1],s=i[Un*3+2];if(n<-1)return;const r=6371.2,o=e*r,a=n*r,l=s*r,c=Math.sqrt(o*o+a*a+l*l),h=Math.acos(Math.max(-1,Math.min(1,a/c))),u=Math.atan2(l,o),d=Ai(),f=dx(c,h,u,ke,Q.maxDegree,d),g=Ro(d),_=Bu(g,(d==null?void 0:d.dst)??0),m=Oe.satellites[Un],p=c-r,y=90-h*(180/Math.PI),M=u*(180/Math.PI);mx({latDeg:y,lonDeg:M,altitudeKm:p,bMagnitude:f.bMagnitude,lShell:f.lShell,region:f.region,saaProximity:f.saaProximity,kp:g,swEnabled:(d==null?void 0:d.enabled)??!1,innerFlux:_.innerFlux,outerFlux:_.outerFlux,slotFlux:_.slotFlux},m.name)}function GM(){if(!Oe||!he)return;const i=++Md,t=pe?new Date(pe.getSimTimeAt(0)):new Date(Q.datetimeString);ir().postMessage({type:"propagate",requestId:i,ds50utc:Sd(t)})}function Fh(i){if(Un=i,he&&he.setSelected(i),i<0){delete Q._satSelected,he&&he.clearOrbitTrace(),Hu(),De(Q,fe);return}Q._satSelected=Oe.satellites[i].id;const t=Oe.satellites[i],e=ec(t.line2);if(e>0){const n=++yd,s=pe?new Date(pe.getSimTimeAt(0)):new Date(Q.datetimeString);ir().postMessage({type:"traceOrbit",requestId:n,satIndex:i,ds50utc:Sd(s),periodMin:e})}De(Q,fe)}function WM(){if(!Oe)return;Q.satellites.enabled?(he||(he=ju(ge,Oe.satellites),["leo","meo","geo","heo","other"].filter(t=>Q.satellites[`show${t.charAt(0).toUpperCase()+t.slice(1)}`]),ir().postMessage({type:"init",satellites:Oe.satellites})),he&&he.applyVisibility(Q.satellites),_s=0):(he&&(he.dispose(),he=null),fn&&(fn.terminate(),fn=null),Hu());const i=["leo","meo","geo","heo","other"].filter(t=>Q.satellites[`show${t.charAt(0).toUpperCase()+t.slice(1)}`]);xM(i,Q.satellites.notableOnly),De(Q,fe)}function lc(){mi&&(ge.remove(mi),mi.traverse(i=>{i.geometry&&i.geometry.dispose(),i.material&&i.material.dispose()}),mi=null),!(!Q.showMagnetopause||!Q.solarWindEnabled)&&Td(async()=>{const{buildMagnetopauseMesh:i}=await import("./magnetopauseMesh-CIrnhvam.js");return{buildMagnetopauseMesh:i}},[],import.meta.url).then(({buildMagnetopauseMesh:i})=>{mi=i(Ai()),mi&&ge.add(mi)})}function XM(){lc(),De(Q,fe)}uv();let pe;const{refreshSolarWindControls:qM}=hv(Q,{onRebuild:()=>{Io(1e3),De(Q,fe)},onVisualChange:ad,onIsoRebuild:()=>oc(),onIsoVisualChange:dd,onClipChange:gd,onBeltRebuild:()=>ac(),onBeltVisualChange:RM,onSatelliteSwarmChange:WM,onSatelliteSearchOpen:()=>vM(),onSolarWindChange:FM,onMagnetopauseChange:XM,onParticleChange:()=>De(Q,fe),onAuroraChange:()=>De(Q,fe)});Dh&&(rM(Q,Dh),dd());pe=gv({initialTime:new Date(Q.datetimeString),onTimeChange:i=>NM(i),onPause:()=>{jn=null,Ll(!1)},onPeriodicRebuild:()=>{pe&&pe.getSpeed()>=3600||Ll(!0)},getSolarWindData:Wu});_x(()=>pe.refreshColors());window.addEventListener("resize",()=>{fe.aspect=window.innerWidth/window.innerHeight,fe.updateProjectionMatrix(),Hn.setSize(window.innerWidth,window.innerHeight)});let Oh=0;function bd(i=performance.now()){requestAnimationFrame(bd);const t=Math.min((i-Oh)/1e3,.1);if(Oh=i,pe&&pe.tick(i),wM(i),Qs&&Qs.update(t,Ai(),Q.particles,(pe==null?void 0:pe.getSpeed())??1),Dl&&Dl.update(i/1e3,Q.dst,Q.aurora),Q.satellites.enabled&&he){const e=kM((pe==null?void 0:pe.getSpeed())??1);i-_s>e&&(_s=i,GM()),he.lerpPositions(i),he.tickOrbitTrace(i)}if(Fe&&(Q.showInnerBelt||Q.showOuterBelt)){const e=Ai(),n=Ro(e),s=(e==null?void 0:e.dst)??Q.dst,r=Bu(n,s),o=.02;pi.innerFlux+=o*(r.innerFlux-pi.innerFlux),pi.outerFlux+=o*(r.outerFlux-pi.outerFlux),pi.slotFlux+=o*(r.slotFlux-pi.slotFlux),Iv(Fe,pi,Q.beltOpacity)}Do.update(),Hn.render(ge,fe)}async function $M(){await Promise.all([bM(),Gu(2025,11)]),fetch("./data/satellites.json").then(t=>t.json()).then(t=>{if(Oe=t,gM(t.satellites,{onSelect:Fh}),Q.satellites.enabled&&(he=ju(ge,t.satellites),he.applyVisibility(Q.satellites),ir().postMessage({type:"init",satellites:t.satellites})),rn._satSelected!==void 0){const e=hM(t.satellites,rn._satSelected);e>=0&&(MM(e),Q.satellites.enabled&&Fh(e))}}).catch(t=>console.warn("[Satellites] Failed to load catalog:",t)),Qs=Kx(ge),pd(),Dl=nM(ge),dv("Solar wind: Qin-Denton/WGhour.d (2026)");const i=Math.floor(new Date(Q.datetimeString).getTime()/1e3);xd(i),Pl=Math.floor(i/3600)*3600,pe.refreshColors(),Ll(),Io(),ad(),bd()}$M();export{Ae as B,en as D,go as E,we as F,xa as K,xu as M,Ee as a,sx as b,zu as c,rx as f};
