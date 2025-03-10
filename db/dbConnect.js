const mongoose = require("mongoose");

require('dotenv').config()
console.log(process.env.DB_USER)


const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.txnf3sg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`



async function dbConnect() {
        try {
            await mongoose.connect(mongoURI);
            console.log('Database is connected');
        } catch (error) {
            console.log("Something went wrong, couldn't connect with database", error);
        }

}

module.exports = dbConnect

 