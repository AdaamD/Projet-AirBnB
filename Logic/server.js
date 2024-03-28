const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 8888;

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

// Route pour récupérer les utilisateurs dont le nom commence par D
app.get("/users/D", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const documents = await db.collection("Users").find({ nom: { $regex: '^D', $options: 'i' } }).toArray();
        res.json(documents);
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs dont le nom commence par D :", error);
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
app.get("/biens/:commune/:nbCouchagesMin/:prixMax/:nbChambresMin/:distanceMax", async (req, res) => {
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











// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur Express écoutant sur le port ${port}`);
});
