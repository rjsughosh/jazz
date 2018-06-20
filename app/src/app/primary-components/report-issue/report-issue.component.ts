import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthenticationService, MessageService} from '../../core/services';

@Component({
  selector: 'report-issue',
  templateUrl: './report-issue.component.html',
  styleUrls: ['./report-issue.component.scss']
})
export class ReportIssueComponent implements OnInit {

  @Input() request;
  @Input() response;
  @Input() endpoint;


  @Output() onRefresh = new EventEmitter();

  public feedbackModalIn = true;
  public feedbackModalStatus = 'ready';
  public reportIssueForm = {
    userFeedback: '',
  }

  constructor(
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
  }

  reportIssue() {
    let json = {
      'user_reported_issue': '',// this.model.userFeedback,
      'API': this.endpoint,
      'REQUEST': this.request,
      'RESPONSE': this.response,
      'URL': window.location.href,
      'TIME OF ERROR': (new Date()).toISOString(),
      'LOGGED IN USER': this.authenticationService.getUserId()
    }


    // this.openModal = true;
    // this.errorChecked = true;
    // this.isLoading = false;
    // this.errorInclude = JSON.stringify(this.djson);
    // this.sjson = JSON.stringify(this.json);
  }

  mailFeedbackForm() {
    location.href = 'mailto:serverless@t-mobile.com?subject=Jazz : Issue reported by' + ' ' + this.authenticationService.getUserId() + '&body=';
  }

  closeFeedbackModal() {
    this.feedbackModalIn = false;
  }

}
