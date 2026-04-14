import { ColumnsType } from "antd/es/table";
import React, { ChangeEventHandler, MouseEventHandler, ReactNode } from "react";
import type { Dayjs } from "dayjs";

export interface Element {
  label: string;
  value: number;
}

export interface Header {
  headerTitle: string | any;
  headerDescription: string | any;
  headerButtonLable?: string;
  customHeaderRightSideButton?: ReactNode | undefined;
  headerOnnClickButton?: React.MouseEventHandler<HTMLElement> | undefined;
}

export interface Modal {
  className: string;
  modalWidth: string | any;
  showModal: boolean;
  setShowModal: Function;
  modalFooter?: React.ReactNode;
  modalComponentCustomTitle: string;
  modalComponentDescription: string;
  customHeaderButtonLabel?: string | undefined;
  customHeaderOnClickEvent?: React.MouseEventHandler<HTMLElement> | undefined;
  customHeaderButtonIcon?: React.ReactNode | undefined;
  customHeaderRightChildren?: React.ReactNode | undefined;
  onCloseModalCustom?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  modalChildren?: React.ReactNode | undefined;
}

export interface Tab {
  tabItem: any[];
  activeKey?: string | any;
  tabOnChange: (activeKey: string) => void;
  colChooserList?: any[];
  colChooserNameLabel?: string;
  colChooserIdLabel?: string;
  onHandleOk?: (val: { mode: string; reOrderedArray: any[] }) => void;
}

export interface Filter {
  // input
  onChangeInputEvent: ChangeEventHandler<HTMLInputElement>;
  inputValue?: any;
  // by period
  onRangeChange: (
    dates: null | (Dayjs | null)[],
    dateStrings: string[]
  ) => void;
  gridView: boolean;
  setGridView: Function;
  openStateForFilterIconDrawer: boolean;
  setOpenStateForFilterIconDrawer: Function;
  showDrawer?: MouseEventHandler<HTMLElement> | undefined;
  onCloseDrawer?:
    | ((
        e:
          | React.MouseEvent<globalThis.Element, MouseEvent>
          | React.KeyboardEvent<globalThis.Element>
      ) => void)
    | undefined;
  columns: ColumnsType<any>;
  setFilterState: Function;
  dataToFilter: any;
}

export interface DragAndDrop {
  open: boolean;
  closePopup: () => void;
  listData: {
    [key: string]: any;
  }[];
  onOpenChange: () => void;
  handleOk: Function;
}

export interface BaseLayoutProps {
  onClickStatus?: (key: string) => void | undefined;
  // filteredData: InvoiceDetailsType[];
  header: Header;
  modal?: Modal | undefined;
  tab?: Tab | undefined;
  analytics?: Element[] | undefined;
  filter?: Filter;
  dragAndDrop?: DragAndDrop;
  children: ReactNode;
}
