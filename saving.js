import fs from "fs/promises";
import path from "path";

const saveImageFile = async (filePath, arrayBuffer) => {
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));
};

//create folder to store the info dump function
const createFolder = async (folderName) => {
  const folderPath = path.join(process.cwd(), folderName);
  try {
    //if folder exists, ignore creating a new one
    await fs.access(folderPath);
  } catch (error) {
    //if folder doesnt exist, create one
    fs.mkdir(folderPath);
  }
};

//function to save pokemon stats
const savePokemonStats = async (folderName, pokemonStatsObject) => {
  let statsString = "";
  for (const stat of pokemonStatsObject) {
    statsString += `${stat.stat.name}: ${stat.base_stat}\n`;
  }

  //requesting foldername to save the fetched stats
  await createFolder(folderName);
  const filePath = path.join(process.cwd(), folderName, "stats.txt");
  await fs.writeFile(filePath, statsString);
};

//save artwork
const savePokemonArtwork = async (folderName, pokemonSpritesObject) => {
  const url = pokemonSpritesObject.other["official-artwork"].front_default;
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  await createFolder(folderName);
  const filePath = path.join(process.cwd(), folderName, "artwork.png");
  await saveImageFile(filePath, arrayBuffer);
};

const savePokemonSprites = async (folderName, pokemonSpritesObject) => {
  let spritePromises = [];
  let spriteNames = [];

  //collection of promises
  for (const [name, url] of Object.entries(pokemonSpritesObject)) {
    if (!url) continue;
    if (name === "other" || name === "versions") continue;

    //fetch request
    spritePromises.push(fetch(url).then((res) => res.arrayBuffer()));
    spriteNames.push(name);
  }

  //resolving the promises
  spritePromises = await Promise.all(spritePromises);
  await createFolder(folderName);
  for (let i = 0; i < spritePromises.length; i++) {
    const filePath = path.join(
      process.cwd(),
      folderName,
      `${spriteNames[i]}.png`
    );

    await saveImageFile(filePath, spritePromises[i]);
    console.log(`Saved: ${filePath}`);
  }
};

const parseOptions = async (pokemonObject, optionsObject) => {
  const options = optionsObject.options;
  const pokemonName = pokemonObject.name;

  //checking/logic
  if (options.includes("Stats")) {
    await savePokemonStats(pokemonName, pokemonObject.stats);
  }
  if (options.includes("Sprites")) {
    await savePokemonSprites(pokemonName, pokemonObject.sprites);
  }
  if (options.includes("Artwork")) {
    await savePokemonArtwork(pokemonName, pokemonObject.sprites);
  }
};

export { parseOptions };
