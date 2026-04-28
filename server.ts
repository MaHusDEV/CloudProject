import express, {Request, Response} from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import authRoutes from "./auth/authRoutes";
import { requireLogin, requireAdmin } from "./auth/authMiddleware";
import { Bike } from "./types/bike";
import { BikeType } from "./types/bikeType";
import { getData,urlBikeTypes, urlBikes } from "./main";
import { connect, getProjectCollection,getBikeTypesCollection,createDefaultUsers } from "./database";

const server = express();

server.use(express.urlencoded({extended: true}));
server.set("view engine", "ejs");
server.use(express.static("./public"));
server.use(cookieParser());
server.use(session({
  secret:"supersecret123",
  resave:false,
  saveUninitialized:false,
  cookie: {maxAge: 1000 * 60 * 60}
}));
server.use(authRoutes);
server.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});
const  PORT = 3000;

async function loadInitialData() {
  const bikesCollection = getProjectCollection();
  const typesCollection = getBikeTypesCollection();

  const bikeCount = await bikesCollection.countDocuments();
  const typeCount = await typesCollection.countDocuments();

  // LOAD BIKES
  if (bikeCount === 0) {
    console.log("Loading bikes from API → MongoDB...");
    const bikes = await getData(urlBikes) as Bike[];
    await bikesCollection.insertMany(bikes);
  }
  // LOAD BIKE TYPES
  if (typeCount === 0) {
    console.log("Loading bike types from API → MongoDB...");
    const types = await getData(urlBikeTypes) as BikeType[];
    await typesCollection.insertMany(types);
  }
}
server.get("/",requireLogin, async (req: Request, res: Response) => {
  try {
    const collection = getProjectCollection();

    const bikes = await collection.find<Bike>({}).toArray();

    const query = (req.query.searchQuery as string)?.toLowerCase() || "";
    const sortField = (req.query.sort as string) || "";
    const sortOrder = (req.query.order as string) || "asc";

    const filtered = query
      ? bikes.filter(b => b.name.toLowerCase().includes(query))
      : bikes;

    let sortedBikes = [...filtered];

    if (sortField === "name") sortedBikes.sort((a,b) => a.name.localeCompare(b.name));
    if (sortField === "category") sortedBikes.sort((a,b) => a.category.localeCompare(b.category));
    if (sortField === "price") sortedBikes.sort((a,b) => a.price - b.price);
    if (sortField === "isAvailable") sortedBikes.sort((a,b) => (a.isAvailable ? -1 : 1));

    if (sortOrder === "desc") sortedBikes.reverse();

    res.render("home", { bikes: sortedBikes, query, sortField, sortOrder,session: req.session  });

  } catch (error) {
    res.status(500).send("Error loading bike data");
  }
});
server.get("/product/:id", async (req: Request, res: Response) => {
  try {
    const collection = getProjectCollection();
    const bike = await collection.findOne({ id: req.params.id });

    if (!bike) return res.status(404).send("Bike not found");

    res.render("product", { bike,session: req.session });
  } catch (error) {
    res.status(500).send("Error loading product details");
  }
});
server.get("/categories", async (req: Request, res: Response) => {
  try {
    const typesCollection = getBikeTypesCollection();
    const bikeType = await typesCollection.find().toArray();

    res.render("categories", { bikeType,session: req.session });
  } catch (error) {
    res.status(500).send("Error loading categories");
  }
});
server.get("/edit/:id",requireAdmin, async (req: Request, res: Response) => {
  try {
    const collection = getProjectCollection();
    const bike = await collection.findOne({ id: req.params.id });

    if (!bike) return res.status(404).send("Bike not found");

    res.render("edit", { bike,session: req.session });
  } catch (error) {
    res.status(500).send("Error loading edit form");
  }
});
server.post("/edit/:id",requireAdmin, async (req: Request, res: Response) => {
  try {
    const collection = getProjectCollection();
    const id = req.params.id;

    const updated = {
      name: req.body.name,
      category: req.body.category,
      price: Number(req.body.price),
      description: req.body.description,
      isAvailable: req.body.isAvailable === "true",
    };

    await collection.updateOne({ id }, { $set: updated });

    res.redirect("/product/" + id);
  } catch (error) {
    res.status(500).send("Error updating bike");
  }
});
server.listen(PORT, async () =>{
  await connect();
  await loadInitialData();
  await createDefaultUsers();
    console.log(`Server is running on http://localhost:${PORT}`);
});
