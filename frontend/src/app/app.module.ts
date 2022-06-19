import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { EditComponent } from './edit/edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule, } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { HttpClientModule } from '@angular/common/http';
import { WishListEditComponent } from './wish-list-edit/wish-list-edit.component';
import { WishService } from "./services/wish.service";
import { WishEditComponent } from './wish-edit/wish-edit.component';
import { WishListService } from "./services/wish-list.service";
import { UserService } from "./services/user.service";
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from "./app-routing.module";
import { ShareDialogComponent } from './share-dialog/share-dialog.component';
import { WishViewComponent } from './wish-view/wish-view.component';
import { WishListViewComponent } from './wish-list-view/wish-list-view.component';
import { AllSharedComponent } from './all-shared/all-shared.component';
import { ConfigurationService } from "./services/configuration.service";
import { DeleteItemDialogComponent } from './delete-item-dialog/delete-item-dialog.component';
import { NamePartPipe } from './util/name-part.pipe';
import { EditEventDialogComponent } from './edit-event-dialog/edit-event-dialog.component';
import { ViewComponent } from './view/view.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { ErrorHandler } from './error-handler/error-handler.component';
import { WishPropertiesComponent } from './wish-properties/wish-properties.component';
import { WishListDuplicateDialogComponent } from './wish-list-duplicate-dialog/wish-list-duplicate-dialog.component';
import { SelectToggleComponent } from './select-toggle/select-toggle.component';
import { WishMultiColumnComponent } from './wish-multi-column/wish-multi-column.component';
import { WishColumnComponent } from "./wish-multi-column/wish-column.component";
import { WishViewColumnComponent } from "./wish-view-multi-column/wish-view-column.component";
import { WishViewMultiColumnComponent } from "./wish-view-multi-column/wish-view-multi-column.component";
import { FocusDirective } from "./util/focus.directive";

import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { LocalStorageService } from "./services/local-storage.service";
import { ProxyReserveDialogComponent } from './proxy-reserve-dialog/proxy-reserve-dialog.component';
import { DonorViewerComponent } from './donor-viewer/donor-viewer.component';
import { ParticipateDialogComponent } from './participate-dialog/participate-dialog.component';
import { PriceInformationComponent } from './price-information/price-information.component';
import { DonateButtonComponent } from './donate-button/donate-button.component';
import { GroupGiftButtonComponent } from './group-gift-button/group-gift-button.component';
import { SuggestGroupDialogComponent } from './suggest-group-dialog/suggest-group-dialog.component';
import { EuroFormatPipe } from './util/euro-format.pipe';

@NgModule({
    declarations: [
        AppComponent, EditComponent, WishListEditComponent, WishEditComponent, LoginComponent, ShareDialogComponent,
        WishViewComponent, WishListViewComponent, AllSharedComponent, DeleteItemDialogComponent, WishListDuplicateDialogComponent,
        SelectToggleComponent, WishMultiColumnComponent, WishColumnComponent, WishViewColumnComponent, WishViewMultiColumnComponent,
        WishPropertiesComponent, NamePartPipe, EditEventDialogComponent, ViewComponent, ErrorDialogComponent, ErrorHandler, FocusDirective,
        ProxyReserveDialogComponent, DonorViewerComponent, ParticipateDialogComponent, PriceInformationComponent, DonateButtonComponent,
        GroupGiftButtonComponent, SuggestGroupDialogComponent, EuroFormatPipe
    ],
    imports: [
        BrowserModule, HttpClientModule, FormsModule, BrowserAnimationsModule, MatNativeDateModule,
        ReactiveFormsModule, AppRoutingModule, MatListModule, MatDialogModule, MatAutocompleteModule,
        A11yModule,
        CdkStepperModule,
        CdkTableModule,
        CdkTreeModule,
        DragDropModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule, MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule, MatMenuModule, MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatStepperModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule
    ],
    providers: [WishService, WishListService, LocalStorageService, UserService, ConfigurationService, ErrorHandler],
    bootstrap: [AppComponent]
})
export class AppModule {
}
