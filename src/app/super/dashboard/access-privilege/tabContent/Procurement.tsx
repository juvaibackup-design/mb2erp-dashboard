import { UserRightsInterface } from "@/lib/interfaces/admin-interface/userRights";
import { Checkbox, Collapse, Flex } from "antd";
import React from "react";

interface ProcurementProps {
  data: UserRightsInterface;
  setData: Function;
}

export default function Procurement({ data, setData }: ProcurementProps) {
  const securityFields = [
    {
      id: "1",
      name: "proc_restrict_grn",
      label: "Restrict direct GRN",
      component: "checkbox",
    },
    {
      id: "2",
      name: "proc_restrict_dn",
      label: "Restrict direct DN",
      component: "checkbox",
    },
    {
      id: "3",
      name: "proc_restrict_cn",
      label: "Restrict direct CN",
      component: "checkbox",
    },
  ];

  const handleChange = (name: string, value: boolean) => {
    setData({ ...data, [name]: value });
  };
  return (
    <Flex vertical gap={10}>
      <Collapse
        collapsible="header"
        defaultActiveKey={["1"]}
        items={[
          {
            key: "1",
            label: "Security",
            children: (
              <Flex vertical gap={5}>
                {securityFields.map((field) => {
                  if (field.component === "checkbox") {
                    return (
                      <Flex key={field.id} gap={5}>
                        <Checkbox
                          checked={data[field.name]}
                          onChange={(e) =>
                            handleChange(field.name, e.target.checked)
                          }
                        >
                          {field.label}
                        </Checkbox>
                      </Flex>
                    );
                  }
                })}
              </Flex>
            ),
          },
        ]}
      />
    </Flex>
  );
}
