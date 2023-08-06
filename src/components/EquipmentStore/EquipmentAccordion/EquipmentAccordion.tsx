import { Collapse, Descriptions, Space, Typography } from "antd";
import { EquipmentAccordionProps } from "./definitions";
import { toTitleCase } from "../../../support/stringSupport";
import equipmentItems from "../../../data/equipment-items.json";
import EquipmentCheckbox from "../EquipmentCheckbox/EquipmentCheckbox";
import { ClassName, EquipmentItem } from "../definitions";
import { RaceName } from "../../CreateCharacter/CharacterRace/definitions";
import { classChoices } from "../../../data/classDetails";
import WeaponKeys from "../../WeaponKeys/WeaponKeys";
import { ClassNames } from "../../definitions";

const EquipmentItemDescription = (item: EquipmentItem) => (
  <>
    <Typography.Text strong>{item.name}</Typography.Text>
    <Descriptions bordered size="small" column={2} className="flex-grow mt-2">
      <Descriptions.Item label="Cost">
        {`${item.costValue}${item.costCurrency}`}
      </Descriptions.Item>
      {item.weight && (
        <Descriptions.Item label="Weight">{item.weight}</Descriptions.Item>
      )}
      {item.size && (
        <Descriptions.Item label="Size">{item.size}</Descriptions.Item>
      )}
      {item.AC && <Descriptions.Item label="AC">{item.AC}</Descriptions.Item>}
      {item.damage && (
        <Descriptions.Item label="Damage">{item.damage}</Descriptions.Item>
      )}
    </Descriptions>
  </>
);

const availableEquipmentCategories = (className: ClassName) => {
  switch (className) {
    case ClassNames.CLERIC:
      return [
        "ammunition",
        "armor",
        "shields",
        "bows",
        "beasts-of-burden",
        "barding",
        "hammers-and-maces",
        "general-equipment",
        "other-weapons",
        "chain-and-flail",
        "improvised-weapons",
        "slings-and-hurled-weapons",
      ];
    case ClassNames.DRUID:
      return [
        "ammunition",
        "armor",
        "shields",
        "axes",
        "bows",
        "beasts-of-burden",
        "barding",
        "hammers-and-maces",
        "daggers",
        "general-equipment",
        "other-weapons",
        "chain-and-flail",
        "slings-and-hurled-weapons",
        "swords",
      ];
    case ClassNames.FIGHTER:
    case ClassNames.THIEF:
    case ClassNames.ASSASSIN:
    case ClassNames.BARBARIAN:
      return [
        "ammunition",
        "armor",
        "shields",
        "axes",
        "beasts-of-burden",
        "barding",
        "bows",
        "daggers",
        "hammers-and-maces",
        "general-equipment",
        "other-weapons",
        "swords",
        "spears-and-polearms",
        "improvised-weapons",
        "slings-and-hurled-weapons",
        "chain-and-flail",
      ];
    case ClassNames.MAGICUSER:
      return [
        "daggers",
        "general-equipment",
        "other-weapons",
        "beasts-of-burden",
        "barding",
        "improvised-weapons",
      ];
    default:
      if (!classChoices.includes(className)) {
        return [
          "ammunition",
          "armor",
          "shields",
          "axes",
          "beasts-of-burden",
          "bows",
          "daggers",
          "hammers-and-maces",
          "general-equipment",
          "other-weapons",
          "swords",
          "spears-and-polearms",
          "improvised-weapons",
          "slings-and-hurled-weapons",
        ];
      } else {
        console.error(
          `availableEquipmentCategories: no case for supplied class`
        );
        return [];
      }
  }
};

