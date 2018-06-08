export const environment = {
  production: false,
  configFile: 'config/config.prod.json',
  baseurl: "https://cloud-api.corporate.t-mobile.com/api",
  envName : "jazz",
  multi_env:false,
  serviceTabs:['overview','access control','metrics','logs'],
  environmentTabs:['overview','deployments','code quality','assets','logs'],
  urls:{
    docs_link:"https://docs.jazz.corporate.t-mobile.com",
    content_base: "https://d35w9xh2k53vcv.cloudfront.net/external-content"
  },
  userJourney: {
    registrationMessage: ''
  }
};
