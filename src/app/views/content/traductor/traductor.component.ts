import { Component, OnInit, Input } from '@angular/core';

import { StorageService } from '../../../services/storage.service';
import { Balise } from '../../../class/balise';
import { Model } from '../../../class/model';
import { clipboard }  from 'electron';

@Component({
  selector: 'traductor',
  providers: [StorageService],
  styleUrls: [ './traductor.component.scss' ],
  templateUrl: './traductor.component.html'
})
export class TraductorComponent implements OnInit {

  public code: string = '';
  public translation: string = '';
  public translations: Array<string> = [];
  public translationSelected: string = '';
  public datas: Array<any> = [];
  public multiple: boolean = false;
  @Input() models:  any;

  constructor() {
  }

  public ngOnInit() {
    // console.log('hello `Project` component');
  }

  public translate(template: string): void{
    let data = this.models;
    this.datas = [];
    this.translations = [];
    for(let d in data) {
      data[d].build();
      this.datas.push(data[d])
    }
    if(this.multiple){
      
      for(var i = 0; i<this.datas.length; i++){
        try {
          let balise = new Balise('body', template, {
              data: this.datas[i],
              infos: {},
              project: {}
          });
          this.translations.push(balise.content);
        } catch(e){
          this.translations.push('error syntax');
          console.log(e);
          throw e;
        }
      }
    } else {
      try {
        let balise = new Balise('body', template, {
            data: data,
            infos: {},
            project: {}
        });
        this.translation = balise.content;
      } catch(e){
        this.translation = 'error syntax';
        console.log(e);
        throw e;
      }
    }
  }

  public copyToClipboard(string: string) {
    clipboard.writeText(string)
  }
}