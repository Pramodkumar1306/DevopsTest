const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DATA_FILE = "/data/users.json";

let users = [];
let idCounter = 1;

// ✅ Load data from PVC when app starts
if (fs.existsSync(DATA_FILE)) {
    try {
        users = JSON.parse(fs.readFileSync(DATA_FILE));
        idCounter = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    } catch (err) {
        console.log("Error reading file, starting fresh");
        users = [];
    }
}

// ✅ Save data to PVC
function saveData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users));
}

app.get("/", (req, res) => {
    let rows = users.map(user => `
    <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>
            <form method="POST" action="/delete/${user.id}" style="display:inline;">
                <button>Delete</button>
            </form>
            <button onclick="editUser(${user.id}, '${user.name}')">Edit</button>
        </td>
    </tr>
    `).join("");

    res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Simple App</title>
<script>
function editUser(id,name){
    document.getElementById("editId").value=id;
    document.getElementById("editName").value=name;
}
</script>
</head>
<body>

<h2>Add User</h2>
<form method="POST" action="/add">
    <input type="text" name="name" required />
    <button>Add</button>
</form>

<h2>Update User</h2>
<form method="POST" action="/update">
    <input type="hidden" id="editId" name="id"/>
    <input type="text" id="editName" name="name" required />
    <button>Update</button>
</form>

<table border="1">
<tr>
    <th>ID</th>
    <th>Name</th>
    <th>Action</th>
</tr>
${rows}
</table>

</body>
</html>
`);
});

// ✅ ADD
app.post("/add", (req, res) => {
    const { name } = req.body;
    users.push({ id: idCounter++, name });
    saveData();   // 🔥 IMPORTANT
    res.redirect("/");
});

// ✅ UPDATE
app.post("/update", (req, res) => {
    const { id, name } = req.body;
    users = users.map(u => u.id == id ? { ...u, name } : u);
    saveData();   // 🔥 IMPORTANT
    res.redirect("/");
});

// ✅ DELETE
app.post("/delete/:id", (req, res) => {
    const id = req.params.id;
    users = users.filter(u => u.id != id);
    saveData();   // 🔥 IMPORTANT
    res.redirect("/");
});

app.get("/health", (req, res) => {
    res.send("OK");
});

app.listen(4000, "0.0.0.0", () => {
    console.log("Server running on port 4000");
});