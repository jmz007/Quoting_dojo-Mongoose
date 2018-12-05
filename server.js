var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var path = require("path");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, "./static")));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

// _____MONGO______
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/quoting_dojo", { useNewUrlParser: true });

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    quote: {
        type: String,
        required : true
    },
    created_at: {
        type: Date,
        required : true,
        default : Date.now
    }
});
mongoose.model("Quote", UserSchema);
var userQuote = mongoose.model("Quote");
mongoose.Promise = global.Promise;

// ______ROUTES_______
app.get("/", function (request, response) {
    response.render("index");
});

app.post("/quotes", function (request, response) {
    console.log("POST DATA", request.body);
    var quote = new userQuote({
        name : request.body.name,
        quote : request.body.quote
    });
    quote.save(function (error) {
        if (error) {
            console.log("something went wrong");
            response.redirect("/");
        }
        else {
            console.log("successfully added a quote!");
            response.redirect("/quotes");
        }
    });
});

app.get("/quotes", function(request, response){
    userQuote.find({}, function (error, quotes) {
        var contents = {
            quotes: quotes
        };
        response.render("quotes", contents);
    });
});

app.listen(8000, function () {
    console.log("listening on port 8000");
});
