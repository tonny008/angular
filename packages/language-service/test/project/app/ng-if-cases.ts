/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component} from '@angular/core';

@Component({
  template: `
    <div ~{start-implicit}*ngIf="show; let l=unknown"~{end-implicit}>
      Showing now!
    </div>`,
})
export class ShowIf {
  show = false;
}
