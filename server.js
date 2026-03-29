const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = [];
let idCounter = 1;

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
    <button>Updates</button>
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

app.post("/add", (req, res) => {
    const { name } = req.body;
    users.push({ id: idCounter++, name });
    res.redirect("/");
});

app.post("/update", (req, res) => {
    const { id, name } = req.body;
    users = users.map(u => u.id == id ? { ...u, name } : u);
    res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
    const id = req.params.id;
    users = users.filter(u => u.id != id);
    res.redirect("/");
});

app.get("/health", (req, res) => {
    res.send("OK");
});

app.listen(4000, "0.0.0.0", () => {
    console.log("Server running on port 4000");
});