import React, { useState, Fragment } from 'react'
import PackageSelect from '../PackageSelect'
import Axios from 'axios'


function GetCustom() {
    const [searchTerm, setSearchTerm] = useState("")
    const [options, setOptions] = useState(null)
    const [disabled, setDisabled] = useState(false)

    const getList = () => {
        const body = {
            "reqURL": searchTerm
        }
        Axios
            .post("http://hackintosh-pkg-api.herokuapp.com/github/availableVersions", { ...body })
            .then(response => {
                setOptions(null)
                formatData(response.data)
            })
            .catch((err) => {
                alert("No repository found! Please enter a valid url")
            })
    }

    function formatData(data = []) {

        data.data.map((d) => {
            d.version.map(y => {
                y.package_name = d.package
                y.label = y.release_version
                y.value = y.release_version
                return y
            })
            return d
        })
        setOptions(data.data)
    }

    const disabledDownloadButton = (value) => {
        setDisabled(value)
    }



    return (
        <Fragment>
            <p>URL Format: https://github.com/:user/:repository</p>
            <div className="custom-search">
                <input type='search' onChange={(e) => setSearchTerm(e.target.value)} placeholder="Example: https://github.com/microsoft/vscode" />
                <button onClick={getList}>
                    Download
                </button>
            </div>
            {options && options.length > 0 && options.map((pkg, index) => {
                return (
                    <Fragment key={index}><PackageSelect name={pkg.package} versionList={pkg.version} disabledDownloadButton={disabledDownloadButton} isDisabled={disabled} /></Fragment>
                )
            })}
        </Fragment>
    )

}

export default GetCustom;