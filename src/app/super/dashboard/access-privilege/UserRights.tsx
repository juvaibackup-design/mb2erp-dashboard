import { Collapse, Flex, Tabs } from "antd";
import React, { useContext, useEffect, useState } from "react";
import styles from "./Access.module.css";
import PointOfSale from "./tabContent/PointOfSale";
import WholeSale from "./tabContent/WholeSale";
import Reports from "./tabContent/Reports";
import Finance from "./tabContent/Finance";
import CheckboxComponent from "@/components/CheckboxComponent/CheckboxComponent";
import Inventory from "./tabContent/Inventory";
import Procurement from "./tabContent/Procurement";
import { UserRightsInterface } from "@/lib/interfaces/admin-interface/userRights";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import makeApiCall from "@/lib/helpers/apiHandlers/api";
import Toast from "@/components/CustomToast/Toast";
import { getBranchIdByHeader } from "@/lib/helpers/getCookiesClient";
import { tagRevalidate } from "@/lib/helpers/serverActions";
import { useTranslation } from "react-i18next";
import SelectComponent from "@/components/SelectComponent/SelectComponent";
import useIsMobile from "@/lib/customHooks/useIsMobile";

export default function UserRights({
  userRightsData,
  roleWiseData,
  isActive,
  access,
  setAccess,
}: any) {
  const { t } = useTranslation();
  const params = useParams();
  const [userRights, setUserRights] = useState(userRightsData);
  const [data, setData] = useState<UserRightsInterface>({});
  const [notificationDisplayed, setNotificationDisplayed] = useState(false);
  const [module, setModule] = useState("1");
  const isMobile = useIsMobile();
  console.log("data::", data, userRights);
  const router = useRouter();
  const initialData: UserRightsInterface = {
    id: 0,
    group_code: params.id,
    pos_allow_manual_memo_disc: false,
    pos_allow_hold_memo: false,
    pos_allow_item_disc: false,
    pos_allow_promo_item_return: false,
    pos_allow_drawer_view: false,
    pos_allow_lookup: false,
    pos_allow_customer_ledger: false,
    pos_allow_tender_amount: false,
    pos_allow_negative_memo: false,
    pos_allow_non_barcoded_price_changes: false,
    pos_generate_serial_no_userwise: false,
    pos_allow_authorization: false,
    pos_allow_rate_change: false,
    pos_allow_service_memo_rate_change: false,
    pos_allow_advance_print_receipt: false,
    pos_allow_stockpoint_changes: false,
    pos_allow_multi_salesman_tagging: false,
    pos_allow_salesman_tagging: false,
    pos_round_off: 0,
    pos_cash_memo_copies: 0,
    pos_max_disc_percent: 0,
    pos_max_disc_amount: 0,
    pos_cm_back_date_days: 0,
    pos_price_override: false,
    pos_return_memo_selection: 0,
    pos_allow_credit_advance_system: false,
    pos_allow_promoview: false,
    pos_return_memo_mode: 0,
    pos_return_memo_copies: 0,
    pos_rm_back_date_days: 0,
    pos_return_memo_for_cm_allowed_days: 0,
    pos_return_adj_allowed_days: 0,
    pos_non_sale_item: false,
    stockpoint_id: 0,
    pos_teller_summary: false,
    pos_cancel_ds: false,
    pos_cancel_cash_memo: false,
    pos_cancel_return_memo: false,
    pos_modify_ds: false,
    pos_modify_cash_memo: false,
    pos_modify_return_memo: false,
    pos_sales_margin_percent: 0,
    pos_exclusive_of_tax: false,
    pos_allow_multi_price: false,
    pos_allow_multi_currency: false,
    pos_reprint_days: 0,
    pos_color1: "255,255,255",
    pos_color2: "255,255,255",
    pos_color3: "255,255,255",
    pos_color_apply: false,
    pos_ds_color1: "255,255,255",
    pos_ds_color2: "255,255,255",
    pos_ds_color3: "255,255,255",
    pos_ds_color_apply: false,
    pos_against_cash_color1: "255,255,255",
    pos_against_cash_color2: "255,255,255",
    pos_against_cash_color3: "255,255,255",
    pos_against_cash_color_apply: false,
    pos_posr_color1: "255,255,255",
    pos_posr_color2: "255,255,255",
    pos_posr_color3: "255,255,255",
    pos_posr_color_apply: false,
    pos_member_no_edit: false,
    pos_member_tagging: false,
    pos_ret_ref_mandatory: false,
    inv_allow_user_to_activate_stock_audit: false,
    inv_allow_user_to_verify_stock_audit: false,
    inv_allow_user_to_complete_stock_audit: false,
    inv_category1: false,
    inv_category2: false,
    inv_category3: false,
    inv_category4: false,
    inv_category5: false,
    inv_category6: false,
    fin_post: false,
    inv_category7: false,
    inv_category8: false,
    inv_category9: false,
    inv_category10: false,
    inv_category11: false,
    inv_category12: false,
    inv_category13: false,
    inv_category14: false,
    inv_category15: false,
    inv_category16: false,
    inv_dept_code: false,
    inv_set_code: false,
    inv_item_code: false,
    inv_customize: false,
    ws_dc_price_edit: false,
    rep_period_restriction: false,
    rep_period_days: 0,
    pos_points_voucher: false,
    inv_allow_margin_rule_edit: false,
    inv_allow_eway_mandatory: false,
    pos_print_based_on: 0,
    proc_restrict_grn: false,
    proc_restrict_dc: false,
    proc_restrict_pi: false,
    proc_restrict_si: false,
    proc_restrict_dn: false,
    proc_restrict_cn: false,
    pos_block_member_create: 0,
    pos_max_less_qty: 0,
    pos_allow_wsp: false,
    pos_wsp_validation_mandatory: false,
    pos_reprint_count: 0,
    ws_salesman_mandatory: false,
    rep_allow_mw_dashboard: false,
    pos_max_amount: 0,
    inv_out_stkpt_list: 0,
    inv_allow_receive_all: false,
    msd_allow_receive_all: false,
    inv_show_inventory_cat: false,
    fin_back_entry_days: 0,
    company_id: getBranchIdByHeader("companyId"),
    branch_id: getBranchIdByHeader("companyId"),
  };

  useEffect(() => {
    if (roleWiseData?.length === 1) {
      const value =
        (roleWiseData?.[0]?.inv_out_stkpt_list ?? "").split(",").length > 1
          ? (roleWiseData?.[0]?.inv_out_stkpt_list ?? "")
            .split(",")
            .map((data: UserRightsInterface) => data.trim())
          : [roleWiseData?.[0]?.inv_out_stkpt_list ?? ""];

      const isEmptyArray =
        value?.length === 1 && value?.[0] === "" ? undefined : value;
      setData({
        ...roleWiseData?.[0],
        inv_out_stkpt_list: isEmptyArray,
      });
    } else {
      setData(initialData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (name: string, value: boolean) => {
    setData({ ...data, [name]: value });
  };
  console.log("userRights", userRights);
  const items = [
    {
      key: "1",
      label: "Point of Sales",
      children: (
        <PointOfSale
          data={data}
          setData={setData}
          roundOff={userRights?.poS_Roundoff}
          returnMemoSelection={userRights?.posReturnMemoSelection}
          returnMemoMode={userRights?.posReturnMemoMode}
          pointsBasedOn={userRights?.posPointsBasedOn}
          blockMember={userRights?.dtCardType}
          transactionHistory={userRights?.posTransaactionHistoryDropDown}
        />
      ),
    },
    {
      key: "2",
      label: "Procurement",
      children: <Procurement data={data} setData={setData} />,
    },
    {
      key: "3",
      label: "Inventory",
      children: (
        <Inventory
          data={data}
          setData={setData}
          stockPoint={userRights?.stockPoint}
        />
      ),
    },
    {
      key: "4",
      label: "Multi Store Distribution",
      children: (
        <Collapse
          collapsible="header"
          defaultActiveKey={["1"]}
          items={[
            {
              key: "1",
              label: "Security",
              children: (
                <Flex vertical>
                  <CheckboxComponent
                    checked={data.msd_allow_receive_all}
                    onChange={(e) =>
                      handleChange("msd_allow_receive_all", e.target.checked)
                    }
                  >
                    {t("Allow receive all")}
                  </CheckboxComponent>
                </Flex>
              ),
            },
          ]}
        />
      ),
    },
    {
      key: "5",
      label: "Finance",
      children: <Finance data={data} setData={setData} />,
    },
    {
      key: "6",
      label: "Reports",
      children: <Reports data={data} setData={setData} />,
    },
    {
      key: "7",
      label: "Sale",
      children: <WholeSale data={data} setData={setData} />,
    },
  ];

  const onChange = (key: string) => {
    console.log(key);
  };

  const handleSubmit = async () => {
    let convertToString;
    if (Array.isArray(data?.inv_out_stkpt_list)) {
      convertToString = data?.inv_out_stkpt_list.join();
    } else if (data?.inv_out_stkpt_list === undefined) {
      convertToString = 0;
    }
    const postData = {
      ...data,
      inv_out_stkpt_list: convertToString,
    };
    try {
      // Loader?.setLoader(true);
      const response = await makeApiCall.post(
        `PostUserRightsSummaryInfo`,
        postData
      );
      if (response.data.code === 200) {
        tagRevalidate("userRights");
        setNotificationDisplayed(true);
        setTimeout(() => {
          setNotificationDisplayed(false);
        }, 3000);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      // Loader?.setLoader(false);
    }
  };

  const handleCancel = () => {
    router.push(`/super/dashboard/access-privilege`);
  };

  const moduleOptions = [
    {
      label: "Point of Sales",
      value: "1",
    },
    {
      label: "Procurement",
      value: "2",
    },
    {
      label: "Inventory",
      value: "3",
    },
    {
      label: "Multi Store Distribution",
      value: "4",
    },
    {
      label: "Finance",
      value: "5",
    },
    {
      label: "Reports",
      value: "6",
    },
    {
      label: "WholeSale",
      value: "7",
    },
  ];

  return (
    <>
      {isMobile && (
        <SelectComponent
          className="fullWidth"
          value={module}
          onChange={(value: string) => setModule(value)}
          options={moduleOptions}
          style={{ marginBottom: "1rem" }}
        />
      )}
      <div className={isMobile ? styles.mobileSubLayout : styles.subLayout}>
        {isMobile ? (
          <div>
            {module === "1" && (
              <PointOfSale
                data={data}
                setData={setData}
                roundOff={userRights?.poS_Roundoff}
                returnMemoSelection={userRights?.posReturnMemoSelection}
                returnMemoMode={userRights?.posReturnMemoMode}
                pointsBasedOn={userRights?.posPointsBasedOn}
                blockMember={userRights?.dtCardType}
                transactionHistory={userRights?.posTransaactionHistoryDropDown}
              />
            )}
            {module === "2" && <Procurement data={data} setData={setData} />}
            {module === "3" && (
              <Inventory
                data={data}
                setData={setData}
                stockPoint={userRights?.stockPoint}
              />
            )}
            {module === "4" && (
              <Collapse
                collapsible="header"
                defaultActiveKey={["1"]}
                items={[
                  {
                    key: "1",
                    label: "Security",
                    children: (
                      <Flex vertical>
                        <CheckboxComponent
                          checked={data.msd_allow_receive_all}
                          onChange={(e) =>
                            handleChange(
                              "msd_allow_receive_all",
                              e.target.checked
                            )
                          }
                        >
                          Allow receive all
                        </CheckboxComponent>
                      </Flex>
                    ),
                  },
                ]}
              />
            )}
            {module === "5" && <Finance data={data} setData={setData} />}
            {module === "6" && <Reports data={data} setData={setData} />}
            {module === "7" && <WholeSale data={data} setData={setData} />}
          </div>
        ) : (
          <Tabs
            items={items}
            tabPosition="left"
            className="modules"
            onChange={onChange}
            rootClassName="ow-user-rights-tab"
            tabBarExtraContent={{
              left: <span className={styles.title}>Modules</span>,
            }}
          />
        )}
      </div>
      <div className={styles.footer}>
        <Flex gap={8} justify="end">
          <ButtonComponent
            onClickEvent={handleCancel}
            type="link"
            style={{ color: "red", width: "115px" }}
          >
            {t("Cancel")}
          </ButtonComponent>
          <ButtonComponent
            type="primary"
            style={{ width: "115px" }}
            onClickEvent={handleSubmit}
            // disabled={!isActive || !access?.is_edit}
          >
            {t("Save")}
          </ButtonComponent>
        </Flex>
      </div>
    </>
  );
}
