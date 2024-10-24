import React from "react";
import logo from "../img/bg/logo_bg_r.png";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import "../styles/nav.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Nav({ homeRef, aboutFun, teamFun, productFun, contactFun }) {
  const navigation = [
    { name: "Home", href: "/", current: true },
    { name: "About", href: "about", current: false },
    // { name: "Team", href: "team", current: false },
    // { name: "Service", href: "service", current: false },
    { name: "Project", href: "project", current: false },
    { name: "Products", href: "products", current: false },
    { name: "Gallery", href: "gallery", current: false },
    { name: "Careers", href: "career", current: false },
    { name: "Case Study", href: "casestudy", current: false },
    { name: "Contact", href: "contact", current: false },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const location = useLocation();
  return (
    <>
      <div ref={homeRef}>
        <Disclosure as="nav" className="bg-white">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-12 items-center justify-between">
                  <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                    </Disclosure.Button>
                  </div>
                  <div className="flex flex-1 items-center justify-center md:items-center md:justify-between">
                    <Link to="/">
                      <div className="flex flex-shrink-0 items-center">
                        <img className="block h-11 w-auto lg:hidden logo" src={logo} alt="kst_logo" />
                        <img className="hidden h-12 w-auto lg:block logo" src={logo} alt="kst_logo" />
                      </div>
                    </Link>
                    <div className="hidden md:ml-6 md:block">
                      <div className="flex space-x-4">
                        <ul className="flex text-sm font-medium text-center text-gray-800 border-b border-gray-300">
                          <li className="mr-2">
                            <Link to="/" aria-current="page" className={location.pathname === "/" ? "inline-block p-4 text-blue-700 bg-gray-200 rounded-t-lg active" : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-100"}>
                              Home
                            </Link>
                          </li>
                          <li className="mr-2">
                            <Link to="about" className={location.pathname === "/about" ? "inline-block p-4 text-blue-700 bg-gray-200 rounded-t-lg active" : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-100"}>
                              About
                            </Link>
                          </li>
                          {/* <li className="mr-2">
                            <Link to="team" className={location.pathname === "/team" ? "inline-block p-4 text-blue-700 bg-gray-200 rounded-t-lg active" : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-100"}>
                              Team
                            </Link>
                          </li> */}
                          {/* <li className="mr-2">
                            <Link to="service" className={location.pathname === "/service" ? "inline-block p-4 text-blue-700 bg-gray-200 rounded-t-lg active" : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-100"}>
                              Service
                            </Link>
                          </li> */}
                          <li className="mr-2">
                            <Link to="project" className={location.pathname === "/project/" || location.pathname === "/project/private" ? "inline-block p-4 text-blue-700 bg-gray-200 rounded-t-lg active" : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-100"}>
                              Project
                            </Link>
                          </li>                                          
                          <li className="mr-2">
                            <Link to="products" className={location.pathname === "/products" || location.pathname === "/products" ? "inline-block p-4 text-blue-700 bg-gray-200 rounded-t-lg active" : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-100"}>
                              Products
                            </Link>
                          </li>                            
                          <li className="mr-2">
                            <Link to="career" className={location.pathname === "/career" ? "inline-block p-4 text-blue-700 bg-gray-200 rounded-t-lg active" : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-100"}>
                              Careers
                            </Link>
                          </li>
                          <li className="mr-2">
                            <Link to="casestudy" className={location.pathname === "/casestudy" ? "inline-block p-4 text-blue-700 bg-gray-200 rounded-t-lg active" : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-100"}>
                              Case Study
                            </Link>
                          </li> 
                          <li className="mr-2">
                            <Link to="gallery" className={location.pathname === "/gallery" ? "inline-block p-4 text-blue-700 bg-gray-200 rounded-t-lg active" : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-100"}>
                              Gallery
                            </Link>
                          </li>
                          <li className="mr-2">
                            <Link to="contact" className={location.pathname === "/contact" ? "inline-block p-4 text-blue-700 bg-gray-200 rounded-t-lg active" : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-100"}>
                              Contact
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                  {navigation.map((item) => (
                    <Link key={item.name} to={item.href}>
                      <Disclosure.Button as="a" className={classNames(item.current ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-700 hover:text-white", "block px-3 py-2 rounded-md text-base font-medium")} aria-current={item.current ? "page" : undefined}>
                        {item.name}
                      </Disclosure.Button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <nav className="sub_nav">
          <div className="flex flex-wrap justify-end items-center mx-auto max-w-screen-xl px-2 md:px-2 py-1">
            <div className="flex items-center">
              <a href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=support@kstinfotech.com" rel="noreferrer" target={"_blank"} className="mr-6 text-sm font-medium text-gray-300 hover:underline">
                <i className="bx bxs-envelope text-white"></i>
                <span className="nav_hide">support@kstinfotech.com</span>
              </a>
              <a href="tel:9884818074" className="text-sm font-medium text-gray-300 hover:underline">
                <i className="bx bxs-phone-call text-white"></i>
                <span className="nav_hide">(+91) 9884818074</span>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Nav;
