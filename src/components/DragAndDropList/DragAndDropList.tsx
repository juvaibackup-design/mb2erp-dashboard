import { HolderOutlined, SettingTwoTone } from "@ant-design/icons";
import { Button, Checkbox, List, Popover, Radio } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./DragAndDropList.module.css";
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
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { CheckboxChangeEvent } from "antd/es/checkbox";

const SortableItem = ({
  children,
  nameLabel,
  idLabel,
  listData,
  setItems,
  setIsShowAll,
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
      (item: any) => item.isVisible === true
    );
    setIsShowAll(allVisible);
  };

  const handleChange = (event: CheckboxChangeEvent, id: any) => {
    const updatedListData = listData.map((item: any) =>
      item.id === id ? { ...item, isVisible: event.target.checked } : item
    );
    setItems(updatedListData);
    checkForShowAll(updatedListData);
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
          <div className={styles.dragRow} key={props.data.id}>
            <HolderOutlined
              ref={setActivatorNodeRef}
              style={{
                touchAction: "none",
                cursor: "move",
              }}
              {...listeners}
            />
            <div className={styles.dragC}>
              <Checkbox
                checked={props.data?.isVisible}
                onChange={(event) => {
                  handleChange(event, props.data.id);
                }}
                className={styles.checkbox}
              >
                {props.data?.[nameLabel]}
              </Checkbox>
            </div>
          </div>
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
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

const PopUpContent = ({
  isHaveFooter,
  footerLabel1,
  footerLabel2,
  listData,
  open,
  closePopup,
  onOpenChange,
  handleOk,
  nameLabel,
  idLabel,
  modeVal,
}: DragAndDropListType) => {
  const [mode, setMode] = useState(modeVal || "vertical");
  const [items, setItems] = useState(listData);
  const [isShowAll, setIsShowAll] = useState(false);

  useEffect(() => {
    const allVisible = listData.every((item) => item.isVisible === true);
    setIsShowAll(allVisible);
    setItems(listData);
  }, [listData]);

  const handleModeChange = (ev: any) => {
    setMode(ev.target.value);
  };

  const handlePopupOkay = () => {
    handleOk({ mode: mode, reOrderedArray: items });
    closePopup();
  };

  return (
    <div className={`${styles.container} custom-scroll`}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <Checkbox
            checked={isShowAll}
            onChange={(event) => {
              setIsShowAll(event?.target.checked);
              const updatedListData = items.map((item) => ({
                ...item,
                isVisible: event?.target.checked,
              }));
              setItems(updatedListData);
            }}
            className={styles.checkbox}
          >
            Show all
          </Checkbox>
        </div>
        <div>
          <Button
            type="primary"
            onClick={() => {
              handlePopupOkay();
            }}
          >
            OK
          </Button>
        </div>
      </div>
      {/* Contents */}
      <div className={styles.content}>
        <ListWithDragAndDrop
          data={items}
          setItems={setItems}
          nameLabel={nameLabel}
          idLabel={idLabel}
          setIsShowAll={setIsShowAll}
        />
      </div>
      {isHaveFooter && (
        <div
          className={styles.dragFooter}
          style={{ position: "sticky", top: 0 }}
        >
          <Radio.Group
            onChange={handleModeChange}
            value={mode}
            style={{
              marginTop: 16,
              display: "flex",
              // position: "sticky",
              // top: 0,
            }}
            buttonStyle="solid"
          >
            <Radio.Button className={styles.rb} value="vertical">
              {`${footerLabel1 || "List"} `}
            </Radio.Button>
            <Radio.Button className={styles.rb} value="horizontal">
              {`${footerLabel2 || "Expand"} `}
            </Radio.Button>
          </Radio.Group>
        </div>
      )}
    </div>
  );
};

interface DragAndDropListType {
  isHaveFooter: boolean;
  footerLabel1?: string;
  footerLabel2?: string;
  listData: Array<{ [key: string]: any }>;
  nameLabel: string;
  idLabel: string;
  open: boolean;
  closePopup: () => void;
  onOpenChange: () => void;
  handleOk: Function;
  modeVal?: "vertical" | "horizontal";
}

const DragAndDropList = ({
  isHaveFooter,
  footerLabel1,
  footerLabel2,
  listData,
  nameLabel,
  idLabel,
  open,
  closePopup,
  onOpenChange,
  handleOk,
  modeVal,
}: DragAndDropListType) => {

  const [list, setList] = useState<any>(listData);
  useEffect(() => {
    setList(listData);
  }, [listData]);


  return (
    <div className={styles.iconlayout}>
      <Popover
        placement="leftBottom"
        trigger="click"
        open={open}
        onOpenChange={onOpenChange}
        content={
          <PopUpContent
            isHaveFooter={isHaveFooter}
            footerLabel1={footerLabel1}
            footerLabel2={footerLabel2}
            listData={list}
            open={open}
            closePopup={closePopup}
            onOpenChange={onOpenChange}
            handleOk={handleOk}
            nameLabel={nameLabel}
            idLabel={idLabel}
            modeVal={modeVal}
          />
        }
      >
        <ButtonComponent
          onClickEvent={onOpenChange}
          className={styles.viewButton}
        >
          <SettingTwoTone className={styles.filterIcons} />
        </ButtonComponent>
      </Popover>
    </div>
  );
};

export default DragAndDropList;
