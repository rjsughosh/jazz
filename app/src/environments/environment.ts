export const environment = {
  production: false,
  INSTALLER_VARS: {
    "CREATE_SERVICE": {
      "DEPLOYMENT_TARGETS": {
        "API": {
          "active": true,
          "options": [
            {"label": "AWS API Gateway", "value": "aws_apigateway"}
            // {"label": "APIGEE", "value": "gcp_apigee"}
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
  configFile: 'config/config.prod.json',
  baseurl: "https://cloud-api.corporate.t-mobile.com/api",
  api_doc_name: 'http://cloud-api-doc.corporate.t-mobile.com',
  envName: "jazz",
  multi_env: false,
  serviceTabs: ['overview', 'access control', 'metrics', 'logs'],
  environmentTabs: ['overview', 'deployments', 'code quality', 'assets', 'metrics', 'logs', 'clear water'],
  urls: {
    docs_link: "https://docs.jazz.corporate.t-mobile.com",
    content_base: "https://docs.jazz.corporate.t-mobile.com/external-content",
    swagger_editor: 'http://editor.cloud-api.corporate.t-mobile.com/?url=',
    swaggerApiUrl: 'https://swagger-lint-test-DLAB03.dev.px-npe01.cf.t-mobile.com/api-center-of-excellence/v1/swagger-lint'
  },
  userJourney: {
    registrationMessage: ''
  },
  gaTrackingId: ''
};
