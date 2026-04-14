import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styles from "./MobSideBar.module.css";
import { Menu } from "@/lib/constants/SideMenu";
import { useRouter } from "next/navigation";
import {
  LoaderContext,
  TabTrackContext,
  TranslationContext,
} from "@/lib/interfaces/Context.interfaces";
import { Button, Flex } from "antd";
import Icons from "../SideBar/SideMenuIcons/SideMenuIcons";
import {
  PlusOutlined,
  MinusOutlined,
  RightCircleFilled,
  CloseOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useUserStore } from "@/store/userInfo/store";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { urlList } from "../SideBar/Constants";
export interface MobileMenuProps {
  trackMenu: string[];
  setTrackMenu: Function;
}
function MobileMenu({ setTrackMenu, trackMenu }: MobileMenuProps) {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [selectedSubMenus, setSelectedSubMenus] = useState<string[]>([]);
  const [accessibleModule, setAccessibleModule] = useState<any[]>([]);

  const userDetails = useUserStore((state: any) => JSON.parse(state?.user));

  const handleLogoClick = () => {
    setMenuOpen(!menuOpen);
  };

  const onMenuClick = (item: any) => {
    if (active === item.menu.name) {
      setActive(null);
    } else {
      setActive(item.menu.name);
    }
    setActiveSubMenu(null); // Collapse the sub-menu
  };

  const onSubMenuClick = (sub: string) => {
    if (selectedSubMenus.includes(sub)) {
      setSelectedSubMenus(selectedSubMenus.filter((s) => s !== sub));
    } else {
      setSelectedSubMenus([...selectedSubMenus, sub]);
    }
    setActiveSubMenu(sub);

    setMenuOpen(false);
    setActive(null); // collapse the submenu when we select any submenu
  };

  useEffect(() => {
    // accessPrivilegeList
    setAccessibleModule(userDetails?.accessPrivilegeList);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails?.accessPrivilegeList?.length]);

  // const transformMenu = accessibleModule?.reduce((acc, current) => {
  //   const menuName = current.menu_name;
  //   const formName = current.form_name;

  //   if (!acc.find((menu: any) => menu.name === menuName)) {
  //     acc.push({ name: menuName, sub: [] });
  //   }

  //   acc.find((menu: any) => menu.name === menuName).sub.push(formName);

  //   return acc;
  // }, []);
  const transformMenu = useMemo(() => {
    const menus: any[] = accessibleModule
      ?.filter((module) => module.c_index == 0)
      ?.map((module) => ({
        menu: { name: module.form_name, index: module.p_index },
        sub: [],
      }));
    accessibleModule?.forEach((module: any) => {
      if (module.c_index !== 0 && module.gc_index == 0 && module.type_id == 0) {
        const index = menus.findIndex(
          (menu) => menu.menu.name == module.menu_name
        );
        if (index >= 0)
          menus[index].sub.push({
            name: module.form_name,
            index: module.c_index,
          });
      }
    });
    return menus;
  }, [accessibleModule]);
  console.log("transformMenu1", transformMenu);
  return (
    <>
      <div className={styles.mob_logo} onClick={handleLogoClick}>
        <Image
          width={26}
          height={26}
          src={"/assets/icube_logo.png"}
          alt="icube_logo"
          unoptimized={true}
          unselectable="off"
          blurDataURL={"/assets/icube_logo.png"}
        />
        <Image
          src={"/assets/icube_font.png"}
          alt="icube_font"
          className={styles.icubeFont}
          width={50}
          height={15}
          unselectable="off"
          blurDataURL={"/assets/icube_font.png"}
        />
      </div>

      <div
        className={styles.menu}
      // style={{ height: menuOpen ? "90vh" : "auto" }}
      >
        {menuOpen && (
          <ul>
            {/* {Menu.map((each: any, index: any) => ( */}
            {transformMenu?.map((each: any, index: any) => (
              <li key={index}>
                <Button
                  className={styles.menuBtn}
                  ref={buttonRef}
                  onClick={() => {
                    onMenuClick(each);
                  }}
                >
                  <Icons name={`${each.name}`} />
                  <span className={styles.menuname}>{each.menu.name}</span>
                  {active === each.name ? (
                    <MinusOutlined style={{ marginLeft: "auto" }} />
                  ) : (
                    <PlusOutlined style={{ marginLeft: "auto" }} />
                  )}
                </Button>
                {active === each.menu.name &&
                  each?.sub?.map((sub: any, index: number) => (
                    <Flex
                      key={index}
                      style={{ width: "100%" }}
                      align="center"
                      justify={"space-between"}
                      className={styles.subMenuFlex}
                    >
                      <Link
                        style={{ width: "100%" }}
                        key={index}
                        prefetch={false}
                        href={{
                          pathname: `/dashboard/${urlList?.[each.menu.index]?.[sub.index]?.url}`,
                        }}
                      >
                        <ButtonComponent
                          key={index}
                          onClickEvent={() => {
                            onSubMenuClick(sub);
                          }}
                          className={`${styles.menuBtn} ${styles.subMenuBtn}`}
                        >
                          <p
                            className={styles.menuList}
                            style={{
                              marginLeft: 0,
                              textAlign: "left",
                              width: "100%",
                            }}
                          >
                            <>{sub.name}</>
                          </p>
                        </ButtonComponent>
                      </Link>
                    </Flex>
                  ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default MobileMenu;
