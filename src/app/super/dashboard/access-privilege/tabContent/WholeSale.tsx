import React from "react";
import { Collapse, Flex } from "antd";
import CheckboxComponent from "@/components/CheckboxComponent/CheckboxComponent";
import { UserRightsInterface } from "@/lib/interfaces/admin-interface/userRights";

interface WholeSaleProps {
  data: UserRightsInterface;
  setData: Function;
}

export default function WholeSale({ data, setData }: WholeSaleProps) {
  const handleChange = (name: string, checked: boolean) => {
    setData({ ...data, [name]: checked });
  };

  return (
    <Collapse
      collapsible="header"
      defaultActiveKey={["1"]}
      items={[
        {
          key: "1",
          label: "Security",
          children: (
            <Flex vertical>
              <CheckboxComponent
                name="ws_dc_price_edit"
                checked={data.ws_dc_price_edit}
                onChange={(e) =>
                  handleChange("ws_dc_price_edit", e.target.checked)
                }
              >
                Allow price edit in DC
              </CheckboxComponent>
              <CheckboxComponent
                checked={data.ws_salesman_mandatory}
                onChange={(e) =>
                  handleChange("ws_salesman_mandatory", e.target.checked)
                }
              >
                Sales man tagging mandatory
              </CheckboxComponent>

              <CheckboxComponent
                checked={data.proc_restrict_pi}
                onChange={(e) =>
                  handleChange("proc_restrict_pi", e.target.checked)
                }
              >
                Restrict direct PI
              </CheckboxComponent>

              <CheckboxComponent
                checked={data.proc_restrict_si}
                onChange={(e) =>
                  handleChange("proc_restrict_si", e.target.checked)
                }
              >
                Restrict direct SI
              </CheckboxComponent>

              <CheckboxComponent
                checked={data.proc_restrict_dc}
                onChange={(e) =>
                  handleChange("proc_restrict_dc", e.target.checked)
                }
              >
                Restrict direct DC
              </CheckboxComponent>
            </Flex>
          ),
        },
      ]}
    />
  );
}
