import { Injectable } from '@angular/core';
import {AdvancedFiltersComponent} from './secondary-components/advanced-filters/advanced-filters.component';

@Injectable()
export class AdvancedFilterService {

  constructor() { }

  getFilterInternal(){
    return AdvancedFilterService;
  }

  getFilterOss(){
    // return AdvancedFilterService;
  }
  
}
