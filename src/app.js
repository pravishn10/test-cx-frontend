const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
const detectIntentText = require("./utils/detectIntentText");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname,"../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");



// Setup handlebars engine and views location
app.set("view engine", "hbs");
// This is to set views path, standard practice is express looks up in view folder
app.set("views", viewsPath);

hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
    res.render("index", {
        title: "Weather",
        name: "Vishnu"
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About me",
        name: "Vishnu"
    });
});

app.get("/help", (req, res) => {
    res.render("help", {
        title: "Help",
        name: "Vishnu",
        helpText: "This is some helpful text."
    });
});

app.get("/weather", (req, res) => {
    const address = req.query.address;
    if(!address){
        return res.send({
            error: "You must provide an address."
        });
    }
    geocode(address, (error, {latitude, longitude, location} = {}) => {
    
        if(error) {
            return res.send({
                error
            });
        }
        
        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({
                    error
                });
            }
            res.send({
                forecast: forecastData,
                location,
                address
            });
        });
    });
});

app.get("/detectIntent", (req, res) => {
    res.render("detectintent", {
        title: "Detect Intent",
        name: "Vishnu"
    });
});

app.get("/detectIntentText", (req, res) => {
    if(!req.query.text){
        return res.send({
            error: "You must provide a input text."
        });
    }
    
    console.log(req.query);
    detectIntentText(req.query.text, (error, {text, matchedIntentOREvent, currentPage} = {}) => {
        if(error) {
            return res.send({
                error
            });
        }
        res.send({
            text,
            matchedIntentOREvent,
            currentPage
        });
    });
    
});

app.get("/help/*", (req, res) => {
    res.render("404", {
        title: "404 Help",
        name: "Vishnu",
        errorMessage: "Help article not found."
    });
});

app.get("*", (req, res) => {
    res.render("404", {
        title: "404",
        name: "Vishnu",
        errorMessage: "Page not found."
    });
});

app.listen(port, () => {
    console.log("Server is up on port "+port);
});