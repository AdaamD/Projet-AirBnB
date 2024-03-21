const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 8888;

// Connexion à la base de données MongoDB
async function connectToDatabase() {
    try {
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
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



// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur Express écoutant sur le port ${port}`);
});
