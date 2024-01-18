// const express = require("express");
// const app = express();
// const multer = require("multer");
// const path = require("path");

// require("dotenv").config();
// const PORT = process.env.PORT || 3000;

// const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.use(express.static("public"));

// const exphbs = require("express-handlebars");
// const handlebarsHelpers = require("handlebars-helpers")();
// const hbs = exphbs.create({
//   helpers: handlebarsHelpers,
// });
// app.engine("handlebars", hbs.engine);
// app.set("view engine", "handlebars");
// app.set("views", "./views");

// const mongoose = require("mongoose");
// const Project = require("./models/project");

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.log(error);
//     process.exit(1)
//   }
// };

// app.get("/", async (req, res) => {
//   try {
//     const projects = await Project.find({}).lean()

//     res.render("pages/home", { projects });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Er is een fout opgetreden bij het ophalen van de transacties.");
//   }
// });

// app.post("/new", async (req, res) => {
//   try {
//     const { title } = req.body;

//     const newProject = new Project({
//       title
//     });

//     await newProject.save();

//     res.redirect("/"); // Redirect naar de hoofdpagina na het opslaan van de transactie
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Er is een fout opgetreden bij het toevoegen van de transactie.");
//   }
// });





// app.get("/project/:id", async (req, res) => {
//   try {
//     const projectId = req.params.id;
//     const project = await Project.findById(projectId).lean();
//     res.render("pages/project", { project });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error fetching project details.");
//   }
// });

// // Multer setup for handling file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "public", "uploads"));
//   },  
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// app.post("/project/:id/upload", upload.single("zipFile"), async (req, res) => {
//   try {
//     const projectId = req.params.id;
//     const { zipName } = req.body;
//     const zipPath = req.file.path;

//     await Project.findByIdAndUpdate(
//       projectId,
//       {
//         $push: {
//           zipFiles: {
//             name: zipName,
//             path: zipPath,
//           },
//         },
//       },
//       { new: true }
//     );

//     res.redirect(`/project/${projectId}`);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error uploading zip file.");
//   }
// });


// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log("listening for requests");
//   });
// });

const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");

require("dotenv").config();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

const exphbs = require("express-handlebars");
const handlebarsHelpers = require("handlebars-helpers")();
const hbs = exphbs.create({
  helpers: handlebarsHelpers,
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

// Mongoose schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  zipFiles: [
    {
      name: { type: String, required: true },
      fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
    },
  ],
});

const fileSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
});

const Project = mongoose.model("Project", projectSchema);
const File = mongoose.model("File", fileSchema);

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", async (req, res) => {
  try {
    const projects = await Project.find({}).lean();
    res.render("pages/home", { projects });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching projects.");
  }
});

app.post("/new", async (req, res) => {
  try {
    const { title } = req.body;

    const newProject = new Project({
      title,
    });

    await newProject.save();

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding project.");
  }
});

app.get("/project/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId).lean();
    res.render("pages/project", { project });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching project details.");
  }
});

app.post("/project/:id/upload", upload.single("zipFile"), async (req, res) => {
  try {
    const projectId = req.params.id;
    const { zipName } = req.body;
    const zipBuffer = req.file.buffer;

    const file = new File({
      filename: zipName,
      data: zipBuffer,
    });

    await file.save();

    await Project.findByIdAndUpdate(
      projectId,
      {
        $push: {
          zipFiles: {
            name: zipName,
            fileId: file._id,
          },
        },
      },
      { new: true }
    );

    res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading zip file.");
  }
});

app.get("/download/:fileId", async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).send("File not found");
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename=${file.filename}`);
    res.send(file.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error downloading zip file.");
  }
});


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  });
});
