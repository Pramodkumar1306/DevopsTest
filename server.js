const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 NAVBAR (COMMON)
function navbar(){
return `
<div style="background:#111;padding:15px;text-align:center;">
<a href="/" style="color:white;margin:15px;">CRUD</a>
<a href="/snake" style="color:white;margin:15px;">Snake 🐍</a>
<a href="/mario" style="color:white;margin:15px;">Mario 🍄</a>
</div>
`;
}

// 🔥 DB CONNECTION
const pool = new Pool({
    user: "azurepramod",
    host: "pramod-postgres-db.postgres.database.azure.com",
    database: "postgres",
    password: "Pa$$word1234567890",
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

pool.connect();

// ===================== CRUD =====================
app.get("/", async (req, res) => {
    const result = await pool.query("SELECT * FROM users ORDER BY id");

    let rows = result.rows.map(u => `
    <tr>
        <td>${u.id}</td>
        <td>${u.name}</td>
        <td>
            <form method="POST" action="/delete/${u.id}">
                <button>❌</button>
            </form>
        </td>
    </tr>`).join("");

    res.send(`
    <html><body style="background:#222;color:white;text-align:center;">
    ${navbar()}
    <h2>CRUD Dashboard</h2>

    <form method="POST" action="/add">
        <input name="name" required/>
        <button>Add</button>
    </form>

    <table border="1" style="margin:auto;">
    <tr><th>ID</th><th>Name</th><th>Action</th></tr>
    ${rows}
    </table>
    </body></html>
    `);
});

app.post("/add", async (req, res) => {
    await pool.query("INSERT INTO users(name) VALUES($1)", [req.body.name]);
    res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
    await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);
    res.redirect("/");
});

// ===================== SNAKE GAME =====================
app.get("/snake", (req, res) => {
res.send(`
<html>
<body style="background:black;color:white;text-align:center;">
${navbar()}
<h2>🐍 Snake Game</h2>
<h3>Score: <span id="score">0</span></h3>

<canvas id="game" width="400" height="400" style="background:#111;"></canvas>

<script>
const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");

let snake=[{x:200,y:200}];
let dx=20,dy=0;
let food={x:100,y:100};
let score=0;

document.addEventListener("keydown",e=>{
if(e.key==="ArrowUp"){dx=0;dy=-20;}
if(e.key==="ArrowDown"){dx=0;dy=20;}
if(e.key==="ArrowLeft"){dx=-20;dy=0;}
if(e.key==="ArrowRight"){dx=20;dy=0;}
});

function game(){
let head={x:snake[0].x+dx,y:snake[0].y+dy};

if(head.x<0||head.y<0||head.x>=400||head.y>=400){
alert("Game Over Score:"+score);
location.reload();
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

ctx.clearRect(0,0,400,400);

ctx.fillStyle="red";
ctx.fillRect(food.x,food.y,20,20);

ctx.fillStyle="lime";
snake.forEach(s=>ctx.fillRect(s.x,s.y,20,20));
}

setInterval(game,100);
</script>
</body>
</html>
`);
});

// ===================== MARIO GAME =====================
app.get("/mario", (req, res) => {
res.send(`
<html>
<body style="background:#5c94fc;margin:0;overflow:hidden;">
${navbar()}

<h2 style="text-align:center;color:white;">🍄 Mario Game</h2>

<div id="gameArea" style="position:relative;width:100%;height:400px;background:#5c94fc;">
    <div id="ground" style="position:absolute;bottom:0;width:100%;height:40px;background:#228B22;"></div>
    <div id="mario" style="width:40px;height:40px;background:red;position:absolute;bottom:40px;left:50px;"></div>
</div>

<script>
let mario=document.getElementById("mario");
let x=50;
let y=40;
let velocity=0;
let gravity=1;
let jumping=false;

document.addEventListener("keydown",e=>{
if(e.key==="ArrowRight"){x+=10;}
if(e.key==="ArrowLeft"){x-=10;}

if(e.key===" " && !jumping){
jumping=true;
velocity=15;
}
});

function gameLoop(){
velocity-=gravity;
y+=velocity;

if(y<=40){
y=40;
jumping=false;
}

mario.style.left=x+"px";
mario.style.bottom=y+"px";

requestAnimationFrame(gameLoop);
}

gameLoop();
</script>
</body>
</html>
`);
});

// =====================
app.get("/health",(req,res)=>res.send("OK"));

app.listen(4000,"0.0.0.0",()=>{
console.log("🚀 Server running on port 4000");
});