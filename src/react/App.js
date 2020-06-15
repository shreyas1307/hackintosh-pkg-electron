import React, { Component, Fragment } from 'react';
import Axios from 'axios'
import './App.css';
import { channels } from '../shared/constants'
import PackageSelect from './PackageSelect';
const { ipcRenderer } = window;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appName: '',
      appVersion: '',
      isLoading: true,
      downloadFolder: '',
      packageDivision: [
        { section: "Must Haves", package: "acidanthera/OpenCorePkg", version: [] },
        { section: "Must Haves", package: "acidanthera/VirtualSMC", version: [] },
        { section: "Must Haves", package: "acidanthera/Lilu", version: [] },
        { section: "Graphics", package: "acidanthera/WhateverGreen", version: [] },
        { section: "Audio", package: "acidanthera/AppleALC", version: [] },
        { section: "Ethernet", package: "acidanthera/IntelMausi", version: [] },
        { section: "Ethernet", package: "khronokernel/SmallTree-I211-AT-patch", version: [] },
        { section: "Ethernet", package: "Mieze/AtherosE2200Ethernet", version: [] },
        { section: "Ethernet", package: "Mieze/RTL8111_driver_for_OS_X", version: [] },
        { section: "USB", package: "Sniki/OS-X-USB-Inject-All", version: [] },
        { section: "USB", package: "RehabMan/os-x-usb-inject-all", version: [] },
        { section: "WiFi and Bluetooth", package: "acidanthera/AirportBrcmFixup", version: [] },
        { section: "WiFi and Bluetooth", package: "acidanthera/BrcmPatchRAM", version: [] },
        { section: "AMD CPU Specifics", package: "dortania/XLNCUSBFIX", version: [] },
        { section: "AMD CPU Specifics", package: "dortania/VoodooHDA", version: [] },
        { section: "Extras", package: "RehabMan/VoodooTSCSync", version: [] },
        { section: "Extras", package: "acidanthera/NVMeFix", version: [] },
        { section: "Extras", package: "acidanthera/VoodooPS2", version: [] },
        { section: "Laptop Specifics", package: "VoodooI2C/VoodooI2C", version: [] },
        { section: "Laptop Specifics", package: "al3xtjames/NoTouchID", version: [] },
      ],
    };
  }

  componentDidMount() {
    this.initializeIPCRenderer()
    this.getData()
  }

  getData = () => {
    Axios
      .get('https://hackintosh-pkg-api.herokuapp.com/github/getUpdatedVersions')
      .then(res => this.formatData(res.data.allVersions))
  }

  formatData = (data = []) => {
    let { packageDivision } = this.state

    data.map((d) => {
      d.version.map(y => {
        y.package_name = d.package
        y.label = y.release_version
        y.value = y.release_version
        return y
      })
      let findIndex = packageDivision.findIndex(x => x.package === d.package)
      return packageDivision[findIndex].version = d.version
    })

    this.setState({
      packageDivision: packageDivision,
      isLoading: false
    })

  }

  initializeIPCRenderer = () => {
    ipcRenderer.send(channels.APP_INFO);
    ipcRenderer.on(channels.APP_INFO, (event, arg) => {
      ipcRenderer.removeAllListeners(channels.APP_INFO);
      const { appName, appVersion } = arg;
      this.setState({ appName, appVersion });
    });
  }

  render() {
    const { appName, appVersion, isLoading, packageDivision } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <p>{appName}</p>{" "}
          <button>v{appVersion}</button>
        </header>
        <div>
          <ul>
            <li>Simply select the version from the dropdown for each of the packages</li>
            <li>Click on the Download button next to it to download!</li>
          </ul>
          {/* <h3>For more Information on the below Kexts, visit the OpenCore guide <a href="https://dortania.github.io/OpenCore-Desktop-Guide/ktext.html" target="_blank" rel="noopener noreferrer">here.</a></h3> */}
        </div>
        <div className="App-body">
          {isLoading ? <p>Loading...</p> : (
            <Fragment>
              <h3>Must Haves</h3>
              <div className="package-container">
                {packageDivision.filter(x => x.section === "Must Haves").map((pkg, index) => {
                  return (
                    <Fragment key={index}>
                      <PackageSelect name={pkg.package} versionList={pkg.version} />
                    </Fragment>
                  )
                })}
              </div>

              <h3>Graphics</h3>
              <div className="package-container">
                {packageDivision.filter(x => x.section === "Graphics").map((pkg, index) => {
                  return (
                    <Fragment key={index}>
                      <PackageSelect name={pkg.package} versionList={pkg.version} />
                    </Fragment>
                  )
                })}
              </div>
              <h3>Audio</h3>
              <div className="package-container">
                {packageDivision.filter(x => x.section === "Audio").map((pkg, index) => {
                  return (
                    <Fragment key={index}>
                      <PackageSelect name={pkg.package} versionList={pkg.version} />
                    </Fragment>
                  )
                })}
              </div>
              <h3>Ethernet</h3>
              <div className="package-container">
                {packageDivision.filter(x => x.section === "Ethernet").map((pkg, index) => {
                  return (
                    <Fragment key={index}>
                      <PackageSelect name={pkg.package} versionList={pkg.version} />
                    </Fragment>
                  )
                })}
              </div>
              <h3>USB</h3>
              <div className="package-container">
                {packageDivision.filter(x => x.section === "USB").map((pkg, index) => {
                  return (
                    <Fragment key={index}>
                      <PackageSelect name={pkg.package} versionList={pkg.version} />
                    </Fragment>
                  )
                })}
              </div>
              <h3>WiFi and Bluetooth</h3>
              <div className="package-container">
                {packageDivision.filter(x => x.section === "WiFi and Bluetooth").map((pkg, index) => {
                  return (
                    <Fragment key={index}>
                      <PackageSelect name={pkg.package} versionList={pkg.version} />
                    </Fragment>
                  )
                })}
              </div>
              <h3>AMD CPU Specifics</h3>
              <div className="package-container">
                {packageDivision.filter(x => x.section === "AMD CPU Specifics").map((pkg, index) => {
                  return (
                    <Fragment key={index}>
                      <PackageSelect name={pkg.package} versionList={pkg.version} />
                    </Fragment>
                  )
                })}
              </div>
              <h3>Extras</h3>
              <div className="package-container">
                {packageDivision.filter(x => x.section === "Extras").map((pkg, index) => {
                  return (
                    <Fragment key={index}>
                      <PackageSelect name={pkg.package} versionList={pkg.version} />
                    </Fragment>
                  )
                })}
              </div>
              <h3>Laptop Specifics</h3>
              <div className="package-container">
                {packageDivision.filter(x => x.section === "Laptop Specifics").map((pkg, index) => {
                  return (
                    <Fragment key={index}>
                      <PackageSelect name={pkg.package} versionList={pkg.version} />
                    </Fragment>
                  )
                })}
              </div>
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default App;
