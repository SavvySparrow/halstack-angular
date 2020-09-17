# DXC Tab Component

## Tab Group Props

<table>
    <tr style="background-color: grey">
        <td>Name</td>
        <td>Default</td>
        <td>Description</td>
    </tr>
    <tr>
        <td>@Input<br>mode: 'filled' | 'underlined'</td>
        <td><code>'filled'</code></td>
        <td>Uses one of the available component modes.</td>
    </tr>
    <tr>
        <td>@Input<br>showDotIndicator: boolean</td>
        <td><code>false</code></td>
        <td>If true, a dot indicator will be shown in the active tab.</td>
    </tr>
    <tr>
        <td>@Input<br>activeTabIndex: number</td>
        <td><code>0</code></td>
        <td>The index of the active tab.</td>
    </tr>
    <tr>
        <td>@Input<br>stepper: boolean</td>
        <td><code>false</code></td>
        <td>If true, the component should be rendered as a Stepper component.</td>
    </tr>
    <tr>
        <td>@Input<br>orientation: 'horizontal' | 'vertical'</td>
        <td><code>'horizontal'</code></td>
        <td>Only if stepper, this parameter shows the stepper orientation.</td>
    </tr>
    <tr>
        <td>@Output<br>activeTabIndexChange: function</td>
        <td></td>
        <td>This event will be triggered when the user clicks on a tab. The index of the clicked tab will be passed as a parameter.</td>
    </tr>
</table>

## Tab Props

<table>
    <tr style="background-color: grey">
        <td>Name</td>
        <td>Default</td>
        <td>Description</td>
    </tr>
    <tr>
        <td>@Input<br>label: string</td>
        <td></td>
        <td>Text to be placed within the tab.</td>
    </tr>
    <tr>
        <td>@Input<br>iconSrc: string</td>
        <td></td>
        <td>The path of an icon to be placed within the tab.</td>
    </tr>
    <tr>
        <td>@Input<br>disabled: boolean</td>
        <td><code>false</code></td>
        <td>Whether the tab is disabled.</td>
    </tr>
</table>

