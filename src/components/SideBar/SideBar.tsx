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
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import styles from './SideBar.module.css';

const { Sider } = Layout;

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/dashboard/customermapping', icon: <UserOutlined />, label: 'Customer Mapping' },
    { key: '/dashboard/productmapping', icon: <ShoppingOutlined />, label: 'Product Mapping' },
    { key: '/dashboard/transactionlog', icon: <FileTextOutlined />, label: 'Transaction Log' },
    { key: '/dashboard/reconciliation', icon: <BarChartOutlined />, label: 'Reconciliation' },
    { key: '/dashboard/exportimport', icon: <ImportOutlined />, label: 'Export / Import' },
    { key: '/dashboard/settings', icon: <SettingOutlined />, label: 'Settings' },
  ];

  return (
    <Sider width={260} className={styles.sidebar}>

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

          <div className={styles.profile}>
            <div className={styles.avatar}>AU</div>

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
    </Sider>
  );
}