import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { DxcTableModule, DxcTabsModule,DxcTagModule, DxcChipModule } from "@dxc-technology/halstack-angular";
import { TabbedSectionModule } from "src/app/components/tabbed-section/tabbed-section.module";
import { ExampleViewerModule } from "src/app/components/example-viewer/example-viewer.module";
import { ExampleViewerComponent } from "../../components/example-viewer/example-viewer.component";
import { TabsComponent } from "./tabs.component";
import { TabsTablePropertiesComponent } from "src/app/components/examples/tabs/properties/tabs-table-properties.component";
import { TabsDefaultComponent } from "../../components/examples/tabs/tabs-default/tabs-default.component";
import { TabsExampleComponent } from "../../components/examples/tabs/tabs-example/tabs-example.component";
import { TabsContentComponent } from "../../components/examples/tabs/tabs-content/tabs-content.component";
import { TabsUncontrolledComponent } from '../../components/examples/tabs/tabs-uncontrolled/tabs-uncontrolled.component';
import { TabsImportComponent } from '../../components/examples/tabs/tabs-import/tabs-import.component';
import { CodePlaygroundModule } from '../../components/code-playground/code-playground.module';
import { ComponentsSidenavModule } from '../components-sidenav/components-sidenav.module';
import { TabsThemeComponent } from '../../components/examples/tabs/tabs-theme/tabs-theme.component';
import { TabsApiComponent } from '../../components/examples/tabs/tabs-api/tabs-api.component';
import { ColorPreviewModule } from '../../components/color-preview/color-preview.module';

@NgModule({
  declarations: [
    TabsComponent,
    TabsTablePropertiesComponent,
    TabsDefaultComponent,
    TabsExampleComponent,
    TabsContentComponent,
    TabsUncontrolledComponent,
    TabsImportComponent,
    TabsApiComponent,
    TabsThemeComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    DxcTableModule,
    TabbedSectionModule,
    DxcTabsModule,
    ExampleViewerModule,
    DxcTagModule,
    CodePlaygroundModule,
    ComponentsSidenavModule,
    ColorPreviewModule,
    DxcChipModule
  ],
  exports: [
    TabsComponent,
    TabsTablePropertiesComponent,
    TabsDefaultComponent,
    TabsExampleComponent,
    TabsContentComponent,
    TabsImportComponent,
    TabsApiComponent,
    TabsThemeComponent
  ],
  entryComponents: [ExampleViewerComponent]
})
export class TabsModule {}
