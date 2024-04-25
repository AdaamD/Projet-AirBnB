const express = require("express");
const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = 8888;
const cors = require('cors');

app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:4200'
}));

// Connexion à la base de données MongoDB
async function connectToDatabase() {
    try {
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log("Connexion à la base de données réussie");
        return client.db("MEAN");
    } catch (error) {
        console.error("Erreur lors de la connexion à la base de données :", error);
        throw error;
    }
}

const dataFolderPath = path.join(__dirname, "Data");

// Créer le répertoire s'il n'existe pas
if (!fs.existsSync(dataFolderPath)) {
    fs.mkdirSync(dataFolderPath);
}

const reservationsFilePath = path.join(dataFolderPath, "Locations.json");

// Créer le fichier Locations.json s'il n'existe pas
if (!fs.existsSync(reservationsFilePath)) {
    fs.writeFileSync(reservationsFilePath, JSON.stringify([]));
    console.log("Fichier Locations.json créé avec succès.");
}

// Fonction pour écrire les réservations dans le fichier Locations.json
function writeReservationsToFile(reservations) {
    try {
        // Écrire les réservations dans le fichier Locations.json
        fs.writeFileSync(reservationsFilePath, JSON.stringify(reservations, null, 2));
        console.log("Réservations enregistrées dans le fichier Locations.json avec succès.");
    } catch (error) {
        console.error("Erreur lors de l'écriture dans le fichier Locations.json :", error);
    }
}

// Route pour récupérer les utilisateurs
app.get("/users", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const documents = await db.collection("Users").find().toArray();
        res.json(documents);
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la récupération des utilisateurs." });
    }
});

// Route pour récupérer les biens et compter leurs nombre
app.get("/biens", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const documents = await db.collection("Biens").find().toArray();
        const nbDocuments = await db.collection("Biens").countDocuments();

        const response = {
            documents: documents,
            count: nbDocuments
        };
        res.json(response);
    } catch (error) {
        console.error("Erreur lors de la récupération des biens :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la récupération des biens." });
    }
});

// Route pour récupérer les biens d'une commune
app.get("/biens/:commune", async (req, res) => {
    const commune = req.params.commune;
    try {
        const db = await connectToDatabase();
        const documents = await db.collection("Biens").find({ commune: commune }).toArray();
        res.json(documents);
    } catch (error) {
        console.error("Erreur lors de la récupération des biens de la commune :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la récupération des biens." });
    }
});

// Route pour rechercher des biens par commune et nombre de couchages minimum
app.get("/biens/:commune/:nbCouchagesMin", async (req, res) => {
    const { commune, nbCouchagesMin } = req.params;
    try {
        const db = await connectToDatabase();
        const documents = await db.collection("Biens").find({ commune: commune, nbCouchages: { $gte: parseInt(nbCouchagesMin) } }).toArray();
        res.json(documents);
    } catch (error) {
        console.error("Erreur lors de la recherche des biens par commune et nombre de couchages minimum :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la recherche des biens." });
    }
});

/// Route pour effectuer des recherches de biens selon plusieurs critères
app.get("/biens/recherche/:commune/:nbCouchagesMin/:prixMax/:nbChambresMin/:distanceMax", async (req, res) => {
    const { commune, nbCouchagesMin, prixMax, nbChambresMin, distanceMax } = req.params;
    try {
      const db = await connectToDatabase();
      const query = { commune: commune, estReserve: { $ne: true } };
  
      if (nbCouchagesMin !== 'null') {
        query.nbCouchages = { $gte: parseInt(nbCouchagesMin) };
      }
      if (prixMax !== 'null') {
        query.prixNuit = { $lte: parseInt(prixMax) };
      }
      if (nbChambresMin !== 'null') {
        query.nbChambres = { $gte: parseInt(nbChambresMin) };
      }
      if (distanceMax !== 'null') {
        query.distance = { $lte: parseFloat(distanceMax) };
      }
  
      const documents = await db.collection("Biens").find(query).toArray();
      res.json(documents);
    } catch (error) {
      console.error("Erreur lors de la recherche des biens :", error);
      res.status(500).json({ message: "Une erreur est survenue lors de la recherche des biens." });
    }
  });

