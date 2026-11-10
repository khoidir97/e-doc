"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { AuthUser } from "@/types/auth";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  roles?: number[];
};

const navItems: NavItem[] = [
  // {
  //   icon: <GridIcon />,
  //   name: "Dashboard",
  //   subItems: [{ name: "Ecommerce", path: "/", pro: false }],
  // },
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <GridIcon />,
    name: "Master Dokumen",
    path: "/master-dokumen",
  },
  {
    icon: <ListIcon />,
    name: "Kerangka Acuan Kerja",
    path: "/kerangka-acuan-kerja",
  },
  {
    icon: <PageIcon />,
    name: "Permohonan",
    path: "/permohonan",
  },
  {
    name: "Dokumen",
    icon: <ListIcon />,
    subItems: [

      {
        name: "Survey",
        path: "/survey",
        pro: false
      },
      {
        name: "RAB",
        path: "/rencana-anggaran-biaya",
        pro: false
      },
      {
        name: "HPS",
        path: "/harga-perkiraan-sendiri",
        pro: false
      },

      {
        name: "Penawaran",
        path: "/penawaran",
        pro: false
      },
      {
        name: "Nego",
        path: "/nego",
        pro: false
      },
      {
        name: "Perhitungan Paket",
        path: "/perhitungan-paket",
        pro: false
      },
      {
        name: "Kwitansi",
        path: "/kwitansi",
        pro: false
      },
      {
        name: "Faktur",
        path: "/faktur",
        pro: false
      },
      {
        name: "Nota Pencairan Dana",
        path: "/nota-pencairan-dana",
        pro: false
      },
      {
        name: "Berita Acara",
        path: "/berita-acara",
        pro: false
      }
    ],
  },

  // {
  //   icon: <UserCircleIcon />,
  //   name: "User Profile",
  //   path: "/profile",
  // },

  {
    name: "Master",
    icon: <ListIcon />,
    roles: [0],
    subItems: [
      {
        name: "Perusahaan",
        path: "/perusahaan",
        pro: false
      },
      {
        name: "Pegawai",
        path: "/pegawai",
        pro: false
      },
      {
        name: "Bidang/Bagian",
        path: "/bidang",
        pro: false
      }],
  },
  // {
  //   name: "Tables",
  //   icon: <TableIcon />,
  //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
  // {
  //   name: "Pages",
  //   icon: <PageIcon />,
  //   subItems: [
  //     { name: "Blank Page", path: "/blank", pro: false },
  //     { name: "404 Error", path: "/error-404", pro: false },
  //   ],
  // },
];

// const othersItems: NavItem[] = [
// {
//   icon: <PieChartIcon />,
//   name: "Charts",
//   subItems: [
//     { name: "Line Chart", path: "/line-chart", pro: false },
//     { name: "Bar Chart", path: "/bar-chart", pro: false },
//   ],
// },
// {
//   icon: <BoxCubeIcon />,
//   name: "UI Elements",
//   subItems: [
//     { name: "Alerts", path: "/alerts", pro: false },
//     { name: "Avatar", path: "/avatars", pro: false },
//     { name: "Badge", path: "/badge", pro: false },
//     { name: "Buttons", path: "/buttons", pro: false },
//     { name: "Images", path: "/images", pro: false },
//     { name: "Videos", path: "/videos", pro: false },
//   ],
// },

// ];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (!isMounted || !data) return;
        if (data.success && data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => console.error("Failed to load user in sidebar:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredNavItems = React.useMemo(() => {
    return navItems.filter((item) => {
      if (item.roles && item.roles.length > 0) {
        if (!user) return false;
        return item.roles.includes(user.pgw_role);
      }
      return true;
    });
  }, [user]);

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={` ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? filteredNavItems : [];
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, filteredNavItems]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-indigo-100/70 dark:border-gray-800 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-5 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          } border-b border-indigo-100/60 dark:border-gray-800 mb-2`}
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/30 shrink-0">
            <Image
              src="/images/logo/Logo_lambang_kota_pekanbaru.png"
              alt="Logo Pekanbaru"
              width={28}
              height={32}
              className="h-7 w-auto object-contain"
            />
          </div>
          {isExpanded || isHovered || isMobileOpen ? (
            <span className="text-base font-bold tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
              e-Doc <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">BPKAD</span>
            </span>
          ) : null}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar pt-3">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-3 text-[10px] font-semibold uppercase tracking-widest flex leading-[20px] text-indigo-400/80 dark:text-indigo-400/50 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start pl-1"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>

          </div>
        </nav>

      </div>
    </aside>
  );
};

export default AppSidebar;
