"use client";
import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import {
  RightOutlined,
  LeftOutlined,
  RightCircleFilled,
  BellOutlined,
  UserOutlined,
  HddOutlined,
  CustomerServiceOutlined,
  QuestionOutlined,
  InfoOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
  CrownOutlined
} from "@ant-design/icons";
import styles from "./SuperSidebar.module.css";
import Icons from "@/components/SideBar/SideMenuIcons/SideMenuIcons";
import {
  LoaderContext,
  SideBarStateContext,
  TabTrackContext,
  TranslationContext,
} from "@/lib/interfaces/Context.interfaces";
import Image from "next/image";
import { Button, Dropdown, Flex, Popover } from "antd";
import Cookies from "js-cookie";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import useKeyPress from "@/lib/customHooks/useKeyPress";
import { useRouter } from "next/navigation";
import { Menu } from "@/lib/constants/SideMenu";
import { useUserStore } from "@/store/userInfo/store";
import { useFormStore } from "@/store/formdirty/store";
import { urlList } from "./constants";
import { useLoginStore } from "@/store/login/store";
import ConfirmModal from "@/components/ModalComponent/ConfirmModal";
import SelectComponent from "@/components/SelectComponent/SelectComponent";
import DrawerComponent from "@/components/DrawerComponent/DrawerComponent";
import { useTabStore } from "@/store/report/tab/store";
import { Languages, Languages1 } from "@/lib/constants/dashboard";
import { useSuperUserStore } from "@/store/superuserinfo/store";

interface SideBarProps {
  setTrackMenu: Function;
  trackMenu: any[];
}

