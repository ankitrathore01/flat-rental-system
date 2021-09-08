var express 	 = require("express"),
	app			 = express(),
	bodyParser   = require("body-parser"),
	mongoose     = require("mongoose"),
	passport     = require("passport"),
	methodOverride = require("method-override"),
	localStrategy = require("passport-local"),
	User		 = require("./models/user"),
	Property	 = require("./models/property"),
	Review  	 = require("./models/review")

mongoose.connect("server details", {
	useNewUrlParser : true,
	useUnifiedTopology : true
}).then( () => {
	console.log("Connected to Database !!!");
}).catch( err => {
	console.log("Error : ",err.message);
});
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

//*****************Requiring Express Session*****************
app.use(require("express-session")({
	secret: "Sachin is the best cricker ever existed!",
	resave: false,
	saveUninitialized: false
}));

//*****************Configuring Passport*****************
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser= req.user;
	next();
});

//*****************Routes*****************

//Root Route
app.get("/", function(req, res){
	res.redirect("/landing");
});

app.get("/landing", function(req, res){
	res.render("landing.ejs");
});

//SignUp
app.get("/signup", function(req, res){
	res.render("signup.ejs");
});
app.post("/signup", function(req, res){
	User.register(new User({email: req.body.email, username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log("Error : " + err);
			res.redirect("/signup");
		} else{
			if(req.body.password === req.body.confirm){
				passport.authenticate("local")(req, res, function(){
					res.redirect("/");
				});
			} else{
				res.redirect("/signup");
			}
		}
	});
});

//LogIn
app.get("/login", function(req, res){
	res.render("login.ejs");
});
app.post("/login", passport.authenticate("local", {
	successRedirect: "/landing",
	failureRedirect: "/login"
}), function(req, res){});

//Log Out
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

//About
app.get("/about", function(req, res){
	res.render("about.ejs");
});

//***************Property***************
app.get("/properties", function(req, res){
	Property.find( {}, function(err, allProperties){
		if(err){
			// req.flash("error", err.message);
			res.redirect("back");
		} else{
			res.render("showProperty.ejs", {property: allProperties});
		}
	});
});

//Post Property Form
app.get("/postNew", isLoggedIn, function(req, res){
	res.render("postNew.ejs");
});

//Add Property
app.post("/properties", isLoggedIn, function(req, res){
	var listingType = req.body.listingType,
	beds = req.body.beds,
	baths = req.body.baths,
	size = req.body.size,
	rent = req.body.rent,
	deposit = req.body.deposit,
	date = req.body.date,
	days = req.body.days,
	address= {
		line1 : req.body.line1,
		line2 : req.body.line2,
		city : req.body.city,
		state : req.body.state,
		zip : req.body.zip
	},
	role = req.body.role,
	details = {
			fName : req.body.fName,
			mName : req.body.mName,
			lName : req.body.lName,
			email : req.body.email,
			phone : req.body.phone,
			preference : req.body.preference,
	},
	info = req.body.info,
	user = {
			id: req.user["id"],
			username: req.user.username
		},
	image = req.body.image;
	var newProperty = { listingType:listingType, beds:beds, baths:baths, size:size, rent:rent, deposit:deposit, date:date, days:days, address:address, 			role:role, details:details, info:info, user:user, image:image};
	Property.create( newProperty, function(err, property){
		if(err){
			// req.flash("error", err.message);
			res.redirect("/about");
			console.log("Error : "+ err);
		} else{
			// req.flash("success", "Campground added Successfully!!!");
		    res.redirect("/properties");
		}
	});
});

//Show Single Property
app.get("/properties/:id", function(req, res){
	Property.findById( req.params.id, function(err, foundProperty){
		if(err || !foundProperty){
			// req.flash("error", "Campground not found...");
			res.redirect("back");
		} else {
			res.render("singleProperty.ejs", { property : foundProperty });
		}
	});
});

//Edit Property
app.get("/properties/:id/edit", function(req, res){
	Property.findById(req.params.id, function(err, foundProperty){
		res.render("editProperty.ejs", {property: foundProperty});
	});
});

//Update Property
app.put("/properties/:id", function(req, res){
	Property.findByIdAndUpdate(req.params.id, req.body.property, function(err, foundProperty){
		console.log(foundProperty);
		res.redirect("/properties/" + req.params.id);
	});
});

//Delete Property
app.delete("/properties/:id", function(req, res){
	Property.findByIdAndRemove(req.params.id, function(err){
		// req.flash("success", "Campground Deleted Successfully!!!");
		res.redirect("/properties");
	});
});

//***************MiddleWare***************

//***************Check Property User****************
// function checkPropertyUser(req, res, next){
// 	if(req.isAuthenticated()){
// 		Property.findById(req.params.id, function(err, foundProperty){
// 			if(err || !foundProperty){
// 				// req.flash("error", "Campground not found...");
// 				res.redirect("back");
// 			} else{
// 				if(foundProperty.user.id.equals(req.user.id)){
// 					return next();
// 				} else{
// 					res.redirect("back");
// 				}
// 			}
// 		});
// 	} else{
		// req.flash("error", "You need to be Logged In...");
// 		res.redirect("back");
// 	}
// }

//****************Check Review User***************
// function checkReviewUser(req, res, next){
// 	if(req.isAuthenticated()){
// 		Property.findById(req.params.id, function(err, foundProperty){
// 			if(err || !foundProperty){
// 				// req.flash("error", "Campground not found...");
// 				return res.redirect("back");
// 			}
// 			Review.findById(req.params.review_id, function(err, foundReview){
// 				if(err){
					// req.flash("error", "Comment not found...");
	// 				res.redirect("back");
	// 			} else{
	// 				if(foundReview.user.id.equals(req.user.id)){
	// 					return next();
	// 				} else{
	// 					res.redirect("back");
	// 				}
	// 			}
	// 		});
	// 	})
	// } else{
		// req.flash("error", "You need to be Logged In...");
// 		res.redirect("back");
// 	}
// }

//***************IsLoggedIn***************
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000, function(){
	console.log("HousEasy has started!!!");
});
