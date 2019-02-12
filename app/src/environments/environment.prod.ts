export const environment = {
  production: true,
  INSTALLER_VARS: {
    "CREATE_SERVICE": {
      "DEPLOYMENT_TARGETS": {
        "API": {
          "active": true,
          "options": [
            {"label": "AWS API Gateway", "value": "aws_apigateway"},
            {"label": "APIGEE", "value": "gcp_apigee"}
          ]
        },
        "WEBSITE": {
          "active": true,
          "options": [
            {"label": "AWS S3", "value": "aws_s3"},
            {"label": "AWS Cloudfront", "value": "aws_cloudfront"}
          ]
        },
        "FUNCTION": {
          "active": true,
          "options": [
            {"label": "AWS Lambda", "value": "aws_lambda"}
          ]
        }
      }
    },
    "feature": {
      "multi_env": true
    },
    "service_tabs": {
      "overview": true,
      "access_control": false,
      "metrics": true,
      "logs": true,
      "cost": false
    },
    "environment_tabs": {
      "overview": true,
      "deployments": true,
      "code_quality": "{ENABLE_CODEQUALITY_TAB}",
      "logs": true,
      "assets": true
    }
  },
  charachterLimits:{
    eventMaxLength:{
      "stream_name":128,
      "table_name":255,
      "queue_name":80,
      "bucket_name":63
    },
    serviceName:20,
    domainName:20
  },
  servicePatterns:{
    "serviceName":"^[A-Za-z0-9\-]+$",
    "domainName":"^[A-Za-z0-9\-]+$",
    "slackChannel":"^[A-Za-z0-9\-_]+$",
    "streamName":"[a-zA-Z0-9_.-]+",
    "tableName":"^[A-Za-z0-9\-._]+$",
    "queueName":"[A-Za-z0-9_-]+",
    "bucketName":"[a-z0-9-]+"
  },
  configFile: 'config/config.json',
  baseurl: "https://cloud-api.corporate.t-mobile.com/api",
  api_doc_name: 'http://cloud-api-doc.corporate.t-mobile.com',
  envName : "jazz",
  multi_env:false,
  envLists:  {"nodejs8.10": "Nodejs 8.10", "python2.7": "Python 2.7", "python3.6": "Python 3.6", "java8": "Java 8", "go1.x": "Go 1.x"},
  deployment_accounts:[
    {
      "provider": "aws",
      "region": "us-west-2",
      "accountId": "302890901340",
      "primary": true
    }
  ],
  serviceTabs:['overview','access control','metrics','logs'],
  environmentTabs:['overview','deployments','code quality','assets', 'metrics', 'logs','clearwater'],
  awsEventExpression: {
    "dynamodb" :  "arn:aws:dynamodb:us-west-2:302890901340:table/",
    "kinesis" : "arn:aws:kinesis:us-west-2:302890901340:stream/",
    "s3" : "s3:ObjectCreated:*",
    "sqs" : "arn:aws:sqs:us-west-2:302890901340:"
  },
  urls:{
    docs_link: "https://docs.jazz.corporate.t-mobile.com/",
    content_base: "https://docs.jazz.corporate.t-mobile.com/external-content",
    swagger_editor: 'http://editor.cloud-api.corporate.t-mobile.com/?url=',
    swaggerApiUrl: 'https://swagger-lint-ui-DLAB03.dev.px-npe01.cf.t-mobile.com/api-center-of-excellence/v1/swagger-lint',
    clearwaterAppUrl: 'http://flows.corporate.t-mobile.com/'
  },
  clearwater:{
    ntid:"jazz"
  },
  userJourney: {
    registrationMessage: ''
  },
  gaTrackingId: 'UA-121896506-1'
};
