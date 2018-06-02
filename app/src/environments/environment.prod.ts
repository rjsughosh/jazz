export const environment = {
  production: true,
  configFile: 'config/config.json',
  baseurl: "https://cloud-api.corporate.t-mobile.com/api",
  envName : "jazz",
  multi_env:false,
  serviceTabs:['overview','access control','metrics','logs'],
  environmentTabs:['overview','deployments','code quality','assets','logs'],
  urls: {
    docs_link: 'https://docs.jazz.corporate.t-mobile.com',
    swagger_editor: 'http://editor.cloud-api.corporate.t-mobile.com'
  },
  swaggerLocation: (domain, name, env) => {
    return '/' + domain + '_' + name+ '/' + env +'/swagger.json';
  }
}; 
