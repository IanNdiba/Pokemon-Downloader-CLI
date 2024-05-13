import inquirer from "inquirer";

//Accepting pokemon name for download from user
const promptForPokemon = async () => {
  return await inquirer.prompt({
    type: "input",
    name: "pokemon_name",
    message: "Provide a Pokemon name for download: ",
  });
};

//putting the checkbox in an async function to call it later
const promptForDownloadInfo = async () => {
  // creating checkbox
  return await inquirer.prompt({
    type: "checkbox",
    name: "options",
    message: "Select Pokemon info to download",
    choices: [
      new inquirer.Separator("---Options---"),
      {
        name: "Stats",
      },
      {
        name: "Sprites",
      },
      {
        name: "Artwork",
      },
    ],
  });
};

//prompt to continue
const promptToContinue = async () => {
  return await inquirer.prompt({
    type: "list",
    name: "continue",
    message: "Do you want to continue and search another Pokemon?",
    choices: ["YES", "NO"],
  });
};

//fetching pokemon data from server
const fetchPokemon = async (pokemonName) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};

const promptUser = async () => {
  while (true) {
    const pokemonName = await promptForPokemon();
    console.log(pokemonName.pokemon_name);

    //fetch should go here

    const pokemonOptions = await promptForDownloadInfo();
    console.log(pokemonOptions.options);
    //use these options for sprites and other data
    //save them to local storage

    const keepGoing = await promptToContinue();
    if (keepGoing.continue === "NO") {
      break;
    }
  }
};

promptUser();
