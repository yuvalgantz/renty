const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
const Busboy = require("@fastify/busboy");
const {Storage} = require("@google-cloud/storage");
const path = require("path");
const os = require("os");
const fs = require("fs");

admin.initializeApp();
// eslint-disable-next-line no-unused-vars
const storage = new Storage();

exports.addProduct = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const busboy = new Busboy({headers: req.headers});
    const fields = {};
    // eslint-disable-next-line no-unused-vars
    const uploads = [];

    let fileUploaded = null;

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      console.log("received busboy file event", file, filename, mimetype);
      const filepath = path.join(os.tmpdir(), filename);
      fileUploaded = {file: filepath, type: mimetype, name: filename};

      const writeStream = fs.createWriteStream(filepath);
      file.pipe(writeStream);

      file.on("end", () => {
        console.log(`File [${filename}] uploaded to temp dir.`);
      });
    });

    busboy.on("field", (fieldname, val) => {
      console.log("event field", fieldname, val);
      fields[fieldname] = val;
    });

    busboy.on("finish", async () => {
      if (!fileUploaded) {
        return res.status(400).send("No file uploaded.");
      }

      const bucket = admin.storage().bucket(); // Default bucket
      try {
        await bucket.upload(fileUploaded.file, {
          destination: `uploads/${fileUploaded.name}`,
          metadata: {
            contentType: fileUploaded.type,
            metadata: fields, // Optional: store form fields as metadata
          },
        });

        fs.unlinkSync(fileUploaded.file); // Clean up temp file

        // Create Firestore document with fields and file path
        const productData = {
          ...fields,
          imageUrl: `gs://${bucket.name}/uploads/${fileUploaded.name}`,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        // eslint-disable-next-line max-len
        const docRef = admin.firestore().collection("products").doc(); // צור מסמך עם ID ייחודי
        await docRef.set(productData);


        return res.status(200).json({
          message: "File uploaded and product saved successfully",
          id: docRef.id,
          fields: fields,
          fileName: fileUploaded.name,
        });
      } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).send("Internal Server Error");
      }
    });

    busboy.end(req.rawBody);
  });
});
