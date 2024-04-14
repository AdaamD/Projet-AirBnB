const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 8888;
const cors = require('cors');


// Connexion à la base de données MongoDB
async function connectToDatabase() {
    try {
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();     //away bloque le code en attendant de recevoir le code 
        console.log("Connexion à la base de données réussie");
        return client.db("MEAN"); // Remplacez 'MEAN' par le nom de votre base de données
    } catch (error) {
        console.error("Erreur lors de la connexion à la base de données :", error);
        throw error;
    }
}

app.use(cors({
    origin: 'http://localhost:4200'
  }));
  

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

        // Créer un objet JSON contenant à la fois les documents et le nombre de documents
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

// Route pour effectuer des recherches de biens selon plusieurs critères
app.get("/biens/recherche/:commune/:nbCouchagesMin/:prixMax/:nbChambresMin/:distanceMax", async (req, res) => {
    const { commune, nbCouchagesMin, prixMax, nbChambresMin, distanceMax } = req.params;
    try {
        const db = await connectToDatabase();
        const query = { commune: commune };
        
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
    const { commune, nbCouchagesMin, prixMax, nbChambresMin, distanceMax } = req.params;
    try {
        const db = await connectToDatabase();
        const query = { };
        
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


// Route pour enregistrer une réservation
app.post("/reservations", async (req, res) => {
    try {
    const { idBien, dateDebut, dateFin, mailLoueur, prixNuit } = req.body;
   
    // Vérifier si toutes les données requises sont présentes
    if (!idBien || !dateDebut || !dateFin || !mailLoueur || !prixNuit) {
    throw new Error("Les données de la requête sont incorrectes.");
    }
   
    const db = await connectToDatabase();
   
    // Vérifier si idBien est une chaîne hexadécimale valide de 24 caractères
    if (!ObjectId.isValid(idBien)) {
    throw new Error("idBien n'est pas valide.");
    }
   
    // Créer un nouvel ObjectId à partir de la chaîne idBien
    const objectIdBien = new ObjectId(idBien);
   
    // Créer un nouveau document pour la réservation
    const newReservation = {
    idBien: objectIdBien,
    dateDebut,
    dateFin,
    mailLoueur,
    prixNuit: parseFloat(prixNuit) // Convertir le prix en nombre à virgule flottante
    };
   
    // Insérer la nouvelle réservation dans la collection Locations de la base de données
    const result = await db.collection("Locations").insertOne(newReservation);
   
    res.status(201).json({ message: "Réservation enregistrée avec succès", reservation: newReservation });
    } catch (error) {
    console.error("Erreur lors de l'enregistrement de la réservation :", error);
    res.status(500).json({ message: "Une erreur est survenue lors de l'enregistrement de la réservation." });
    }
   });

// Route pour récupérer les biens d'une commune qui ne sont pas déjà loués
app.get("/bienslouer/:commune", async (req, res) => {
    const commune = req.params.commune;
    try {
    const db = await connectToDatabase();
   
    // Requête pour récupérer les biens de la commune qui ne sont pas déjà loués
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
    $match: { "locations": { $eq: [] } } // Exclure les biens déjà loués
    }
    ]).toArray();
   
    res.json(biensNonLoues);
    } catch (error) {
    console.error("Erreur lors de la récupération des biens de la commune :", error);
    res.status(500).json({ message: "Une erreur est survenue lors de la récupération des biens." });
    }
   });
   
   












// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur Express écoutant sur le port ${port}`);
});
