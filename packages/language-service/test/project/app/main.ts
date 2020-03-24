/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import * as ExpressionCases from './expression-cases';
import * as NgForCases from './ng-for-cases';
import * as NgIfCases from './ng-if-cases';
import * as ParsingCases from './parsing-cases';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [
    AppComponent,
    ExpressionCases.ExpectNumericType,
    ExpressionCases.LowercasePipe,
    ExpressionCases.PrivateReference,
    ExpressionCases.WrongFieldReference,
    ExpressionCases.WrongSubFieldReference,
    NgForCases.UnknownEven,
    NgForCases.UnknownPeople,
    NgForCases.UnknownTrackBy,
    NgIfCases.ShowIf,
    ParsingCases.AsyncForUsingComponent,
    ParsingCases.CaseIncompleteOpen,
    ParsingCases.CaseMissingClosing,
    ParsingCases.CaseUnknown,
    ParsingCases.CounterDirective,
    ParsingCases.EmptyInterpolation,
    ParsingCases.HintModel,
    ParsingCases.NoValueAttribute,
    ParsingCases.NumberModel,
    ParsingCases.Pipes,
    ParsingCases.References,
    ParsingCases.StringModel,
    ParsingCases.TemplateReference,
    ParsingCases.TestComponent,
    ParsingCases.WithContextDirective,
  ]
})
export class AppModule {
}

declare function bootstrap(v: any): void;

    bootstrap(AppComponent);
