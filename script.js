let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["Stock"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: "Stock", power: 5 },
  { name: "Dolch", power: 30 },
  { name: "Klauenhammer", power: 50 },
  { name: "Schwert", power: 100 },
];
const monsters = [
  {
    name: "Schleim",
    level: 2,
    health: 15,
  },
  {
    name: "Tier mit Reißzähnen",
    level: 8,
    health: 60,
  },
  {
    name: "Drachen",
    level: 20,
    health: 300,
  },
];
const locations = [
  {
    name: "Stadtplatz",
    "button text": ["Zum Laden gehen", "Zur Höhle gehen", "Drachen bekämpfen"],
    "button functions": [goStore, goCave, fightDragon],
    text: 'Sie befinden sich auf dem Stadtplatz. Sie sehen ein Schild mit der Aufschrift "Store".',
  },
  {
    name: "Store",
    "button text": [
      "Kaufe 10 Gesundheit (10 Gold)",
      "Waffe kaufen (30 Gold)",
      "Gehen Sie zum Stadtplatz",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Sie betreten den Laden.",
  },
  {
    name: "Höhle",
    "button text": [
      "Bekämpfe Schleim",
      "Bekämpfe Tier mit Reißzähnen",
      "Gehen Sie zum Stadtplatz",
    ],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Du betrittst die Höhle. Du siehst einige Monster.",
  },
  {
    name: "kämpfen",
    "button text": ["Attacke", "Ausweichen", "Laufen"],
    "button functions": [attack, dodge, goTown],
    text: "Du kämpfst gegen ein Monster.",
  },
  {
    name: "Monster töten",
    "button text": [
      "Gehen Sie zum Stadtplatz",
      "Gehen Sie zum Stadtplatz",
      "Gehen Sie zum Stadtplatz",
    ],
    "button functions": [goTown, goTown, easterEgg],
    text: "Das Monster schreit „Arg!“ wie es stirbt. Du sammelst Erfahrungspunkte und findest Gold.",
  },
  {
    name: "verlieren",
    "button text": ["WIEDERHOLUNG?", "WIEDERHOLUNG?", "WIEDERHOLUNG?"],
    "button functions": [restart, restart, restart],
    text: "Du stirbst. ☠️",
  },
  {
    name: "gewinnen",
    "button text": ["WIEDERHOLUNG?", "WIEDERHOLUNG?", "WIEDERHOLUNG?"],
    "button functions": [restart, restart, restart],
    text: "Du besiegst den Drachen! SIE GEWINNEN DAS SPIEL! 🎉",
  },
  {
    name: "Osterei",
    "button text": ["2", "8", "Gehen Sie zum Stadtplatz?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "Du findest ein geheimes Spiel. Wählen Sie oben eine Zahl aus. Es werden zehn Zahlen zwischen 0 und 10 zufällig ausgewählt. Wenn die von Ihnen gewählte Zahl mit einer der Zufallszahlen übereinstimmt, gewinnen Sie!",
  },
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "Du hast nicht genug Gold, um Gesundheit zu kaufen.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Sie haben jetzt ein " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In Ihrem Inventar haben Sie: " + inventory;
    } else {
      text.innerText = "Sie haben nicht genug Gold, um eine Waffe zu kaufen.";
    }
  } else {
    text.innerText = "Du hast bereits die stärkste Waffe!";
    button2.innerText = "Verkaufe Waffe für 15 Gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Du hast ein " + currentWeapon + " verkauft.";
    text.innerText += " In Ihrem Inventar haben Sie: " + inventory;
  } else {
    text.innerText = "Verkaufen Sie nicht Ihre einzige Waffe!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "Der " + monsters[fighting].name + " greift an.";
  text.innerText +=
    " Du greifst es mit deinem an " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -=
      weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText += " Du vermisst.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    fighting === 2 ? winGame() : defeatMonster();
  }
  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += " Dein " + inventory.pop() + " geht kaputt.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * xp);
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  text.innerText = "Sie weichen dem Angriff aus " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["Stock"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText =
    "Du hast " + guess + " ausgewählt. Hier sind die Zufallszahlen:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Rechts! Du gewinnst 20 Gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Falsch! Du verlierst 10 Gesundheit!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
