export interface CustomField {
  id: string;
  name: string;
  type: 'Dropdown (Single)' | 'Dropdown (Multiple)' | 'Text' | 'Number';
  options: string[];
  required: boolean;
}
