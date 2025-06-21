const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {Storage} = require("@google-cloud/storage");
const Busboy = require("@fastify/busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");

const cors = require("cors")({origin: true});

admin.initializeApp();
const db = admin.firestore();
const storage = new Storage();

exports.addProduct = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(405).send("Only POST requests are accepted");
    }

    const busboy = new Busboy({headers: req.headers});
    const fields = {};
    let uploadData;
    // eslint-disable-next-line max-len
    // the problem is here filepath is not getting
    // value and we need to see where it fails
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const filepath = path.join(os.tmpdir(), filename);
      console.log("filepath: ", filepath);
      console.log("yuval");
      uploadData = {file: filepath, type: mimetype};
      file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on("field", (fieldname, value) => {
      console.log("field", fieldname, " value", value);
      fields[fieldname] = value;
    });

    busboy.on("finish", async () => {
      try {
        const bucketName = "renty-final.appspot.com";
        console.log("uploadData", uploadData);
        const fileName = Date.now() + "_" + path.basename(uploadData.file);
        const destination = "products/" + fileName;

        await storage.bucket(bucketName).upload(uploadData.file, {
          destination,
          metadata: {contentType: uploadData.type},
        });

        const imageURL = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(destination)}?alt=media`;

        const newProduct = {
          name: fields.name,
          description: fields.description,
          category: fields.category,
          price: fields.price,
          ownerName: fields.ownerName,
          ownerPhone: fields.ownerPhone,
          location: fields.location,
          startDate: fields.startDate,
          endDate: fields.endDate,
          imageURL,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const productRef = await db.collection("products").add(newProduct);
        res.status(200).json({success: true, id: productRef.id});
      } catch (err) {
        console.error("Upload failed:", err);
        res.status(500).send("Internal Server Error");
      }
    });

    req.pipe(busboy);
  });
});

