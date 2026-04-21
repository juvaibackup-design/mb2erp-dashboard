'use client';

import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  ImportOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  UsergroupAddOutlined,
  InboxOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import styles from './SideBar.module.css';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { useState } from 'react';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import Cookies from 'js-cookie';

const { Sider } = Layout;

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // const menuItems = [
  //   { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  //   { key: '/dashboard/customermapping', icon: <UserOutlined />, label: 'Customer Mapping' },
  //   { key: '/dashboard/productmapping', icon: <ShoppingOutlined />, label: 'Product Mapping' },
  //   { key: '/dashboard/transactionlog', icon: <FileTextOutlined />, label: 'Transaction Log' },
  //   { key: '/dashboard/reconciliation', icon: <BarChartOutlined />, label: 'Reconciliation' },
  //   { key: '/dashboard/exportimport', icon: <ImportOutlined />, label: 'Export / Import' },
  //   { key: '/dashboard/settings', icon: <SettingOutlined />, label: 'Settings' },
  // ];

  const menuItems = [
  { key: '/dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },              // ✅ grid style
  { key: '/dashboard/customermapping', icon: <UsergroupAddOutlined />, label: 'Customer Mapping' }, // ✅ group users
  { key: '/dashboard/productmapping', icon: <InboxOutlined />, label: 'Product Mapping' }, // ✅ box icon
  { key: '/dashboard/transactionlog', icon: <FileTextOutlined />, label: 'Transaction Log' }, // ✅ document icon
  { key: '/dashboard/reconciliation', icon: <BarChartOutlined />, label: 'Reconciliation' }, // ✅ chart
  { key: '/dashboard/exportimport', icon: <UploadOutlined />, label: 'Export / Import' },
  { key: '/dashboard/settings', icon: <SettingOutlined />, label: 'Settings' },
];

  const [openDrawer, setOpenDrawer] = useState(false);

  const handleLogout = () => {
    // clear session
    localStorage.removeItem("user");
    Cookies.remove("token");

    // redirect
    router.push('/');
  };

  return (
    <Sider width={230} className={styles.sidebar}>

      <div className={styles.sidebarInner}>

        {/* 🔝 TOP SECTION */}
        <div className={styles.topSection}>

          {/* Logo */}
          <div className={styles.logo}>
            <div className={styles.logoIcon}>MB</div>

            <div>
              <div className={styles.logoTitle}>MB2ERP</div>
              <div className={styles.logoSub}>Middleware v1.0</div>
            </div>
          </div>

          {/* Menu */}
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            onClick={({ key }) => router.push(key)}
            items={menuItems}
            className={styles.menu}
          />
        </div>

        {/* 🔻 BOTTOM SECTION */}
        <div className={styles.bottomSection}>

          <div
            className={styles.profile}
            onClick={() => setOpenDrawer(true)}
            style={{ cursor: 'pointer' }}
          >            <div className={styles.avatar}>AU</div>

            <div>
              <div className={styles.userName}>Admin User</div>
              <div className={styles.userRole}>Admin</div>
            </div>
          </div>

          <div className={styles.company}>
            <div>CORE Life Hospitality</div>
            <div>Last seen: 2 mins ago</div>
          </div>

        </div>

      </div>

      <DrawerComponent
        title="Profile"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer} closeIcon={undefined} footer={[]}>
        <div style={{ textAlign: 'center' }}>

          <div className={styles.avatar} style={{ margin: 'auto' }}>
            AU
          </div>

          <div style={{ marginTop: 10, fontWeight: 600 }}>
            Admin User
          </div>

          <div style={{ color: '#6b7280', marginBottom: 20 }}>
            admin@corelife.com
          </div>

          <ButtonComponent
            danger
            icon={<LogoutOutlined />}
            onClickEvent={handleLogout}
            style={{ width: '100%' }}
          >
            Logout
          </ButtonComponent>

        </div>
      </DrawerComponent>
    </Sider>
  );
}