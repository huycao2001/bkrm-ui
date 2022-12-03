import * as React from "react";
import { useState } from "react";
import { ListItem, Menu, MenuItem } from "@mui/material";

import { Link, Redirect } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { useTheme, makeStyles, createStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  popOverRoot: {
    pointerEvents: "none",
  },
});
export const salesModule = {
  title: "Bán hàng",
  key: "salesModule",
  children: [
    {
      id: 1,
      title: "Bán Hàng",
      key: "Bán Hàng",
      url: "/home/sales/cart",
      //icon:  <Box component="img" sx={{ height: 24, width: 24}} src={cartIcon} style={{marginLeft:-10}} />,
      //iconColor: cartIcon,
      //icon1: icons.ShoppingCartOutlinedIcon,
      //icon2: icons1.ShoppingCartTwoToneIcon,
    },
    {
      id: 2,
      title: "Hóa Đơn",
      key: "Hóa Đơn",
      url: "/home/sales/invoice",
      // icon:  <Box component="img" sx={{ height: 24, width: 24 }} src={invoiceIcon} style={{marginLeft:-10}} />,
      // iconColor: invoiceIcon,
      // icon1: icons.LoyaltyOutlinedIcon,
      // icon2: icons1.LoyaltyTwoToneIcon,
    },
    {
      id: 3,
      title: "Đơn Trả",
      key: "Đơn Trả",
      url: "/home/sales/invoice-return",
      // icon:  <Box component="img" sx={{ height: 24, width: 24}} src={invoiceReturnIcon} style={{marginLeft:-10}}/>,
      // iconColor: invoiceReturnIcon,
      // icon1: icons.RestorePageOutlinedIcon,
      // icon2: icons1.RestorePageTwoToneIcon,
    },
    {
      id: 22,
      title: "Đặt Hàng",
      key: "Đặt Hàng",
      url: "/home/sales/order-list",
      // icon:  <Box component="img" sx={{ height: 24, width: 24}}src={orderListIcon} style={{marginLeft:-10}} />,
      // iconColor: orderListIcon,
      // icon1: icons.AddIcCallOutlinedIcon,
      // icon2: icons1.AddIcCallTwoToneIcon,
    },
  ],
};

export const inventoryModule = {
  title: "Kho Hàng",
  key: "inventoryModule",
  children: [
    {
      id: 4,
      title: "Nhập Hàng",
      key: "Nhập Hàng",
      url: "/home/inventory/import",
      // icon:  <Box component="img" sx={{ height: 24, width: 24 }} src={importIcon} style={{marginLeft:-10}} />,
      // iconColor: importIcon,
      // icon1: icons.AddCircleOutlineOutlinedIcon,
      // icon2: icons1.AddCircleTwoToneIcon,
    },
    {
      id: 5,
      title: "Sản phẩm",
      key: "Sản phẩm",
      url: "/home/inventory/inventory",
      // icon:  <Box component="img" sx={{ height: 24, width: 24 }} src={inventoryIcon} style={{marginLeft:-10}} />,
      // iconColor: inventoryIcon,
      // icon1: icons.ThumbUpAltOutlinedIcon,
      // icon2: icons1.ThumbUpAltTwoToneIcon,
    },
    {
      id: 6,
      title: "Đơn Nhập Hàng",
      key: "Đơn Nhập Hàng",
      url: "/home/inventory/receipt",
      // icon:  <Box component="img" sx={{ height: 24, width: 24 }} src={inventoryOrderIcon} style={{marginLeft:-10}} />,
      // iconColor: inventoryOrderIcon,
      // icon1: icons.LibraryBooksOutlinedIcon,
      // icon2: icons1.LibraryBooksTwoToneIcon,
    },
    {
      id: 7,
      title: "Đơn Trả Hàng Nhập",
      key: "Đơn Trả Hàng Nhập",
      url: "/home/inventory/returns",
      // icon:  <Box component="img" sx={{ height: 24, width: 24 }} src={inventoryReturnOrderIcon} style={{marginLeft:-10}} />,
      // iconColor: inventoryReturnOrderIcon,
      // icon1: icons.SyncProblemOutlinedIcon,
      // icon2: icons1.SyncProblemTwoToneIcon,
    },
    {
      id: 9,
      title: "Đơn chuyển kho",
      key: "Đơn chuyển kho",
      url: "/home/inventory/transfer-inventory",
      // icon:  <Box component="img" sx={{ height: 24, width: 24 }} src={deliveryIcon} style={{marginLeft:-10}} />,
      // iconColor: deliveryIcon,
      // icon1: icons.AddIcCallOutlinedIcon,
      // icon2: icons1.AddIcCallTwoToneIcon,
    },
    {
      id: 11,
      title: "Kiểm Kho",
      key: "Kiểm Kho",
      url: "/home/inventory/check-history",
      // icon:  <Box component="img" sx={{ height: 24, width: 24 }} src={checkIcon} style={{marginLeft:-10}} />,
      // iconColor: checkIcon,
      // icon1: icons.FindInPageOutlinedIcon,
      // icon2: icons1.FindInPageTwoToneIcon,
    },
    {
      id: 12,
      title: "Nhà Cung Cấp",
      key: "Nhà Cung Cấp",
      url: "/home/inventory/supplier",
      // icon:  <Box component="img" sx={{ height: 24, width: 24 }} src={suplierIcon} style={{marginLeft:-10}} />,
      // iconColor: suplierIcon,
      // icon1: icons.ExtensionOutlinedIcon,
      // icon2: icons1.ExtensionTwoToneIcon,
    },
  ],
};

