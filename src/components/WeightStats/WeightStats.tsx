import { Divider, Typography } from "antd";
import { CharacterDetails } from "../types";
import { calculateCarryingCapacity } from "../../support/formatSupport";
import HelpTooltip from "../HelpTooltip/HelpTooltip";
import SimpleNumberStat from "../CharacterSheet/SimpleNumberStat";

export default function WeightStats({
  character,
  setCharacter,
}: CharacterDetails) {
  const capacity = calculateCarryingCapacity(
    +character.abilities.scores.strength,
    character.race
  );
  const weight = character.equipment.reduce(
    (accumulator, currentValue) =>
      accumulator + (currentValue.weight ?? 0) * (currentValue.amount ?? 0),
    0
  );

  return (
    <div className="text-center">
      <SimpleNumberStat title="Weight" value={weight.toFixed(0)} />
      <Divider />
      <Typography.Paragraph className="text-3xl font-bold !text-shipGray !mb-3">
        Max: {capacity.heavy}
        <HelpTooltip
          text={`Stay under ${capacity.light} to remain "Lightly Loaded"`}
          className="relative -top-1 ml-2"
        />
      </Typography.Paragraph>
      <Typography.Text>
        {weight < capacity.light ? "(Lightly Loaded)" : "(Heavily Loaded)"}
      </Typography.Text>
    </div>
  );
}
