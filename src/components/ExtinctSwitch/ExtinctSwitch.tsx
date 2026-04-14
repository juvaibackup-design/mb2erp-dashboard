import { Switch } from "antd";
import { SwitchProps } from "antd/lib";
import React from "react";

const ExtinctSwitch = (props: SwitchProps) => {
  return (
    <Switch
      {...props}
      style={{ backgroundColor: Boolean(props.checked) ? "#F5222D" : "" }}
    />
  );
};

export default ExtinctSwitch;
