import CheckboxComponent from "@/components/CheckboxComponent/CheckboxComponent";
import InputNumberComponent from "@/components/InputComponent/InputNumberComponent";
import { UserRightsInterface } from "@/lib/interfaces/admin-interface/userRights";
import { Collapse, Flex } from "antd";
import React from "react";

interface FinanceProps {
  data: UserRightsInterface;
  setData: Function;
}

export default function Finance({ data, setData }: FinanceProps) {
  const handleChange = (name: string, value: any) => {
    setData({ ...data, [name]: value });
  };

  return (
    <Flex vertical>
      <Collapse
        collapsible="header"
        defaultActiveKey={["1"]}
        items={[
          {
            key: "1",
            label: "Security",
            children: (
              <Flex vertical gap={15}>
                <CheckboxComponent
                  checked={data.fin_post}
                  onChange={(e) => handleChange("fin_post", e.target.checked)}
                >
                  Allow authorization of post in finance
                </CheckboxComponent>
                <Flex gap={5} align="center">
                  <span>Allow Backdated Entry for</span>
                  <InputNumberComponent
                    type="number"
                    value={data.fin_back_entry_days}
                    onChange={(value) =>
                      handleChange("fin_back_entry_days", value)
                    }
                  />
                  <span>days</span>
                </Flex>
              </Flex>
            ),
          },
        ]}
      />
    </Flex>
  );
}
