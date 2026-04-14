import { HolderOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Checkbox, Collapse, CollapseProps, Flex, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./AccDragTable.module.css";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckboxChangeEvent } from "antd/es/checkbox";

const groupDataByGroupName = (listData: any[]) => {
  return listData.reduce((acc: any, item: any) => {
    if (!acc[item.groupName]) {
      acc[item.groupName] = [];
    }
    acc[item.groupName].push(item);
    return acc;
  }, {});
};

const SortableItem = ({
  children,
  nameLabel,
  idLabel,
  listData,
  setItems,
  setIsShowAll,
  updateCheckboxValue, // Add this line
  updateFreezeCheckboxValue,
  updateEditCheckboxValue,
  ...props
}: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({ id: props.data?.[idLabel] });
  const checkForShowAll = (updatedListData: any[]) => {
    const allVisible = updatedListData.every(
      (item: any) => item.isRequired === true
    );
    setIsShowAll(allVisible);
  };

  const handleCheckboxChange = (
    id: number | undefined,
    field: string,
    checked: boolean
  ) => {
    if (id === undefined) {
      console.error("ID is undefined, cannot update checkbox value.");
      return;
    }
    console.log("AcchandleCheckboxChange", id, field, checked);
    if (updateCheckboxValue) {
      // updateCheckboxValue(id, field, checked);
      updateFreezeCheckboxValue(id, field, checked);
    } else {
      console.error("updateCheckboxValue function is not defined.");
    }
  };

  const handleFreezeLeftChange = (event: CheckboxChangeEvent) => {
    if (!props?.data?.id) {
      console.error("props.data.id is undefined");
      return;
    }
    handleCheckboxChange(props.data.id, "isFreezeLeft", event.target.checked);
  };

  const handleFreezeRightChange = (event: CheckboxChangeEvent) => {
    if (!props?.data?.id) {
      console.error("props.data.id is undefined");
      return;
    }
    handleCheckboxChange(props.data.id, "isFreezeRight", event.target.checked);
  };

  const handleChange = (event: CheckboxChangeEvent, id: any) => {
    updateCheckboxValue(id, "isRequired", event.target.checked);
  };
  // const handleEditChange = (event: CheckboxChangeEvent, id: any) => {
  //   console.log("handleEditChange", event, id);
  //   updateEditCheckboxValue(id, "isEditable", event.target.checked);
  // };

  // const handleEditChange = (event: CheckboxChangeEvent, id: any) => {
  //   console.log("handleEditChange", event, id);

  //   if (typeof updateEditCheckboxValue !== "function") {
  //     console.error("updateEditCheckboxValue is not defined");
  //     return;
  //   }

  //   updateEditCheckboxValue(id, "isEditable", event.target.checked);
  // };

  const handleEditChange = (event: CheckboxChangeEvent, id: any) => {
    console.log("handleEditChange Triggered", event, id);

    if (!updateEditCheckboxValue) {
      console.error(
        "❌ updateEditCheckboxValue is not defined in SortableItem."
      );
      return;
    }

    updateEditCheckboxValue(id, "isEditable", event.target.checked);
  };

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    // transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };
  console.log("propssss", props.data);
  return (
    <div {...props} ref={setNodeRef} style={style} {...attributes}>
      {props.data?.[nameLabel]?.length === 0 ? (
        <></>
      ) : (
        <React.Fragment key={props.data.id}>
          {props.data?.isVisible && (
            <div className={styles.rowContainer}>
              {/* Fields column */}
              <div className={styles.columnLeft}>
                <div className={styles.dragRow}>
                  <HolderOutlined
                    ref={setActivatorNodeRef}
                    style={{
                      touchAction: "none",
                      cursor: "move",
                    }}
                    {...listeners}
                  />
                  <div className={styles.dragC}>
                    <div className={styles.checkboxContainer}>
                      <Checkbox
                        checked={props.data?.isRequired}
                        onChange={(event) => handleChange(event, props.data.id)}
                        className={styles.checkbox}
                        disabled={props.data?.isDefault} // Disable only the checkbox
                      />
                      {/* Render the label as a separate element so it remains clickable */}
                      <label className={styles.checkboxLabel}>
                        {props.data?.[nameLabel]}
                        {/* {props.data?.groupName === "Editable" &&
                          (() => {
                            let tooltipText = "This Column for Against"; // Default tooltip

                            // Show "This Column for Against" for Order, Receive, and Return
                            if (
                              (props.data?.form === "Order" &&
                                [
                                  "Ordered Qty",
                                  "Invoice Qty",
                                  "Pending Qty",
                                ].includes(props.data?.[nameLabel])) ||
                              (props.data?.form === "Receive" &&
                                [
                                  "Ordered Qty",
                                  "Received Qty",
                                  "Pending Qty",
                                ].includes(props.data?.[nameLabel])) ||
                              (props.data?.form === "Return" &&
                                [
                                  "Received Qty",
                                  "Return Qty",
                                  "Pending Qty",
                                ].includes(props.data?.[nameLabel]))
                            ) {
                              return (
                                <Tooltip title={tooltipText}>
                                  <InfoCircleOutlined
                                    className={styles.infoIcon}
                                  />
                                </Tooltip>
                              );
                            }

                            // Show specific tooltip for "Quote" - Display "Against Quote"
                            if (
                              props.data?.form === "Sales Order" &&
                              ["Quoted Qty", "SO Qty", "Pending Qty"].includes(
                                props.data?.[nameLabel]
                              )
                            ) {
                              return (
                                <Tooltip title="This Column for Against Quote">
                                  <InfoCircleOutlined
                                    className={styles.infoIcon}
                                  />
                                </Tooltip>
                              );
                            }

                            // Show specific tooltips for Invoice
                            if (props.data?.form === "Invoice") {
                              let tooltipTitles: string[] = [];

                              if (
                                [
                                  "Received Qty",
                                  "Invoice Qty",
                                  "Pending Qty",
                                ].includes(props.data?.[nameLabel])
                              ) {
                                tooltipTitles.push("Against GRN");
                              }

                              if (
                                [
                                  "Ordered Qty",
                                  "Invoice Qty",
                                  "Pending Qty",
                                ].includes(props.data?.[nameLabel])
                              ) {
                                tooltipTitles.push("Against PO");
                              }

                              if (tooltipTitles.length === 0) return null;
                              tooltipText = `This Column for ${tooltipTitles.join(
                                " & "
                              )}`;

                              return (
                                <Tooltip title={tooltipText}>
                                  <InfoCircleOutlined
                                    className={styles.infoIcon}
                                  />
                                </Tooltip>
                              );
                            }

                            // Show specific tooltips for Debit Note
                            if (props.data?.form === "Debit Note") {
                              let tooltipTitles: string[] = [];

                              if (
                                [
                                  "Return Qty",
                                  "DN Qty",
                                  "Pending Qty",
                                ].includes(props.data?.[nameLabel])
                              ) {
                                tooltipTitles.push("Against GRT");
                              }

                              if (
                                [
                                  "Invoice Qty",
                                  "DN Qty",
                                  "Pending Qty",
                                ].includes(props.data?.[nameLabel])
                              ) {
                                tooltipTitles.push("Against PI");
                              }

                              if (tooltipTitles.length === 0) return null;
                              tooltipText = `This Column for ${tooltipTitles.join(
                                " & "
                              )}`;

                              return (
                                <Tooltip title={tooltipText}>
                                  <InfoCircleOutlined
                                    className={styles.infoIcon}
                                  />
                                </Tooltip>
                              );
                            }

                            return null; // If no conditions match, return nothing
                          })()} */}

                        {props.data?.groupName === "Editable" &&
                          (() => {
                            let tooltipText = "This Column for Against"; // Default tooltip

                            // Show "This Column for Against" for Order, Receive, and Return
                            if (
                              (props.data?.form === "Order" &&
                                [
                                  "Ordered Qty",
                                  "Invoice Qty",
                                  "Pending Qty",
                                ].includes(props.data?.[nameLabel])) ||
                              (props.data?.form === "Receive" &&
                                [
                                  "Ordered Qty",
                                  "Received Qty",
                                  "Pending Qty",
                                ].includes(props.data?.[nameLabel])) ||
                              (props.data?.form === "Return" &&
                                [
                                  "Received Qty",
                                  "Return Qty",
                                  "Pending Qty",
                                ].includes(props.data?.[nameLabel]))
                            ) {
                              return (
                                <Tooltip title={tooltipText}>
                                  <InfoCircleOutlined
                                    className={styles.infoIcon}
                                  />
                                </Tooltip>
                              );
                            }

                            // Show specific tooltip for "Sales Order" - Display "Against Quote"
                            if (
                              props.data?.form === "Sales Order" &&
                              ["Quoted Qty", "SO Qty", "Pending Qty"].includes(
                                props.data?.[nameLabel]
                              )
                            ) {
                              return (
                                <Tooltip title="This Column for Against Quote">
                                  <InfoCircleOutlined
                                    className={styles.infoIcon}
                                  />
                                </Tooltip>
                              );
                            }

                            // Show specific tooltip for "Delivery Challan"
                            if (props.data?.form === "Delivery Challan") {
                              let tooltipTitles: string[] = [];

                              // Condition: Against SQ (Quote)
                              if (
                                ["Quote Qty", "DC Qty", "Pending Qty"].includes(
                                  props.data?.[nameLabel]
                                )
                              ) {
                                tooltipTitles.push("Against SQ");
                              }

                              // Condition: Against SO (Sales Order)
                              if (
                                ["SO Qty", "DC Qty", "Pending Qty"].includes(
                                  props.data?.[nameLabel]
                                )
                              ) {
                                tooltipTitles.push("Against SO");
                              }

                              if (tooltipTitles.length === 0) return null;
                              tooltipText = `This Column for ${tooltipTitles.join(
                                " & "
                              )}`;

                              return (
                                <Tooltip title={tooltipText}>
                                  <InfoCircleOutlined
                                    className={styles.infoIcon}
                                  />
                                </Tooltip>
                              );
                            }

                            // Show specific tooltips for "Sales Invoice"
                            if (props.data?.form === "Sales Invoice") {
                              let tooltipTitles: string[] = [];

                              // Condition: Against SO
                              if (
                                [
                                  "Invoice Qty",
                                  "Pending Qty",
                                  "SO Qty",
                                ].includes(props.data?.[nameLabel])
                              ) {
                                tooltipTitles.push("Against SO");
                              }

                              // Condition: Against DC
                              if (
                                [
                                  "Invoice Qty",
                                  "Pending Qty",
                                  "DC Qty",
                                ].includes(props.data?.[nameLabel])
                              ) {
                                tooltipTitles.push("Against DC");
                              }

                              // Condition: Against STF
                              if (
                                [
                                  "Invoice Qty",
                                  "Pending Qty",
                                  "STF Qty",
                                ].includes(props.data?.[nameLabel])
                              ) {
                                tooltipTitles.push("Against STF");
                              }

                              if (tooltipTitles.length === 0) return null;
                              tooltipText = `This Column for ${tooltipTitles.join(
                                " & "
                              )}`;

                              return (
                                <Tooltip title={tooltipText}>
                                  <InfoCircleOutlined
                                    className={styles.infoIcon}
                                  />
                                </Tooltip>
                              );
                            }

                            // Show specific tooltips for Invoice
                            if (props.data?.form === "Invoice") {
                              let tooltipTitles: string[] = [];

                              if (
                                [
                                  "Received Qty",
                                  "Invoice Qty",
                                  "Pending Qty",
                                ].includes(props.data?.[nameLabel])
                              ) {
                                tooltipTitles.push("Against GRN");
                              }

                              if (
                                [
                                  "Ordered Qty",
                                  "Invoice Qty",
                                  "Pending Qty",
                                ].includes(props.data?.[nameLabel])
                              ) {
                                tooltipTitles.push("Against PO");
                              }

                              if (tooltipTitles.length === 0) return null;
                              tooltipText = `This Column for ${tooltipTitles.join(
                                " & "
                              )}`;

                              return (
                                <Tooltip title={tooltipText}>
                                  <InfoCircleOutlined
                                    className={styles.infoIcon}
                                  />
                                </Tooltip>
                              );
                            }

                            // Show specific tooltips for Debit Note
                            if (props.data?.form === "Debit Note") {
                              let tooltipTitles: string[] = [];

                              if (
                                [
                                  "Return Qty",
                                  "DN Qty",
                                  "Pending Qty",
                                ].includes(props.data?.[nameLabel])
                              ) {
                                tooltipTitles.push("Against GRT");
                              }

                              if (
                                [
                                  "Invoice Qty",
                                  "DN Qty",
                                  "Pending Qty",
                                ].includes(props.data?.[nameLabel])
                              ) {
                                tooltipTitles.push("Against PI");
                              }

                              if (tooltipTitles.length === 0) return null;
                              tooltipText = `This Column for ${tooltipTitles.join(
                                " & "
                              )}`;

                              return (
                                <Tooltip title={tooltipText}>
                                  <InfoCircleOutlined
                                    className={styles.infoIcon}
                                  />
                                </Tooltip>
                              );
                            }

                            return null; // If no conditions match, return nothing
                          })()}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* Mandatory column */}
              <div className={styles.columnRight}>
                <div className={styles.dragRow}>
                  <div className={styles.dragPosition}>
                    <div className={styles.forLandR}>
                      <Flex gap={10} style={{ marginLeft: "-90px" }}>
                        <Checkbox
                          checked={
                            props.data?.isFreezeLeft && props.data?.isRequired
                          }
                          onChange={handleFreezeLeftChange}
                          disabled={
                            props.data?.isDefault || !props.data?.isRequired
                          }
                        />
                        <Checkbox
                          checked={
                            props.data?.isFreezeRight && props.data?.isRequired
                          }
                          // onChange={(event) =>
                          //   handleCheckboxChange(event, "isFreezeRight")
                          // }
                          onChange={handleFreezeRightChange}
                          disabled={
                            props.data?.isDefault || !props.data?.isRequired
                          }
                        />
                      </Flex>
                    </div>
                    <div className={styles.editable}>
                      <Flex style={{ marginRight: "20px" }}>
                        <Checkbox
                          checked={
                            props.data?.isEditable && props.data?.isRequired
                          }
                          onChange={(event) =>
                            handleEditChange(event, props.data.id)
                          }
                          disabled={
                            // props.data?.isDefault ||
                            !props.data?.isDefaultEditable ||
                            !props.data?.isRequired ||
                            props.data?.groupName !== "Editable"
                          }
                        />
                      </Flex>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};
const ListWithDragAndDrop = ({
  data,
  setItems,
  setIsShowAll,
  nameLabel,
  idLabel,
  updateCheckboxValue, // Add this line
}: any) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items: any[]) => {
        const activeIndex = items.findIndex((i) => i.id === active.id);
        const overIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  };
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={data} strategy={verticalListSortingStrategy}>
        {data.map((item: any, index: number) => (
          <SortableItem
            key={index}
            data={item}
            nameLabel={nameLabel}
            idLabel={idLabel}
            setItems={setItems}
            setIsShowAll={setIsShowAll}
            listData={data}
            // updateCheckboxValue={updateCheckboxValue}
            updateCheckboxValue={(id: any, field: any, value: any) => {
              if (updateCheckboxValue) {
                updateCheckboxValue(id, field, value, "tableListData");
              }
            }}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

interface DragType {
  listData?: Array<{ [key: string]: any }>;
  nameLabel?: string;
  idLabel?: string;
  open?: boolean;
  closePopup?: () => void;
  onOpenChange?: () => void;
  handleOk?: Function;
  modeVal?: "vertical" | "horizontal";
  // updateCheckboxValue?: (id: any, field: string, value: boolean) => void;
  updateCheckboxValue?: (
    id: any,
    field: string,
    value: boolean,
    type?: "listData" | "tableListData"
  ) => void;
  updateFreezeCheckboxValue?: (
    id: number,
    field: "isFreezeLeft" | "isFreezeRight",
    value: boolean
  ) => void;
  updateEditCheckboxValue?: (id: number, field: string, value: boolean) => void;
  updateOrder?: (newOrder: any[]) => void; // Add updateOrder to the interface
  setIsShowAll?: (value: boolean) => void; // Add setIsShowAll to the interface
}
const AccDragTable = ({
  listData,
  nameLabel,
  idLabel,
  open,
  closePopup,
  onOpenChange,
  handleOk,
  modeVal,
  updateCheckboxValue, // Add this line
  updateFreezeCheckboxValue,
  updateEditCheckboxValue,
  updateOrder, // Add this line
  setIsShowAll,
}: DragType) => {
  const [list, setList] = useState<any>(listData);

  const [groupedData, setGroupedData] = useState<any>({});
  const [selectedGroups, setSelectedGroups] = useState<Record<string, boolean>>(
    {}
  );
  console.log("selectedGroups", selectedGroups);

  useEffect(() => {
    if (Array.isArray(listData)) {
      setGroupedData(groupDataByGroupName(listData));
    } else {
      console.error("listData is not an array", listData);
      setGroupedData({}); // Set an empty object if `listData` is invalid
    }
  }, [listData]);

  useEffect(() => {
    console.log("listData_drag1", list);
    setList(listData);
  }, [listData, list]);
  //Newly Added For DragOrderNo
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const activeIndex = list.findIndex((i: any) => i.id === active.id);
      const overIndex = list.findIndex((i: any) => i.id === over.id);
      const reorderedList = arrayMove(list, activeIndex, overIndex);
      setList(reorderedList); // Update local list state
      if (updateOrder) {
        updateOrder(reorderedList); // Call updateOrder to update orderNo in AccountMaster.tsx
      }
    }
  };

  const handleGroupCheckboxChange = (groupName: string, checked: boolean) => {
    console.log("handleGroupCheckboxChange", groupName, checked);
    setSelectedGroups((prev) => ({ ...prev, [groupName]: checked }));

    const updatedList = list.map((item: any) =>
      item.groupName === groupName ? { ...item, isRequired: checked } : item
    );
    console.log("updatedList", updatedList);
    setList(updatedList);

    // Ensure updateCheckboxValue is called for every row in the group
    updatedList.forEach((item: any) => {
      if (item.groupName === groupName && updateCheckboxValue) {
        updateCheckboxValue(item.id, "isRequired", checked, "tableListData");
      }
    });
  };

  const collapseItems: CollapseProps["items"] = Object.entries(groupedData).map(
    ([groupName, items]: any, index) => ({
      key: String(index),
      label: groupName,
      children: (
        <div className={styles.groupContainer}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item: any) => (
              <SortableItem
                key={item.id}
                data={item}
                nameLabel={nameLabel}
                idLabel={idLabel}
                updateCheckboxValue={(
                  id: any,
                  field: string,
                  value: boolean
                ) => {
                  if (updateCheckboxValue) {
                    updateCheckboxValue(id, field, value, "tableListData");
                  }
                }}
                updateEditCheckboxValue={(
                  id: any,
                  field: string,
                  value: boolean
                ) => {
                  if (updateEditCheckboxValue) {
                    updateEditCheckboxValue(id, field, value);
                  } else {
                    console.error("❌ updateEditCheckboxValue is undefined");
                  }
                }}
                updateFreezeCheckboxValue={updateFreezeCheckboxValue}
                setIsShowAll={setIsShowAll}
                listData={list}
              />
            ))}
          </SortableContext>
        </div>
      ),
    })
  );

  return (
    <DndContext
      sensors={useSensors(useSensor(PointerSensor))}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {/* Orginal */}
      {Object.keys(groupedData).length > 1 ? (
        Object.entries(groupedData).map(([groupName, items]: any) => (
          <div key={groupName} className={styles.groupContainer}>
            <div className={styles.groupHeader}>
              <h3 className={styles.groupHeaderAlign}>{groupName}</h3>
            </div>

            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item: any) => (
                <SortableItem
                  key={item.id}
                  data={item}
                  nameLabel={nameLabel}
                  idLabel={idLabel}
                  // updateCheckboxValue={updateCheckboxValue}
                  updateCheckboxValue={(
                    id: any,
                    field: string,
                    value: boolean
                  ) => {
                    if (updateCheckboxValue) {
                      console.log("updateCheckboxValue", id, field, value);
                      updateCheckboxValue(id, field, value, "tableListData"); // Ensure the function exists before calling
                    }
                  }}
                  updateFreezeCheckboxValue={updateFreezeCheckboxValue}
                  // updateEditCheckboxValue={updateEditCheckboxValue}
                  updateEditCheckboxValue={(
                    id: any,
                    field: string,
                    value: boolean
                  ) => {
                    if (updateEditCheckboxValue) {
                      console.log("updateEditCheckboxValue", id, field, value);
                      updateEditCheckboxValue(id, field, value);
                    } else {
                      console.error(
                        "❌ updateEditCheckboxValue is undefined in AccDragTable.tsx"
                      );
                    }
                  }}
                  setIsShowAll={setIsShowAll}
                  listData={list}
                />
              ))}
            </SortableContext>
          </div>
        ))
      ) : (
        <SortableContext items={list} strategy={verticalListSortingStrategy}>
          {list.map((item: any) => (
            <SortableItem
              key={item[idLabel as keyof typeof item]}
              data={item}
              nameLabel={nameLabel}
              idLabel={idLabel}
              // updateCheckboxValue={updateCheckboxValue}
              updateCheckboxValue={(id: any, field: string, value: boolean) => {
                if (updateCheckboxValue) {
                  updateCheckboxValue(id, field, value, "tableListData"); // Ensure the function exists before calling
                }
              }}
              updateEditCheckboxValue={(
                id: any,
                field: string,
                value: boolean
              ) => {
                if (updateEditCheckboxValue) {
                  console.log("updateEditCheckboxValue", id, field, value);
                  updateEditCheckboxValue(id, field, value);
                } else {
                  console.error(
                    "❌ updateEditCheckboxValue is undefined in AccDragTable.tsx"
                  );
                }
              }}
              updateFreezeCheckboxValue={updateFreezeCheckboxValue}
              setIsShowAll={setIsShowAll}
              listData={list}
            />
          ))}
        </SortableContext>
      )}

      {/* For Collapse Card */}
      {/* {Object.keys(groupedData).length > 1 ? (
        <Collapse accordion items={collapseItems} />
      ) : (
        <SortableContext items={list} strategy={verticalListSortingStrategy}>
          {list.map((item: any) => (
            <SortableItem
              key={item[idLabel as keyof typeof item]}
              data={item}
              nameLabel={nameLabel}
              idLabel={idLabel}
              updateCheckboxValue={(id: any, field: string, value: boolean) => {
                if (updateCheckboxValue) {
                  updateCheckboxValue(id, field, value, "tableListData");
                }
              }}
              updateEditCheckboxValue={(
                id: any,
                field: string,
                value: boolean
              ) => {
                if (updateEditCheckboxValue) {
                  updateEditCheckboxValue(id, field, value);
                } else {
                  console.error("❌ updateEditCheckboxValue is undefined");
                }
              }}
              updateFreezeCheckboxValue={updateFreezeCheckboxValue}
              setIsShowAll={setIsShowAll}
              listData={list}
            />
          ))}
        </SortableContext>
      )} */}

      {/* For GroupWise CheckBox */}
      {/* {Object.keys(groupedData).length > 1 ? (
        Object.entries(groupedData).map(([groupName, items]: any) => {
          const isChecked = items.every((item: any) => item.isRequired);

          return (
            <div key={groupName} className={styles.groupContainer}>
              <div className={styles.groupHeader}>
                <Flex style={{ marginLeft: "20px" }}>
                  <Checkbox
                    className="ow-AccDragTable_CheckBox"
                    checked={isChecked}
                    onChange={(e) =>
                      handleGroupCheckboxChange(groupName, e.target.checked)
                    }
                  />
                  <h3 className={styles.groupHeaderAlign}>{groupName}</h3>
                </Flex>
              </div>

              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                {items.map((item: any) => (
                  <SortableItem
                    key={item.id}
                    data={item}
                    nameLabel={nameLabel}
                    idLabel={idLabel}
                    updateCheckboxValue={(
                      id: any,
                      field: string,
                      value: boolean
                    ) => {
                      if (updateCheckboxValue) {
                        updateCheckboxValue(id, field, value, "tableListData");
                      }
                    }}
                    updateFreezeCheckboxValue={updateFreezeCheckboxValue}
                    updateEditCheckboxValue={(
                      id: any,
                      field: string,
                      value: boolean
                    ) => {
                      if (updateEditCheckboxValue) {
                        updateEditCheckboxValue(id, field, value);
                      } else {
                        console.error(
                          "❌ updateEditCheckboxValue is undefined in AccDragTable.tsx"
                        );
                      }
                    }}
                    setIsShowAll={setIsShowAll}
                    listData={list}
                  />
                ))}
              </SortableContext>
            </div>
          );
        })
      ) : (
        <SortableContext items={list} strategy={verticalListSortingStrategy}>
          {list.map((item: any) => (
            <SortableItem
              key={item[idLabel as keyof typeof item]}
              data={item}
              nameLabel={nameLabel}
              idLabel={idLabel}
              updateCheckboxValue={(id: any, field: string, value: boolean) => {
                if (updateCheckboxValue) {
                  updateCheckboxValue(id, field, value, "tableListData");
                }
              }}
              updateEditCheckboxValue={(
                id: any,
                field: string,
                value: boolean
              ) => {
                if (updateEditCheckboxValue) {
                  updateEditCheckboxValue(id, field, value);
                } else {
                  console.error(
                    "❌ updateEditCheckboxValue is undefined in AccDragTable.tsx"
                  );
                }
              }}
              updateFreezeCheckboxValue={updateFreezeCheckboxValue}
              setIsShowAll={setIsShowAll}
              listData={list}
            />
          ))}
        </SortableContext>
      )} */}
    </DndContext>
    // </div>
  );
};
export default AccDragTable;
