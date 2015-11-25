(function(undefined){
"use strict";
var globalScope = (typeof global !== 'undefined') ? global : this;
var hasModule = (typeof module !== 'undefined') && module.exports;

var pi = Math.PI;
var sqrt = Math.sqrt;
var acos = Math.acos;
var cos = Math.cos;
var pow = Math.pow;
var abs = Math.abs;
var ln = Math.log;
var floor = Math.floor;
var max = Math.max;

function cubicRoot(x){ return (x<0?-1:1)*pow(abs(x),1/3); }

// return the smallest root of the cubic equation
function cubicSolver(a, b, c, d){
  // a*x^3 + b*x^2 + c*x + d = 0
  b = b / a;
  c = c / a;
  d = d / a;
  // x^3 + b*x^2 + c*x + d = 0
  
  // Tschirnhaus transformation (x = t-b/3; t^3 + p*t + q = 0)
  var p = c - b*b/3;
  var q = b*(2*b*b - 9*c)/27 + d;
  var tol = 1e-16;
  var tmp = 2/3*pi;
  if(sqrt(p*p + q*q) < tol) return -b/3; // p=q=0 => t=0 => x=-b/3
  
  var t1 = p/3;
  var t2 = t1*t1*t1;
  var t3 = q/2;
  var g = t2 + t3*t3;
  if(g >= 0){ // Cardano's method
    t1 = -q/2;
    t2 = sqrt(g);
    return (cubicRoot(t1 + t2) + cubicRoot(t1 - t2)) - b/3;
  }else{ //Viete's method*/
    t3 = acos(-q/(2*sqrt(-t2)))/3;
    var t4 = 2*sqrt(-t1);
    var z = t4*cos(t3)-b/3; //root 1
    var z2 = t4*cos(t3-tmp)-b/3; //root 2
    if(z2 < z) z = z2;
    z2 = t4*cos(t3-2*tmp)-b/3; // root 3
    if(z2 < z) z = z2;
    return z;
  }
}

if (hasModule){
  module.exports.cubicSolver = cubicSolver;
  function test(nb){
    var dist = [];
    var zero = 0;
    var nan = 0;
    function randomTest(){
      var a = Math.random()*10-5;
      var b = Math.random()*10-5;
      var c = Math.random()*10-5;
      var d = Math.random()*10-5;
      var z = cubicSolver(a,b,c,d);
      var e = ((a*z+b)*z+c)*z+d;
      var n = Math.floor(-ln(abs(e))/Math.LN10);
      
      if(isNaN(e)) nan++; // Nooooooo :(
      else if(!e) zero++;
      else if(n >= 0){ 
        dist[n] = (dist[n]||0)+1;
      }else console.log(a,b,c,d,z,e); // Nooooooo :(
    }

    console.log("distribution of the precision (log10 of error)");
    for(var i=0;i<nb;i++) randomTest();
    console.log("nan",(nan/nb*100).toFixed(2)+"%");
    for(var n=0;n<dist.length;n++)
      console.log(""+n,((dist[n]||0)/nb*100).toFixed(2)+"%");
    console.log("zero",(zero/nb*100).toFixed(2)+"%");
  }
  if(require.main === module) return test(100000);
}else globalScope.cubicSolver = cubicSolver;
}).call(this);



