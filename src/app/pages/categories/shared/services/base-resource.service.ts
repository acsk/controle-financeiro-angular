import { BaseResourceModel } from './../../../../shared/models/base-resource-model';

import { HttpClient } from '@angular/common/http';
import { catchError,  map, Observable, throwError } from 'rxjs';

export abstract class BaseResourceService<T extends BaseResourceModel> {

  constructor() { }
}
