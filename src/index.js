const heroes = []
let fightButton;
let resetButton;
let spanPlayerHealth;
let spanComputerHealth;
let playerHero;
let computerHero;
let combatInProgress;
let playerFighting;
let computerFighting;
let playerWinTracker = " ";
let computerWinTracker = " ";

function mkElement(element) {
    return document.createElement(element)
}

async function retrieveHero(numberOfHeroes) {
    for (let i = 0; i < numberOfHeroes; i++) {
        let randomId = Math.floor(Math.random() * 731 + 1)
        let superHeroAPI = `https://superheroapi.com/api/${API_KEY}/${randomId}`
        const promise = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(superHeroAPI)}`)   // To bypass CORS errors, we need to use a proxy. All Origins works great.
        const resolved = await promise.json();
        const heroString = await resolved.contents;
        const heroObject = await JSON.parse(heroString);
        createCombatStats(heroObject);

    }
    displayChoices(heroes);
    

    // let chooseCharAudio = new Audio('chooseyourcharacter.mp3');
    // chooseCharAudio.play();
    //above code wont work due to browsers not allowing autoplay sounds, needs an event to be triggered(cant be a mouse over)

}

// Calculate new stats that were not included through the API. These will be used for the combat function.
function createCombatStats(heroObject) {
    const powerStats = heroObject.powerstats
    // Looks at all hero powerstats and replaces any blank values with a preset default, 25.
    Object.keys(powerStats).forEach(key => {
        if (powerStats[key] === "null") {
            powerStats[key] = 25;
        }
    })
    heroObject.health = heroObject.powerstats.strength * 100;
    heroObject.timeToHit = (100 - heroObject.powerstats.speed) * 10;
    if (heroObject.timeToHit <= 175)
        heroObject.timeToHit = 175;
    heroObject.damagePerHit = parseInt(heroObject.powerstats.strength) * 2 + parseInt(heroObject.powerstats.combat) * 3 + parseInt(heroObject.powerstats.power);
    return heroes.push(heroObject);
}

function displayChoices(heroes) {
    let starterBox = document.querySelector("#starter-choices")
    starterBox.replaceChildren();
    for (let i = 0; i < heroes.length; i++) {
        let newHeroObject = heroes[i];
        const newHero = createHeroDisplay(heroes, i, newHeroObject);
        starterBox.append(newHero)
    }
}

function createHeroDisplay(heroes, i, newHeroObject) {
    const heroDisplay = mkElement("img");
    heroDisplay.width = 200;
    heroDisplay.src = heroes[i].image.url;
    heroDisplay.className = 'hero';
    heroDisplay.style.borderRadius = "50%";
    heroDisplay.addEventListener("click", () => selectHero(newHeroObject));
    heroDisplay.onerror = function () {
        this.src = "./assets/unnamed-hero.jpg"
        newHeroObject.image.url = "./assets/unnamed-hero.jpg"
        console.log("Image not found for", newHeroObject.name);
    };
    return heroDisplay;
    
}

function selectHero(newHeroObject) {
    playerHero = newHeroObject;
    console.log(newHeroObject)
    computerHero = heroes[Math.floor(Math.random() * heroes.length)]
    while (computerHero.name === playerHero.name) {
        computerHero = heroes[Math.floor(Math.random() * heroes.length)]
    }
    console.log(`You chose: ${playerHero.name}! The computer chose: ${computerHero.name}!`)
    setupFight()
}

function setupFight() {
    let startScreen = document.querySelector("#start-screen")
    let playerBox = document.querySelector("#fs-player")
    let computerBox = document.querySelector("#fs-computer")
    let fightScreen = document.querySelector("#fight-screen")
    const combatLog = document.querySelector("#combat-log")
    startScreen.style.display = "none"
    combatLog.style.display = "inline-block"

    createPlayerBox(playerBox);
    createComputerBox(computerBox);

    const fightButton = mkElement("button");
    fightButton.id = "fight-btn";
    fightButton.innerText = "Fight!";
    fightButton.addEventListener("click", combat);

    const resetButton = mkElement("button");
    resetButton.id = "reset-btn";
    resetButton.innerText = "Reset";
    resetButton.addEventListener("click", resetFightScreen);
    fightScreen.prepend(fightButton, resetButton, mkElement("br"));


     let roundOneAudio = new Audio('Round_1_Fight.mp3');
      roundOneAudio.play();

    // let foeHasAppeared = new Audio('Foe_Has_Appeared.mp3');
    //     foeHasAppeared.play();

}

function createPlayerBox(playerBox) {
    playerBox.style.display = "inline-block"    
    const playerHeadline = mkElement("h1");
    const playerHeroName = mkElement("h2");
    const playerHeroHealth = mkElement("h3");
    const playerHeroHealthS = mkElement("span");
    const playerStrength = mkElement("span");
    const playerCombat = mkElement("span");
    const playerPower = mkElement("span");
    const playerSpeed = mkElement("span");
    const playerImage = mkElement("img");

    playerHeadline.innerText = "PLAYER" + playerWinTracker;
    playerHeadline.id = "playerHeadline"
    playerHeroName.innerText = playerHero.name;

    playerHeroHealth.id = "spanPlayerHealth";
    playerHeroHealth.innerText = "HP: ";
    playerHeroHealthS.innerText = playerHero.health;
    playerHeroHealthS.id = "spanPlayerHealthS";
    playerHeroHealth.append(playerHeroHealthS);

    playerStrength.innerText = "STRENGTH: " + playerHero.powerstats.strength;
    playerCombat.innerText = "COMBAT: " + playerHero.powerstats.combat;
    playerPower.innerText = "POWER: " + playerHero.powerstats.power;
    playerSpeed.innerText = "SPEED: " + playerHero.powerstats.speed;

    playerImage.src = playerHero.image.url;
    playerImage.alt = playerHero.name;
    playerImage.width = 440;
    playerImage.height = 640;

    playerBox.append(playerHeadline, playerHeroName, playerHeroHealth, mkElement("br"), playerStrength, mkElement("br"), playerCombat, mkElement("br"), playerPower, mkElement("br"), playerSpeed, mkElement("br"), playerImage);

}

function createComputerBox(computerBox) {
    computerBox.style.display = "inline-block"
    const computerHeadline = mkElement("h1");
    const computerHeroName = mkElement("h2");
    const computerHeroHealth = mkElement("h3");
    const computerHeroHealthS = mkElement("span");
    const computerStrength = mkElement("span");
    const computerCombat = mkElement("span");
    const computerPower = mkElement("span");
    const computerSpeed = mkElement("span");
    const computerImage = mkElement("img");
    

    computerHeadline.innerText = "COMPUTER" + computerWinTracker;
    computerHeadline.id = "computerHeadline"
    computerHeroName.innerText = computerHero.name;

    computerHeroHealth.id = "spanComputerHealth";
    computerHeroHealth.innerText = "HP: ";
    computerHeroHealthS.innerText = computerHero.health;
    computerHeroHealthS.id = "spanComputerHealthS";
    computerHeroHealth.append(computerHeroHealthS);

    computerStrength.innerText = "STRENGTH: " + computerHero.powerstats.strength;
    computerCombat.innerText = "COMBAT: " + computerHero.powerstats.combat;
    computerPower.innerText = "POWER: " + computerHero.powerstats.power;
    computerSpeed.innerText = "SPEED: " + computerHero.powerstats.speed;

    computerImage.src = computerHero.image.url;
    computerImage.alt = computerHero.name;
    computerImage.width = 440;
    computerImage.height = 640;

    computerBox.append(computerHeadline, computerHeroName, computerHeroHealth, mkElement("br"), computerStrength, mkElement("br"), computerCombat, mkElement("br"), computerPower, mkElement("br"), computerSpeed, mkElement("br"), computerImage);
}

function combat() {
    const fightButton = document.querySelector("#fight-btn")
    combatInProgress = true;
    fightButton.disabled = true;
    playerFighting = setInterval(playerAttack, playerHero.timeToHit)
    computerFighting = setInterval(computerAttack, computerHero.timeToHit)
}

function playerAttack() {
    const spanComputerHealth = document.querySelector("#spanComputerHealthS")
    computerHero.health -= playerHero.damagePerHit;
    spanComputerHealth.innerText = computerHero.health;

    const combatLog = document.querySelector("#combat-log")

    const newCombatItem1 = mkElement("p")
    const newCombatItem2 = mkElement("p")

    newCombatItem1.innerHTML = `<strong>${playerHero.name}</strong> hits <strong>${computerHero.name}</strong>!`
    newCombatItem2.innerHTML = `<strong>${computerHero.name}</strong> has ${computerHero.health} health left!`

    combatLog.prepend(newCombatItem2, newCombatItem1)

    console.log(`${playerHero.name} hits ${computerHero.name}!`)
    console.log(`${computerHero.name} has ${computerHero.health} health left!`)
    
    determineWinner();
}

function computerAttack() {
    const spanPlayerHealth = document.querySelector("#spanPlayerHealthS")
    playerHero.health -= computerHero.damagePerHit
    spanPlayerHealth.innerText = playerHero.health;

    const combatLog = document.querySelector("#combat-log")
    const newCombatItem1 = mkElement("p")
    const newCombatItem2 = mkElement("p")

    newCombatItem1.innerHTML = `<strong>${computerHero.name}</strong> hits <strong>${playerHero.name}</strong>!`
    newCombatItem2.innerHTML = `<strong>${playerHero.name}</strong> has ${playerHero.health} health left!`

    combatLog.prepend(newCombatItem2, newCombatItem1)

    console.log(`${computerHero.name} hits ${playerHero.name}!`)
    console.log(`${playerHero.name} has ${playerHero.health} health left!`)

    determineWinner();
}

function determineWinner() {

     let fightAudio = new Audio('fightsound.mp3');
        fightAudio.play();

    if (playerHero.health <= 0 || computerHero.health <= 0) {
        combatInProgress = false;
        clearInterval(playerFighting)
        clearInterval(computerFighting)
        switch (playerHero.health > computerHero.health) {
            case true:
                const playerHeadline = document.querySelector("#playerHeadline")
                console.log("Player wins!")
                playerWinTracker +="💢";


                setTimeout(function(){confetti.start();},5000);
                // setTimeout(function(){confetti.stop();},5000);
                let victoryAudio = new Audio('victorysong.mp3');
                // victoryAudio.play();
                setTimeout(function() {victoryAudio.play();},5000);
                setTimeout(function(){confetti.stop();},10000);
                
                // const fightScreen = document.querySelector('#fight-screen');
                // fightScreen.innerHTML= `<h1>PLAYER WINS!</h1>`

                
                playerHeadline.innerText = "PLAYER" + playerWinTracker;
                const spanComputerHealth = document.querySelector("#spanComputerHealthS")
                spanComputerHealth.innerText = "KIA";
                spanComputerHealth.style.color = "red";
                break;
            case false:
                const computerHeadline = document.querySelector("#computerHeadline")
                console.log("Computer wins!")
                computerWinTracker +="💢";
                
                let defeatedAudio = new Audio('defeatedsmashbros.mp3');
                // audio.play();
                setTimeout(function() {defeatedAudio.play();},5000);

                
                computerHeadline.innerText = "COMPUTER" + computerWinTracker;
                const spanPlayerHealth = document.querySelector("#spanPlayerHealthS")
                spanPlayerHealth.innerText = "KIA";
                spanPlayerHealth.style.color = "red";
                break;
        }
    }
}

function resetFightScreen() {
    clearInterval(playerFighting)
    clearInterval(computerFighting)
    let fightScreen = document.querySelector("#fight-screen")
    let startScreen = document.querySelector("#start-screen")
    fightScreen.innerHTML = `<div id="fs-player"></div>
    <div id="fs-computer"></div>
    <div id="combat-log"></div>
  </div>`
    startScreen.style.display = "block"
    heroes.forEach(hero => hero.health = hero.powerstats.strength * 100)
    displayChoices(heroes);
}

retrieveHero(5);

main
