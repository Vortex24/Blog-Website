const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const _ = require("lodash");

const app = express();

const homeContent = "Feel free to compose your own blog post. You can do this by inserting '/compose' after the home page URL. Moreover you can find other fellas posts by inserting '/(Name of the post)'. The casing doesn't matter!!";

const aboutContent = "Etiam sed turpis eu arcu maximus auctor. Fusce eu nisi eu neque tempor tempus. Pellentesque nec hendrerit metus. Proin dignissim, enim at commodo suscipit, eros elit dignissim ante, sed interdum nulla nibh ac nunc. Nulla vel nulla augue. Duis cursus nisi sed lorem eleifend, vulputate malesuada elit volutpat. Integer dapibus ipsum et ante bibendum convallis. Quisque sit amet blandit odio, in scelerisque urna. Sed rutrum at erat ac pellentesque. Phasellus feugiat eu dolor at accumsan.";

const contactContent = "Suspendisse porta, ex nec iaculis ultrices, purus ligula sagittis nisi, maximus gravida enim dui non elit. Duis dapibus arcu faucibus, sollicitudin augue ac, imperdiet odio. Maecenas id mollis mi, a volutpat enim. Aenean lobortis lacus sit amet fringilla aliquet. Integer maximus accumsan libero, nec condimentum velit faucibus non. Duis tincidunt ac mi eget posuere. Nam urna ex, molestie eget pretium at, luctus in erat. Nunc condimentum diam sit amet magna tempus laoreet. Nunc a enim tortor.";

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://admin-vortex:vortex24@blog-cluster.avmjk1w.mongodb.net/blogDB");

const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
    Post.find({}, function(err, results){
        if (!err)
        {
            res.render("blog", { homeContent: homeContent, arrObject: results });
        }
    });
});

app.get("/about", function(req, res){
    res.render("about", { aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
    res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function(req, res){
    res.render("compose");
});

app.get("/posts/:topic", function(req, res){
    let capitalizedTitle = _.capitalize(_.lowerCase(req.params.topic));

    Post.findOne({title: capitalizedTitle}, function(err, result){
        if (!err)
        {
            if (result)
            {
                res.render("post", { postTitle: result.title, postContent: result.content });
            }
            else
            {
                console.log("Title not found!");
                res.redirect("/");
            }
        }
    });
});

app.post("/compose", function(req, res){
    let capitalizedTitle = _.capitalize(req.body.postTitle);

    const post = new Post({
        title: capitalizedTitle,
        content: req.body.postBody
    });

    post.save();

    res.redirect("/");
});

app.listen(process.env.port || 3000, function(req, res){
    console.log("Running on port 3000...");
});
