import { Injectable } from '@angular/core';
import AbstractSettingsService from 'src/app/global/classes/abstract/abstractSettingsService';

@Injectable({
  providedIn: 'root'
})
export class ProkyonSettingsService extends AbstractSettingsService {

  constructor() {
    super();
  }
}