export const hrModule = {
  title: "Nhân Sự",
  key: "hrModule",
  children: [
    {
      id: 14,
      title: "Nhân Viên",
      key: "Nhân Viên",
      url: "/home/hr/employee",
      // icon:  <Box component="img" sx={{ height: 24, width: 24 }} src={employeeIcon} style={{marginLeft:-10}} />,
      // iconColor: employeeIcon,
      // icon1: icons.AccountCircleOutlinedIcon,
      // icon2: icons1.AccountCircleTwoToneIcon,
    },
    {
      id: 15,
      title: "Ca Làm Việc",
      key: "Ca Làm Việc",
      url: "/home/hr/schedule",
      // icon:  <Box component="img" sx={{ height: 24, width: 24 }} src={scheduleIcon} style={{marginLeft:-10}} />,
      // iconColor: scheduleIcon,
      // icon1: icons.EventAvailableOutlinedIcon,
      // icon2: icons1.EventAvailableTwoToneIcon,
    },
  ],
};

export const manageModule = {
  title: "Quản Lý",
  key: "reportModule",

  children: [
    {
      id: 16,
      title: "Lịch Sử Hoạt Động",
      key: "Lịch Sử Hoạt Động",
      url: "/home/manager/history",
      // icon:  <Box component="img" sx={{ height: 24, width: 24 }} src={historyIcon} style={{marginLeft:-10}} />,
      // iconColor: historyIcon,
      // icon1: icons.RestoreOutlinedIcon,
      // icon2: icons1.RestoreTwoToneIcon,
    },
    {
      id: 17,
      title: "Cửa Hàng",
      key: "Cửa Hàng",
      url: "/home/manager/branch",
      // icon:  <Box component="img" sx={{ height: 24, width: 24 }} src={branchIcon} style={{marginLeft:-10}} />,
      // iconColor: branchIcon,
      // icon1: icons.StorefrontOutlinedIcon,
      // icon2: icons1.StorefrontTwoToneIcon,
    },
    {
      id: 18,
      title: "Khách Hàng",
      key: "Khách Hàng",
      url: "/home/manager/customer",
      // icon:  <Box component="img" sx={{ height: 24, width: 24 }} src={customerIcon} style={{marginLeft:-10}} />,
      // iconColor: customerIcon,
      // icon1: icons.FavoriteBorderOutlinedIcon,
      // icon2: icons1.FavoriteTwoToneIcon,
    },
  ],
};

