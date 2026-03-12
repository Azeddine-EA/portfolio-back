require("dotenv").config();
const mongoose = require("mongoose");

const connectionString = process.env.CONNEXION_STRING;

mongoose
	.connect(connectionString, { connectTimeoutMS: 2000 })
	.then(() => {
		console.log("Connected");
		console.log("DB name:", mongoose.connection.name);
	})

	.catch((error) => console.error(error));
