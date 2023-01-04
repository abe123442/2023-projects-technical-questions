import express from 'express';

// location is the simple (x, y) coordinates of an entity within the system
// spaceCowboy models a cowboy in our super amazing system
// spaceAnimal models a single animal in our amazing system
type location = { x: number, y: number };

// had to slightly modify the type definitions to prevent errors when trying to merge a union type into a single type
type spaceCowboyMetadata = { name: string, lassoSize: number };
type spaceAnimalMetadata = { type: "pig" | "cow" | "flying_burger" };

type spaceCowboyEntity = { type: "space_cowboy", metadata: spaceCowboyMetadata, location: location };
type spaceAnimalEntity = { type: "space_animal", metadata: spaceAnimalMetadata, location: location };

// spaceEntity models an entity in the super amazing (ROUND UPPER 100) system
type spaceEntity = spaceCowboyEntity | spaceAnimalEntity;

// === ADD YOUR CODE BELOW :D ===

// === ExpressJS setup + Server setup ===
let spaceDatabase = [] as spaceEntity[];
const pythagDistance = (location1: location, location2: location) => {
    const square = (x: number) => x * x;
    return Math.sqrt(
        square(location1.x - location2.x) + square(location1.y - location2.y)
    );
};


const app = express();
app.use(express.json());


app.post('/entity', (req, res) => {
    let entities: spaceEntity[] | undefined = req.body.entities;

    // see if user legitimately passes an entities JSON object
    if (entities) {
        entities.forEach(entity => spaceDatabase.push(entity));
        res.status(200).send();
    } else {
        res.status(400).send();
    }
});

// For testing purposes
app.get('/entity', (req, res) => {
    res.json(spaceDatabase);
});


app.get('/lassoable/', (req, res) => {

    // get cowboy name from request body
    const { cowboy_name } = req.body;
    
    const animals = spaceDatabase.filter(entity => entity.type=="space_animal") as spaceAnimalEntity[];
    const cowboys = spaceDatabase.filter(entity => entity.type=="space_cowboy") as spaceCowboyEntity[];
    const selectedCowboy = cowboys.filter(cowboy => cowboy.metadata.name == cowboy_name)[0];
    
    let lassoableAnimals: {
        type: "pig" | "cow" | "flying_burger",
        location: location
    }[] = [];

    animals.forEach(animal => {
        // console.log(animal.location);
        if (pythagDistance(selectedCowboy.location, animal.location) <= selectedCowboy.metadata.lassoSize) {
            lassoableAnimals.push({ type: animal.metadata.type, location: animal.location});
        }
    });

    res.status(200).json({"space_animals": lassoableAnimals});
})

app.listen(8080);
