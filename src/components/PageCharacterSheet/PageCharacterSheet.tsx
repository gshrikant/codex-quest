import { User } from "firebase/auth";
import React from "react";
import { ClassNames } from "@/data/definitions";
import Hero from "./Hero/Hero";
import { Alert, Col, Divider, Flex, Row, Skeleton } from "antd";
import AbilitiesTable from "./AbilitiesTable/AbilitiesTable";
import Section from "./Section/Section";
import AttackBonuses from "./AttackBonuses/AttackBonuses";
import HitPoints from "./HitPoints/HitPoints";
import { classes } from "@/data/classes";
import CharacterStat from "./CharacterStat/CharacterStat";
import SpecialsRestrictions from "./SpecialsRestrictions/SpecialsRestrictions";
import SpecialAbilitiesTable from "./SpecialAbilitiesTable/SpecialAbilitiesTable";
import SavingThrows from "./SavingThrows/SavingThrows";
import Money from "./Money/Money";
import Weight from "./Weight/Weight";
import Equipment from "./Equipment/Equipment";
import Description from "./Description/Description";
import CharacterFloatButtons from "./CharacterFloatButtons/CharacterFloatButtons";
import ModalContainer from "@/components/ModalContainer/ModalContainer";
import StepAbilities from "@/components/PageNewCharacter/StepAbilities/StepAbilities";
import StepHitPoints from "@/components/PageNewCharacter/StepHitPoints/StepHitPoints";
import { useCharacterData } from "@/hooks/useCharacterData";
import { useModal } from "@/hooks/useModal";
import { useDeviceType } from "@/hooks/useDeviceType";
import { CharacterDataContext } from "@/contexts/CharacterContext";
import { customClassString } from "@/support/stringSupport";
import classNames from "classnames";
import Spells from "./Spells/Spells";
import { useSpellData } from "@/hooks/useSpellData";
import { useMarkdown } from "@/hooks/useMarkdown";
import { classSplit, isStandardClass } from "@/support/classSupport";
import { getArmorClass, getHitDice, getMovement } from "@/support/statSupport";

interface PageCharacterSheetProps {
  user: User | null;
}

export interface Wearing {
  armor: string | undefined;
  shield: string | undefined;
}

const PageCharacterSheet: React.FC<
  PageCharacterSheetProps & React.ComponentPropsWithRef<"div">
