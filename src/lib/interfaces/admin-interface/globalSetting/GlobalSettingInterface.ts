export interface DefaultSettingsModule {
  module: string;
  p_Index: number;
}

export interface DefaultSettingsSelectedModule {
  r_settings_id: number;
  r_key: string;
  r_value: string;
  r_status: boolean;
  r_description: string;
  r_input_fields: string;
}

export interface PreviewSelectedModule {
  id: number;
  form_name: string;
  report_name: string;
  category: string;
  report_header: string;
  report_doc_name: string;
  header_text: string;
  file_name: string;
  is_crystal_report: boolean;
  is_active: boolean;
}

export interface AddOnSelectedFormListDetail {
  id: number;
  p_index: number;
  modulename: string;
  c_index: number;
  formname: string;
  gc_index: number;
  keys: string;
  description: string;
  value: string;
  input_fields: string;
  is_active: boolean;
}

export interface PoleSetting {
  id: number;
  terminal_name: string;
  port_name: string;
  login_message: string;
  logout_message: string;
  status: boolean;
  time_stamp: string; 
  company_id: number | null; 
  branch_id: number | null; 
}

export interface GlobalSettings {
  default_Settings_Modules: DefaultSettingsModule[];
  default_Settings_Selected_Modules: DefaultSettingsSelectedModule[];
  preview_Module_Tab: String[];
  preview_Selected_Modules: PreviewSelectedModule[];
  add_On_Modules: DefaultSettingsModule[];
  add_On_Selected_FormList_Details: AddOnSelectedFormListDetail[];
  pole_Settings: PoleSetting[];
}