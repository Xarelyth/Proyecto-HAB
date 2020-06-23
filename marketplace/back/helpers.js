require("dotenv").config();
const { format } = require("date-fns");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const path = require("path");
const fs = require("fs-extra");
const uuid = require("uuid");
const sharp = require("sharp");
/* const fileUploadPath = path.join(__dirname, process.env.UPLOADS_DIR); */

function generateError(message, code) {
  const error = new Error(message);
  if (code) error.httpCode = code;
  return error;
}

function randomString(size = 20) {
  return crypto.randomBytes(size).toString("hex").slice(0, size);
}

function formatDateToDB(date) {
  return format(date, "yyyy-MM-dd");
}

async function sendEmail({ email, title, content }) {
  sgMail.setApiKey(process.env.SENDGRID_KEY);

  const msg = {
    to: email,
    from: "delisick@gmail.com",
    subject: title,
    text: content,
    html: `<div>
      <h1>Validate your email</h1>
      <p>${content}</p>  
    </div>`,
  };

  await sgMail.send(msg);
}

async function purchaseConfirmation({ email, title, content }) {
  sgMail.setApiKey(process.env.SENDGRID_KEY);

  const msg = {
    to: email,
    from: "delisick@gmail.com",
    subject: title,
    text: content,
    html: `<div>
      <h1>Purchase confirmation</h1>
      <p>${content}</p>  
    </div>`,
  };

  await sgMail.send(msg);
}

async function processAndSaveFile(uploadedFile) {
  const savedFileName = `${uuid.v1()}.jpg`;
  await fs.ensureDir(fileUploadPath);
  const finalFile = sharp(uploadedFile.data);
  const FileInfo = await finalFile.metadata();

  if (FileInfo.width > 100) {
    finalFile.resize(150);
  }

  await finalFile.toFile(path.join(fileUploadPath, savedFileName));

  return savedFileName;
}
async function deleteFile(imagePath) {
  if (path !== "../back/static/uploads/perfil.png")
    await fs.unlink(path.join(fileUploadPath, imagePath));
}

module.exports = {
  sendEmail,
  generateError,
  randomString,
  purchaseConfirmation,
  deleteFile,
  processAndSaveFile,
  formatDateToDB,
};