export const settingModule = {
  id: 19,
  title: "Cài đặt",
  key: "Cài đặt",
  url: "/home/manager/setting",
  // icon:  <Box component="img" sx={{ height: 24, width: 24 }} src={settingIcon} style={{marginLeft:-10}} />,
  // // icon: webIcon,
  // iconColor: settingIcon,
  // icon1: icons.LanguageOutlinedIcon,
  // icon2: icons1.LanguageTwoToneIcon,
  children: [
    {
      id: 19.1,
      title: "Cài đặt chung",
      key: "Cài đặt chung",
      url: "/home/manager/setting",
    },
    {
      id: 19.2,
      title: "Khuyến mãi",
      key: "Khuyến mãi",
      url: "/home/manager/setting-discount",
      disabled: false,
    },
    {
      id: 19.3,
      title: "Voucher",
      key: "Voucher",
      url: "/home/manager/setting-voucher",
      disabled: false,
    },
    {
      id: 19.4,
      title: "Mẫu email",
      key: "Mẫu email",
      url: "/home/manager/setting-email",
      disabled: false,
    },
    {
      id: 19.5,
      title: "Trang web",
      key: "Trang web",
      url: "/home/manager/setting-web",
    },
  ],
};

const statModule = {
  id: 20.1,
  title: "Thống Kê",
  title: "Thống Kê",
  url: "/home/manager/end-date-report",
  // icon:  <Box component="img" sx={{ height: 24, width: 24 }} src={statisticIcon} style={{marginLeft:-10}} />,
  // iconColor: statisticIcon,
  // icon1: icons.DonutSmallOutlinedIcon,
  // icon2: icons1.DonutSmallTwoToneIcon,
  children: [
    // { id: 20.1, title: "Tổng quan", url: "/home/manager/report" },
    { id: 20.2, title: "Sổ quỹ", key: "Sổ quỹ", url: "/home/manager/cashbook" },

    // { id: 20.8, title: "Tổng quan", url: "/home/manager/general-report" },
    {
      id: 20.3,
      title: "Báo cáo cuối ngày",
      key: "Báo cáo cuối ngày",
      url: "/home/manager/end-date-report",
    },
    {
      id: 20.9,
      title: "Doanh thu",
      key: "Doanh thu",
      url: "/home/manager/income-report",
    },
    {
      id: 20.4,
      title: "Hàng hoá",
      key: "Hàng hoá",
      url: "/home/manager/product-report",
    },
    {
      id: 20.5,
      title: "Khách hàng",
      key: "Khách hàng",
      url: "/home/manager/customer-report",
    },
    {
      id: 20.6,
      title: "Nhân viên",
      key: "Nhân viên",
      url: "/home/manager/employee-report",
    },
    {
      id: 20.7,
      title: "Nhà cung cấp",
      key: "Nhà cung cấp",
      url: "/home/manager/supplier-report",
    },
    {
      id: 20.1,
      title: "Chi nhánh",
      key: "Chi nhánh",
      url: "/home/manager/branch-report",
    },
    {
      id: 20.11,
      title: "Tài chính (lãi lỗ)",
      key: "Tài chính (lãi lỗ)",
      url: "/home/manager/financial-report",
    },
  ],
};

const ButtonSX = {
  fontWeight: 500,
  px: 4,
  py: 2,
  borderRadius: 0,
  borderBottom: "4px solid transparent",
  transition: "border-color 0.5s",
  "&:hover": {
    borderBottom: "4px solid #2196f3",
  },
};

