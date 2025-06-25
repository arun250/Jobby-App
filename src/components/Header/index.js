import {IoMdHome} from 'react-icons/io'

import {Redirect, Link, withRouter} from 'react-router-dom'

import {BsBriefcaseFill} from 'react-icons/bs'

import {IoIosLogOut} from 'react-icons/io'

import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogoutButton = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <div>
      <nav className="navbarContainer">
        <Link to="/" className="nav-link">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="navbarLogo"
          />
        </Link>
        <div>
          <ul>
            <Link to="/" className="nav-link">
              <li>
                <IoMdHome className="navbarIcons" />
              </li>
            </Link>
            <Link to="/jobs" className="nav-link">
              <li>
                <BsBriefcaseFill className="navbarIcons" />
              </li>
            </Link>
          </ul>
          <button
            type="button"
            className="logout-mobile-btn"
            onClick={onClickLogoutButton}
          >
            <IoIosLogOut className="logoutIcon" />
          </button>
        </div>
        <ul className="nav-menu">
          <Link to="/" className="nav-link">
            <li className="navMenuItem">Home</li>
          </Link>
          <Link to="/jobs" className="nav-link">
            <li className="navMenuItem">Jobs</li>
          </Link>
        </ul>
        <button
          type="button"
          className="logout-desktop-btn"
          onClick={onClickLogoutButton}
        >
          Logout
        </button>
      </nav>
    </div>
  )
}

export default withRouter(Header)
