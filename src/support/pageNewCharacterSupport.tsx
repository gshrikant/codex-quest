import StepAbilities from "@/components/PageNewCharacter/StepAbilities/StepAbilities";
import StepClass from "@/components/PageNewCharacter/StepClass/StepClass";
import StepDetails from "@/components/PageNewCharacter/StepDetails/StepDetails";
import StepEquipment from "@/components/PageNewCharacter/StepEquipment/StepEquipment";
import StepHitPoints from "@/components/PageNewCharacter/StepHitPoints/StepHitPoints";
import StepRace from "@/components/PageNewCharacter/StepRace/StepRace";
import { classes } from "@/data/classes";
import { Abilities, CharData, ClassNames } from "@/data/definitions";
import { MessageInstance } from "antd/es/message/interface";
import { marked } from "marked";
import { createDocument } from "@/support/accountSupport";
import { auth } from "@/firebase";
import { NavigateFunction } from "react-router-dom";

const newCharacterStepDescriptions = {
  abilities:
    marked(`Roll for your character's Abilities. **You can click the "Roll" buttons or use your own dice and record your scores**. Afterward your character will have a score ranging from 3 to 18 in each of the Abilities below. A bonus (or penalty) Modifier is then associated with each score. Your character's Abilities will begin to determine the options available to them in the next steps as well, so good luck!
  
  <a href="https://basicfantasy.org/srd/abilities.html" target="_blank">BFRPG Character Ability documentation</a>`),
  race: marked(`Choose your character's Race. **Some options may be unavailable due to your character's Ability Scores**. Each Race except Humans has a minimum and maximum value for specific Abilities that your character's Ability Scores must meet in order to select them. Consider that each Race has specific restrictions, special abilities, and Saving Throws. Choose wisely. **Races included in the base game rules are in bold**.
  
  <a href="https://basicfantasy.org/srd/races.html" target="_blank">BFRPG Character Race documentation</a>`),
  class:
    marked(`Choose your character's Class. **Your character's Race and Ability Scores will determine which Class options are available**. Your Class choice determines your character's background and how they will progress through the game as they level up. **Classes included in the base game rules are in bold**.
  
  <a href="https://basicfantasy.org/srd/class.html" target="_blank">BFRPG Character Class documentation</a>`),
  hp: marked(`Roll for your character's Hit Points. **Your character's Race may place restrictions on the Hit Dice available to them, but generally this is determined by their chosen Class**. Additionally, your character's Constitution modifier is added/subtracted from this value with a minimum value of 1. The end result is the amount of Hit Points your character will start with and determines how much damage your character can take in battle.
  
  <a href="https://basicfantasy.org/srd/abilities.html#hit-points-and-hit-dice" target="_blank">BFRPG Character Hit Points documentation</a>`),
  equipment: marked(
    `Roll for your character's starting gold and purchase their equipment. **Keep in mind that your character's Race and Class selections may limit types and amounts of equipment they can have**.
  
  <a href="https://basicfantasy.org/srd/equipment.html" target="_blank">BFRPG Character Equipment documentation</a>`,
  ),
  name: marked(
    `You're almost done! Personalize your newly minted character by giving them an identity. Optionally, upload a portrait image if you'd like. Image must be PNG/JPG and <= 1mb`,
  ),
};

export const getStepsItems = (
  character: CharData,
  setCharacter: (character: CharData) => void,
  setComboClass: (comboClass: boolean) => void,
  setComboClassSwitch: (comboClassSwitch: boolean) => void,
  comboClass: boolean,
  comboClassSwitch: boolean,
) => [
  {
    title: "Abilities",
    fulltitle: "Roll for Ability Scores",
    description: newCharacterStepDescriptions.abilities,
    content: (
      <StepAbilities
        character={character}
        setCharacter={setCharacter}
        setComboClass={setComboClass}
        setComboClassSwitch={setComboClassSwitch}
      />
    ),
  },
  {
    title: "Race",
    fulltitle: "Choose a Race",
    description: newCharacterStepDescriptions.race,
    content: (
      <StepRace
        character={character}
        setCharacter={setCharacter}
        setComboClass={setComboClass}
        setComboClassSwitch={setComboClassSwitch}
      />
    ),
  },
  {
    title: "Class",
    fulltitle: "Choose a Class",
    description: newCharacterStepDescriptions.class,
    content: (
      <StepClass
        character={character}
        setCharacter={setCharacter}
        comboClass={comboClass}
        comboClassSwitch={comboClassSwitch}
        setComboClassSwitch={setComboClassSwitch}
      />
    ),
  },
  {
    title: "Hit Points",
    fulltitle: "Roll for Hit Points",
    description: newCharacterStepDescriptions.hp,
    content: (
      <StepHitPoints character={character} setCharacter={setCharacter} />
    ),
  },
  {
    title: "Equipment",
    fulltitle: "Buy Equipment",
    description: newCharacterStepDescriptions.equipment,
    content: (
      <StepEquipment character={character} setCharacter={setCharacter} />
    ),
  },
  {
    title: "Name",
    fulltitle: "Name Your Character",
    description: newCharacterStepDescriptions.name,
    content: <StepDetails character={character} setCharacter={setCharacter} />,
  },
];

const areAllAbilitiesSet = (abilities: Abilities) => {
  if (!abilities) return false;
  for (const key in abilities) {
    const value = +abilities[key as keyof typeof abilities];
    if (value <= 0 || isNaN(value)) {
      return false;
    }
  }
  if (Object.entries(abilities).length === 6) return true;
};

export const isNextButtonEnabled = (
  currentStep: number,
  character: CharData,
) => {
  switch (currentStep) {
    case 0:
      return areAllAbilitiesSet(character.abilities?.scores);
    case 1:
      return character.race !== "";
    case 2:
      // Check if the character has a class
      // AND IF SO, any value in their class has a spell budget
      // AND IF SO, they have more than 1 spell
      if (character.class?.length === 0) {
        return false;
      } else if (
        character.class?.some((className: string) => {
          const spellBudget = classes[className as ClassNames]?.spellBudget;
          return spellBudget && spellBudget[0] && spellBudget[0][0] > 0;
        })
      ) {
        return character.spells?.length > 1;
      }
      return true;
    case 3:
      return character.hp?.points !== 0;
    case 4:
      return character.equipment?.length !== 0;
    case 5:
      return character.name;
    default:
      return true;
  }
};

const success = (name: string, messageApi: MessageInstance) => {
  messageApi.open({
    type: "success",
    content: `${name} successfully saved!`,
  });
};

const errorMessage = (message: string, messageApi: MessageInstance) => {
  messageApi.open({
    type: "error",
    content: `This is an error message: ${message}`,
  });
};

export const addCharacterData = async (
  character: CharData,
  messageApi: MessageInstance,
  setCharacter: (character: CharData) => void,
  setCurrentStep: (currentStep: number) => void,
  navigate: NavigateFunction,
) => {
  await createDocument(
    auth.currentUser,
    "characters",
    character,
    (name) => {
      success(name, messageApi);
      // Reset characterData and step
      setCharacter({} as CharData);
      setCurrentStep(0);
    },
    (error) => {
      errorMessage(`Error writing document: ${error}`, messageApi);
    },
    () => {
      navigate("/");
    },
  );
};