export default function BasicMenu(props) {
  let currentlyHovering = false;
  const styles = useStyles();
  const section = props.section;
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget); // current target -> when we hover the button, the button will be the target we want to drop our menu from
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  function handleHover() {
    currentlyHovering = true;
  }
  function handleCloseHover() {
    currentlyHovering = false;
    setTimeout(() => {
      if (!currentlyHovering) {
        handleCloseMenu();
      }
    }, 50);
  }
  const theme = useTheme();

  return (
    <Box>
      <Button
        disableRipple
        id="basic-button"
        aria-owns={anchorEl ? "basic-menu" : undefined}
        aria-controls={openMenu ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? "true" : undefined}
        onClick={handleOpenMenu}
        onMouseOver={handleOpenMenu}
        onMouseLeave={handleCloseHover}
        style={{
          color: "black",
          backgroundColor: "transparent",
        }}
        sx={ButtonSX}
        //color = "secondary"
      >
        {section}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        // anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        // transformOrigin={{ vertical: "top", horizontal: "center" }}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        MenuListProps={{
          onMouseEnter: handleHover,
          onMouseLeave: handleCloseHover,
          style: { pointerEvents: "auto" },
        }}
        PopoverClasses={{
          root: styles.popOverRoot,
        }}
        PaperProps={{
          style: {
            width: 250,
          },
        }}
      >
        {/* <MenuItem onClick={handleCloseMenu}>Profile</MenuItem> */}
        {section === "Bán hàng"
          ? salesModule.children.map((item) => (
              <ListItem
                onClick={handleCloseMenu}
                to={item.url}
                component={Link}
                divider={
                  item.id !=
                  salesModule.children.at(salesModule.children.length - 1).id
                    ? true
                    : false
                }
                sx={{
                  "&:hover": {
                    backgroundColor: "#f8f8f8",
                    color: "black",
                  },
                  color: "black",
                }}
              >
                {item.title}
              </ListItem>
            ))
          : section === "Kho hàng"
          ? inventoryModule.children.map((item) => (
              <ListItem
                onClick={handleCloseMenu}
                to={item.url}
                component={Link}
                divider={
                  item.id !=
                  salesModule.children.at(salesModule.children.length - 1).id
                    ? true
                    : false
                }
                sx={{
                  "&:hover": {
                    backgroundColor: "#f8f8f8",
                    color: "black",
                  },
                  color: "black",
                }}
              >
                {item.title}
              </ListItem>
            ))
          : section === "Quản lý"
          ? hrModule.children.map((item) => (
              <ListItem
                onClick={handleCloseMenu}
                to={item.url}
                component={Link}
                divider={
                  item.id !=
                  salesModule.children.at(salesModule.children.length - 1).id
                    ? true
                    : false
                }
                sx={{
                  "&:hover": {
                    backgroundColor: "#f8f8f8",
                    color: "black",
                  },
                  color: "black",
                }}
              >
                {item.title}
              </ListItem>
            ))
          : section === "Cài đặt"
          ? settingModule.children.map((item) => (
              <ListItem
                onClick={handleCloseMenu}
                to={item.url}
                component={Link}
                divider={
                  item.id !=
                  salesModule.children.at(salesModule.children.length - 1).id
                    ? true
                    : false
                }
                sx={{
                  "&:hover": {
                    backgroundColor: "#f8f8f8",
                    color: "black",
                  },
                  color: "black",
                }}
              >
                {item.title}
              </ListItem>
            ))
          : statModule.children.map((item) => (
              <ListItem
                onClick={handleCloseMenu}
                to={item.url}
                component={Link}
                divider={
                  item.id !=
                  salesModule.children.at(salesModule.children.length - 1).id
                    ? true
                    : false
                }
                sx={{
                  "&:hover": {
                    backgroundColor: "#f8f8f8",
                    color: "black",
                  },
                  color: "black",
                }}
              >
                {item.title}
              </ListItem>
            ))}
        {/* <ListItem onClick={handleClose} to = "/signup" component = {Link} >Tổng quan</ListItem> */}
        {/* <ListItem onClick={handleClose}>Sổ quỹ</ListItem> */}
        {/* <Link to={"/home"}> */}
        {/* <MenuItem onClick={handleClose} >Tổng quan</MenuItem> */}
        {/* <option> Tooggo</option>
          <option> Tooggdddo</option>   */}

        {/* </Link> */}

        {/* <MenuItem onClick={handleClose}>Sổ quỹ</MenuItem>
        <MenuItem onClick={handleClose}>Doanh thu</MenuItem> */}
      </Menu>
    </Box>
  );
}
