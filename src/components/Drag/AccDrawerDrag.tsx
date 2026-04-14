import { HolderOutlined } from "@ant-design/icons";
import { Button, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./AccDrawerDrag.module.css";
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
  // const handleChange = (event: CheckboxChangeEvent, id: any) => {
  //   console.log("event",event,id);
  //   const updatedListData = listData.map((item: any) =>
  //     item.id === id ? { ...item, isVisible: event.target.checked } : item
  //   );
  //   setItems(updatedListData);
  //   // checkForShowAll(updatedListData);
  // };
  // const handleChangeMandatory = (event: CheckboxChangeEvent, id: any) => {
  //   console.log("event",event,id);
  //   const updatedListData = listData.map((item: any) =>
  //     item.id === id ? { ...item, isMandatory: event.target.checked } : item
  //   );
  //   setItems(updatedListData);
  // };
  const handleChange = (event: CheckboxChangeEvent, id: any) => {
    updateCheckboxValue(id, "isRequired", event.target.checked);
  };
  const handleChangeMandatory = (event: CheckboxChangeEvent, id: any) => {
    updateCheckboxValue(id, "isMandatory", event.target.checked);
  };
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    // transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };
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
                    {/* <Checkbox
        checked={props.data?.isRequired}
        onChange={(event) =>
          handleChange(event, props.data.id)}
        className={styles.checkbox}
        disabled={props.data?.isDefault}
        >
        {props.data?.[nameLabel]}
      </Checkbox> */}
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
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* Mandatory column */}
              <div className={styles.columnRight}>
                <div className={styles.dragRow}>
                  <div className={styles.dragC}>
                    <Checkbox
                      checked={
                        props.data?.isMandatory && props.data?.isRequired
                      } // && props.data?.isVisible}
                      onChange={(event) =>
                        handleChangeMandatory(event, props.data.id)
                      }
                      className={styles.checkbox}
                      disabled={
                        props.data?.isDefault || !props.data?.isRequired
                      }
                    />
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
            updateCheckboxValue={updateCheckboxValue} // Pass it down
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};
const PopUpContent = ({
  listData,
  open,
  closePopup,
  onOpenChange,
  handleOk,
  nameLabel,
  idLabel,
  modeVal,
  updateCheckboxValue, // Add this line
}: DragType) => {
  const [mode, setMode] = useState(modeVal || "vertical");
  const [items, setItems] = useState<any>(listData);
  const [isShowAll, setIsShowAll] = useState(false);
  useEffect(() => {
    setItems(listData);
  }, [listData]);
  return (
    <div className={`${styles.container} custom-scroll`}>
      <div className={styles.header}></div>
      <div className={styles.content}>
        <ListWithDragAndDrop
          data={items}
          setItems={setItems}
          nameLabel={nameLabel}
          idLabel={idLabel}
          setIsShowAll={setIsShowAll}
          updateCheckboxValue={updateCheckboxValue} // Pass it down
        />
      </div>
      {/* </div> */}
    </div>
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
  updateCheckboxValue?: (id: any, field: string, value: boolean) => void;
  updateOrder?: (newOrder: any[]) => void; // Add updateOrder to the interface
  setIsShowAll?: (value: boolean) => void; // Add setIsShowAll to the interface
}
const AccDrawerDrag = ({
  listData,
  nameLabel,
  idLabel,
  open,
  closePopup,
  onOpenChange,
  handleOk,
  modeVal,
  updateCheckboxValue, // Add this line
  updateOrder, // Add this line
  setIsShowAll,
}: DragType) => {
  const [list, setList] = useState<any>(listData);

  const [groupedData, setGroupedData] = useState<any>({});

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

  useEffect(() => {
    if (Array.isArray(listData)) {
      const grouped = groupDataByGroupName(listData);
      // Add empty "Manual" group if form is "Product Master"
      const isProductMaster = listData.some(
        (item) => item.form === "Product Master"
      );
      if (isProductMaster && !grouped["Category"]) {
        grouped["Category"] = []; // Empty array, only group name will render
      }
      setGroupedData(grouped);
    } else {
      console.error("listData is not an array", listData);
      setGroupedData({});
    }
  }, [listData]);
  //OLD
  // return (
  //     <PopUpContent
  //         listData={list}
  //         open={open}
  //         closePopup={closePopup}
  //         onOpenChange={onOpenChange}
  //         handleOk={handleOk}
  //         nameLabel={nameLabel}
  //         idLabel={idLabel}
  //         modeVal={modeVal}
  //         updateCheckboxValue={updateCheckboxValue} // Pass it down
  //       />
  // )
  //NEW
  return (
    // <DndContext
    //   sensors={useSensors(useSensor(PointerSensor))}
    //   collisionDetection={closestCenter}
    //   onDragEnd={handleDragEnd}
    // >
    //   <SortableContext items={list} strategy={verticalListSortingStrategy}>
    //     {list.map((item: any) => (
    //       <SortableItem
    //         key={item[idLabel as keyof typeof item]}
    //         data={item}
    //         nameLabel={nameLabel}
    //         idLabel={idLabel}
    //         updateCheckboxValue={updateCheckboxValue}
    //         setIsShowAll={setIsShowAll}
    //         listData={list}
    //       />
    //     ))}
    //   </SortableContext>
    // </DndContext>

    <DndContext
      sensors={useSensors(useSensor(PointerSensor))}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
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
              {/* {items.map((item: any) => (
                <SortableItem
                  key={item[idLabel as keyof typeof item]}
                  data={item}
                  nameLabel={nameLabel}
                  idLabel={idLabel}
                  updateCheckboxValue={updateCheckboxValue}
                  setIsShowAll={setIsShowAll}
                  listData={items}
                />
              ))} */}
              {items.length > 0 ? (
                items.map((item: any) => (
                  <SortableItem
                    key={item[idLabel as keyof typeof item]}
                    data={item}
                    nameLabel={nameLabel}
                    idLabel={idLabel}
                    updateCheckboxValue={updateCheckboxValue}
                    setIsShowAll={setIsShowAll}
                    listData={items}
                  />
                ))
              ) : groupName === "Category" ? (
                <div
                  style={{
                    padding: "12px",
                    color: "#1677ff",
                    fontSize: "14px",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  Category fields will be dynamically derived from the Product
                  Group based on the selected Department.
                </div>
              ) : null}
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
              updateCheckboxValue={updateCheckboxValue}
              setIsShowAll={setIsShowAll}
              listData={list}
            />
          ))}
        </SortableContext>
      )}
    </DndContext>
  );
};
export default AccDrawerDrag;
