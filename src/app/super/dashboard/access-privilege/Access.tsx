"use client";

import React, { useEffect, useState } from "react";
import { Tabs, Flex } from "antd";
import { useRouter } from "next/navigation";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import styles from "./Access.module.css";
import AccountMaster from "./tabContent/AccountMaster";
import Toast from "@/components/CustomToast/Toast";
import { makeSuperAPICall } from "@/lib/helpers/apiHandlers/superapi";

export type FormRow = {
  form_id: number;
  form_name: string;
  c_index: number;
  p_index: number;

  gc_index: number;
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  roleId: number;
  typeId: number;
  createdBy: string;
};

export type ModuleRow = {
  p_index: number;
  module_name: string;
  forms: FormRow[];
};

interface AccessProps {
  accessPrivilegeData: any[];
  roleId: number;
}

const buildModules = (
  data: any[],
  roleId: number
): ModuleRow[] => {
  const map: Record<number, ModuleRow> = {};

  data.forEach((row) => {
    if (!map[row.pIndex]) {
      map[row.pIndex] = {
        p_index: row.pIndex,
        module_name: row.moduleName,
        forms: [],
      };
    }

    map[row.pIndex].forms.push({
      form_id: row.formId,
      form_name: row.formName,
      c_index: row.cIndex,
      p_index: row.pIndex,
      gc_index: row.gcIndex,
      view: row.view,
      add: row.add,
      edit: row.edit,
      delete: row.delete,
      roleId,
      typeId: row.typeId,
      createdBy: row.createdBy,
    });
  });

  return Object.values(map).sort(
    (a, b) => a.p_index - b.p_index
  );
};

export default function Access({
  accessPrivilegeData,
  roleId,
}: AccessProps) {
  const router = useRouter();

  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [activeKey, setActiveKey] = useState<string>("");
  const [notificationDisplayed, setNotificationDisplayed] =
    useState(false);

  useEffect(() => {
    if (!accessPrivilegeData?.length || !roleId) return;

    const result = buildModules(accessPrivilegeData, roleId);

    setModules(result);
    setActiveKey(String(result[0]?.p_index));
  }, [accessPrivilegeData, roleId]);

  const updateModule = (
    moduleName: string,
    forms: FormRow[]
  ) => {
    setModules((prev) =>
      prev.map((m) =>
        m.module_name === moduleName
          ? { ...m, forms }
          : m
      )
    );
  };

  const handleSave = async () => {
    const payload = modules.flatMap((m) =>
      m.forms.map((f) => ({
        roleId: f.roleId,
        pIndex: m.p_index,
        cIndex: f.c_index,
        gcIndex: f.gc_index,
        view: f.view,
        add: f.add,
        edit: f.edit,
        delete: f.delete,
        allowAll:
          f.view &&
          f.add &&
          f.edit &&
          f.delete,
        typeId: f.typeId,
        createdBy: f.createdBy,
      }))
    );

    console.log("SAVE PAYLOAD:", payload);

    try {
      const res = await makeSuperAPICall.post(
        "AgentMenuSaveAccess",
        payload
      );

      if (res?.data?.status === "success") {
        setNotificationDisplayed(true);
      } else {
        console.error(
          "Save failed:",
          res?.data?.errordescription
        );
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const items = modules.map((m) => ({
    key: String(m.p_index),
    label: m.module_name,
    children: (
      <AccountMaster
        moduleName={m.module_name}
        roleId={roleId}
        data={m.forms.map((f) => ({
          id: f.form_id,
          name: f.form_name,
          roleId: f.roleId,
          typeId: f.typeId,
          c_index: f.c_index,
          gc_index: f.gc_index,
          view: f.view,
          add: f.add,
          edit: f.edit,
          delete: f.delete,
          p_index: f.p_index,
          allowAll:
            f.view &&
            f.add &&
            f.edit &&
            f.delete,
          createdBy: f.createdBy,
        }))}
        onChange={(payload) => {
          updateModule(
            payload.module_name,
            payload.forms.map((u: any) => ({
              form_id: u.id,
              form_name: u.name,
              roleId: u.roleId,
              typeId: u.typeId,
              c_index: u.c_index,
              gc_index: u.gc_index,
              p_index: u.p_index,
              view: u.view,
              add: u.add,
              edit: u.edit,
              delete: u.delete,
              createdBy: u.createdBy,
            }))
          );
        }}
      />
    ),
  }));


  return (
    <>
      <Tabs
        items={items}
        activeKey={activeKey}
        tabPosition="left"
        className="modules"
        onChange={setActiveKey}
        tabBarExtraContent={{
          left: (
            <span className={styles.title}>
              Modules
            </span>
          ),
        }}
        style={{ height: "100%" }}
      />

      <div className={styles.footer}>
        <Flex gap={8} justify="end">
          <ButtonComponent
            onClickEvent={() => router.back()}
            type="link"
            style={{ color: "red", width: "115px" }}
          >
            Cancel
          </ButtonComponent>

          <ButtonComponent
            type="primary"
            style={{ width: "115px" }}
            onClickEvent={handleSave}
          >
            Save
          </ButtonComponent>
        </Flex>
      </div>

      {notificationDisplayed && (
        <Toast
          message="Access Privilege saved successfully"
          delay={2000}
        />
      )}
    </>
  );
}
