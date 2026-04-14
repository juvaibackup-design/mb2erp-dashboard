import { Table, TableProps } from "antd";
import React from "react";

function TableComponent(props: TableProps<any>) {
  return <Table {...props}>{props.children ? props.children : null}</Table>;
}

export default TableComponent;