function SideBar({ setTrackMenu, trackMenu }: SideBarProps) {
  const { t } = useTranslation();
  const path = useContext(TabTrackContext);
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [altPressed, setAltPressed] = useState(false);
  const SidebarContext = useContext(SideBarStateContext);
  const [active, setActive] = useState<string | null>(null);

  const [isAltMPressed, setIsAltMPressed] = useState(false);
  const [isAltSubPressed, setIsAltSubPressed] = useState(false);
  const [hovered, setHovered] = useState<any>(null);
  // const [isHighlighted, setIsHighlighted] = useState(false);
  const [accessibleModule, setAccessibleModule] = useState<any[]>([]);

  const [popoverVisibility, setPopoverVisibility] = useState<{
    [key: string]: boolean;
  }>({});
  const LanguageContext = useContext(TranslationContext);
  const Loader = useContext(LoaderContext);
  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const { isTransactionDirty, setTransactionDirty } = useFormStore();
  const userDetails = useUserStore((state: any) => JSON.parse(state?.user));
  const [openDirtyModal, setOpenDirtyModal] = useState<boolean>(false);
  const [routePath, setRoutePath] = useState<string>("");
  const formDirty: boolean = useLoginStore((state: any) => state.formDirty);
  const setURLPath = useLoginStore().setURLPath;
  const setFormDirty: (fact: boolean) => void = useLoginStore(
    (state: any) => state.setFormDirty
  );

  useEffect(() => {
    // accessPrivilegeList

    setAccessibleModule(userDetails?.accessPrivilegeList);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails?.accessPrivilegeList?.length]);

  useEffect(() => {
    if (trackMenu?.length > 0) {
      Cookies.set("tabs", `${trackMenu}`);
      path?.setTrackMenu(trackMenu);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackMenu]);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const onMenuClick = (item: { name: string }) => {
    setIsAltMPressed(false);

    setActive(item.name);
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Escape") {
      resetState();
    }
  };

  const onSelectLanguage = (lng: any) => {
    localStorage.setItem("language", lng.key);
    LanguageContext?.setSelectedLang(lng.key);
  };

  const handleLanguageChange = (value: string) => {
    localStorage.setItem("language", value);
    LanguageContext?.setSelectedLang(value);
  };

  const name = userDetails?.userName;

  const words = name?.split(" "); // Split the string into words
  let result = "";

  if (words?.length === 1) {
    result = words[0].substring(0, 2).toUpperCase();
  } else {
    result = words?.map((word: string) => word[0].toUpperCase()).join("");
  }

  const handleLogout = () => {
    // const token: any = Cookies.get("token");
    // const signOut = logout(token);
    // signOut
    //   .then((response) => {
    //     if (response.status === 200) {
    //       Cookies.remove("token");
    //       Cookies.remove("userDetails");
    //       router.push("/");
    //       Loader?.setLoader(false);
    //     }
    //   })
    //   .catch((err) => {
    //     Loader?.setLoader(false);
    //   });

    // setTimeout(() => {
    Loader?.setLoader(true);
    // Cookies.set("AccessSuper", "false");
    Cookies.set("superToken", "");
    Loader?.setLoader(false);
    // }, 2000);
    setURLPath("/super/dashboard");
    router.push("/super");

       useSuperUserStore.setState({
          user: null,
        });

    // const event = new Event(CONSTANT.LOGOUT);
    // window.dispatchEvent(event);
  };

  // const transformMenu = accessibleModule?.reduce((acc, current) => {
  //   const menuName = current.menu_name;
  //   const formName = current.form_name;

  //   const menu = acc.find((menu: any) => menu.name === menuName);
  //   if (!menu) {
  //     acc.push({ name: menuName, sub: [] });
  //   } else {
  //   }

  //   console.log("acc1", current);
  //   acc.find((menu: any) => menu.name === menuName).sub.push(formName);

  //   return acc;
  // }, []);

  const transformMenu = useMemo(() => {
    return [
      {
        menu: {
          icon: <HddOutlined className={styles.moduleIcon} />,
          name: "Tenant",
          url: "/super/dashboard/tenant",
        },
      },
      {
        menu: {
          icon: <WarningOutlined className={styles.moduleIcon} />,
          name: "Exceptions",
          url: "/super/dashboard/exception",
        },
      },
      {
        menu: {
          icon: <UserOutlined className={styles.moduleIcon} />,
          name: "Users",
          url: "/super/dashboard/user",
        },
      },
      {
        menu: {
          icon: <SafetyCertificateOutlined className={styles.moduleIcon} />,
          name: "Access Privilege",
          url: "/super/dashboard/access-privilege",
        },
      },
      {
        menu: {
          icon: <CrownOutlined className={styles.moduleIcon} />,
          name: "Package",
          url: "/super/dashboard/package",
        },
      },
      {
        menu: {
          icon: <CustomerServiceOutlined className={styles.moduleIcon} />,
          name: "Support",
          url: "/super/dashboard/support",
        },
      },
      {
        menu: {
          icon: <InfoCircleOutlined className={styles.moduleIcon} />,
          name: "FAQ",
          url: "/super/dashboard/faq",
        },
      },
      // { menu: { name: "Activation", url: "/super/dashboard/activation" } },
    ];
  }, []);
  const onSubMenuClick = (menu: string, sub: string, e: React.MouseEvent) => {
    console.log("transformMenu", transformMenu);
    console.log("urlList?.[2]?.[11]", urlList?.[2]);
    if (isTransactionDirty) {
      const confirmation = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page?"
      );
      console.log("confirmation", confirmation);
      if (!confirmation) {
        e.preventDefault(); // Prevent routing if the user cancels the confirmation

        return; // If the user doesn't confirm, do nothing
      } else {
        setTransactionDirty(false); // Reset dirty state after confirmation
      }
    }

    const lowerCaseSubItem = sub.toLowerCase();
    const combinedItem = `${menu}-${sub}`; // Combine menu and submenu

    path?.setCurrentActiveMenu(lowerCaseSubItem);

    setTrackMenu((prev: any) => {
      const newEntry = { menu, sub };
      const updatedTrackMenu = Array.isArray(prev) ? [...prev] : [];
      if (!updatedTrackMenu.includes(combinedItem)) {
        updatedTrackMenu.push(combinedItem);
      }
      return updatedTrackMenu;
    });

    path?.setCurrentActiveMenu(menu);
  };

  // const onSubMenuClick = (item: any) => {
  //   const lowerCaseItem = item.toLowerCase();
  //   path?.setCurrentActiveMenu(lowerCaseItem);

  //   setTrackMenu((prev: any) => {
  //     // Ensure 'prev' is an array before performing the spread operation
  //     const updatedTrackMenu = Array.isArray(prev) ? [...prev] : [];
  //     if (!updatedTrackMenu.includes(item)) {
  //       updatedTrackMenu.push(item);
  //     }
  //     return updatedTrackMenu;
  //   });

  //   path?.setCurrentActiveMenu(active);
  // };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetState = () => {
    setPopoverVisibility({
      Retail: false,
      Procurement: false,
      Inventory: false,
      Admin: false,
      Production: false,
      HRMS: false,
      Notification: false,
      Reports: false,
      Utilities: false,
      Distribution: false,
    });
    setActive(null);
    setIsAltMPressed(false);
    setIsAltSubPressed(false);
  };

  useEffect(() => {
    const handleAltKey = (event: any) => {
      if (event.key === "Alt") {
        setAltPressed(event.type === "keydown");
      }
    };

    globalThis.window.addEventListener("keydown", handleAltKey);
    globalThis.window.addEventListener("keyup", handleAltKey);

    return () => {
      globalThis.window.removeEventListener("keydown", handleAltKey);
      setAltPressed(false); // Reset altPressed on component unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validTabs = [
    "Inventory",
    "Admin",
    "Retail",
    "Distribution",
    "Production",
    "Sales",
    "Forecasting",
    "Finance",
    "Reports",
    "Utilities",
    "Notification",
    "HRMS",
  ];

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      // Check if the click is outside the button
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        resetState();
      }
    };

    // Attach the event listener to the document body
    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetState]);

  const onClickFormInstance = (sub: any) => {
    router.push(
      sub.split(" ").length > 1
        ? `/dashboard/${active?.toLocaleLowerCase()}-${sub
          .split(" ")
          .join("")
          .toLocaleLowerCase()}?as=form`
        : `/dashboard/${active?.toLocaleLowerCase()}-${sub.toLocaleLowerCase()}?as=form`
    );
  };

  useEffect(() => {
    if (SidebarContext?.collapse)
      document.querySelector(".sb-main")?.classList.remove("sidebar");
    else document.querySelector(".sb-main")?.classList.add("sidebar");
  }, [SidebarContext?.collapse]);

  useEffect(() => {
    if (!Cookies.get("superToken"))
      router.push("/super");
  }, [Cookies.get("superToken")]);

  return (
    <div style={{ height: "100vh", zIndex: 4 }}>
      <div
        className={
          !SidebarContext?.collapse
            ? styles.sidenav_container_collapsed
            : styles.sidenav_container_uncollapsed
        }
        style={{
          width: !SidebarContext?.collapse ? "175px" : "65px",
          height: "100%",
        }}
      >
        <ConfirmModal
          openModal={openDirtyModal}
          onClose={() => {
            setFormDirty(false);
            setOpenDirtyModal(false);
            router.push(routePath);
          }}
          onCancel={() => {
            setOpenDirtyModal(false);
          }}
        />
        <div className={styles.sub_top}>
          <Image
            width={24}
            height={24}
            src={"/assets/icube_logo.png"}
            alt="icube_logo"
            unoptimized={true}
            unselectable="off"
            blurDataURL={"/assets/icube_logo.png"}
          />
          {!SidebarContext?.collapse && (
            <Image
              src={"/assets/icube_font.png"}
              alt="icube_font"
              className={styles.icubeFont}
              width={50}
              height={15}
              unselectable="off"
              blurDataURL={"/assets/icube_font.png"}
            />
          )}
          <button
            className={
              !SidebarContext?.collapse ? styles.collapsed : styles.uncollapsed
            }
            onClick={() => {
              SidebarContext?.setCollapse(!SidebarContext?.collapse);
              resetState();
            }}
            style={{ cursor: "pointer" }}
          >
            {SidebarContext?.collapse ? (
              <RightOutlined className={styles.chevron} />
            ) : (
              <LeftOutlined className={styles.chevron} />
            )}
          </button>
        </div>
        <div className={styles.scroll}>
          {transformMenu?.map((each: any, index: any) => {
            {
              /* {transformMenu.map((each: any, index: any) => { */
            }
            const firstLetter = t(each.menu.name).charAt(0);
            // Get the rest of the name (excluding the first letter)
            const restOfName = t(each.menu.name).slice(1);
            // const restOfName = t(each.menu_name).slice(1);
            return (
              <div className={styles.iterateItem} key={index}>
                <Popover
                  placement="rightTop"
                  trigger="click"
                  open={popoverVisibility[each.menu.name]}
                  onOpenChange={(visible) =>
                    setPopoverVisibility((prev) => ({
                      ...prev,
                      [each.menu.name]: visible,
                    }))
                  }
                  rootClassName="ow-popover-panel"
                >
                  <Button
                    ref={buttonRef}
                    id={each.menu.name}
                    onClick={() => {
                      // onMenuClick(each.url);
                      router.push(each.menu.url);
                      SidebarContext?.setCollapse(true);
                    }}
                    onKeyDown={handleKeyDown}
                    style={{
                      background:
                        active === each.menu.name
                          ? "linear-gradient(180deg, #6B86FC 0%, #274FFF 100%)"
                          : "",
                      // justifyContent: SidebarContext?.collapse ? "center" : "",
                      justifyContent: SidebarContext?.collapse ? "center" : "flex-start",
                    }}
                    className={styles.menuBtn}
                  >

                    <span className={styles.moduleIconWrapper}>
                      {each.menu.icon}
                    </span>

                    {!SidebarContext?.collapse && (
                      <span
                        className={styles.menuText}
                        style={{
                          color: active === each.menu.name ? "#ffffff" : "#141414",
                        }}
                      >
                        {t(each.menu.name)}
                      </span>
                    )}

                  </Button>
                </Popover>
              </div>
            );
          })}
          <div className={styles.iterateItem} style={{ marginTop: "auto" }}>
            <button
              title="BellOutlined"
              onClick={() => { }}
              className={styles.topNavButtons}
              style={{ marginInline: SidebarContext?.collapse ? "auto" : "" }}
            >
              {/* <BellOutlined className={styles.topNavButtonsIcon} /> */}
              <Image
                width={20}
                height={20}
                src={"/assets/bell-icon.png"}
                alt="bell icon"
                unoptimized={true}
                unselectable="off"
                blurDataURL={"/assets/bell_icon.png"}
              />
              {!SidebarContext?.collapse && <span>Notifications</span>}
            </button>
            <Flex gap={16} align={"center"} style={{ marginTop: 12 }}>
              <button
                type="button"
                onClick={showDrawer}
                className={styles.gap}
                id={styles.userButton}
              >
                {"AD"}
              </button>
              {!SidebarContext?.collapse && (
                <span style={{ fontSize: 12 }}>My Account</span>
              )}
            </Flex>

            {/* logout confirm modal  */}
            <ConfirmModal
              openModal={openConfirmationModal}
              setOpenModal={setOpenConfirmationModal}
              onClose={() => {
                setOpenConfirmationModal(false);
                handleLogout();
              }}
              onCancel={() => setOpenConfirmationModal(false)}
            />
            <DrawerComponent
              className={"ow-drawer-on-app-header"}
              onClose={onClose}
              closeIcon={false}
              open={open}
              placement="left"
              footer={
                <div className={styles.signout_button_wrapper}>
                  <ButtonComponent
                    className={styles.signout_button}
                    onClickEvent={() => {
                      if (!formDirty) handleLogout();
                      else {
                        setOpenConfirmationModal(true);
                      }
                    }}
                  >
                    <p className={styles.text_signout}>Sign out</p>
                  </ButtonComponent>
                </div>
              }
            >
              <div className={styles.drawer_container}>
                <div className={styles.drawer}>
                  <p className={styles.mail}>{userDetails?.email}</p>
                  <button onClick={showDrawer} className={styles.profileImg}>
                    {result}
                  </button>
                  <p className={styles.name}>
                    Admin&nbsp;
                    {userDetails?.userName}
                  </p>

                  <ButtonComponent
                    className={styles.acc_settings}
                    type="default"
                    style={{ marginTop: "12px" }}
                  >
                    Manage your account settings
                  </ButtonComponent>
                  <div className={styles.divider}></div>
                  {/* <CollapseComponent
                  className={styles.accordion}
                  accordion={true}
                  expandIconPosition="end"
                  onChange={() => {}}
                  items={[
                    {
                      key: "1",
                      label: "Show more users",
                      children: (
                        <p className={styles.textCenter}>No records found</p>
                      ),
                    },
                  ]}
                /> */}
                  {/* <SelectComponent
                  options={Languages1}
                  style={{ width: "100%", marginTop: 16 }}
                  defaultValue="English"
                  onChange={handleLanguageChange}
                /> */}
                  <Dropdown
                    menu={{
                      items: Languages,
                      onClick: (e) => onSelectLanguage(e),
                    }}
                    trigger={["click"]}
                    arrow={{ pointAtCenter: true }}
                    placement="bottom"
                  // overlayStyle={{width: '100%'}}
                  >
                    <button
                      title="TranslationOutlined"
                      onClick={() => { }}
                      className={styles.dropdown}
                    >
                      <Image
                        src="/assets/world-wide-web.png"
                        alt="world icon"
                        width="20"
                        height="20"
                      />
                      Languages
                    </button>
                  </Dropdown>
                </div>
              </div>
            </DrawerComponent>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
