export const environment = {
  production: false,
  configFile: 'config/config.oss.json',
  baseurl: "https://{API_GATEWAY_KEY_PROD}.execute-api.{inst_region}.amazonaws.com/prod",
  envName : "oss",
  multi_env:false,
  serviceTabs:['overview','logs'],
  environmentTabs:['overview','logs'],
  urls:{
    docs_link:"https://github.com/tmobile/jazz/wiki",
    swagger_editor: 'http://editor.swagger.io',
  }
};
