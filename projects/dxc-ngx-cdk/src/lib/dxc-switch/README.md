# DXC Switch Component

## Overview

The DXC Switch Component provides to the user the ability to select a true, false or indeterminate value for a field.

## Usage

```html
<dxc-switch
  [(ngModel)]="checked"
  labelPosition="before"
  text="Switch 1"
></dxc-switch>
```

Include the **DxcSwitchModule** into **app.module.ts** to use the Switch component:

```ts
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { DxcSwitchModule } from '@dxc-technology/halstack-angular';

@NgModule({
  declarations: [AppComponent],
  imports: [DxcSwitchModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## API

<table>
    <tr style="background-color: grey">
        <td>Name</td>
        <td>Default</td>
        <td>Description</td>
    </tr>
    <tr>
        <td>@Input<br>checked: boolean</td>
        <td>false</td>
        <td>If true, the component is checked.</td>
    </tr>
    <tr>
        <td>@Input<br>value: any</td>
        <td></td>
        <td>Will be passed to the value attribute of the html input element. When inside a form, this value will be only submitted if the switch is checked </td>
    </tr>
    <tr>
        <td>@Input<br>label: string</td>
        <td></td>
        <td>Text to be placed next to the switch.</td>
    </tr>
    <tr>
        <td>@Input<br>labelPosition: 'before' | 'after'</td>
        <td><code>'before'</code></td>
        <td>Whether the label should appear after or before the switch.</td>
    </tr>
    <tr>
        <td>@Input<br>disabled: boolean</td>
        <td><code>false</code></td>
        <td>If true, the component will be disabled.</td>
    </tr>
    <tr>
        <td>@Input<br>disableRipple: boolean</td>
        <td><code>false</code></td>
        <td>If true, the ripple effect will be disabled.</td>
    </tr>
    <tr>
        <td>@Input<br>required: boolean</td>
        <td><code>false</code></td>
        <td>If true, the component will be marked as required.</td>
    </tr>
    <tr>
        <td>@Input<br>name: string</td>
        <td></td>
        <td>Name attribute of the input element.</td>
    </tr>
    <tr>
        <td>@Output<br>checkedChange: EventEmitter</td>
        <td></td>
        <td>This event will be triggered when the switch changes its value. The new value will be passed as a parameter.</td>
    </tr>
</table>

