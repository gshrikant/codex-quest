import {
  CharData,
  ClassNames,
  EquipmentItem,
  RaceNames,
  SavingThrowsType,
  SetCharData,
} from "@/data/definitions";
import { AttackTypes } from "./stringSupport";
import { races } from "@/data/races";
import equipmentItems from "../data/equipmentItems.json";
import { ArmorCategory } from "./equipmentSupport";
import { classSplit, getClassType } from "./classSupport";
import { classes } from "@/data/classes";

export const getArmorClass = (
  characterData: CharData,
  setCharacterData: SetCharData,
  type: AttackTypes.MISSILE | AttackTypes.MELEE = AttackTypes.MELEE,
) => {
  if (!characterData) return;

  const { race, wearing, equipment } = characterData;
  const armorClass = races[race as RaceNames]?.altBaseAC || 11;

  if (!wearing) {
    setCharacterData({ ...characterData, wearing: { armor: "", shield: "" } });
    return armorClass;
  }

  const acType = type === AttackTypes.MELEE ? "AC" : "missileAC";
  // Calculate Armor AC and Shield AC from equipmentItems or character's equipment
  const armorAC =
    findACValue(equipmentItems as EquipmentItem[], wearing.armor, "AC") ||
    findACValue(equipment, wearing.armor, "AC");
  const shieldAC =
    findACValue(equipmentItems as EquipmentItem[], wearing.shield, acType) ||
    findACValue(equipment, wearing.shield, acType);

  return Math.max(armorClass + shieldAC, armorAC + shieldAC);
};

const findACValue = (
  itemList: EquipmentItem[],
  itemName: string,
  acType: "AC" | "missileAC",
) => {
  const foundItem = itemList.find((item) => item.name === itemName);
  return Number(foundItem?.[acType] || 0);
};

export const getMovement = (characterData: CharData) => {
  if (!characterData) return;

  const carryingCapacity = getCarryingCapacity(
    +characterData.abilities.scores.strength,
    characterData.race as RaceNames,
  );

  const armorSpeedMap: Record<ArmorCategory, [number, number]> = {
    lightArmor: [40, 30],
    mediumArmor: [30, 20],
    heavyArmor: [20, 10],
  };

  const armorCategoryMap: Record<string, ArmorCategory> = {
    "No Armor": "lightArmor",
    "Magic Leather Armor": "lightArmor",
    "": "lightArmor",
    "Studded Leather Armor": "mediumArmor",
    "Hide Armor": "mediumArmor",
    "Leather Armor": "mediumArmor",
    "Magic Metal Armor": "mediumArmor",
    "Metal Armor": "heavyArmor",
    "Chain Mail": "heavyArmor",
    "Ring Mail": "heavyArmor",
    "Brigandine Armor": "heavyArmor",
    "Scale Mail": "heavyArmor",
    "Splint Mail": "heavyArmor",
    "Banded Mail": "heavyArmor",
    "Plate Mail": "heavyArmor",
    "Field Plate Mail": "heavyArmor",
    "Full Plate Mail": "heavyArmor",
  };

  const currentArmor = characterData?.wearing?.armor || "";
  const currentCategory = armorCategoryMap[currentArmor];
  const [lightSpeed, heavySpeed] =
    armorSpeedMap[currentCategory || "lightArmor"];

  return characterData.weight <= carryingCapacity.light
    ? lightSpeed
    : heavySpeed;
};

// Helper function to get the strength range
const getStrengthRange = (strength: number): string => {
  if (strength === 3) return "3";
  if (strength >= 4 && strength <= 5) return "4-5";
  if (strength >= 6 && strength <= 8) return "6-8";
  if (strength >= 9 && strength <= 12) return "9-12";
  if (strength >= 13 && strength <= 15) return "13-15";
  if (strength >= 16 && strength <= 17) return "16-17";
  if (strength === 18) return "18";
  return ""; // Handle out-of-range strength values
};

type Capacity = { light: number; heavy: number };
type CapacityMap = Record<string, Capacity>;

