app.get("/", async (req, res) => {
    const result = await pool.query("SELECT * FROM users ORDER BY id");

    let rows = result.rows.map(user => `
    <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>
            <form method="POST" action="/delete/${user.id}">
                <button>❌</button>
            </form>
        </td>
    </tr>
    `).join("");

    res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Super Dashboard</title>

<style>
body {
    margin:0;
    font-family: Arial;
    background:#111;
    color:white;
}

.navbar {
    background:#000;
    padding:15px;
    text-align:center;
}

.navbar button {
    margin:10px;
    padding:10px 20px;
    cursor:pointer;
}

.section { display:none; padding:20px; }
.active { display:block; }

canvas {
    background:#222;
    display:block;
    margin:auto;
}
</style>

</head>

<body>

<div class="navbar">
<button onclick="show('crud')">CRUD</button>
<button onclick="show('snake')">Snake 🐍</button>
<button onclick="show('game')">Game 🎮</button>
</div>

<!-- ================= CRUD ================= -->
<div id="crud" class="section active">
<h2>CRUD</h2>

<form method="POST" action="/add">
<input name="name" required>
<button>Add</button>
</form>

<table border="1" style="margin:auto;">
<tr><th>ID</th><th>Name</th><th>Action</th></tr>
${rows}
</table>
</div>

<!-- ================= SNAKE ================= -->
<div id="snake" class="section">
<h2>Snake Game</h2>
<h3>Score: <span id="score">0</span></h3>
<canvas id="snakeGame" width="400" height="400"></canvas>
</div>

<!-- ================= SHOOTING GAME ================= -->
<div id="game" class="section">
<h2>Shooting Game</h2>
<p>⬅️ ➡️ Move | SPACE Shoot</p>
<canvas id="shootGame" width="800" height="400"></canvas>
</div>

<script>
// 🔥 NAV SWITCH
function show(id){
    document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// ================= SNAKE =================
const sCanvas=document.getElementById("snakeGame");
const sCtx=sCanvas.getContext("2d");

let snake=[{x:200,y:200}],dx=20,dy=0;
let food={x:100,y:100},score=0;

document.addEventListener("keydown",e=>{
if(e.key==="ArrowUp"){dx=0;dy=-20;}
if(e.key==="ArrowDown"){dx=0;dy=20;}
if(e.key==="ArrowLeft"){dx=-20;dy=0;}
if(e.key==="ArrowRight"){dx=20;dy=0;}
});

function snakeGame(){
let head={x:snake[0].x+dx,y:snake[0].y+dy};

if(head.x<0||head.y<0||head.x>=400||head.y>=400){
snake=[{x:200,y:200}];score=0;
}

snake.unshift(head);

if(head.x===food.x&&head.y===food.y){
score++;
document.getElementById("score").innerText=score;
food.x=Math.floor(Math.random()*20)*20;
food.y=Math.floor(Math.random()*20)*20;
}else{
snake.pop();
}

sCtx.clearRect(0,0,400,400);

sCtx.fillStyle="red";
sCtx.fillRect(food.x,food.y,20,20);

sCtx.fillStyle="lime";
snake.forEach(s=>sCtx.fillRect(s.x,s.y,20,20));
}
setInterval(snakeGame,100);

// ================= SHOOT GAME =================
const canvas=document.getElementById("shootGame");
const ctx=canvas.getContext("2d");

let player={x:50,y:300};
let bullets=[],enemies=[],score2=0;

document.addEventListener("keydown",e=>{
if(e.key==="ArrowRight") player.x+=20;
if(e.key==="ArrowLeft") player.x-=20;

if(e.key===" ") bullets.push({x:player.x+40,y:player.y+15});
});

setInterval(()=>{ enemies.push({x:800,y:300}); },2000);

function game(){
ctx.clearRect(0,0,800,400);

ctx.fillStyle="lime";
ctx.fillRect(player.x,player.y,40,40);

bullets.forEach((b,i)=>{
b.x+=10;
ctx.fillStyle="yellow";
ctx.fillRect(b.x,b.y,10,5);
});

enemies.forEach((e,ei)=>{
e.x-=3;
ctx.fillStyle="red";
ctx.fillRect(e.x,e.y,40,40);

bullets.forEach((b,bi)=>{
if(b.x<e.x+40 && b.x+10>e.x){
enemies.splice(ei,1);
bullets.splice(bi,1);
score2++;
}
});

if(e.x<0){
alert("Game Over Score:"+score2);
location.reload();
}
});

ctx.fillStyle="white";
ctx.fillText("Score:"+score2,10,20);

requestAnimationFrame(game);
}
game();

</script>

</body>
</html>
`);
});