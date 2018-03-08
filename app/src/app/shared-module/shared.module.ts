import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationBarComponent} from '../secondary-components/navigation-bar/navigation-bar.component';
import {SearchBoxComponent} from '../primary-components/search-box/search-box.component';
import {TmobileToasterComponent} from '../secondary-components/tmobile-toaster/tmobile-toaster.component';
import {MyFilterPipe} from '../primary-components/custom-filter';
import {BtnPrimaryWithIconComponent} from '../primary-components/btn-primary-with-icon/btn-primary-with-icon.component';
import {TmobileHeaderComponent} from '../secondary-components/tmobile-header/tmobile-header.component';
import {TmobileTableComponent} from '../secondary-components/tmobile-table/tmobile-table.component';
import {TableTemplateComponent} from '../secondary-components/table-template/table-template.component';
import {MobileSecondaryTabComponent} from '../secondary-components/mobile-secondary-tab/mobile-secondary-tab.component';
import {DropdownComponent} from '../primary-components/dropdown/dropdown.component';
import {InputComponent} from '../primary-components/input/input.component';
import {BtnTmobilePrimaryComponent} from '../primary-components/btn-tmobile-primary/btn-tmobile-primary.component';
import {SidebarComponent} from '../secondary-components/sidebar/sidebar.component';
import {OnlyNumber} from '../secondary-components/create-service/onlyNumbers';
import {BtnTmobileSecondaryComponent} from '../primary-components/btn-tmobile-secondary/btn-tmobile-secondary.component';
import {DaterangePickerComponent} from '../primary-components/daterange-picker/daterange-picker.component';
import {FiltersComponent} from '../secondary-components/filters/filters.component';
import {FilterTagsComponent} from '../secondary-components/filter-tags/filter-tags.component';
import {FilterTagsServicesComponent} from '../secondary-components/filter-tags-services/filter-tags-services.component';
import {AdvancedFiltersComponent} from './../secondary-components/advanced-filters/advanced-filters.component';
import {TabsComponent} from '../primary-components/tabs/tabs.component';
import {JenkinsStatusComponent} from '../pages/jenkins-status/jenkins-status.component';
import {FocusDirective} from '../secondary-components/create-service/focus.directive';
import {TmobileMobHeaderComponent} from '../secondary-components/tmobile-mob-header/tmobile-mob-header.component';
import {ClickOutsideDirective} from '../secondary-components/tmobile-header/outside-click';
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
    BtnTmobilePrimaryComponent,
    BtnTmobileSecondaryComponent,
    TmobileHeaderComponent,
    TmobileTableComponent,
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
    AdvancedFiltersComponent,
    TableTemplateComponent,
    SearchBoxComponent,
    MobileSecondaryTabComponent,
    TmobileMobHeaderComponent,
    TmobileToasterComponent,
    DaterangePickerComponent,
    JenkinsStatusComponent,
    LineGraphComponent,
    SideTileFixedComponent,
    FooterComponent,
    OverviewSidebarComponent,

  ],
  exports: [
    BtnTmobilePrimaryComponent,
    BtnTmobileSecondaryComponent,
    TmobileHeaderComponent,
    TmobileTableComponent,
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
    TmobileMobHeaderComponent,
    TmobileToasterComponent,
    DaterangePickerComponent,
    JenkinsStatusComponent,
    LineGraphComponent,
    FilterTagsServicesComponent,
    FilterTagsComponent,
    AdvancedFiltersComponent,
    SideTileFixedComponent,
    FooterComponent,
    OverviewSidebarComponent,

  ]
})
export class SharedModule {
}
