export const environment = {
  production: false,
  configFile: 'config/config.prod.json',
  baseurl: "https://cloud-api.corporate.t-mobile.com/api",
  envName : "jazz",
  multi_env:false,
  serviceTabs:['overview','access control','metrics','logs'],
  environmentTabs:['overview','deployments','code quality','assets','logs'],
  urls: {
    swagger_editor: 'http://editor.cloud-api.corporate.t-mobile.com',
    service_apis: 'http://cloud-api-doc.corporate.t-mobile.com'
  }
}; 
