import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'myfilter',
    pure: false
})
export class MyFilterPipe implements PipeTransform {
    
    transform(items: any[], filter: any): any {
        if (!items || !filter || filter.length < 3) {
            if(items !== undefined && items[0])
                {   
                if(items[0].appName)
                    return items;
                else
                    return items.slice(0,50);//limiting number of rows in items for performance
                }
            else
                return items;
        } else if(items.length > 0){            
            if(items[0].appName){
                console.log("a");
                return items.filter(item => item.appName.toLowerCase().indexOf(filter.toLowerCase()) !== -1 );
            }
            if(items[0].heading){
                return items.filter(item => item.heading.toLowerCase().indexOf(filter.toLowerCase()) !== -1 );
            }
            if(items[0].message){
                return items.filter(item => item.message.toLowerCase().indexOf(filter.toLowerCase()) !== -1 || item.location.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
            }
            if(items[0].displayName){
                return items.filter(item => item.givenName.toLowerCase().indexOf(filter.toLowerCase()) !== -1 || item.userId.toLowerCase().indexOf(filter.toLowerCase()) !== -1 || item.displayName.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
            }
                        
        }

        // filter items array, items which match and return true will be kept, false will be filtered out            console.log('type--------------',typeof(items[0]));
        if(typeof(items[0]) == "string"){
            return items.filter(item => item.indexOf(filter) !== -1 );
        }
        else{
            return items.filter(item => item.givenName.indexOf(filter) !== -1 );

        }

        
    }
}