// Route pour effectuer des recherches de biens selon plusieurs critères SANS COMMUNE
app.get("/biens/recherche/:nbCouchagesMin/:prixMax/:nbChambresMin/:distanceMax", async (req, res) => {
    const { nbCouchagesMin, prixMax, nbChambresMin, distanceMax } = req.params;
    try {
        const db = await connectToDatabase();
        const query = {};

        if (nbCouchagesMin !== 'null') {
            query.nbCouchages = { $gte: parseInt(nbCouchagesMin) };
        }
        if (prixMax !== 'null') {
            query.prixNuit = { $lte: parseInt(prixMax) };
        }
        if (nbChambresMin !== 'null') {
            query.nbChambres = { $gte: parseInt(nbChambresMin) };
        }
        if (distanceMax !== 'null') {
            query.distance = { $lte: parseFloat(distanceMax) };
        }

        const documents = await db.collection("Biens").find(query).toArray();
        res.json(documents);
    } catch (error) {
        console.error("Erreur lors de la recherche des biens :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la recherche des biens." });
    }
});

// Route pour récupérer les biens qui sont loués
app.get("/locations", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const documents = await db.collection("Locations").find().toArray();
        const nbDocuments = await db.collection("Locations").countDocuments();

        const response = {
            documents: documents,
            count: nbDocuments
        };
        res.json(response);
    } catch (error) {
        console.error("Erreur lors de la récupération des biens :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la récupération des biens." });
    }
});

// Route pour récupérer les biens d'une commune qui ne sont pas déjà loués
app.get("/bienslouer/:commune", async (req, res) => {
    const commune = req.params.commune;
    try {
        const db = await connectToDatabase();

        const biensNonLoues = await db.collection("Biens").aggregate([
            {
                $match: { commune: commune }
            },
            {
                $lookup: {
                    from: "Locations",
                    localField: "idBien",
                    foreignField: "idBien",
                    as: "locations"
                }
            },
            {
                $match: { "locations": { $eq: [] } }
            }
        ]).toArray();

        res.json(biensNonLoues);
    } catch (error) {
        console.error("Erreur lors de la récupération des biens de la commune :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la récupération des biens." });
    }
});

// Route pour enregistrer une réservation
app.post("/reservations", async (req, res) => {
    try {
      const { idBien, dateDebut, dateFin, mailLoueur, prixNuit } = req.body;
  
      if (!idBien || !dateDebut || !dateFin || !mailLoueur || !prixNuit) {
        throw new Error("Les données de la requête sont incorrectes.");
      }
  
      const intIdBien = parseInt(idBien);
  
      const db = await connectToDatabase();
  
      // Marquer le bien comme réservé
      await db.collection("Biens").updateOne(
        { idBien: intIdBien },
        { $set: { estReserve: true } }
      );
      
  
      const newReservation = {
        idBien: intIdBien,
        dateDebut,
        dateFin,
        mailLoueur,
        prixNuit: parseFloat(prixNuit)
      };
  
      await db.collection("Locations").insertOne(newReservation);
  
      const existingReservations = JSON.parse(fs.readFileSync(reservationsFilePath, "utf-8"));
      existingReservations.push(newReservation);
      writeReservationsToFile(existingReservations);
  
      res.status(201).json({ message: "Réservation enregistrée avec succès", reservation: newReservation });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la réservation :", error);
      res.status(500).json({ message: "Une erreur est survenue lors de l'enregistrement de la réservation." });
    }
  });

// Route pour laisser un avis sur un bien
app.post("/laisseravis", async (req, res) => {
    const { idBien, note, commentaire } = req.body;
    try {
        const intIdBien = parseInt(idBien);

        const db = await connectToDatabase();

        const newAvis = {
            idBien: intIdBien,
            note,
            commentaire
        };

        const result = await db.collection("Avis").insertOne(newAvis);

        const avisEnregistre = {
            _id: result.insertedId,
            idBien: intIdBien,
            note,
            commentaire
        };

        res.status(201).json({ message: "Avis enregistré avec succès", avis: avisEnregistre });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'avis :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de l'enregistrement de l'avis." });
    }
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur Express écoutant sur le port ${port}`);
});
