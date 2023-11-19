const express = require('express');
const app = express();
app.use(express.json());
const admin = require('firebase-admin');
const serviceAccount = require('../ServiceAccountKey.json');

admin.initializeApp({credential: admin.credential.cert(serviceAccount)});
const db = admin.firestore();

const verifyToken = async (req, res, next) => {
    const idToken = req.header('Authorization');
    if (!idToken) {
      return res.status(401).json({ error: 'Authorization header not found' });
    }
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error('Error verifying Firebase ID token:', error);
      res.status(403).json({ error: 'Invalid or expired Firebase ID token' });
    }
  };

async function fetchData() {
    try {
        const dataRef = db.collection('configurations');
        const snapshot = await dataRef.get();
        const configurationsData = [];
        snapshot.forEach(doc => {
            configurationsData.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return configurationsData;
    }
    catch (error) {
        console.error(error);
    }
}

app.get("/configurations", async (req, res) => {
    try {
        const configurationsData = await fetchData();
        console.log(configurationsData);
        res.status(200).json(configurationsData);
    }
    catch (error) {
        res.status(500).json({error: "Internal server error"});
    }
});

app.post("/modify", async (req, res) => {
    const {configParameter, configValue, configDescription} = req.body;
    console.log("Received data:", configParameter, configValue, configDescription);
    const configurationsRef = db.collection('configurations');
    const configurationsSnaphot = await configurationsRef.limit(1).get();
    if (configurationsSnaphot.empty) {
        await configurationsRef.doc();
    }
    const response = await configurationsRef.add({
        parameterKey: configParameter,
        description: configDescription,
        value: configValue,
        createDate: admin.firestore.Timestamp.now()
    });
    const addedDataSnapshot = await response.get();
    const addedData = {
        id: addedDataSnapshot.id,
        ...addedDataSnapshot.data()
    };

    res.status(201).json(addedData);
})

app.delete("/modify/:id", verifyToken, async (req, res) => {
    const id = req.params.id;

    try {
        const configurationRef = db.collection('configurations').doc(id);
        const deletedDataSnapshot = await configurationRef.get();
        const deletedData = {
            id: deletedDataSnapshot.id,
            ...deletedDataSnapshot.data()
        };

        await configurationRef.delete();
        console.log(deletedData);
        res.json({
            message: "DELETE request successful",
            deletedData: deletedData
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while deleting the configuration.");
    }
})

app.put("/modify/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    const {parameterKey, value, description} = req.body;
    const configurationRef = db.collection('configurations').doc(id);
    await configurationRef.update({
        parameterKey: parameterKey,
        value: value,
        description: description
    })
    console.log("Document updated successfully");

    const updatedDataSnapshot = await configurationRef.get();
    const updatedData = {
      id: updatedDataSnapshot.id,
      ...updatedDataSnapshot.data()
    };

    res.status(200).json(updatedData);

})



app.listen(5000, () => {console.log("Server started on port 5000") });