export const getCarryingCapacity = (
  strength: number,
  race: RaceNames,
): Capacity => {
  const capacities: CapacityMap = {
    "3": { light: 25, heavy: 60 },
    "4-5": { light: 35, heavy: 90 },
    "6-8": { light: 50, heavy: 120 },
    "9-12": { light: 60, heavy: 150 },
    "13-15": { light: 65, heavy: 165 },
    "16-17": { light: 70, heavy: 180 },
    "18": { light: 80, heavy: 195 },
  };

  const lowCapacities: CapacityMap = {
    "3": { light: 20, heavy: 40 },
    "4-5": { light: 30, heavy: 60 },
    "6-8": { light: 40, heavy: 80 },
    "9-12": { light: 50, heavy: 100 },
    "13-15": { light: 55, heavy: 110 },
    "16-17": { light: 60, heavy: 120 },
    "18": { light: 65, heavy: 130 },
  };

  const range = getStrengthRange(strength);

  return races[race]?.hasLowCapacity ? lowCapacities[range] : capacities[range];
};

export const getAttackBonus = (character: CharData) => {
  const classArr = classSplit(character.class);
  if (getClassType(classArr) === "custom") return 0;
  let maxAttackBonus = 0;

  classArr.forEach((classPiece) => {
    const classAttackBonus =
      classes[classPiece as ClassNames]?.attackBonus[character.level];
    if (classAttackBonus > maxAttackBonus) {
      maxAttackBonus = classAttackBonus;
    }
  });

  return maxAttackBonus;
};

export const getHitPointsModifier = (classArr: string[]) => {
  let modifier = 0;
  for (const className of classArr) {
    const classHitDiceModifier =
      classes[className as ClassNames]?.hitDiceModifier;
    if (classHitDiceModifier > modifier) {
      modifier = classHitDiceModifier;
    }
  }
  return modifier;
};

export const getHitDice = (
  level: number,
  className: string[],
  dice: string,
) => {
  const dieType = dice.split("d")[1].split("+")[0];
  const prefix = Math.min(level, 9);

  // Calculate the suffix
  const suffix = (level > 9 ? level - 9 : 0) * getHitPointsModifier(className);

  // Combine to create the result
  const result = `${prefix}d${dieType}${suffix > 0 ? "+" + suffix : ""}`;
  return result;
};

export const getSavingThrows = (className: string, level: number) =>
  classes[className as ClassNames]?.savingThrows.find(
    (savingThrow) => (savingThrow[0] as number) >= level,
  )?.[1] as SavingThrowsType;

export const getSavingThrowsWeight = (savingThrows: SavingThrowsType) =>
  Object.values(savingThrows).reduce((prev, curr) => prev + curr, 0);

export const getBestSavingThrowList = (charClass: string[], level: number) => {
  const defaultSavingThrows: SavingThrowsType = {
    deathRayOrPoison: 0,
    magicWands: 0,
    paralysisOrPetrify: 0,
    dragonBreath: 0,
    spells: 0,
  };
  const classType = getClassType(charClass);
  // if classType is standard, find saving throws for that class
  if (classType === "standard") {
    return getSavingThrows(charClass.join(), level) || defaultSavingThrows;
    // if classType is combination, find saving throws for each class and use the best
  } else {
    const [firstClass, secondClass] = charClass;
    const firstClassSavingThrows = getSavingThrows(firstClass, level);
    const secondClassSavingThrows = getSavingThrows(secondClass, level);
    return getSavingThrowsWeight(firstClassSavingThrows) <=
      getSavingThrowsWeight(secondClassSavingThrows)
      ? firstClassSavingThrows
      : secondClassSavingThrows;
  }
};

export const isAbilityKey = (
  key: string,
  characterData: CharData,
): key is keyof typeof characterData.abilities.scores => {
  return (
    characterData &&
    characterData.abilities &&
    key in characterData.abilities.scores
  );
};

export const getModifier = (score: number): string => {
  const modifierMapping: Record<number, string> = {
    3: "-3",
    5: "-2",
    8: "-1",
    12: "+0",
    15: "+1",
    17: "+2",
    18: "+3",
  };

  for (const key in modifierMapping) {
    if (score <= Number(key)) {
      return modifierMapping[Number(key)];
    }
  }
  return "+0"; // Default value
};

export const getCharacterWeight = (character: CharData) => {
  const equipmentWeight = character.equipment.reduce(
    (accumulator: number, currentValue: EquipmentItem) =>
      accumulator + (currentValue.weight ?? 0) * (currentValue.amount ?? 0),
    0,
  );
  const coinsWeight = character.gold * 0.05;
  return equipmentWeight + coinsWeight;
};
