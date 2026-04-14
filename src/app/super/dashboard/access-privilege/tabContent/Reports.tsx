import CheckboxComponent from "@/components/CheckboxComponent/CheckboxComponent";
import InputNumberComponent from "@/components/InputComponent/InputNumberComponent";
import { UserRightsInterface } from "@/lib/interfaces/admin-interface/userRights";
import { Collapse, Flex } from "antd";
import React from "react";

interface ReportsProps {
  data: UserRightsInterface;
  setData: Function;
}

export default function Reports({ data, setData }: ReportsProps) {
  const handleChange = (name: string, value: boolean | number) => {
    setData({ ...data, [name]: value });
  };

  return (
    <Flex vertical>
      <Collapse
        collapsible="header"
        defaultActiveKey={['1']}
        items={[
          {
            key: "1",
            label: "Testing Purpose",
            children: (
              <Flex vertical>
                <CheckboxComponent
                  checked={data.rep_period_restriction}
                  onChange={(e) =>
                    handleChange("rep_period_restriction", e.target.checked)
                  }
                >
                  <Flex gap={5} align="center">
                    <span>Allow period wise restriction</span>
                    <InputNumberComponent 
                      name="rep_period_days"
                      value={data.rep_period_days}
                      onChange={(value: any) => handleChange("rep_period_days", value)}
                    />
                    <span>days</span>
                  </Flex>
                </CheckboxComponent>
                <CheckboxComponent
                  checked={data.rep_allow_mw_dashboard}
                  onChange={(e) =>
                    handleChange("rep_allow_mw_dashboard", e.target.checked)
                  }
                >
                  Allow main window dashboard
                </CheckboxComponent>
              </Flex>
            ),
          },
        ]}
      />
    </Flex>
  );
}
