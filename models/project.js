// // project.model.js

// const mongoose = require("mongoose");

// const projectSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   zipFiles: [
//     {
//       name: { type: String, required: true },
//       path: { type: String, required: true },
//       // You may add more fields as needed, e.g., date, description, etc.
//     },
//   ],
// });

// module.exports = mongoose.model("Project", projectSchema);

const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  zipFiles: [
    {
      name: { type: String, required: true },
      fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
    },
  ],
});

const Project = mongoose.model("Project", projectSchema);
const File = mongoose.model("File", fileSchema);

module.exports = { Project, File };
