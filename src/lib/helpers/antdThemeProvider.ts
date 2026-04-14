import { ThemeConfig } from "antd";

export const antdThemeProvider: ThemeConfig = {
  components: {
    Button: {
      colorPrimary: "#0D39FE",
      algorithm: true,
      colorPrimaryHover: "#5D7BFE",
      colorPrimaryActive: "#0124C8",
      colorPrimaryText: "#FFFFFF",
      colorPrimaryTextHover: "#FFFFFF",
      borderRadius: 2,
      defaultBorderColor: "#0D39FE",
      defaultColor: "#0D39FE",
      colorText: "#0D39FE",
      colorBgTextHover: "#bebebe40",
      colorBgTextActive: "#bebebe40",
    },
    Switch: {
      colorPrimary: "#0D39FE",
    },
    Checkbox: {
      colorPrimary: "#52C41A",
      colorPrimaryHover: "#52C41A",
    },
    Radio: {
      buttonCheckedBg: "#0D39FE",
      buttonSolidCheckedBg: "#0D39FE",
      borderRadius: 2,
    },
    Select: {
      optionActiveBg: "#c7d2ff",
    },
    Drawer: {
      padding: 20,
      paddingLG: 20,
    },
    Modal: {
      padding: 40,
      paddingLG: 40,
    },
  },
};
