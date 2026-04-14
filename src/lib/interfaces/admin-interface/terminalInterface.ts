export interface terminal {
  r_id: number;
  r_terminal_name: string;
  r_prefix: string;
  r_dc_applicable: boolean;
  r_stockpoint_id: string;
  r_stockpoint_name: string;
  r_is_active: boolean;
  r_selection: boolean;
  r_branch_id: number;
  r_company_id: number;
  r_hand_over_select: boolean;
  r_against_cash: boolean;
  r_touch_pad: boolean;
  r_exchange_counter: boolean;
  r_terminal_type: string;
  r_device_id: string;
  r_resource_id: string;
  r_feedback_id: string;
  linked_device: string;
}

export interface feedbackList {
  r_feedback_id: number;
  r_feedback_name: string;
  r_group_type: string;
  r_view_type: string;
}
export interface stockPointList {
  r_stockpoint_id: number;
  r_stockpoint_name: string;
  r_stockpoint_type: string;
  r_selected: boolean;
}
export interface stockpoinType {
  stockpoint_type: string;
}

export interface terminalType {
  id: string;
  terminal_type: string;
}

export interface terminalResource {
  r_resource_id: number;
  r_resource_name: string;
  r_image_for: string;
}
export interface linkdevice {
  id: number;
  terminal_name: string;
  device_id: string;
}
export interface terminalData {
  data: {
    terminal: terminal[];
    stockPointList: stockPointList[]; // Replace with a specific type if possible
    feedbackList: feedbackList[];
    stockpoinType: stockpoinType[];
    terminalType: terminalType[];
    terminalResource: terminalResource[];
    linkdevice: linkdevice[]; // Replace with a specific type if possible
  };
}
