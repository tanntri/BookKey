import { Link, Outlet } from "react-router-dom";
import {
  getAllBooksRoute,
  getEditProfileRoute,
  getSignInRoute,
  getSignOutRoute,
  getSignUpRoute,
  getProfileRoute,
  getTradeRoute,
  getPurchaseRoute,
  getRentRoute,
  getBookMarksRoute,
  getBooksReadRoute,
  getLibraryRoute
} from "../../../lib/routes";
import css from "./index.module.scss";
import { useMe } from "../../../lib/ctx";
import { createRef, useState } from "react";
import Logo from "../../../assets/images/logo.svg?react";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import { getAvatarUrl } from "@bookkey/shared/src/cloudinary";
import { DropdownButton } from "../../shared/Dropdown";
import { useNavigate } from 'react-router-dom';

export const layoutContentElRef = createRef<HTMLDivElement>();

export const Layout = () => {
  const me = useMe();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleAvatar = () => setAvatarOpen(!avatarOpen);

  const navigate = useNavigate();

  const logoClicked = () => {
    navigate(getAllBooksRoute());
    // dispatch event for resetting allbookpage to home state when logo or home is clicked
    window.dispatchEvent(new CustomEvent('resetBooksSearch'));
  }
  
  const profileOptions: Record<string, any> = me ? {
    'Account': [
        <Link className={css.link} to={getProfileRoute({ userId: me.id })}>View Profile</Link>,
        <Link className={css.link} to={getEditProfileRoute()}>Edit Profile</Link>,
        <Link className={css.link} to={getSignOutRoute()}>Sign Out ({me?.username})</Link>
    ]
  } : {};
  
  return (
    <div className={css.layout}>
      <div className={css.header}>
        <div className={css.headerMenu}>
          <Logo className={css.logo} onClick={logoClicked} />
          <ul className={css.menuList}>
            <li className={css.item}>
              <Link className={css.link} to={getAllBooksRoute()}>
                Home
              </Link>
            </li>
            <li className={css.item}>
              <Link className={css.link} to={getTradeRoute()}>
                Trade
              </Link>
            </li>
            <li className={css.item}>
              <Link className={css.link} to={getPurchaseRoute()}>
                Buy
              </Link>
            </li>
            <li className={css.item}>
              <Link className={css.link} to={getRentRoute()}>
                Rent
              </Link>
            </li>
          </ul>
          {me ? <div className={css.avatarWrapper}>
            <div className={css.dropdown}>
              {me && <DropdownButton optionsObject={profileOptions} text={<img className={css.avatar} src={getAvatarUrl(me?.avatar, 'small')} alt="" onClick={toggleAvatar} />} />}
            </div>
          </div> : <ul className={css.authMenuList}>
                <li className={css.item}>
                  <Link className={css.link} to={getSignUpRoute()}>
                    Sign Up
                  </Link>
                </li>
                <li className={css.item}>
                  <Link className={css.link} to={getSignInRoute()}>
                    Log In
                  </Link>
                </li>
              </ul>
            }
        </div>
      </div>
      {/* <div className={css.middle} ref={layoutContentElRef}> */}
      <div className={css.middle}>
        <div className={css.navigation}>
          <div className={css.navHeader}>
            <Logo className={css.logo} onClick={logoClicked} />
            <button className={css.hamburger} onClick={toggleMenu}>
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
          <ul className={`${css.menu} ${menuOpen ? css.open : ""}`} onClick={() => menuOpen ? toggleMenu() : null}>
            {me ? (
              <>
                {menuOpen && <li className={css.item}>
                  <Link className={css.link} to={getProfileRoute({ userId: me.id })}>
                    View Profile
                  </Link>
                </li>}
                <li className={css.item}>
                  <Link className={css.link} to={getLibraryRoute({ userId: me.id })}>
                    Library
                  </Link>
                </li>
                <li className={css.item}>
                  <Link className={css.link} to={getBookMarksRoute({ userId: me.id })}>
                    Bookmarks
                  </Link>
                </li>
                <li className={css.item}>
                  <Link className={css.link} to={getBooksReadRoute({ userId: me.id })}>
                    Read
                  </Link>
                </li>
                {menuOpen && <li className={css.item}>
                  <Link className={css.link} to={getEditProfileRoute()}>
                    Edit Profile
                  </Link>
                </li>}
                {menuOpen && <li className={css.item}>
                  <Link className={css.link} to={getSignOutRoute()}>
                    Sign Out ({me.username})
                  </Link>
                </li>}
              </>
            ) : (
              <>
                <li>
                  <Link className={css.link} to={getSignUpRoute()}>
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link className={css.link} to={getSignInRoute()}>
                    Log In
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className={css.content} ref={layoutContentElRef}>
          <Outlet context={me} />
        </div>
      </div>
    </div>
  );
};
