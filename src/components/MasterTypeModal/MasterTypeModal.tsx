'use client';

import React from 'react';
import { Form, Input } from 'antd';
import ButtonComponent from '@/components/ButtonComponent/ButtonComponent';
import ModalComponent from '@/components/ModalComponent/ModalComponent';

interface MasterTypeModalProps {
  title: string;
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitText: string;
  form: any;
  nameLabel: string;
  onEdit?: (value: string) => void;
  isEditMode?: boolean;

}

const MasterTypeModal: React.FC<MasterTypeModalProps> = ({
  title,
  visible,
  onClose,
  onSubmit,
  submitText,
  form,
  nameLabel,
}) => {
  return (
    <ModalComponent
      title={title}
      showModal={visible}
      setShowModal={onClose}
      footer={
        <>
          <ButtonComponent type="text" onClickEvent={onClose}>
            Reset
          </ButtonComponent>

          <ButtonComponent type="primary" onClickEvent={onSubmit}>
            {submitText}
          </ButtonComponent>
        </>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={nameLabel}
          name="name"
          rules={[{ required: true, message: `Please enter ${nameLabel}` }]}
        >
          <Input placeholder={`Enter ${nameLabel?.toLowerCase()}`} />
        </Form.Item>

        <Form.Item
          label="Type Code"
          name="code"
          rules={[{ required: true, message: 'Please enter type code' }]}
        >
          <Input placeholder="Enter type code" />
        </Form.Item>
      </Form>
    </ModalComponent>
  );
};

export default MasterTypeModal;
