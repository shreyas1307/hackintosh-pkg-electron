import React, { useState, useEffect } from 'react'
import ReactSelect from 'react-select'
import Axios from 'axios';

const PackageSelect = (props) => {
    const { versionList, name } = props
    const [options, setOptions] = useState([])
    const [version, setVersion] = useState(null)
    const [releaseOrDebug, setReleaseOrDebug] = useState(null)
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        setOptions(versionList)
    }, [versionList])

    function downloadPackage() {
        const [versionLabel, notVersionLabel] = ["Release", "Debug"]
        setLoading(true)
        if (version !== null) {
            console.log('here')
            if (version.downloadLink) {
                const [user, repo] = name.split('/')

                return Axios
                    .get(`${version.downloadLink}`,
                        { responseType: "blob" }
                    )
                    .then((response) => {
                        const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = downloadUrl;
                        link.setAttribute('download', `${user}${repo}-${version.release_version}.zip`);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        setLoading(false)
                    })
                    .catch(err => {
                        console.log(err)
                        setLoading(false)
                    })
            } else {
                console.log('here 2')
                const [user, repo] = name.split('/')
                let url = `https://hackintosh-pkg-api.herokuapp.com/github/dataByPackageName`
                let data = {
                    "user": user,
                    "repo": repo,
                    "version": version.release_version
                }
                return Axios.post(url, { ...data })
                    .then((response) => {
                        console.log('Success')
                        let findVersion = new RegExp("(" + versionLabel + ")", "gi")
                        let dontFindNotVersion = new RegExp("(" + notVersionLabel + ")", "gi")

                        let filteredUrl = response.data.data.assets
                            .filter(x => {
                                if (findVersion.test(x.name)) {
                                    return true
                                } else if ((!findVersion.test(x.name)) && (!dontFindNotVersion.test(x.name))) {
                                    return true
                                }
                                return false
                            })
                            .map(x => ({ name: x.name, url: x.browser_download_url }))

                        filteredUrl.forEach(fileURL => {

                            Axios
                                .get(`${fileURL.url}`, { responseType: "blob" })
                                .then(response => {
                                    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
                                    const link = document.createElement('a');
                                    link.href = downloadUrl;
                                    link.setAttribute('download', `${fileURL.name}.zip`); //any other extension
                                    document.body.appendChild(link);
                                    link.click();
                                    link.remove();
                                    setLoading(false)
                                })
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        setLoading(false)
                    })
            }
        }
    }

    return (
        <div className="package-select">
            <div className="check">
                <h4>{name}</h4>
            </div>
            <div className="select">
                <ReactSelect
                    hideSelectedOptions
                    isSearchable
                    isClearable
                    placeholder="Version"
                    menuPlacement="auto"
                    options={options}
                    value={version}
                    onChange={(data) => {
                        setVersion(data)
                    }}
                />
            </div>
            <div className="select-2">
                <ReactSelect
                    hideSelectedOptions
                    isSearchable
                    isClearable
                    isDisabled={version === null ? true : false}
                    placeholder="Release"
                    menuPlacement="auto"
                    options={[{ label: "Release", value: "Release" }, { label: "Debug", value: "Debug" }]}
                    value={releaseOrDebug}
                    onChange={(data) => {
                        setReleaseOrDebug(data)
                    }}
                />
            </div>
            <button onClick={downloadPackage} disabled={version !== null && releaseOrDebug !== null ? false : true}>
                Download
            </button>
        </div>
    )
}

export default PackageSelect
