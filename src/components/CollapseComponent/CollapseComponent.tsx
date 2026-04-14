import React from "react";
import { Collapse } from "antd";

export type ItemType = {
  key: string;
  label: string;
  children: any;
}[];

export interface AccordionProps {
  accordion: boolean;
  activeKey?: string[] | string | number[] | number;
  collapsible?: "header" | "icon" | "disabled";
  defaultActiveKey?: string[] | string | number[] | number;
  expandIcon?: ((panelProps: object) => React.ReactNode) | undefined;
  expandIconPosition?: "start" | "end";
  ghost?: boolean | undefined;
  size?: "large" | "middle" | "small";
  onChange: ((key: string | string[]) => void) | undefined;
  items: ItemType;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
  rootClassName?: string | undefined;
  bordered?: boolean;
}

function CollapseComponent({
  accordion,
  activeKey,
  collapsible,
  defaultActiveKey,
  expandIcon,
  expandIconPosition,
  ghost,
  size,
  onChange,
  items,
  className,
  style,
  rootClassName,
  bordered,
}: AccordionProps) {
  return (
    <Collapse
      className={className}
      style={style}
      accordion={accordion}
      activeKey={activeKey}
      collapsible={collapsible}
      defaultActiveKey={defaultActiveKey}
      expandIcon={expandIcon}
      expandIconPosition={expandIconPosition}
      ghost={ghost}
      size={size}
      onChange={onChange}
      items={items}
      rootClassName={rootClassName}
      bordered={bordered}
    />
  );
}

export default CollapseComponent;
