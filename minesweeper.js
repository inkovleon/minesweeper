"use strict"
var x=16;
var y=16;
var mn=40;
var oMines=0;
var markedMines=0;
var gameOver=0;
var gameStarted=0;
var tablo=document.getElementById("tablo");
var container = document.getElementById("container");
var level=document.getElementById("level");
var timer = document.getElementById('timer');
var A;
var MField;
var SField;
var tStart;
var tFinish;
var tNow;

function initGame()
{
oMines=0;
markedMines=0;
//Инициализаия массивов
A="";MField="";SField="";
A=Array(x);
MField=Array(x);
SField=Array(x);
for (var i=0; i<x;i++){
    A[i]=Array(y); 
    MField[i]=Array(y);
    SField[i]=Array(y);
    for (var j =0;j<y;j++){
        MField[i][j]=0;
        SField[i][j]=0;
        }
    }

//расставляем mn мин 
for(i=0;i<mn;i++){
    var ax=Math.floor(Math.random()*x);
    var ay = Math.floor(Math.random()*y);
    while (MField[ax][ay]==1) {
        ax = Math.floor(Math.random()*x);
        ay = Math.floor(Math.random()*y);
        }
    MField[ax][ay]=1;
}
    container.style.width = 25*y + 'px';
//$("#container").css ('width', "\'" + 25*y + 'px');
$("#container").empty();
for ( i = 0;i<x;i++)
    {for(j=0;j<y;j++){
        A[i][j]=document.createElement("div");
        //var ID = i*x+j;
        A[i][j].setAttribute("x",i);
        A[i][j].setAttribute("y",j);
        A[i][j].className="squareB";
        //container.appendChild(A[i][j]);
        $("#container").append(A[i][j]);
        
        // назначаем обработчики нажатия левой и правой кнопки мыши
        A[i][j].onclick=leftClick;
        A[i][j].oncontextmenu=rightClick;
        //A[i][j].onselect=function (event) {event.preventDefault();}
     }
    }

}
//заполняем поле

level.onchange=function(){
    if (level.selectedIndex==0)
        {   x=9;y=9;mn=10;
            initGame();
        }
    if (level.selectedIndex==1)
        {   x=16;y=16;mn=40;
            initGame();
        }
    if (level.selectedIndex==2)
        {   x=16;y=30;mn=99;
            initGame(16,30,99);
        }
    
    }


//функция обработкисобытия нажания на ЛЕВУЮ клавишу мыши
function leftClick(event)
{
    event.preventDefault();
    if(gameStarted==0){gameStarted=1; level.disabled="disabled"; tStart=window.performance.now();}
    if(gameOver==0)
        {
            var cell=event.target;
            var ax=Number.parseInt(cell.getAttribute("x"));
            var ay=Number.parseInt(cell.getAttribute("y"));
            if(SField[ax][ay]==0)
                {
                    SField[ax][ay]=1;
                    if (MField[ax][ay]==1) 
                        {cell.className="squareM";
                         gameOver=1;
                         tFinish=window.performance.now();
                         $("#gameResult").html("Game Over!!!");
                        }
                    else {cell.innerHTML=countMines(ax,ay);
                          cell.className="squareW";
                          oMines++;
                          
                          tablo.innerHTML="Открыто: " + oMines + "         Помечено:  " + markedMines;
                          if ((oMines==x*y-mn)&&(markedMines==mn)){gameOver =1;
                                               tFinish=window.performance.now();
                                              $("#gameResult").html("Congratulations!!! You win!!!");
                                             }
                          if(countMines(ax,ay)==0) openAdj(ax,ay);
                          
                          
                         }
                }
                }
}

//функция обработкисобытия нажания на ПРАВУЮ клавишу мыши
function rightClick(event)
{
    event.preventDefault();
    if (gameOver==0)
        {

            var cell=event.target;
            var ax=Number.parseInt(cell.getAttribute("x"));
            var ay=Number.parseInt(cell.getAttribute("y"));
            if(SField[ax][ay]!==1)
            {
            if (SField[ax][ay]==0)
                {
                    cell.className="squareR"; 
                    SField[ax][ay]=-1;
                    markedMines++;
                }          
            else 
                {cell.className="squareB"; 
                 SField[ax][ay]=0;
                 markedMines--;
                }           
            }
        }
}
     
function countMines(ax,ay)
{
    var m=0;
    for (var i =-1;i<=1;i++){
        for (var j =-1;j<=1;j++){
            if((i!==0)||(j!==0)){
                if((ax+i>=0)&&(ax+i<x)&&(ay+j>=0)&&(ay+j<y)) 
                    {m=m+MField[ax+i][ay+j];
                    }
            }
        }
    }
    return m;
}

function openAdj(ax,ay){
     var m =0;
     for (var i =-1;i<=1;i++){
        for (var j =-1;j<=1;j++){
            if((ax+i>=0)&&(ax+i<x)&&(ay+j>=0)&&(ay+j<y)) {
                if (SField[ax+i][ay+j]==0)
                    { SField[ax+i][ay+j]=1;
                      m=countMines(ax+i,ay+j);
                      A[ax+i][ay+j].innerHTML=m;
                      A[ax+i][ay+j].className="squareW";
                      oMines++;
                       tablo.innerHTML="Открыто: " + oMines + "         Помечено:  " + markedMines;
                       if ((oMines==x*y-mn)&&(markedMines==mn)){gameOver =1;
                                               tFinish=window.performance.now();
                                              $("#gameResult").html("Congratulations!!! You win!!!");
                                             }
                       else if (m==0) {openAdj(ax+i,ay+j);}
                    }
    
            }

        }
     }
}
initGame(x,y,mn);
var gameInterval=setInterval(showTime,100);

function showTime(){
    if(gameOver==0){
        var tNow =Math.floor((window.performance.now()-tStart)/100)/10;
        timer.innerHTML ="Время:  "+tNow;
    }
    else clearInterval(gameInterval);
}