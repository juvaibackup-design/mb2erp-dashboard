import { Flex, Select } from "antd";
import InputComponent from "@/components/InputComponent/InputComponent";
import SelectComponent from "@/components/SelectComponent/SelectComponent";
import { useEffect, useState, useRef, forwardRef, Ref } from "react";
import "./DialCodeSelect.css";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import { useTranslation } from "react-i18next";

function DialCodeSelect(
  {
    formik,
    id,
    className,
    id1,
    className1,
    id2,
    className2,
    name1,
    name2,
    codeList,
    placeholder1,
    placeholder2,
    defaultCode,
    defaultValue,
    value1,
    value2,
    onChange1,
    onChange2,
    onSearch,
    style1,
    style2,
    label,
    isrequired,
  }: any,
  ref: Ref<any>
) {
  polyfillCountryFlagEmojis();
  const [localCodeList, setLocalCodeList] = useState<any>();
  // const randomNumber = useRef<number>(Math.floor(Math.random() * 1000000));
  const flexBoxRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const getLabelFromValue = (value: string, codeList: any) => {
    const option = codeList.find((opt: any) => opt.value === value);
    return option ? option.label : value;
  };

  function handlePhoneCodeChange(value: string, codeList: any) {
    if (formik) {
      formik.setFieldValue(name1, value.split(" ")[1]);
      formik.setFieldValue(
        "country",
        codeList.find((country: any) => country.value === value).id
      );
    }
    setTimeout(() => {
      const displaySelected = flexBoxRef?.current?.querySelector(
        ".ant-select-selection-item"
      );
      let labelArray = codeList
        ? getLabelFromValue(value, codeList).split(" ")
        : value;
      if (displaySelected) {
        displaySelected.setAttribute(
          "data-title",
          labelArray[0] + " " + labelArray[labelArray.length - 1] || ""
        );
      }
      let input = flexBoxRef?.current?.querySelector(
        "input"
      ) as HTMLInputElement;
      input?.blur();
      if (onChange1)
        onChange1(codeList.find((country: any) => country.value === value));
    }, 100);
  }

  function onChangePhoneNumber(value: string) {
    formik?.setFieldValue(name2, value);
    if (onChange2) onChange2(value);
  }

  function countryCodeToEmoji(countryCode: string) {
    if (countryCode == "AN") return countryCodeToEmoji("BQ");
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  useEffect(() => {
    if (codeList) {
      let codeList1 = codeList?.map((country: any) => ({
        value:
          country.value ??
          countryCodeToEmoji(country.short_name) + " " + country.code,
        label:
          countryCodeToEmoji(country.short_name) +
          " " +
          country.name +
          " +" +
          country.code,
        id: country.id,
      }));
      setLocalCodeList(codeList1);
      formik?.setFieldValue(
        "country",
        codeList1.find((country: any) => country.value === "🇮🇳 91").id
      );
      if (onChange1)
        onChange1(codeList1.find((country: any) => country.value === "🇮🇳 91"));
      //setTimeout(() => {
      const displaySelected = document.querySelector(
        ".ant-select-selection-item"
      );
      let labelArray = getLabelFromValue(
        formik?.values[name1] ?? defaultCode,
        codeList
      )?.split(" ");
      if (displaySelected && labelArray) {
        displaySelected.setAttribute(
          "data-title",
          labelArray[0] + " " + labelArray[labelArray.length - 1] || ""
        );
      }
      //}, 25);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeList]);

  return (
    <Flex vertical gap={8} style={{ flexGrow: 1 }}>
      {label && (
        <p className="label">
          <span className="error">{isrequired ? "* " : null}</span>
          {t(`${label}`)}
        </p>
      )}
      <div
        ref={flexBoxRef}
        id={id}
        className={"country-code-select" + (className ? className : "")}
        style={{ alignSelf: "stretch" }}
      >
        <SelectComponent
          ref={ref}
          showSearch
          // name={name1}
          placeholder={placeholder1}
          defaultValue={
            defaultCode || defaultValue ? defaultCode ?? defaultValue : null
          }
          id={id1}
          className={className1}
          popupClassName="country-code-select-dropdown"
          value={formik ? formik.values?.[name1] : undefined}
          optionFilterProp="label"
          onChange={(value) => handlePhoneCodeChange(value, localCodeList)}
          onSearch={onSearch}
          style={{ borderRadius: "6px 0 0 6px", ...style1 }}
          dropdownStyle={{ width: flexBoxRef?.current?.offsetWidth }}
          options={localCodeList}
          onBlur={(event) => {
            if (formik) {
              formik.setFieldTouched(name1, true);
              formik.handleBlur(event);
            }
          }}
          errormsg={
            formik ? formik.touched?.[name1] && formik.errors?.[name1] : null
          }
          isrequired={isrequired ?? false}
        />
        <InputComponent
          type="text"
          placeholder={placeholder2}
          id={id2}
          className={className2}
          name={name2}
          value={formik ? formik.values?.[name2] : undefined}
          onChangeEvent={(event) => {
            const numbersOnly = event.target.value.replace(/\D/g, "");
            // onChangePhoneNumber(event.target.value)
            onChangePhoneNumber(numbersOnly);
          }}
          style={{ borderRadius: "0 6px 6px 0", ...style2 }}
          onBlur={(event: any) => (formik ? formik.handleBlur(event) : {})}
          errormsg={
            formik ? formik.touched[name2] && formik.errors[name2] : null
          }
          isrequired={isrequired ?? false}
          maxLength={10}
        />
      </div>
    </Flex>
  );
}

export default forwardRef(DialCodeSelect);
