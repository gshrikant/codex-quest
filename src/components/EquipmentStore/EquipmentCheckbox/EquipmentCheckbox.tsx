import { Checkbox, InputNumber, Space } from "antd";
import { EquipmentCheckboxProps } from "./definitions";
import { useEffect, useState } from "react";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { EquipmentItem } from "../definitions";

export default function EquipmentCheckbox({
  disabled,
  item,
  className,
  onCheckboxCheck,
  onAmountChange,
  playerHasItem,
  equipmentItemDescription,
  inputDisabled,
  itemAmount,
}: EquipmentCheckboxProps) {
  const [isChecked, setIsChecked] = useState(playerHasItem);
  const [amount, setAmount] = useState(itemAmount);

  const handleCheckboxChange = (
    e: CheckboxChangeEvent,
    item: EquipmentItem
  ) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    onCheckboxCheck(item, checked);
    if (!checked) setAmount(1);
  };

  const handleInputChange = (value: number | null, item: EquipmentItem) => {
    setAmount(value || 1);
    onAmountChange({ ...item, amount: value || 0 });
  };

  useEffect(() => {
    setAmount(itemAmount || 1);
  }, [item.amount]);

  return (
    <Space direction="vertical" className={className}>
      <Checkbox
        disabled={(disabled || inputDisabled) && !isChecked}
        onChange={(e: CheckboxChangeEvent) => handleCheckboxChange(e, item)}
        checked={playerHasItem}
      >
        {equipmentItemDescription}
      </Checkbox>
      <InputNumber
        min={1}
        defaultValue={1}
        onChange={(value: number | null) => handleInputChange(value, item)}
        disabled={inputDisabled}
        className={`${!playerHasItem && "hidden"} ml-6`}
        value={amount}
      />
    </Space>
  );
}