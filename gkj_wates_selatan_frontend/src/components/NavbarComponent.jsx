import React from "react";
import { Link } from "react-router-dom";
import logoGKJ from "../assets/logoGKJ.png";

export const NavbarComponent = () => (
  <header>
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{
        height: "80px",
        backgroundColor: "#ecececff",
        position: "sticky", // tetap di atas saat scroll
        top: 0,
        zIndex: 1050, // pastikan muncul di atas konten
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <div className="container-fluid container">
        {/* Logo dan Nama Gereja */}
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
          style={{ fontSize: "1.1rem", fontWeight: "600", color: "#004d99" }}
        >
          <img
            src={logoGKJ}
            alt="Logo GKJ"
            width="60"
            height="60"
            className="d-inline-block align-text-top rounded-circle me-3"
            style={{ objectFit: "cover" }}
          />
          <div className="d-none d-sm-block text-truncate">
            <span className="d-block" style={{ lineHeight: "1.2" }}>
              GEREJA KRISTEN JAWA
            </span>
            <span className="d-block" style={{ lineHeight: "1.2" }}>
              WATES SELATAN
            </span>
          </div>
        </Link>

        {/* Toggler (untuk mobile view) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu navigasi */}
        <div
          className="collapse navbar-collapse"
          id="navbarNavDropdown"
          style={{
            backgroundColor: "#ecececff", // agar menu tetap terlihat jelas
            zIndex: 1050,
            position: "relative",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className="lead nav-link active"
                aria-current="page"
                to="/data"
                style={{ fontSize: "1.1rem" }}
              >
                Data
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="#"
                style={{ fontSize: "1.1rem" }}
              >
                Statistik
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/dataBaru"
                style={{ fontSize: "1.1rem" }}
              >
                Data Baru
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/surat"
                style={{ fontSize: "1.1rem" }}
              >
                Surat
              </Link>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ fontSize: "1.1rem" }}
              >
                Visualisasi
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="#">
                    Organisasi
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="#">
                    Demografi
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ fontSize: "1.1rem" }}
              >
                Hello Jimm :D
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="#">
                    Informasi Admin
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/">
                    Log out
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
);

export const NavbarComponentLogin = () => (
  <header>
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light"
      style={{
        height: "80px",
        position: "sticky",
        top: 0,
        zIndex: 1050,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <div className="container-fluid container-lg">
        <a
          className="navbar-brand d-flex align-items-center"
          href="#"
          style={{ fontSize: "1.1rem", fontWeight: "600", color: "#004d99" }}
        >
          <img
            src={logoGKJ}
            alt="Logo GKJ"
            width="60"
            height="60"
            className="d-inline-block align-text-top rounded-circle me-3 flex-shrink-0"
            style={{ objectFit: "cover" }}
          />
          <div className="d-none d-sm-block text-truncate">
            <span className="d-block" style={{ lineHeight: "1.2" }}>
              GEREJA KRISTEN JAWA
            </span>
            <span className="d-block" style={{ lineHeight: "1.2" }}>
              WATES SELATAN
            </span>
          </div>
          <div className="d-sm-none">
            <span className="d-block" style={{ lineHeight: "1.2" }}>
              GKJ WATES SELATAN
            </span>
          </div>
        </a>
      </div>
    </nav>
  </header>
);
