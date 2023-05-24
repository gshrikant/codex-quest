import { Typography } from "antd";
import { CategoryCollapseProps } from "../types";
import React from "react";
import EquipmentItemSelector from "./EquipmentItemSelector";

export default function CategoryCollapse({
  title,
  dataRef,
  gold,
  setGold,
  equipment,
  setEquipment,
  race,
  weight,
  setWeight,
  strength,
}: CategoryCollapseProps) {
  const items = Object.entries(dataRef.current);

  return (
    <>
      <Typography.Title level={2}>{title}</Typography.Title>
      {items.map(([key, value], index) => (
        <React.Fragment key={index}>
          <Typography.Paragraph>
            <Typography.Text strong>{key}</Typography.Text>
          </Typography.Paragraph>
          {value.map((item: any, itemIndex: number) => (
            <EquipmentItemSelector
              item={item}
              key={itemIndex}
              gold={gold}
              setGold={setGold}
              equipment={equipment}
              setEquipment={setEquipment}
              race={race}
              weight={weight}
              setWeight={setWeight}
              strength={strength}
            />
          ))}
        </React.Fragment>
      ))}
    </>
  );
}