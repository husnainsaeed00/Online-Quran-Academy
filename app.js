// Required modules
const express = require("express");
const session = require("express-session");
const { Session } = require("inspector");
const mysql = require("mysql");
var path = require("path");

// Create the Express app
const app = express();
app.use(express.static("./public"));
app.use("/images", express.static(path.resolve("/img")));
app.use("/js", express.static(path.resolve("/js")));
app.use("/css", express.static(path.resolve("/css")));

// Set the views directory
app.set("views", "./views");
// Set the template engine
app.set("view engine", "ejs");
// Middleware
app.use(express.json());

// Database connection configuration
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "islamacademy",
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Failed to connect to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to pass loggedIn variable to all EJS views
app.use(function (req, res, next) {
  res.locals.loggedIn = req.session.loggedIn;
  next();
});

/**
 * ============Account Code [SignUp and LOGIN] Get methpds
 */
//#region SIGNUP CODE GET METHOD
app.get("/SignUp", (req, res) => {
  var msg = "";
  res.render("SignUp", { msg: "" });
});
//#endregion SIGNUP CODE GET METHOD

//#region LOGIN CODE GET method
app.get("/login", (req, res) => {
  res.render("login");
});
//#endregion LOGIN CODE GET method

//#region SignUp POST method
// Route to handle form submission
app.post("/SignUp", (req, res) => {
  const { fname, lname, email, password } = req.body;

  // Check if the email already exists in the database
  const checkEmailQuery = "SELECT * FROM register WHERE email = ?";
  connection.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error("Failed to execute query:", err);
      res.status(500).send("Registration failed");
    } else {
      if (results.length > 0) {
        res.render("SignUp", { msg: "Email already exists" });
      } else {
        // Email does not exist, proceed with registration
        const insertQuery =
          "INSERT INTO register (fname,lname,email, password) VALUES (?, ?, ?, ?)";
        const values = [fname, lname, email, password];

        // Execute the query to insert the data
        connection.query(insertQuery, values, (err) => {
          if (err) {
            console.error("Failed to insert student:", err);
            res.status(500).send("Registration failed");
          } else {
            res.render("SignUp.ejs", { msg: "Registration successful!" });
          }
        });
      }
    }
  });
});
//#endregion SignUp POST method

//#region LOGIN POST METHOD

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists in the database
  const query = "SELECT * FROM register WHERE email = ? AND password = ?";
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Failed to execute query:", err);
      res.status(500).send("Login failed");
    } else {
      if (results.length > 0) {
        // User exists, create a session and set loggedIn flag
        req.session.loggedIn = true;
        res.redirect("/");
      } else {
        // User does not exist or invalid credentials
        res.render("login.ejs", { msg: "Invalid email or password" });
      }
    }
  });
});

//#endregion LOGIN POST METHOD

//#region LOGOUT METHOD
// Logout route
app.get("/logout", (req, res) => {
  // Perform logout logic here

  // Clear the loggedIn flag in the session
  req.session.loggedIn = false;

  res.render("index.ejs");
});
//#endregion LOGOUT METHOD

/**
 * ==========RENDERING PAGES GET METHODS================
 */
// Route to render the HTML page
app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
if(req.session.loggedIn){
  res.render("index.ejs");
}else{
res.redirect('/login')
}
});

app.get("/enroll", (req, res) => {
  if(req.session.loggedIn){
    return res.render("enroll.ejs", { data: "" });
  }
  
});

/**
 * ===================POSTING A DATA TO DB
 */

// Route to handle form submission
app.post("/enroll", (req, res) => {
  if(req.session.loggedIn){
    const { fname, lname, age, email, course } = req.body;
    // SQL query to insert the data
    const sql =
      "INSERT INTO enroll (Fname,Lname, Age, Email, Course) VALUES (?,?,?,?,?)";
    const values = [fname, lname, age, email, course];
    // Execute the query
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error("Failed to insert student:", err);
        res.status(500).send("Registration failed");
      } else {
        res.render("enroll.ejs", { data: "You are registered for this course." });
      }
    });
  }
  
});

// Route to handle form submission
app.get("/Admin", (req, res) => {
  if(req.session.loggedIn){
    const sql = "SELECT * FROM enroll";
    // Execute the query
    connection.query(sql, (err, results) => {
      if (err) {
        console.error("Failed to fetch data:", err);
        res.status(500).send("Failed to fetch data");
      } else {
        res.render("Admin.ejs", { enrolldata: results });
      }
    });
  }
 
});

// Handle the user deletion
app.post('/DeletUser', (req, res) => {
  const userId = req.body.userId;
  // Delete the user from the database
  const query = 'DELETE FROM enroll WHERE id = ?';
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Failed to delete user:', err);
      res.status(500).send('User deletion failed');
    } else {
      res.redirect('/Admin')
    }
  });
});

// // Route to handle form submission
// app.post("/Admin", (req, res) => {
//   const { email, password } = req.body;

//   // Check if the user exists in the database
//   const query = "SELECT * FROM adminlogin WHERE email = ? AND password = ?";
//   connection.query(query, [email, password], (err, results) => {
//     if (err) {
//       console.error("Failed to execute query:", err);
//       res.status(500).send("Login failed");
//     } else {
//       if (results.length > 0) {
//         // User exists
//         const sql = "SELECT * FROM enroll";
//         // Execute the query
//         connection.query(sql, (err, results) => {
//           if (err) {
//             console.error("Failed to fetch data:", err);
//             res.status(500).send("Failed to fetch data");
//           } else {
//             res.render("Admin.ejs", { enrolldata: results });
//           }
//         });

//       } else {
//         // User does not exist or invalid credentials
//         res.render("AdminLogIn.ejs", { msg: "Invalid email or password" });
//       }
//     }
//   });
// });

// Start the server
app.listen(3000, () => console.log("Server is running on port 3000"));
