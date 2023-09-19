import { DiceTypes, equipmentCategories } from "../definitions";
import { ClassSetup } from "./definitions";
import equipmentItems from "../equipmentItems.json";

export const spellCrafter: ClassSetup = {
  name: "Spellcrafter",
  minimumAbilityRequirements: { intelligence: 12 },
  hitDice: DiceTypes.D4,
  hitDiceModifier: 1,
  availableEquipmentCategories: [
    equipmentCategories.DAGGERS,
    equipmentCategories.GENERAL,
    equipmentCategories.OTHERWEAPONS,
    equipmentCategories.BEASTS,
    equipmentCategories.BARDING,
    equipmentCategories.IMPROVISED,
  ],
  specificEquipmentItems: [[equipmentCategories.OTHERWEAPONS], ["cudgel"]],
  experiencePoints: [
    0, 2500, 5000, 10000, 20000, 40000, 80000, 150000, 300000, 450000, 600000,
    750000, 900000, 1050000, 1200000, 1350000, 1500000, 1650000, 1800000,
    1950000,
  ],
  attackBonus: [0, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7],
  savingThrowsNotes: [
    "* Adjust your roll by +1 against effects generated by **magic items**.",
    "* Targets of **magic items** operated by you suffer -1 to their rolls.",
  ],
  savingThrows: [
    [
      1,
      {
        deathRayOrPoison: 13,
        magicWands: 14,
        paralysisOrPetrify: 13,
        dragonBreath: 16,
        spells: 15,
      },
    ],
    [
      3,
      {
        deathRayOrPoison: 13,
        magicWands: 14,
        paralysisOrPetrify: 13,
        dragonBreath: 15,
        spells: 14,
      },
    ],
    [
      5,
      {
        deathRayOrPoison: 12,
        magicWands: 13,
        paralysisOrPetrify: 12,
        dragonBreath: 15,
        spells: 13,
      },
    ],
    [
      7,
      {
        deathRayOrPoison: 12,
        magicWands: 12,
        paralysisOrPetrify: 11,
        dragonBreath: 14,
        spells: 13,
      },
    ],
    [
      9,
      {
        deathRayOrPoison: 11,
        magicWands: 11,
        paralysisOrPetrify: 10,
        dragonBreath: 14,
        spells: 12,
      },
    ],
    [
      11,
      {
        deathRayOrPoison: 11,
        magicWands: 10,
        paralysisOrPetrify: 9,
        dragonBreath: 13,
        spells: 11,
      },
    ],
    [
      13,
      {
        deathRayOrPoison: 10,
        magicWands: 10,
        paralysisOrPetrify: 9,
        dragonBreath: 13,
        spells: 11,
      },
    ],
    [
      15,
      {
        deathRayOrPoison: 10,
        magicWands: 9,
        paralysisOrPetrify: 8,
        dragonBreath: 12,
        spells: 10,
      },
    ],
    [
      17,
      {
        deathRayOrPoison: 9,
        magicWands: 8,
        paralysisOrPetrify: 7,
        dragonBreath: 12,
        spells: 9,
      },
    ],
    [
      19,
      {
        deathRayOrPoison: 9,
        magicWands: 7,
        paralysisOrPetrify: 6,
        dragonBreath: 11,
        spells: 9,
      },
    ],
    [
      20,
      {
        deathRayOrPoison: 8,
        magicWands: 6,
        paralysisOrPetrify: 5,
        dragonBreath: 11,
        spells: 8,
      },
    ],
  ],
  spellBudget: [
    [2, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0, 0],
    [3, 1, 0, 0, 0, 0],
    [3, 2, 0, 0, 0, 0],
    [3, 2, 1, 0, 0, 0],
    [4, 2, 2, 0, 0, 0],
    [4, 2, 2, 1, 0, 0],
    [4, 3, 2, 2, 0, 0],
    [4, 3, 2, 2, 1, 0],
    [5, 3, 3, 2, 2, 0],
    [5, 4, 3, 2, 2, 1],
    [5, 4, 3, 3, 2, 2],
    [5, 4, 4, 3, 2, 2],
    [5, 4, 4, 3, 3, 2],
    [6, 4, 4, 3, 3, 2],
    [6, 5, 4, 3, 3, 2],
    [6, 5, 4, 4, 3, 3],
    [7, 5, 4, 4, 3, 3],
    [7, 5, 5, 4, 3, 3],
    [7, 5, 5, 4, 4, 3],
  ],
  startingSpells: ["Read Magic"],
  startingEquipment: [
    equipmentItems.find((item) =>
      item.name.toLowerCase().startsWith("spellbook")
    )!,
  ],
  details: {
    description:
      "(Spellcrafters Release 11)\n\nSpellcrafters are a special kind of Magic-User, known for their mastery over magic items and constructs. They use the same experience and spell progression as MagicUsers, and have the same hit dice, attack bonus, saving throws, and restrictions on armor and weapons. Spellcrafters should be treated as a Magic-User for all purposes, except as noted below.\n\n**Requirements**: The Prime Requisite for Spellcrafters is Intelligence; a character must have an Intelligence score of 12 or higher to become a Spellcrafter.\n\n**Special Abilities**: A first-level Spellcrafter begins play knowing **read magic** and one other spell of first level. These spells are written in a spellbook provided by their master. The GM may roll for the spell, assign it as they see fit, or allow the player to choose it, at their option. See the **Spells** section in the **Basic Fantasy RPG Core Rules** for more details.\n\nSpellcrafters do the same “kind” of magic as normal Magic-Users, such that they are able to learn spells from each other; however, only those spells listed as available to both classes may be so learned. See the section on spells below for the Spellcrafter's spell list.\n\nSpellcrafters receive a bonus of +1 to all saving throws made against effects generated by magic items. Those who are targets of magical effects generated by a magic item operated by a Spellcrafter suffer a penalty of -1 on any saving throw against it.\n\nThe real power of Spellcrafters is their greater understanding of the processes of magical fabrication. Spellcrafters can create any scroll starting at 1st level, potions and other single use items beginning at 3rd level, and at 7th level they can create any kind of magic item. A Spellcrafter receives a +25% bonus to all magical research rolls for creating magical items.\n\nAt 6th level, Spellcrafters become so adept as to cut in half the time necessary to create a magic item. At 9th level, Spellcrafters become so adept as to reduce the cost of creating a magic item by 25%.\n\nFor more information about creating magical items, please refer to the **Magical Research** section in the **Basic Fantasy RPG Core Rules**.",
    restrictions: [],
    specials: [],
  },
};