const itemIsDisabled = (
  className: ClassName,
  raceName: RaceName,
  item: EquipmentItem
) => {
  let disabled = true;
  if (className === ClassNames.CLERIC) {
    if (
      item.category === "hammers-and-maces" ||
      item.category === "other-weapons" ||
      item.category === "ammunition" ||
      item.category === "bows" ||
      item.category === "slings-and-hurled-weapons"
    ) {
      if (
        item.name.toLowerCase().includes("warhammer") ||
        item.name.toLowerCase().includes("mace") ||
        item.name.toLowerCase().includes("maul") ||
        item.name.toLowerCase().includes("crossbow") ||
        item.name.toLowerCase().includes("morningstar") ||
        item.name.toLowerCase().includes("quarterstaff") ||
        item.name.toLowerCase().includes("sling") ||
        item.name.toLowerCase().includes("stone")
      ) {
        disabled = false;
      }
    } else {
      disabled = false;
    }
  } else if (className === ClassNames.DRUID) {
    if (
      item.category === "bows" ||
      item.category === "armor" ||
      item.category === "shields" ||
      item.category === "chain-and-flail" ||
      item.category === "axes" ||
      item.category === "hammers-and-maces" ||
      item.category === "other-weapons" ||
      item.category === "slings-and-hurled-weapons" ||
      item.category === "swords" ||
      item.category === "ammunition"
    ) {
      console.log(item.category);
      if (
        item.name.toLowerCase().includes("shortbow") ||
        item.name.toLowerCase().includes("padded") ||
        item.name.toLowerCase().includes("hide") ||
        item.name.toLowerCase().includes("leather") ||
        item.name.toLowerCase().includes("buckler") ||
        item.name.toLowerCase().includes("chain††") ||
        item.name.toLowerCase() === "flail" ||
        item.name.toLowerCase().includes("whip") ||
        item.name.toLowerCase().includes("hand axe") ||
        item.name.toLowerCase().includes("mattock") ||
        item.name.toLowerCase().includes("pickaxe") ||
        item.name.toLowerCase() === "mace" ||
        item.name.toLowerCase().includes("morningstar") ||
        item.name.toLowerCase().includes("light mace") ||
        item.name.toLowerCase().includes("staff") ||
        item.name.toLowerCase().includes("sling") ||
        item.name.toLowerCase().includes("stone") ||
        item.name.toLowerCase().includes("shortsword") ||
        item.name.toLowerCase().includes("longsword")
      ) {
        disabled = false;
      }
    } else {
      disabled = false;
    }
  } else if (
    className.includes(ClassNames.FIGHTER) ||
    className.includes(ClassNames.BARBARIAN) ||
    !classChoices.includes(className)
  ) {
    disabled = false;
  } else if (
    className.includes(ClassNames.THIEF) ||
    className.includes(ClassNames.ASSASSIN)
  ) {
    if (item.category === "armor") {
      if (item.name.toLowerCase().includes("leather")) {
        disabled = false;
      }
    } else {
      disabled = false;
    }
  } else if (className.includes(ClassNames.MAGICUSER)) {
    if (item.category === "other-weapons") {
      if (item.name.toLowerCase().includes("cudgel")) {
        disabled = false;
      }
    } else {
      disabled = false;
    }
  }

  if (
    raceName.toLowerCase() === "dwarf" ||
    raceName.toLowerCase() === "halfling"
  ) {
    if (item.size === "L") disabled = true;
  }

  return disabled;
};

export default function EquipmentAccordion({
  onAmountChange,
  onCheckboxCheck,
  playerClass,
  playerEquipment,
  playerRace,
  playerGold,
  className,
}: EquipmentAccordionProps) {
  // Create a list of unique categories available for each class in the className, removing any duplicates
  const categories = Array.from(
    new Set(
      playerClass
        .split(" ")
        .flatMap((classPiece) =>
          availableEquipmentCategories(classPiece as ClassName)
        )
    )
  );

  const generateEquipmentCheckboxes = (
    category: string,
    subCategory?: string
  ) => (
    <Space direction="vertical">
      {equipmentItems
        .filter(
          (categoryItem) =>
            categoryItem.category === category &&
            (!subCategory || categoryItem.subCategory === subCategory)
        )
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((categoryItem) => {
          if (!itemIsDisabled(playerClass, playerRace, categoryItem)) {
            return (
              <EquipmentCheckbox
                key={categoryItem.name}
                item={categoryItem}
                disabled={itemIsDisabled(playerClass, playerRace, categoryItem)}
                onCheckboxCheck={onCheckboxCheck}
                onAmountChange={onAmountChange}
                playerHasItem={playerEquipment.some(
                  (invItem: EquipmentItem) => invItem.name === categoryItem.name
                )}
                equipmentItemDescription={EquipmentItemDescription(
                  categoryItem
                )}
                inputDisabled={categoryItem.costValue > playerGold}
                itemAmount={
                  playerEquipment.filter(
                    (invItem: EquipmentItem) =>
                      invItem.name === categoryItem.name
                  )[0]?.amount
                }
              />
            );
          } else {
            return null;
          }
        })}
    </Space>
  );

  return (
    <div>
      <Collapse accordion className={`${className} bg-seaBuckthorn h-fit`}>
        {categories
          .sort((a, b) => a.localeCompare(b))
          .map((category: string) => (
            <Collapse.Panel
              key={category}
              header={toTitleCase(category.replaceAll("-", " "))}
              className="[&>div:not(:first)]:bg-springWood"
            >
              {/* if category === 'general-equipment' Create a sub Collapse */}
              {category === "general-equipment" ? (
                <Collapse accordion ghost>
                  {[
                    ...new Set(
                      equipmentItems
                        .filter((item) => item.category === category)
                        .map((item) => item.subCategory)
                    ),
                  ].map((subCategory) => {
                    return (
                      subCategory !== undefined && (
                        <Collapse.Panel
                          key={subCategory}
                          header={toTitleCase(
                            subCategory?.replaceAll("-", " ")
                          )}
                        >
                          {generateEquipmentCheckboxes(category, subCategory)}
                        </Collapse.Panel>
                      )
                    );
                  })}
                </Collapse>
              ) : (
                generateEquipmentCheckboxes(category)
              )}
            </Collapse.Panel>
          ))}
      </Collapse>
      <WeaponKeys className="mt-4" />
    </div>
  );
}
