import { classes } from "@/data/classes";
import { CharData, Spell } from "@/data/definitions";
import React from "react";
import SpellOptionsContainer from "./SpellOptionsContainer/SpellOptionsContainer";
import { Button, Flex } from "antd";
import { getSelectedSpellsByLevel } from "@/support/spellSupport";
import { classSplit } from "@/support/classSupport";
import { rollDice } from "@/support/diceSupport";
import { getHitDice } from "@/support/statSupport";

interface ModalLevelUpProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
  setModalIsOpen: (modalIsOpen: boolean) => void;
}

const ModalLevelUp: React.FC<
  ModalLevelUpProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter, setModalIsOpen }) => {
  const [magicClass, setMagicClass] = React.useState<string>("");
  const [spellBudget, setSpellBudget] = React.useState<number[]>([]);
  const [selectedSpells, setSelectedSpells] = React.useState<Array<Spell[]>>(
    [],
  );

  const newHitDiceValue = getHitDice(
    character.level + 1,
    character.class,
    character.hp.dice,
  );

  const handleLevelUp = () => {
    const result = rollDice(newHitDiceValue);
    const newCharacter = {
      ...character,
      hp: { ...character.hp, max: result, dice: newHitDiceValue },
      level: character.level + 1,
      spells: selectedSpells.flatMap((spells) => spells),
    };
    setCharacter(newCharacter);
    setModalIsOpen(false);
  };

  React.useEffect(() => {
    // Set magicClass when character changes
    const classArr = classSplit(character.class);
    for (const cls of classArr) {
      const key = cls as keyof typeof classes;
      if (classes[key]?.spellBudget) {
        setMagicClass(key);
        break;
      }
    }
  }, [character]);

  React.useEffect(() => {
    // Update spellBudget and selectedSpells when character or magicClass changes
    if (magicClass) {
      setSpellBudget(
        classes[magicClass as keyof typeof classes].spellBudget![
          character.level
        ],
      );
      setSelectedSpells(getSelectedSpellsByLevel(character, magicClass));
    }
  }, [character, magicClass]);

  return (
    <Flex vertical gap={16} className={className}>
      {!!spellBudget.length && (
        <SpellOptionsContainer
          spellBudget={spellBudget}
          magicClass={magicClass}
          character={character}
          selectedSpells={selectedSpells}
          setSelectedSpells={setSelectedSpells}
        />
      )}
      <Button type="primary" onClick={handleLevelUp}>
        Roll new Hit Points ({newHitDiceValue})
      </Button>
    </Flex>
  );
};

export default ModalLevelUp;
