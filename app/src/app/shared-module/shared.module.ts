import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationBarComponent} from '../secondary-components/navigation-bar/navigation-bar.component';
import {SearchBoxComponent} from '../primary-components/search-box/search-box.component';
import {JazzToasterComponent} from '../secondary-components/jazz-toaster/jazz-toaster.component';
import {MyFilterPipe} from '../primary-components/custom-filter';
import {BtnPrimaryWithIconComponent} from '../primary-components/btn-primary-with-icon/btn-primary-with-icon.component';
import {JazzHeaderComponent} from '../secondary-components/jazz-header/jazz-header.component';
import {JazzTableComponent} from '../secondary-components/jazz-table/jazz-table.component';
import {TableTemplateComponent} from '../secondary-components/table-template/table-template.component';
import {MobileSecondaryTabComponent} from '../secondary-components/mobile-secondary-tab/mobile-secondary-tab.component';
import {DropdownComponent} from '../primary-components/dropdown/dropdown.component';
import {InputComponent} from '../primary-components/input/input.component';
import {BtnJazzPrimaryComponent} from '../primary-components/btn-jazz-primary/btn-jazz-primary.component';
import {SidebarComponent} from '../secondary-components/sidebar/sidebar.component';
import {OnlyNumber} from '../secondary-components/create-service/onlyNumbers';
import {BtnJazzSecondaryComponent} from '../primary-components/btn-jazz-secondary/btn-jazz-secondary.component';
import {DaterangePickerComponent} from '../primary-components/daterange-picker/daterange-picker.component';
import {FiltersComponent} from '../secondary-components/filters/filters.component';
import {FilterTagsComponent} from '../secondary-components/filter-tags/filter-tags.component';
import {FilterTagsServicesComponent} from '../secondary-components/filter-tags-services/filter-tags-services.component';
import {TabsComponent} from '../primary-components/tabs/tabs.component';
import {JenkinsStatusComponent} from '../pages/jenkins-status/jenkins-status.component';
import {FocusDirective} from '../secondary-components/create-service/focus.directive';
import {JazzMobHeaderComponent} from '../secondary-components/jazz-mob-header/jazz-mob-header.component';
import {ClickOutsideDirective} from '../secondary-components/jazz-header/outside-click';
import {FormsModule} from '@angular/forms';
import {DropdownModule} from 'ng2-dropdown';
import {PopoverModule} from 'ng2-popover';
import {ChartsModule} from 'ng2-charts';
import {BrowserModule} from '@angular/platform-browser'; 
// import {ToasterModule} from 'angular2-toaster';
import {DatePickerModule} from '../primary-components/daterange-picker/ng2-datepicker';
import {MomentModule} from 'angular2-moment';
import {IonRangeSliderModule} from 'ng2-ion-range-slider';
import {LoginComponent} from '../pages/login/login.component';
import {LineGraphComponent} from '../secondary-components/line-graph/line-graph.component';
import {SideTileFixedComponent} from '../secondary-components/side-tile-fixed/side-tile-fixed.component';
import {FooterComponent} from '../secondary-components/footer/footer.component';
import { OverviewSidebarComponent } from './../secondary-components/overview-sidebar/overview-sidebar.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    DatePickerModule,
    MomentModule,
    // ToasterModule,
    PopoverModule,
    ChartsModule,
    IonRangeSliderModule,
  ],
  declarations: [
    BtnJazzPrimaryComponent,
    BtnJazzSecondaryComponent,
    JazzHeaderComponent,
    JazzTableComponent,
    DropdownComponent,
    LoginComponent,
    TabsComponent,
    SidebarComponent,
    InputComponent,
    MyFilterPipe,
    BtnPrimaryWithIconComponent,
    NavigationBarComponent,
    FocusDirective,
    OnlyNumber,
    ClickOutsideDirective,
    FiltersComponent,
    FilterTagsServicesComponent,
    FilterTagsComponent,
    TableTemplateComponent,
    SearchBoxComponent,
    MobileSecondaryTabComponent,
    JazzMobHeaderComponent,
    JazzToasterComponent,
    DaterangePickerComponent,
    JenkinsStatusComponent,
    LineGraphComponent,
    SideTileFixedComponent,
    FooterComponent,
    OverviewSidebarComponent,

  ],
  exports: [
    BtnJazzPrimaryComponent,
    BtnJazzSecondaryComponent,
    JazzHeaderComponent,
    JazzTableComponent,
    DropdownComponent,
    TabsComponent,
    SidebarComponent,
    InputComponent,
    LoginComponent,
    MyFilterPipe,
    BtnPrimaryWithIconComponent,
    NavigationBarComponent,
    FocusDirective,
    OnlyNumber,
    ClickOutsideDirective,
    FiltersComponent,
    TableTemplateComponent,
    SearchBoxComponent,
    MobileSecondaryTabComponent,
    JazzMobHeaderComponent,
    JazzToasterComponent,
    DaterangePickerComponent,
    JenkinsStatusComponent,
    LineGraphComponent,
    FilterTagsServicesComponent,
    FilterTagsComponent,
    SideTileFixedComponent,
    FooterComponent,
    OverviewSidebarComponent,

  ]
})
export class SharedModule {
}
