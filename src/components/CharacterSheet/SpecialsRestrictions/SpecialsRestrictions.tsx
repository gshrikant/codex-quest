import { List, Typography } from "antd";
import { classDetails } from "../../../data/classDetails";
import { raceDetails } from "../../../data/raceDetails";
import { SpecialsRestrictionsProps } from "./definitions";

// Ant Design's List component treats the input as a string and not as HTML.
// To render HTML, you need to use dangerouslySetInnerHTML prop in React.
// However, List.Item does not support dangerouslySetInnerHTML directly.
// To overcome this, HtmlRender component accepts the HTML string and renders it correctly.
const HtmlRender = ({ html }: { html: string }) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
);

export default function SpecialsRestrictions({
  characterData,
  className,
}: SpecialsRestrictionsProps) {
  return (
    <div className={className}>
      <Typography.Title level={3} className="mt-0 !text-shipGray">
        Special Abilities & Restrictions
      </Typography.Title>
      <List
        bordered
        dataSource={[
          ...raceDetails[characterData.race.toLowerCase()].specials,
          ...classDetails[characterData.class.toLowerCase()].specials,
          ...raceDetails[characterData.race.toLowerCase()].restrictions,
          ...classDetails[characterData.class.toLowerCase()].restrictions,
        ]}
        renderItem={(item) => (
          <List.Item>
            <HtmlRender html={item} />
          </List.Item>
        )}
        className="print:border-0"
        size="small"
      />
    </div>
  );
}
