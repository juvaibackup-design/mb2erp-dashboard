import React, { FC, useEffect, useState, forwardRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule, ValidationModule, TextFilterModule, NumberFilterModule, DateFilterModule, RowSelectionModule } from "ag-grid-community";
import { SetFilterModule, MultiFilterModule, GroupFilterModule, MasterDetailModule } from "ag-grid-enterprise";

const gridModules = [
  ClientSideRowModelModule,
  ValidationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  RowSelectionModule,
  SetFilterModule,
  MultiFilterModule,
  GroupFilterModule,
  MasterDetailModule
];

interface CustomAgGridProps {
  rowData: any[];
  columnDefs: ColDef[];
  height?: number | string;
  pagination?: boolean;
  paginationPageSize?: number;
  onSelectionChanged?: (event?: any) => void,
  suppressRowHoverHighlight?: boolean
  context?: any;
  defaultColDef?: ColDef;

  /** Optional Master–Detail props */
  masterDetail?: boolean;
  detailCellRenderer?: any;
  detailRowHeight?: number;
  detailRowAutoHeight?: boolean;
  rowHeight?: number;
  onRowClicked?: (event: any) => void;
  detailCellRendererParams?: any;
  // detailCellRendererParams
}

const CustomAgGrid = forwardRef<AgGridReact, CustomAgGridProps>((props, ref) => {
  const {
    rowData,
    columnDefs,
    height = 540,
    pagination = false,
    paginationPageSize = 10,
    onSelectionChanged,
    suppressRowHoverHighlight = true,
    context,
    defaultColDef: parentDefaultColDef,

    /** master-detail */
    masterDetail = false,
    detailCellRenderer,
    detailRowHeight,
    detailRowAutoHeight,
    rowHeight,
    detailCellRendererParams
  } = props;
  const defaultColDef: ColDef = {
    sortable: true,         // enable sorting
    filter: true,           // enable filtering
    editable: false,        // disable inline editing
    resizable: true,        // allow column resize
    ...parentDefaultColDef
  };

  const [gridHeight, setGridHeight] = useState<number | string>(540);

  const ROW_HEIGHT = 32;
  const HEADER_HEIGHT = 140;
  const VISIBLE_ROWS = 10;

  useEffect(() => {
    // If parent DID NOT pass height → auto-calc
    if (!height) {
      const autoHeight = HEADER_HEIGHT + ROW_HEIGHT * VISIBLE_ROWS;
      console.log("autoHeight")
      setGridHeight(autoHeight);
    } else {
      setGridHeight(height);
    }
  }, [height]);

  return (
    // <div className="ag-theme-quartz procurement-aggrid" style={{ height: "100%", width: '100%' }} onContextMenu={() => false}>
    <div className="ag-theme-quartz procurement-aggrid" style={{ height: gridHeight, width: '100%' }} onContextMenu={() => false}>
      {/* <div style={{ height: gridHeight, width: "100%", padding: "0 0 0 0", background: "#fff" }}>
        <div style={{ height: "100%", width: "100%" }}> */}

      <AgGridReact
        ref={ref}
        modules={gridModules}
        rowData={rowData}               // table data
        columnDefs={columnDefs}         // column config
        defaultColDef={defaultColDef}   // global column behavior
        rowSelection="multiple"         // enable multi-row selection
        suppressRowClickSelection={true} // checkbox-only selection
        suppressMovableColumns={false}   // columns can be rearranged
        suppressDragLeaveHidesColumns={true} // prevent dragging column outside grid
        pagination={pagination}               // enable pagination
        paginationPageSize={paginationPageSize}         // rows per page
        className="ag-theme-quartz"
        onSelectionChanged={onSelectionChanged}
        suppressRowHoverHighlight={suppressRowHoverHighlight}
        context={context}

        masterDetail={masterDetail}
        detailCellRenderer={detailCellRenderer}
        detailRowHeight={detailRowHeight}
        detailRowAutoHeight={detailRowAutoHeight}
        rowHeight={rowHeight}
        onRowClicked={props.onRowClicked}
        detailCellRendererParams={detailCellRendererParams}

      />
      {/* </div>
      </div> */}
    </div>
  );
});

CustomAgGrid.displayName = 'CustomAgGrid';

export default CustomAgGrid;
