
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    const importMap = {
      
        "react": async () => {
          let pkg = await import("__mf__virtual/main_container__prebuild__react__prebuild__.js")
          return pkg
        }
      ,
        "react-dom": async () => {
          let pkg = await import("__mf__virtual/main_container__prebuild__react_mf_2_dom__prebuild__.js")
          return pkg
        }
      ,
        "@mui/material": async () => {
          let pkg = await import("__mf__virtual/main_container__prebuild___mf_0_mui_mf_1_material__prebuild__.js")
          return pkg
        }
      ,
        "react-router-dom": async () => {
          let pkg = await import("__mf__virtual/main_container__prebuild__react_mf_2_router_mf_2_dom__prebuild__.js")
          return pkg
        }
      
    }
      const usedShared = {
      
          "react": {
            name: "react",
            version: "19.1.0",
            scope: ["default"],
            loaded: false,
            from: "main_container",
            async get () {
              usedShared["react"].loaded = true
              const {"react": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^18.2.0"
            }
          }
        ,
          "react-dom": {
            name: "react-dom",
            version: "19.1.0",
            scope: ["default"],
            loaded: false,
            from: "main_container",
            async get () {
              usedShared["react-dom"].loaded = true
              const {"react-dom": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^18.2.0"
            }
          }
        ,
          "@mui/material": {
            name: "@mui/material",
            version: "7.2.0",
            scope: ["default"],
            loaded: false,
            from: "main_container",
            async get () {
              usedShared["@mui/material"].loaded = true
              const {"@mui/material": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^7.0.1"
            }
          }
        ,
          "react-router-dom": {
            name: "react-router-dom",
            version: "6.30.1",
            scope: ["default"],
            loaded: false,
            from: "main_container",
            async get () {
              usedShared["react-router-dom"].loaded = true
              const {"react-router-dom": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^6.30.0"
            }
          }
        
    }
      const usedRemotes = [
      ]
      export {
        usedShared,
        usedRemotes
      }
      