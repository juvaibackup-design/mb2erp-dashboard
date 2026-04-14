"use client";
import React, { useState } from "react";
import type { TablePaginationConfig, TableProps } from "antd";
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from "antd";

export type DataType = {
  key: string;
  [propName: string]: any;
};

export enum InputType {
  Text = "text",
  Number = "number",
}

export type ColumnType = {
  title: string; // "name"
  dataIndex: string; // "name"
  width?: string; // "25%"
  editable: boolean; //true,
  inputType: InputType;
};

/*
const originData = Array.from({ length: 10 }).map<DataType>((_, i) => ({
  key: i.toString(),
  name: `Edward ${i}`,
  age: 32,
  address: `London Park no. ${i}`,
}));

const columns = [
  {
    title: "name",
    dataIndex: "name",
    width: "25%",
    editable: true,
    inputType: "text",
  },
  {
    title: "age",
    dataIndex: "age",
    width: "15%",
    editable: true,
    inputType: "number",
  },
  {
    title: "address",
    dataIndex: "address",
    width: "40%",
    editable: false,
    inputType: "text",
  },

  
  /
];
*/
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: DataType;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

type Props = {
  data: DataType[];
  columns: ColumnType[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  editFlag: boolean;
  deleteFlag: boolean;
  paginationFlag: boolean;
  footer?: any;
};
const EditableRowTable: React.FC<Props> = (props: Props) => {
  const {
    columns,
    data,
    setData,
    editFlag,
    deleteFlag,
    paginationFlag = false,
  } = props;

  //adding delete action if delete flag is enabled.
  let updatedColumns: any = [...columns];
  if (deleteFlag) {
    const actionColumn = {
      title: "Delete",
      dataIndex: "Delete",
      render: (_: any, record: DataType) => {
        <Typography.Link
        // disabled={editingKey !== ""}
        // onClick={() => edit(record)}
        >
          Delete
        </Typography.Link>;
      },
    };
    updatedColumns = [...columns, actionColumn];
  }

  const [form] = Form.useForm();
  //const [data, setData] = useState<DataType[]>(originData);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: DataType) => record.key === editingKey;

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const mergedColumns: TableProps<DataType>["columns"] = updatedColumns.map(
    (col: any) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: DataType) => ({
          record,
          inputType: col.inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    }
  );

  let pagination = undefined;

  return (
    <Form form={form} component={false}>
      <Table<DataType>
        components={{
          body: { cell: EditableCell },
        }}
        bordered
        size="small"
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        className="ow_selectedInvoice_table_value"
        pagination={false}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              if (editFlag) edit(record);
            }, // click row
            onDoubleClick: (event) => {}, // double click row
            onContextMenu: (event) => {}, // right button click row
            onMouseEnter: (event) => {}, // mouse enter row
            onMouseLeave: (event) => {}, // mouse leave row
            onKeyDown: (event) => {
              if (event.key == "Enter") save(record.key);
            },
          };
        }}
      />
    </Form>
  );
};

export default EditableRowTable;