> = ({ className, user }) => {
  const { character, setCharacter, userIsOwner, uid, id } =
    useCharacterData(user);
  const {
    modalIsOpen,
    setModalIsOpen,
    modalTitle,
    setModalTitle,
    modalContent,
    setModalContent,
    modalOkRef,
  } = useModal();
  const attackBonusesHelpText = useMarkdown(
    `**Melee** attacks use STR modifier + Attack Bonus.\n\n**Missile** attacks use DEX modifier + Attack Bonus.`,
  );
  const armorClassHelpText = useMarkdown(
    `Base AC is 11.\n\nSelect the armor/shield your character is wearing in the Equipment section below.`,
  );
  const movementHelpText = useMarkdown(
    `Movement starts at 40' and is affected by how much weight your character is carrying as well as the armor they are wearing.`,
  );
  const abilitiesTableHelpText = useMarkdown(
    `A player must roll their percentile dice with a result less than or equal to the numbers shown below. Click the rows to automatically roll for each special ability.`,
  );
  const customClassAlertMessage = useMarkdown(customClassString);
  const { isMobile, isTablet, isDesktop } = useDeviceType();
  const { isSpellCaster } = useSpellData();
  const classArr = character ? classSplit(character.class) : [];
  const moneyClassNames = classNames({ "w-1/3": !isMobile });

  return character ? (
    <CharacterDataContext.Provider
      value={{ character, setCharacter, userIsOwner, uid, id }}
    >
      <CharacterFloatButtons
        setModalIsOpen={setModalIsOpen}
        setModalTitle={setModalTitle}
        setModalContent={setModalContent}
        modalOk={modalOkRef.current}
      />
      <Flex vertical className={className} gap={16}>
        <Row>
          <Hero
            setModalIsOpen={setModalIsOpen}
            setModalTitle={setModalTitle}
            setModalContent={setModalContent}
            isMobile={isMobile}
          />
        </Row>
        <Row gutter={16} className="[&>div]:mt-4">
          <Col xs={24} sm={12} md={8}>
            <Section
              title="Abilities"
              component={<AbilitiesTable />}
              editableComponent={
                <StepAbilities
                  character={character}
                  setCharacter={setCharacter}
                  hideRollAll
                />
              }
              editable
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Flex gap={16} vertical>
              <Section
                title="Attack Bonuses"
                titleHelpText={attackBonusesHelpText}
                component={<AttackBonuses />}
              />
              <Section
                title="Hit Points"
                component={<HitPoints />}
                editable
                editableComponent={
                  <StepHitPoints
                    character={character}
                    setCharacter={setCharacter}
                  />
                }
              />
            </Flex>
          </Col>
          <Col xs={24} md={8}>
            <Flex
              gap={16}
              vertical={isMobile || isTablet || isDesktop}
              justify="space-between"
            >
              <Section
                title="Armor Class"
                titleHelpText={armorClassHelpText}
                component={
                  <CharacterStat
                    value={getArmorClass(character, setCharacter) || 0}
                  />
                }
              />
              <Section
                title="Movement"
                titleHelpText={movementHelpText}
                component={
                  <CharacterStat value={`${getMovement(character)}'`} />
                }
              />
              <Section
                title="Hit Dice"
                component={
                  <CharacterStat
                    value={getHitDice(
                      character.level,
                      classArr,
                      character.hp.dice,
                    )}
                  />
                }
              />
            </Flex>
          </Col>
        </Row>
        <Divider />
        {classArr.every((cls) => isStandardClass(cls)) ? (
          <Row gutter={16}>
            <Col xs={24} sm={12} md={14}>
              <Section
                title="Restrictions & Special Abilities"
                component={<SpecialsRestrictions />}
              />
            </Col>
            <Col xs={24} sm={12} md={10}>
              <Flex gap={16} vertical>
                {classArr.map((cls) => {
                  const specialAbilities =
                    classes[cls as ClassNames]?.specialAbilities;
                  if (specialAbilities) {
                    return (
                      <Section
                        key={cls}
                        title={`${cls} Abilities Table`}
                        titleHelpText={abilitiesTableHelpText}
                        component={
                          <SpecialAbilitiesTable
                            specialAbilities={specialAbilities}
                          />
                        }
                        className={isMobile ? "mt-4" : ""}
                      />
                    );
                  }
                })}
                <Section title="Saving Throws" component={<SavingThrows />} />
              </Flex>
            </Col>
          </Row>
        ) : (
          <Alert type="info" message={customClassAlertMessage} />
        )}
        <Divider />
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Flex gap={16} vertical={isMobile} justify="space-between">
              <Section
                title="Money"
                className={moneyClassNames}
                component={<Money />}
              />
              <Section title="Weight" component={<Weight />} />
            </Flex>
            {isSpellCaster(character.class) && (
              <Section title="Spells" component={<Spells />} />
            )}
          </Col>
          <Col xs={24} sm={12}>
            <Section
              title="Equipment"
              className="mt-4 sm:m-0"
              component={
                <Equipment
                  setModalIsOpen={setModalIsOpen}
                  setModalTitle={setModalTitle}
                  setModalContent={setModalContent}
                />
              }
            />
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={24}>
            <Section
              title="Bio & Notes"
              component={<Description isMobile={isMobile} />}
            />
          </Col>
        </Row>
      </Flex>
      <ModalContainer
        title={modalTitle}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        modalContent={modalContent}
        modalOk={modalOkRef.current}
      />
    </CharacterDataContext.Provider>
  ) : (
    <Skeleton avatar paragraph={{ rows: 8 }} />
  );
};

export default PageCharacterSheet;
