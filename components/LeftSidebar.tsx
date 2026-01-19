import { MeQuery, useLogoutMutation } from "@/gen/gql";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Loading from "./Loading";

const LeftSidebar: React.FC<{
  dataIsHereWhen?: boolean;
  user: MeQuery;
}> = ({ dataIsHereWhen }) => {
  const pathname = usePathname();
  const [logout, { client, loading }] = useLogoutMutation();
  const router = useRouter()

  return (
    <>
      <div
        id="left-sidebar"
        data-is-here-when={dataIsHereWhen ? "sm" : "md lg"}
        className="left-sidebar js-pinned-left-sidebar ps-relative"
      >
        <div className="left-sidebar--sticky-container js-sticky-leftnav">
          <nav role="navigation">
            <ol className="nav-links">
              <li
                className={`ps-relative ${
                  pathname.startsWith("/products") ? "youarehere" : ""
                }`}
                aria-current="false"
              >
                <Link href={"/products"} passHref legacyBehavior>
                  <a className="pl8 js-gps-track nav-links--link">
                    <div className="d-flex ai-center">
                      <div className="flex--item truncate">Productos</div>
                    </div>
                  </a>
                </Link>
              </li>

              <li>
                <ol className="nav-links">
                  <li className="fs-fine tt-uppercase ml8 mt16 mb4 fc-light">
                    KARDEX
                  </li>

                  <li
                    className={`ps-relative ${
                      pathname.startsWith("/stocks") ? "youarehere" : ""
                    }`}
                    aria-current={
                      pathname.startsWith("/stocks") ? "true" : "false"
                    }
                  >
                    <Link href="/stocks" passHref legacyBehavior>
                      <a
                        className={`js-gps-track nav-links--link${
                          pathname.startsWith("/stocks") ? " active" : ""
                        }`}
                      >
                        <div className="d-flex ai-center">
                          <div className="flex--item truncate">Stocks</div>
                        </div>
                      </a>
                    </Link>
                  </li>

                  <li
                    className={`ps-relative ${
                      pathname.startsWith("/withdrawals") ? "youarehere" : ""
                    }`}
                    aria-current={
                      pathname.startsWith("/withdrawals") ? "true" : "false"
                    }
                  >
                    <Link href="/withdrawals" passHref legacyBehavior>
                      <a
                        className={`js-gps-track nav-links--link${
                          pathname.startsWith("/withdrawals") ? " active" : ""
                        }`}
                      >
                        <div className="d-flex ai-center">
                          <div className="flex--item truncate">Salidas</div>
                        </div>
                      </a>
                    </Link>
                  </li>

                  <li
                    className={`ps-relative ${
                      pathname.startsWith("/incomes") ? "youarehere" : ""
                    }`}
                    aria-current={
                      pathname.startsWith("/incomes") ? "true" : "false"
                    }
                  >
                    <Link href="/incomes" passHref legacyBehavior>
                      <a
                        className={`js-gps-track nav-links--link${
                          pathname.startsWith("/incomes") ? " active" : ""
                        }`}
                      >
                        <div className="d-flex ai-center">
                          <div className="flex--item truncate">Entradas</div>
                        </div>
                      </a>
                    </Link>
                  </li>

                  <li
                    className={`ps-relative ${
                      pathname.startsWith("/suppliers") ? "youarehere" : ""
                    }`}
                    aria-current={
                      pathname.startsWith("/suppliers") ? "true" : "false"
                    }
                  >
                    <Link href="/suppliers" passHref legacyBehavior>
                      <a
                        className={`js-gps-track nav-links--link${
                          pathname.startsWith("/suppliers") ? " active" : ""
                        }`}
                      >
                        <div className="d-flex ai-center">
                          <div className="flex--item truncate">Proveedores</div>
                        </div>
                      </a>
                    </Link>
                  </li>
                </ol>
              </li>

              <li className={`ps-relative`} aria-current="false">
                <div
                  className="ml8 mt14"
                  onClick={async () => {
                    await logout();
                    await client.resetStore();
                    router.push("/")
                  }}
                >
                  <div className="s-link s-link d-flex fl-grow1 fc-black-400 h:fc-black-600 fs-fine">
                    <div className="flex--item fl-grow1 tt-uppercase fc-black-600 fw-bold">
                      Cerrar Sesión
                    </div>
                    <div className="flex--item px12">
                      {loading ? (
                        <Loading
                          size="16"
                          className="d-flex jc-center ai-center ta-center m0"
                        />
                      ) : (
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          viewBox="0 0 16 16"
                          width="16"
                          height="16"
                          fill="currentColor"
                        >
                          <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
