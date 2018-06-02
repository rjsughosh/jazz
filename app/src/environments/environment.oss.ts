export const environment = {
  production: false,
  configFile: 'config/config.oss.json',
  baseurl: "https://9mkfepwkjh.execute-api.us-east-1.amazonaws.com/prod",
  envName : "oss",
  multi_env:false,
  serviceTabs:['overview','logs'],
  environmentTabs:['overview','logs'],
  urls:{
    docs_link:"https://github.com/tmobile/jazz/wiki",
    swagger_editor: 'http://editor.swagger.io',
  },
  swaggerLocation: (domain, name, env) => {
    return '/' + domain + '/' + name+ '/' + env +'/swagger.json';
  }
};
