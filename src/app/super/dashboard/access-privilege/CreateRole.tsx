import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
import ModalComponent from "@/components/ModalComponent/ModalComponent";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import styles from "./Access.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Divider, Flex, Space, type InputRef } from "antd";
import InputComponent from "@/components/InputComponent/InputComponent";
import SelectComponent from "@/components/SelectComponent/SelectComponent";
import { makeSuperAPICall } from "@/lib/helpers/apiHandlers/superapi";
import { tagRevalidate } from "@/lib/helpers/serverActions";
import _ from "lodash";
import { LoaderContext } from "@/lib/interfaces/Context.interfaces";
import ConfirmModal from "@/components/ModalComponent/ConfirmModal";
import { showAlert } from "@/lib/helpers/alert";

interface AccessPrivilege {
  openDrawer: boolean;
  setOpenDrawer: Function;
  rowData?: any;
  title: string;
  buttonLabel: string;
  showNotification: Function;
  access: any;
  setAccess: Function;
  userList?: any;
  type?: any;
  roleList?: any;
  roleNameRef?: any;
  userRef?: any;
  userRoleRef?: any;
  resetModalRef?: any;
  createModalRef?: any;
}

type CreateRoleProps = AccessPrivilege;

export default function CreateRole({
  openDrawer,
  setOpenDrawer,
  rowData,
  title,
  buttonLabel,
  showNotification,
  access,
  setAccess,
  userList,
  type,
  roleList,
  roleNameRef,
  userRef,
  userRoleRef,
  resetModalRef,
  createModalRef,
}: CreateRoleProps) {
  const inputref = useRef<InputRef>(null);
  // const Loader = useContext(LoaderContext);
  const [refKey, setRefKey] = useState(0);
  const [isConfirmModal, setIsConfirmModal] = useState<boolean>(false);
  const [formDirty, setFormDirty] = useState<boolean>(false);
  const isEdit = Boolean(rowData?.id);
  const Loader = useContext(LoaderContext);
  const [formOpen, setFormOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);

  const normalizeRoleName = (name: string = "") =>
    name.trim().replace(/\s+/g, " ").toLowerCase();

  const existingRoleNames = useMemo(() => {
    if (!Array.isArray(roleList)) return [];

    return roleList
      .filter((r: any) => {
        if (isEdit) {
          return r.id !== rowData?.id && r.id !== rowData?.roleId;
        }
        return true;
      })
      .map((r: any) => normalizeRoleName(r.roleName));
  }, [roleList, rowData, isEdit]);



  const validationSchema = Yup.object({
    roleName: Yup.string()
      .transform((value) => value?.trim())
      .required("Role name is required")
      .max(50, "Role name should not exceed 50 characters")
      .test(
        "no-duplicate-role",
        "Role name already exists",
        function (value) {
          if (!value) return true;

          const normalized = normalizeRoleName(value.trim());
          return !existingRoleNames.includes(normalized);
        }
      ),

    users: Yup.array()
      .of(Yup.number())
      .min(1, "At least one user must be selected")
      .required("Users are required"),
  });


  const mapUserNamesToIds = (users: any[], userList: any[]) => {
    if (!Array.isArray(users)) return [];

    return users
      .map((u) => {
        // if already a number, keep it
        if (typeof u === "number") return u;

        // if string → find matching user
        const match = userList.find(
          (user) => user.userName === u || user.loginName === u
        );

        return match?.id;
      })
      .filter(Boolean);
  };


  const initialValues = useMemo(
    () => ({
      roleName: rowData?.roleName || "",
      // users: rowData?.users || [],
      users: isEdit
        ? mapUserNamesToIds(rowData?.users || [], userList)
        : [],

      copy_from: "",
      roleId: rowData?.roleId || 0,
    }),
    [rowData]
  );


  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,


    onSubmit: async (values: any) => {
      try {
        // if (!values.users || values.users.length === 0) {
        //   showAlert("At least one user must be selected");
        //   return;
        // }



        // 👉 CREATE ROLE
        if (!isEdit) {
          await makeSuperAPICall.post("PostCreateRole", {
            roleName: values.roleName.trim(),
            userIds: values.users,
          });
        }

        // 👉 UPDATE ROLE
        else {
          await makeSuperAPICall.post("PostUpdateRole", {
            roleId: rowData.roleId ?? rowData.id,
            roleName: values.roleName.trim(),
            userIds: values.users,
            isActive: true,
          });
        }

        tagRevalidate("accessData");
        showNotification(true);
        setOpenDrawer(false);
      } catch (error) {
        console.error(error);
        showAlert("Something went wrong");
      }
    }



  });


  useEffect(() => {
    if (openDrawer) {
      inputref.current?.focus();
    }
    if (!openDrawer) {
      setRefKey((prevKey) => prevKey + 1);
    }
  }, [openDrawer, inputref]);

  useEffect(() => {
    setFormDirty(formik.dirty);
  }, [formik.dirty]);


  useEffect(() => {
    if (openDrawer !== true) {
      formik.resetForm();
    }
  }, [openDrawer]);

  const onClose = () => {
    if (formDirty) {
      setIsConfirmModal(true);
    } else {
      setIsConfirmModal(false);
      setOpenDrawer(false);
    }
  };

  const handleReset = () => {
    formik.setValues({
      roleName: rowData.roleName,
      // users: rowData?.users || [],
      users: mapUserNamesToIds(rowData?.users || [], userList),
      copy_from: rowData.copy_from,
    });
  };

  const userOptions = userList.map((u: any) => ({
    value: u.id,
    label: u.userName,
  }));

  const roleOptions = roleList.map((r: any) => ({
    value: r.id,
    label: r.roleName,
  }));

  const handleSelectAll = () => {
    if (formik.values.users.length === userOptions.length) {
      formik.setFieldValue("users", []);
      return;
    }
    formik.setFieldValue(
      "users",
      userOptions.map((u: any) => u.value)
    );
  };

  const footerContent = (
    <div style={{ display: "flex", justifyContent: "end" }}>
      <ButtonComponent
        type="text"
        className={styles.role_cancel_button}
        onClickEvent={() => setOpenDrawer(false)}
      >
        Cancel
      </ButtonComponent>

      <div ref={resetModalRef}>
        <ButtonComponent
          type="text"
          onClickEvent={() => formik.resetForm()}
        >
          Reset
        </ButtonComponent>
      </div>

      <div ref={createModalRef}>
        <ButtonComponent
          type="primary"
          htmlType="submit"
          onClickEvent={() => formik.handleSubmit()}
          disabled={type == "Create" ? undefined : !access?.isEdit}
        // disabled={
        //   type == "create"
        //     ? !access?.isAdd
        //     : !access?.isEdit || (!rowData?.is_active && rowData !== undefined)
        //       ? true
        //       : false
        // }
        >
          {buttonLabel}
        </ButtonComponent>
      </div>
    </div>
  );

  // const savedValues = rowData?.users || [];
  const savedValues = isEdit
    ? mapUserNamesToIds(rowData?.users || [], userList)
    : [];


  // const [selectedValues, setSelectedValues] = useState(savedValues);

  // useEffect(() => {
  //   setSelectedValues(savedValues);
  // }, []);

  return (
    <>
      <ConfirmModal
        openModal={isConfirmModal}
        // onClose={onClose}
        onClose={() => {
          setIsConfirmModal(false);
          setTimeout(() => {
            setOpenDrawer(false);
            rowData ? handleReset() : formik.resetForm();
          }, 100);
        }}
        onCancel={() => setIsConfirmModal(false)}
      />
      <ModalComponent
        key={refKey}
        title={title}
        description="Add new role"
        showModal={openDrawer}
        setShowModal={setOpenDrawer}
        footer={footerContent}
        onClose={onClose}
      >
        <form onSubmit={formik.handleSubmit}>
          <Flex vertical gap={12}>
            <div ref={roleNameRef}>
              <InputComponent
                name="roleName"
                ref={inputref}
                type="text"
                autoFocus={true}
                maxLength={50}
                value={formik.values.roleName}
                onChangeEvent={formik.handleChange}
                isrequired
                label="Role Name"
                errormsg={formik.touched.roleName && formik.errors.roleName}
              />
            </div>
            <div ref={userRef}>
              <SelectComponent
                showSearch
                mode="multiple"
                label="Users"
                options={userOptions.map((option: any) => ({
                  ...option,
                  disabled:
                    // savedValues.includes(option.value) ||
                    option.remarks === "Primary Admin",
                }))}
                isrequired
                value={formik.values.users}
                placeholder="Select users"
                maxTagCount={4}
                // onChange={(value) =>
                //   formik.setFieldValue("users", value)
                // }
                // onChange={(value) => {
                //   const newSelections = Array.from(
                //     new Set([...savedValues, ...value])
                //   );
                //   setSelectedValues(newSelections);
                //   formik.setFieldValue("users", newSelections);
                // }}

                onChange={(value) => {
                  formik.setFieldValue("users", value);
                }}
                onBlur={() => formik.setFieldTouched("users", true)}
                errormsg={formik.touched.users && formik.errors.users}

                dropdownRender={(menu) => (
                  <>
                    <Space style={{ padding: "4px 8px" }}>
                      <Button type="text" onClick={handleSelectAll}>
                        {formik.values.users.length === userOptions.length
                          ? "Unselect All"
                          : "Select All"}
                      </Button>
                    </Space>
                    <Divider style={{ margin: "4px 0" }} />
                    {menu}
                  </>
                )}
              />
            </div>
            <div ref={userRoleRef}>
              <SelectComponent
                showSearch
                label="Copy From Existing Role"
                options={roleOptions}
                value={formik.values.copy_from}
                placeholder="Select"
                onChange={(value) =>
                  formik.setFieldValue("copy_from", value)
                }
              />
            </div>
          </Flex>
        </form>
      </ModalComponent>
    </>
  );
}
